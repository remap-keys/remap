import { IComposition, MOD_LEFT } from '../Composition';
import { IKeymap } from '../Hid';

export const QK_LAYER_TAP_TOGGLE_MIN = 0b0101_0010_1100_0000;
export const QK_LAYER_TAP_TOGGLE_MAX = 0b0101_0010_1101_1111;

export interface ILayerTapToggleComposition extends IComposition {
  getLayer(): number;
}

export class LayerTapToggleComposition implements ILayerTapToggleComposition {
  private readonly layer: number;

  constructor(layer: number) {
    this.layer = layer;
  }

  getLayer(): number {
    return this.layer;
  }

  getCode(): number {
    return QK_LAYER_TAP_TOGGLE_MIN | (this.layer & 0b0001_1111);
  }

  genKeymap(): IKeymap {
    const code = this.getCode();
    const layer = this.getLayer();
    const label = `TT(${layer})`;
    const keymap: IKeymap = {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: code,
        label: label,
        name: { short: '', long: '' },
        keywords: [],
      },
      kinds: ['layers'],
      desc: `If you hold the key down, layer(${layer}) is activated, and then is de-activated when you let go.`,
      option: layer,
    };
    return keymap;
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new LayerTapToggleComposition(index);
        return comp.genKeymap();
      });
  }
}
