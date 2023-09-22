import { CSSProperties } from 'react';
import { KEY_SIZE } from '../components/configure/keycap/Keycap';
import { KeyOp } from '../gen/types/KeyboardDefinition';

export const OPTION_DEFAULT = '-';
const REGEXP_LABEL_POSITION = RegExp('^([1-9][0-9]*|0),([1-9][0-9]*|0).*');

export default class KeyModel {
  readonly location: string;
  readonly pos: string;
  readonly optionLabel: string;
  readonly option: string;
  readonly optionChoice: string;
  readonly top: number;
  readonly left: number;
  readonly height: number;
  readonly width: number;
  readonly color: string;
  readonly rotate: number;
  readonly rad: number;
  readonly originLeft: number;
  readonly originTop: number;
  readonly transformOrigin: string;
  readonly top2: number;
  readonly left2: number;
  readonly height2: number;
  readonly width2: number;
  readonly keyOp: KeyOp | null;
  readonly x: number;
  readonly y: number;
  readonly rx: number;
  readonly ry: number;
  readonly w: number;
  readonly h: number;
  readonly w2: number;
  readonly h2: number;
  readonly encoderId: number | null;

  constructor(
    op: KeyOp | null,
    location: string, // "col,row[\n\n\nOption,OptionChoice]"
    x: number,
    y: number,
    c: string,
    r: number = 0,
    rx: number = 0,
    ry: number = 0,
    encoderId: number | null = null
  ) {
    this.keyOp = op;
    this.x = x;
    this.y = y;
    this.rx = rx;
    this.ry = ry;
    this.encoderId = encoderId;
    this.location = location;
    const locs = location.split('\n');
    // If the location is only encoder ID like 'e0', the pos is empty.
    // This is for the case that the encoder is defined as like
    // "{a:3},"e0",{a:4}" or "{a:7},"e0",{a:4}".
    if (this.location.match(/^e[0-9]+$/i)) {
      this.pos = '';
    } else {
      this.pos = locs[0];
    }
    if (!this.includePosition(this.pos) && this.encoderId === null) {
      // If there is no position label and this is not an encoder,
      // this Key should be "Decal".
      this.keyOp = { ...(this.keyOp || {}), ...{ d: true } };
    }
    this.optionLabel = `${OPTION_DEFAULT},${OPTION_DEFAULT}`;
    if (4 <= locs.length && 0 < locs[3].length) {
      this.optionLabel = locs[3];
    }
    const options = this.optionLabel.split(',');
    this.option = options[0];
    this.optionChoice = options[1];
    this.left = x * KEY_SIZE;
    this.top = y * KEY_SIZE;

    if (c === '#aaaaaa' || c === '#777777') {
      this.color = c;
    } else {
      this.color = '#cccccc';
    }

    this.rotate = r;
    this.rad = (r * Math.PI) / 180;
    this.originLeft = rx * KEY_SIZE;
    this.originTop = ry * KEY_SIZE;
    this.transformOrigin = `${this.originLeft}px ${this.originTop}px`;

    let x2 = x;
    let y2 = y;
    if (op) {
      this.w = op.w || 1;
      this.h = op.h || 1;
      this.width = this.w * KEY_SIZE;
      this.height = this.h * KEY_SIZE;
      x2 = op.x2 ? x + op.x2 : x;
      y2 = op.y2 ? y + op.y2 : y;
      this.w2 = op.w2 || NaN;
      this.h2 = op.h2 || NaN;

      this.left2 = x2 * KEY_SIZE;
      this.top2 = y2 * KEY_SIZE;
      this.height2 = this.h2 * KEY_SIZE;
      this.width2 = this.w2 * KEY_SIZE;
    } else {
      this.w = 1;
      this.h = 1;
      this.width = KEY_SIZE;
      this.height = KEY_SIZE;
      this.left2 = x * KEY_SIZE;
      this.top2 = y * KEY_SIZE;
      this.height2 = NaN;
      this.width2 = NaN;
      this.w2 = NaN;
      this.h2 = NaN;
    }
  }

  private includePosition(pos: string) {
    if (!pos) return false;

    return REGEXP_LABEL_POSITION.test(pos);
  }

  get isDefault(): boolean {
    return this.option === OPTION_DEFAULT;
  }

  get isDecal(): boolean {
    return this.keyOp ? !!this.keyOp.d : false;
  }

  get isDefaultChoice(): boolean {
    return this.optionChoice == '0';
  }

  get isOddly(): boolean {
    return (
      !Number.isNaN(this.top2) &&
      !Number.isNaN(this.left2) &&
      !Number.isNaN(this.height2) &&
      !Number.isNaN(this.width2)
    );
  }

  get isIsoEnter(): boolean {
    return this.isOddly && this.top == this.top2;
  }

  get isBackwardsEnter(): boolean {
    return this.isOddly && this.top != this.top2;
  }

  get isEncoder(): boolean {
    return KeyModel.isEncoder(this.encoderId);
  }

  static isEncoder(encoderId: number | null): boolean {
    return encoderId !== null;
  }

  get isEncoderForRotaryOnly(): boolean {
    return this.isEncoder && !this.pos;
  }

  get style(): CSSProperties {
    return {
      width: this.width,
      height: this.height,
      background: this.color,
    };
  }

  get styleAbsolute(): CSSProperties {
    return {
      position: 'absolute',
      top: this.top,
      left: this.left,
      width: this.width,
      height: this.height,
      background: this.color,
    };
  }
  get styleAbsolute2(): CSSProperties {
    return {
      position: 'absolute',
      top: this.top2,
      left: this.left2,
      width: this.width2,
      height: this.height2,
      background: this.color,
    };
  }
  get styleTransform(): CSSProperties {
    if (Number.isNaN(this.originTop) || Number.isNaN(this.originLeft)) {
      return {
        transform: `rotate(${this.rotate}deg)`,
      };
    } else {
      return {
        transform: `rotate(${this.rotate}deg)`,
        transformOrigin: `${this.originLeft}px ${this.originTop}px`,
      };
    }
  }

  get endRight(): number {
    const rad = this.rad;
    const x0 = Math.max(
      this.left + this.width,
      this.left2 || 0 + this.width2 || 0
    );
    let y0 = 0;
    if (this.rotate < 0) {
      y0 = this.top + Math.max(this.height, this.height2 || 0);
    } else {
      y0 = this.top + Math.max(this.height, this.height2 || 0);
    }
    const x1 =
      (x0 - this.originLeft) * Math.cos(rad) -
      (y0 - this.originTop) * Math.sin(rad) +
      this.originLeft;
    return x1;
  }

  get endBottom(): number {
    const rad = this.rad;
    let x0 = 0;
    const y0 = this.top + Math.max(this.height, this.height2 || 0);
    if (0 < this.rotate) {
      x0 = this.left + Math.max(this.width, this.width2 || 0);
    } else {
      x0 = this.left;
    }
    const y1 =
      (x0 - this.originLeft) * Math.sin(rad) +
      (y0 - this.originTop) * Math.cos(rad) +
      this.originTop;
    return y1;
  }

  get startLeft(): number {
    const rad = this.rad;
    const x0 = this.left;
    let y0 = 0;
    if (0 < this.rotate) {
      y0 = this.top + Math.max(this.height, this.height2 || 0);
    } else {
      y0 = this.top;
    }
    const x1 =
      (x0 - this.originLeft) * Math.cos(rad) -
      (y0 - this.originTop) * Math.sin(rad) +
      this.originLeft;

    return x1;
  }
}
