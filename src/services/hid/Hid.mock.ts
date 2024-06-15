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
  setConnectionEventHandler: (_handler: IConnectionEventHandler) => {},
  connect: (_connectParams?: IConnectParams) => {
    return new Promise((resolve) => {
      const kbd: IKeyboard = {} as IKeyboard;
      resolve({ success: true, keyboard: kbd });
    });
  },
  close: () => {},
  createKeycodeCompositionFactory: (_code: number) => {
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
  isSameDevice: (_target) => {
    return true;
  },
  enqueue: (_command: ICommand) => {
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
    _layer: number,
    _rowCount: number,
    _columnCount: number,
    _labelLang: KeyboardLabelLang
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
    _layer: number,
    _encoderIds: number[],
    _labelLang: KeyboardLabelLang,
    _customKeycodes: ICustomKeycode[] | undefined
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
  updateKeymap: (
    _layer: number,
    _row: number,
    _column: number,
    _code: number
  ) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateEncoderKeymap(
    _layer: number,
    _encoderId: number,
    _clockwise: boolean,
    _code: number
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
  updateBacklightBrightness: (_brightness: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateBacklightEffect: (_isBreathing: boolean) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateRGBLightBrightness: (_brightness: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateRGBLightEffect: (_mode: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateRGBLightEffectSpeed: (_speed: number) => {
    return new Promise((resolve) => {
      resolve({ success: true });
    });
  },
  updateRGBLightColor: (_hue: number, _sat: number) => {
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
  updateLayoutOptions: (_value: number) => {
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
  fetchMacroBuffer: (_bufferSize: number) => {
    return new Promise((resolve) => {
      resolve({ success: true, buffer: new Uint8Array(0) });
    });
  },
  updateMacroBuffer: (_offset: number, _buffer: Uint8Array) => {
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
