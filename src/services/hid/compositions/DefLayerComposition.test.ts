import { describe, expect, test } from 'vitest';
import { DefLayerComposition } from './DefLayerComposition';

describe('DefLayerComposition', () => {
  test('getCode', () => {
    let subject = new DefLayerComposition(0b0100);
    expect(subject.getCode()).toEqual(0b0101_0010_0100_0100);
    subject = new DefLayerComposition(0b0000);
    expect(subject.getCode()).toEqual(0b0101_0010_0100_0000);
    subject = new DefLayerComposition(0b1111);
    expect(subject.getCode()).toEqual(0b0101_0010_0100_1111);
    subject = new DefLayerComposition(0b1_0000_0000);
    expect(subject.getCode()).toEqual(0b0101_0010_0100_0000);
  });
});
