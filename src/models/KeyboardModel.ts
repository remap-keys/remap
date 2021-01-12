import { KeyOp } from '../gen/types/KeyOp';
import KeyModel, { OPTION_DEFAULT } from './KeyModel';

export default class KeyboardModel {
  private _keymap: KeyModel[];
  readonly width: number;
  readonly height: number;
  private _keymaps: {
    [option: string]: { [choice: string]: KeyModel[] };
  };

  constructor(km: (string | KeyOp)[][]) {
    const { keymap, keymaps, width, height } = this.parseKeyMap(km);
    this._keymap = keymap;
    this._keymaps = keymaps;
    this.width = width;
    this.height = height;
  }

  getKeymap(option: string = OPTION_DEFAULT, choice: number = 0): KeyModel[] {
    return this._keymaps[option][choice];
  }

  private parseKeyMap(keymap: (string | KeyOp)[][]) {
    const models: { [option: string]: { [choice: string]: KeyModel[] } } = {};
    const list: KeyModel[] = [];
    let width = 0;
    let height = 0;
    let r = 0;
    let rx = 0;
    let ry = 0;
    let y = -1;
    let c: string = '#cccccc';
    for (let i = 0; i < keymap.length; i++) {
      const keyRow = keymap[i];
      y = ry ? ry : y + 1; // inclement from the last key's y or set origin-y
      let x = rx ? rx : 0;
      for (let j = 0; j < keyRow.length; j++) {
        const item: string | KeyOp = keyRow[j]; // KeyMapOp or string('rwo,col')
        let model = null;
        let h = 1;
        let w = 1;

        if (typeof item === 'string') {
          model = new KeyModel(i, null, item, x, y, w, h, c, r, rx, ry); // no ops for this key
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

          const label = keyRow[++j] as string; // next item should be string(row,col)
          model = new KeyModel(
            i,
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
        if (!(model.option in models)) {
          models[model.option] = {};
        }
        if (!(model.optionChoice in models[model.option])) {
          models[model.option][model.optionChoice] = [];
        }
        models[model.option][model.optionChoice].push(model);

        if (model.isDefault) {
          width = Math.max(width, model.endRight);
          height = Math.max(height, model.endBottom);
        }
      }
    }

    this.relocateOptions(models);

    return {
      keymap: list,
      keymaps: models,
      width: width,
      height: height,
    };
  }

  private relocateOptions(models: {
    [option: string]: { [choice: string]: KeyModel[] };
  }) {
    let optionIndex = 0;
    let choiceIndex = 1;
    while (optionIndex in models) {
      const base: KeyModel[] = models[optionIndex][0];
      while (choiceIndex in models[optionIndex]) {
        const rows: KeyModel[] = models[optionIndex][choiceIndex];
        choiceIndex++;
      }
      optionIndex++;
    }
  }
}
