import { MomentaryComposition } from './MomentaryComposition';

describe('MomentaryComposition', () => {
  test('getCode', () => {
    let subject = new MomentaryComposition(0b0100);
    expect(subject.getCode()).toEqual(0b0101_0010_0010_0100);
    subject = new MomentaryComposition(0b0000);
    expect(subject.getCode()).toEqual(0b0101_0010_0010_0000);
    subject = new MomentaryComposition(0b1111);
    expect(subject.getCode()).toEqual(0b0101_0010_0010_1111);
    subject = new MomentaryComposition(0b1_0000_0000);
    expect(subject.getCode()).toEqual(0b0101_0010_0010_0000);
  });
});
