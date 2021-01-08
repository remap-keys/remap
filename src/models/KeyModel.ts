import { CSSProperties } from 'react';
import { KEY_SIZE } from '../components/configure/keycap/Keycap';

export type KeyOp = {
  x?: number;
  y?: number;
  c?: string;
  w?: number;
  h?: number;
  r?: number;
  rx?: number;
  ry?: number;
  x2: number;
  y2: number;
  w2: number;
  h2: number;
};

export default class KeyModel {
  readonly pos: string;
  readonly top: number;
  readonly left: number;
  readonly height: number;
  readonly width: number;
  readonly color: string;
  readonly rotate: number;
  readonly originLeft: number;
  readonly originTop: number;
  readonly transformOrigin: string;
  readonly top2: number;
  readonly left2: number;
  readonly height2: number;
  readonly width2: number;
  readonly keyOp: KeyOp | null;

  constructor(
    op: KeyOp | null,
    location: string, // "col,row"
    x: number,
    y: number,
    w: number,
    h: number,
    c: string,
    r: number = 0,
    rx: number = 0,
    ry: number = 0,
    x2: number = 0,
    y2: number = 0,
    w2: number = NaN,
    h2: number = NaN
  ) {
    this.keyOp = op;
    this.pos = location;
    this.left = x * KEY_SIZE;
    this.top = y * KEY_SIZE;
    this.width = w * KEY_SIZE;
    this.height = h * KEY_SIZE;

    this.color = c;
    this.rotate = r;
    this.originLeft = rx * KEY_SIZE;
    this.originTop = ry * KEY_SIZE;
    this.transformOrigin = `${rx * KEY_SIZE}px ${ry * KEY_SIZE}px`;
    this.left2 = x2 * KEY_SIZE;
    this.top2 = y2 * KEY_SIZE;
    this.height2 = h2 * KEY_SIZE;
    this.width2 = w2 * KEY_SIZE;
  }

  get isOddly(): boolean {
    return (
      !Number.isNaN(this.top2) &&
      !Number.isNaN(this.left2) &&
      !Number.isNaN(this.height2) &&
      !Number.isNaN(this.width2)
    );
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
    const rad = this.rotate * (Math.PI / 180);
    const x0 = this.left - this.originLeft;
    const y0 = this.top - this.originTop;
    const x1 = x0 * Math.cos(rad) - y0 * Math.sin(rad);
    const right = Math.max(this.width, this.width2 || 0) * Math.sin(rad);
    return this.originLeft + x1 + this.width + right;
  }

  get endBottom(): number {
    const rad = this.rotate * (Math.PI / 180);
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
}
