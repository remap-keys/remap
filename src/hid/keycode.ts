import keycodes from './keycodes.json';

export const keycodeToNameMap: { [p: number]: string } = keycodes.reduce(
  (map, keycode) => {
    map[keycode.code] = keycode.name;
    return map;
  },
  {} as { [p: number]: string }
);

export const keycodeToLabelMap: { [p: number]: string } = keycodes.reduce(
  (map, keycode) => {
    map[keycode.code] = keycode.label;
    return map;
  },
  {} as { [p: number]: string }
);

export type KeycodeInfo = {
  code: number;
  name: string;
  label: string;
};

export const keycodeArray: KeycodeInfo[] = keycodes;
