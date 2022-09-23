import KeyModel from './KeyModel';

describe('KeyModel', () => {
  test('isEncoder', () => {
    let subject = new KeyModel(null, '0,1', 0, 0, '', 0, 0, 0, 0);
    expect(subject.isEncoder).toBeTruthy();
    subject = new KeyModel(null, '0,1', 0, 0, '', 0, 0, 0, null);
    expect(subject.isEncoder).toBeFalsy();
  });

  test('encoderId', () => {
    let subject = new KeyModel(null, '0,1', 0, 0, '', 0, 0, 0, 2);
    expect(subject.encoderId).toEqual(2);
    subject = new KeyModel(null, '0,1', 0, 0, '', 0, 0, 0, null);
    expect(subject.encoderId).toBeNull();
  });

  test('isDecal', () => {
    let subject = new KeyModel(null, '', 0, 0, '', 0, 0, 0, null);
    expect(subject.isDecal).toBeTruthy();
    subject = new KeyModel(null, '0,1', 0, 0, '', 0, 0, 0, null);
    expect(subject.isDecal).toBeFalsy();
    subject = new KeyModel(null, '0,1', 0, 0, '', 0, 0, 0, 1);
    expect(subject.isDecal).toBeFalsy();
    // This key model is not decal, because this has an encoder ID.
    subject = new KeyModel(null, '', 0, 0, '', 0, 0, 0, 1);
    expect(subject.isDecal).toBeFalsy();
    expect(subject.isEncoder).toBeTruthy();
  });
});
