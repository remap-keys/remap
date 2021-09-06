# キーボードオープン時

マクロ関連の情報を取得する。

- state.entities.macro.buffer: Uint8Array // バッファ全体のバイト列
- state.entities.macro.maxBufferSize: number // バッファ全体の最大容量
- state.entities.macro.maxCount: number // マクロの最大登録数

# マクロ編集開始（ユーザが M0〜M15 のどれかをクリックした）

バッファから編集対象の MacroKey[] を生成する。

```typescript
// 操作対象のマクロのインデックス
const macroIndex = ...;

// state からバッファとその情報を取得
import {IMacroBuffer, MacroBuffer} from "./Macro";

const buffer = state.entities.macro.buffer;
const maxBufferSize = state.entities.macro.maxBufferSize;
const maxMacroCount = state.entities.macro.maxCount;

// 選択されている言語を取得
const labelLang = state.app.labelLang;

// バイト列から操作対象のマクロの MacroKey[] を生成
const macroBuffer: IMacroBuffer = new MacroBuffer(buffer, maxBufferSize, maxMacroCount);
state.configure.macroEditor.macroBuffer = macroBuffer;
const macros = macroBuffer.generateMacros();
const macro = macros[macroIndex];
state.configure.macroEditor.macro = macro;
const macroKeysResult = macro.generateMacroKeys(labelLang);
if (macroKeysResult.success) {
  const macroKeys = macroKeysResult.macroKeys;
  state.configure.macroEditor.macroKeys = macroKeys;
  // do something on UI.
} else {
  const error = macroKeysResult.error;
  // do something for the error.
}
```

# UI からマクロの内容を変更した時（MacroKey[] の内容が変わった）

最新の MacroKey[] の内容から MacroBuffer 内のバイト列を変更する。

```typescript
// UI での変更が state.configure.macroEditor.macroKeys に反映されている
const macroKeys = state.configure.macroEditor.macroKeys;

// バッファの内容を変更する
const macro = state.configure.macroEditor.macro;
macro.updateMacroKeys(macroKeys);

// 現在のバッファの使用量の取得
const usedMacroBufferSize = state.configure.macroEditor.macroBuffer.getBuffer()
  .length;
// バッファの残量を計算
const maxBufferSize = state.entities.macro.maxBufferSize;
const remainingMacroBufferSize = maxBufferSize - usedMacroBufferSize;
// do something.
```

# UI 上で Save ボタンが押された

バッファの内容を MCU に書き出す。

```typescript
const macroBuffer = state.configure.macroEditor.maxMacroBuffer;
const bytes = macroBuffer.getBytes();

// WebHid#updateMacroBuffer(bytes)

state.entities.macro.buffer = bytes;
```
