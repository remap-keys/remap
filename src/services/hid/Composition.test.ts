import {
  BasicComposition,
  FunctionComposition,
  IKeycodeCompositionKind,
  KeycodeCompositionFactory,
  KeycodeCompositionKind,
  ModLeftAlt,
  ModLeftControl,
  ModLeftGui,
  ModLeftShift,
  ModRightAlt,
  ModRightControl,
  ModRightGui,
  ModRightShift,
  ModsComposition,
} from './Composition';
import { IHid, IKeymap } from './Hid';
import * as sinon from 'sinon';

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
  describe('BasicComposition', () => {
    describe('getCode', () => {
      let subject = new BasicComposition({
        code: 0b0000_0100,
        isAny: false,
        keycodeInfo: {
          code: 0b0000_0100,
          name: {
            long: 'KC_A',
            short: 'KC_A',
          },
          label: 'A',
        },
      });
      expect(subject.getCode()).toEqual(0b0000_0000_0000_0100);
      subject = new BasicComposition({
        code: 0b0000_0000,
        isAny: false,
      });
      expect(subject.getCode()).toEqual(0b0000_0000_0000_0000);
      subject = new BasicComposition({
        code: 0b1111_1111,
        isAny: false,
      });
      expect(subject.getCode()).toEqual(0b0000_0000_1111_1111);
      subject = new BasicComposition({
        code: 0b1_0000_0000,
        isAny: false,
      });
      expect(subject.getCode()).toEqual(0b0000_0000_0000_0000);
    });
  });

  describe('ModsComposition', () => {
    describe('getCode', () => {
      let subject = new ModsComposition(
        [ModRightControl, ModRightAlt, ModRightShift, ModRightGui],
        {
          code: 0b0000_0100,
          isAny: false,
          keycodeInfo: {
            code: 0b0000_0100,
            name: {
              long: 'KC_A',
              short: 'KC_A',
            },
            label: 'A',
          },
        }
      );
      expect(subject.getCode()).toEqual(0b0001_1111_0000_0100);
      subject = new ModsComposition(
        [ModLeftControl, ModLeftAlt, ModLeftShift, ModLeftGui],
        {
          code: 0b0000_0000,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0000_1111_0000_0000);
      subject = new ModsComposition(
        [ModRightControl, ModRightAlt, ModRightShift, ModRightGui],
        {
          code: 0b0000_0000,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0001_1111_0000_0000);
      subject = new ModsComposition(
        [ModLeftControl, ModLeftAlt, ModLeftShift, ModLeftGui],
        {
          code: 0b1111_1111,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0000_1111_1111_1111);
      subject = new ModsComposition(
        [ModRightControl, ModRightAlt, ModRightShift, ModRightGui],
        {
          code: 0b1111_1111,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0001_1111_1111_1111);
      subject = new ModsComposition(
        [ModLeftControl, ModLeftAlt, ModLeftShift, ModLeftGui],
        {
          code: 0b1_0000_0000,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0000_1111_0000_0000);
      subject = new ModsComposition(
        [ModRightControl, ModRightAlt, ModRightShift, ModRightGui],
        {
          code: 0b1_0000_0000,
          isAny: false,
        }
      );
      expect(subject.getCode()).toEqual(0b0001_1111_0000_0000);
    });
  });

  describe('FunctionComposition', () => {
    describe('getCode', () => {
      let subject = new FunctionComposition(0b0000_0000_0000);
      expect(subject.getCode()).toEqual(0b0010_0000_0000_0000);
      subject = new FunctionComposition(0b1111_1111_1111);
      expect(subject.getCode()).toEqual(0b0010_1111_1111_1111);
      subject = new FunctionComposition(0b1_0000_0000_0000);
      expect(subject.getCode()).toEqual(0b0010_0000_0000_0000);
    });
  });

  describe('KeycodeCompositionFactory', () => {
    describe('createBasicComposition', () => {
      test('valid', () => {
        const hid: IHid = {
          getKeymap(code: number): IKeymap {
            return {} as IKeymap;
          },
        } as IHid;
        const stub = sinon.stub(hid, 'getKeymap');
        stub.onCall(0).returns({
          code: 0b0000_0100,
          isAny: false,
          keycodeInfo: {
            code: 0b0000_0100,
            name: {
              long: 'KC_A',
              short: 'KC_A',
            },
            label: 'A',
          },
        });
        const subject = new KeycodeCompositionFactory(
          0b0000_0000_0000_0100,
          hid
        );
        expect(subject.isBasic()).toBeTruthy();
        const actual = subject.createBasicComposition();
        expect(actual.getKey().code).toEqual(0b0000_0000_0000_0100);
      });

      test('not basic', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isBasic()).toBeFalsy();
        try {
          const actual = subject.createBasicComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createModsComposition', () => {
      test('valid - left', () => {
        const hid: IHid = {
          getKeymap(code: number): IKeymap {
            return {} as IKeymap;
          },
        } as IHid;
        const stub = sinon.stub(hid, 'getKeymap');
        stub.onCall(0).returns({
          code: 0b0000_0100,
          isAny: false,
          keycodeInfo: {
            code: 0b0000_0100,
            name: {
              long: 'KC_A',
              short: 'KC_A',
            },
            label: 'A',
          },
        });
        const subject = new KeycodeCompositionFactory(
          0b0000_1111_0000_0100,
          hid
        );
        expect(subject.isMods()).toBeTruthy();
        const actual = subject.createModsComposition();
        expect(actual.getKey().code).toEqual(0b0000_0100);
        expect(actual.getModifiers().length).toEqual(4);
        expect(actual.getModifiers().includes(ModLeftControl)).toBeTruthy();
        expect(actual.getModifiers().includes(ModLeftShift)).toBeTruthy();
        expect(actual.getModifiers().includes(ModLeftAlt)).toBeTruthy();
        expect(actual.getModifiers().includes(ModLeftGui)).toBeTruthy();
      });

      test('valid - right', () => {
        const hid: IHid = {
          getKeymap(code: number): IKeymap {
            return {} as IKeymap;
          },
        } as IHid;
        const stub = sinon.stub(hid, 'getKeymap');
        stub.onCall(0).returns({
          code: 0b0000_0100,
          isAny: false,
          keycodeInfo: {
            code: 0b0000_0100,
            name: {
              long: 'KC_A',
              short: 'KC_A',
            },
            label: 'A',
          },
        });
        const subject = new KeycodeCompositionFactory(
          0b0001_1111_0000_0100,
          hid
        );
        expect(subject.isMods()).toBeTruthy();
        const actual = subject.createModsComposition();
        expect(actual.getKey().code).toEqual(0b0000_0100);
        expect(actual.getModifiers().length).toEqual(4);
        expect(actual.getModifiers().includes(ModRightControl)).toBeTruthy();
        expect(actual.getModifiers().includes(ModRightShift)).toBeTruthy();
        expect(actual.getModifiers().includes(ModRightAlt)).toBeTruthy();
        expect(actual.getModifiers().includes(ModRightGui)).toBeTruthy();
      });

      test('not mods', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0000_0000_0000,
          hid
        );
        expect(subject.isMods()).toBeFalsy();
        try {
          const actual = subject.createModsComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('createFunctionComposition', () => {
      test('valid', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0010_0000_0000_0100,
          hid
        );
        expect(subject.isFunction()).toBeTruthy();
        const actual = subject.createFunctionComposition();
        expect(actual.getFunctionId()).toEqual(0b0000_0000_0100);
      });

      test('not function', () => {
        const hid: IHid = {} as IHid;
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          hid
        );
        expect(subject.isFunction()).toBeFalsy();
        try {
          const actual = subject.createFunctionComposition();
          fail('An exception must be thrown.');
        } catch (error) {
          // N/A
        }
      });
    });

    describe('getKind', () => {
      const toEqual = (code: number, expected: IKeycodeCompositionKind) => {
        const subject = new KeycodeCompositionFactory(code, {} as IHid);
        expect(subject.getKind()).toEqual(expected);
      };
      const notToEqual = (code: number, expected: IKeycodeCompositionKind) => {
        const subject = new KeycodeCompositionFactory(code, {} as IHid);
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
        checkKind(
          validList,
          invalidList,
          KeycodeCompositionKind.one_shot_layer
        );
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
          const subject = new KeycodeCompositionFactory(value, {} as IHid);
          expect(subject.getKind()).toBeNull();
        });
      });
    });
  });
});

export {};
