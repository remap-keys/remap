import { IComposition } from '../Composition';
import { IKeymap } from '../Hid';
import { KEY_CATEGORY_ASCII } from '../KeyCategoryList';
import { hexadecimal } from '../../../utils/StringUtils';
import { keyInfoList } from '../KeycodeInfoList';
import { MOD_LEFT } from '../Constraints';

export const ASCII_MIN = 0b0000_0000_0000_0000;
export const ASCII_MAX = 0b0000_0000_0111_1111;

export interface IAsciiComposition extends IComposition {}

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
      AsciiComposition.createKeymap(code),
    );
    return AsciiComposition._keymaps;
  }

  static createKeymap(code: number): IKeymap {
    if (AsciiComposition.getSupportedAsciiCodes().includes(code)) {
      const label = Object.prototype.hasOwnProperty.call(
        AsciiComposition.LABEL_DICT,
        '' + code,
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
