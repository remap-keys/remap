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
});
