export interface IResult {
  readonly success: boolean;
  readonly error?: string;
  readonly cause?: any;
}

export interface IConnectParams {
  readonly vendorId: number;
  readonly productId: number;
}

export interface IDeviceInformation {
  readonly vendorId: number;
  readonly productId: number;
  readonly productName: string;
}

export interface IConnectionEventHandler {
  connect: (keyboard: IKeyboard) => void;
  disconnect: (keyboard: IKeyboard) => void;
}

export interface IKeycodeInfo {
  code: number;
  name: {
    long: string;
    short: string;
  };
  label: string;
}

export interface IKeycodeCategoryInfo {
  category: string;
  codes: number[];
}

const IKeycodeCategory: { [p: string]: string } = {
  BASIC: 'basic',
  LAYERS: 'layers',
  LIGHTING: 'lighting',
  MACRO: 'macro',
  MEDIA: 'media',
  NUMBER: 'kp',
  SPECIAL: 'special',
} as const;
type IKeycodeCategory = typeof IKeycodeCategory[keyof typeof IKeycodeCategory];

export interface IFetchLayerCountResult extends IResult {
  layerCount?: number;
}

export interface IKeymap {
  isAny: boolean;
  code: number;
  keycodeInfo?: IKeycodeInfo;
}

export interface IFetchKeymapResult extends IResult {
  keymap?: { [pos: string]: IKeymap };
}

export interface IKeyboard {
  getHid(): IHid;
  getInformation(): IDeviceInformation;
  open(): Promise<IResult>;
  isOpened(): boolean;
  enqueue(command: ICommand): Promise<IResult>;
  close(): Promise<void>;
  equals(keyboard: IKeyboard): boolean;
  fetchLayerCount(): Promise<IFetchLayerCountResult>;
  fetchKeymaps(
    layer: number,
    rowCount: number,
    columnCount: number
  ): Promise<IFetchKeymapResult>;
  updateKeymap(
    layer: number,
    row: number,
    column: number,
    code: number
  ): Promise<IResult>;
}

export interface ICommand {
  sendReport(device: any): Promise<void>;
  handleInputReport(data: any): Promise<void>;
}

export interface IConnectResult extends IResult {
  keyboard?: IKeyboard;
}

export interface IHid {
  detectKeyboards(): Promise<IKeyboard[]>;
  setConnectionEventHandler(handler: IConnectionEventHandler): void;
  connect(connectParams?: IConnectParams): Promise<IConnectResult>;
  getKeycodeCandidatesByCategory(category: IKeycodeCategory): IKeycodeInfo[];
  getKeycodeInfo(code: number): IKeycodeInfo | undefined;
}
