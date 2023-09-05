import {
  IComposition,
  IMod,
  IModDirection,
  MOD_LEFT,
  WILL_BE_REPLACED_KEYCODE,
} from '../Composition';
import { IKeymap } from '../Hid';

export const QK_ONE_SHOT_MOD_MIN = 0b0101_0010_1010_0000;
export const QK_ONE_SHOT_MOD_MAX = 0b0101_0010_1011_1111;

export interface IOneShotModComposition extends IComposition {
  getModDirection(): IModDirection;
  getModifiers(): IMod[];
}

export class OneShotModComposition implements IOneShotModComposition {
  private readonly modDirection: IModDirection;
  private readonly modifiers: IMod[];

  constructor(modDirection: IModDirection, modifiers: IMod[]) {
    this.modDirection = modDirection;
    this.modifiers = modifiers;
  }

  getCode(): number {
    const mods = this.modifiers.reduce<number>((result, current) => {
      return result | current;
    }, 0);
    return QK_ONE_SHOT_MOD_MIN | (((this.modDirection << 4) | mods) & 0x1f);
  }

  getModifiers(): IMod[] {
    return this.modifiers;
  }

  getModDirection(): IModDirection {
    return this.modDirection;
  }

  genKeymap(): IKeymap {
    const code = this.getCode();
    return {
      code: code,
      isAny: false,
      modifiers: this.modifiers,
      direction: this.modDirection,
      keycodeInfo: {
        code: code,
        label: `OSM`,
        name: { short: 'OSM', long: 'OSM' },
        keywords: [],
      },
      kinds: ['layers', 'osm'],
      desc: `Momentarily activates modifier(s) until the next key is pressed.`,
    };
  }

  static genKeymaps(): IKeymap[] {
    return [
      {
        code: WILL_BE_REPLACED_KEYCODE,
        isAny: false,
        direction: MOD_LEFT,
        modifiers: [],
        keycodeInfo: {
          code: WILL_BE_REPLACED_KEYCODE,
          label: `OSM`,
          name: { short: 'OSM', long: 'OSM' },
          keywords: [],
        },
        kinds: ['layers', 'osm'],
        desc: `Momentarily activates modifier(s) until the next key is pressed.`,
      },
    ];
  }
}
