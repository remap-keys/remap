import { DUMMY_KEYMAP, IComposition } from '../Composition';
import { IKeymap } from '../Hid';

export const QK_UNICODE_MIN = 0b1000_0000_0000_0000;
export const QK_UNICODE_MAX = 0b1111_1111_1111_1111;

export interface IUnicodeComposition extends IComposition {
  getCharCode(): number;
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
