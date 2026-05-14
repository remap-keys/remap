# Remap Webapp Minimum Spec (v0)

## 文書情報

- **初版日**: 2026-05-12
- **ステータス**: 設計フェーズ
- **対象**: Remap Webapp（本リポジトリ）
- **ブランチ**: `docs/webapp-minimum-spec`
- **対応 Firmware spec**: `remap-keys/remap_firmware` リポジトリの `remap-docs/specs/2026-05-12-remap-firmware-minimum-spec.md`（同日付）

---

## 1. はじめに

### 1.1 目的

現状の Remap Webapp は、ユーザーがキーボードをカスタマイズするにあたり、**開発者が事前に Firestore へキーボード定義（VIA info.json）を登録しておく必要がある**。本仕様は webapp 側のカウンターパートとして、Firmware spec が提案する HID 経由の VIA info.json 取得をサポートし、**事前登録なしでカスタマイズ可能**にする（プラグアンドプレイ）。

実装の中心は次の 3 つに集約される：

1. WebHID 接続直後に Remap Firmware かどうかを HID 問い合わせで検出する
2. Remap Firmware であれば HID 経由で VIA info.json を取得し、`KeyboardDefinition` を構築する
3. それ以外（VIA キーボード等）は従来の Firestore lookup 経路にフォールバックする

### 1.2 非目的（v0 で扱わないこと）

本仕様 v0 では以下を意図的にスコープ外とする：

- **Remap カタログ画面**（description, images, stores 等）の HID 経由対応
- **Remap 独自情報（`remap.*` namespace）** の取得・解釈
- **動的設定 UI**（Tap-Hold / Combo / Tap Dance 等を webapp から書き込む GUI）
- **Remap Protocol 一本化**（VIA Protocol は引き続き keymap I/O に使用）
- **既存 `IKeyboardDefinitionDocument` 型の再設計**（v0 ではダミー値合成で済ませる）
- **HID プロトコル拡張**（per-key tapping term, macro 領域拡張等）
- **キャッシング / オフラインストレージ**（再接続時の毎回取得を許容）

### 1.3 既存 extensions-design spec との関係

Firmware spec が参照する `2026-04-29-remap-firmware-extensions-design.md`（v1+ 包括設計）に対応する webapp 側の包括設計は未着手であり、本仕様はその v0 切り出し版に相当する。本仕様で除外した項目は将来 v1+ で別 spec として取り込む想定。

---

## 2. 全体アーキテクチャ

### 2.1 Webapp 視点の接続フロー

```
[User]                     [Webapp]                            [Firmware]
  │                            │                                   │
  │── Connect button ─────────→│                                   │
  │                            │── navigator.hid.requestDevice ──→ │
  │                            │←── HIDDevice instance ────────────│
  │                            │                                   │
  │                            │  device.open()  ＊早期 open       │
  │                            │── GET_INFO_BLOB_META ───────────→ │
  │                            │←── meta or timeout ───────────────│
  │                            │                                   │
  │                            │  ┌─ Remap Firmware と判定 ─┐      │
  │                            │  │  GET_INFO_BLOB_CHUNK loop│      │
  │                            │  └→ JSON.parse → adapt      │      │
  │                            │                                   │
  │                            │  ┌─ タイムアウト時 ────────┐      │
  │                            │  │  Firestore lookup        │      │
  │                            │  └→ 既存パス               │      │
  │                            │                                   │
  │←── customize UI ───────────│                                   │
```

### 2.2 v0 の責任分界点

| レイヤ                                          | 責任                                                                             |
| ----------------------------------------------- | -------------------------------------------------------------------------------- |
| **WebHID 層**（`services/hid/`）                | デバイス open、HID コマンド送受信、リクエスト・レスポンス対応付け                |
| **接続フロー層**（`actions/hid.action.ts`）     | 接続シーケンス制御、phase 遷移、Firmware 検出分岐                                |
| **アダプタ層**（新規）                          | VIA info.json → `IKeyboardDefinitionDocument` 合成、欠落フィールドのダミー値埋め |
| **Storage 経路**（`actions/storage.action.ts`） | フォールバック時の Firestore lookup（既存挙動を維持）                            |
| **UI 層**                                       | 取得元（HID / Firestore）を意識せず `KeyboardDefinition` を消費                  |

### 2.3 既存 Firestore 経路との二経路化

本仕様の追加後、webapp は 2 つの取得経路を持つ：

| 経路                       | 適用条件                            | 取得元             |
| -------------------------- | ----------------------------------- | ------------------ |
| **HID 経路（新規）**       | `GET_INFO_BLOB_META` が正常応答する | Firmware Flash     |
| **Firestore 経路（既存）** | HID 経路がタイムアウト／不正応答    | Firebase Firestore |

両経路で得られる `KeyboardDefinition`（`KeyboardDefinitionSchema`）は同一型であり、後段の keymap 編集・カスタマイズ UI には経路の違いが見えない（§6 参照）。

---

## 3. Remap ファームウェア検出

### 3.1 早期 open 戦略

現状の接続フロー（`src/actions/hid.action.ts:230` `connectKeyboard`）は、Firestore lookup を経た後に `openKeyboard()`（`hid.action.ts:275`）内で初めて `keyboard.open()` を呼ぶ。本仕様では、検出のために `keyboard.open()` を **`connectKeyboard` 内に前倒し** する。

理由：

- HID コマンド（`GET_INFO_BLOB_META`）の送信には open 済みデバイスが必須
- Firmware spec §7.1 が規定する判定順序「open → META → 分岐」と整合
- Remap Firmware と Firestore 登録の両方が存在する場合に、Firmware blob を優先する（ユーザーが今書き込んでいるファームに整合した定義を使う）

後段の `openKeyboard()` は既に open 済みのデバイスに対して二重 open しないように、open ガード（`isOpened()` チェック）を追加する。

### 3.2 検出フロー

`connectKeyboard` 内での疑似コード：

```typescript
// src/actions/hid.action.ts
connectKeyboard: (keyboard) => async (dispatch, getState) => {
  // ... existing double-open check and phase update ...

  const openResult = await keyboard.open();
  if (!openResult.success) {
    // Same error handling as before.
    return;
  }

  dispatch(AppActions.updateSetupPhase(SetupPhase.fetchingKeyboardDefinition));

  // (1) Detect Remap Firmware.
  const metaResult = await keyboard.fetchRemapInfoBlobMeta({
    timeoutMs: REMAP_INFO_BLOB_META_TIMEOUT_MS,
  });

  if (metaResult.success) {
    // (2) Remap Firmware: fetch the blob over HID.
    await dispatch(
      hidActionsThunk.loadKeyboardDefinitionFromFirmware(metaResult.meta)
    );
  } else {
    // (3) Non-Remap firmware: fall back to the Firestore lookup path.
    await dispatch(
      storageActionsThunk.fetchKeyboardDefinitionByDeviceInfo(
        keyboard.getInformation().vendorId,
        keyboard.getInformation().productId,
        keyboard.getInformation().productName
      )
    );
  }
};
```

### 3.3 タイムアウト判定基準

`GET_INFO_BLOB_META` のレスポンス待機タイムアウト値（提案）：

| 定数                               | 値         | 根拠                                                                                                           |
| ---------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| `REMAP_INFO_BLOB_META_TIMEOUT_MS`  | **500 ms** | 通常応答は数 ms。500 ms あれば AVR の処理遅延や USB スケジューリングを十分カバー。ユーザー体感としても許容範囲 |
| `REMAP_INFO_BLOB_META_RETRY_COUNT` | **2 回**   | 1 回失敗時のリトライ。USB バス瞬断対策。3 回目以降は Firestore 経路へ                                          |

タイムアウト時の判定：「Remap Firmware ではない」と推定する。判定根拠：

1. 通常 VIA Firmware は `cmd_id = 0xFE` を**サポートしていない**ため無視またはエラー応答
2. 不正な `cmd_id` に対する応答は実装依存だが、本仕様の sub_cmd 構造（`[1] = 0x01`）と一致するレスポンスは事故的にしか起こらない

### 3.4 フォールバック

タイムアウト後の流れ：

1. `metaResult.success === false` で `storageActionsThunk.fetchKeyboardDefinitionByDeviceInfo()` を呼ぶ（**既存挙動と完全一致**）
2. Firestore に登録なし & 未サインインなら `waitingKeyboardDefinitionUpload` phase に遷移（既存挙動）
3. ユーザーが手動で VIA info.json をアップロード可能（既存 UI）

既存フォールバックチェーン（Firestore → 手動アップロード）は壊さない。HID 経路は**先頭に追加される**だけ。

---

## 4. VIA info.json blob の取得

### 4.1 取得フロー

`hidActionsThunk.loadKeyboardDefinitionFromFirmware()`（新規 thunk）の概形：

```typescript
loadKeyboardDefinitionFromFirmware: (meta: IRemapInfoBlobMeta) =>
  async (dispatch, getState) => {
    const { entities } = getState();
    const keyboard = entities.keyboard!;

    // 1. Chunk transfer loop.
    const blob = await fetchInfoBlobChunks(keyboard, meta);
    if (!blob.success) {
      dispatch(
        NotificationActions.addError(
          'Failed to read keyboard definition from firmware.'
        )
      );
      return;
    }

    // 2. UTF-8 decode + JSON parse.
    const jsonStr = new TextDecoder('utf-8').decode(blob.bytes);
    let definition: KeyboardDefinitionSchema;
    try {
      definition = JSON.parse(jsonStr);
    } catch (e) {
      dispatch(
        NotificationActions.addError('Firmware-provided JSON is malformed.')
      );
      return;
    }

    // 3. Reuse the existing VIA info.json schema validation.
    const validateResult = validateKeyboardDefinitionSchema(definition);
    if (!validateResult.valid) {
      dispatch(NotificationActions.addError(validateResult.errors![0].message));
      return;
    }

    // 4. Synthesize IKeyboardDefinitionDocument (see Section 5).
    const document = adaptToKeyboardDefinitionDocument(
      definition,
      keyboard.getInformation()
    );

    dispatch(StorageActions.updateKeyboardDefinitionDocument(document));
    dispatch(StorageActions.updateKeyboardDefinition(definition));
    dispatch(
      LayoutOptionsActions.initSelectedOptions(definition.layouts.labels ?? [])
    );
    dispatch(AppActions.updateSetupPhase(SetupPhase.openingKeyboard));
    await dispatch(hidActionsThunk.openKeyboard());
  };
```

### 4.2 チャンク転送ループ

Firmware spec §6.3 / §6.4 と整合する形でループ実装：

```typescript
async function fetchInfoBlobChunks(
  keyboard: IKeyboard,
  meta: IRemapInfoBlobMeta
): Promise<{ success: boolean; bytes?: Uint8Array }> {
  const buffer = new Uint8Array(meta.totalSize);
  let writeOffset = 0;

  for (let i = 0; i < meta.chunkCount; i++) {
    const chunkResult = await fetchOneChunk(keyboard, i);
    if (!chunkResult.success) {
      return { success: false };
    }
    buffer.set(chunkResult.payload, writeOffset);
    writeOffset += chunkResult.bytesInChunk;
  }

  if (writeOffset !== meta.totalSize) {
    return { success: false };
  }
  return { success: true, bytes: buffer };
}
```

### 4.3 リトライ・タイムアウト

| 定数                                | 値         | 用途                         |
| ----------------------------------- | ---------- | ---------------------------- |
| `REMAP_INFO_BLOB_CHUNK_TIMEOUT_MS`  | **300 ms** | 1 チャンクの応答待ち         |
| `REMAP_INFO_BLOB_CHUNK_RETRY_COUNT` | **2 回**   | チャンク取得失敗時のリトライ |

リトライ後も失敗した場合は全体取得を中断し、エラー通知 + Firestore 経路にフォールバック（または手動アップロード待ち）する。

### 4.4 UTF-8 デコードと JSON parse

- バイト列の連結後、`TextDecoder('utf-8', { fatal: true })` で文字列化
- `JSON.parse` で JS object 化
- 既存 `src/services/storage/Validator.ts` 等の `validateKeyboardDefinitionSchema()` を流用してスキーマ検証

JSON parse / 検証の手順は `src/components/common/keyboarddefformpart/KeyboardDefinitionFormPart.tsx:112` および `src/actions/storage.action.ts:506` と同一であり、HID 経路でも同じユーティリティを共有する。

### 4.5 エラー処理方針

| エラー                                   | 扱い                                        |
| ---------------------------------------- | ------------------------------------------- |
| META 応答タイムアウト                    | Firestore 経路へフォールバック（§3.4）      |
| チャンク応答タイムアウト（リトライ後も） | エラー通知 + Firestore 経路へフォールバック |
| バッファサイズと `total_size` 不一致     | エラー通知 + Firestore 経路へフォールバック |
| UTF-8 デコード失敗                       | エラー通知 + Firestore 経路へフォールバック |
| `JSON.parse` 失敗                        | エラー通知 + Firestore 経路へフォールバック |
| `validateKeyboardDefinitionSchema` 失敗  | エラー通知 + Firestore 経路へフォールバック |

すべて「Firmware 経路を諦めて既存経路に戻す」共通方針。

---

## 5. 既存 `KeyboardDefinition` 型への変換

### 5.1 アダプタの位置付け

HID 経路で取得した VIA info.json（型: `KeyboardDefinitionSchema`）から、後段 UI が依存する `IKeyboardDefinitionDocument`（`src/services/storage/Storage.ts:56-92`）を合成する **アダプタ層**を新設する。配置先（提案）：

- ファイル: `src/services/storage/FirmwareDefinitionAdapter.ts`
- 関数: `adaptToKeyboardDefinitionDocument(schema, deviceInfo): IKeyboardDefinitionDocument`

### 5.2 フィールドマッピング

VIA info.json + USB descriptor で取得できるフィールドを実値で、それ以外はダミー値で埋める：

| `IKeyboardDefinitionDocument` フィールド                 | 取得元                                                  | v0 での値                                                           |
| -------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------- |
| `id`                                                     | 合成                                                    | `'firmware:' + vendorId + ':' + productId` 形式（識別子として一意） |
| `name`                                                   | VIA info.json `name`                                    | 実値                                                                |
| `vendorId`                                               | VIA info.json `vendorId`                                | 実値                                                                |
| `productId`                                              | VIA info.json `productId`                               | 実値                                                                |
| `productName`                                            | `IDeviceInformation.productName`（USB descriptor 由来） | 実値                                                                |
| `json`                                                   | HID から取得した minified JSON                          | 実値                                                                |
| `authorUid`                                              | —                                                       | `''`（空文字）                                                      |
| `authorType`                                             | —                                                       | `'individual'`                                                      |
| `organizationId`                                         | —                                                       | `undefined`                                                         |
| `status`                                                 | —                                                       | `'approved'`（UI 上で「未承認バナー」を出さないため）               |
| `rejectReason`                                           | —                                                       | `undefined`                                                         |
| `githubDisplayName`                                      | —                                                       | `''`                                                                |
| `githubUrl`                                              | —                                                       | `''`                                                                |
| `firmwareCodePlace`                                      | —                                                       | `'qmk'` などのデフォルト                                            |
| `qmkRepositoryFirstPullRequestUrl` ほか証跡系            | —                                                       | `''`                                                                |
| `features`                                               | —                                                       | `[]`                                                                |
| `description` / `additionalDescriptions`                 | —                                                       | `''` / `[]`                                                         |
| `stores` / `websiteUrl`                                  | —                                                       | `[]` / `''`                                                         |
| `thumbnailImageUrl` / `imageUrl` / `subImages`           | —                                                       | `''` / `''` / `[]`                                                  |
| `firmwares`                                              | —                                                       | `[]`                                                                |
| `totalFirmwareDownloadCount` / `totalFirmwareFlashCount` | —                                                       | `0` / `0`                                                           |
| `createdAt` / `updatedAt`                                | —                                                       | `new Date(0)`（Unix epoch、固定値）                                 |

### 5.3 ダミー値選定の方針

- **状態系**は「邪魔にならない値」を優先： `status='approved'` で「未承認警告」を抑止、`rejectReason=undefined` で reject UI を非表示
- **カタログ系**は空文字 / 空配列：UI 側で「説明なし」「画像なし」のとき自然にフォールバックする
- **タイムスタンプ**は Unix epoch：意図的なダミー値であることを明示

ダミー値が UI に表示される箇所（カタログ画面で `description` が空など）は v0 のトレードオフとして許容する。将来 v1+ で source kind ベースの型分離（例: `IKeyboardDefinitionSource = { kind: 'firestore'; doc: IKeyboardDefinitionDocument } | { kind: 'firmware'; minimal: MinimalDefinition }`）に再設計する余地を残す。

### 5.4 UI 側の影響

ダミー値合成によって、既存 UI のうち以下が影響を受ける：

| UI / 機能                            | v0 での挙動                                                                                                                       |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| 未承認キーボード警告バナー           | `status='approved'` なので**出ない**（意図的）                                                                                    |
| GitHub 著者表示                      | `githubDisplayName=''` なので空文字。表示要件次第で「Bundled with firmware」等の表記をフォールバックとして検討（v0 では空のまま） |
| カタログ画面（description / images） | 当該キーボードはカタログに表示されない（HID 経路は Configure 画面のみで使用される前提）                                           |
| 「キーボード定義を編集する」リンク   | 元 Firestore レコードが存在しないので非表示にする（要 UI 側分岐）                                                                 |

v0 では Configure 画面で動作することを最優先とし、上記副作用は受容する。

---

## 6. 既存 Firestore 経路との共存

### 6.1 経路選択ロジック

`connectKeyboard` 内での分岐は §3.2 の通り単純：

1. 早期 `keyboard.open()`
2. `GET_INFO_BLOB_META` 試行
3. 成功 → HID 経路へ／失敗 → Firestore 経路へ

Firestore 登録あり & Remap Firmware の両方が存在する場合、**HID 経路を優先する**。理由：

- ユーザーが書き込んだ Firmware に整合する定義を使うほうが期待動作
- Firmware spec § 1.1 の「事前登録不要」というメッセージングと整合
- Firestore 側が古い / 不整合な定義になっているケースに自動追従できる

将来 v1+ で「ユーザー設定で経路を選ばせる」拡張余地は残す（v0 では非対応）。

### 6.2 統一型扱い

HID 経路と Firestore 経路はいずれも `IKeyboardDefinitionDocument`（合成 or 実体）+ `KeyboardDefinitionSchema` を Redux に dispatch する。後段 UI からは経路の違いが見えない。

Redux state 上の差分は **ない**：

```typescript
StorageActions.updateKeyboardDefinitionDocument(document); // HID 経路: ダミー値埋め
StorageActions.updateKeyboardDefinition(definition); // 同じ
```

### 6.3 後段 UI への透過性

`openKeyboard()`（`hid.action.ts:275`）以降のフロー（layer count 取得、keymap 取得、macro 取得、layout options 復元…）は**変更不要**。すべて `IHid` / `IKeyboard` インターフェース経由で VIA Protocol を叩くだけであり、Firmware が Remap か通常 VIA かに依存しない。

ただし §3.1 で述べたとおり `openKeyboard()` 内の `keyboard.open()` 呼び出しは「既に open 済み」のガードを追加する。

---

## 7. スコープ外（v1 以降に持ち越し）

以下は本仕様 v0 では扱わず、将来 spec で別途設計：

- **`remap.*` namespace の取得・解釈**（schema_version, 拡張ポイント）
- **per-key 拡張情報**（色、回転、ラベル、エンコーダ詳細等）の UI 反映
- **動的設定 GUI**（Tap-Hold / Combo / Tap Dance / Auto Shift / Caps Word 等）
- **VIA Protocol からの完全分離**（Remap Protocol への一本化）
- **HID プロトコル拡張**（per-key tapping term, macro 領域拡張等）
- **バイナリエンコーディング・圧縮**対応
- **HID 経路向けカタログメタデータ**（description, images, stores）の取得
- **source kind による型分離**（`IKeyboardDefinitionDocument` のリファクタ、現状ダミー値合成で済ませる）
- **キャッシング / オフラインストレージ**（再接続時の毎回取得を許容）
- **複数 Remap Firmware バージョン間の互換性 negotiation**（v0 はプロトコル 1 種類のみ）

---

## 8. 既存コードへの影響範囲

### 8.1 追加 / 変更ファイル一覧

| ファイル                                                                   | 種別                 | 主な変更                                                                                                                                       |
| -------------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/services/hid/Hid.ts`                                                  | 変更                 | `IKeyboard` に `fetchRemapInfoBlobMeta()`, `fetchRemapInfoBlobChunk()` 追加。新型 `IRemapInfoBlobMeta`, `IRemapInfoBlobChunk` 追加             |
| `src/services/hid/Commands.ts`                                             | 変更                 | `GetRemapInfoBlobMetaCommand`, `GetRemapInfoBlobChunkCommand` クラス追加（`cmd_id=0xFE`, `sub_cmd=0x01/0x02`）                                 |
| `src/services/hid/WebHid.ts`                                               | 変更                 | `Keyboard` クラスに `fetchRemapInfoBlobMeta()`, `fetchRemapInfoBlobChunk()` 実装                                                               |
| `src/services/storage/FirmwareDefinitionAdapter.ts`                        | 新規                 | `adaptToKeyboardDefinitionDocument(schema, deviceInfo)` 実装                                                                                   |
| `src/actions/hid.action.ts`                                                | 変更                 | `connectKeyboard` 内で早期 open + Firmware 検出分岐。新規 thunk `loadKeyboardDefinitionFromFirmware` 追加。`openKeyboard` 内に二重 open ガード |
| `src/actions/storage.action.ts`                                            | 影響軽微             | 既存 `fetchKeyboardDefinitionByDeviceInfo` は変更不要（フォールバック先として呼ばれる）                                                        |
| `src/store/state.ts`                                                       | 変更なし             | 新 SetupPhase は導入せず、既存 `fetchingKeyboardDefinition` を流用                                                                             |
| `src/components/common/keyboarddefformpart/KeyboardDefinitionFormPart.tsx` | 変更なし             | 手動アップロード経路は維持。今回新設のアダプタとは独立                                                                                         |
| 既存 UI（カタログ画面、未承認警告等）                                      | 必要に応じて分岐追加 | §5.4 参照。「Firmware 提供」を判別したい箇所では `keyboardDefinitionDocument.id.startsWith('firmware:')` を使う（簡易判別）                    |

### 8.2 新規 / 変更する型

```typescript
// Added in src/services/hid/Hid.ts

export interface IRemapInfoBlobMeta {
  totalSize: number; // uint32
  chunkCount: number; // uint16
  chunkSize: number; // uint8 (typically 27)
}

export interface IRemapInfoBlobChunk {
  chunkIdx: number;
  bytesInChunk: number;
  payload: Uint8Array;
}

export interface IFetchRemapInfoBlobMetaResult extends IResult {
  meta?: IRemapInfoBlobMeta;
}

export interface IFetchRemapInfoBlobChunkResult extends IResult {
  chunk?: IRemapInfoBlobChunk;
}

export interface IKeyboard {
  // ... existing methods ...
  fetchRemapInfoBlobMeta(opts: {
    timeoutMs: number;
  }): Promise<IFetchRemapInfoBlobMetaResult>;
  fetchRemapInfoBlobChunk(
    chunkIdx: number,
    opts: { timeoutMs: number }
  ): Promise<IFetchRemapInfoBlobChunkResult>;
}
```

### 8.3 新規定数

```typescript
// Added in src/services/hid/Commands.ts

const id_remap_info_blob = 0xfe; // cmd_id
const id_get_info_blob_meta = 0x01; // sub_cmd
const id_get_info_blob_chunk = 0x02; // sub_cmd

// Added in src/actions/hid.action.ts (or a dedicated constants file)

const REMAP_INFO_BLOB_META_TIMEOUT_MS = 500;
const REMAP_INFO_BLOB_META_RETRY_COUNT = 2;
const REMAP_INFO_BLOB_CHUNK_TIMEOUT_MS = 300;
const REMAP_INFO_BLOB_CHUNK_RETRY_COUNT = 2;
```

### 8.4 テスト方針

- **Commands.ts**: 新コマンドの `createReport` / `createResponse` / `isSameRequest` を単体テスト（リクエスト・レスポンスの 32B バイナリ整合）
- **FirmwareDefinitionAdapter.ts**: 合成結果の各フィールドが意図したダミー値になっていることを単体テスト
- **hid.action.ts**: `connectKeyboard` の HID 経路 / Firestore 経路の二分岐を、`IHid` のモック差し替えで分岐テスト
- **既存テストへの影響**: `openKeyboard` の二重 open ガード変更で既存挙動が壊れていないことを確認

---

## 9. リビジョン履歴

| 日付       | 著者            | 変更内容                                             |
| ---------- | --------------- | ---------------------------------------------------- |
| 2026-05-12 | 洋一郎 / Claude | 初版作成（v0 最小スペック・webapp カウンターパート） |
