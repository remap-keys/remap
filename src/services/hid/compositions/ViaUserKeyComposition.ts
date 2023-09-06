import { IComposition } from '../Composition';
import { ICustomKeycode, IKeymap } from '../Hid';
import { KeyInfo, keyInfoList } from '../KeycodeInfoList';
import { KEY_SUB_CATEGORY_VIA_USER_KEY } from '../KeyCategoryList';
import { MOD_LEFT } from '../Constraints';

export const VIA_USER_KEY_MIN = 0b0111_1110_0000_0000; // This is same as QK_KB_0.
export const VIA_USER_KEY_MAX = 0b0111_1110_0001_1111; // This is same as QK_KB_31.

export interface IViaUserKeyComposition extends IComposition {}

export class ViaUserKeyComposition implements IViaUserKeyComposition {
  private readonly key: IKeymap;

  constructor(keymap: IKeymap) {
    this.key = keymap;
  }

  getCode(): number {
    return VIA_USER_KEY_MIN | this.key.code;
  }

  genKeymap(): IKeymap {
    return JSON.parse(JSON.stringify(this.key));
  }

  static genKeymaps(customKeycodes: ICustomKeycode[] | undefined): IKeymap[] {
    // It is necessary to generate keymaps every time for custom keycodes.

    const getKeyInfo = (code: number): KeyInfo | undefined => {
      return keyInfoList.find((info) => info.keycodeInfo.code === code);
    };

    const viaUserKeymaps: IKeymap[] = [];
    const kinds = KEY_SUB_CATEGORY_VIA_USER_KEY.kinds;
    KEY_SUB_CATEGORY_VIA_USER_KEY.codes.forEach((code, index) => {
      let info: KeyInfo | undefined;
      const keyInfo = getKeyInfo(code);
      if (customKeycodes && customKeycodes[index] && keyInfo) {
        const customKeycode = customKeycodes[index];
        info = {
          desc: customKeycode.title || keyInfo.desc,
          keycodeInfo: {
            code,
            label: customKeycode.name || keyInfo.keycodeInfo.label,
            name: {
              long: customKeycode.name || keyInfo.keycodeInfo.name.long,
              short: customKeycode.shortName || keyInfo.keycodeInfo.name.short,
            },
            keywords: customKeycode.shortName
              ? [customKeycode.shortName]
              : keyInfo.keycodeInfo.keywords,
          },
        };
      } else {
        info = keyInfo;
      }
      if (info) {
        const keymap: IKeymap = {
          code,
          isAny: false,
          direction: MOD_LEFT,
          modifiers: [],
          keycodeInfo: info.keycodeInfo,
          kinds: kinds,
          desc: info.desc,
        };
        viaUserKeymaps.push(keymap);
      }
    });

    return viaUserKeymaps;
  }

  static findKeymap(
    code: number,
    customKeycodes: ICustomKeycode[] | undefined
  ): IKeymap | undefined {
    const list: IKeymap[] = ViaUserKeyComposition.genKeymaps(customKeycodes);
    return list.find((km) => km.code === code);
  }
}
