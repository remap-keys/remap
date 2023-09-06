import { ViaUserKeyComposition } from './ViaUserKeyComposition';
import { MOD_LEFT } from '../Constraints';

describe('ViaUserKeyComposition', () => {
  test('getCode', () => {
    let subject = new ViaUserKeyComposition({
      code: 0b0111_1110_0000_0000,
      isAny: false,
      kinds: ['function', 'via_user_key'],
      direction: MOD_LEFT,
      modifiers: [],
      keycodeInfo: {
        code: 0b0111_1110_0000_0000,
        name: {
          long: 'Custom User 0',
          short: 'USER 0',
        },
        label: 'User 0',
        keywords: ['user0'],
      },
    });
    expect(subject.getCode()).toEqual(0b0111_1110_0000_0000);
    subject = new ViaUserKeyComposition({
      code: 0b0111_1110_0001_1111,
      isAny: false,
      kinds: ['function', 'via_user_key'],
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
    expect(subject.getCode()).toEqual(0b0111_1110_0001_1111);
  });

  describe('findKeymap', () => {
    test('customKeycodes is not specified', () => {
      const actual = ViaUserKeyComposition.findKeymap(
        0b0111_1110_0000_0000,
        undefined
      );
      expect(actual).not.toBeUndefined();
      expect(actual!.code).toEqual(0b0111_1110_0000_0000);
      expect(actual!.desc).toEqual('Kb 0');
      expect(actual!.kinds).toEqual(['function', 'via_user_key']);
      expect(actual!.keycodeInfo.name.short).toEqual('QK_KB_0');
      expect(actual!.keycodeInfo.name.long).toEqual('QK_KB_0');
      expect(actual!.keycodeInfo.label).toEqual('Kb 0');
    });

    test('customKeycodes is specified', () => {
      const actual = ViaUserKeyComposition.findKeymap(0b0111_1110_0000_0000, [
        {
          name: 'customKeycodeName1',
          shortName: 'customKeycodeShortName1',
          title: 'customKeycodeTitle1',
        },
      ]);
      expect(actual).not.toBeUndefined();
      expect(actual!.code).toEqual(0b0111_1110_0000_0000);
      expect(actual!.desc).toEqual('customKeycodeTitle1');
      expect(actual!.kinds).toEqual(['function', 'via_user_key']);
      expect(actual!.keycodeInfo.name.short).toEqual('customKeycodeShortName1');
      expect(actual!.keycodeInfo.name.long).toEqual('customKeycodeName1');
      expect(actual!.keycodeInfo.label).toEqual('customKeycodeName1');
    });

    test('customKeycodes is specified but empty', () => {
      const actual = ViaUserKeyComposition.findKeymap(0b0111_1110_0000_0000, [
        {
          name: '',
          shortName: '',
          title: '',
        },
      ]);
      expect(actual).not.toBeUndefined();
      expect(actual!.code).toEqual(0b0111_1110_0000_0000);
      expect(actual!.desc).toEqual('Kb 0');
      expect(actual!.kinds).toEqual(['function', 'via_user_key']);
      expect(actual!.keycodeInfo.name.short).toEqual('QK_KB_0');
      expect(actual!.keycodeInfo.name.long).toEqual('QK_KB_0');
      expect(actual!.keycodeInfo.label).toEqual('Kb 0');
    });
  });
});
