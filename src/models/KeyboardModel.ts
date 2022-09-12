import { KeyOp } from '../gen/types/KeyboardDefinition';
import KeyModel, { OPTION_DEFAULT } from './KeyModel';
import { hasProperty } from '../utils/ObjectUtils';
import { LayoutOption } from '../components/configure/keymap/Keymap';

export type KeyboardViewContent = {
  keymaps: KeyModel[];
  width: number;
  height: number;
  left: number;
  top: number;
};

export class Current {
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
    this.x = this.x - x;
    this.y = this.y - y;
    if (this.r != 0) {
      this.rx = this.rx - x;
      this.ry = this.ry - y;
    }
  }

  nextRow(item: string | KeyOp) {
    this.x = this.rx ? this.rx : 0;

    if (typeof item === 'string') {
      this.y = this.y + 1;
    } else {
      if (item.ry) {
        this.y = item.ry;
      } else {
        this.y = this.y + 1;
      }
    }
  }

  setOp(op: KeyOp) {
    if (op.rx || op.ry) {
      this.rx = op.rx != undefined ? op.rx : this.rx;
      this.ry = op.ry != undefined ? op.ry : this.ry;
      this.x = this.rx + (op.x || 0);
      this.y = this.ry + (op.y || 0);
    } else {
      this.x += op.x || 0;
      this.y += op.y || 0;
    }

    this.r = op.r != undefined ? op.r : this.r;
    this.x2 = op.x2 != undefined ? op.x2 : this.x2;
    this.y2 = op.y2 != undefined ? op.y2 : this.y2;
    this.c = op.c != undefined ? op.c : this.c;
  }

  next(w: number) {
    this.x += w;
    this.x2 = 0;
    this.y2 = 0;
  }
}

export class KeymapItem {
  private _curr: Current;
  readonly op: KeyOp;
  readonly label: string;
  readonly option: string;
  readonly choice: string;
  private _toBeDelete: boolean;
  private readonly _encoderId: number | null;

  constructor(curr: Current, label: string, op: KeyOp | null = null) {
    this._curr = new Current(curr);
    this.op = op || {};
    this.label = label;
    const locs = label.split('\n');
    const options =
      4 <= locs.length && 0 < locs[3].length
        ? locs[3].split(',')
        : [OPTION_DEFAULT, OPTION_DEFAULT];
    this.option = options[0];
    this.choice = options[1];
    this._encoderId =
      10 <= locs.length && locs[9].match(/^e[0-9]+$/i)
        ? Number(locs[9].substring(1))
        : null;
    this._toBeDelete = false;
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

  get toBeDeleted(): boolean {
    return this._toBeDelete;
  }

  set toBeDeleted(flag: boolean) {
    this._toBeDelete = flag;
  }

  align(x: number, y: number) {
    this._curr.minus(x, y);
  }

  relocate(curr: Current) {
    this._curr = curr;
  }

  get encoderId(): number | null {
    return this._encoderId;
  }
}

export default class KeyboardModel {
  private _keyModels: KeyModel[];

  constructor(km: ((string | KeyOp)[] | { name: string })[]) {
    const _km = km.filter((item) => Array.isArray(item)) as (
      | string
      | KeyOp
    )[][];
    const keymap = this.parseKeyMap(_km);
    this._keyModels = keymap;
  }

  get keyModels() {
    return this._keyModels;
  }

  getKeymap(options?: LayoutOption[]): KeyboardViewContent {
    let keymaps = this._keyModels;
    if (options) {
      keymaps = this._keyModels.filter((item) => {
        return (
          item.isDefault ||
          0 <=
            options.findIndex(
              (op) =>
                op.option == Number(item.option) &&
                op.optionChoice == Number(item.optionChoice)
            )
        );
      });
    }

    let right = 0;
    let left = Infinity;
    let bottom = 0;
    let top = Infinity;
    keymaps.forEach((model) => {
      if (!model.isDecal) {
        right = Math.max(right, model.endRight);
        left = Math.min(left, model.startLeft);
        bottom = Math.max(bottom, model.endBottom);
        top = Math.min(top, model.top);
      }
    });

    const width = right - left;
    const height = bottom - top;

    return { keymaps, width, height, left, top };
  }

  private parseKeyMap(keymap: (string | KeyOp)[][]) {
    type Position = {
      left: number;
      top: number;
    };

    const keymapsList: KeymapItem[][] = [];
    const optionKeymaps: {
      [option: string]: { [choice: string]: KeymapItem[] };
    } = {};

    // STEP1: build  optionKeymaps
    const curr = new Current();
    for (let row = 0; row < keymap.length; row++) {
      const keyRow = keymap[row];
      keymapsList.push([]);

      curr.nextRow(keyRow[0]);
      for (let col = 0; col < keyRow.length; col++) {
        const item: string | KeyOp = keyRow[col]; // KeyMapOp or string('rwo,col')
        let keymapItem: KeymapItem;

        if (typeof item === 'string') {
          keymapItem = new KeymapItem(curr, item);
        } else {
          let op = item as KeyOp;
          let nextOp = keyRow[++col];
          while (typeof nextOp != 'string' && col < keyRow.length) {
            // in case of continuing KeyOp
            op = Object.assign({}, op, nextOp);
            nextOp = keyRow[++col];
          }
          curr.setOp(op);

          if (nextOp) {
            const label = nextOp as string;
            keymapItem = new KeymapItem(curr, label, op);
          } else {
            // if the row ends KeyOp, the nextOp is undefined
            op = Object.assign({}, op, { d: true });
            keymapItem = new KeymapItem(curr, '', op); // cause of no label, the key should be disappeared
          }
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
            optionKeymaps[option][choice] = [];
          }

          optionKeymaps[option][choice].push(keymapItem);
        }
      }
    }

    // STEP2: shrink default keymap for optional keys' margin
    const minX = keymapsList.reduce((min: number, keymaps: KeymapItem[]) => {
      const keymap = keymaps.find((item) => item.isDefault);
      return keymap ? Math.min(keymap.x, min) : min;
    }, Infinity);
    const minY = keymapsList
      .flat()
      .reduce((min: number, keymap: KeymapItem) => {
        return keymap.isDefault ? Math.min(min, keymap.y) : min;
      }, Infinity);

    keymapsList.forEach((keymaps: KeymapItem[]) => {
      keymaps.forEach((item) => {
        item.align(minX, minY);
      });
    });

    function getTopLeftOfOptionKeymaps(
      keymapItems: KeymapItem[]
    ): Position | undefined {
      let top = Infinity;
      let left = Infinity;
      keymapItems.forEach((item) => {
        top = Math.min(item.y, top);
        left = Math.min(item.x - item.x2, left);
      });

      if (top === Infinity || left === Infinity) return undefined;

      return { top, left };
    }

    /**
     * STEP3: relocate option-choice keys' position
     * - Calculate the original option's base position which is left-top location of the default option keys
     * - Calculate the optional choice's base position which is left-top location of the option-choice keys
     * - Relocate the option-choice keys by the location diff which is calculated by the original and optional location.
     * - If there is no default option, its choice keys MUST be deleted.
     */
    Object.keys(optionKeymaps).forEach((option: string) => {
      const defaultKeyItems = keymapsList
        .flat()
        .filter((item) => item.isDefault && item.option === option);
      const originalOptionPosition = getTopLeftOfOptionKeymaps(defaultKeyItems);
      Object.keys(optionKeymaps[option]).forEach((choice: string) => {
        const optionChoicePosition = getTopLeftOfOptionKeymaps(
          optionKeymaps[option][choice]
        );

        if (optionChoicePosition === undefined) return;

        if (originalOptionPosition === undefined) {
          optionKeymaps[option][choice].forEach((item: KeymapItem) => {
            item.toBeDeleted = true;
          });
          return;
        }

        const diffX = optionChoicePosition.left - originalOptionPosition.left;
        const diffY = optionChoicePosition.top - originalOptionPosition.top;
        optionKeymaps[option][choice].forEach((item: KeymapItem) => {
          item.align(diffX, diffY);
        });
      });
    });

    const list: KeyModel[] = [];
    keymapsList.flat().forEach((item: KeymapItem) => {
      if (item.toBeDeleted) return;

      const model = new KeyModel(
        item.op,
        item.label,
        item.x,
        item.y,
        item.c,
        item.r,
        item.rx,
        item.ry,
        item.encoderId
      );
      list.push(model);
    });
    return list;
  }
}
