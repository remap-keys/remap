import { IComposition } from '../Composition';
import { IKeymap } from '../Hid';
import { KeyInfo, keyInfoList } from '../KeycodeInfoList';
import { KEY_SUB_CATEGORY_MACRO } from '../KeyCategoryList';
import { MOD_LEFT } from '../Constraints';

export const QK_MACRO_MIN = 0b0111_0111_0000_0000;
export const QK_MACRO_MAX = 0b0111_0111_0111_1111;

export interface IMacroComposition extends IComposition {
  getMacroId(): number;
}

export class MacroComposition implements IMacroComposition {
  private readonly macroId: number;
  private static _macroKeymaps: IKeymap[];

  constructor(macroId: number) {
    this.macroId = macroId;
  }

  getCode(): number {
    return QK_MACRO_MIN | (this.macroId & 0b0111_1111);
  }

  getMacroId(): number {
    return this.macroId;
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

  static genKeymaps(): IKeymap[] {
    if (MacroComposition._macroKeymaps) return MacroComposition._macroKeymaps;

    const getKeyInfo = (code: number): KeyInfo | undefined => {
      return keyInfoList.find((info) => info.keycodeInfo.code === code);
    };

    MacroComposition._macroKeymaps = [];
    const kinds = KEY_SUB_CATEGORY_MACRO.kinds;
    KEY_SUB_CATEGORY_MACRO.codes.forEach((code) => {
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
        MacroComposition._macroKeymaps.push(keymap);
      }
    });

    return MacroComposition._macroKeymaps;
  }

  static findKeymap(code: number): IKeymap | undefined {
    const list: IKeymap[] = MacroComposition.genKeymaps();
    return list.find((km) => km.code === code);
  }
}
