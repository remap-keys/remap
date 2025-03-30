/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';
import {
  IKeycodeCompositionFactory,
  IMod,
  IModDirection,
  ISwapHandsOption,
} from './Composition';
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
  code: number; // QMK code
  ascii?: number; // ASCII code if exist
  name: {
    long: string;
    short: string;
  };
  label: string;
  keywords: string[]; // implicit labels: for search keycodes
}

export interface IKeycodeCategoryInfo {
  kinds: KeymapCategory[];
  codes: number[];
}

export const IKeycodeCategory = {
  BASIC: 'basic',
  LAYERS: 'layers',
  DEVICE: 'device',
  MACRO: 'macro',
  FUNCTIONS: 'function',
  SYMBOL: 'symbol',
  SPECIAL: 'special',
  ANY: 'any',
} as const;

export interface IFetchLayerCountResult extends IResult {
  layerCount?: number;
}

export interface IKeymap {
  isAny: boolean;
  isAscii?: boolean;
  code: number;
  unavailable?: boolean;
  kinds: KeymapCategory[];
  direction: IModDirection;
  modifiers: IMod[]; // Modifiers
  option?: number | ISwapHandsOption; // layer, functionID, SwapHand-code
  desc?: string;
  keycodeInfo: IKeycodeInfo; // just kc
}

export type IKeymaps = {
  [pos: string]: IKeymap;
};

export type ICustomKeycode = {
  name: string;
  title: string;
  shortName: string;
  [k: string]: unknown;
};

export const EncoderDirections = {
  clockwise: 'clockwise',
  counterclockwise: 'counterclockwise',
} as const;
export type IEncoderDirection =
  (typeof EncoderDirections)[keyof typeof EncoderDirections];

export type IEncoderKeymap = {
  clockwise: IKeymap;
  counterclockwise: IKeymap;
};

export type IEncoderKeymaps = {
  [id: number]: IEncoderKeymap;
};

export interface IFetchKeymapResult extends IResult {
  keymap?: IKeymaps;
}

export interface IFetchEncodersKeymapsResult extends IResult {
  keymap?: IEncoderKeymaps;
}

export interface IFetchBrightnessResult extends IResult {
  brightness?: number;
}

export interface IFetchBacklightEffectResult extends IResult {
  isBreathing?: boolean;
}

export interface IFetchRGBLightEffectResult extends IResult {
  mode?: number;
}

export interface IFetchRGBLightEffectSpeedResult extends IResult {
  speed?: number;
}

export interface IFetchRGBLightColorResult extends IResult {
  hue?: number;
  sat?: number;
}

export interface IFetchSwitchMatrixStateResult extends IResult {
  state?: Uint8Array;
}

export interface IFetchLayoutOptionsResult extends IResult {
  value?: number;
}

export interface IGetMacroCountResult extends IResult {
  count?: number;
}

export interface IGetMacroBufferSizeResult extends IResult {
  bufferSize?: number;
}

export interface IGetMacroGetBufferResult extends IResult {}

export interface IFetchMacroBufferResult extends IResult {
  buffer?: Uint8Array;
}

export interface IFetchViaProtocolVersionResult extends IResult {
  viaProtocolVersion?: number;
}

export interface IKeyboard {
  getDevice(): HIDDevice;
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
    columnCount: number,
    labelLang: KeyboardLabelLang,
    customKeycodes: ICustomKeycode[] | undefined
  ): Promise<IFetchKeymapResult>;
  fetchEncodersKeymaps(
    layer: number,
    encoderIds: number[],
    labelLang: KeyboardLabelLang,
    customKeycodes: ICustomKeycode[] | undefined
  ): Promise<IFetchEncodersKeymapsResult>;
  updateKeymap(
    layer: number,
    row: number,
    column: number,
    code: number
  ): Promise<IResult>;
  updateEncoderKeymap(
    layer: number,
    encoderId: number,
    clockwise: boolean,
    code: number
  ): Promise<IResult>;
  fetchBacklightBrightness(): Promise<IFetchBrightnessResult>;
  fetchBacklightEffect(): Promise<IFetchBacklightEffectResult>;
  fetchRGBLightBrightness(): Promise<IFetchBrightnessResult>;
  fetchRGBLightEffect(): Promise<IFetchRGBLightEffectResult>;
  fetchRGBLightEffectSpeed(): Promise<IFetchRGBLightEffectSpeedResult>;
  fetchRGBLightColor(): Promise<IFetchRGBLightColorResult>;
  updateBacklightBrightness(brightness: number): Promise<IResult>;
  updateBacklightEffect(isBreathing: boolean): Promise<IResult>;
  updateRGBLightBrightness(brightness: number): Promise<IResult>;
  updateRGBLightEffect(mode: number): Promise<IResult>;
  updateRGBLightEffectSpeed(speed: number): Promise<IResult>;
  updateRGBLightColor(hue: number, sat: number): Promise<IResult>;
  resetDynamicKeymap(): Promise<IResult>;
  storeKeymapPersistentlyForBleMicroPro(): Promise<IResult>;
  fetchSwitchMatrixState(
    rows: number,
    cols: number
  ): Promise<IFetchSwitchMatrixStateResult>;
  fetchLayoutOptions(): Promise<IFetchLayoutOptionsResult>;
  updateLayoutOptions(value: number): Promise<IResult>;
  getMacroCount(): Promise<IGetMacroCountResult>;
  getMacroBufferSize(): Promise<IGetMacroBufferSizeResult>;
  fetchMacroBuffer(bufferSize: number): Promise<IFetchMacroBufferResult>;
  updateMacroBuffer(offset: number, buffer: Uint8Array): Promise<IResult>;
  fetchViaProtocolVersion(): Promise<IFetchViaProtocolVersionResult>;
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
  close(keyboard: IKeyboard): void;
  createKeycodeCompositionFactory(code: number): IKeycodeCompositionFactory;
}
