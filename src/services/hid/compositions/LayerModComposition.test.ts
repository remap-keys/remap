import { describe, expect, test } from 'vitest';
import { LayerModComposition } from './LayerModComposition';
import { MOD_ALT, MOD_CTL, MOD_GUI, MOD_SFT } from '../Composition';

describe('LayerModComposition', () => {
  test('getCode', () => {
    let subject = new LayerModComposition(0b0100, [MOD_CTL, MOD_ALT]);
    expect(subject.getCode()).toEqual(0b0101_0000_1000_0101);
    subject = new LayerModComposition(0b0000, []);
    expect(subject.getCode()).toEqual(0b0101_0000_0000_0000);
    subject = new LayerModComposition(0b1111, [
      MOD_CTL,
      MOD_ALT,
      MOD_GUI,
      MOD_SFT,
    ]);
    expect(subject.getCode()).toEqual(0b0101_0001_1110_1111);
    subject = new LayerModComposition(0b1_0000_0000, []);
    expect(subject.getCode()).toEqual(0b0101_0000_0000_0000);
  });
});
