import { describe, expect, test } from 'vitest';
import { MacroComposition } from './MacroComposition';

describe('MacroComposition', () => {
  test('getCode', () => {
    let subject = new MacroComposition(0b0000_0000);
    expect(subject.getCode()).toEqual(0b0111_0111_0000_0000);
    subject = new MacroComposition(0b0111_1111);
    expect(subject.getCode()).toEqual(0b0111_0111_0111_1111);
    subject = new MacroComposition(0b1111_1111);
    expect(subject.getCode()).toEqual(0b0111_0111_0111_1111);
  });
});
