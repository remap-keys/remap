export function hasProperty(obj: Object, name: string | number): boolean {
  return Object.prototype.hasOwnProperty.call(obj, name);
}

export type ObjectValueListType<T extends Record<any, any>> = T[keyof T];
