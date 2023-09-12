import { LayerTapToggleComposition } from './LayerTapToggleComposition';

describe('LayerTapToggleComposition', () => {
  test('getCode', () => {
    let subject = new LayerTapToggleComposition(0b0100);
    expect(subject.getCode()).toEqual(0b0101_0010_1100_0100);
    subject = new LayerTapToggleComposition(0b0000);
    expect(subject.getCode()).toEqual(0b0101_0010_1100_0000);
    subject = new LayerTapToggleComposition(0b1111);
    expect(subject.getCode()).toEqual(0b0101_0010_1100_1111);
    subject = new LayerTapToggleComposition(0b1_0000_0000);
    expect(subject.getCode()).toEqual(0b0101_0010_1100_0000);
  });
});
