import {
  IKeycodeCompositionKind,
  KeycodeComposition,
  KeycodeCompositionKind,
} from './Composition';

const EXPECT_BASIC_LIST = [0b0000_0000_0000_0000, 0b0000_0000_1111_1111];
const EXPECT_MODS_LIST = [0b0000_0001_0000_0000, 0b0001_1111_1111_1111];
const EXPECT_FUNCTION_LIST = [0b0010_0000_0000_0000, 0b0010_1111_1111_1111];
const EXPECT_MACRO_LIST = [0b0011_0000_0000_0000, 0b0011_1111_1111_1111];
const EXPECT_LAYER_TAP_LIST = [0b0100_0000_0000_0000, 0b0100_1111_1111_1111];
const EXPECT_TO_LIST = [0b0101_0000_0000_0000, 0b0101_0000_1111_1111];
const EXPECT_MOMENTARY_LIST = [0b0101_0001_0000_0000, 0b0101_0001_1111_1111];
const EXPECT_DEF_LAYER_LIST = [0b0101_0010_0000_0000, 0b0101_0010_1111_1111];
const EXPECT_TOGGLE_LAYER_LIST = [0b0101_0011_0000_0000, 0b0101_0011_1111_1111];
const EXPECT_ONE_SHOT_LAYER_LIST = [
  0b0101_0100_0000_0000,
  0b0101_0100_1111_1111,
];
const EXPECT_ONE_SHOT_MOD_LIST = [0b0101_0101_0000_0000, 0b0101_0101_1111_1111];
const EXPECT_TAP_DANCE_LIST = [0b0101_0111_0000_0000, 0b0101_0111_1111_1111];
const EXPECT_LAYER_TAP_TOGGLE_LIST = [
  0b0101_1000_0000_0000,
  0b0101_1000_1111_1111,
];
const EXPECT_LAYER_MOD_LIST = [0b0101_1001_0000_0000, 0b0101_1001_1111_1111];
const EXPECT_SWAP_HANDS_LIST = [0b0101_1011_0000_0000, 0b0101_1011_1111_1111];
const EXPECT_MOD_TAP_LIST = [0b0110_0000_0000_0000, 0b0111_1111_1111_1111];
const EXPECT_UNICODE_LIST = [0b1000_0000_0000_0000, 0b1111_1111_1111_1111];
const EXPECT_LOOSE_KEYCODE_LIST = [
  0b0101_1100_0000_0000,
  0b0101_1111_1111_1111,
];
const EXPECT_UNKNOWN_LIST = [0b0101_0110_0000_0000_0000];

describe('Composition', () => {
  describe('getKind', () => {
    const toEqual = (code: number, expected: IKeycodeCompositionKind) => {
      const subject = new KeycodeComposition(code);
      expect(subject.getKind()).toEqual(expected);
    };
    const notToEqual = (code: number, expected: IKeycodeCompositionKind) => {
      const subject = new KeycodeComposition(code);
      expect(subject.getKind()).not.toEqual(expected);
    };
    const checkKind = (
      validList: number[][],
      invalidList: number[][],
      kind: IKeycodeCompositionKind
    ) => {
      validList.forEach((list) => {
        test.each(list)(`valid as ${kind}`, (value) => toEqual(value, kind));
      });
      invalidList.forEach((list) => {
        test.each(list)(`invalid as ${kind}`, (value) =>
          notToEqual(value, kind)
        );
      });
    };
    describe('basic', () => {
      const validList = [EXPECT_BASIC_LIST];
      const invalidList = [
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.basic);
    });
    describe('mods', () => {
      const validList = [EXPECT_MODS_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.mods);
    });
    describe('function', () => {
      const validList = [EXPECT_FUNCTION_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.function);
    });
    describe('macro', () => {
      const validList = [EXPECT_MACRO_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.macro);
    });
    describe('layer tap', () => {
      const validList = [EXPECT_LAYER_TAP_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.layer_tap);
    });
    describe('to', () => {
      const validList = [EXPECT_TO_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.to);
    });
    describe('momentary', () => {
      const validList = [EXPECT_MOMENTARY_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.momentary);
    });
    describe('def layer', () => {
      const validList = [EXPECT_DEF_LAYER_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.def_layer);
    });
    describe('toggle layer', () => {
      const validList = [EXPECT_TOGGLE_LAYER_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.toggle_layer);
    });
    describe('one shot layer', () => {
      const validList = [EXPECT_ONE_SHOT_LAYER_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.one_shot_layer);
    });
    describe('one shot mod', () => {
      const validList = [EXPECT_ONE_SHOT_MOD_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.one_shot_mod);
    });
    describe('tap dance', () => {
      const validList = [EXPECT_TAP_DANCE_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.tap_dance);
    });
    describe('layer tap toggle', () => {
      const validList = [EXPECT_LAYER_TAP_TOGGLE_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(
        validList,
        invalidList,
        KeycodeCompositionKind.layer_tap_toggle
      );
    });
    describe('layer mod', () => {
      const validList = [EXPECT_LAYER_MOD_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.layer_mod);
    });
    describe('swap hands', () => {
      const validList = [EXPECT_SWAP_HANDS_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.swap_hands);
    });
    describe('mod tap', () => {
      const validList = [EXPECT_MOD_TAP_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_UNICODE_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.mod_tap);
    });
    describe('unicode', () => {
      const validList = [EXPECT_UNICODE_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_LOOSE_KEYCODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.unicode);
    });
    describe('loose keycode', () => {
      const validList = [EXPECT_LOOSE_KEYCODE_LIST];
      const invalidList = [
        EXPECT_BASIC_LIST,
        EXPECT_MODS_LIST,
        EXPECT_FUNCTION_LIST,
        EXPECT_MACRO_LIST,
        EXPECT_LAYER_TAP_LIST,
        EXPECT_TO_LIST,
        EXPECT_MOMENTARY_LIST,
        EXPECT_DEF_LAYER_LIST,
        EXPECT_TOGGLE_LAYER_LIST,
        EXPECT_ONE_SHOT_LAYER_LIST,
        EXPECT_ONE_SHOT_MOD_LIST,
        EXPECT_TAP_DANCE_LIST,
        EXPECT_LAYER_TAP_TOGGLE_LIST,
        EXPECT_LAYER_MOD_LIST,
        EXPECT_SWAP_HANDS_LIST,
        EXPECT_MOD_TAP_LIST,
        EXPECT_UNICODE_LIST,
      ];
      checkKind(validList, invalidList, KeycodeCompositionKind.loose_keycode);
    });
    describe('unknown', () => {
      test.each(EXPECT_UNKNOWN_LIST)(`unknown`, (value) => {
        const subject = new KeycodeComposition(value);
        expect(subject.getKind()).toBeNull();
      });
    });
  });
});

export {};
