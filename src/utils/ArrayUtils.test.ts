import { range } from './ArrayUtils';

describe('ArrayUtils', () => {
  test('range', () => {
    const actual = range(3, 6);
    expect(actual).toEqual([3, 4, 5, 6]);
  });
});

export {};
