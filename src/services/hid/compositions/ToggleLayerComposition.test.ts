import { ToggleLayerComposition } from './ToggleLayerComposition';

describe('ToggleLayerComposition', () => {
  test('getCode', () => {
    let subject = new ToggleLayerComposition(0b0100);
    expect(subject.getCode()).toEqual(0b0101_0010_0110_0100);
    subject = new ToggleLayerComposition(0b0000);
    expect(subject.getCode()).toEqual(0b0101_0010_0110_0000);
    subject = new ToggleLayerComposition(0b1111);
    expect(subject.getCode()).toEqual(0b0101_0010_0110_1111);
    subject = new ToggleLayerComposition(0b1_0000_0000);
    expect(subject.getCode()).toEqual(0b0101_0010_0110_0000);
  });
});
