import { isConstructorDeclaration } from 'typescript';
import { KeyOp } from '../gen/types/KeyOp';
import KeyModel, { OPTION_DEFAULT } from './KeyModel';

class Current {
  private _x = 0;
  private _y = 0;
  private _c = '#cccccc';
  private _r = 0;
  private _rx = 0;
  private _ry = 0;

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get c() {
    return this._c;
  }

  get r() {
    return this._r;
  }

  get rx() {
    return this._rx;
  }

  get ry() {
    return this._ry;
  }

  minus(x: number, y: number) {
    this._x -= x;
    this._y -= y;
  }

  nextRow() {
    this._x = this._rx ? this._rx : 0;
    this._y = this._ry ? this._ry : this._y + 1;
  }

  setOp(op: KeyOp) {
    if (op.rx) {
      this._rx = op.rx;
      this._x = op.rx;
    }
    if (op.ry) {
      this._ry = op.ry;
      this._y = op.ry;
    }
    if (op.x) {
      this._x += op.x;
    }
    if (op.y) {
      this._y += op.y;
    }

    if (op.r) {
      this._r = op.r;
    }

    if (op.c) {
      this._c = op.c;
    }
  }

  next(w: number) {
    this._x += w;
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
    this._curr = Object.assign({}, curr);
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
    const layerKeymaps: {
      [option: string]: { [choice: string]: { [row: string]: KeymapItem[] } };
    } = {};

    const curr = new Current();
    for (let row = 0; row < keymap.length; row++) {
      const keyRow = keymap[row];

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

        if (!(keymapItem.option in layerKeymaps)) {
          layerKeymaps[keymapItem.option] = {};
        }
        if (!(keymapItem.choice in layerKeymaps[keymapItem.option])) {
          layerKeymaps[keymapItem.option][keymapItem.choice] = {};
        }

        if (!(row in layerKeymaps[keymapItem.option][keymapItem.choice])) {
          layerKeymaps[keymapItem.option][keymapItem.choice][row] = [];
        }
        layerKeymaps[keymapItem.option][keymapItem.choice][row].push(
          keymapItem
        );
      }
    }

    // zero alignment
    const minX = Object.keys(
      layerKeymaps[OPTION_DEFAULT][OPTION_DEFAULT]
    ).reduce((min: number, row: string) => {
      const items = layerKeymaps[OPTION_DEFAULT][OPTION_DEFAULT][row];
      return Math.min(min, items[0].x);
    }, Infinity);
    const topRow: string = Object.keys(
      layerKeymaps[OPTION_DEFAULT][OPTION_DEFAULT]
    )[0];
    const minY = layerKeymaps[OPTION_DEFAULT][OPTION_DEFAULT][topRow].reduce(
      (min: number, item: KeymapItem) => Math.min(min, item.y),
      Infinity
    );
    Object.keys(layerKeymaps[OPTION_DEFAULT][OPTION_DEFAULT]).forEach((row) => {
      const line: KeymapItem[] =
        layerKeymaps[OPTION_DEFAULT][OPTION_DEFAULT][row];
      line.forEach((item: KeymapItem) => {
        item.align(minX, minY);
      });
    });

    const searchOriginalPosition = (targetRow: string, option: string) => {
      const rows = Object.keys(layerKeymaps[OPTION_DEFAULT][OPTION_DEFAULT]);
      const rowIndex = rows.findIndex((row) => row == targetRow);

      let item: KeymapItem | undefined;
      for (let i = rowIndex; i < rows.length; i++) {
        const row: string = rows[i];
        item = layerKeymaps[OPTION_DEFAULT][OPTION_DEFAULT][row].find(
          (item: KeymapItem) => {
            return item.option == option;
          }
        );
        if (item) return item.current;
      }

      // search above row
      for (let i = rowIndex; i >= 0; i--) {
        const row: string = rows[i];
        item = layerKeymaps[OPTION_DEFAULT][OPTION_DEFAULT][row].find(
          (item: KeymapItem) => {
            return item.option == option;
          }
        );
        if (item) return item.current;
      }
    };

    // relocate option layout
    const options = Object.keys(layerKeymaps);
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option == OPTION_DEFAULT) continue;

      const choices = Object.keys(layerKeymaps[option]);
      for (let j = 0; j < choices.length; j++) {
        const choice = choices[j];
        if (choice == OPTION_DEFAULT) continue;

        const rows = Object.keys(layerKeymaps[option][choice]);
        for (let l = 0; l < rows.length; l++) {
          const row = rows[l];
          const items: KeymapItem[] = layerKeymaps[option][choice][row];
          const origCurr = searchOriginalPosition(row, option);
          const item = items[0];
          const diffX = item.x - origCurr!.x;
          const diffY = item.y - origCurr!.y;
          items.forEach((item: KeymapItem) => {
            item.align(diffX, diffY);
          });
        }
      }
    }

    let width = 0;
    let height = 0;
    const models: {
      [option: string]: { [choice: string]: KeyModel[] };
    } = {};
    Object.keys(layerKeymaps).forEach((option) => {
      models[option] = {};
      Object.keys(layerKeymaps[option]).forEach((choice) => {
        models[option][choice] = Object.values(layerKeymaps[option][choice])
          .flat()
          .map((item: KeymapItem) => {
            let model = new KeyModel(item.op, item.label, item.x, item.y, item.c, item.r, item.rx, item.ry); // prettier-ignore
            width = Math.max(width, model.endRight);
            height = Math.max(height, model.endBottom);
            return model;
          });
      });
    });
    const list: KeyModel[] = [];
    return {
      keymap: list,
      keymaps: models,
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
