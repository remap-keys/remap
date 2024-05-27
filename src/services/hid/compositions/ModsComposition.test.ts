import {
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_SFT,
  ModDirection,
} from '../Composition';
import { ModsComposition } from './ModsComposition';
import { MOD_LEFT } from '../Constraints';

describe('ModsComposition', () => {
  test('getCode', () => {
    let subject = new ModsComposition(
      ModDirection.right,
      [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
      {
        code: 0b0000_0100,
        isAny: false,
        kinds: ['mods'],
        direction: MOD_LEFT,
        modifiers: [],
        keycodeInfo: {
          code: 0b0000_0100,
          name: {
            long: 'KC_A',
            short: 'KC_A',
          },
          label: 'A',
          keywords: [],
        },
      }
    );
    expect(subject.getCode()).toEqual(0b0001_1111_0000_0100);
    subject = new ModsComposition(
      ModDirection.left,
      [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
      {
        code: 0b0000_0000,
        isAny: false,
        kinds: ['mods'],
        direction: MOD_LEFT,
        modifiers: [],
        keycodeInfo: {
          code: 0,
          name: {
            long: '',
            short: '',
          },
          label: '',
          keywords: [],
        },
      }
    );
    expect(subject.getCode()).toEqual(0b0000_1111_0000_0000);
    subject = new ModsComposition(
      ModDirection.right,
      [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
      {
        code: 0b0000_0000,
        isAny: false,
        kinds: ['mods'],
        direction: MOD_LEFT,
        modifiers: [],
        keycodeInfo: {
          code: 0,
          name: {
            long: '',
            short: '',
          },
          label: '',
          keywords: [],
        },
      }
    );
    expect(subject.getCode()).toEqual(0b0001_1111_0000_0000);
    subject = new ModsComposition(
      ModDirection.left,
      [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
      {
        code: 0b1111_1111,
        isAny: false,
        kinds: ['mods'],
        direction: MOD_LEFT,
        modifiers: [],
        keycodeInfo: {
          code: 0,
          name: {
            long: '',
            short: '',
          },
          label: '',
          keywords: [],
        },
      }
    );
    expect(subject.getCode()).toEqual(0b0000_1111_1111_1111);
    subject = new ModsComposition(
      ModDirection.right,
      [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
      {
        code: 0b1111_1111,
        isAny: false,
        kinds: ['mods'],
        direction: MOD_LEFT,
        modifiers: [],
        keycodeInfo: {
          code: 0,
          name: {
            long: '',
            short: '',
          },
          label: '',
          keywords: [],
        },
      }
    );
    expect(subject.getCode()).toEqual(0b0001_1111_1111_1111);
    subject = new ModsComposition(
      ModDirection.left,
      [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
      {
        code: 0b1_0000_0000,
        isAny: false,
        kinds: ['mods'],
        direction: MOD_LEFT,
        modifiers: [],
        keycodeInfo: {
          code: 0,
          name: {
            long: '',
            short: '',
          },
          label: '',
          keywords: [],
        },
      }
    );
    expect(subject.getCode()).toEqual(0b0000_1111_0000_0000);
    subject = new ModsComposition(
      ModDirection.right,
      [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
      {
        code: 0b1_0000_0000,
        isAny: false,
        kinds: ['mods'],
        direction: MOD_LEFT,
        modifiers: [],
        keycodeInfo: {
          code: 0,
          name: {
            long: '',
            short: '',
          },
          label: '',
          keywords: [],
        },
      }
    );
    expect(subject.getCode()).toEqual(0b0001_1111_0000_0000);
  });
});
