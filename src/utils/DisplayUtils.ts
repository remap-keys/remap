// If true, for smartphone UI
export function isSmallDisplay(): boolean {
  // eslint-disable-next-line no-undef
  const width = window.innerWidth;
  return width < 600;
}
