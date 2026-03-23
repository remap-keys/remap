import KeyModel from '../../models/KeyModel';
import { KeyOp } from '../../gen/types/KeyboardDefinition';

const DEFAULT_KEY_COLOR = '#cccccc';

export type QmkLayoutKey = {
  matrix: [number, number]; // [row, col]
  x: number;
  y: number;
  w?: number;
  h?: number;
  r?: number;
  rx?: number;
  ry?: number;
};

type QmkLayoutDefinition = {
  layout: QmkLayoutKey[];
};

type QmkLayouts = {
  [layoutName: string]: QmkLayoutDefinition;
};

export type LayoutViewContent = {
  keyModels: KeyModel[];
  width: number;
  height: number;
  left: number;
  top: number;
};

export function qmkLayoutKeyToKeyModel(key: QmkLayoutKey): KeyModel {
  const [row, col] = key.matrix;
  const location = `${row},${col}`;

  const op: KeyOp = {
    w: key.w ?? 1,
    h: key.h ?? 1,
  };

  return new KeyModel(
    op,
    location,
    key.x,
    key.y,
    DEFAULT_KEY_COLOR,
    key.r ?? 0,
    key.rx ?? 0,
    key.ry ?? 0,
    null
  );
}

export function qmkLayoutToKeyModels(layout: QmkLayoutKey[]): KeyModel[] {
  return layout.map(qmkLayoutKeyToKeyModel);
}

export function getLayoutViewContent(keyModels: KeyModel[]): LayoutViewContent {
  let right = 0;
  let bottom = 0;
  let left = Infinity;
  let top = Infinity;

  keyModels.forEach((model) => {
    right = Math.max(right, model.endRight);
    bottom = Math.max(bottom, model.endBottom);
    left = Math.min(left, model.startLeft);
    top = Math.min(top, model.top);
  });

  return {
    keyModels,
    width: right - left,
    height: bottom - top,
    left,
    top,
  };
}

export function parseQmkKeyboardJson(content: string): {
  layoutNames: string[];
  getKeyModels: (layoutName: string) => KeyModel[];
  getLayoutViewContent: (layoutName: string) => LayoutViewContent;
} {
  const json = JSON.parse(content);
  const layouts: QmkLayouts = json.layouts ?? {};
  const layoutNames = Object.keys(layouts);

  return {
    layoutNames,
    getKeyModels(layoutName: string): KeyModel[] {
      const layoutDef = layouts[layoutName];
      if (!layoutDef) {
        throw new Error(`Layout "${layoutName}" not found`);
      }
      return qmkLayoutToKeyModels(layoutDef.layout);
    },
    getLayoutViewContent(layoutName: string): LayoutViewContent {
      const keyModels = this.getKeyModels(layoutName);
      return getLayoutViewContent(keyModels);
    },
  };
}
