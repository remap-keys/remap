import { genKey, Key } from '../../components/configure/keycodekey/KeyGen';
import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';
import { KeycodeCompositionFactory } from '../hid/Composition';
import { cloneUint8Array } from '../../utils/ArrayUtils';
import { IKeymap } from '../hid/Hid';

export const MacroTap = 'tap';
export const MacroHold = 'hold';
export type TapHoldType = typeof MacroTap | typeof MacroHold;
export type KeyDelayPair = {
  key: Key;
  delay: number;
};
export type Tap = {
  keyDelayPair: KeyDelayPair;
  type: typeof MacroTap;
};

export type Hold = {
  keyDelayPairs: KeyDelayPair[];
  type: typeof MacroHold;
};

export type MacroKey = Tap | Hold;

export const isTap = (item: Tap | Hold): item is Tap => {
  return item.type === MacroTap;
};

export const isHold = (item: Tap | Hold): item is Hold => {
  return item.type === MacroHold;
};

export function encodeMacroText(macroKeys: MacroKey[]): string {
  function escape(char: string): string {
    if (char === ',') {
      return '\\,';
    }
    return char;
  }
  const textList: string[] = [];
  macroKeys.forEach((macro) => {
    if (isTap(macro)) {
      textList.push(escape(macro.keyDelayPair.key.label));
    } else if (isHold(macro)) {
      const holdLabel = `{${macro.keyDelayPairs
        .map((keyDelayPair) => escape(keyDelayPair.key.label))
        .join(',')}}`;
      textList.push(holdLabel);
    }
  });
  return textList.join(',');
}

export type IGetMacroKeysResult = {
  success: boolean;
  error?: string;
  macroKeys: MacroKey[];
};

export const SS_QMK_PREFIX = 1;
export const END_OF_MACRO_BYTES = 0;
export const SS_TAP_CODE = 1;
export const SS_DOWN_CODE = 2;
export const SS_UP_CODE = 3;
export const SS_DELAY_CODE = 4;

export interface IMacro {
  /**
   * The index number of the macro.
   * The first index number is 0.
   * This number never be over the (max macro count - 1).
   */
  readonly index: number;
  getBytes(): Uint8Array;
  // eslint-disable-next-line no-unused-vars
  generateMacroKeys(labelLang: KeyboardLabelLang): IGetMacroKeysResult;
  generateMacroText(): string;
  // eslint-disable-next-line no-unused-vars
  updateMacroKeys(macroKeys: MacroKey[]): void;
}

export function convertQmkLabel(key: Key): Key {
  const codeA = 4; // KC_A
  const codeZ = 29; // KC_Z
  const code = key.keymap.code;
  if (codeA <= code && code <= codeZ) {
    key.label = key.label.toLowerCase();
  }
  return key;
}

function genKeyWithQmkLabel(
  keymap: IKeymap,
  langLabel: KeyboardLabelLang
): Key {
  const key = genKey(keymap, langLabel);
  return convertQmkLabel(key);
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

  private getDelay(
    bytes: Uint8Array,
    pos: number
  ): { delay: number; nextPos: number } | undefined {
    if (bytes[pos] !== SS_QMK_PREFIX || bytes[++pos] !== SS_DELAY_CODE) {
      return undefined;
    }
    pos++;
    let delayString = '';
    while (pos < bytes.length) {
      const code = bytes[pos];
      if (code === '|'.charCodeAt(0)) {
        break;
      }
      delayString += String.fromCharCode(code);
      pos++;
    }
    return { delay: Number(delayString), nextPos: pos };
  }

  generateMacroKeys(labelLang: KeyboardLabelLang): IGetMacroKeysResult {
    if (this.bytes.length === 0) {
      return {
        success: false,
        error: 'The bytes length is 0.',
        macroKeys: [],
      };
    }
    const macroKeys: MacroKey[] = [];
    const byteLength = this.bytes.length;
    let pos = 0;
    let existsNullAtEnd = false;
    let holdKeys: KeyDelayPair[] = [];
    const holdStack: KeyDelayPair[] = [];
    while (pos < byteLength) {
      const data0 = this.bytes[pos];
      if (data0 === SS_QMK_PREFIX) {
        pos++;
        const data1 = this.bytes[pos];
        switch (data1) {
          case SS_TAP_CODE: {
            pos++;
            const data2 = this.bytes[pos];
            const keycodeCompositionFactory = new KeycodeCompositionFactory(
              data2,
              labelLang
            );
            const basicComposition =
              keycodeCompositionFactory.createBasicComposition();
            const keymap = basicComposition.genKeymap()!;
            const key = genKeyWithQmkLabel(keymap, labelLang);
            const keyDelayPair: KeyDelayPair = {
              key,
              delay: 0,
            };
            macroKeys.push({ keyDelayPair, type: 'tap' });
            const delayResult = this.getDelay(this.bytes, pos + 1);
            if (delayResult) {
              keyDelayPair.delay = delayResult.delay;
              pos = delayResult.nextPos;
            }
            break;
          }
          case SS_DOWN_CODE: {
            pos++;
            const data2 = this.bytes[pos];
            const keycodeCompositionFactory = new KeycodeCompositionFactory(
              data2,
              labelLang
            );
            const basicComposition =
              keycodeCompositionFactory.createBasicComposition();
            const keymap = basicComposition.genKeymap()!;
            const key = genKeyWithQmkLabel(keymap, labelLang);
            const keyDelayPair: KeyDelayPair = { key, delay: 0 };
            holdKeys.push(keyDelayPair);
            holdStack.push(keyDelayPair);
            const delayResult = this.getDelay(this.bytes, pos + 1);
            if (delayResult) {
              keyDelayPair.delay = delayResult.delay;
              pos = delayResult.nextPos;
            }
            break;
          }
          case SS_UP_CODE: {
            const lastHoldKey = holdStack.pop();
            if (!lastHoldKey) {
              return {
                success: false,
                error:
                  'Invalid a special code for hold key (down key not exists).',
                macroKeys: [],
              };
            } else {
              pos++;
              const data2 = this.bytes[pos];
              if (lastHoldKey.key.keymap.code !== data2) {
                return {
                  success: false,
                  error: 'Invalid a byte combination for hold key.',
                  macroKeys: [],
                };
              }
            }
            if (holdStack.length === 0) {
              macroKeys.push({ keyDelayPairs: holdKeys, type: 'hold' });
              const delayResult = this.getDelay(this.bytes, pos + 1);
              if (delayResult) {
                holdKeys[holdKeys.length - 1].delay = delayResult.delay;
                pos = delayResult.nextPos;
              }
              holdKeys = [];
            }
            break;
          }
          default: {
            return {
              success: false,
              error: `Invalid a macro command (${data1}).`,
              macroKeys: [],
            };
          }
        }
      } else if (data0 === END_OF_MACRO_BYTES) {
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
          data0,
          labelLang
        );
        if (keycodeCompositionFactory.isAscii()) {
          const asciiComposition =
            keycodeCompositionFactory.createAsciiKeycodeComposition();
          const keymap = asciiComposition.genKeymap()!;
          const key = genKey(keymap, labelLang);
          const keyDelayPair: KeyDelayPair = { key, delay: 0 };
          macroKeys.push({ keyDelayPair, type: 'tap' });
          const delayResult = this.getDelay(this.bytes, pos + 1);
          if (delayResult) {
            keyDelayPair.delay = delayResult.delay;
            pos = delayResult.nextPos;
          }
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

  generateMacroText(): string {
    return '';
  }

  private createDelayBytes(delay: number): number[] {
    if (delay <= 0 || 9999 < delay) {
      return [];
    }
    const delayString = delay.toString();
    const delayBytes = delayString.split('').map((char) => char.charCodeAt(0));
    delayBytes.push('|'.charCodeAt(0));
    return [SS_QMK_PREFIX, SS_DELAY_CODE, ...delayBytes];
  }

  updateMacroKeys(macroKeys: MacroKey[]) {
    let bytes: number[] = [];
    for (const macroKey of macroKeys) {
      switch (macroKey.type) {
        case 'tap': {
          if (!macroKey.keyDelayPair.key.keymap.isAscii) {
            bytes.push(SS_QMK_PREFIX);
            bytes.push(SS_TAP_CODE);
          }
          bytes.push(macroKey.keyDelayPair.key.keymap.code);
          bytes = [
            ...bytes,
            ...this.createDelayBytes(macroKey.keyDelayPair.delay),
          ];
          break;
        }
        case 'hold': {
          let downBytes: number[] = [];
          let upBytes: number[] = [];
          for (let i = 0; i < macroKey.keyDelayPairs.length; i++) {
            const keyDelayPair = macroKey.keyDelayPairs[i];
            downBytes = [
              ...downBytes,
              SS_QMK_PREFIX,
              SS_DOWN_CODE,
              keyDelayPair.key.keymap.code,
            ];
            if (i < macroKey.keyDelayPairs.length - 1) {
              downBytes = [
                ...downBytes,
                ...this.createDelayBytes(keyDelayPair.delay),
              ];
            }
            upBytes = [
              SS_QMK_PREFIX,
              SS_UP_CODE,
              keyDelayPair.key.keymap.code,
              ...upBytes,
            ];
            if (i === macroKey.keyDelayPairs.length - 1) {
              upBytes = [
                ...upBytes,
                ...this.createDelayBytes(keyDelayPair.delay),
              ];
            }
          }
          bytes = [...bytes, ...downBytes, ...upBytes];
          break;
        }
      }
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
  // eslint-disable-next-line no-unused-vars
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

  /**
   * The specified bytes is cloned and is kept it in this instance.
   */
  constructor(
    bytes: Uint8Array,
    maxMacroCount: number,
    maxMacroBufferSize: number
  ) {
    this.bytes = cloneUint8Array(bytes);
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
        macros.push(new Macro(this, index, this.bytes.slice(start, i + 1)));
        start = i + 1;
        index += 1;
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
