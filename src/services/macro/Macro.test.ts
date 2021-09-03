import {
  END_OF_MACRO_BYTES,
  MacroBuffer,
  SS_DOWN_CODE,
  SS_TAP_CODE,
  SS_UP_CODE,
} from './Macro';

describe('MacroBuffer', () => {
  test('properties', () => {
    const subject = new MacroBuffer(new Uint8Array([0, 1, 2]), 3, 4);
    expect(subject.getBytes()).toEqual(new Uint8Array([0, 1, 2]));
    expect(subject.getMaxMacroCount()).toEqual(3);
    expect(subject.getMaxMacroBufferSize()).toEqual(4);
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
