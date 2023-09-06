import {
  END_OF_MACRO_BYTES,
  isHold,
  isTap,
  Macro,
  MacroBuffer,
  MacroKey,
  SS_DOWN_CODE,
  SS_TAP_CODE,
  SS_UP_CODE,
} from './Macro';
import { Key } from '../../components/configure/keycodekey/KeyGen';
import sinon from 'sinon';
import { MOD_LEFT } from '../hid/Constraints';

const createKey = (code: number, label: string, isAscii: boolean): Key => {
  return {
    label,
    meta: '',
    metaRight: undefined,
    keymap: {
      code,
      isAscii,
      isAny: false,
      kinds: [],
      keycodeInfo: {
        code,
        label,
        keywords: [],
        name: {
          long: '',
          short: '',
        },
      },
      modifiers: [],
      direction: MOD_LEFT,
    },
  };
};

describe('Macro', () => {
  test('properties', () => {
    const macroBuffer = sinon.createStubInstance(MacroBuffer);
    const subject = new Macro(macroBuffer, 1, new Uint8Array([2, 3, 4]));
    expect(subject.index).toEqual(1);
    expect(subject.getBytes()).toEqual(new Uint8Array([2, 3, 4]));
  });

  describe('updateMacroKeys', () => {
    test('simple', () => {
      const macroBuffer = sinon.createStubInstance(MacroBuffer);
      const subject = new Macro(macroBuffer, 0, new Uint8Array([]));
      const macroKeys: MacroKey[] = [
        {
          type: 'tap',
          key: createKey(0x21, '!', true),
        },
        {
          type: 'tap',
          key: createKey(0x1c, 'Y', false),
        },
        {
          type: 'hold',
          keys: [createKey(0x17, 'T', false)],
        },
      ];
      subject.updateMacroKeys(macroKeys);
      expect(subject.getBytes()).toEqual(
        new Uint8Array([
          0x21,
          SS_TAP_CODE,
          0x1c,
          SS_DOWN_CODE,
          0x17,
          SS_UP_CODE,
          0x17,
          END_OF_MACRO_BYTES,
        ])
      );
      expect(macroBuffer.updateMacro.calledOnce).toBeTruthy();
    });

    test('empty', () => {
      const macroBuffer = sinon.createStubInstance(MacroBuffer);
      const subject = new Macro(macroBuffer, 0, new Uint8Array([]));
      const macroKeys: MacroKey[] = [];
      subject.updateMacroKeys(macroKeys);
      expect(subject.getBytes()).toEqual(new Uint8Array([END_OF_MACRO_BYTES]));
      expect(macroBuffer.updateMacro.calledOnce).toBeTruthy();
    });

    test('multiple keys hold', () => {
      const macroBuffer = sinon.createStubInstance(MacroBuffer);
      const subject = new Macro(macroBuffer, 0, new Uint8Array([]));
      const macroKeys: MacroKey[] = [
        {
          type: 'hold',
          keys: [createKey(0x1c, 'Y', false), createKey(0x17, 'T', false)],
        },
      ];
      subject.updateMacroKeys(macroKeys);
      expect(subject.getBytes()).toEqual(
        new Uint8Array([
          SS_DOWN_CODE,
          0x1c,
          SS_DOWN_CODE,
          0x17,
          SS_UP_CODE,
          0x17,
          SS_UP_CODE,
          0x1c,
          END_OF_MACRO_BYTES,
        ])
      );
      expect(macroBuffer.updateMacro.calledOnce).toBeTruthy();
    });

    test('multiple holds', () => {
      const macroBuffer = sinon.createStubInstance(MacroBuffer);
      const subject = new Macro(macroBuffer, 0, new Uint8Array([]));
      const macroKeys: MacroKey[] = [
        {
          type: 'hold',
          keys: [createKey(0x1c, 'Y', false)],
        },
        {
          type: 'hold',
          keys: [createKey(0x17, 'T', false)],
        },
      ];
      subject.updateMacroKeys(macroKeys);
      expect(subject.getBytes()).toEqual(
        new Uint8Array([
          SS_DOWN_CODE,
          0x1c,
          SS_UP_CODE,
          0x1c,
          SS_DOWN_CODE,
          0x17,
          SS_UP_CODE,
          0x17,
          END_OF_MACRO_BYTES,
        ])
      );
      expect(macroBuffer.updateMacro.calledOnce).toBeTruthy();
    });
  });

  describe('generateMacroKeys', () => {
    test('simple', () => {
      const macroBufferStub = {} as MacroBuffer;
      const subject = new Macro(
        macroBufferStub,
        0,
        new Uint8Array([
          0x21, // ASCII !
          SS_TAP_CODE,
          0x1c, // QMK y
          SS_DOWN_CODE,
          0x17, // QMK t
          SS_UP_CODE,
          0x17, // QMK t
          END_OF_MACRO_BYTES,
        ])
      );
      const actual = subject.generateMacroKeys('en-us');
      expect(actual.success).toBeTruthy();
      expect(actual.macroKeys.length).toEqual(3);
      expect(actual.macroKeys[0].type).toEqual('tap');
      if (isTap(actual.macroKeys[0])) {
        expect(actual.macroKeys[0].key.label).toEqual('!');
        expect(actual.macroKeys[0].key.meta).toEqual('');
        expect(actual.macroKeys[0].key.metaRight).toBeUndefined();
        expect(actual.macroKeys[0].key.keymap.code).toEqual(0x21);
        expect(actual.macroKeys[0].key.keymap.isAscii).toBeTruthy();
        expect(actual.macroKeys[0].key.keymap.isAny).toBeFalsy();
      } else {
        fail('actual.macroKeys[0] is not Tap');
      }
      expect(actual.macroKeys[1].type).toEqual('tap');
      if (isTap(actual.macroKeys[1])) {
        expect(actual.macroKeys[1].key.label).toEqual('y');
        expect(actual.macroKeys[1].key.meta).toEqual('');
        expect(actual.macroKeys[1].key.metaRight).toBeUndefined();
        expect(actual.macroKeys[1].key.keymap.code).toEqual(0x1c);
        expect(actual.macroKeys[1].key.keymap.isAscii).toBeFalsy();
        expect(actual.macroKeys[1].key.keymap.isAny).toBeFalsy();
      } else {
        fail('actual.macroKeys[1] is not Tap');
      }
      expect(actual.macroKeys[2].type).toEqual('hold');
      if (isHold(actual.macroKeys[2])) {
        expect(actual.macroKeys[2].keys.length).toEqual(1);
        expect(actual.macroKeys[2].keys[0].label).toEqual('t');
        expect(actual.macroKeys[2].keys[0].meta).toEqual('');
        expect(actual.macroKeys[2].keys[0].metaRight).toBeUndefined();
        expect(actual.macroKeys[2].keys[0].keymap.code).toEqual(0x17);
        expect(actual.macroKeys[2].keys[0].keymap.isAscii).toBeFalsy();
        expect(actual.macroKeys[2].keys[0].keymap.isAny).toBeFalsy();
      } else {
        fail('actual.macroKeys[2] is not Hold');
      }
    });

    test('support each language', () => {
      const macroBufferStub = {} as MacroBuffer;
      const subject = new Macro(
        macroBufferStub,
        0,
        new Uint8Array([
          SS_TAP_CODE,
          0x2e, // QMK ^ in JA (= in US)
          END_OF_MACRO_BYTES,
        ])
      );
      let actual = subject.generateMacroKeys('en-us');
      expect(actual.success).toBeTruthy();
      expect(actual.macroKeys.length).toEqual(1);
      expect(actual.macroKeys[0].type).toEqual('tap');
      if (isTap(actual.macroKeys[0])) {
        expect(actual.macroKeys[0].key.label).toEqual('=');
        expect(actual.macroKeys[0].key.meta).toEqual('+');
        expect(actual.macroKeys[0].key.metaRight).toBeUndefined();
        expect(actual.macroKeys[0].key.keymap.code).toEqual(0x2e);
        expect(actual.macroKeys[0].key.keymap.isAscii).toBeFalsy();
        expect(actual.macroKeys[0].key.keymap.isAny).toBeFalsy();
      } else {
        fail('actual.macroKeys[0] is not Tap');
      }
      actual = subject.generateMacroKeys('ja-jp');
      expect(actual.success).toBeTruthy();
      expect(actual.macroKeys.length).toEqual(1);
      expect(actual.macroKeys[0].type).toEqual('tap');
      if (isTap(actual.macroKeys[0])) {
        expect(actual.macroKeys[0].key.label).toEqual('^');
        expect(actual.macroKeys[0].key.meta).toEqual('~');
        expect(actual.macroKeys[0].key.metaRight).toBeUndefined();
        expect(actual.macroKeys[0].key.keymap.code).toEqual(0x2e);
        expect(actual.macroKeys[0].key.keymap.isAscii).toBeFalsy();
        expect(actual.macroKeys[0].key.keymap.isAny).toBeFalsy();
      } else {
        fail('actual.macroKeys[0] is not Tap');
      }
    });

    test('empty', () => {
      const macroBufferStub = {} as MacroBuffer;
      const subject = new Macro(
        macroBufferStub,
        0,
        new Uint8Array([END_OF_MACRO_BYTES])
      );
      const actual = subject.generateMacroKeys('en-us');
      expect(actual.success).toBeTruthy();
      expect(actual.macroKeys.length).toEqual(0);
    });

    test('tap - ascii', () => {
      const macroBufferStub = {} as MacroBuffer;
      const subject = new Macro(
        macroBufferStub,
        0,
        new Uint8Array([
          0x21, // ASCII !
          0x22, // ASCII "
          0x0a, // ASCII LF
          END_OF_MACRO_BYTES,
        ])
      );
      const actual = subject.generateMacroKeys('en-us');
      expect(actual.success).toBeTruthy();
      expect(actual.macroKeys.length).toEqual(3);
      expect(actual.macroKeys[0].type).toEqual('tap');
      if (isTap(actual.macroKeys[0])) {
        expect(actual.macroKeys[0].key.label).toEqual('!');
        expect(actual.macroKeys[0].key.meta).toEqual('');
        expect(actual.macroKeys[0].key.metaRight).toBeUndefined();
        expect(actual.macroKeys[0].key.keymap.code).toEqual(0x21);
        expect(actual.macroKeys[0].key.keymap.isAscii).toBeTruthy();
        expect(actual.macroKeys[0].key.keymap.isAny).toBeFalsy();
      } else {
        fail('actual.macroKeys[0] is not Tap');
      }
      expect(actual.macroKeys[1].type).toEqual('tap');
      if (isTap(actual.macroKeys[1])) {
        expect(actual.macroKeys[1].key.label).toEqual('"');
        expect(actual.macroKeys[1].key.meta).toEqual('');
        expect(actual.macroKeys[1].key.metaRight).toBeUndefined();
        expect(actual.macroKeys[1].key.keymap.code).toEqual(0x22);
        expect(actual.macroKeys[1].key.keymap.isAscii).toBeTruthy();
        expect(actual.macroKeys[1].key.keymap.isAny).toBeFalsy();
      } else {
        fail('actual.macroKeys[1] is not Tap');
      }
      expect(actual.macroKeys[2].type).toEqual('tap');
      if (isTap(actual.macroKeys[2])) {
        expect(actual.macroKeys[2].key.label).toEqual('0xA');
        expect(actual.macroKeys[2].key.meta).toEqual('');
        expect(actual.macroKeys[2].key.metaRight).toBeUndefined();
        expect(actual.macroKeys[2].key.keymap.code).toEqual(0x0a);
        expect(actual.macroKeys[2].key.keymap.isAscii).toBeTruthy();
        expect(actual.macroKeys[2].key.keymap.isAny).toBeTruthy();
      } else {
        fail('actual.macroKeys[2] is not Tap');
      }
    });

    test('tap - qmk', () => {
      const macroBufferStub = {} as MacroBuffer;
      const subject = new Macro(
        macroBufferStub,
        0,
        new Uint8Array([
          SS_TAP_CODE,
          0x1b, // QMK x
          SS_TAP_CODE,
          0x1c, // QMK y
          SS_TAP_CODE,
          0x1d, // QMK z
          END_OF_MACRO_BYTES,
        ])
      );
      const actual = subject.generateMacroKeys('en-us');
      expect(actual.success).toBeTruthy();
      expect(actual.macroKeys.length).toEqual(3);
      expect(actual.macroKeys[0].type).toEqual('tap');
      if (isTap(actual.macroKeys[0])) {
        expect(actual.macroKeys[0].key.label).toEqual('x');
        expect(actual.macroKeys[0].key.meta).toEqual('');
        expect(actual.macroKeys[0].key.metaRight).toBeUndefined();
        expect(actual.macroKeys[0].key.keymap.code).toEqual(0x1b);
        expect(actual.macroKeys[0].key.keymap.isAscii).toBeFalsy();
        expect(actual.macroKeys[0].key.keymap.isAny).toBeFalsy();
      } else {
        fail('actual.macroKeys[0] is not Tap');
      }
      expect(actual.macroKeys[1].type).toEqual('tap');
      if (isTap(actual.macroKeys[1])) {
        expect(actual.macroKeys[1].key.label).toEqual('y');
        expect(actual.macroKeys[1].key.meta).toEqual('');
        expect(actual.macroKeys[1].key.metaRight).toBeUndefined();
        expect(actual.macroKeys[1].key.keymap.code).toEqual(0x1c);
        expect(actual.macroKeys[1].key.keymap.isAscii).toBeFalsy();
        expect(actual.macroKeys[1].key.keymap.isAny).toBeFalsy();
      } else {
        fail('actual.macroKeys[1] is not Tap');
      }
      expect(actual.macroKeys[2].type).toEqual('tap');
      if (isTap(actual.macroKeys[2])) {
        expect(actual.macroKeys[2].key.label).toEqual('z');
        expect(actual.macroKeys[2].key.meta).toEqual('');
        expect(actual.macroKeys[2].key.metaRight).toBeUndefined();
        expect(actual.macroKeys[2].key.keymap.code).toEqual(0x1d);
        expect(actual.macroKeys[2].key.keymap.isAscii).toBeFalsy();
        expect(actual.macroKeys[2].key.keymap.isAny).toBeFalsy();
      } else {
        fail('actual.macroKeys[2] is not Tap');
      }
    });

    test('hold - qmk', () => {
      const macroBufferStub = {} as MacroBuffer;
      const subject = new Macro(
        macroBufferStub,
        0,
        new Uint8Array([
          SS_DOWN_CODE,
          0x1b, // QMK x
          SS_DOWN_CODE,
          0x1c, // QMK y
          SS_UP_CODE,
          0x1c, // QMK y
          SS_UP_CODE,
          0x1b, // QMK x
          SS_DOWN_CODE,
          0x1d, // QMK z
          SS_UP_CODE,
          0x1d, // QMK z
          END_OF_MACRO_BYTES,
        ])
      );
      const actual = subject.generateMacroKeys('en-us');
      expect(actual.success).toBeTruthy();
      expect(actual.macroKeys.length).toEqual(2);
      expect(actual.macroKeys[0].type).toEqual('hold');
      if (isHold(actual.macroKeys[0])) {
        expect(actual.macroKeys[0].keys.length).toEqual(2);
        expect(actual.macroKeys[0].keys[0].label).toEqual('x');
        expect(actual.macroKeys[0].keys[0].meta).toEqual('');
        expect(actual.macroKeys[0].keys[0].metaRight).toBeUndefined();
        expect(actual.macroKeys[0].keys[0].keymap.code).toEqual(0x1b);
        expect(actual.macroKeys[0].keys[0].keymap.isAscii).toBeFalsy();
        expect(actual.macroKeys[0].keys[0].keymap.isAny).toBeFalsy();
        expect(actual.macroKeys[0].keys[1].label).toEqual('y');
        expect(actual.macroKeys[0].keys[1].meta).toEqual('');
        expect(actual.macroKeys[0].keys[1].metaRight).toBeUndefined();
        expect(actual.macroKeys[0].keys[1].keymap.code).toEqual(0x1c);
        expect(actual.macroKeys[0].keys[1].keymap.isAscii).toBeFalsy();
        expect(actual.macroKeys[0].keys[1].keymap.isAny).toBeFalsy();
      } else {
        fail('actual.macroKeys[0] is not Hold');
      }
      expect(actual.macroKeys[1].type).toEqual('hold');
      if (isHold(actual.macroKeys[1])) {
        expect(actual.macroKeys[1].keys.length).toEqual(1);
        expect(actual.macroKeys[1].keys[0].label).toEqual('z');
        expect(actual.macroKeys[1].keys[0].meta).toEqual('');
        expect(actual.macroKeys[1].keys[0].metaRight).toBeUndefined();
        expect(actual.macroKeys[1].keys[0].keymap.code).toEqual(0x1d);
        expect(actual.macroKeys[1].keys[0].keymap.isAscii).toBeFalsy();
        expect(actual.macroKeys[1].keys[0].keymap.isAny).toBeFalsy();
      } else {
        fail('actual.macroKeys[1] is not Hold');
      }
    });

    test('invalid hold combination', () => {
      const macroBufferStub = {} as MacroBuffer;
      const subject = new Macro(
        macroBufferStub,
        0,
        new Uint8Array([
          SS_DOWN_CODE,
          0x1b, // QMK x
          SS_UP_CODE,
          0x1d, // QMK z
          END_OF_MACRO_BYTES,
        ])
      );
      const actual = subject.generateMacroKeys('en-us');
      expect(actual.error).toEqual('Invalid a byte combination for hold key.');
      expect(actual.macroKeys.length).toEqual(0);
      expect(actual.success).toBeFalsy();
    });

    test('invalid hold combination (only down)', () => {
      const macroBufferStub = {} as MacroBuffer;
      const subject = new Macro(
        macroBufferStub,
        0,
        new Uint8Array([
          SS_DOWN_CODE,
          0x1b, // QMK x
          SS_TAP_CODE,
          0x1b, // QMK x
          END_OF_MACRO_BYTES,
        ])
      );
      const actual = subject.generateMacroKeys('en-us');
      expect(actual.error).toEqual(
        'Invalid a special code for hold key (up key not exists).'
      );
      expect(actual.macroKeys.length).toEqual(0);
      expect(actual.success).toBeFalsy();
    });

    test('invalid hold combination (only up)', () => {
      const macroBufferStub = {} as MacroBuffer;
      const subject = new Macro(
        macroBufferStub,
        0,
        new Uint8Array([
          SS_UP_CODE,
          0x1b, // QMK x
          SS_TAP_CODE,
          0x1b, // QMK x
          END_OF_MACRO_BYTES,
        ])
      );
      const actual = subject.generateMacroKeys('en-us');
      expect(actual.error).toEqual(
        'Invalid a special code for hold key (down key not exists).'
      );
      expect(actual.macroKeys.length).toEqual(0);
      expect(actual.success).toBeFalsy();
    });

    test('not end with null', () => {
      const macroBufferStub = {} as MacroBuffer;
      const subject = new Macro(
        macroBufferStub,
        0,
        new Uint8Array([
          SS_TAP_CODE,
          0x1b, // QMK x
        ])
      );
      const actual = subject.generateMacroKeys('en-us');
      expect(actual.error).toEqual('Not end with a null character.');
      expect(actual.macroKeys.length).toEqual(0);
      expect(actual.success).toBeFalsy();
    });

    test('bytes length is 0', () => {
      const macroBufferStub = {} as MacroBuffer;
      const subject = new Macro(macroBufferStub, 0, new Uint8Array([]));
      const actual = subject.generateMacroKeys('en-us');
      expect(actual.error).toEqual('The bytes length is 0.');
      expect(actual.macroKeys.length).toEqual(0);
      expect(actual.success).toBeFalsy();
    });

    test('invalid non ascii code', () => {
      const macroBufferStub = {} as MacroBuffer;
      const subject = new Macro(
        macroBufferStub,
        0,
        new Uint8Array([
          0b1000_0000, // non ascii
          END_OF_MACRO_BYTES,
        ])
      );
      const actual = subject.generateMacroKeys('en-us');
      expect(actual.error).toEqual('non ascii code detected.');
      expect(actual.macroKeys.length).toEqual(0);
      expect(actual.success).toBeFalsy();
    });
  });
});

describe('MacroBuffer', () => {
  test('properties', () => {
    const subject = new MacroBuffer(new Uint8Array([0, 1, 2]), 3, 4);
    expect(subject.getBytes()).toEqual(new Uint8Array([0, 1, 2]));
    expect(subject.getMaxMacroCount()).toEqual(3);
    expect(subject.getMaxMacroBufferSize()).toEqual(4);
  });

  describe('updateMacro', () => {
    test('normal', () => {
      const maxMacroBufferSize = 24;
      const maxMacroCount = 3;
      const subject = new MacroBuffer(
        new Uint8Array([
          0x21, // ASCII !
          SS_TAP_CODE,
          0x1c, // QMK y
          SS_DOWN_CODE,
          0x17, // QMK t
          SS_UP_CODE,
          0x17, // QMK t
          END_OF_MACRO_BYTES,

          0x22, // ASCII "
          SS_TAP_CODE,
          0x1b, // QMK x
          SS_DOWN_CODE,
          0x16, // QMK s
          SS_UP_CODE,
          0x16, // QMK s
          END_OF_MACRO_BYTES,

          0x23, // ASCII #
          SS_TAP_CODE,
          0x1a, // QMK w
          SS_DOWN_CODE,
          0x15, // QMK r
          SS_UP_CODE,
          0x15, // QMK r
          END_OF_MACRO_BYTES,
        ]),
        maxMacroCount,
        maxMacroBufferSize
      );
      const macro = new Macro(
        subject,
        1,
        new Uint8Array([
          0x21, // ASCII !
          END_OF_MACRO_BYTES,
        ])
      );
      subject.updateMacro(macro);
      expect(subject.getBytes()).toEqual(
        new Uint8Array([
          0x21, // ASCII !
          SS_TAP_CODE,
          0x1c, // QMK y
          SS_DOWN_CODE,
          0x17, // QMK t
          SS_UP_CODE,
          0x17, // QMK t
          END_OF_MACRO_BYTES,

          0x21, // ASCII !
          END_OF_MACRO_BYTES,

          0x23, // ASCII #
          SS_TAP_CODE,
          0x1a, // QMK w
          SS_DOWN_CODE,
          0x15, // QMK r
          SS_UP_CODE,
          0x15, // QMK r
          END_OF_MACRO_BYTES,
        ])
      );
    });

    test('empty buffer', () => {
      const maxMacroBufferSize = 24;
      const maxMacroCount = 3;
      const subject = new MacroBuffer(
        new Uint8Array([
          END_OF_MACRO_BYTES,
          END_OF_MACRO_BYTES,
          END_OF_MACRO_BYTES,
        ]),
        maxMacroCount,
        maxMacroBufferSize
      );
      const macro = new Macro(
        subject,
        2,
        new Uint8Array([
          0x21, // ASCII !
          END_OF_MACRO_BYTES,
        ])
      );
      subject.updateMacro(macro);
      expect(subject.getBytes()).toEqual(
        new Uint8Array([
          END_OF_MACRO_BYTES,
          END_OF_MACRO_BYTES,
          0x21,
          END_OF_MACRO_BYTES,
        ])
      );
    });
  });

  describe('generateMacros', () => {
    test('normal', () => {
      const maxMacroBufferSize = 24;
      const maxMacroCount = 3;
      const subject = new MacroBuffer(
        new Uint8Array([
          0x21, // ASCII !
          SS_TAP_CODE,
          0x1c, // QMK y
          SS_DOWN_CODE,
          0x17, // QMK t
          SS_UP_CODE,
          0x17, // QMK t
          END_OF_MACRO_BYTES,

          0x22, // ASCII "
          SS_TAP_CODE,
          0x1b, // QMK x
          SS_DOWN_CODE,
          0x16, // QMK s
          SS_UP_CODE,
          0x16, // QMK s
          END_OF_MACRO_BYTES,

          0x23, // ASCII #
          SS_TAP_CODE,
          0x1a, // QMK w
          SS_DOWN_CODE,
          0x15, // QMK r
          SS_UP_CODE,
          0x15, // QMK r
          END_OF_MACRO_BYTES,
        ]),
        maxMacroCount,
        maxMacroBufferSize
      );
      const actual = subject.generateMacros();
      expect(actual.length).toEqual(maxMacroCount);
      expect(actual[0].index).toEqual(0);
      expect(actual[0].getBytes()).toEqual(
        new Uint8Array([
          0x21, // ASCII !
          SS_TAP_CODE,
          0x1c, // QMK y
          SS_DOWN_CODE,
          0x17, // QMK t
          SS_UP_CODE,
          0x17, // QMK t
          END_OF_MACRO_BYTES,
        ])
      );
      expect(actual[1].index).toEqual(1);
      expect(actual[1].getBytes()).toEqual(
        new Uint8Array([
          0x22, // ASCII "
          SS_TAP_CODE,
          0x1b, // QMK x
          SS_DOWN_CODE,
          0x16, // QMK s
          SS_UP_CODE,
          0x16, // QMK s
          END_OF_MACRO_BYTES,
        ])
      );
      expect(actual[2].index).toEqual(2);
      expect(actual[2].getBytes()).toEqual(
        new Uint8Array([
          0x23, // ASCII #
          SS_TAP_CODE,
          0x1a, // QMK w
          SS_DOWN_CODE,
          0x15, // QMK r
          SS_UP_CODE,
          0x15, // QMK r
          END_OF_MACRO_BYTES,
        ])
      );
    });

    test('all buffer filled by 0', () => {
      const maxMacroBufferSize = 24;
      const maxMacroCount = 3;
      const subject = new MacroBuffer(
        new Uint8Array(maxMacroBufferSize),
        maxMacroCount,
        maxMacroBufferSize
      );
      const actual = subject.generateMacros();
      expect(actual.length).toEqual(maxMacroCount);
      expect(actual[0].index).toEqual(0);
      expect(actual[0].getBytes()).toEqual(new Uint8Array([0]));
      expect(actual[1].index).toEqual(1);
      expect(actual[1].getBytes()).toEqual(new Uint8Array([0]));
      expect(actual[2].index).toEqual(2);
      expect(actual[2].getBytes()).toEqual(new Uint8Array([0]));
    });

    test('first macro does not end with 0', () => {
      const maxMacroBufferSize = 7;
      const maxMacroCount = 1;
      const subject = new MacroBuffer(
        new Uint8Array([
          0x21, // ASCII !
          SS_TAP_CODE,
          0x1c, // QMK y
          SS_DOWN_CODE,
          0x17, // QMK t
          SS_UP_CODE,
          0x17, // QMK t
        ]),
        maxMacroCount,
        maxMacroBufferSize
      );
      const actual = subject.generateMacros();
      expect(actual.length).toEqual(maxMacroCount);
      expect(actual[0].index).toEqual(0);
      expect(actual[0].getBytes()).toEqual(
        new Uint8Array([END_OF_MACRO_BYTES])
      );
    });

    test('first macro in 2 macros does not end with 0', () => {
      const maxMacroBufferSize = 7;
      const maxMacroCount = 2;
      const subject = new MacroBuffer(
        new Uint8Array([
          0x21, // ASCII !
          SS_TAP_CODE,
          0x1c, // QMK y
          SS_DOWN_CODE,
          0x17, // QMK t
          SS_UP_CODE,
          0x17, // QMK t
        ]),
        maxMacroCount,
        maxMacroBufferSize
      );
      const actual = subject.generateMacros();
      expect(actual.length).toEqual(maxMacroCount);
      expect(actual[0].index).toEqual(0);
      expect(actual[0].getBytes()).toEqual(
        new Uint8Array([END_OF_MACRO_BYTES])
      );
      expect(actual[1].index).toEqual(1);
      expect(actual[1].getBytes()).toEqual(
        new Uint8Array([END_OF_MACRO_BYTES])
      );
    });

    test('last macro does not end with 0', () => {
      const maxMacroBufferSize = 15;
      const maxMacroCount = 3;
      const subject = new MacroBuffer(
        new Uint8Array([
          0x21, // ASCII !
          SS_TAP_CODE,
          0x1c, // QMK y
          SS_DOWN_CODE,
          0x17, // QMK t
          SS_UP_CODE,
          0x17, // QMK t
          END_OF_MACRO_BYTES,

          0x22, // ASCII "
          SS_TAP_CODE,
          0x1b, // QMK x
          SS_DOWN_CODE,
          0x16, // QMK s
          SS_UP_CODE,
          0x16, // QMK s
        ]),
        maxMacroCount,
        maxMacroBufferSize
      );
      const actual = subject.generateMacros();
      expect(actual.length).toEqual(maxMacroCount);
      expect(actual[0].index).toEqual(0);
      expect(actual[0].getBytes()).toEqual(
        new Uint8Array([
          0x21, // ASCII !
          SS_TAP_CODE,
          0x1c, // QMK y
          SS_DOWN_CODE,
          0x17, // QMK t
          SS_UP_CODE,
          0x17, // QMK t
          END_OF_MACRO_BYTES,
        ])
      );
      expect(actual[1].index).toEqual(1);
      expect(actual[1].getBytes()).toEqual(
        new Uint8Array([END_OF_MACRO_BYTES])
      );
      expect(actual[2].index).toEqual(2);
      expect(actual[2].getBytes()).toEqual(
        new Uint8Array([END_OF_MACRO_BYTES])
      );
    });

    test('some macros use all macro buffer', () => {
      const maxMacroBufferSize = 16;
      const maxMacroCount = 3;
      const subject = new MacroBuffer(
        new Uint8Array([
          0x21, // ASCII !
          SS_TAP_CODE,
          0x1c, // QMK y
          SS_DOWN_CODE,
          0x17, // QMK t
          SS_UP_CODE,
          0x17, // QMK t
          END_OF_MACRO_BYTES,

          0x22, // ASCII "
          SS_TAP_CODE,
          0x1b, // QMK x
          SS_DOWN_CODE,
          0x16, // QMK s
          SS_UP_CODE,
          0x16, // QMK s
          END_OF_MACRO_BYTES,
        ]),
        maxMacroCount,
        maxMacroBufferSize
      );
      const actual = subject.generateMacros();
      expect(actual.length).toEqual(maxMacroCount);
      expect(actual[0].index).toEqual(0);
      expect(actual[0].getBytes()).toEqual(
        new Uint8Array([
          0x21, // ASCII !
          SS_TAP_CODE,
          0x1c, // QMK y
          SS_DOWN_CODE,
          0x17, // QMK t
          SS_UP_CODE,
          0x17, // QMK t
          END_OF_MACRO_BYTES,
        ])
      );
      expect(actual[1].index).toEqual(1);
      expect(actual[1].getBytes()).toEqual(
        new Uint8Array([
          0x22, // ASCII "
          SS_TAP_CODE,
          0x1b, // QMK x
          SS_DOWN_CODE,
          0x16, // QMK s
          SS_UP_CODE,
          0x16, // QMK s
          END_OF_MACRO_BYTES,
        ])
      );
      expect(actual[2].index).toEqual(2);
      expect(actual[2].getBytes()).toEqual(
        new Uint8Array([END_OF_MACRO_BYTES])
      );
    });

    test('max macro buffer size is 0', () => {
      const maxMacroBufferSize = 0;
      const maxMacroCount = 3;
      const subject = new MacroBuffer(
        new Uint8Array([]),
        maxMacroCount,
        maxMacroBufferSize
      );
      const actual = subject.generateMacros();
      expect(actual.length).toEqual(0);
    });

    test('max macro count is 0', () => {
      const maxMacroBufferSize = 16;
      const maxMacroCount = 0;
      const subject = new MacroBuffer(
        new Uint8Array(16),
        maxMacroCount,
        maxMacroBufferSize
      );
      const actual = subject.generateMacros();
      expect(actual.length).toEqual(0);
    });

    test('buffer is empty', () => {
      const maxMacroBufferSize = 16;
      const maxMacroCount = 3;
      const subject = new MacroBuffer(
        new Uint8Array(0),
        maxMacroCount,
        maxMacroBufferSize
      );
      const actual = subject.generateMacros();
      expect(actual.length).toEqual(3);
      expect(actual[0].index).toEqual(0);
      expect(actual[0].getBytes()).toEqual(
        new Uint8Array([END_OF_MACRO_BYTES])
      );
      expect(actual[1].index).toEqual(1);
      expect(actual[1].getBytes()).toEqual(
        new Uint8Array([END_OF_MACRO_BYTES])
      );
      expect(actual[2].index).toEqual(2);
      expect(actual[2].getBytes()).toEqual(
        new Uint8Array([END_OF_MACRO_BYTES])
      );
    });
  });
});
