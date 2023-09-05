import { IComposition, MOD_LEFT } from '../Composition';
import { IKeymap } from '../Hid';

export const QK_TO_MIN = 0b0101_0010_0000_0000;
export const QK_TO_MAX = 0b0101_0010_0001_1111;

export interface IToComposition extends IComposition {
  getLayer(): number;
}

export class ToComposition implements IToComposition {
  private readonly layer: number;

  constructor(layer: number) {
    this.layer = layer;
  }

  getLayer(): number {
    return this.layer;
  }

  getCode(): number {
    return QK_TO_MIN | (this.layer & 0b0001_1111);
  }

  genKeymap(): IKeymap {
    const code = this.getCode();
    const layer = this.getLayer();
    const label = `TO(${layer})`;
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
      desc: `Activates layer(${layer}) and de-activates all other layers (except your default layer).`,
      option: layer,
    };
    return keymap;
  }

  static genKeymaps(layerCount: number): IKeymap[] {
    return Array(layerCount)
      .fill(0)
      .map((_, index) => {
        const comp = new ToComposition(index);
        return comp.genKeymap();
      });
  }
}
