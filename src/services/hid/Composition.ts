import { anyKeymap, MOD_LEFT, MOD_RIGHT } from './Constraints';

import { ICustomKeycode, IKeymap } from './Hid';
import { hexadecimal } from '../../utils/StringUtils';

import { keyInfoList } from './KeycodeInfoList';
import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';
import { bmpKeyInfoList } from './KeycodeInfoListBmp';
import {
  BasicComposition,
  IBasicComposition,
  QK_BASIC_MAX,
  QK_BASIC_MIN,
} from './compositions/BasicComposition';
import {
  IModsComposition,
  ModsComposition,
  QK_MODS_MAX,
  QK_MODS_MIN,
} from './compositions/ModsComposition';
import {
  IMacroComposition,
  MacroComposition,
  QK_MACRO_MAX,
  QK_MACRO_MIN,
} from './compositions/MacroComposition';
import {
  ILayerTapComposition,
  LayerTapComposition,
  QK_LAYER_TAP_MAX,
  QK_LAYER_TAP_MIN,
} from './compositions/LayerTapComposition';
import {
  IToComposition,
  QK_TO_MAX,
  QK_TO_MIN,
  ToComposition,
} from './compositions/ToComposition';
import {
  IMomentaryComposition,
  MomentaryComposition,
  QK_MOMENTARY_MAX,
  QK_MOMENTARY_MIN,
} from './compositions/MomentaryComposition';
import {
  DefLayerComposition,
  IDefLayerComposition,
  QK_DEF_LAYER_MAX,
  QK_DEF_LAYER_MIN,
} from './compositions/DefLayerComposition';
import {
  IToggleLayerComposition,
  QK_TOGGLE_LAYER_MAX,
  QK_TOGGLE_LAYER_MIN,
  ToggleLayerComposition,
} from './compositions/ToggleLayerComposition';
import {
  IOneShotLayerComposition,
  OneShotLayerComposition,
  QK_ONE_SHOT_LAYER_MAX,
  QK_ONE_SHOT_LAYER_MIN,
} from './compositions/OneShotLayerComposition';
import {
  IOneShotModComposition,
  OneShotModComposition,
  QK_ONE_SHOT_MOD_MAX,
  QK_ONE_SHOT_MOD_MIN,
} from './compositions/OneShotModComposition';
import {
  ISwapHandsComposition,
  OP_SH_OFF,
  OP_SH_OFF_ON,
  OP_SH_ON,
  OP_SH_ON_OFF,
  OP_SH_ONESHOT,
  OP_SH_TAP_TOGGLE,
  OP_SH_TOGGLE,
  QK_SWAP_HANDS_MAX,
  QK_SWAP_HANDS_MIN,
  SwapHandsComposition,
} from './compositions/SwapHandsComposition';
import {
  ITapDanceComposition,
  QK_TAP_DANCE_MAX,
  QK_TAP_DANCE_MIN,
  TapDanceComposition,
} from './compositions/TapDanceComposition';
import {
  ILayerModComposition,
  LayerModComposition,
  QK_LAYER_MOD_MAX,
  QK_LAYER_MOD_MIN,
} from './compositions/LayerModComposition';
import {
  ILayerTapToggleComposition,
  LayerTapToggleComposition,
  QK_LAYER_TAP_TOGGLE_MAX,
  QK_LAYER_TAP_TOGGLE_MIN,
} from './compositions/LayerTapToggleComposition';
import {
  IModTapComposition,
  ModTapComposition,
  QK_MOD_TAP_MAX,
  QK_MOD_TAP_MIN,
} from './compositions/ModTapComposition';
import {
  IUnicodeComposition,
  QK_UNICODE_MAX,
  QK_UNICODE_MIN,
  UnicodeComposition,
} from './compositions/UnicodeComposition';
import {
  BMP_MAX,
  BMP_MIN,
  ILooseKeycodeComposition,
  LooseKeycodeComposition,
  QK_AUDIO_MAX,
  QK_AUDIO_MIN,
  QK_JOYSTICK_MAX,
  QK_JOYSTICK_MIN,
  QK_LIGHTING_MAX,
  QK_LIGHTING_MIN,
  QK_MAGIC_MAX,
  QK_MAGIC_MIN,
  QK_MIDI_MAX,
  QK_MIDI_MIN,
  QK_PROGRAMMABLE_BUTTON_MAX,
  QK_PROGRAMMABLE_BUTTON_MIN,
  QK_QUANTUM_MAX,
  QK_QUANTUM_MIN,
  QK_SEQUENCER_MAX,
  QK_SEQUENCER_MIN,
  QK_STENO_MAX,
  QK_STENO_MIN,
  QK_USER_MAX,
  QK_USER_MIN,
} from './compositions/LooseKeycodeComposition';
import {
  IViaUserKeyComposition,
  VIA_USER_KEY_MAX,
  VIA_USER_KEY_MIN,
  ViaUserKeyComposition,
} from './compositions/ViaUserKeyComposition';
import {
  ASCII_MAX,
  ASCII_MIN,
  AsciiComposition,
  IAsciiComposition,
} from './compositions/AsciiComposition';

export type IKeycodeCompositionKind =
  | 'basic'
  | 'mods'
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
  | 'ascii'
  | 'via_user_key'
  | 'magic'
  | 'midi'
  | 'sequencer'
  | 'joystick'
  | 'programmable_button'
  | 'audio'
  | 'steno'
  | 'lighting'
  | 'quantum'
  | 'user'
  | 'bmp'
  | 'loose_keycode';
export const KeycodeCompositionKind: {
  // eslint-disable-next-line no-unused-vars
  [p in IKeycodeCompositionKind]: IKeycodeCompositionKind;
} = {
  basic: 'basic',
  mods: 'mods',
  macro: 'macro',
  layer_tap: 'layer_tap',
  to: 'to',
  momentary: 'momentary',
  df: 'df',
  tl: 'tl',
  osl: 'osl',
  osm: 'osm',
  tap_dance: 'tap_dance',
  tt: 'tt',
  layer_mod: 'layer_mod',
  swap_hands: 'swap_hands',
  mod_tap: 'mod_tap',
  unicode: 'unicode',
  ascii: 'ascii',
  via_user_key: 'via_user_key',
  magic: 'magic',
  midi: 'midi',
  sequencer: 'sequencer',
  joystick: 'joystick',
  programmable_button: 'programmable_button',
  audio: 'audio',
  steno: 'steno',
  lighting: 'lighting',
  quantum: 'quantum',
  user: 'user',
  bmp: 'bmp',
  loose_keycode: 'loose_keycode',
};

const keycodeCompositionKindRangeMap: {
  // eslint-disable-next-line no-unused-vars
  [p in keyof typeof KeycodeCompositionKind]: { min: number; max: number };
} = {
  basic: { min: QK_BASIC_MIN, max: QK_BASIC_MAX },
  mods: { min: QK_MODS_MIN, max: QK_MODS_MAX },
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
  via_user_key: { min: VIA_USER_KEY_MIN, max: VIA_USER_KEY_MAX },
  magic: { min: QK_MAGIC_MIN, max: QK_MAGIC_MAX },
  midi: { min: QK_MIDI_MIN, max: QK_MIDI_MAX },
  sequencer: { min: QK_SEQUENCER_MIN, max: QK_SEQUENCER_MAX },
  joystick: { min: QK_JOYSTICK_MIN, max: QK_JOYSTICK_MAX },
  programmable_button: {
    min: QK_PROGRAMMABLE_BUTTON_MIN,
    max: QK_PROGRAMMABLE_BUTTON_MAX,
  },
  audio: { min: QK_AUDIO_MIN, max: QK_AUDIO_MAX },
  steno: { min: QK_STENO_MIN, max: QK_STENO_MAX },
  lighting: { min: QK_LIGHTING_MIN, max: QK_LIGHTING_MAX },
  quantum: { min: QK_QUANTUM_MIN, max: QK_QUANTUM_MAX },
  user: { min: QK_USER_MIN, max: QK_USER_MAX },
  bmp: { min: BMP_MIN, max: BMP_MAX },
  ascii: { min: Number.MIN_VALUE, max: Number.MIN_VALUE }, // never match
  loose_keycode: { min: Number.MIN_VALUE, max: Number.MIN_VALUE }, // never match
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

export type IModDirectionLabel = 'left' | 'right';
export type IModDirection = typeof MOD_LEFT | typeof MOD_RIGHT;
// eslint-disable-next-line no-unused-vars
export const ModDirection: { [p in IModDirectionLabel]: IModDirection } = {
  left: MOD_LEFT,
  right: MOD_RIGHT,
};

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

export const DUMMY_KEYMAP: IKeymap = anyKeymap(0);

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

export interface ITapKey {
  genTapKey(): IKeymap | undefined;
}
export interface IComposition {
  getCode(): number;
  genKeymap(): IKeymap | undefined;
}

export interface IKeycodeCompositionFactory {
  isBasic(): boolean;
  isMods(): boolean;
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
  isViaUserKey(): boolean;
  getKind(): IKeycodeCompositionKind | null;
  createBasicComposition(): IBasicComposition;
  createModsComposition(): IModsComposition;
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
  createViaUserKeyComposition(
    // eslint-disable-next-line no-unused-vars
    customKeycodes: ICustomKeycode[] | undefined
  ): IViaUserKeyComposition;
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
    switch (result) {
      case KeycodeCompositionKind.magic:
      case KeycodeCompositionKind.midi:
      case KeycodeCompositionKind.sequencer:
      case KeycodeCompositionKind.joystick:
      case KeycodeCompositionKind.programmable_button:
      case KeycodeCompositionKind.audio:
      case KeycodeCompositionKind.steno:
      case KeycodeCompositionKind.lighting:
      case KeycodeCompositionKind.quantum:
      case KeycodeCompositionKind.user:
      case KeycodeCompositionKind.bmp: {
        let exist = keyInfoList.find(
          (info) => info.keycodeInfo.code === this.code
        );
        if (!exist) {
          exist = bmpKeyInfoList.find(
            (info) => info.keycodeInfo.code === this.code
          );
        }
        return exist ? KeycodeCompositionKind.loose_keycode : null;
      }
    }
    return result || null;
  }

  isBasic(): boolean {
    //return this.getKind() === KeycodeCompositionKind.basic;
    const km = BasicComposition.findKeymap(this.code, 'en-us');
    return Boolean(km);
  }

  isDefLayer(): boolean {
    return this.getKind() === KeycodeCompositionKind.df;
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

  isViaUserKey(): boolean {
    return this.getKind() === KeycodeCompositionKind.via_user_key;
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

  createMacroComposition(): IMacroComposition {
    if (!this.isMacro()) {
      throw new Error(
        `This code is not a macro key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const macroId = this.code & 0b0111_1111;
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
    const layer = this.code & 0b0001_1111;
    return new ToComposition(layer);
  }

  createMomentaryComposition(): IMomentaryComposition {
    if (!this.isMomentary()) {
      throw new Error(
        `This code is not a momentary key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const layer = this.code & 0b0001_1111;
    return new MomentaryComposition(layer);
  }

  createDefLayerComposition(): IDefLayerComposition {
    if (!this.isDefLayer()) {
      throw new Error(
        `This code is not a def layer key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const layer = this.code & 0b0001_1111;
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
    const layer = this.code & 0b0001_1111;
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
    const layer = this.code & 0b0001_1111;
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
    const layer = this.code & 0b0001_1111;
    return new LayerTapToggleComposition(layer);
  }

  createLayerModComposition(): ILayerModComposition {
    if (!this.isLayerMod()) {
      throw new Error(
        `This code is not a layer mod key code: ${hexadecimal(this.code, 16)}`
      );
    }
    const layer = (this.code >> 5) & 0b1111;
    const modifiers = MODIFIERS.reduce<IMod[]>((result, current) => {
      if ((this.code & 0x1f & current) === current) {
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

  createViaUserKeyComposition(
    customKeycodes: ICustomKeycode[] | undefined
  ): IViaUserKeyComposition {
    if (!this.isViaUserKey()) {
      throw new Error(
        `This code is not a via user key: ${hexadecimal(this.code, 16)}`
      );
    }
    return new ViaUserKeyComposition(
      ViaUserKeyComposition.findKeymap(this.code, customKeycodes)!
    );
  }
}
