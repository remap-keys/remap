import { IComposition, ISwapHandsOption, ITapKey } from '../Composition';
import { IKeymap } from '../Hid';
import { MOD_LEFT, WILL_BE_REPLACED_KEYCODE } from '../Constraints';

export const QK_SWAP_HANDS_MIN = 0b0101_0110_0000_0000;
export const QK_SWAP_HANDS_MAX = 0b0101_0110_1111_1111;

export const OP_SH_TOGGLE = 0b1111_0000;
export const OP_SH_TAP_TOGGLE = 0b1111_0001;
export const OP_SH_ON_OFF = 0b1111_0010;
export const OP_SH_OFF_ON = 0b1111_0011;
export const OP_SH_OFF = 0b1111_0100;
export const OP_SH_ON = 0b1111_0101;
export const OP_SH_ONESHOT = 0b1111_0110;

export interface ISwapHandsComposition extends IComposition, ITapKey {
  getSwapHandsOption(): ISwapHandsOption | null;
  isSwapHandsOption(): boolean;
}

export class SwapHandsComposition implements ISwapHandsComposition {
  private static _swapHandsOptionKeymaps: IKeymap[];
  private static _swapHandsOptionItems: {
    option: ISwapHandsOption;
    label: string;
    desc: string;
  }[] = [
    {
      option: OP_SH_TOGGLE,
      label: 'SH TG',
      desc: 'Toggles swap on and off with every key press.',
    },
    {
      option: OP_SH_TAP_TOGGLE,
      label: 'SH TT',
      desc: 'Toggles with a tap; momentary when held.',
    },
    {
      option: OP_SH_ON_OFF,
      label: 'SH_MON',
      desc: 'Swaps hands when pressed, returns to normal when released (momentary).',
    },
    {
      option: OP_SH_OFF_ON,
      label: 'SH MOFF',
      desc: 'Momentarily turns off swap.',
    },
    {
      option: OP_SH_OFF,
      label: 'SH OFF',
      desc: 'Turn off swapping and leaves it off. Good for returning to a known state.',
    },
    {
      option: OP_SH_ON,
      label: 'SH ON',
      desc: 'Turns on swapping and leaves it on.',
    },
    {
      option: OP_SH_ONESHOT,
      label: 'SH ON',
      desc: 'One shot swap hands: toggles while pressed or until next key press.',
    },
  ];
  static readonly holdKey: IKeymap = {
    code: WILL_BE_REPLACED_KEYCODE,
    isAny: false,
    direction: MOD_LEFT,
    modifiers: [],
    keycodeInfo: {
      code: WILL_BE_REPLACED_KEYCODE,
      label: `Swap-Hands`,
      name: { short: 'SH', long: 'SH' },
      keywords: [],
    },
    kinds: ['swap_hands'],
    desc: 'Momentary swap when held, sends keycode when tapped. Depends on your keyboard whether this function is available.',
  };

  private readonly key: IKeymap | undefined;
  private readonly swapHandsOption: ISwapHandsOption | null;

  constructor(value: IKeymap | ISwapHandsOption) {
    if (typeof value === 'number') {
      this.key = undefined;
      this.swapHandsOption = value as ISwapHandsOption;
    } else {
      this.key = value as IKeymap;
      this.swapHandsOption = null;
    }
  }

  getCode(): number {
    if (this.isSwapHandsOption()) {
      return QK_SWAP_HANDS_MIN | (this.swapHandsOption! & 0b1111_1111);
    } else {
      return QK_SWAP_HANDS_MIN | (this.key!.code & 0b1111_1111);
    }
  }

  genTapKey(): IKeymap | undefined {
    return this.key;
  }

  getSwapHandsOption(): ISwapHandsOption | null {
    return this.swapHandsOption;
  }

  isSwapHandsOption(): boolean {
    return this.swapHandsOption !== null;
  }

  genKeymap(): IKeymap | undefined {
    const code = this.getCode();
    let keymap: IKeymap;
    if (this.isSwapHandsOption()) {
      return SwapHandsComposition.findKeymap(code);
    } else {
      keymap = {
        code: code,
        isAny: false,
        direction: MOD_LEFT,
        modifiers: [],
        keycodeInfo: this.key!.keycodeInfo,
        kinds: ['swap_hands'],
        desc: 'Momentary swap when held, sends keycode when tapped. Depends on your keyboard whether this function is available.',
      };
    }
    return keymap;
  }

  static findKeymap(code: number): IKeymap | undefined {
    if (!SwapHandsComposition.isSwapHandsOptions(code)) return undefined;

    return SwapHandsComposition.genSwapHandsOptionKeymaps().find(
      (km) => km.code === code,
    );
  }

  static isSwapHandsOptions(code: number): boolean {
    return (
      0 <=
      SwapHandsComposition.genSwapHandsOptionKeymaps().findIndex(
        (km) => km.code === code,
      )
    );
  }

  static genSwapHandsOptionKeymaps(): IKeymap[] {
    if (SwapHandsComposition._swapHandsOptionKeymaps)
      return SwapHandsComposition._swapHandsOptionKeymaps;

    SwapHandsComposition._swapHandsOptionKeymaps =
      SwapHandsComposition._swapHandsOptionItems.map((item) => {
        const comp = new SwapHandsComposition(item.option);
        const code = comp.getCode();
        const keymap: IKeymap = {
          code: code,
          isAny: false,
          direction: MOD_LEFT,
          modifiers: [],
          keycodeInfo: {
            code: code,
            label: item.label,
            name: { short: 'SH', long: 'SH' },
            keywords: [],
          },
          kinds: ['special', 'swap_hands'],
          option: item.option,
          desc: item.desc,
        };
        return keymap;
      });

    return SwapHandsComposition._swapHandsOptionKeymaps;
  }
}
