export function hexadecimal(num: number, digit = 0): string {
  const hex = Array(digit).fill('0').join('') + new Number(num).toString(16);
  return `0x${hex.slice(-digit)}`;
}
