import { IKeymap } from './Hid';

export const MOD_LEFT = 0b0;
export const MOD_RIGHT = 0b1;

export function anyKeymap(hex: number): IKeymap {
  return {
    code: hex,
    isAny: true,
    kinds: ['any'],
    direction: MOD_LEFT,
    modifiers: [],
    keycodeInfo: {
      code: hex,
      label: 'Any',
      name: {
        short: 'Any',
        long: 'Any',
      },
      keywords: [],
    },
  };
}

export const WILL_BE_REPLACED_KEYCODE = -1;
export const WILL_BE_REPLACED_KEYMAP: IKeymap = anyKeymap(
  WILL_BE_REPLACED_KEYCODE
);
