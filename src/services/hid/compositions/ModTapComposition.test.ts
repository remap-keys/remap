import { describe, expect, test } from 'vitest';
import { ModTapComposition } from './ModTapComposition';
import {
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_LEFT,
  MOD_SFT,
  ModDirection,
} from '../Composition';

describe('ModTapComposition', () => {
  test('getCode', () => {
    let subject = new ModTapComposition(
      ModDirection.right,
      [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
      {
        code: 0b0000_0100,
        isAny: false,
        kinds: ['mod_tap'],
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
      },
    );
    expect(subject.getCode()).toEqual(0b0011_1111_0000_0100);
    subject = new ModTapComposition(
      ModDirection.left,
      [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
      {
        code: 0b0000_0000,
        isAny: false,
        kinds: ['mod_tap'],
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
      },
    );
    expect(subject.getCode()).toEqual(0b0010_1111_0000_0000);
    subject = new ModTapComposition(
      ModDirection.right,
      [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
      {
        code: 0b0000_0000,
        isAny: false,
        kinds: ['mod_tap'],
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
      },
    );
    expect(subject.getCode()).toEqual(0b0011_1111_0000_0000);
    subject = new ModTapComposition(
      ModDirection.left,
      [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
      {
        code: 0b1111_1111,
        isAny: false,
        kinds: ['mod_tap'],
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
      },
    );
    expect(subject.getCode()).toEqual(0b0010_1111_1111_1111);
    subject = new ModTapComposition(
      ModDirection.right,
      [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
      {
        code: 0b1111_1111,
        isAny: false,
        kinds: ['mod_tap'],
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
      },
    );
    expect(subject.getCode()).toEqual(0b0011_1111_1111_1111);
    subject = new ModTapComposition(
      ModDirection.left,
      [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
      {
        code: 0b1_0000_0000,
        isAny: false,
        kinds: ['mod_tap'],
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
      },
    );
    expect(subject.getCode()).toEqual(0b0010_1111_0000_0000);
    subject = new ModTapComposition(
      ModDirection.right,
      [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
      {
        code: 0b1_0000_0000,
        isAny: false,
        kinds: ['mod_tap'],
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
      },
    );
    expect(subject.getCode()).toEqual(0b0011_1111_0000_0000);
    subject = new ModTapComposition(ModDirection.left, [], {
      code: 0b1111_1111,
      isAny: false,
      kinds: ['mod_tap'],
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
    });
    expect(subject.getCode()).toEqual(0b0010_0000_1111_1111);
    subject = new ModTapComposition(ModDirection.right, [], {
      code: 0b1111_1111,
      isAny: false,
      kinds: ['mod_tap'],
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
    });
    expect(subject.getCode()).toEqual(0b0011_0000_1111_1111);
  });
});
