import { KEY_SIZE } from '../components/configure/keycap/Keycap';
import KeyModel, { KeyOp } from './KeyModel';

export default class KeyboardModel {
  readonly keymap: KeyModel[];
  readonly width: number;
  readonly height: number;

  constructor(km: (string | KeyOp)[][]) {
    const { keymap, width, height } = this.parseKeyMap(km);
    this.keymap = keymap;
    this.width = width;
    this.height = height;
  }

  private parseKeyMap(keymap: (string | KeyOp)[][]) {
    const list: KeyModel[] = [];
    let maxX = 0;
    let maxY = 0;
    let x = 0;
    let y = -1;
    for (let i = 0; i < keymap.length; i++) {
      const keys = keymap[i];
      y += 1;
      x = -1;
      for (let j = 0; j < keys.length; j++) {
        x += 1;
        const item: string | KeyOp = keys[j]; // KeyMapOp or string('rwo,col')
        let model = null;
        if (typeof item === 'string') {
          model = new KeyModel(x, y, item);
        } else {
          const op = item as KeyOp;
          if (op) {
            if (op.x) {
              x += op.x;
            }
            if (op.y) {
              y += op.y;
            }
          }
          const label = keys[++j] as string; // next item should be string(row,col)
          model = new KeyModel(x, y, label);
        }
        list.push(model);
      }
      maxX = Math.max(maxX, x);
    }
    maxY = y;
    return {
      keymap: list,
      width: (maxX + 1) * KEY_SIZE,
      height: (maxY + 1) * KEY_SIZE,
    };
  }
}
