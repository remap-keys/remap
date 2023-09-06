import { IComposition } from '../Composition';
import { IKeymap } from '../Hid';
import { MOD_LEFT } from '../Constraints';

export const QK_ONE_SHOT_LAYER_MIN = 0b0101_0010_1000_0000;
export const QK_ONE_SHOT_LAYER_MAX = 0b0101_0010_1001_1111;

export interface IOneShotLayerComposition extends IComposition {
  getLayer(): number;
}

export class OneShotLayerComposition implements IOneShotLayerComposition {
  private readonly layer: number;

  constructor(layer: number) {
    this.layer = layer;
  }

  getLayer(): number {
    return this.layer;
  }

  getCode(): number {
    return QK_ONE_SHOT_LAYER_MIN | (this.layer & 0b0001_1111);
  }

  genKeymap(): IKeymap {
    const layer = this.layer;
    const code = this.getCode();
    const label = `OSL(${layer})`;
    return {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: code,
        label: label,
        name: { short: label, long: label },
        keywords: [],
      },
      kinds: ['layers'],
      desc: `Momentarily activates layer(${layer}) until the next key is pressed.`,
      option: layer,
    };
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new OneShotLayerComposition(index);
        return comp.genKeymap();
      });
  }
}
