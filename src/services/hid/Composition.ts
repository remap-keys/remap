export const QK_BASIC_MIN = 0b0000_0000_0000_0000;
export const QK_BASIC_MAX = 0b0000_0000_1111_1111;

export const QK_MODS_MIN = 0b0000_0001_0000_0000;
export const QK_LCTL = 0b0000_0001_0000_0000;
export const QK_LSFT = 0b0000_0010_0000_0000;
export const QK_LALT = 0b0000_0100_0000_0000;
export const QK_LGUI = 0b0000_1000_0000_0000;
export const QK_RCTL = 0b0001_0001_0000_0000;
export const QK_RSFT = 0b0001_0010_0000_0000;
export const QK_RALT = 0b0001_0100_0000_0000;
export const QK_RGUI = 0b0001_1000_0000_0000;
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

export interface IKeycodeComposition {
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
}

export class KeycodeComposition implements IKeycodeComposition {
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
}
