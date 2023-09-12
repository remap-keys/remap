import { IComposition, ITapKey } from '../Composition';
import { IKeymap } from '../Hid';
import { MOD_LEFT, WILL_BE_REPLACED_KEYMAP } from '../Constraints';

export const QK_LAYER_TAP_MIN = 0b0100_0000_0000_0000;
export const QK_LAYER_TAP_MAX = 0b0100_1111_1111_1111;

export interface ILayerTapComposition extends IComposition, ITapKey {
  getLayer(): number;
}

export class LayerTapComposition implements ILayerTapComposition {
  private readonly layer: number;
  private readonly key: IKeymap;

  constructor(layer: number, key: IKeymap) {
    this.key = key;
    this.layer = layer;
  }

  getCode(): number {
    return (
      QK_LAYER_TAP_MIN |
      (((this.layer & 0b1111) << 8) | (this.key.code & 0b1111_1111))
    );
  }

  getLayer(): number {
    return this.layer;
  }

  genTapKey(): IKeymap {
    return this.key;
  }

  genKeymap(): IKeymap {
    const layer = this.layer;
    const code = this.getCode();
    const label = `Layer(${layer})`;
    return {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: this.key.code,
        label: label,
        name: this.key.keycodeInfo
          ? this.key.keycodeInfo.name
          : { short: 'LT', long: 'LT' },
        keywords: ['layer tap'],
      },
      kinds: ['layers'],
      desc: `Momentarily activates Layer(${layer}) when held, and sends keycode when tapped.`,
      option: layer,
    };
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new LayerTapComposition(index, WILL_BE_REPLACED_KEYMAP);
        return comp.genKeymap();
      });
  }
}
