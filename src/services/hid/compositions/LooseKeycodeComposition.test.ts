import { LooseKeycodeComposition } from './LooseKeycodeComposition';
import { MOD_LEFT } from '../Composition';

describe('LooseKeycodeComposition', () => {
  test('getCode', () => {
    let subject = new LooseKeycodeComposition({
      code: 0b0101_1100_0000_0000,
      isAny: false,
      kinds: ['loose_keycode'],
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: 0b0101_1100_0000_0000,
        name: {
          long: 'RESET',
          short: 'RESET',
        },
        label: 'RESET',
        keywords: [],
      },
    });
    expect(subject.getCode()).toEqual(0b0101_1100_0000_0000);
    subject = new LooseKeycodeComposition({
      code: 0b0101_1111_1111_1111,
      isAny: false,
      kinds: ['loose_keycode'],
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
    expect(subject.getCode()).toEqual(0b0101_1111_1111_1111);
    subject = new LooseKeycodeComposition({
      code: 0b0101_1100_1111_0111,
      isAny: false,
      kinds: ['loose_keycode'],
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
    expect(subject.getCode()).toEqual(0b0101_1100_1111_0111);
  });
});
