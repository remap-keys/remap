import { maxValueByBitLength } from './NumberUtils';

describe('NumberUtils', () => {
  test('maxValueByBitLength', () => {
    expect(maxValueByBitLength(2)).toEqual(0b11);
    expect(maxValueByBitLength(3)).toEqual(0b111);
    expect(maxValueByBitLength(4)).toEqual(0b1111);
  });
});

export {};
