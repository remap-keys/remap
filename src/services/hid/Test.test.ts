import { KeycodeCompositionFactory } from './Composition';

describe('createUnicodeComposition', () => {
  test('valid', () => {
    const subject = new KeycodeCompositionFactory(0b1011_0000_0100_0010);
    expect(subject.isUnicode()).toBeTruthy();
    const actual = subject.createUnicodeComposition();
    expect(actual.getCharCode()).toEqual(0b0011_0000_0100_0010);
  });

  test('not function', () => {
    const subject = new KeycodeCompositionFactory(0b0000_0001_0000_0000);
    expect(subject.isUnicode()).toBeFalsy();

    expect(() => {
      subject.createUnicodeComposition();
    }).toThrowError();
  });
});
