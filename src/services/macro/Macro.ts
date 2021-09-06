import { genKey, Key } from '../../components/configure/keycodekey/KeyGen';
import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';
import {
  AsciiComposition,
  KeycodeCompositionFactory,
} from '../hid/Composition';

export type TapHold = 'tap' | 'hold';

export type IMacroKey = {
  key: Key;
  type: TapHold;
};

export type IGetMacroKeysResult = {
  success: boolean;
  error?: string;
  macroKeys: IMacroKey[];
};

export const END_OF_MACRO_BYTES = 0;
export const SS_TAP_CODE = 1;
export const SS_DOWN_CODE = 2;
export const SS_UP_CODE = 3;

export interface IMacro {
  /**
   * The index number of the macro.
   * The first index number is 0.
   * This number never be over the (max macro count - 1).
   */
  readonly index: number;
  getBytes(): Uint8Array;
  generateMacroKeys(labelLang: KeyboardLabelLang): IGetMacroKeysResult;
  updateMacroKeys(macroKeys: IMacroKey[]): void;
}

export class Macro implements IMacro {
  readonly index: number;
  private bytes: Uint8Array;
  private macroBuffer: IMacroBuffer;

  constructor(macroBuffer: IMacroBuffer, index: number, bytes: Uint8Array) {
    this.macroBuffer = macroBuffer;
    this.index = index;
    this.bytes = bytes;
  }

  getBytes(): Uint8Array {
    return this.bytes;
  }

  generateMacroKeys(labelLang: KeyboardLabelLang): IGetMacroKeysResult {
    if (this.bytes.length === 0) {
      return {
        success: false,
        error: 'The bytes length is 0.',
        macroKeys: [],
      };
    }
    const macroKeys: IMacroKey[] = [];
    const byteLength = this.bytes.length;
    let pos = 0;
    let existsNullAtEnd = false;
    const holdStack: IMacroKey[] = [];
    while (pos < byteLength) {
      if (this.bytes[pos] === SS_TAP_CODE) {
        const keycodeCompositionFactory = new KeycodeCompositionFactory(
          this.bytes[++pos],
          labelLang
        );
        const basicComposition = keycodeCompositionFactory.createBasicComposition();
        const keymap = basicComposition.genKeymap()!;
        const key = genKey(keymap, labelLang);
        macroKeys.push({ key, type: 'tap' });
      } else if (this.bytes[pos] === SS_DOWN_CODE) {
        const keycodeCompositionFactory = new KeycodeCompositionFactory(
          this.bytes[++pos],
          labelLang
        );
        const basicComposition = keycodeCompositionFactory.createBasicComposition();
        const keymap = basicComposition.genKeymap()!;
        const key = genKey(keymap, labelLang);
        const macroKey: IMacroKey = { key, type: 'hold' };
        macroKeys.push(macroKey);
        holdStack.push(macroKey);
      } else if (this.bytes[pos] === SS_UP_CODE) {
        const lastHoldMacroKey = holdStack.pop();
        if (!lastHoldMacroKey) {
          return {
            success: false,
            error: 'Invalid a special code for hold key (down key not exists).',
            macroKeys: [],
          };
        } else if (lastHoldMacroKey.key.keymap.code !== this.bytes[++pos]) {
          return {
            success: false,
            error: 'Invalid a byte combination for hold key.',
            macroKeys: [],
          };
        }
      } else if (this.bytes[pos] === END_OF_MACRO_BYTES) {
        if (holdStack.length > 0) {
          return {
            success: false,
            error: 'Invalid a special code for hold key (up key not exists).',
            macroKeys: [],
          };
        }
        existsNullAtEnd = true;
        break;
      } else {
        if (holdStack.length > 0) {
          return {
            success: false,
            error: 'Invalid a special code for hold key (up key not exists).',
            macroKeys: [],
          };
        }
        const keycodeCompositionFactory = new KeycodeCompositionFactory(
          this.bytes[pos],
          labelLang
        );
        if (keycodeCompositionFactory.isAscii()) {
          const asciiComposition = keycodeCompositionFactory.createAsciiKeycodeComposition();
          const keymap = asciiComposition.genKeymap()!;
          const key = genKey(keymap, labelLang);
          macroKeys.push({ key, type: 'tap' });
        } else {
          return {
            success: false,
            error: 'non ascii code detected.',
            macroKeys: [],
          };
        }
      }
      pos++;
    }
    if (!existsNullAtEnd) {
      return {
        success: false,
        error: 'Not end with a null character.',
        macroKeys: [],
      };
    }
    return {
      success: true,
      macroKeys,
    };
  }

  updateMacroKeys(macroKeys: IMacroKey[]) {
    const bytes: number[] = [];
    const holdStack: IMacroKey[] = [];
    for (const macroKey of macroKeys) {
      if (macroKey.type === 'tap') {
        let stackedMacroKey = holdStack.pop();
        while (stackedMacroKey) {
          bytes.push(SS_UP_CODE);
          bytes.push(stackedMacroKey.key.keymap.code);
          stackedMacroKey = holdStack.pop();
        }
        if (!macroKey.key.keymap.isAscii) {
          bytes.push(SS_TAP_CODE);
        }
        bytes.push(macroKey.key.keymap.code);
      } else {
        // hold
        bytes.push(SS_DOWN_CODE);
        bytes.push(macroKey.key.keymap.code);
        holdStack.push(macroKey);
      }
    }
    let stackedMacroKey = holdStack.pop();
    while (stackedMacroKey) {
      bytes.push(SS_UP_CODE);
      bytes.push(stackedMacroKey.key.keymap.code);
      stackedMacroKey = holdStack.pop();
    }
    bytes.push(END_OF_MACRO_BYTES);
    this.bytes = new Uint8Array(bytes);
    this.macroBuffer.updateMacro(this);
  }
}

export interface IMacroBuffer {
  /**
   * Generate macro definition list with the byte array which this macro buffer has.
   */
  generateMacros(): IMacro[];

  /**
   * Update bytes with the specified macro definition.
   * The result of `getBytes()` and `generateMacros()` methods will be changed
   * after calling this method.
   */
  updateMacro(macro: IMacro): void;

  /**
   * Return the byte array which this macro buffer has.
   */
  getBytes(): Uint8Array;
}

export class MacroBuffer implements IMacroBuffer {
  private bytes: Uint8Array;
  private maxMacroCount: number;
  private maxMacroBufferSize: number;

  constructor(
    bytes: Uint8Array,
    maxMacroCount: number,
    maxMacroBufferSize: number
  ) {
    this.bytes = bytes;
    this.maxMacroCount = maxMacroCount;
    this.maxMacroBufferSize = maxMacroBufferSize;
  }

  getBytes(): Uint8Array {
    return this.bytes;
  }

  getMaxMacroCount(): number {
    return this.maxMacroCount;
  }

  getMaxMacroBufferSize(): number {
    return this.maxMacroBufferSize;
  }

  generateMacros(): IMacro[] {
    if (this.maxMacroBufferSize === 0) {
      return [];
    }
    if (this.maxMacroCount === 0) {
      return [];
    }

    const macros: IMacro[] = [];
    let start = 0;
    let index = 0;
    for (let i = 0; i < this.bytes.length; i++) {
      if (this.bytes[i] === END_OF_MACRO_BYTES) {
        macros.push(new Macro(this, index++, this.bytes.slice(start, i + 1)));
        start = i + 1;
      }
      if (this.maxMacroCount < index + 1) {
        break;
      }
    }
    if (macros.length < this.maxMacroCount) {
      const remaining = this.maxMacroCount - macros.length;
      for (let i = 0; i < remaining; i++) {
        macros.push(
          new Macro(this, index++, new Uint8Array([END_OF_MACRO_BYTES]))
        );
      }
    }
    return macros;
  }

  updateMacro(macro: IMacro): void {
    const macros = this.generateMacros();
    macros[macro.index] = macro;
    const bytesArray: Uint8Array[] = macros.map((macro) => macro.getBytes());
    const resultLength = bytesArray.reduce((sum, array) => {
      sum = sum + array.length;
      return sum;
    }, 0);
    const result = new Uint8Array(resultLength);
    let offset = 0;
    for (let i = 0; i < bytesArray.length; i++) {
      result.set(bytesArray[i], offset);
      offset = offset + bytesArray[i].length;
    }
    this.bytes = result;
  }
}
