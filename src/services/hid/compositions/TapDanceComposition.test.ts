import { TapDanceComposition } from './TapDanceComposition';

describe('TapDanceComposition', () => {
  test('getCode', () => {
    let subject = new TapDanceComposition(2);
    expect(subject.getCode()).toEqual(0b0101_0111_0000_0010);
    subject = new TapDanceComposition(0b0000_0000);
    expect(subject.getCode()).toEqual(0b0101_0111_0000_0000);
    subject = new TapDanceComposition(0b1111_1111);
    expect(subject.getCode()).toEqual(0b0101_0111_1111_1111);
    subject = new TapDanceComposition(0b1_0000_0000);
    expect(subject.getCode()).toEqual(0b0101_0111_0000_0000);
  });
});
