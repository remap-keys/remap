import { KeyOp } from '../gen/types/KeyboardDefinition';
import KeyModel, { OPTION_DEFAULT } from './KeyModel';

class Current {
  x = 0;
  y = -1;
  c = '#cccccc';
  r = 0;
  rx = 0;
  ry = 0;
  x2 = 0;
  y2 = 0;

  constructor(curr?: Current) {
    if (curr) {
      this.x = curr.x;
      this.y = curr.y;
      this.c = curr.c;
      this.r = curr.r;
      this.rx = curr.rx;
      this.ry = curr.ry;
      this.x2 = curr.x2;
      this.y2 = curr.y2;
    }
  }

  minus(x: number, y: number) {
    this.x -= x;
    this.y -= y;
    this.rx -= x;
    this.ry -= y;
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

    if (op.x2) {
      this.x2 = op.x2;
    }

    if (op.y2) {
      this.y2 = op.y2;
    }

    if (op.c) {
      this.c = op.c;
    }
  }

  next(w: number) {
    this.x += w;
    this.x2 = 0;
    this.y2 = 0;
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
    const locs = label.split('\n\n\n');
    this.pos = locs[0];
    const options =
      locs.length == 2 ? locs[1].split(',') : [OPTION_DEFAULT, OPTION_DEFAULT];
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

  get x2(): number {
    return this._curr.x2;
  }

  get y2(): number {
    return this._curr.y2;
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
  private keymap: KeyModel[];
  readonly width: number;
  readonly height: number;

  constructor(km: ((string | KeyOp)[] | { name: string })[]) {
    const _km = km.filter((item) => Array.isArray(item)) as (
      | string
      | KeyOp
    )[][];
    const { keymap, width, height } = this.parseKeyMap(_km);
    this.keymap = keymap;
    this.width = width;
    this.height = height;
  }

  getKeymap(options?: { option: string; optionChoice: string }[]): KeyModel[] {
    if (!options) return this.keymap;

    return this.keymap.filter((item) => {
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

    // STEP1: build  optionKeymaps
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

    // STEP2: align default keymap to zero, shrink for optional keys' layout
    const minX = keymapsList.reduce((min: number, keymaps: KeymapItem[]) => {
      return keymaps[0].isDefault ? Math.min(min, keymaps[0].x) : min;
    }, Infinity);
    const minY = keymapsList.filter(
      (keymaps: KeymapItem[]) => keymaps[0].isDefault
    )[0][0].y;

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

    // STEP3: relocate option keys' position
    Object.keys(optionKeymaps).forEach((row: string) => {
      Object.keys(optionKeymaps[row]).forEach((option: string) => {
        Object.keys(optionKeymaps[row][option]).forEach((choice: string) => {
          const choices: KeymapItem[] = optionKeymaps[row][option][choice];
          const origCurr = searchOriginalPosition(Number(row), option);
          const diffX =
            choices[0].x + choices[0].x2 - origCurr!.x + origCurr!.x2;
          const diffY =
            choices[0].y + choices[0].y2 - origCurr!.y + origCurr!.y2;
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
      }
    });
    return {
      keymap: list,
      width: width,
      height: height,
    };
  }
}
