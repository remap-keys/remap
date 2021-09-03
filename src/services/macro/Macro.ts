import { Key } from '../../components/configure/keycodekey/KeyGen';

export type TapHold = 'tap' | 'hold';

export type IMacroKey = {
  key: Key;
  type: TapHold;
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
  getMacroKeys(): IMacroKey[];
  updateMacroKeys(macroKeys: IMacroKey[]): void;
}

export class Macro implements IMacro {
  readonly index: number;
  private bytes: Uint8Array;

  constructor(macroBuffer: IMacroBuffer, index: number, bytes: Uint8Array) {
    this.index = index;
    this.bytes = bytes;
  }

  getBytes(): Uint8Array {
    return this.bytes;
  }

  getMacroKeys(): IMacroKey[] {
    // TODO Implement!
    return [];
  }

  updateMacroKeys(macroKeys: IMacroKey[]) {
    // TODO Implement!
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

  updateMacro(macro: IMacro): void {}
}
