import {
  OP_SH_OFF,
  OP_SH_OFF_ON,
  OP_SH_ON,
  OP_SH_ON_OFF,
  OP_SH_ONESHOT,
  OP_SH_TAP_TOGGLE,
  OP_SH_TOGGLE,
  SwapHandsComposition,
} from './SwapHandsComposition';
import { MOD_LEFT } from '../Constraints';

describe('SwapHandsComposition', () => {
  test('getCode', () => {
    let subject = new SwapHandsComposition({
      code: 0b0000_0100,
      isAny: false,
      kinds: ['swap_hands'],
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
    expect(subject.getCode()).toEqual(0b0101_0110_0000_0100);
    subject = new SwapHandsComposition({
      code: 0b0000_0000,
      isAny: false,
      kinds: ['swap_hands'],
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
    expect(subject.getCode()).toEqual(0b0101_0110_0000_0000);
    subject = new SwapHandsComposition(OP_SH_TOGGLE);
    expect(subject.getCode()).toEqual(0b0101_0110_1111_0000);
    subject = new SwapHandsComposition(OP_SH_TAP_TOGGLE);
    expect(subject.getCode()).toEqual(0b0101_0110_1111_0001);
    subject = new SwapHandsComposition(OP_SH_ON_OFF);
    expect(subject.getCode()).toEqual(0b0101_0110_1111_0010);
    subject = new SwapHandsComposition(OP_SH_OFF_ON);
    expect(subject.getCode()).toEqual(0b0101_0110_1111_0011);
    subject = new SwapHandsComposition(OP_SH_OFF);
    expect(subject.getCode()).toEqual(0b0101_0110_1111_0100);
    subject = new SwapHandsComposition(OP_SH_ON);
    expect(subject.getCode()).toEqual(0b0101_0110_1111_0101);
    subject = new SwapHandsComposition(OP_SH_ONESHOT);
    expect(subject.getCode()).toEqual(0b0101_0110_1111_0110);
  });
});
