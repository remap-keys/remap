import { OneShotLayerComposition } from './OneShotLayerComposition';

describe('OneShotLayerComposition', () => {
  test('getCode', () => {
    let subject = new OneShotLayerComposition(0b0100);
    expect(subject.getCode()).toEqual(0b0101_0010_1000_0100);
    subject = new OneShotLayerComposition(0b0000);
    expect(subject.getCode()).toEqual(0b0101_0010_1000_0000);
    subject = new OneShotLayerComposition(0b1111);
    expect(subject.getCode()).toEqual(0b0101_0010_1000_1111);
    subject = new OneShotLayerComposition(0b1_0000_0000);
    expect(subject.getCode()).toEqual(0b0101_0010_1000_0000);
  });
});
