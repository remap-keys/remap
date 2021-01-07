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
    let width = 0;
    let height = 0;
    let r = 0;
    let rx = 0;
    let ry = 0;
    let y = -1;
    let c: string = '#cccccc';
    for (let i = 0; i < keymap.length; i++) {
      const keys = keymap[i];
      y = ry ? ry : y + 1; // inclement from the last key's y or set origin-y
      let x = rx ? rx : 0;
      for (let j = 0; j < keys.length; j++) {
        const item: string | KeyOp = keys[j]; // KeyMapOp or string('rwo,col')
        let model = null;
        let h = 1;
        let w = 1;

        if (typeof item === 'string') {
          model = new KeyModel(null, item, x, y, w, h, c, r, rx, ry); // no ops for this key
        } else {
          const op = item as KeyOp;

          if (op.rx) {
            rx = op.rx;
            x = rx;
          }
          if (op.ry) {
            ry = op.ry;
            y = ry;
          }
          if (op.x) {
            x += op.x;
          }
          if (op.y) {
            y += op.y;
          }

          h = op.h || h;
          w = op.w || w;
          r = op.r || r;
          c = op.c || c;
          let x2 = op.x2 ? x + op.x2 : x;
          let y2 = op.y2 ? y + op.y2 : y;
          let w2 = op.w2 || NaN;
          let h2 = op.h2 || NaN;

          const label = keys[++j] as string; // next item should be string(row,col)
          model = new KeyModel(
            op,
            label,
            x,
            y,
            w,
            h,
            c,
            r,
            rx,
            ry,
            x2,
            y2,
            w2,
            h2
          );
        }
        x += w;
        list.push(model);
        width = Math.max(width, model.endRight);
        height = Math.max(height, model.endBottom);
      }
    }

    return {
      keymap: list,
      width: width,
      height: height,
    };
  }
}
