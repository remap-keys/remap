import { AsciiComposition } from './AsciiComposition';
import { MOD_LEFT } from '../Composition';

describe('AsciiComposition', () => {
  test('getCode', () => {
    let subject = new AsciiComposition({
      code: 33,
      isAny: false,
      kinds: ['ascii'],
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: 33,
        name: {
          long: '!',
          short: '!',
        },
        label: '!',
        keywords: [],
      },
    });
    expect(subject.getCode()).toEqual(33);
  });
});
