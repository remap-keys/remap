# services/hid

このパッケージでは、 [WebHID API](https://wicg.github.io/webhid/) を利用したキーボードへのアクセスを行うための処理が提供されます。

対応可能なキーボードは、 [VIA](https://caniusevia.com/) が有効なファームウェアが書き込まれたマイコンを持つキーボードとなります。このパッケージが提供する処理では、 [Raw HID](https://docs.qmk.fm/#/feature_rawhid) を経由して VIA で規定されているバイト列を送受信します。

# 利用手順

このパッケージが提供する機能を利用するために必要となる手順を以下に説明します。

## IHid インスタンスの生成

最初に、 `IHid` インスタンスを生成します。

```ts
const webHid: IHid = new WebHid();
```

## キー割り当て候補に関する処理

キーボードに割り当て可能なキーコードの候補に関する処理手順は以下となります。

### キー割り当て候補の取得

キーボードに割り当て可能なキーの候補を、カテゴリごとに取得します。カテゴリは、 `IKeycodeCategory` で定義されています。

```ts
IKeycodeCategory.BASIC; // Basic
IKeycodeCategory.LAYERS; // Layers
IKeycodeCategory.LIGHTING; // Lighting
IKeycodeCategory.MACRO; // Macro
IKeycodeCategory.MEDIA; // Media
IKeycodeCategory.NUMBER; // Number
IKeycodeCategory.SPECIAL; // Special
```

カテゴリを指定して、キー割り当ての候補を以下の手順で取得します。

```ts
// For Basic
const keycodeInfoArray: IKeycodeInfo[] = webHid.getKeycodeCandidatesByCategory(
  IKeycodeCategory.BASIC
);
keycodeInfoArray.forEach((keycodeInfo: IKeycodeInfo) => {
  const code: number = keycodeInfo.code;
  const shortName: string = keycodeInfo.name.short;
  const longName: string = keycodeInfo.name.long;
  const label: string = keycodeInfo.label;
  // Do something.
});
```

### キーコードからキー割り当て候補の取得

キーコードの値からキー割り当て候補の情報を取得するには、以下の手順を行います。

```ts
const keycode: number = ...;
const keycodeInfo: IKeycodeInfo | undefined = webHid.getKeycodeInfo(keycode);
// Do something.
```

## 接続されたキーボードの取得に関する処理

接続されたキーボードについて、認可や取得、接続イベントなどの処理を行うためには、以下の処理を行います。接続されたキーボードを操作するために、 `IKeyboard` インスタンスを得ることが目的となります。

### 認可済みキーボードの接続/切断イベントハンドラの登録

過去にユーザが認可を行ったキーボードが接続あるいは切断されたことをハンドリングするためのイベントハンドラを登録します。登録手順は以下となります。

```ts
webHid.setConnectionEventHandler({
  // Called when an authorized keyboard was connected.
  connect: (connectedKeyboard: IKeyboard) => {
    // Do something.
  },
  // Called when the authorized keyboard was disconnected.
  disconnect: (disconnectedKeyboard: IKeyboard) => {
    // Do something.
  },
});
```

### 接続されている認可済みキーボード一覧の取得

接続されている認可済みキーボードの一覧を取得するには、以下の手順を行います。

```ts
const keyboardArray: IKeyboard[] = await webHid.detectKeyboards();
// Do something.
```

### 接続された未認可キーボードの認可要求と接続

接続された未認可キーボードに対してユーザに認可を要求するために、以下の手順を行います。

```ts
const result: IConnectResult = await webHid.connect();
if (result.success) {
  const keyboard: IKeyboard = result.keyboard!;
  // Do something.
} else {
  const errorMessage: string = result.error!;
  const cause: any = result.cause!;
  // Do something.
}
```

もし Vendor ID や Product ID がわかっている場合は、以下のように条件を指定して認可要求を行うことも可能です。

```ts
const vendorId: string = ...;
const productId: string = ...;
const result: IConnectResult = await webHid.connect({
  vendorId,
  productId,
});
if (result.success) {
  const keyboard: IKeyboard = result.keyboard!;
  // Do something.
} else {
  const errorMessage: string = result.error!;
  const cause: any = result.cause!;
  // Do something.
}
```

## 接続された認可済みキーボードへの操作

取得した `IKeyboard` オブジェクトに対して処理を呼び出すことで、キーボードから情報を取得したり、キーボードに対して何らかの処理要求を送信することができます。

### 接続された認可済みキーボードのオープン/クローズ

キーボードを操作するためには、最初にオープンする必要があります。また、操作を終了するには、クローズします。オープンとクローズの手順は、以下となります。

```ts
const keyboard: IKeyboard = ...;

// Open
const result = await keyboard.open();
if (result.success) {
  // Do something.
} else {
  const errorMessage: string = result.error!;
  const cause: any = result.cause!;
  // Do something.
}

// Close
await keyboard.close();
```

### 接続された認可済みキーボードの情報取得

取得した `IKeyboard` オブジェクトから、接続されたキーボードの情報を取得することができます。その手順は以下となります。

```ts
const keyboard: IKeyboard = ...;
const info: IDeviceInformation = keyboard.getInformation();
const vendorId: string = info.vendorId;
const productId: string = info.productId;
const productName: string = info.productName;
// Do something.
```

### 接続された認可済みキーボードのレイヤー数の取得

取得した `IKeyboard` オブジェクトから、接続されたキーボードのレイヤー数を取得することができます。その手順は以下となります。

```ts
const keyboard: IKeyboard = ...;
const result = await keyboard.fetchLayerCount();
if (result.success) {
  const layerCount = result.layerCount!;
  // Do something.
} else {
  const errorMessage: string = result.error!;
  const cause: any = result.cause!;
  // Do something.
}
```

### 接続された認可済みキーボードの特定のレイヤーのキー割り当て情報の取得

取得した `IKeyboard` オブジェクトから、接続されたキーボードに対して、指定されたレイヤーのキー割り当て情報を取得することができます。キー割り当て情報は、列と行それぞれにどのキーコードが割り当てられているか、が取得されます。その手順は以下となります。

```ts
const keyboard: IKeyboard = ...;
const layer: number = ...; // Layer number you want
const rowCount: number = ...; // All row count of the keyboard
const columnCount: number = ...; // All column count of the keyboard
const fetchKeymapResult = await keyboard.fetchKeymaps(
  layer,
  rowCount,
  columnCount
);
if (fetchKeymapResult.success) {
  const keymapMap: { [pos: string]: IKeymap } = fetchKeymapResult.keymap!;
  Object.keys(keymapMap).forEach((pos: string) => {
    // pos: ex. "1,2" (this means Row=1, Column=2)
    const keymap: IKeymap = keymapMap[pos];
    const code: number = keymap.code;
    if (keymap.isAny) {
      // Do something.
    } else {
      const keycodeInfo: IKeycodeInfo = keymap.keycodeInfo!;
      const shortName: string = keycodeInfo.name.short;
      const longName: string = keycodeInfo.name.long;
      const label: string = keycodeInfo.label;
      // Do something.
    }
  });
} else {
  const errorMessage: string = result.error!;
  const cause: any = result.cause!;
  // Do something.
}
```
