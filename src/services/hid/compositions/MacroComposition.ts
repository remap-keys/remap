import { IComposition, MOD_LEFT } from '../Composition';
import { IKeymap } from '../Hid';

export const QK_MACRO_MIN = 0b0111_0111_0000_0000;
export const QK_MACRO_MAX = 0b0111_0111_0111_1111;

export interface IMacroComposition extends IComposition {
  getMacroId(): number;
}

export class MacroComposition implements IMacroComposition {
  private readonly macroId: number;

  constructor(macroId: number) {
    this.macroId = macroId;
  }

  getCode(): number {
    return QK_MACRO_MIN | (this.macroId & 0b0111_1111);
  }

  getMacroId(): number {
    return this.macroId;
  }

  genKeymap(): IKeymap {
    // TODO
    const keymap: IKeymap = {
      code: -1,
      isAny: false,
      kinds: ['macro'],
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: -1,
        name: {
          short: 'Macro?',
          long: 'M?',
        },
        label: 'Macro',
        keywords: [],
      },
    };
    return keymap;
  }
}
