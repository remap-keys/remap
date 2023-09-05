import { ToComposition } from './ToComposition';

describe('ToComposition', () => {
  test('getCode', () => {
    let subject = new ToComposition(0b0100);
    expect(subject.getCode()).toEqual(0b0101_0010_0000_0100);
    subject = new ToComposition(0b0000);
    expect(subject.getCode()).toEqual(0b0101_0010_0000_0000);
    subject = new ToComposition(0b1111);
    expect(subject.getCode()).toEqual(0b0101_0010_0000_1111);
    subject = new ToComposition(0b1_0000);
    expect(subject.getCode()).toEqual(0b0101_0010_0001_0000);
    subject = new ToComposition(0b1111_1111);
    expect(subject.getCode()).toEqual(0b0101_0010_0001_1111);
  });
});
