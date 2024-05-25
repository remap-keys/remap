import {
  DIRECTION_LABELS,
  IComposition,
  IMod,
  IModDirection,
  ITapKey,
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_SFT,
} from '../Composition';
import { IKeymap } from '../Hid';
import { MOD_LEFT, MOD_RIGHT, WILL_BE_REPLACED_KEYMAP } from '../Constraints';

export const QK_MOD_TAP_MIN = 0b0010_0000_0000_0000;
export const QK_MOD_TAP_MAX = 0b0011_1111_1111_1111;

export interface IModTapComposition extends IComposition, ITapKey {
  getModifiers(): IMod[];
  getModDirection(): IModDirection;
}

export class ModTapComposition implements IModTapComposition {
  private static _modTapKeymaps: IKeymap[];
  private static _holdLabels = [
    '0',
    'Ctrl',
    'Shift',
    '3',
    'Alt',
    '5',
    '6',
    '7',
    'Win/Cmd',
  ];
  private readonly modDirection: IModDirection;
  private readonly modifiers: IMod[];
  private readonly key: IKeymap;

  constructor(modDirection: IModDirection, modifiers: IMod[], key: IKeymap) {
    this.modDirection = modDirection;
    this.modifiers = modifiers;
    this.key = key;
  }

  getCode(): number {
    const mods = this.modifiers.reduce<number>((result, current) => {
      return result | (current << 8);
    }, 0);
    return (
      QK_MOD_TAP_MIN |
      (this.modDirection << 12) |
      mods |
      (this.key.code & 0b1111_1111)
    );
  }

  genTapKey(): IKeymap {
    return this.key;
  }

  getModifiers(): IMod[] {
    return this.modifiers;
  }

  getModDirection(): IModDirection {
    return this.modDirection;
  }

  genKeymap(): IKeymap {
    const code = this.getCode();
    const direction = this.modDirection;
    const mods = this.modifiers;
    const hold = mods
      .map((mod) => ModTapComposition._holdLabels[mod])
      .join('+');
    const keymap: IKeymap = {
      code: code,
      isAny: false,
      keycodeInfo: {
        code: this.key.code,
        label: `(${DIRECTION_LABELS[direction]}) ${hold}`,
        name: this.key.keycodeInfo
          ? this.key.keycodeInfo.name
          : { short: 'MT', long: 'MT' },
        keywords: [],
      },
      kinds: ['mod_tap'],
      desc: `Momentarily activates ${hold} when held, and sends keycode when tapped.`,
      modifiers: mods,
      direction: direction,
    };
    return keymap;
  }

  static genKeymaps(): IKeymap[] {
    if (ModTapComposition._modTapKeymaps)
      return ModTapComposition._modTapKeymaps;

    const holdKeys: { [key: string]: IMod[] } = {
      Ctrl: [MOD_CTL],
      Shift: [MOD_SFT],
      Alt: [MOD_ALT],
      'Win/Cmd': [MOD_GUI],
      'Ctrl+Shift': [MOD_CTL, MOD_SFT],
      'Ctrl+Alt': [MOD_CTL, MOD_ALT],
      'Ctrl+Win/Cmd': [MOD_CTL, MOD_GUI],
      'Shift+Alt': [MOD_SFT, MOD_ALT],
      'Shift+Win/Cmd': [MOD_SFT, MOD_GUI],
      'Alt+Win/Cmd': [MOD_ALT, MOD_GUI],
      'Ctrl+Shift+Alt': [MOD_CTL, MOD_SFT, MOD_ALT],
      'Ctrl+Shift+Win/Cmd': [MOD_CTL, MOD_SFT, MOD_GUI],
      'Ctrl+Alt+Win/Cmd': [MOD_CTL, MOD_ALT, MOD_GUI],
      'Shift+Alt+Win/Cmd': [MOD_SFT, MOD_ALT, MOD_GUI],
      'Ctrl+Shift+Alt+Win/Cmd': [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
    };

    const holdLeftModKeys: IKeymap[] = Object.keys(holdKeys).map((hold) => {
      const comp = new ModTapComposition(
        MOD_LEFT,
        holdKeys[hold],
        WILL_BE_REPLACED_KEYMAP,
      );
      return comp.genKeymap();
    });

    const holdRightModKeys: IKeymap[] = Object.keys(holdKeys).map((hold) => {
      const comp = new ModTapComposition(
        MOD_RIGHT,
        holdKeys[hold],
        WILL_BE_REPLACED_KEYMAP,
      );
      return comp.genKeymap();
    });

    ModTapComposition._modTapKeymaps = [
      ...holdLeftModKeys,
      ...holdRightModKeys,
    ];
    return ModTapComposition._modTapKeymaps;
  }
}
