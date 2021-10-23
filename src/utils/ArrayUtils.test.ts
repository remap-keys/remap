import { concatUint8Array, range } from './ArrayUtils';

describe('ArrayUtils', () => {
  test('range', () => {
    const actual = range(3, 6);
    expect(actual).toEqual([3, 4, 5, 6]);
  });

  test('concatUint8Array', () => {
    const first = Uint8Array.from([1, 2, 3]);
    const second = Uint8Array.from([4, 5]);
    const actual = concatUint8Array(first, second);
    expect(actual).toEqual(Uint8Array.from([1, 2, 3, 4, 5]));
  });
});

export {};
