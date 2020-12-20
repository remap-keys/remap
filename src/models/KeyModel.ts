import { CSSProperties } from 'react';
import { KEY_SIZE } from '../components/configure/keycap/Keycap';
export type KeyOp = {
  x?: number;
  y?: number;
  c?: string;
  w?: number;
  h?: number;
};

export default class KeyModel {
  readonly label: string;
  readonly top: number;
  readonly left: number;
  constructor(x: number, y: number, label: string) {
    this.label = label;
    this.top = y * KEY_SIZE;
    this.left = x * KEY_SIZE;
  }

  get abstructStyle(): CSSProperties {
    return { position: 'absolute', top: this.top, left: this.left };
  }
}
