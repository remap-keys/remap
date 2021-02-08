import { IKeymap } from './Hid';
import { hexadecimal } from '../../utils/StringUtils';
import { KeycodeList } from './KeycodeList';
import { keycodesBasicFunc } from './assets/KeycodesBasic';

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

export const QK_TAP_DANCE_MIN = 0b0101_0111_0000_0000;
export const QK_TAP_DANCE_MAX = 0b0101_0111_1111_1111;

export const QK_LAYER_TAP_TOGGLE_MIN = 0b0101_1000_0000_0000;
export const QK_LAYER_TAP_TOGGLE_MAX = 0b0101_1000_1111_1111;

export const QK_LAYER_MOD_MIN = 0b0101_1001_0000_0000;
export const QK_LAYER_MOD_MAX = 0b0101_1001_1111_1111;

export const QK_SWAP_HANDS_MIN = 0b0101_1011_0000_0000;
export const QK_SWAP_HANDS_MAX = 0b0101_1011_1111_1111;

export const QK_MOD_TAP_MIN = 0b0110_0000_0000_0000;
export const QK_MOD_TAP_MAX = 0b0111_1111_1111_1111;

export const QK_UNICODE_MIN = 0b1000_0000_0000_0000;
export const QK_UNICODE_MAX = 0b1111_1111_1111_1111;

export const LOOSE_KEYCODE_MIN = 0b0101_1100_0000_0000;
export const LOOSE_KEYCODE_MAX = 0b0101_1111_1111_1111;

export type IKeycodeCompositionKind =
  | 'basic'
  | 'mods'
  | 'function'
  | 'macro'
  | 'layer_tap'
  | 'to'
  | 'momentary'
  | 'def_layer'
  | 'toggle_layer'
  | 'one_shot_layer'
  | 'one_shot_mod'
  | 'tap_dance'
  | 'layer_tap_toggle'
  | 'layer_mod'
  | 'swap_hands'
  | 'mod_tap'
  | 'unicode'
  | 'loose_keycode';
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
  def_layer: 'def_layer',
  toggle_layer: 'toggle_layer',
  one_shot_layer: 'one_shot_layer',
  one_shot_mod: 'one_shot_mod',
  tap_dance: 'tap_dance',
  layer_tap_toggle: 'layer_tap_toggle',
  layer_mod: 'layer_mod',
  swap_hands: 'swap_hands',
  mod_tap: 'mod_tap',
  unicode: 'unicode',
  loose_keycode: 'loose_keycode',
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
  def_layer: { min: QK_DEF_LAYER_MIN, max: QK_DEF_LAYER_MAX },
  toggle_layer: { min: QK_TOGGLE_LAYER_MIN, max: QK_TOGGLE_LAYER_MAX },
  one_shot_layer: { min: QK_ONE_SHOT_LAYER_MIN, max: QK_ONE_SHOT_LAYER_MAX },
  one_shot_mod: { min: QK_ONE_SHOT_MOD_MIN, max: QK_ONE_SHOT_MOD_MAX },
  tap_dance: { min: QK_TAP_DANCE_MIN, max: QK_TAP_DANCE_MAX },
  layer_tap_toggle: {
    min: QK_LAYER_TAP_TOGGLE_MIN,
    max: QK_LAYER_TAP_TOGGLE_MAX,
  },
  layer_mod: { min: QK_LAYER_MOD_MIN, max: QK_LAYER_MOD_MAX },
  swap_hands: { min: QK_SWAP_HANDS_MIN, max: QK_SWAP_HANDS_MAX },
  mod_tap: { min: QK_MOD_TAP_MIN, max: QK_MOD_TAP_MAX },
  unicode: { min: QK_UNICODE_MIN, max: QK_UNICODE_MAX },
  loose_keycode: { min: LOOSE_KEYCODE_MIN, max: LOOSE_KEYCODE_MAX },
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

export interface IComposition {
  getCode(): number;
}

export interface IBasicComposition extends IComposition {
  getKey(): IKeymap;
}

export interface IModsComposition extends IComposition {
  getModDirection(): IModDirection;
  getModifiers(): IMod[];
  getKey(): IKeymap;
}

export interface IFunctionComposition extends IComposition {
  getFunctionId(): number;
}

export interface IMacroComposition extends IComposition {
  getMacroId(): number;
  isTap(): boolean;
}

export interface ILayerTapComposition extends IComposition {
  getLayer(): number;
  getKey(): IKeymap;
}

export interface IToComposition extends IComposition {
  getLayer(): number;
}

export interface IMomentaryComposition extends IComposition {
  getLayer(): number;
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

export interface ISwapHandsComposition extends IComposition {
  getKey(): IKeymap | null;
  getSwapHandsOption(): ISwapHandsOption | null;
  isSwapHandsOption(): boolean;
}

export interface IModTapComposition extends IComposition {
  getKey(): IKeymap;
  getModifiers(): IMod[];
  getModDirection(): IModDirection;
}

export interface IUnicodeComposition extends IComposition {
  getCharCode(): number;
}

export interface ILooseKeycodeComposition extends IComposition {
  getKey(): IKeymap;
}

export class BasicComposition implements IBasicComposition {
  private readonly key: IKeymap;

  constructor(key: IKeymap) {
    this.key = key;
  }

  getCode(): number {
    return this.key.code & 0b1111_1111;
  }

  getKey(): IKeymap {
    return this.key;
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

  getCode(): number {
    const code = this.modifiers.reduce<number>((result, current) => {
      return result | (current << 8);
    }, 0);
    return code | (this.modDirection << 12) | (this.key.code & 0b1111_1111);
  }

  getKey(): IKeymap {
    return this.key;
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

  getKey(): IKeymap {
    return this.key;
  }

  getLayer(): number {
    return this.layer;
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
}

export class SwapHandsComposition implements ISwapHandsComposition {
  private readonly key: IKeymap | null;
  private readonly swapHandsOption: ISwapHandsOption | null;

  constructor(value: IKeymap | ISwapHandsOption) {
    if (typeof value === 'number') {
      this.key = null;
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

  getKey(): IKeymap | null {
    return this.key;
  }

  getSwapHandsOption(): ISwapHandsOption | null {
    return this.swapHandsOption;
  }

  isSwapHandsOption(): boolean {
    return this.swapHandsOption !== null;
  }
}

export class ModTapComposition implements IModTapComposition {
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

  getKey(): IKeymap {
    return this.key;
  }

  getModifiers(): IMod[] {
    return this.modifiers;
  }

  getModDirection(): IModDirection {
    return this.modDirection;
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
}

export class LooseKeycodeComposition implements ILooseKeycodeComposition {
  private readonly key: IKeymap;

  constructor(key: IKeymap) {
    this.key = key;
  }

  getCode(): number {
    return LOOSE_KEYCODE_MIN | this.key.code;
  }

  getKey(): IKeymap {
    return this.key;
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
}

export class KeycodeCompositionFactory implements IKeycodeCompositionFactory {
  private readonly code: number;

  constructor(code: number) {
    this.code = code;
  }

  getKind(): IKeycodeCompositionKind | null {
    const result = Object.keys(keycodeCompositionKindRangeMap).find((kind) => {
      const range =
        keycodeCompositionKindRangeMap[kind as IKeycodeCompositionKind];
      return range.min <= this.code && this.code <= range.max;
    }) as IKeycodeCompositionKind;
    return result || null;
  }

  isBasic(): boolean {
    return this.getKind() === KeycodeCompositionKind.basic;
  }

  isBasicFunc(): boolean {
    return keycodesBasicFunc.codes.includes(this.code);
  }

  isDefLayer(): boolean {
    return this.getKind() === KeycodeCompositionKind.def_layer;
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
    return this.getKind() === KeycodeCompositionKind.layer_tap_toggle;
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
    return this.getKind() === KeycodeCompositionKind.one_shot_layer;
  }

  isOneShotMod(): boolean {
    return this.getKind() === KeycodeCompositionKind.one_shot_mod;
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
    return this.getKind() === KeycodeCompositionKind.toggle_layer;
  }

  isUnicode(): boolean {
    return this.getKind() === KeycodeCompositionKind.unicode;
  }

  isUnknown(): boolean {
    return this.getKind() === null;
  }

  createBasicComposition(): IBasicComposition {
    if (!this.isBasic()) {
      throw new Error(
        `This code is not a basic key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const keyCode = this.code & 0b1111_1111;
    return new BasicComposition(KeycodeList.getKeymap(keyCode));
  }

  createModsComposition(): IModsComposition {
    if (!this.isMods()) {
      throw new Error(
        `This code is not a mods key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const keyCode = this.code & 0b1111_1111;
    const modDirection =
      (this.code & 0b1_0000_0000_0000) >> 12 === 1 ? MOD_RIGHT : MOD_LEFT;
    const modifiers = MODIFIERS.reduce<IMod[]>((result, current) => {
      if (((this.code >> 8) & 0b1111 & current) === current) {
        result.push(current);
      }
      return result;
    }, []);
    return new ModsComposition(
      modDirection,
      modifiers,
      KeycodeList.getKeymap(keyCode)
    );
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
    return new LayerTapComposition(layer, KeycodeList.getKeymap(keyCode));
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
      return new SwapHandsComposition(KeycodeList.getKeymap(value));
    }
  }

  createModTapComposition(): IModTapComposition {
    if (!this.isModTap()) {
      throw new Error(
        `This code is not a mod tap key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const keyCode = this.code & 0b1111_1111;
    const modifiers = MODIFIERS.reduce<IMod[]>((result, current) => {
      if (((this.code >> 8) & 0b1111 & current) === current) {
        result.push(current);
      }
      return result;
    }, []);
    const modDirection =
      ((this.code >> 12) & 0b0001) === MOD_RIGHT ? MOD_RIGHT : MOD_LEFT;
    return new ModTapComposition(
      modDirection,
      modifiers,
      KeycodeList.getKeymap(keyCode)
    );
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
    return new LooseKeycodeComposition(KeycodeList.getKeymap(this.code));
  }
}
