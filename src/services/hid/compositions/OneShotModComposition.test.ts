import { describe, test, expect } from 'vitest';
import {
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_SFT,
  ModDirection,
} from '../Composition';
import { OneShotModComposition } from './OneShotModComposition';

describe('OneShotModComposition', () => {
  test('getCode', () => {
    let subject = new OneShotModComposition(ModDirection.right, [
      MOD_CTL,
      MOD_SFT,
      MOD_ALT,
      MOD_GUI,
    ]);
    expect(subject.getCode()).toEqual(0b0101_0010_1011_1111);
    subject = new OneShotModComposition(ModDirection.left, [
      MOD_CTL,
      MOD_SFT,
      MOD_ALT,
      MOD_GUI,
    ]);
    expect(subject.getCode()).toEqual(0b0101_0010_1010_1111);
    subject = new OneShotModComposition(ModDirection.right, []);
    expect(subject.getCode()).toEqual(0b0101_0010_1011_0000);
    subject = new OneShotModComposition(ModDirection.left, []);
    expect(subject.getCode()).toEqual(0b0101_0010_1010_0000);
  });
});
