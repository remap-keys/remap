import { IComposition } from '../Composition';
import { IMomentaryComposition } from './MomentaryComposition';
import { IKeymap } from '../Hid';
import { MOD_LEFT } from '../Constraints';

export const QK_DEF_LAYER_MIN = 0b0101_0010_0100_0000;
export const QK_DEF_LAYER_MAX = 0b0101_0010_0101_1111;

export interface IDefLayerComposition extends IComposition {
  getLayer(): number;
}

export class DefLayerComposition implements IMomentaryComposition {
  private readonly layer: number;

  constructor(layer: number) {
    this.layer = layer;
  }

  getLayer(): number {
    return this.layer;
  }

  getCode(): number {
    return QK_DEF_LAYER_MIN | (this.layer & 0b0001_1111);
  }

  genKeymap(): IKeymap {
    const layer = this.getLayer();
    const code = this.getCode();
    const label = `DF(${layer})`;
    const keymap: IKeymap = {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: code,
        label: label,
        name: { short: label, long: label },
        keywords: ['default layer'],
      },
      kinds: ['layers'],
      desc: `Switches the default layer(${layer}). The default layer is the always-active base layer that other layers stack on top of.`,
      option: layer,
    };
    return keymap;
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new DefLayerComposition(index);
        return comp.genKeymap();
      });
  }
}
