export function hasProperty(obj: Object, name: string | number): boolean {
  return Object.prototype.hasOwnProperty.call(obj, name);
}
