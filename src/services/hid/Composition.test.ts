import { describe, expect, test } from 'vitest';
import {
  IKeycodeCompositionKind,
  KeycodeCompositionFactory,
  KeycodeCompositionKind,
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_SFT,
} from './Composition';
import { OP_SH_TAP_TOGGLE } from './compositions/SwapHandsComposition';
import { MOD_LEFT, MOD_RIGHT } from './Constraints';

const EXPECT_BASIC_LIST = [0b0000_0000_0000_0000, 0b0000_0000_1111_1111];
const EXPECT_MODS_LIST = [0b0000_0001_0000_0000, 0b0001_1111_1111_1111];
const EXPECT_MACRO_LIST = [0b0111_0111_0000_0000, 0b0111_0111_0111_1111];
const EXPECT_LAYER_TAP_LIST = [0b0100_0000_0000_0000, 0b0100_1111_1111_1111];
const EXPECT_TO_LIST = [0b0101_0010_0000_0000, 0b0101_0010_0001_1111];
const EXPECT_MOMENTARY_LIST = [0b0101_0010_0010_0000, 0b0101_0010_0011_1111];
const EXPECT_DEF_LAYER_LIST = [0b0101_0010_0100_0000, 0b0101_0010_0101_1111];
const EXPECT_TOGGLE_LAYER_LIST = [0b0101_0010_0110_0000, 0b0101_0010_0111_1111];
const EXPECT_ONE_SHOT_LAYER_LIST = [
  0b0101_0010_1000_0000, 0b0101_0010_1001_1111,
];
const EXPECT_ONE_SHOT_MOD_LIST = [0b0101_0010_1010_0000, 0b0101_0010_1011_1111];
const EXPECT_TAP_DANCE_LIST = [0b0101_0111_0000_0000, 0b0101_0111_1111_1111];
const EXPECT_LAYER_TAP_TOGGLE_LIST = [
  0b0101_0010_1100_0000, 0b0101_0010_1101_1111,
];
const EXPECT_LAYER_MOD_LIST = [0b0101_0000_0000_0000, 0b0101_0001_1111_1111];
const EXPECT_SWAP_HANDS_LIST = [0b0101_0110_0000_0000, 0b0101_0110_1111_1111];
const EXPECT_MOD_TAP_LIST = [0b0010_0000_0000_0000, 0b0011_1111_1111_1111];
const EXPECT_UNICODE_LIST = [0b1000_0000_0000_0000, 0b1111_1111_1111_1111];
const EXPECT_LOOSE_KEYCODE_LIST = [
  0x7000, 0x7100, 0x7200, 0x7400, 0x7440, 0x7480, 0x74f0, 0x7800, 0x7c00,
  0x7e40,
];
const EXPECT_VIA_USER_KEY_LIST = [0b0111_1110_0000_0000, 0b0111_1110_0001_1111];
const EXPECT_UNKNOWN_LIST = [
  0b0101_1011_0000_0000, 0b0101_1111_0000_1111, 0b0101_1101_0001_0001,
];

describe('Composition', () => {
  describe('KeycodeCompositionFactory', () => {
    describe('createBasicComposition', () => {
      test('valid', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0000_0000_0100,
          'en-us',
        );
        expect(subject.isBasic()).toBeTruthy();
        const actual = subject.createBasicComposition();
        expect(actual.genKeymap()!.code).toEqual(0b0000_0000_0000_0100);
      });

      test('not basic', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isBasic()).toBeFalsy();
        expect(() => {
          subject.createBasicComposition();
        }).toThrowError();
      });
    });

    describe('createAsciiComposition', () => {
      test('supported code', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0000_0010_0001,
          'en-us',
        );
        expect(subject.isAscii()).toBeTruthy();
        const actual = subject.createAsciiKeycodeComposition();
        expect(actual.genKeymap()!.code).toEqual(0b0000_0000_0010_0001);
        expect(actual.genKeymap()!.isAscii).toBeTruthy();
        expect(actual.genKeymap()!.isAny).toBeFalsy();
      });

      test('not supported code', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0000_0000_0111,
          'en-us',
        );
        expect(subject.isAscii()).toBeTruthy();
        const actual = subject.createAsciiKeycodeComposition();
        expect(actual.genKeymap()!.code).toEqual(0b0000_0000_0000_0111);
        expect(actual.genKeymap()!.isAscii).toBeTruthy();
        expect(actual.genKeymap()!.isAny).toBeTruthy();
      });

      test('not ascii', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0000_1000_0000,
          'en-us',
        );
        expect(subject.isAscii()).toBeFalsy();
        expect(() => {
          subject.createAsciiKeycodeComposition();
        }).toThrowError();
      });
    });

    describe('createModsComposition', () => {
      test('valid - left', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_1111_0000_0100,
          'en-us',
        );
        expect(subject.isMods()).toBeTruthy();
        const actual = subject.createModsComposition();
        expect(actual.genKeymap()!.keycodeInfo.code).toEqual(0b0000_0100);
        expect(actual.getModDirection()).toEqual(MOD_LEFT);
        expect(actual.getModifiers().length).toEqual(4);
        expect(actual.getModifiers().includes(MOD_CTL)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_GUI)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_SFT)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_ALT)).toBeTruthy();
      });

      test('valid - right', () => {
        const subject = new KeycodeCompositionFactory(
          0b0001_1111_0000_0100,
          'en-us',
        );
        expect(subject.isMods()).toBeTruthy();
        const actual = subject.createModsComposition();
        expect(actual.genKeymap()!.code).toEqual(0b0001_1111_0000_0100);
        expect(actual.getModDirection()).toEqual(MOD_RIGHT);
        expect(actual.getModifiers().length).toEqual(4);
        expect(actual.getModifiers().includes(MOD_CTL)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_GUI)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_SFT)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_ALT)).toBeTruthy();
      });

      test('not mods', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0000_0000_0000,
          'en-us',
        );
        expect(subject.isMods()).toBeFalsy();
        expect(() => {
          subject.createModsComposition();
        }).toThrowError();
      });
    });

    describe('createMacroComposition', () => {
      test('valid', () => {
        const subject = new KeycodeCompositionFactory(
          0b0111_0111_0000_0100,
          'en-us',
        );
        expect(subject.isMacro()).toBeTruthy();
        const actual = subject.createMacroComposition();
        expect(actual.getMacroId()).toEqual(0b0000_0000_0100);
      });

      test('not macro', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isMacro()).toBeFalsy();
        expect(() => {
          subject.createMacroComposition();
        }).toThrowError();
      });
    });

    describe('createLayerTapComposition', () => {
      test('valid', () => {
        const subject = new KeycodeCompositionFactory(
          0b0100_0100_0000_0100,
          'en-us',
        );
        expect(subject.isLayerTap()).toBeTruthy();
        const actual = subject.createLayerTapComposition();
        expect(actual.genKeymap()!.keycodeInfo!.code).toEqual(
          0b0000_0000_0000_0100,
        );
        expect(actual.getLayer()).toEqual(4);
      });

      test('not layer tap', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isLayerTap()).toBeFalsy();
        expect(() => {
          subject.createLayerTapComposition();
        }).toThrowError();
      });
    });

    describe('createToComposition', () => {
      test('valid', () => {
        const subject = new KeycodeCompositionFactory(
          0b0101_0010_0001_0100,
          'en-us',
        );
        expect(subject.isTo()).toBeTruthy();
        const actual = subject.createToComposition();
        expect(actual.getLayer()).toEqual(20);
      });

      test('not to', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isTo()).toBeFalsy();
        expect(() => {
          subject.createToComposition();
        }).toThrowError();
      });
    });

    describe('createMomentaryComposition', () => {
      test('valid', () => {
        const subject = new KeycodeCompositionFactory(
          0b0101_0010_0010_0100,
          'en-us',
        );
        expect(subject.isMomentary()).toBeTruthy();
        const actual = subject.createMomentaryComposition();
        expect(actual.getLayer()).toEqual(4);
      });

      test('not to', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isMomentary()).toBeFalsy();
        expect(() => {
          subject.createMomentaryComposition();
        }).toThrowError();
      });
    });

    describe('createDefLayerComposition', () => {
      test('valid', () => {
        const subject = new KeycodeCompositionFactory(
          0b0101_0010_0100_0100,
          'en-us',
        );
        expect(subject.isDefLayer()).toBeTruthy();
        const actual = subject.createDefLayerComposition();
        expect(actual.getLayer()).toEqual(4);
      });

      test('not to', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isDefLayer()).toBeFalsy();
        expect(() => {
          subject.createDefLayerComposition();
        }).toThrowError();
      });
    });

    describe('createToggleLayerComposition', () => {
      test('valid', () => {
        const subject = new KeycodeCompositionFactory(
          0b0101_0010_0110_0100,
          'en-us',
        );
        expect(subject.isToggleLayer()).toBeTruthy();
        const actual = subject.createToggleLayerComposition();
        expect(actual.getLayer()).toEqual(4);
      });

      test('not to', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isToggleLayer()).toBeFalsy();
        expect(() => {
          subject.createToggleLayerComposition();
        }).toThrowError();
      });
    });

    describe('createOneShotLayerComposition', () => {
      test('valid', () => {
        const subject = new KeycodeCompositionFactory(
          0b0101_0010_1000_0100,
          'en-us',
        );
        expect(subject.isOneShotLayer()).toBeTruthy();
        const actual = subject.createOneShotLayerComposition();
        expect(actual.getLayer()).toEqual(4);
      });

      test('not to', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isOneShotLayer()).toBeFalsy();
        expect(() => {
          subject.createOneShotLayerComposition();
        }).toThrowError();
      });
    });

    describe('createOneShotModComposition', () => {
      test('valid - left', () => {
        const subject = new KeycodeCompositionFactory(
          0b0101_0010_1011_1111,
          'en-us',
        );
        expect(subject.isOneShotMod()).toBeTruthy();
        const actual = subject.createOneShotModComposition();
        expect(actual.getModDirection()).toEqual(MOD_RIGHT);
        expect(actual.getModifiers().length).toEqual(4);
        expect(actual.getModifiers().includes(MOD_CTL)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_GUI)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_SFT)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_ALT)).toBeTruthy();
      });

      test('valid - left', () => {
        const subject = new KeycodeCompositionFactory(
          0b0101_0010_1010_1111,
          'en-us',
        );
        expect(subject.isOneShotMod()).toBeTruthy();
        const actual = subject.createOneShotModComposition();
        expect(actual.getModDirection()).toEqual(MOD_LEFT);
        expect(actual.getModifiers().length).toEqual(4);
        expect(actual.getModifiers().includes(MOD_CTL)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_GUI)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_SFT)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_ALT)).toBeTruthy();
      });

      test('not mods', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0000_0000_0000,
          'en-us',
        );
        expect(subject.isOneShotMod()).toBeFalsy();
        expect(() => {
          subject.createOneShotModComposition();
        }).toThrowError();
      });
    });

    describe('createTapDanceComposition', () => {
      test('valid', () => {
        const subject = new KeycodeCompositionFactory(
          0b0101_0111_0000_0100,
          'en-us',
        );
        expect(subject.isTapDance()).toBeTruthy();
        const actual = subject.createTapDanceComposition();
        expect(actual.getNo()).toEqual(0b0000_0100);
      });

      test('not function', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isTapDance()).toBeFalsy();
        expect(() => {
          subject.createTapDanceComposition();
        }).toThrowError();
      });
    });

    describe('createLayerTapToggleComposition', () => {
      test('valid', () => {
        const subject = new KeycodeCompositionFactory(
          0b0101_0010_1100_0100,
          'en-us',
        );
        expect(subject.isLayerTapToggle()).toBeTruthy();
        const actual = subject.createLayerTapToggleComposition();
        expect(actual.getLayer()).toEqual(4);
      });

      test('not to', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isLayerTapToggle()).toBeFalsy();
        expect(() => {
          subject.createLayerTapToggleComposition();
        }).toThrowError();
      });
    });

    describe('createLayerModComposition', () => {
      test('valid', () => {
        const subject = new KeycodeCompositionFactory(
          0b0101_0001_0010_0111,
          'en-us',
        );
        expect(subject.isLayerMod()).toBeTruthy();
        const actual = subject.createLayerModComposition();
        expect(actual.getLayer()).toEqual(9);
        expect(actual.getModifiers().length).toEqual(3);
        expect(actual.getModifiers().includes(MOD_CTL)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_SFT)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_ALT)).toBeTruthy();
      });

      test('not to', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isLayerMod()).toBeFalsy();
        expect(() => {
          subject.createLayerModComposition();
        }).toThrowError();
      });
    });

    describe('createSwapHandsComposition', () => {
      test('valid - key', () => {
        const subject = new KeycodeCompositionFactory(
          0b0101_0110_0000_0100,
          'en-us',
        );
        expect(subject.isSwapHands()).toBeTruthy();
        const actual = subject.createSwapHandsComposition();
        expect(actual.isSwapHandsOption()).toBeFalsy();
        expect(actual.genKeymap()).not.toBeNull();
        expect(actual.genKeymap()!.keycodeInfo!.code).toEqual(0b0000_0100);
        expect(actual.getSwapHandsOption()).toBeNull();
      });

      test('valid - swap hands option', () => {
        const subject = new KeycodeCompositionFactory(
          0b0101_0110_1111_0001,
          'en-us',
        );
        expect(subject.isSwapHands()).toBeTruthy();
        const actual = subject.createSwapHandsComposition();
        expect(actual.isSwapHandsOption()).toBeTruthy();
        expect(actual.genKeymap()!.code).toEqual(0b0101_0110_1111_0001);
        expect(actual.getSwapHandsOption()).not.toBeNull();
        expect(actual.getSwapHandsOption()).toEqual(OP_SH_TAP_TOGGLE);
      });

      test('not to', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isLayerMod()).toBeFalsy();
        expect(() => {
          subject.createLayerModComposition();
        }).toThrowError();
      });
    });

    describe('createModTapComposition', () => {
      test('valid - left', () => {
        const subject = new KeycodeCompositionFactory(
          0b0010_1111_0000_0100,
          'en-us',
        );
        expect(subject.isModTap()).toBeTruthy();
        const actual = subject.createModTapComposition();
        expect(actual.genKeymap()!.code).toEqual(0b0010_1111_0000_0100);
        expect(actual.getModDirection()).toEqual(MOD_LEFT);
        expect(actual.getModifiers().length).toEqual(4);
        expect(actual.getModifiers().includes(MOD_CTL)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_GUI)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_SFT)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_ALT)).toBeTruthy();
      });

      test('valid - right', () => {
        const subject = new KeycodeCompositionFactory(
          0b0011_1111_0000_0100,
          'en-us',
        );
        expect(subject.isModTap()).toBeTruthy();
        const actual = subject.createModTapComposition();
        expect(actual.genKeymap()!.code).toEqual(0b0011_1111_0000_0100);
        expect(actual.getModDirection()).toEqual(MOD_RIGHT);
        expect(actual.getModifiers().length).toEqual(4);
        expect(actual.getModifiers().includes(MOD_CTL)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_GUI)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_SFT)).toBeTruthy();
        expect(actual.getModifiers().includes(MOD_ALT)).toBeTruthy();
      });

      test('not mods', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0000_0000_0000,
          'en-us',
        );
        expect(subject.isModTap()).toBeFalsy();
        expect(() => {
          subject.createModTapComposition();
        }).toThrowError();
      });
    });

    describe('createUnicodeComposition', () => {
      test('valid', () => {
        const subject = new KeycodeCompositionFactory(
          0b1011_0000_0100_0010,
          'en-us',
        );
        expect(subject.isUnicode()).toBeTruthy();
        const actual = subject.createUnicodeComposition();
        expect(actual.getCharCode()).toEqual(0b0011_0000_0100_0010);
      });

      test('not function', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isUnicode()).toBeFalsy();
        expect(() => {
          subject.createUnicodeComposition();
        }).toThrowError();
      });
    });

    describe('createLooseKeycodeComposition', () => {
      test('valid', () => {
        const subject = new KeycodeCompositionFactory(
          0b0111_0000_0000_0000,
          'en-us',
        );
        expect(subject.isLooseKeycode()).toBeTruthy();
        const actual = subject.createLooseKeycodeComposition();
        expect(actual.genKeymap()!.code).toEqual(0b0111_0000_0000_0000);
      });

      test('not function', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isLooseKeycode()).toBeFalsy();
        expect(() => {
          subject.createLooseKeycodeComposition();
        }).toThrowError();
      });
    });

    describe('createViaUserKeyComposition', () => {
      test('valid', () => {
        const subject = new KeycodeCompositionFactory(
          0b0111_1110_0000_0000,
          'en-us',
        );
        expect(subject.isViaUserKey()).toBeTruthy();
        const actual = subject.createViaUserKeyComposition(undefined);
        expect(actual.genKeymap()!.code).toEqual(0b0111_1110_0000_0000);
      });

      test('not via user key', () => {
        const subject = new KeycodeCompositionFactory(
          0b0000_0001_0000_0000,
          'en-us',
        );
        expect(subject.isViaUserKey()).toBeFalsy();
        expect(() => {
          subject.createViaUserKeyComposition(undefined);
        }).toThrowError();
      });
    });

    test('isAscii', () => {
      let subject = new KeycodeCompositionFactory(
        0b0000_0000_0000_0000,
        'en-us',
      );
      expect(subject.isAscii()).toBeTruthy();
      subject = new KeycodeCompositionFactory(0b0000_0000_0111_1111, 'en-us');
      expect(subject.isAscii()).toBeTruthy();
      subject = new KeycodeCompositionFactory(0b0000_0000_1000_0000, 'en-us');
      expect(subject.isAscii()).toBeFalsy();
    });

    describe('getKind', () => {
      const toEqual = (code: number, expected: IKeycodeCompositionKind) => {
        const subject = new KeycodeCompositionFactory(code, 'en-us');
        if (subject.getKind() === null) {
          console.log(subject);
        }
        expect(subject.getKind()).toEqual(expected);
      };
      const notToEqual = (code: number, expected: IKeycodeCompositionKind) => {
        const subject = new KeycodeCompositionFactory(code, 'en-us');
        expect(subject.getKind()).not.toEqual(expected);
      };
      const checkKind = (
        validList: number[][],
        invalidList: number[][],
        kind: IKeycodeCompositionKind,
      ) => {
        validList.forEach((list) => {
          test.each(list)(`valid as ${kind}`, (value) => toEqual(value, kind));
        });
        invalidList.forEach((list) => {
          test.each(list)(`invalid as ${kind}`, (value) =>
            notToEqual(value, kind),
          );
        });
      };
      describe('basic', () => {
        const validList = [EXPECT_BASIC_LIST];
        const invalidList = [
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
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.basic);
      });
      describe('mods', () => {
        const validList = [EXPECT_MODS_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
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
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.mods);
      });
      describe('macro', () => {
        const validList = [EXPECT_MACRO_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
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
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.macro);
      });
      describe('layer tap', () => {
        const validList = [EXPECT_LAYER_TAP_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
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
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.layer_tap);
      });
      describe('to', () => {
        const validList = [EXPECT_TO_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
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
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.to);
      });
      describe('momentary', () => {
        const validList = [EXPECT_MOMENTARY_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
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
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.momentary);
      });
      describe('def layer', () => {
        const validList = [EXPECT_DEF_LAYER_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
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
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.df);
      });
      describe('toggle layer', () => {
        const validList = [EXPECT_TOGGLE_LAYER_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
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
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.tl);
      });
      describe('one shot layer', () => {
        const validList = [EXPECT_ONE_SHOT_LAYER_LIST];
        const invalidList = [
          EXPECT_BASIC_LIST,
          EXPECT_MODS_LIST,
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
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.osl);
      });
      describe('one shot mod', () => {
        const validList = [EXPECT_ONE_SHOT_MOD_LIST];
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
          EXPECT_TAP_DANCE_LIST,
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.osm);
      });
      describe('tap dance', () => {
        const validList = [EXPECT_TAP_DANCE_LIST];
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
          EXPECT_LAYER_TAP_TOGGLE_LIST,
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.tap_dance);
      });
      describe('layer tap toggle', () => {
        const validList = [EXPECT_LAYER_TAP_TOGGLE_LIST];
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
          EXPECT_LAYER_MOD_LIST,
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.tt);
      });
      describe('layer mod', () => {
        const validList = [EXPECT_LAYER_MOD_LIST];
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
          EXPECT_SWAP_HANDS_LIST,
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.layer_mod);
      });
      describe('swap hands', () => {
        const validList = [EXPECT_SWAP_HANDS_LIST];
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
          EXPECT_MOD_TAP_LIST,
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.swap_hands);
      });
      describe('mod tap', () => {
        const validList = [EXPECT_MOD_TAP_LIST];
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
          EXPECT_UNICODE_LIST,
          EXPECT_LOOSE_KEYCODE_LIST,
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.mod_tap);
      });
      describe('unicode', () => {
        const validList = [EXPECT_UNICODE_LIST];
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
          EXPECT_LOOSE_KEYCODE_LIST,
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.unicode);
      });
      describe('loose keycode', () => {
        const validList = [EXPECT_LOOSE_KEYCODE_LIST];
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
          EXPECT_VIA_USER_KEY_LIST,
        ];
        checkKind(validList, invalidList, KeycodeCompositionKind.loose_keycode);
      });
      describe('via user key', () => {
        const validList = [EXPECT_VIA_USER_KEY_LIST];
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
        checkKind(validList, invalidList, KeycodeCompositionKind.via_user_key);
      });
      describe('unknown', () => {
        test.each(EXPECT_UNKNOWN_LIST)(`unknown`, (value) => {
          const subject = new KeycodeCompositionFactory(value, 'en-us');
          expect(subject.getKind()).toBeNull();
        });
      });
    });
  });
});

export {};
