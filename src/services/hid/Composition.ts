import { IKeycodeCategoryInfo, IKeycodeInfo, IKeymap } from './Hid';
import { hexadecimal } from '../../utils/StringUtils';

import {
  KEY_CATEGORY_ASCII,
  KEY_SUB_CATEGORY_APPLICATION,
  KEY_SUB_CATEGORY_BACKLIGHT,
  KEY_SUB_CATEGORY_BLANK,
  KEY_SUB_CATEGORY_BOOTMAGIC,
  KEY_SUB_CATEGORY_COMBO,
  KEY_SUB_CATEGORY_COMMAND,
  KEY_SUB_CATEGORY_DEVICE,
  KEY_SUB_CATEGORY_EDIT,
  KEY_SUB_CATEGORY_EMBED_FUNCTION,
  KEY_SUB_CATEGORY_F,
  KEY_SUB_CATEGORY_GRAVE_ESCAPE,
  KEY_SUB_CATEGORY_GUI,
  KEY_SUB_CATEGORY_INTERNATIONAL,
  KEY_SUB_CATEGORY_KEYBOARD,
  KEY_SUB_CATEGORY_LANGUAGE,
  KEY_SUB_CATEGORY_LETTER,
  KEY_SUB_CATEGORY_LOCK,
  KEY_SUB_CATEGORY_MACRO,
  KEY_SUB_CATEGORY_MEDIA,
  KEY_SUB_CATEGORY_MIDI,
  KEY_SUB_CATEGORY_MODIFIER,
  KEY_SUB_CATEGORY_MOUSE,
  KEY_SUB_CATEGORY_MOVE,
  KEY_SUB_CATEGORY_NUMBER,
  KEY_SUB_CATEGORY_NUMPAD,
  KEY_SUB_CATEGORY_PUNCTUATION,
  KEY_SUB_CATEGORY_SOUND,
  KEY_SUB_CATEGORY_SPACE_CADET,
  KEY_SUB_CATEGORY_UNDERGLOW,
} from './KeyCategoryList';
import { KeyInfo, keyInfoList } from './KeycodeInfoList';
import { KeyLabel } from '../labellang/KeyLabel';
import { KeyLabelLangs, KeyboardLabelLang } from '../labellang/KeyLabelLangs';
import { bmpKeyInfoList } from './KeycodeInfoListBmp';

export const QK_BASIC_MIN = 0b0000_0000_0000_0000;
export const QK_BASIC_MAX = 0b0000_0000_1111_1111;

export const QK_MODS_MIN = 0b0000_0001_0000_0000;
export const QK_MODS_MAX = 0b0001_1111_1111_1111;

export const QK_FUNCTION_MIN = 0b0010_0000_0000_0000;
export const QK_FUNCTION_MAX = 0b0010_1111_1111_1111;

export const QK_MACRO_MIN = 0b0011_0000_0000_0000;
export const QK_MACRO_MAX = 0b0011_1111_1111_1111;

export const QK_LAYER_TAP_MIN = 0b0100_0000_0000_0000;
export const QK_LAYER_TAP_MAX = 0b0100_1111_1111_1111;

export const QK_TO_MIN = 0b0101_0000_0000_0000;
export const QK_TO_MAX = 0b0101_0000_1111_1111;

export const QK_MOMENTARY_MIN = 0b0101_0001_0000_0000;
export const QK_MOMENTARY_MAX = 0b0101_0001_1111_1111;

export const QK_DEF_LAYER_MIN = 0b0101_0010_0000_0000;
export const QK_DEF_LAYER_MAX = 0b0101_0010_1111_1111;

export const QK_TOGGLE_LAYER_MIN = 0b0101_0011_0000_0000;
export const QK_TOGGLE_LAYER_MAX = 0b0101_0011_1111_1111;

export const QK_ONE_SHOT_LAYER_MIN = 0b0101_0100_0000_0000;
export const QK_ONE_SHOT_LAYER_MAX = 0b0101_0100_1111_1111;

export const QK_ONE_SHOT_MOD_MIN = 0b0101_0101_0000_0000;
export const QK_ONE_SHOT_MOD_MAX = 0b0101_0101_1111_1111;

export const QK_SWAP_HANDS_MIN = 0b0101_0110_0000_0000;
export const QK_SWAP_HANDS_MAX = 0b0101_0110_1111_1111;

export const QK_TAP_DANCE_MIN = 0b0101_0111_0000_0000;
export const QK_TAP_DANCE_MAX = 0b0101_0111_1111_1111;

export const QK_LAYER_TAP_TOGGLE_MIN = 0b0101_1000_0000_0000;
export const QK_LAYER_TAP_TOGGLE_MAX = 0b0101_1000_1111_1111;

export const QK_LAYER_MOD_MIN = 0b0101_1001_0000_0000;
export const QK_LAYER_MOD_MAX = 0b0101_1001_1111_1111;

export const QK_MOD_TAP_MIN = 0b0110_0000_0000_0000;
export const QK_MOD_TAP_MAX = 0b0111_1111_1111_1111;

export const QK_UNICODE_MIN = 0b1000_0000_0000_0000;
export const QK_UNICODE_MAX = 0b1111_1111_1111_1111;

export const LOOSE_KEYCODE_MIN = 0b0101_1100_0000_0000;
export const LOOSE_KEYCODE_MAX = 0b0101_1111_1111_1111;

export const ASCII_MIN = 0b0000_0000_0000_0000;
export const ASCII_MAX = 0b0000_0000_0111_1111;

export type IKeycodeCompositionKind =
  | 'basic'
  | 'mods'
  | 'function'
  | 'macro'
  | 'layer_tap'
  | 'to'
  | 'momentary'
  | 'df'
  | 'tl'
  | 'osl'
  | 'osm'
  | 'tap_dance'
  | 'tt'
  | 'layer_mod'
  | 'swap_hands'
  | 'mod_tap'
  | 'unicode'
  | 'loose_keycode'
  | 'ascii';
export const KeycodeCompositionKind: {
  // eslint-disable-next-line no-unused-vars
  [p in IKeycodeCompositionKind]: IKeycodeCompositionKind;
} = {
  basic: 'basic',
  mods: 'mods',
  function: 'function',
  macro: 'macro',
  layer_tap: 'layer_tap',
  to: 'to',
  momentary: 'momentary',
  df: 'df',
  tl: 'tl',
  osl: 'osm',
  osm: 'osm',
  tap_dance: 'tap_dance',
  tt: 'tt',
  layer_mod: 'layer_mod',
  swap_hands: 'swap_hands',
  mod_tap: 'mod_tap',
  unicode: 'unicode',
  loose_keycode: 'loose_keycode',
  ascii: 'ascii',
};

const keycodeCompositionKindRangeMap: {
  // eslint-disable-next-line no-unused-vars
  [p in keyof typeof KeycodeCompositionKind]: { min: number; max: number };
} = {
  basic: { min: QK_BASIC_MIN, max: QK_BASIC_MAX },
  mods: { min: QK_MODS_MIN, max: QK_MODS_MAX },
  function: { min: QK_FUNCTION_MIN, max: QK_FUNCTION_MAX },
  macro: { min: QK_MACRO_MIN, max: QK_MACRO_MAX },
  layer_tap: { min: QK_LAYER_TAP_MIN, max: QK_LAYER_TAP_MAX },
  to: { min: QK_TO_MIN, max: QK_TO_MAX },
  momentary: { min: QK_MOMENTARY_MIN, max: QK_MOMENTARY_MAX },
  df: { min: QK_DEF_LAYER_MIN, max: QK_DEF_LAYER_MAX },
  tl: { min: QK_TOGGLE_LAYER_MIN, max: QK_TOGGLE_LAYER_MAX },
  osl: { min: QK_ONE_SHOT_LAYER_MIN, max: QK_ONE_SHOT_LAYER_MAX },
  osm: { min: QK_ONE_SHOT_MOD_MIN, max: QK_ONE_SHOT_MOD_MAX },
  tap_dance: { min: QK_TAP_DANCE_MIN, max: QK_TAP_DANCE_MAX },
  tt: {
    min: QK_LAYER_TAP_TOGGLE_MIN,
    max: QK_LAYER_TAP_TOGGLE_MAX,
  },
  layer_mod: { min: QK_LAYER_MOD_MIN, max: QK_LAYER_MOD_MAX },
  swap_hands: { min: QK_SWAP_HANDS_MIN, max: QK_SWAP_HANDS_MAX },
  mod_tap: { min: QK_MOD_TAP_MIN, max: QK_MOD_TAP_MAX },
  unicode: { min: QK_UNICODE_MIN, max: QK_UNICODE_MAX },
  loose_keycode: { min: LOOSE_KEYCODE_MIN, max: LOOSE_KEYCODE_MAX },
  ascii: { min: Number.MIN_VALUE, max: Number.MIN_VALUE }, // never match
};

export const MOD_CTL = 0b0001;
export const MOD_SFT = 0b0010;
export const MOD_ALT = 0b0100;
export const MOD_GUI = 0b1000;

export type IMod =
  | typeof MOD_CTL
  | typeof MOD_SFT
  | typeof MOD_ALT
  | typeof MOD_GUI;
export const MODIFIERS: IMod[] = [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI];

export const MOD_LEFT = 0b0;
export const MOD_RIGHT = 0b1;

export type IModDirectionLabel = 'left' | 'right';
export type IModDirection = typeof MOD_LEFT | typeof MOD_RIGHT;
// eslint-disable-next-line no-unused-vars
export const ModDirection: { [p in IModDirectionLabel]: IModDirection } = {
  left: MOD_LEFT,
  right: MOD_RIGHT,
};

export const ON_PRESS = 0b0001;

export const OP_SH_TOGGLE = 0b1111_0000;
export const OP_SH_TAP_TOGGLE = 0b1111_0001;
export const OP_SH_ON_OFF = 0b1111_0010;
export const OP_SH_OFF_ON = 0b1111_0011;
export const OP_SH_OFF = 0b1111_0100;
export const OP_SH_ON = 0b1111_0101;
export const OP_SH_ONESHOT = 0b1111_0110;

export type ISwapHandsOption =
  | typeof OP_SH_TOGGLE
  | typeof OP_SH_TAP_TOGGLE
  | typeof OP_SH_ON_OFF
  | typeof OP_SH_OFF_ON
  | typeof OP_SH_OFF
  | typeof OP_SH_ON
  | typeof OP_SH_ONESHOT;
export const SWAP_HANDS_OPTIONS: ISwapHandsOption[] = [
  OP_SH_TOGGLE,
  OP_SH_TAP_TOGGLE,
  OP_SH_ON_OFF,
  OP_SH_OFF_ON,
  OP_SH_OFF,
  OP_SH_ON,
  OP_SH_ONESHOT,
];

export function anyKeymap(hex: number): IKeymap {
  return {
    code: hex,
    isAny: true,
    kinds: ['any'],
    direction: MOD_LEFT,
    modifiers: [],
    keycodeInfo: {
      code: hex,
      label: 'Any',
      name: {
        short: 'Any',
        long: 'Any',
      },
      keywords: [],
    },
  };
}

const WILL_BE_REPLACED_KEYCODE = -1;
const WILL_BE_REPLACED_KEYMAP: IKeymap = anyKeymap(WILL_BE_REPLACED_KEYCODE);
const DUMMY_KEYMAP: IKeymap = anyKeymap(0);

export const DIRECTION_LABELS = ['Left', 'Right'] as const;
export const MOD_LABELS = [
  '0',
  'Ctrl',
  'Shift',
  '3',
  'Alt',
  '5',
  '6',
  '7',
  'Win/Cmd',
] as const;

interface ITapKey {
  genTapKey(): IKeymap | undefined;
}
export interface IComposition {
  getCode(): number;
  genKeymap(): IKeymap | undefined;
}

export interface IAsciiComposition extends IComposition {}
export interface IBasicComposition extends IComposition {}
export interface IModsComposition extends IComposition {
  getModDirection(): IModDirection;
  getModifiers(): IMod[];
}

export interface IFunctionComposition extends IComposition {
  getFunctionId(): number;
}

export interface IMacroComposition extends IComposition {
  getMacroId(): number;
  isTap(): boolean;
}

export interface ILayerTapComposition extends IComposition, ITapKey {
  getLayer(): number;
}

export interface IToComposition extends IComposition {
  getLayer(): number;
}

export interface IMomentaryComposition extends IComposition {
  getLayer(): number;
  genKeymap(): IKeymap;
}

export interface IDefLayerComposition extends IComposition {
  getLayer(): number;
}

export interface IToggleLayerComposition extends IComposition {
  getLayer(): number;
}

export interface IOneShotLayerComposition extends IComposition {
  getLayer(): number;
}

export interface IOneShotModComposition extends IComposition {
  getModDirection(): IModDirection;
  getModifiers(): IMod[];
}

export interface ITapDanceComposition extends IComposition {
  getNo(): number;
}

export interface ILayerTapToggleComposition extends IComposition {
  getLayer(): number;
}

export interface ILayerModComposition extends IComposition {
  getLayer(): number;
  getModifiers(): IMod[];
}

export interface ISwapHandsComposition extends IComposition, ITapKey {
  getSwapHandsOption(): ISwapHandsOption | null;
  isSwapHandsOption(): boolean;
}

export interface IModTapComposition extends IComposition, ITapKey {
  getModifiers(): IMod[];
  getModDirection(): IModDirection;
}

export interface IUnicodeComposition extends IComposition {
  getCharCode(): number;
}

export interface ILooseKeycodeComposition extends IComposition {}

export class AsciiComposition implements IAsciiComposition {
  private static _keymaps: IKeymap[];
  private static _supportedAsciiCodes: number[];
  private readonly key: IKeymap;

  private static LABEL_DICT: { [code: string]: string } = {
    '8': 'Back Space',
    '9': 'Tab',
    '27': 'Esc',
    '32': 'Space',
    '42': '*',
    '127': 'Del',
  };

  constructor(key: IKeymap) {
    this.key = key;
  }

  getCode(): number {
    return this.key.code;
  }

  genKeymap(): IKeymap | undefined {
    if (this.key) {
      return JSON.parse(JSON.stringify(this.key));
    } else {
      return undefined;
    }
  }

  static genKeymaps(): IKeymap[] {
    if (AsciiComposition._keymaps) {
      return AsciiComposition._keymaps;
    }
    AsciiComposition._keymaps = KEY_CATEGORY_ASCII.codes.map((code) =>
      AsciiComposition.createKeymap(code)
    );
    return AsciiComposition._keymaps;
  }

  static createKeymap(code: number): IKeymap {
    if (AsciiComposition.getSupportedAsciiCodes().includes(code)) {
      const label = Object.prototype.hasOwnProperty.call(
        AsciiComposition.LABEL_DICT,
        '' + code
      )
        ? AsciiComposition.LABEL_DICT['' + code]
        : String.fromCharCode(code);
      const desc = `${label}`;
      const keycodeInfo = {
        code,
        name: {
          long: label,
          short: label,
        },
        label: label,
        keywords: [],
      };
      return {
        code,
        kinds: KEY_CATEGORY_ASCII.kinds,
        desc,
        keycodeInfo,
        isAny: false,
        isAscii: true,
        direction: MOD_LEFT,
        modifiers: [],
      };
    } else {
      const label = hexadecimal(code);
      return {
        code,
        kinds: KEY_CATEGORY_ASCII.kinds,
        desc: label,
        keycodeInfo: {
          code,
          name: {
            long: label,
            short: label,
          },
          label,
          keywords: [],
        },
        isAny: true,
        isAscii: true,
        direction: MOD_LEFT,
        modifiers: [],
      };
    }
  }

  static getSupportedAsciiCodes(): number[] {
    if (AsciiComposition._supportedAsciiCodes) {
      return AsciiComposition._supportedAsciiCodes;
    }
    const codes = keyInfoList.flatMap((info) => info.keycodeInfo.ascii || []);
    AsciiComposition._supportedAsciiCodes = [
      ...KEY_CATEGORY_ASCII.codes,
      ...codes,
    ].sort();
    return AsciiComposition._supportedAsciiCodes;
  }
}

export class BasicComposition implements IBasicComposition {
  private static _keymaps: { [lang: string]: IKeymap[] } = {};
  private readonly key: IKeymap;

  constructor(key: IKeymap) {
    this.key = key;
  }

  getCode(): number {
    return this.key.code & 0b1111_1111;
  }

  genKeymap(): IKeymap | undefined {
    if (this.key) {
      return JSON.parse(JSON.stringify(this.key));
    } else {
      return undefined;
    }
  }

  static genKeymaps(labelLang: KeyboardLabelLang): IKeymap[] {
    if (
      Object.prototype.hasOwnProperty.call(BasicComposition._keymaps, labelLang)
    )
      return this._keymaps[labelLang];

    const list: IKeycodeCategoryInfo[] = [
      // basic
      KEY_SUB_CATEGORY_LETTER,
      KEY_SUB_CATEGORY_NUMBER,
      KEY_SUB_CATEGORY_NUMPAD,
      KEY_SUB_CATEGORY_MODIFIER,
      KEY_SUB_CATEGORY_EDIT,
      KEY_SUB_CATEGORY_MOVE,
      // symbol
      KEY_SUB_CATEGORY_BLANK,
      KEY_SUB_CATEGORY_PUNCTUATION,
      // function
      KEY_SUB_CATEGORY_F,
      KEY_SUB_CATEGORY_INTERNATIONAL,
      KEY_SUB_CATEGORY_LANGUAGE,
      KEY_SUB_CATEGORY_LOCK,
      // special
      KEY_SUB_CATEGORY_GUI,
      KEY_SUB_CATEGORY_COMMAND,
      KEY_SUB_CATEGORY_EMBED_FUNCTION,
      KEY_SUB_CATEGORY_MEDIA,
      KEY_SUB_CATEGORY_APPLICATION,
      // device
      KEY_SUB_CATEGORY_DEVICE,
      KEY_SUB_CATEGORY_MOUSE,
    ];

    const keyLabels: KeyLabel[] = KeyLabelLangs.getKeyLabels(labelLang) || [];
    const normalKeymaps: IKeymap[] = [];
    list.forEach((category) => {
      const kinds = category.kinds;
      category.codes.forEach((code) => {
        let keyInfo = keyInfoList.find(
          (info) => info.keycodeInfo.code === code
        );

        const desc = keyInfo ? keyInfo.desc : 'Unknown';
        let keycodeInfo: IKeycodeInfo;
        if (keyInfo) {
          const keyLabelLang = keyLabels.find((keyLabel: KeyLabel) => {
            return keyLabel.code === keyInfo!.keycodeInfo.code;
          });
          if (keyLabelLang) {
            keycodeInfo = { ...keyInfo.keycodeInfo, label: keyLabelLang.label };
          } else {
            keycodeInfo = keyInfo.keycodeInfo;
          }
        } else {
          keycodeInfo = anyKeymap(code).keycodeInfo;
        }

        const km: IKeymap = {
          code,
          kinds,
          desc,
          keycodeInfo,
          isAny: false,
          direction: MOD_LEFT,
          modifiers: [],
        };
        normalKeymaps.push(km);
      });
    });
    BasicComposition._keymaps[labelLang] = normalKeymaps;
    return BasicComposition._keymaps[labelLang];
  }

  static findKeymap(
    code: number,
    labelLang: KeyboardLabelLang
  ): IKeymap | undefined {
    const list: IKeymap[] = BasicComposition.genKeymaps(labelLang);
    const basic = list.find((km) => km.code === code);
    return basic;
  }
}

export class ModsComposition implements IModsComposition {
  private readonly modDirection: IModDirection;
  private readonly modifiers: IMod[];
  private readonly key: IKeymap;

  constructor(modDirection: IModDirection, modifiers: IMod[], key: IKeymap) {
    this.modDirection = modDirection;
    this.modifiers = modifiers;
    this.key = key;
  }

  static genBinary(mods: IMod[]): number {
    const bin = mods.reduce<number>((result, current) => {
      return result | current;
    }, 0);
    return bin;
  }

  getCode(): number {
    const code = ModsComposition.genBinary(this.modifiers);
    return (
      (this.modDirection << 12) | (code << 8) | (this.key.code & 0b1111_1111)
    );
  }

  genKeymap(): IKeymap {
    return {
      code: this.getCode(),
      kinds: ['basic', 'mods'],
      isAny: false,
      desc: '',
      keycodeInfo: this.key.keycodeInfo,
      direction: this.modDirection,
      modifiers: this.modifiers,
    };
  }

  getModifiers(): IMod[] {
    return this.modifiers;
  }

  getModDirection(): IModDirection {
    return this.modDirection;
  }
}

export class FunctionComposition implements IFunctionComposition {
  private readonly functionId: number;

  constructor(functionId: number) {
    this.functionId = functionId;
  }

  getCode(): number {
    return QK_FUNCTION_MIN | (this.functionId & 0b1111_1111_1111);
  }

  getFunctionId(): number {
    return this.functionId;
  }

  genKeymap(): IKeymap {
    const code = this.getCode();
    const id = this.functionId;
    const label = `Func${id}`;
    const keymap: IKeymap = {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: code,
        label: label,
        name: { short: '', long: '' },
        keywords: [],
      },
      kinds: ['function'],
      desc: ``,
      option: id,
    };
    return keymap;
  }
}

export class MacroComposition implements IMacroComposition {
  private readonly macroId: number;

  constructor(macroId: number) {
    this.macroId = macroId;
  }

  getCode(): number {
    return QK_MACRO_MIN | (this.macroId & 0b1111_1111_1111);
  }

  getMacroId(): number {
    return this.macroId;
  }

  isTap(): boolean {
    return (this.macroId & 0b1000_0000_0000) === 0b1000_0000_0000;
  }

  genKeymap(): IKeymap {
    // TODO
    const keymap: IKeymap = {
      code: -1,
      isAny: false,
      kinds: ['macro'],
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: -1,
        name: {
          short: 'Macro?',
          long: 'M?',
        },
        label: 'Macro',
        keywords: [],
      },
    };
    return keymap;
  }
}

export class LayerTapComposition implements ILayerTapComposition {
  private readonly layer: number;
  private readonly key: IKeymap;

  constructor(layer: number, key: IKeymap) {
    this.key = key;
    this.layer = layer;
  }

  getCode(): number {
    return (
      QK_LAYER_TAP_MIN |
      (((this.layer & 0b1111) << 8) | (this.key.code & 0b1111_1111))
    );
  }

  getLayer(): number {
    return this.layer;
  }

  genTapKey(): IKeymap {
    return this.key;
  }

  genKeymap(): IKeymap {
    const layer = this.layer;
    const code = this.getCode();
    const label = `Layer(${layer})`;
    return {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: this.key.code,
        label: label,
        name: this.key.keycodeInfo
          ? this.key.keycodeInfo.name
          : { short: 'LT', long: 'LT' },
        keywords: [],
      },
      kinds: ['layer_tap'],
      desc: `Momentarily activates Layer(${layer}) when held, and sends keycode when tapped.`,
      option: layer,
    };
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new LayerTapComposition(index, WILL_BE_REPLACED_KEYMAP);
        return comp.genKeymap();
      });
  }
}

export class ToComposition implements IToComposition {
  private readonly layer: number;

  constructor(layer: number) {
    this.layer = layer;
  }

  getLayer(): number {
    return this.layer;
  }

  getCode(): number {
    return QK_TO_MIN | ((ON_PRESS << 4) | (this.layer & 0b1111));
  }

  genKeymap(): IKeymap {
    const code = this.getCode();
    const layer = this.getLayer();
    const label = `TO(${layer})`;
    const keymap: IKeymap = {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: code,
        label: label,
        name: { short: '', long: '' },
        keywords: [],
      },
      kinds: ['layers', 'to'],
      desc: `Activates layer(${layer}) and de-activates all other layers (except your default layer).`,
      option: layer,
    };
    return keymap;
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new ToComposition(index);
        return comp.genKeymap();
      });
  }
}

export class MomentaryComposition implements IMomentaryComposition {
  private readonly layer: number;

  constructor(layer: number) {
    this.layer = layer;
  }

  getLayer(): number {
    return this.layer;
  }

  getCode(): number {
    return QK_MOMENTARY_MIN | (this.layer & 0b1111_1111);
  }

  genKeymap(): IKeymap {
    const code = this.getCode();
    const layer = this.getLayer();
    const label = `MO(${layer})`;
    const keymap: IKeymap = {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: code,
        label: label,
        name: { short: label, long: label },
        keywords: [],
      },
      kinds: ['layers', 'momentary'],
      desc: `Momentarily activates layer(${layer}). As soon as you let go of the key, the layer is deactivated.`,
      option: layer,
    };
    return keymap;
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new MomentaryComposition(index);
        return comp.genKeymap();
      });
  }
}

export class DefLayerComposition implements IMomentaryComposition {
  private readonly layer: number;

  constructor(layer: number) {
    this.layer = layer;
  }

  getLayer(): number {
    return this.layer;
  }

  getCode(): number {
    return QK_DEF_LAYER_MIN | (this.layer & 0b1111_1111);
  }

  genKeymap(): IKeymap {
    const layer = this.getLayer();
    const code = this.getCode();
    const label = `DF(${layer})`;
    const keymap: IKeymap = {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: code,
        label: label,
        name: { short: label, long: label },
        keywords: [],
      },
      kinds: ['layers', 'df'],
      desc: `Switches the default layer(${layer}). The default layer is the always-active base layer that other layers stack on top of.`,
      option: layer,
    };
    return keymap;
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new DefLayerComposition(index);
        return comp.genKeymap();
      });
  }
}

export class ToggleLayerComposition implements IMomentaryComposition {
  private readonly layer: number;

  constructor(layer: number) {
    this.layer = layer;
  }

  getLayer(): number {
    return this.layer;
  }

  getCode(): number {
    return QK_TOGGLE_LAYER_MIN | (this.layer & 0b1111_1111);
  }

  genKeymap(): IKeymap {
    const layer = this.getLayer();
    const code = this.getCode();
    const label = `TG(${layer})`;
    const keymap: IKeymap = {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: code,
        label: label,
        name: { short: label, long: label },
        keywords: [],
      },
      kinds: ['layers', 'tl'],
      desc: `Toggles layer(${layer}), activating it if it's inactive and vice versa.`,
      option: layer,
    };
    return keymap;
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new ToggleLayerComposition(index);
        return comp.genKeymap();
      });
  }
}

export class OneShotLayerComposition implements IOneShotLayerComposition {
  private readonly layer: number;

  constructor(layer: number) {
    this.layer = layer;
  }

  getLayer(): number {
    return this.layer;
  }

  getCode(): number {
    return QK_ONE_SHOT_LAYER_MIN | (this.layer & 0b1111_1111);
  }

  genKeymap(): IKeymap {
    const layer = this.layer;
    const code = this.getCode();
    const label = `OSL(${layer})`;
    return {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: code,
        label: label,
        name: { short: label, long: label },
        keywords: [],
      },
      kinds: ['layers', 'osl'],
      desc: `Momentarily activates layer(${layer}) until the next key is pressed.`,
      option: layer,
    };
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new OneShotLayerComposition(index);
        return comp.genKeymap();
      });
  }
}

export class OneShotModComposition implements IOneShotModComposition {
  private readonly modDirection: IModDirection;
  private readonly modifiers: IMod[];

  constructor(modDirection: IModDirection, modifiers: IMod[]) {
    this.modDirection = modDirection;
    this.modifiers = modifiers;
  }

  getCode(): number {
    const mods = this.modifiers.reduce<number>((result, current) => {
      return result | current;
    }, 0);
    return QK_ONE_SHOT_MOD_MIN | (this.modDirection << 4) | mods;
  }

  getModifiers(): IMod[] {
    return this.modifiers;
  }

  getModDirection(): IModDirection {
    return this.modDirection;
  }

  genKeymap(): IKeymap {
    const code = this.getCode();
    return {
      code: code,
      isAny: false,
      modifiers: this.modifiers,
      direction: this.modDirection,
      keycodeInfo: {
        code: code,
        label: `OSM`,
        name: { short: 'OSM', long: 'OSM' },
        keywords: [],
      },
      kinds: ['layers', 'osm'],
      desc: `Momentarily activates modifier(s) until the next key is pressed.`,
    };
  }

  static genKeymaps(): IKeymap[] {
    return [
      {
        code: WILL_BE_REPLACED_KEYCODE,
        isAny: false,
        direction: MOD_LEFT,
        modifiers: [],
        keycodeInfo: {
          code: WILL_BE_REPLACED_KEYCODE,
          label: `OSM`,
          name: { short: 'OSM', long: 'OSM' },
          keywords: [],
        },
        kinds: ['layers', 'osm'],
        desc: `Momentarily activates modifier(s) until the next key is pressed.`,
      },
    ];
  }
}

export class TapDanceComposition implements ITapDanceComposition {
  private readonly no: number;

  constructor(no: number) {
    this.no = no;
  }

  getCode(): number {
    return QK_TAP_DANCE_MIN | (this.no & 0b1111_1111);
  }

  getNo(): number {
    return this.no;
  }

  genKeymap(): IKeymap {
    //TODO: will develope?
    return JSON.parse(JSON.stringify(DUMMY_KEYMAP));
  }
}

export class LayerTapToggleComposition implements ILayerTapToggleComposition {
  private readonly layer: number;

  constructor(layer: number) {
    this.layer = layer;
  }

  getLayer(): number {
    return this.layer;
  }

  getCode(): number {
    return QK_LAYER_TAP_TOGGLE_MIN | (this.layer & 0b1111_1111);
  }

  genKeymap(): IKeymap {
    const code = this.getCode();
    const layer = this.getLayer();
    const label = `TT(${layer})`;
    const keymap: IKeymap = {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: code,
        label: label,
        name: { short: '', long: '' },
        keywords: [],
      },
      kinds: ['layers', 'tt'],
      desc: `If you hold the key down, layer(${layer}) is activated, and then is de-activated when you let go.`,
      option: layer,
    };
    return keymap;
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new LayerTapToggleComposition(index);
        return comp.genKeymap();
      });
  }
}

export class LayerModComposition implements ILayerModComposition {
  private readonly layer: number;
  private readonly modifiers: IMod[];

  constructor(layer: number, modifiers: IMod[]) {
    this.layer = layer;
    this.modifiers = modifiers;
  }

  getLayer(): number {
    return this.layer;
  }

  getModifiers(): IMod[] {
    return this.modifiers;
  }

  getCode(): number {
    const mods = this.modifiers.reduce<number>((result, current) => {
      return result | current;
    }, 0);
    return QK_LAYER_MOD_MIN | ((this.layer & 0b1111) << 4) | mods;
  }

  genKeymap(): IKeymap {
    const layer = this.layer;
    const code = this.getCode();
    const label = `LM(${layer})`;
    const keymap: IKeymap = {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: code,
        label: label,
        name: { short: 'LM', long: 'LM' },
        keywords: [],
      },
      kinds: ['layer_mod'],
      desc: `Momentarily activates Layer(${layer}), but with modifier(s) mod active.`,
      option: layer,
    };
    return keymap;
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new LayerModComposition(index, []);
        return comp.genKeymap();
      });
  }
}

export class SwapHandsComposition implements ISwapHandsComposition {
  private static _swapHandsOptionKeymaps: IKeymap[];
  private static _swapHandsOptionItems: {
    option: ISwapHandsOption;
    label: string;
    desc: string;
  }[] = [
    {
      option: OP_SH_TOGGLE,
      label: 'SH TG',
      desc: 'Toggles swap on and off with every key press.',
    },
    {
      option: OP_SH_TAP_TOGGLE,
      label: 'SH TT',
      desc: 'Toggles with a tap; momentary when held.',
    },
    {
      option: OP_SH_ON_OFF,
      label: 'SH_MON',
      desc:
        'Swaps hands when pressed, returns to normal when released (momentary).',
    },
    {
      option: OP_SH_OFF_ON,
      label: 'SH MOFF',
      desc: 'Momentarily turns off swap.',
    },
    {
      option: OP_SH_OFF,
      label: 'SH OFF',
      desc:
        'Turn off swapping and leaves it off. Good for returning to a known state.',
    },
    {
      option: OP_SH_ON,
      label: 'SH ON',
      desc: 'Turns on swapping and leaves it on.',
    },
    {
      option: OP_SH_ONESHOT,
      label: 'SH ON',
      desc:
        'One shot swap hands: toggles while pressed or until next key press.',
    },
  ];
  static readonly holdKey: IKeymap = {
    code: WILL_BE_REPLACED_KEYCODE,
    isAny: false,
    direction: MOD_LEFT,
    modifiers: [],
    keycodeInfo: {
      code: WILL_BE_REPLACED_KEYCODE,
      label: `Swap-Hands`,
      name: { short: 'SH', long: 'SH' },
      keywords: [],
    },
    kinds: ['swap_hands'],
    desc:
      'Momentary swap when held, sends keycode when tapped. Depends on your keyboard whether this function is available.',
  };

  private readonly key: IKeymap | undefined;
  private readonly swapHandsOption: ISwapHandsOption | null;

  constructor(value: IKeymap | ISwapHandsOption) {
    if (typeof value === 'number') {
      this.key = undefined;
      this.swapHandsOption = value as ISwapHandsOption;
    } else {
      this.key = value as IKeymap;
      this.swapHandsOption = null;
    }
  }

  getCode(): number {
    if (this.isSwapHandsOption()) {
      return QK_SWAP_HANDS_MIN | (this.swapHandsOption! & 0b1111_1111);
    } else {
      return QK_SWAP_HANDS_MIN | (this.key!.code & 0b1111_1111);
    }
  }

  genTapKey(): IKeymap | undefined {
    return this.key;
  }

  getSwapHandsOption(): ISwapHandsOption | null {
    return this.swapHandsOption;
  }

  isSwapHandsOption(): boolean {
    return this.swapHandsOption !== null;
  }

  genKeymap(): IKeymap | undefined {
    const code = this.getCode();
    let keymap: IKeymap;
    if (this.isSwapHandsOption()) {
      return SwapHandsComposition.findKeymap(code);
    } else {
      keymap = {
        code: code,
        isAny: false,
        direction: MOD_LEFT,
        modifiers: [],
        keycodeInfo: this.key!.keycodeInfo,
        kinds: ['swap_hands'],
        desc:
          'Momentary swap when held, sends keycode when tapped. Depends on your keyboard whether this function is available.',
      };
    }
    return keymap;
  }

  static findKeymap(code: number): IKeymap | undefined {
    if (!SwapHandsComposition.isSwapHandsOptions(code)) return undefined;

    return SwapHandsComposition.genSwapHandsOptionKeymaps().find(
      (km) => km.code === code
    );
  }

  static isSwapHandsOptions(code: number): boolean {
    return (
      0 <=
      SwapHandsComposition.genSwapHandsOptionKeymaps().findIndex(
        (km) => km.code === code
      )
    );
  }

  static genSwapHandsOptionKeymaps(): IKeymap[] {
    if (SwapHandsComposition._swapHandsOptionKeymaps)
      return SwapHandsComposition._swapHandsOptionKeymaps;

    SwapHandsComposition._swapHandsOptionKeymaps = SwapHandsComposition._swapHandsOptionItems.map(
      (item) => {
        const comp = new SwapHandsComposition(item.option);
        const code = comp.getCode();
        const keymap: IKeymap = {
          code: code,
          isAny: false,
          direction: MOD_LEFT,
          modifiers: [],
          keycodeInfo: {
            code: code,
            label: item.label,
            name: { short: 'SH', long: 'SH' },
            keywords: [],
          },
          kinds: ['special', 'swap_hands'],
          option: item.option,
          desc: item.desc,
        };
        return keymap;
      }
    );

    return SwapHandsComposition._swapHandsOptionKeymaps;
  }
}

export class ModTapComposition implements IModTapComposition {
  private static _modTapKeymaps: IKeymap[];
  private static _holdLabels = [
    '0',
    'Ctrl',
    'Shift',
    '3',
    'Alt',
    '5',
    '6',
    '7',
    'Win/Cmd',
  ];
  private readonly modDirection: IModDirection;
  private readonly modifiers: IMod[];
  private readonly key: IKeymap;

  constructor(modDirection: IModDirection, modifiers: IMod[], key: IKeymap) {
    this.modDirection = modDirection;
    this.modifiers = modifiers;
    this.key = key;
  }

  getCode(): number {
    const mods = this.modifiers.reduce<number>((result, current) => {
      return result | (current << 8);
    }, 0);
    return (
      QK_MOD_TAP_MIN |
      (this.modDirection << 12) |
      mods |
      (this.key.code & 0b1111_1111)
    );
  }

  genTapKey(): IKeymap {
    return this.key;
  }

  getModifiers(): IMod[] {
    return this.modifiers;
  }

  getModDirection(): IModDirection {
    return this.modDirection;
  }

  genKeymap(): IKeymap {
    const code = this.getCode();
    const direction = this.modDirection;
    const mods = this.modifiers;
    const hold = mods
      .map((mod) => ModTapComposition._holdLabels[mod])
      .join('+');
    const keymap: IKeymap = {
      code: code,
      isAny: false,
      keycodeInfo: {
        code: this.key.code,
        label: `(${DIRECTION_LABELS[direction]}) ${hold}`,
        name: this.key.keycodeInfo
          ? this.key.keycodeInfo.name
          : { short: 'MT', long: 'MT' },
        keywords: [],
      },
      kinds: ['mod_tap'],
      desc: `Momentarily activates ${hold} when held, and sends keycode when tapped.`,
      modifiers: mods,
      direction: direction,
    };
    return keymap;
  }

  static genKeymaps(): IKeymap[] {
    if (ModTapComposition._modTapKeymaps)
      return ModTapComposition._modTapKeymaps;

    const holdKeys: { [key: string]: IMod[] } = {
      Ctrl: [MOD_CTL],
      Shift: [MOD_SFT],
      Alt: [MOD_ALT],
      'Win/Cmd': [MOD_GUI],
      'Ctrl+Shift': [MOD_CTL, MOD_SFT],
      'Ctrl+Alt': [MOD_CTL, MOD_ALT],
      'Ctrl+Win/Cmd': [MOD_CTL, MOD_GUI],
      'Shift+Alt': [MOD_SFT, MOD_ALT],
      'Shift+Win/Cmd': [MOD_SFT, MOD_GUI],
      'Alt+Win/Cmd': [MOD_ALT, MOD_GUI],
      'Ctrl+Shift+Alt': [MOD_CTL, MOD_SFT, MOD_ALT],
      'Ctrl+Shift+Win/Cmd': [MOD_CTL, MOD_SFT, MOD_GUI],
      'Ctrl+Alt+Win/Cmd': [MOD_CTL, MOD_ALT, MOD_GUI],
      'Shift+Alt+Win/Cmd': [MOD_SFT, MOD_ALT, MOD_GUI],
      'Ctrl+Shift+Alt+Win/Cmd': [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
    };

    const holdLeftModKeys: IKeymap[] = Object.keys(holdKeys).map((hold) => {
      const comp = new ModTapComposition(
        MOD_LEFT,
        holdKeys[hold],
        WILL_BE_REPLACED_KEYMAP
      );
      return comp.genKeymap();
    });

    const holdRightModKeys: IKeymap[] = Object.keys(holdKeys).map((hold) => {
      const comp = new ModTapComposition(
        MOD_RIGHT,
        holdKeys[hold],
        WILL_BE_REPLACED_KEYMAP
      );
      return comp.genKeymap();
    });

    ModTapComposition._modTapKeymaps = [
      ...holdLeftModKeys,
      ...holdRightModKeys,
    ];
    return ModTapComposition._modTapKeymaps;
  }
}

export class UnicodeComposition implements IUnicodeComposition {
  private readonly charCode: number;

  constructor(charCode: number) {
    this.charCode = charCode;
  }

  getCode(): number {
    return QK_UNICODE_MIN | (this.charCode & 0b111_1111_1111_1111);
  }

  getCharCode(): number {
    return this.charCode;
  }
  genKeymap(): IKeymap {
    // TODO: will develop
    return JSON.parse(JSON.stringify(DUMMY_KEYMAP));
  }
}

export class LooseKeycodeComposition implements ILooseKeycodeComposition {
  private static _looseKeycodeKeymaps: IKeymap[];
  private readonly key: IKeymap;

  constructor(keymap: IKeymap) {
    this.key = keymap;
  }

  getCode(): number {
    return LOOSE_KEYCODE_MIN | this.key.code;
  }

  genKeymap(): IKeymap {
    return JSON.parse(JSON.stringify(this.key));
  }

  static genExtendsBmpKeymaps(): IKeymap[] {
    return bmpKeyInfoList.map((info) => {
      return {
        code: info.keycodeInfo.code,
        isAny: false,
        direction: MOD_LEFT,
        modifiers: [],
        keycodeInfo: info.keycodeInfo,
        kinds: ['extends', 'bmp'],
        desc: info.desc,
      };
    });
  }

  static genKeymaps(): IKeymap[] {
    if (LooseKeycodeComposition._looseKeycodeKeymaps)
      return LooseKeycodeComposition._looseKeycodeKeymaps;

    const getKeyInfo = (code: number): KeyInfo | undefined => {
      return keyInfoList.find((info) => info.keycodeInfo.code === code);
    };

    const categoryInfoList: IKeycodeCategoryInfo[] = [
      KEY_SUB_CATEGORY_GRAVE_ESCAPE,
      KEY_SUB_CATEGORY_SPACE_CADET,
      KEY_SUB_CATEGORY_KEYBOARD,
      KEY_SUB_CATEGORY_BOOTMAGIC,
      KEY_SUB_CATEGORY_SOUND,
      KEY_SUB_CATEGORY_BACKLIGHT,
      KEY_SUB_CATEGORY_UNDERGLOW,
      KEY_SUB_CATEGORY_MACRO,
      KEY_SUB_CATEGORY_COMBO,
      KEY_SUB_CATEGORY_MIDI,
    ];

    LooseKeycodeComposition._looseKeycodeKeymaps = [];
    categoryInfoList.forEach((cat: IKeycodeCategoryInfo) => {
      const kinds = cat.kinds;
      cat.codes.forEach((code) => {
        const info = getKeyInfo(code);
        if (info) {
          const keymap: IKeymap = {
            code: code,
            isAny: false,
            direction: MOD_LEFT,
            modifiers: [],
            keycodeInfo: info.keycodeInfo,
            kinds: kinds,
            desc: info.desc,
          };
          LooseKeycodeComposition._looseKeycodeKeymaps.push(keymap);
        }
      });
    });

    return LooseKeycodeComposition._looseKeycodeKeymaps;
  }

  static findKeymap(code: number): IKeymap | undefined {
    const list: IKeymap[] = LooseKeycodeComposition.genKeymaps();
    return list.find((km) => km.code === code);
  }
}

export interface IKeycodeCompositionFactory {
  isBasic(): boolean;
  isMods(): boolean;
  isFunction(): boolean;
  isMacro(): boolean;
  isLayerTap(): boolean;
  isTo(): boolean;
  isMomentary(): boolean;
  isDefLayer(): boolean;
  isToggleLayer(): boolean;
  isOneShotLayer(): boolean;
  isOneShotMod(): boolean;
  isTapDance(): boolean;
  isLayerTapToggle(): boolean;
  isLayerMod(): boolean;
  isSwapHands(): boolean;
  isModTap(): boolean;
  isUnicode(): boolean;
  isLooseKeycode(): boolean;
  isUnknown(): boolean;
  isAscii(): boolean;
  getKind(): IKeycodeCompositionKind | null;
  createBasicComposition(): IBasicComposition;
  createModsComposition(): IModsComposition;
  createFunctionComposition(): IFunctionComposition;
  createMacroComposition(): IMacroComposition;
  createLayerTapComposition(): ILayerTapComposition;
  createToComposition(): IToComposition;
  createMomentaryComposition(): IMomentaryComposition;
  createDefLayerComposition(): IDefLayerComposition;
  createToggleLayerComposition(): IToggleLayerComposition;
  createOneShotLayerComposition(): IOneShotLayerComposition;
  createOneShotModComposition(): IOneShotModComposition;
  createTapDanceComposition(): ITapDanceComposition;
  createLayerTapToggleComposition(): ILayerTapToggleComposition;
  createLayerModComposition(): ILayerModComposition;
  createSwapHandsComposition(): ISwapHandsComposition;
  createModTapComposition(): IModTapComposition;
  createUnicodeComposition(): IUnicodeComposition;
  createLooseKeycodeComposition(): ILooseKeycodeComposition;
  createAsciiKeycodeComposition(): IAsciiComposition;
}

export class KeycodeCompositionFactory implements IKeycodeCompositionFactory {
  private readonly code: number;
  private readonly labelLang: KeyboardLabelLang;

  constructor(code: number, labelLang: KeyboardLabelLang) {
    this.code = code;
    this.labelLang = labelLang;
  }

  getKind(): IKeycodeCompositionKind | null {
    const result = Object.keys(keycodeCompositionKindRangeMap).find((kind) => {
      const range =
        keycodeCompositionKindRangeMap[kind as IKeycodeCompositionKind];
      return range.min <= this.code && this.code <= range.max;
    }) as IKeycodeCompositionKind;
    if (result === KeycodeCompositionKind.loose_keycode) {
      let exist = keyInfoList.find(
        (info) => info.keycodeInfo.code === this.code
      );
      if (!exist) {
        exist = bmpKeyInfoList.find(
          (info) => info.keycodeInfo.code === this.code
        );
      }
      return exist ? result : null;
    }
    return result || null;
  }

  isBasic(): boolean {
    //return this.getKind() === KeycodeCompositionKind.basic;
    const km = BasicComposition.findKeymap(this.code, 'en-us');
    return Boolean(km);
  }

  isBasicFunc(): boolean {
    return KEY_SUB_CATEGORY_EMBED_FUNCTION.codes.includes(this.code);
  }

  isDefLayer(): boolean {
    return this.getKind() === KeycodeCompositionKind.df;
  }

  isFunction(): boolean {
    return this.getKind() === KeycodeCompositionKind.function;
  }

  isLayerMod(): boolean {
    return this.getKind() === KeycodeCompositionKind.layer_mod;
  }

  isLayerTap(): boolean {
    return this.getKind() === KeycodeCompositionKind.layer_tap;
  }

  isLayerTapToggle(): boolean {
    return this.getKind() === KeycodeCompositionKind.tt;
  }

  isLooseKeycode(): boolean {
    return this.getKind() === KeycodeCompositionKind.loose_keycode;
  }

  isMacro(): boolean {
    return this.getKind() === KeycodeCompositionKind.macro;
  }

  isModTap(): boolean {
    return this.getKind() === KeycodeCompositionKind.mod_tap;
  }

  isMods(): boolean {
    return this.getKind() === KeycodeCompositionKind.mods;
  }

  isMomentary(): boolean {
    return this.getKind() === KeycodeCompositionKind.momentary;
  }

  isOneShotLayer(): boolean {
    return this.getKind() === KeycodeCompositionKind.osl;
  }

  isOneShotMod(): boolean {
    return this.getKind() === KeycodeCompositionKind.osm;
  }

  isSwapHands(): boolean {
    return this.getKind() === KeycodeCompositionKind.swap_hands;
  }

  isTapDance(): boolean {
    return this.getKind() === KeycodeCompositionKind.tap_dance;
  }

  isTo(): boolean {
    return this.getKind() === KeycodeCompositionKind.to;
  }

  isToggleLayer(): boolean {
    return this.getKind() === KeycodeCompositionKind.tl;
  }

  isUnicode(): boolean {
    return this.getKind() === KeycodeCompositionKind.unicode;
  }

  isUnknown(): boolean {
    return this.getKind() === null;
  }

  isAscii(): boolean {
    return ASCII_MIN <= this.code && this.code <= ASCII_MAX;
  }

  createBasicComposition(): IBasicComposition {
    if (!this.isBasic()) {
      throw new Error(
        `This code is not a basic key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const keyCode = this.code & 0b1111_1111;
    const keymap: IKeymap = BasicComposition.findKeymap(
      keyCode,
      this.labelLang
    )!;
    return new BasicComposition(keymap);
  }

  createModsComposition(): IModsComposition {
    if (!this.isMods()) {
      throw new Error(
        `This code is not a mods key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const basicCode = this.code & 0b1111_1111;
    const basicKeymap: IKeymap = BasicComposition.findKeymap(
      basicCode,
      this.labelLang
    )!;
    const modDirection =
      (this.code & 0b1_0000_0000_0000) >> 12 === 1 ? MOD_RIGHT : MOD_LEFT;
    const modifiers = MODIFIERS.reduce<IMod[]>((result, current) => {
      if (((this.code >> 8) & 0b1111 & current) === current) {
        result.push(current);
      }
      return result;
    }, []);
    return new ModsComposition(modDirection, modifiers, basicKeymap);
  }

  createFunctionComposition(): IFunctionComposition {
    if (!this.isFunction()) {
      throw new Error(
        `This code is not a function key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const functionId = this.code & 0b1111_1111_1111;
    return new FunctionComposition(functionId);
  }

  createMacroComposition(): IMacroComposition {
    if (!this.isMacro()) {
      throw new Error(
        `This code is not a macro key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const macroId = this.code & 0b1111_1111_1111;
    return new MacroComposition(macroId);
  }

  createLayerTapComposition(): ILayerTapComposition {
    if (!this.isLayerTap()) {
      throw new Error(
        `This code is not a layer tap key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const layer = (this.code >> 8) & 0b1111;
    const keyCode = this.code & 0b1111_1111;
    const keymap: IKeymap = BasicComposition.findKeymap(
      keyCode,
      this.labelLang
    )!;
    return new LayerTapComposition(layer, keymap);
  }

  createToComposition(): IToComposition {
    if (!this.isTo()) {
      throw new Error(
        `This code is not a to key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const layer = this.code & 0b1111;
    return new ToComposition(layer);
  }

  createMomentaryComposition(): IMomentaryComposition {
    if (!this.isMomentary()) {
      throw new Error(
        `This code is not a momentary key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const layer = this.code & 0b1111_1111;
    return new MomentaryComposition(layer);
  }

  createDefLayerComposition(): IDefLayerComposition {
    if (!this.isDefLayer()) {
      throw new Error(
        `This code is not a def layer key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const layer = this.code & 0b1111_1111;
    return new DefLayerComposition(layer);
  }

  createToggleLayerComposition(): IToggleLayerComposition {
    if (!this.isToggleLayer()) {
      throw new Error(
        `This code is not a toggle layer key code: ${hexadecimal(
          this.code,
          16
        )}`
      );
    }
    const layer = this.code & 0b1111_1111;
    return new ToggleLayerComposition(layer);
  }

  createOneShotLayerComposition(): IOneShotLayerComposition {
    if (!this.isOneShotLayer()) {
      throw new Error(
        `This code is not an one shot layer key code: ${hexadecimal(
          this.code,
          16
        )}`
      );
    }
    const layer = this.code & 0b1111_1111;
    return new OneShotLayerComposition(layer);
  }

  createOneShotModComposition(): IOneShotModComposition {
    if (!this.isOneShotMod()) {
      throw new Error(
        `This code is not an one shot mod key code: ${hexadecimal(
          this.code,
          16
        )}`
      );
    }
    const modDirection =
      (this.code & 0b1_0000) >> 4 === 1 ? MOD_RIGHT : MOD_LEFT;
    const modifiers = MODIFIERS.reduce<IMod[]>((result, current) => {
      if ((this.code & 0b1111 & current) === current) {
        result.push(current);
      }
      return result;
    }, []);
    return new OneShotModComposition(modDirection, modifiers);
  }

  createTapDanceComposition(): ITapDanceComposition {
    if (!this.isTapDance()) {
      throw new Error(
        `This code is not a tap dance key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const no = this.code & 0b1111_1111;
    return new TapDanceComposition(no);
  }

  createLayerTapToggleComposition(): ILayerTapToggleComposition {
    if (!this.isLayerTapToggle()) {
      throw new Error(
        `This code is not a layer tap toggle key code: ${hexadecimal(
          this.code,
          16
        )}`
      );
    }
    const layer = this.code & 0b1111_1111;
    return new LayerTapToggleComposition(layer);
  }

  createLayerModComposition(): ILayerModComposition {
    if (!this.isLayerMod()) {
      throw new Error(
        `This code is not a layer mod key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const layer = (this.code >> 4) & 0b1111;
    const modifiers = MODIFIERS.reduce<IMod[]>((result, current) => {
      if ((this.code & 0b1111 & current) === current) {
        result.push(current);
      }
      return result;
    }, []);
    return new LayerModComposition(layer, modifiers);
  }

  createSwapHandsComposition(): ISwapHandsComposition {
    if (!this.isSwapHands()) {
      throw new Error(
        `This code is not a swap hands key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const value = this.code & 0b1111_1111;
    if (SWAP_HANDS_OPTIONS.includes(value as ISwapHandsOption)) {
      return new SwapHandsComposition(value as ISwapHandsOption);
    } else {
      const keymap = BasicComposition.findKeymap(value, this.labelLang)!;
      return new SwapHandsComposition(keymap);
    }
  }

  createModTapComposition(): IModTapComposition {
    if (!this.isModTap()) {
      throw new Error(
        `This code is not a mod tap key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const keyCode = this.code & 0b1111_1111;
    const keymap: IKeymap = BasicComposition.findKeymap(
      keyCode,
      this.labelLang
    )!;
    const modifiers = MODIFIERS.reduce<IMod[]>((result, current) => {
      if (((this.code >> 8) & 0b1111 & current) === current) {
        result.push(current);
      }
      return result;
    }, []);
    const modDirection =
      ((this.code >> 12) & 0b0001) === MOD_RIGHT ? MOD_RIGHT : MOD_LEFT;
    return new ModTapComposition(modDirection, modifiers, keymap);
  }

  createUnicodeComposition(): IUnicodeComposition {
    if (!this.isUnicode()) {
      throw new Error(
        `This code is not a unicode key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const charCode = this.code & 0b111_1111_1111_1111;
    return new UnicodeComposition(charCode);
  }

  createLooseKeycodeComposition(): ILooseKeycodeComposition {
    if (!this.isLooseKeycode()) {
      throw new Error(
        `This code is not a loose key code key code: ${hexadecimal(
          this.code,
          16
        )}`
      );
    }

    let keymap: IKeymap | undefined = LooseKeycodeComposition.genKeymaps().find(
      (km) => km.code === this.code
    );

    if (keymap === undefined) {
      keymap = LooseKeycodeComposition.genExtendsBmpKeymaps().find(
        (km) => km.code === this.code
      );
    }

    if (keymap === undefined) {
      keymap = anyKeymap(this.code);
    }
    return new LooseKeycodeComposition(keymap);
  }

  createAsciiKeycodeComposition(): IAsciiComposition {
    if (!this.isAscii()) {
      throw new Error(
        `This code is not an ascii code: ${hexadecimal(this.code, 16)}`
      );
    }
    return new AsciiComposition(AsciiComposition.createKeymap(this.code));
  }
}
