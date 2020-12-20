import keycodes from './keycodes.json';

const codeToNameMap: { [p: number]: { long: string, short: string } } = keycodes.reduce((map, keycode) => {
  map[keycode.code] = keycode.name;
  return map;
}, {} as { [p: number]: { long: string, short: string } });

const codeToLabelMap: { [p: number]: string } = keycodes.reduce((map, keycode) => {
  map[keycode.code] = keycode.label;
  return map;
}, {} as { [p: number]: string });

const longNameToCodeMap: { [p: string]: number } = keycodes.reduce((map, keycode) => {
  map[keycode.name.long] = keycode.code;
  return map;
}, {} as { [p: string]: number });

export type KeycodeInfo = {
  code: number;
  name: { long: string, short: string };
  label: string;
};

export const keycodeArray: KeycodeInfo[] = keycodes;

export class Keycode {

  private constructor() {
  }

  static codeArray: KeycodeInfo[] = keycodes;
  static codeToNameMap: { [p: number]: { long: string, short: string } } = codeToNameMap;
  static codeToLabelMap: { [p: number]: string } = codeToLabelMap;

  static isError(code: number): boolean {
    return longNameToCodeMap.KC_TRANSPARENT <= (code) && (code) <= longNameToCodeMap.KC_UNDEFINED;
  }

  static isAny(code: number): boolean {
    return longNameToCodeMap.KC_A <= (code) && (code) <= 0xFF;
  }

  static isKey(code: number): boolean {
    return longNameToCodeMap.KC_A <= (code) && (code) <= longNameToCodeMap.KC_EXSEL;
  }

  static isMod(code: number): boolean {
    return longNameToCodeMap.KC_LCTRL <= (code) && (code) <= longNameToCodeMap.KC_RGUI;
  }

  static isSpecial(code: number): boolean {
    return (0xA5 <= (code) && (code) <= 0xDF) || (0xE8 <= (code) && (code) <= 0xFF);
  }

  static isSystem(code: number): boolean {
    return longNameToCodeMap.KC_PWR <= (code) && (code) <= longNameToCodeMap.KC_WAKE;
  }

  static isConsumer(code: number): boolean {
    return longNameToCodeMap.KC_MUTE <= (code) && (code) <= longNameToCodeMap.KC_BRID;
  }

  static isFn(code: number): boolean {
    return longNameToCodeMap.KC_FN0 <= (code) && (code) <= longNameToCodeMap.KC_FN31;
  }

  static isMouseKey(code: number): boolean {
    return longNameToCodeMap.KC_MS_UP <= (code) && (code) <= longNameToCodeMap.KC_MS_ACCEL2;
  }

  static isMouseKeyMove(code: number): boolean {
    return longNameToCodeMap.KC_MS_UP <= (code) && (code) <= longNameToCodeMap.KC_MS_RIGHT;
  }

  static isMouseKeyButton(code: number): boolean {
    return longNameToCodeMap.KC_MS_BTN1 <= (code) && (code) <= longNameToCodeMap.KC_MS_BTN5;
  }

  static isMouseKeyWheel(code: number): boolean {
    return longNameToCodeMap.KC_MS_WH_UP <= (code) && (code) <= longNameToCodeMap.KC_MS_WH_RIGHT;
  }

  static isMouseKeyAccel(code: number): boolean {
    return longNameToCodeMap.KC_MS_ACCEL0 <= (code) && (code) <= longNameToCodeMap.KC_MS_ACCEL2;
  }

}
