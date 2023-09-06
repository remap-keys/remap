import { IComposition } from '../Composition';
import { IMomentaryComposition } from './MomentaryComposition';
import { IKeymap } from '../Hid';
import { MOD_LEFT } from '../Constraints';

export const QK_TOGGLE_LAYER_MIN = 0b0101_0010_0110_0000;
export const QK_TOGGLE_LAYER_MAX = 0b0101_0010_0111_1111;

export interface IToggleLayerComposition extends IComposition {
  getLayer(): number;
}

export class ToggleLayerComposition implements IMomentaryComposition {
  private readonly layer: number;

  constructor(layer: number) {
    this.layer = layer;
  }

  getLayer(): number {
    return this.layer;
  }

  getCode(): number {
    return QK_TOGGLE_LAYER_MIN | (this.layer & 0b0001_1111);
  }

  genKeymap(): IKeymap {
    const layer = this.getLayer();
    const code = this.getCode();
    const label = `TG(${layer})`;
    const keymap: IKeymap = {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: code,
        label: label,
        name: { short: label, long: label },
        keywords: ['toggle layer'],
      },
      kinds: ['layers'],
      desc: `Toggles layer(${layer}), activating it if it's inactive and vice versa.`,
      option: layer,
    };
    return keymap;
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new ToggleLayerComposition(index);
        return comp.genKeymap();
      });
  }
}
