import { IComposition, MOD_LEFT } from '../Composition';
import { IKeycodeCategoryInfo, IKeymap } from '../Hid';
import { bmpKeyInfoList } from '../KeycodeInfoListBmp';
import { KeyInfo, keyInfoList } from '../KeycodeInfoList';
import {
  KEY_SUB_CATEGORY_BACKLIGHT,
  KEY_SUB_CATEGORY_BOOTMAGIC,
  KEY_SUB_CATEGORY_COMBO,
  KEY_SUB_CATEGORY_GRAVE_ESCAPE,
  KEY_SUB_CATEGORY_KEYBOARD,
  KEY_SUB_CATEGORY_MACRO,
  KEY_SUB_CATEGORY_MIDI_CHANNEL,
  KEY_SUB_CATEGORY_MIDI_MISC,
  KEY_SUB_CATEGORY_MIDI_NOTES,
  KEY_SUB_CATEGORY_MIDI_OCTAVE,
  KEY_SUB_CATEGORY_MIDI_TRANSPOSE,
  KEY_SUB_CATEGORY_MIDI_VELOCITY,
  KEY_SUB_CATEGORY_SOUND,
  KEY_SUB_CATEGORY_SPACE_CADET,
  KEY_SUB_CATEGORY_TRI_LAYER,
  KEY_SUB_CATEGORY_UNDERGLOW,
} from '../KeyCategoryList';

export const LOOSE_KEYCODE_MIN = 0b0101_1100_0000_0000;
export const LOOSE_KEYCODE_MAX = 0b0101_1111_0111_1111;

export interface ILooseKeycodeComposition extends IComposition {}

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
      KEY_SUB_CATEGORY_MIDI_NOTES,
      KEY_SUB_CATEGORY_MIDI_OCTAVE,
      KEY_SUB_CATEGORY_MIDI_TRANSPOSE,
      KEY_SUB_CATEGORY_MIDI_VELOCITY,
      KEY_SUB_CATEGORY_MIDI_CHANNEL,
      KEY_SUB_CATEGORY_MIDI_MISC,
      KEY_SUB_CATEGORY_TRI_LAYER,
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
