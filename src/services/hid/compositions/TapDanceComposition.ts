import { DUMMY_KEYMAP, IComposition } from '../Composition';
import { IKeymap } from '../Hid';

export const QK_TAP_DANCE_MIN = 0b0101_0111_0000_0000;
export const QK_TAP_DANCE_MAX = 0b0101_0111_1111_1111;

export interface ITapDanceComposition extends IComposition {
  getNo(): number;
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
