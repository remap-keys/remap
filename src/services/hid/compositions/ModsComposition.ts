import { IComposition, IMod, IModDirection } from '../Composition';
import { IKeymap } from '../Hid';

export const QK_MODS_MIN = 0b0000_0001_0000_0000;
export const QK_MODS_MAX = 0b0001_1111_1111_1111;

export interface IModsComposition extends IComposition {
  getModDirection(): IModDirection;
  getModifiers(): IMod[];
}

export class ModsComposition implements IModsComposition {
  private readonly modDirection: IModDirection;
  private readonly modifiers: IMod[];
  private readonly key: IKeymap;

  constructor(modDirection: IModDirection, modifiers: IMod[], key: IKeymap) {
    this.modDirection = modDirection;
    this.modifiers = modifiers;
    this.key = key;
  }

  static genBinary(mods: IMod[]): number {
    const bin = mods.reduce<number>((result, current) => {
      return result | current;
    }, 0);
    return bin;
  }

  getCode(): number {
    const code = ModsComposition.genBinary(this.modifiers);
    return (
      (this.modDirection << 12) | (code << 8) | (this.key.code & 0b1111_1111)
    );
  }

  genKeymap(): IKeymap {
    return {
      code: this.getCode(),
      kinds: ['basic', 'mods'],
      isAny: false,
      desc: '',
      keycodeInfo: this.key.keycodeInfo,
      direction: this.modDirection,
      modifiers: this.modifiers,
    };
  }

  getModifiers(): IMod[] {
    return this.modifiers;
  }

  getModDirection(): IModDirection {
    return this.modDirection;
  }
}
