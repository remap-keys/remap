export function percent(value: number, maxValue: number) {
  return Math.round(100 * (value / maxValue));
}

export function maxValueByBitLength(length: number) {
  let binary = '';
  for (let i = 0; i < length; i++) {
    binary += '1';
  }
  return Number.parseInt(binary, 2);
}
