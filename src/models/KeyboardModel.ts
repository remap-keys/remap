import { KeyOp } from '../gen/types/KeyboardDefinition';
import KeyModel, { OPTION_DEFAULT } from './KeyModel';
import { hasProperty } from '../utils/ObjectUtils';

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
    if (op.rx || op.ry) {
      this.rx = op.rx || 0;
      this.ry = op.ry || 0;
      this.x = this.rx + (op.x || 0);
      this.y = this.ry + (op.y || 0);
    } else {
      this.x += op.x || 0;
      this.y += op.y || 0;
    }

    this.r = op.r || this.r;
    this.x2 = op.x2 || this.x2;
    this.y2 = op.y2 || this.y2;
    this.c = op.c || this.c;
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
    return this.option == OPTION_DEFAULT || this.isOrigin;
  }

  get isOrigin(): boolean {
    return this.choice == '0';
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

  constructor(km: ((string | KeyOp)[] | { name: string })[]) {
    const _km = km.filter((item) => Array.isArray(item)) as (
      | string
      | KeyOp
    )[][];
    const keymap = this.parseKeyMap(_km);
    this.keymap = keymap;
  }

  getKeymap(
    options?: { option: string; optionChoice: string }[]
  ): { keymaps: KeyModel[]; width: number; height: number; left: number } {
    let keymaps = this.keymap;
    if (options) {
      keymaps = this.keymap.filter((item) => {
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

    let right = 0;
    let left = Infinity;
    let bottom = 0;
    keymaps.forEach((model) => {
      right = Math.max(right, model.endRight);
      left = Math.min(left, model.startLeft);
      bottom = Math.max(bottom, model.endBottom);
    });

    const width = right + left;
    const height = bottom;
    return { keymaps, width, height, left };
  }

  private parseKeyMap(keymap: (string | KeyOp)[][]) {
    const keymapsList: KeymapItem[][] = [];
    const optionKeymaps: {
      [option: string]: { [choice: string]: { [row: string]: KeymapItem[] } };
    } = {};
    const origKeymaps: { [row: string]: { [option: string]: KeymapItem } } = {};

    // STEP1: build  optionKeymaps
    const curr = new Current();
    for (let row = 0; row < keymap.length; row++) {
      const keyRow = keymap[row];
      keymapsList.push([]);

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
        if (!keymapItem.isDefault) {
          const option = keymapItem.option;
          const choice = keymapItem.choice;
          if (!hasProperty(optionKeymaps, option)) {
            optionKeymaps[option] = {};
          }
          if (!hasProperty(optionKeymaps[option], choice)) {
            optionKeymaps[option][choice] = {};
          }

          if (!hasProperty(optionKeymaps[option][choice], row)) {
            optionKeymaps[option][choice][row] = [];
          }
          optionKeymaps[option][choice][row].push(keymapItem);
        } else if (keymapItem.isOrigin) {
          if (!hasProperty(origKeymaps, row)) {
            origKeymaps[row] = {};
          }
          const option = keymapItem.option;
          if (!hasProperty(origKeymaps[row], option)) {
            origKeymaps[row][option] = keymapItem;
          }
        }
      }
    }

    // STEP2: align default keymap to zero, shrink for optional keys' layout
    if (Object.keys(optionKeymaps).length != 0) {
      const minX = keymapsList.reduce((min: number, keymaps: KeymapItem[]) => {
        return keymaps[0].isDefault ? Math.min(min, keymaps[0].x) : min;
      }, Infinity);
      const minY = keymapsList.filter(
        (keymaps: KeymapItem[]) => keymaps[0].isDefault
      )[0][0].y;

      keymapsList.forEach((keymaps: KeymapItem[]) => {
        keymaps.forEach((item) => item.align(minX, minY));
      });
    }

    /** STEP3: relocate option keys' position
     * 3.1. relocate for row direction
     * 3.2. relocate for col direction
     */
    // 3.1
    Object.keys(origKeymaps).forEach((row) => {
      Object.keys(origKeymaps[row]).forEach((option) => {
        const origCurr = origKeymaps[row][option].current;
        delete origKeymaps[row].option;
        Object.keys(optionKeymaps[option]).forEach((choice) => {
          if (hasProperty(optionKeymaps[option][choice], row)) {
            const choices = optionKeymaps[option][choice][row];
            const diffX =
              choices[0].x + choices[0].x2 - origCurr!.x + origCurr!.x2;
            choices.forEach((item: KeymapItem) => {
              item.align(diffX, 0);
            });
            delete optionKeymaps[option].choice;
          }
        });
      });
    });

    // 3.2
    Object.keys(optionKeymaps).forEach((option: string) => {
      const origRow = Object.keys(origKeymaps).find((row) =>
        hasProperty(origKeymaps[row], option)
      );
      const origCurr = origKeymaps[origRow!][option].current;
      Object.keys(optionKeymaps[option]).forEach((choice: string) => {
        const firstRow = Object.keys(optionKeymaps[option][choice])[0];
        const optionOrigItem = optionKeymaps[option][choice][firstRow][0];
        const diffY =
          optionOrigItem.y + optionOrigItem.y2 - origCurr!.y + origCurr!.y2;
        Object.keys(optionKeymaps[option][choice]).forEach((row: string) => {
          const rows: KeymapItem[] = optionKeymaps[option][choice][row];
          rows.forEach((item: KeymapItem) => {
            item.align(0, diffY);
          });
        });
      });
    });

    const list: KeyModel[] = [];
    keymapsList.flat().forEach((item: KeymapItem) => {
      let model = new KeyModel(item.op, item.label, item.x, item.y, item.c, item.r, item.rx, item.ry); // prettier-ignore
      list.push(model);
    });
    return list;
  }
}
