import { CSSProperties } from 'react';
import { KEY_SIZE } from '../components/configure/keycap/Keycap';
import { KeyOp } from '../gen/types/KeyboardDefinition';

export const OPTION_DEFAULT = '-';

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

  constructor(
    op: KeyOp | null,
    location: string, // "col,row[\n\n\nOption,OptionChoice]"
    x: number,
    y: number,
    c: string,
    r: number = 0,
    rx: number = 0,
    ry: number = 0
  ) {
    this.keyOp = op;
    this.x = x;
    this.y = y;
    this.rx = rx;
    this.ry = ry;
    this.location = location;
    const locs = location.split('\n');
    this.pos = locs[0];
    this.optionLabel =
      4 <= locs.length ? locs[3] : `${OPTION_DEFAULT},${OPTION_DEFAULT}`;
    const options = this.optionLabel.split(',');
    this.option = options[0];
    this.optionChoice = options[1];
    this.left = x * KEY_SIZE;
    this.top = y * KEY_SIZE;

    this.color = c;
    this.rotate = r;
    this.rad = (r * Math.PI) / 180;
    this.originLeft = rx * KEY_SIZE;
    this.originTop = ry * KEY_SIZE;
    this.transformOrigin = `${rx * KEY_SIZE}px ${ry * KEY_SIZE}px`;

    if (op) {
      this.w = op.w || 1;
      this.h = op.h || 1;
      this.width = this.w * KEY_SIZE;
      this.height = this.h * KEY_SIZE;
      const x2 = op.x2 ? x + op.x2 : x;
      const y2 = op.y2 ? y + op.y2 : y;
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

  get isJisEnter(): boolean {
    return this.isOddly && this.top == this.top2;
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
    if (this.rotate < 0) {
      const x0 = this.left - this.originLeft;
      const y0 =
        this.top - this.originTop + Math.max(this.height, this.height2 || 0);
      const x1 = x0 * Math.cos(rad) - y0 * Math.sin(rad);
      const right0 = Math.max(this.width, this.width2 || 0) * Math.cos(rad);
      const right = this.originLeft + x1 + right0;
      console.log(`pos: ${this.pos}, r:${this.rotate}, right:${right}`);
      return right;
    } else {
      const x0 = this.left - this.originLeft;
      const y0 = this.top - this.originTop;
      const x1 = x0 * Math.cos(rad) - y0 * Math.sin(rad);
      let right = this.width * Math.cos(rad);
      if (this.width2) {
        let right2;
        if (this.keyOp && this.keyOp.x2) {
          right2 = (this.width2 + this.keyOp.x2 * KEY_SIZE) * Math.cos(rad);
        } else {
          right2 = this.width2 * Math.cos(rad);
        }
        right = Math.max(right, right2);
      }
      return this.originLeft + x1 + right;
    }
  }

  get endBottom(): number {
    const rad = this.rad;
    const x0 = Math.min(this.left, this.left2) - this.originLeft; // left-top
    const y0 = this.top - this.originTop;
    const y1 = x0 * Math.sin(rad) + y0 * Math.cos(rad);
    const leftBottom =
      Math.max(this.height || 0, this.height2 || 0) * Math.cos(rad);

    const rightBottom =
      leftBottom +
      Math.max(this.width, this.width2 + (this.left2 - this.left) || 0) *
        Math.sin(rad);

    const bottom = 0 < rad ? rightBottom : leftBottom;
    return this.originTop + y1 + bottom;
  }

  get startLeft(): number {
    const rad = this.rad;
    let x = 0;
    if (this.rotate < 0) {
      let x0 = this.left - this.originLeft;
      let y0 = this.top - this.originTop;
      x = this.originLeft + x0 * Math.cos(rad) - y0 * Math.sin(rad);
    } else if (0 < this.rotate) {
      let x0 = this.left - this.originLeft;
      let y0 =
        this.top - this.originTop + Math.max(this.height, this.height2 || 0);
      x = this.originLeft + x0 * Math.cos(rad) - y0 * Math.sin(rad);
      console.log(`pos: ${this.pos}, r:${this.rotate}, left:${x}`);
    }
    return x;
  }
}
