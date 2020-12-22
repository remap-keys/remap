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
};

export default class KeyModel {
  readonly label: string;
  readonly top: number;
  readonly left: number;
  readonly height: number;
  readonly width: number;
  readonly rotate: number;
  readonly originLeft: number;
  readonly originTop: number;
  readonly transformOrigin: string;
  constructor(
    label: string,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number = 0,
    rx: number = 0,
    ry: number = 0
  ) {
    this.label = label;
    this.top = y * KEY_SIZE;
    this.left = x * KEY_SIZE;
    this.height = h * KEY_SIZE;
    this.width = w * KEY_SIZE;
    this.rotate = r;
    this.originLeft = rx * KEY_SIZE;
    this.originTop = ry * KEY_SIZE;
    this.transformOrigin = `${rx * KEY_SIZE}px ${ry * KEY_SIZE}px`;
  }

  get style(): CSSProperties {
    return {
      width: this.width,
      height: this.height,
    };
  }

  get styleAbstruct(): CSSProperties {
    return {
      position: 'absolute',
      top: this.top,
      left: this.left,
      width: this.width,
      height: this.height,
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
    const x = this.left - this.originLeft;
    const y = this.top - this.originTop;
    const nextLeft = x * Math.cos(rad) - y * Math.sin(rad);
    const right = this.width * Math.sin(rad);
    return this.originLeft + nextLeft + this.width + right;
  }

  get endBottom(): number {
    const rad = this.rotate * (Math.PI / 180);
    const x = this.left - this.originLeft;
    const y = this.top - this.originTop;
    const nextTop = x * Math.sin(rad) + y * Math.cos(rad);
    const bottom = this.height * Math.cos(rad);
    return this.originTop + nextTop + bottom;
  }
}
