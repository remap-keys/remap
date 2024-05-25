import { describe, expect, test } from 'vitest';
import { MOD_LEFT } from '../Composition';
import { BasicComposition } from './BasicComposition';

describe('BasicComposition', () => {
  test('getCode', () => {
    let subject = new BasicComposition({
      code: 0b0000_0100,
      isAny: false,
      kinds: ['basic'],
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
    expect(subject.getCode()).toEqual(0b0000_0000_0000_0100);
    subject = new BasicComposition({
      code: 0b0000_0000,
      isAny: false,
      kinds: ['basic'],
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
    expect(subject.getCode()).toEqual(0b0000_0000_0000_0000);
    subject = new BasicComposition({
      code: 0b1111_1111,
      isAny: false,
      kinds: ['basic'],
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
    expect(subject.getCode()).toEqual(0b0000_0000_1111_1111);
    subject = new BasicComposition({
      code: 0b1_0000_0000,
      isAny: false,
      kinds: ['basic'],
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
    expect(subject.getCode()).toEqual(0b0000_0000_0000_0000);
  });
});
