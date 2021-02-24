export function hexadecimal(num: number, digit = 0): string {
  const hex = Array(digit).fill('0').join('') + new Number(num).toString(16);
  return `0x${hex.slice(-digit).toUpperCase()}`;
}

export function isDoubleWidthString(str: string): boolean {
  // eslint-disable-next-line no-control-regex
  return Boolean(str.match(/^[^\x01-\x7E\xA1-\xDF]+$/));
}
