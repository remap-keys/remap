import { IComposition, IMod } from '../Composition';
import { IKeymap } from '../Hid';
import { MOD_LEFT } from '../Constraints';

export const QK_LAYER_MOD_MIN = 0b0101_0000_0000_0000;
export const QK_LAYER_MOD_MAX = 0b0101_0001_1111_1111;

export interface ILayerModComposition extends IComposition {
  getLayer(): number;
  getModifiers(): IMod[];
}

export class LayerModComposition implements ILayerModComposition {
  private readonly layer: number;
  private readonly modifiers: IMod[];

  constructor(layer: number, modifiers: IMod[]) {
    this.layer = layer;
    this.modifiers = modifiers;
  }

  getLayer(): number {
    return this.layer;
  }

  getModifiers(): IMod[] {
    return this.modifiers;
  }

  getCode(): number {
    const mods = this.modifiers.reduce<number>((result, current) => {
      return result | current;
    }, 0);
    return QK_LAYER_MOD_MIN | ((this.layer & 0b1111) << 5) | (mods & 0x1f);
  }

  genKeymap(): IKeymap {
    const layer = this.layer;
    const code = this.getCode();
    const label = `LM(${layer})`;
    const keymap: IKeymap = {
      code: code,
      isAny: false,
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: code,
        label: label,
        name: { short: 'LM', long: 'LM' },
        keywords: [],
      },
      kinds: ['layer_mod'],
      desc: `Momentarily activates Layer(${layer}), but with modifier(s) mod active.`,
      option: layer,
    };
    return keymap;
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new LayerModComposition(index, []);
        return comp.genKeymap();
      });
  }
}
