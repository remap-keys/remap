/* eslint-disable no-unused-vars */
import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';
import {
  ICommand,
  IConnectionEventHandler,
  IConnectParams,
  ICustomKeycode,
  IFetchEncodersKeymapsResult,
  IFetchLayoutOptionsResult,
  IFetchViaProtocolVersionResult,
  IHid,
  IKeyboard,
  IResult,
} from './Hid';
import { MOD_LEFT } from './Constraints';

export const IDeviceInformationMock = {
  vendorId: 777,
  productId: 1,
  productName: 'Keybooard Mock',
};

export const IHidMock: IHid = {
  detectKeyboards: () => {
    return new Promise((resolve) => {
      const kbd: IKeyboard = {} as IKeyboard;
      resolve([kbd]);
    });
  },
  setConnectionEventHandler: (handler: IConnectionEventHandler) => {},
  connect: (connectParams?: IConnectParams) => {
    return new Promise((resolve) => {
      const kbd: IKeyboard = {} as IKeyboard;
      resolve({ success: true, keyboard: kbd });
    });
  },
  close: () => {},
  createKeycodeCompositionFactory: (code: number) => {
    return {} as any;
  },
};

export const mockIKeyboad: IKeyboard = {
  getDevice: () => {
    return new HIDDevice();
  },
  getHid: () => {
    return IHidMock;
  },
  getInformation: () => {
    return IDeviceInformationMock;
  },
  open: () => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  isOpened: () => {
    return true;
  },
  isSameDevice: (target) => {
    return true;
  },
  enqueue: (command: ICommand) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  close: () => {
    return new Promise((resolve) => {
      resolve();
    });
  },
  fetchLayerCount: () => {
    return new Promise((resolve) => {
      resolve({ success: true, layerCount: 4 });
    });
  },
  fetchKeymaps: (
    layer: number,
    rowCount: number,
    columnCount: number,
    labelLang: KeyboardLabelLang
  ) => {
    return new Promise((resolve) => {
      resolve({
        success: true,
        keymap: {
          '0,0': {
            isAny: false,
            code: 0,
            kinds: [],
            direction: MOD_LEFT,
            modifiers: [],
            keycodeInfo: {
              code: 0,
              label: 'Mock(0,0)',
              name: {
                short: 'KC_MOCK',
                long: 'KC_MOCK',
              },
              keywords: [],
            },
          },
        },
      });
    });
  },
  fetchEncodersKeymaps(
    layer: number,
    encoderIds: number[],
    labelLang: KeyboardLabelLang,
    customKeycodes: ICustomKeycode[] | undefined
  ): Promise<IFetchEncodersKeymapsResult> {
    return new Promise((resolve) => {
      resolve({
        success: true,
        keymap: {
          0: {
            clockwise: {
              isAny: false,
              code: 0,
              kinds: [],
              direction: MOD_LEFT,
              modifiers: [],
              keycodeInfo: {
                code: 0,
                label: 'Mock(0,0)',
                name: {
                  short: 'KC_MOCK',
                  long: 'KC_MOCK',
                },
                keywords: [],
              },
            },
            counterclockwise: {
              isAny: false,
              code: 0,
              kinds: [],
              direction: MOD_LEFT,
              modifiers: [],
              keycodeInfo: {
                code: 0,
                label: 'Mock(0,0)',
                name: {
                  short: 'KC_MOCK',
                  long: 'KC_MOCK',
                },
                keywords: [],
              },
            },
          },
        },
      });
    });
  },
  updateKeymap: (ayer: number, row: number, column: number, code: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateEncoderKeymap(
    layer: number,
    encoderId: number,
    clockwise: boolean,
    code: number
  ): Promise<IResult> {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  fetchBacklightBrightness: () => {
    return new Promise((resolve) => {
      resolve({ success: true, brightness: 100 });
    });
  },
  fetchBacklightEffect: () => {
    return new Promise((resolve) => {
      resolve({ success: true, isBreathing: true });
    });
  },
  fetchRGBLightBrightness: () => {
    return new Promise((resolve) => {
      resolve({ success: true, brightness: 100 });
    });
  },
  fetchRGBLightEffect: () => {
    return new Promise((resolve) => {
      resolve({ success: true, mode: 3 });
    });
  },
  fetchRGBLightEffectSpeed: () => {
    return new Promise((resolve) => {
      resolve({ success: true, speed: 1 });
    });
  },
  fetchRGBLightColor: () => {
    return new Promise((resolve) => {
      resolve({ success: true, hue: 200, sat: 111 });
    });
  },
  updateBacklightBrightness: (brightness: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateBacklightEffect: (isBreathing: boolean) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateRGBLightBrightness: (brightness: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateRGBLightEffect: (mode: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateRGBLightEffectSpeed: (speed: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateRGBLightColor: (hue: number, sat: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  resetDynamicKeymap: () => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  storeKeymapPersistentlyForBleMicroPro: (): Promise<IResult> => {
    return new Promise<IResult>((resolve) => {
      resolve({ success: true });
    });
  },
  fetchSwitchMatrixState: () => {
    return new Promise<IResult>((resolve) => {
      resolve({ success: true });
    });
  },
  fetchLayoutOptions: () => {
    return new Promise<IFetchLayoutOptionsResult>((resolve) => {
      resolve({ success: true, value: 0 });
    });
  },
  updateLayoutOptions: (value: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  getMacroCount: () => {
    return new Promise((resolve) => {
      resolve({ success: true, count: 0 });
    });
  },
  getMacroBufferSize: () => {
    return new Promise((resolve) => {
      resolve({ success: true, bufferSize: 0 });
    });
  },
  fetchMacroBuffer: (bufferSize: number) => {
    return new Promise((resolve) => {
      resolve({ success: true, buffer: new Uint8Array(0) });
    });
  },
  updateMacroBuffer: (offset: number, buffer: Uint8Array) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  fetchViaProtocolVersion(): Promise<IFetchViaProtocolVersionResult> {
    return new Promise((resolve) => {
      resolve({ success: true, viaProtocolVersion: 0x0a });
    });
  },
};
