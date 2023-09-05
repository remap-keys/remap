import { IKeymap } from '../Hid';
import { IComposition, MOD_LEFT } from '../Composition';

export const QK_MOMENTARY_MIN = 0b0101_0010_0010_0000;
export const QK_MOMENTARY_MAX = 0b0101_0010_0011_1111;

export interface IMomentaryComposition extends IComposition {
  getLayer(): number;
  genKeymap(): IKeymap;
}

export class MomentaryComposition implements IMomentaryComposition {
  private readonly layer: number;

  constructor(layer: number) {
    this.layer = layer;
  }

  getLayer(): number {
    return this.layer;
  }

  getCode(): number {
    return QK_MOMENTARY_MIN | (this.layer & 0b0001_1111);
  }

  genKeymap(): IKeymap {
    const code = this.getCode();
    const layer = this.getLayer();
    const label = `MO(${layer})`;
    const keymap: IKeymap = {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: code,
        label: label,
        name: { short: label, long: label },
        keywords: ['momentary'],
      },
      kinds: ['layers'],
      desc: `Momentarily activates layer(${layer}). As soon as you let go of the key, the layer is deactivated.`,
      option: layer,
    };
    return keymap;
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new MomentaryComposition(index);
        return comp.genKeymap();
      });
  }
}
