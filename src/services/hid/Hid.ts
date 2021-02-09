/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { IKeycodeCompositionFactory, IMod, IModDirection } from './Composition';
import { KeymapCategory } from './KeycodeList';

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
  close: (keyboard: IKeyboard) => void;
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
  categories: KeymapCategory[];
  codes: number[];
}

export const IKeycodeCategory = {
  BASIC: 'basic',
  LAYERS: 'layers',
  LIGHTING: 'lighting',
  MACRO: 'macro',
  MEDIA: 'media',
  NUMBER: 'number',
  SPECIAL: 'special',
  ANY: 'any',
} as const;

export interface IFetchLayerCountResult extends IResult {
  layerCount?: number;
}

export interface IKeymap {
  isAny: boolean;
  code: number;
  categories: KeymapCategory[];
  direction?: IModDirection;
  modifiers?: IMod[]; // Modifiers, layer
  option?: number; // layer, functionID, SwapHand-code
  desc?: string;
  keycodeInfo?: IKeycodeInfo; // just kc
}

export type IKeymaps = {
  [pos: string]: IKeymap;
};

export interface IFetchKeymapResult extends IResult {
  keymap?: IKeymaps;
}

export interface IKeyboard {
  getDevice(): any;
  getHid(): IHid;
  getInformation(): IDeviceInformation;
  open(): Promise<IResult>;
  isOpened(): boolean;
  isSameDevice(target: IKeyboard): boolean;
  enqueue(command: ICommand): Promise<IResult>;
  close(): Promise<void>;
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
  canHandleInputReport(data: any): boolean;
}

export interface IConnectResult extends IResult {
  keyboard?: IKeyboard;
}

export interface IHid {
  detectKeyboards(): Promise<IKeyboard[]>;
  setConnectionEventHandler(handler: IConnectionEventHandler): void;
  connect(connectParams?: IConnectParams): Promise<IConnectResult>;
  getKeymapCandidatesByCategory(category: string): IKeymap[];
  close(keyboard: IKeyboard): void;
  createKeycodeCompositionFactory(code: number): IKeycodeCompositionFactory;
}
