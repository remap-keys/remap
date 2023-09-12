import { IComposition } from '../Composition';
import { IKeycodeCategoryInfo, IKeymap } from '../Hid';
import { bmpKeyInfoList } from '../KeycodeInfoListBmp';
import { KeyInfo, keyInfoList } from '../KeycodeInfoList';
import {
  KEY_SUB_CATEGORY_AUDIO,
  KEY_SUB_CATEGORY_AUTO_CORRECT,
  KEY_SUB_CATEGORY_AUTO_SHIFT,
  KEY_SUB_CATEGORY_BACKLIGHT,
  KEY_SUB_CATEGORY_BLUETOOTH,
  KEY_SUB_CATEGORY_COMBO,
  KEY_SUB_CATEGORY_DYNAMIC_MACRO,
  KEY_SUB_CATEGORY_HAPTIC_FEEDBACK,
  KEY_SUB_CATEGORY_JOYSTICK,
  KEY_SUB_CATEGORY_KEY_OVERRIDE,
  KEY_SUB_CATEGORY_KEYBOARD,
  KEY_SUB_CATEGORY_LEADER_KEY,
  KEY_SUB_CATEGORY_MACRO,
  KEY_SUB_CATEGORY_MAGIC,
  KEY_SUB_CATEGORY_MIDI_CHANNEL,
  KEY_SUB_CATEGORY_MIDI_MISC,
  KEY_SUB_CATEGORY_MIDI_NOTES,
  KEY_SUB_CATEGORY_MIDI_OCTAVE,
  KEY_SUB_CATEGORY_MIDI_TRANSPOSE,
  KEY_SUB_CATEGORY_MIDI_VELOCITY,
  KEY_SUB_CATEGORY_ONE_SHOT_KEYS,
  KEY_SUB_CATEGORY_PROGRAMMABLE_BUTTON,
  KEY_SUB_CATEGORY_REPEAT_KEY,
  KEY_SUB_CATEGORY_SECURE,
  KEY_SUB_CATEGORY_SEQUENCER,
  KEY_SUB_CATEGORY_SPACE_CADET_SHIFT,
  KEY_SUB_CATEGORY_STENO,
  KEY_SUB_CATEGORY_TAPPING_TERM,
  KEY_SUB_CATEGORY_TRI_LAYER,
  KEY_SUB_CATEGORY_UNDERGLOW,
  KEY_SUB_CATEGORY_UNICODE_MODE,
  KEY_SUB_CATEGORY_USER,
} from '../KeyCategoryList';
import { MOD_LEFT } from '../Constraints';

export const QK_MAGIC_MIN = 0x7000;
export const QK_MAGIC_MAX = 0x70ff;

export const QK_MIDI_MIN = 0x7100;
export const QK_MIDI_MAX = 0x71ff;

export const QK_SEQUENCER_MIN = 0x7200;
export const QK_SEQUENCER_MAX = 0x73ff;

export const QK_JOYSTICK_MIN = 0x7400;
export const QK_JOYSTICK_MAX = 0x743f;

export const QK_PROGRAMMABLE_BUTTON_MIN = 0x7440;
export const QK_PROGRAMMABLE_BUTTON_MAX = 0x747f;

export const QK_AUDIO_MIN = 0x7480;
export const QK_AUDIO_MAX = 0x74bf;

export const QK_STENO_MIN = 0x74c0;
export const QK_STENO_MAX = 0x74ff;

export const QK_LIGHTING_MIN = 0x7800;
export const QK_LIGHTING_MAX = 0x78ff;

export const QK_QUANTUM_MIN = 0x7c00;
export const QK_QUANTUM_MAX = 0x7dff;

export const QK_USER_MIN = 0x7e40;
export const QK_USER_MAX = 0x7fff;

export const BMP_MIN = 0x5e00;
export const BMP_MAX = 0x5e1f;

export interface ILooseKeycodeComposition extends IComposition {}

export class LooseKeycodeComposition implements ILooseKeycodeComposition {
  private static _looseKeycodeKeymaps: IKeymap[];
  private readonly key: IKeymap;

  constructor(keymap: IKeymap) {
    this.key = keymap;
  }

  getCode(): number {
    return this.key.code;
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
      KEY_SUB_CATEGORY_MAGIC,
      KEY_SUB_CATEGORY_MIDI_NOTES,
      KEY_SUB_CATEGORY_MIDI_OCTAVE,
      KEY_SUB_CATEGORY_MIDI_TRANSPOSE,
      KEY_SUB_CATEGORY_MIDI_VELOCITY,
      KEY_SUB_CATEGORY_MIDI_CHANNEL,
      KEY_SUB_CATEGORY_MIDI_MISC,
      KEY_SUB_CATEGORY_SEQUENCER,
      KEY_SUB_CATEGORY_JOYSTICK,
      KEY_SUB_CATEGORY_PROGRAMMABLE_BUTTON,
      KEY_SUB_CATEGORY_AUDIO,
      KEY_SUB_CATEGORY_STENO,
      KEY_SUB_CATEGORY_BACKLIGHT,
      KEY_SUB_CATEGORY_UNDERGLOW,
      KEY_SUB_CATEGORY_TRI_LAYER,
      KEY_SUB_CATEGORY_COMBO,
      KEY_SUB_CATEGORY_KEYBOARD,
      KEY_SUB_CATEGORY_AUTO_SHIFT,
      KEY_SUB_CATEGORY_SPACE_CADET_SHIFT,
      KEY_SUB_CATEGORY_UNICODE_MODE,
      KEY_SUB_CATEGORY_HAPTIC_FEEDBACK,
      KEY_SUB_CATEGORY_DYNAMIC_MACRO,
      KEY_SUB_CATEGORY_ONE_SHOT_KEYS,
      KEY_SUB_CATEGORY_KEY_OVERRIDE,
      KEY_SUB_CATEGORY_SECURE,
      KEY_SUB_CATEGORY_TAPPING_TERM,
      KEY_SUB_CATEGORY_AUTO_CORRECT,
      KEY_SUB_CATEGORY_BLUETOOTH,
      KEY_SUB_CATEGORY_REPEAT_KEY,
      KEY_SUB_CATEGORY_LEADER_KEY,
      KEY_SUB_CATEGORY_USER,
      KEY_SUB_CATEGORY_MACRO,
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
