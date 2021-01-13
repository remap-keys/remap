import { isConstructorDeclaration } from 'typescript';
import { KeyOp } from '../gen/types/KeyOp';
import KeyModel, { OPTION_DEFAULT } from './KeyModel';

class Current {
  x = 0;
  y = 0;
  c = '#cccccc';
  r = 0;
  rx = 0;
  ry = 0;

  constructor(curr?: Current) {
    if (curr) {
      this.x = curr.x;
      this.y = curr.y;
      this.c = curr.c;
      this.r = curr.r;
      this.rx = curr.rx;
      this.ry = curr.ry;
    }
  }

  minus(x: number, y: number) {
    this.x -= x;
    this.y -= y;
  }

  nextRow() {
    this.x = this.rx ? this.rx : 0;
    this.y = this.ry ? this.ry : this.y + 1;
  }

  setOp(op: KeyOp) {
    if (op.rx) {
      this.rx = op.rx;
      this.x = op.rx;
    }
    if (op.ry) {
      this.ry = op.ry;
      this.y = op.ry;
    }
    if (op.x) {
      this.x += op.x;
    }
    if (op.y) {
      this.y += op.y;
    }

    if (op.r) {
      this.r = op.r;
    }

    if (op.c) {
      this.c = op.c;
    }
  }

  next(w: number) {
    this.x += w;
  }
}

class KeymapItem {
  private _curr: Current;
  readonly op: KeyOp | null;
  readonly label: string;
  private pos: string;
  readonly option: string;
  readonly choice: string;

  constructor(curr: Current, label: string, op: KeyOp | null = null) {
    this._curr = new Current(curr);
    this.op = op;
    this.label = label;
    const locs = `${label}\n\n\n${OPTION_DEFAULT},${OPTION_DEFAULT}`.slice(
      0,
      9
    );
    this.pos = locs.slice(0, 3);
    const options = locs.slice(6, 9).split(',');
    this.option = options[0];
    this.choice = options[1];
  }

  get isDefault(): boolean {
    return this.option == OPTION_DEFAULT;
  }

  get current(): Current {
    return Object.assign({}, this._curr);
  }

  get x(): number {
    return this._curr.x;
  }

  get y(): number {
    return this._curr.y;
  }

  get c(): string {
    return this._curr.c;
  }

  get r(): number {
    return this._curr.r;
  }

  get rx(): number {
    return this._curr.rx;
  }

  get ry(): number {
    return this._curr.ry;
  }

  get w(): number {
    if (this.op && this.op.w) {
      return this.op.w;
    }
    return 1;
  }

  align(x: number, y: number) {
    this._curr.minus(x, y);
  }

  relocate(curr: Current) {
    this._curr = curr;
  }
}

export default class KeyboardModel {
  private _keymap: KeyModel[];
  readonly width: number;
  readonly height: number;

  constructor(km: (string | KeyOp)[][]) {
    const { keymap, width, height } = this.parseKeyMap(km);
    this._keymap = keymap;
    this.width = width;
    this.height = height;
  }

  getKeymap(options?: { option: string; optionChoice: string }[]): KeyModel[] {
    if (!options) return this._keymap;

    return this._keymap.filter((item) => {
      return (
        item.isDefault ||
        0 <=
          options.findIndex(
            (op) =>
              op.option == item.option && op.optionChoice == item.optionChoice
          )
      );
    });
  }

  private parseKeyMap(keymap: (string | KeyOp)[][]) {
    const optionKeymaps: {
      [row: string]: { [option: string]: { [choice: string]: KeymapItem[] } };
    } = {};
    const keymapsList: KeymapItem[][] = [];

    // STEP1: build  layerKeymaps
    const curr = new Current();
    for (let row = 0; row < keymap.length; row++) {
      const keyRow = keymap[row];
      keymapsList.push([]);
      optionKeymaps[row] = {};

      curr.nextRow();
      for (let col = 0; col < keyRow.length; col++) {
        const item: string | KeyOp = keyRow[col]; // KeyMapOp or string('rwo,col')
        let keymapItem = null;

        if (typeof item === 'string') {
          keymapItem = new KeymapItem(curr, item);
        } else {
          const op = item as KeyOp;
          const label = keyRow[++col] as string; // next item should be string(row,col)
          curr.setOp(op);
          keymapItem = new KeymapItem(curr, label, op);
        }
        curr.next(keymapItem.w);

        keymapsList[row].push(keymapItem);
        if (!keymapItem.isDefault && keymapItem.choice != '0') {
          const option = keymapItem.option;
          const choice = keymapItem.choice;
          if (!Object.prototype.hasOwnProperty.call(optionKeymaps[row], option))
            optionKeymaps[row][option] = {};
          if (
            !Object.prototype.hasOwnProperty.call(
              optionKeymaps[row][option],
              choice
            )
          )
            optionKeymaps[row][option][choice] = [];
          optionKeymaps[row][option][choice].push(keymapItem);
        }
      }
    }

    // STEP2: align default keymap to zero
    const minX = keymapsList.reduce((min: number, keymaps: KeymapItem[]) => {
      return keymaps[0].isDefault ? Math.min(min, keymaps[0].x) : min;
    }, Infinity);
    const minY = keymapsList.reduce((min: number, keymaps: KeymapItem[]) => {
      return keymaps.reduce((m, item) => Math.min(item.y, m), min);
    }, Infinity);
    keymapsList.forEach((keymaps: KeymapItem[]) => {
      keymaps.forEach((item) => item.align(minX, minY));
    });

    const searchOriginalPosition = (targetRow: number, option: string) => {
      // search same row
      const findOrigin = (keymaps: KeymapItem[]): KeymapItem | undefined => {
        return keymaps.find(
          (item: KeymapItem) => item.option == option && item.choice == '0'
        );
      };

      let targetItem: KeymapItem | undefined = findOrigin(
        keymapsList[targetRow]
      );
      if (targetItem) return targetItem.current;

      // search below row
      for (let i = targetRow + 1; i < keymapsList.length; i++) {
        targetItem = findOrigin(keymapsList[i]);
        if (targetItem) break;
      }
      if (targetItem) return targetItem.current;

      // search above row
      for (let i = targetRow - 1; i >= 0; i--) {
        targetItem = findOrigin(keymapsList[i]);
        if (targetItem) break;
      }
      if (targetItem) return targetItem.current;
    };

    // STEP3: relocate option layouts
    Object.keys(optionKeymaps).forEach((row: string) => {
      Object.keys(optionKeymaps[row]).forEach((option: string) => {
        Object.keys(optionKeymaps[row][option]).forEach((choice: string) => {
          const choices: KeymapItem[] = optionKeymaps[row][option][choice];
          const origCurr = searchOriginalPosition(Number(row), option);
          const diffX = choices[0].x - origCurr!.x;
          const diffY = choices[0].y - origCurr!.y;
          choices.forEach((item: KeymapItem) => {
            item.align(diffX, diffY);
          });
        });
      });
    });

    let width = 0;
    let height = 0;
    const list: KeyModel[] = [];
    keymapsList.flat().forEach((item: KeymapItem) => {
      let model = new KeyModel(item.op, item.label, item.x, item.y, item.c, item.r, item.rx, item.ry); // prettier-ignore
      list.push(model);
      if (model.isDefault || model.optionChoice == '0') {
        width = Math.max(width, model.endRight);
        height = Math.max(height, model.endBottom);
        if (Number.isNaN(height)) {
          console.log(model.location);
        }
      }
    });
    return {
      keymap: list,
      width: width,
      height: height,
    };
  }

  private parseKeyMap0(keymap: (string | KeyOp)[][]) {
    const models: { [option: string]: { [choice: string]: KeyModel[] } } = {};
    const list: KeyModel[] = [];

    let width = 0;
    let height = 0;
    let r = 0;
    let rx = 0;
    let ry = 0;
    let y = -1;
    let c: string = '#cccccc';
    for (let row = 0; row < keymap.length; row++) {
      const keyRow = keymap[row];
      y = ry ? ry : y + 1; // inclement from the last key's y or set origin-y
      let x = rx ? rx : 0;
      for (let j = 0; j < keyRow.length; j++) {
        const item: string | KeyOp = keyRow[j]; // KeyMapOp or string('rwo,col')
        let model = null;

        if (typeof item === 'string') {
          model = new KeyModel(null, item, x, y, c, r, rx, ry); // no ops for this key
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

          r = op.r || r;
          c = op.c || c;

          const label = keyRow[++j] as string; // next item should be string(row,col)
          model = new KeyModel(op, label, x, y, c, r, rx, ry); // prettier-ignore
        }
        x += model.w;
        list.push(model);
        if (!(model.option in models)) {
          models[model.option] = {};
        }
        if (!(model.optionChoice in models[model.option])) {
          models[model.option][model.optionChoice] = [];
        }
        models[model.option][model.optionChoice].push(model);

        // TODO: calc width and height including layout options
        if (model.isDefault) {
          width = Math.max(width, model.endRight);
          height = Math.max(height, model.endBottom);
        }
      }
    }

    //this.relocateOptions(models);
    let optionIndex = 0;
    let choiceIndex = 1;
    while (optionIndex in models) {
      const base: KeyModel = models[optionIndex][0][0];
      while (choiceIndex in models[optionIndex]) {
        let x = base.x;
        let y = base.y;
        const rows: KeyModel[] = models[optionIndex][choiceIndex];
        choiceIndex++;
      }
      optionIndex++;
    }

    console.log(width);
    console.log(height);
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
