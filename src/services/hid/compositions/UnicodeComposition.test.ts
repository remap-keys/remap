import { UnicodeComposition } from './UnicodeComposition';

describe('UnicodeComposition', () => {
  test('getCode', () => {
    let subject = new UnicodeComposition(0b000_0000_0000);
    expect(subject.getCode()).toEqual(0b1000_0000_0000_0000);
    subject = new UnicodeComposition(0b111_1111_1111_1111);
    expect(subject.getCode()).toEqual(0b1111_1111_1111_1111);
    subject = new UnicodeComposition(0b1000_0000_0000_0000);
    expect(subject.getCode()).toEqual(0b1000_0000_0000_0000);
    subject = new UnicodeComposition(0b1111_1111_1111_1111);
    expect(subject.getCode()).toEqual(0b1111_1111_1111_1111);
  });
});
