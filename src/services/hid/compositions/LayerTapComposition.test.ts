import { describe, expect, test } from 'vitest';
import { LayerTapComposition } from './LayerTapComposition';
import { MOD_LEFT } from '../Composition';

describe('LayerTapComposition', () => {
  test('getCode', () => {
    let subject = new LayerTapComposition(2, {
      code: 0b0000_0100,
      isAny: false,
      kinds: ['layer_tap'],
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
    });
    expect(subject.getCode()).toEqual(0b0100_0010_0000_0100);
    subject = new LayerTapComposition(0, {
      code: 0b0000_0000,
      isAny: false,
      kinds: ['layer_tap'],
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
    expect(subject.getCode()).toEqual(0b0100_0000_0000_0000);
    subject = new LayerTapComposition(15, {
      code: 0b1111_1111,
      isAny: false,
      kinds: ['layer_tap'],
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
    expect(subject.getCode()).toEqual(0b0100_1111_1111_1111);
    subject = new LayerTapComposition(16, {
      code: 0b1_0000_0000,
      isAny: false,
      kinds: ['layer_tap'],
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
    expect(subject.getCode()).toEqual(0b0100_0000_0000_0000);
  });
});
