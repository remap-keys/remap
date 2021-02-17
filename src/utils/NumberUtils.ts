export function percent(value: number, maxValue: number) {
  return Math.round(100 * (value / maxValue) * 10) / 10;
}
