import { IKeycodeCategoryInfo, IKeycodeInfo, IKeymap } from './Hid';
import {
  keycodesBasic,
  keycodesBasicF,
  keycodesBasicLetter,
  keycodesBasicLock,
  keycodesBasicModifier,
  keycodesBasicNumber,
  keycodesBasicPunctuation,
  keycodesBasicSpacing,
  keycodesBasicAll,
} from './assets/KeycodesBasic';
import { keycodesLayers } from './assets/KeycodesLayers';
import { keycodesLighing } from './assets/KeycodesLighting';
import { keycodesMacro } from './assets/KeycodesMacro';
import { keycodesMedia } from './assets/KeycodesMedia';
import { keycodesNumber } from './assets/KeycodesNumber';
import { keycodesSpecial } from './assets/KeycodesSpecial';
export type KeymapCategory =
  | 'Basic'
  | 'Fn'
  | 'Letter'
  | 'Lock'
  | 'Modifier'
  | 'Number'
  | 'Punctuation'
  | 'Spacing'
  | 'Layers'
  | 'Lighting'
  | 'Macro'
  | 'Media'
  | 'Special'
  | 'Mod-Tap'
  | 'Layer-Tap';

export class KeycodeList {
  private static _basicKeymaps: IKeymap[];
  private static _keycodesLayers: IKeymap[];
  private static _keycodesLighting: IKeymap[];
  private static _keycodesMacro: IKeymap[];
  private static _keycodesMedia: IKeymap[];
  private static _keycodesNumber: IKeymap[];
  private static _keycodesSpecial: IKeymap[];

  private static createKeymap(
    code: number,
    categories: KeymapCategory[]
  ): IKeymap {
    return {
      code,
      isAny: false,
      categories: categories,
      keycodeInfo: KeycodeList.keycodeArray.find(
        (keycode) => keycode.code === code
      )!,
    };
  }

  // DEPRECATED
  static get basicAllKeymaps(): IKeymap[] {
    return keycodesBasicAll.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesBasicAll.categories)
    );
  }

  static get basicKeymaps(): IKeymap[] {
    if (this._basicKeymaps) return this._basicKeymaps;

    const list: IKeycodeCategoryInfo[] = [
      keycodesBasic,
      keycodesBasicLetter,
      keycodesBasicNumber,
      keycodesBasicPunctuation,
      keycodesBasicModifier,
      keycodesBasicSpacing,
      keycodesBasicLock,
      keycodesBasicF,
    ];
    this._basicKeymaps = [];
    list.forEach((info) => {
      const categories = info.categories;
      info.codes.forEach((code) => {
        this._basicKeymaps.push(KeycodeList.createKeymap(code, categories));
      });
    });

    return this._basicKeymaps;
  }

  static get layersKeymaps(): IKeymap[] {
    if (this._keycodesLayers) return this._keycodesLayers;

    this._keycodesLayers = keycodesLayers.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesLayers.categories)
    );
    return this._keycodesLayers;
  }

  static get lightingKeymaps(): IKeymap[] {
    if (this._keycodesLighting) return this._keycodesLighting;

    this._keycodesLighting = keycodesLighing.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesLighing.categories)
    );
    return this._keycodesLighting;
  }

  static get macroKeymaps(): IKeymap[] {
    if (this._keycodesMacro) return this._keycodesMacro;

    this._keycodesMacro = keycodesMacro.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesMacro.categories)
    );

    return this._keycodesMacro;
  }

  static get mediaKeymaps(): IKeymap[] {
    if (this._keycodesMedia) return this._keycodesMedia;

    this._keycodesMedia = keycodesMedia.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesMedia.categories)
    );
    return this._keycodesMedia;
  }

  static get numberKeymaps(): IKeymap[] {
    if (this._keycodesNumber) return this._keycodesNumber;

    this._keycodesNumber = keycodesNumber.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesNumber.categories)
    );
    return this._keycodesNumber;
  }

  static get specialKeymaps(): IKeymap[] {
    if (this._keycodesSpecial) return this._keycodesSpecial;

    this._keycodesSpecial = keycodesSpecial.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesSpecial.categories)
    );
    return this._keycodesSpecial;
  }

  static getKeymap(code: number): IKeymap {
    const keycodeInfo = KeycodeList.keycodeArray.find(
      (keycodeInfo) => keycodeInfo.code === code
    );

    const findCategories = (code: number) => {
      const list: IKeycodeCategoryInfo[] = [
        keycodesBasicF,
        keycodesBasicLetter,
        keycodesBasicLock,
        keycodesBasicModifier,
        keycodesBasicNumber,
        keycodesBasicPunctuation,
        keycodesBasicSpacing,
        keycodesLayers,
        keycodesLighing,
        keycodesMacro,
        keycodesMedia,
        keycodesNumber,
        keycodesSpecial,
      ];
      return list.find((kci) => {
        return kci.codes.includes(code);
      });
    };

    if (keycodeInfo) {
      const category: IKeycodeCategoryInfo | undefined = findCategories(
        keycodeInfo?.code
      );
      const categories: KeymapCategory[] = category ? category.categories : [];

      return {
        code,
        isAny: false,
        categories,
        keycodeInfo,
      };
    } else {
      return {
        code,
        isAny: true,
        categories: [],
      };
    }
  }

  static genBasicKeycodes() {}

  private static keycodeArray: IKeycodeInfo[] = [
    {
      code: 0,
      name: {
        long: 'KC_NO',
        short: 'KC_NO',
      },
      label: '',
    },
    {
      code: 1,
      name: {
        long: 'KC_TRANSPARENT',
        short: 'KC_TRNS',
      },
      label: '▽',
    },
    {
      code: 2,
      name: {
        long: 'KC_POST_FAIL',
        short: 'KC_POST_FAIL',
      },
      label: 'PFAIL',
    },
    {
      code: 3,
      name: {
        long: 'KC_UNDEFINED',
        short: 'KC_UNDEFINED',
      },
      label: 'UNDEF',
    },
    {
      code: 4,
      name: {
        long: 'KC_A',
        short: 'KC_A',
      },
      label: 'A',
    },
    {
      code: 5,
      name: {
        long: 'KC_B',
        short: 'KC_B',
      },
      label: 'B',
    },
    {
      code: 6,
      name: {
        long: 'KC_C',
        short: 'KC_C',
      },
      label: 'C',
    },
    {
      code: 7,
      name: {
        long: 'KC_D',
        short: 'KC_D',
      },
      label: 'D',
    },
    {
      code: 8,
      name: {
        long: 'KC_E',
        short: 'KC_E',
      },
      label: 'E',
    },
    {
      code: 9,
      name: {
        long: 'KC_F',
        short: 'KC_F',
      },
      label: 'F',
    },
    {
      code: 10,
      name: {
        long: 'KC_G',
        short: 'KC_G',
      },
      label: 'G',
    },
    {
      code: 11,
      name: {
        long: 'KC_H',
        short: 'KC_H',
      },
      label: 'H',
    },
    {
      code: 12,
      name: {
        long: 'KC_I',
        short: 'KC_I',
      },
      label: 'I',
    },
    {
      code: 13,
      name: {
        long: 'KC_J',
        short: 'KC_J',
      },
      label: 'J',
    },
    {
      code: 14,
      name: {
        long: 'KC_K',
        short: 'KC_K',
      },
      label: 'K',
    },
    {
      code: 15,
      name: {
        long: 'KC_L',
        short: 'KC_L',
      },
      label: 'L',
    },
    {
      code: 16,
      name: {
        long: 'KC_M',
        short: 'KC_M',
      },
      label: 'M',
    },
    {
      code: 17,
      name: {
        long: 'KC_N',
        short: 'KC_N',
      },
      label: 'N',
    },
    {
      code: 18,
      name: {
        long: 'KC_O',
        short: 'KC_O',
      },
      label: 'O',
    },
    {
      code: 19,
      name: {
        long: 'KC_P',
        short: 'KC_P',
      },
      label: 'P',
    },
    {
      code: 20,
      name: {
        long: 'KC_Q',
        short: 'KC_Q',
      },
      label: 'Q',
    },
    {
      code: 21,
      name: {
        long: 'KC_R',
        short: 'KC_R',
      },
      label: 'R',
    },
    {
      code: 22,
      name: {
        long: 'KC_S',
        short: 'KC_S',
      },
      label: 'S',
    },
    {
      code: 23,
      name: {
        long: 'KC_T',
        short: 'KC_T',
      },
      label: 'T',
    },
    {
      code: 24,
      name: {
        long: 'KC_U',
        short: 'KC_U',
      },
      label: 'U',
    },
    {
      code: 25,
      name: {
        long: 'KC_V',
        short: 'KC_V',
      },
      label: 'V',
    },
    {
      code: 26,
      name: {
        long: 'KC_W',
        short: 'KC_W',
      },
      label: 'W',
    },
    {
      code: 27,
      name: {
        long: 'KC_X',
        short: 'KC_X',
      },
      label: 'X',
    },
    {
      code: 28,
      name: {
        long: 'KC_Y',
        short: 'KC_Y',
      },
      label: 'Y',
    },
    {
      code: 29,
      name: {
        long: 'KC_Z',
        short: 'KC_Z',
      },
      label: 'Z',
    },
    {
      code: 30,
      name: {
        long: 'KC_1',
        short: 'KC_1',
      },
      label: '1',
    },
    {
      code: 31,
      name: {
        long: 'KC_2',
        short: 'KC_2',
      },
      label: '2',
    },
    {
      code: 32,
      name: {
        long: 'KC_3',
        short: 'KC_3',
      },
      label: '3',
    },
    {
      code: 33,
      name: {
        long: 'KC_4',
        short: 'KC_4',
      },
      label: '4',
    },
    {
      code: 34,
      name: {
        long: 'KC_5',
        short: 'KC_5',
      },
      label: '5',
    },
    {
      code: 35,
      name: {
        long: 'KC_6',
        short: 'KC_6',
      },
      label: '6',
    },
    {
      code: 36,
      name: {
        long: 'KC_7',
        short: 'KC_7',
      },
      label: '7',
    },
    {
      code: 37,
      name: {
        long: 'KC_8',
        short: 'KC_8',
      },
      label: '8',
    },
    {
      code: 38,
      name: {
        long: 'KC_9',
        short: 'KC_9',
      },
      label: '9',
    },
    {
      code: 39,
      name: {
        long: 'KC_0',
        short: 'KC_0',
      },
      label: '0',
    },
    {
      code: 40,
      name: {
        long: 'KC_ENTER',
        short: 'KC_ENT',
      },
      label: 'Enter',
    },
    {
      code: 41,
      name: {
        long: 'KC_ESCAPE',
        short: 'KC_ESC',
      },
      label: 'Esc',
    },
    {
      code: 42,
      name: {
        long: 'KC_BSPACE',
        short: 'KC_BSPC',
      },
      label: 'Back space',
    },
    {
      code: 43,
      name: {
        long: 'KC_TAB',
        short: 'KC_TAB',
      },
      label: 'Tab',
    },
    {
      code: 44,
      name: {
        long: 'KC_SPACE',
        short: 'KC_SPC',
      },
      label: 'Space',
    },
    {
      code: 45,
      name: {
        long: 'KC_MINUS',
        short: 'KC_MINS',
      },
      label: '-',
    },
    {
      code: 46,
      name: {
        long: 'KC_EQUAL',
        short: 'KC_EQL',
      },
      label: '=',
    },
    {
      code: 47,
      name: {
        long: 'KC_LBRACKET',
        short: 'KC_LBRC',
      },
      label: '[',
    },
    {
      code: 48,
      name: {
        long: 'KC_RBRACKET',
        short: 'KC_RBRC',
      },
      label: ']',
    },
    {
      code: 49,
      name: {
        long: 'KC_BSLASH',
        short: 'KC_BSLS',
      },
      label: '\\',
    },
    {
      code: 50,
      name: {
        long: 'KC_NONUS_HASH',
        short: 'KC_NUHS',
      },
      label: 'NUHS',
    },
    {
      code: 51,
      name: {
        long: 'KC_SCOLON',
        short: 'KC_SCLN',
      },
      label: ';',
    },
    {
      code: 52,
      name: {
        long: 'KC_QUOTE',
        short: 'KC_QUOT',
      },
      label: "'",
    },
    {
      code: 53,
      name: {
        long: 'KC_GRAVE',
        short: 'KC_ZKHK',
      },
      label: '`',
    },
    {
      code: 54,
      name: {
        long: 'KC_COMMA',
        short: 'KC_COMM',
      },
      label: ',',
    },
    {
      code: 55,
      name: {
        long: 'KC_DOT',
        short: 'KC_DOT',
      },
      label: '.',
    },
    {
      code: 56,
      name: {
        long: 'KC_SLASH',
        short: 'KC_SLSH',
      },
      label: '/',
    },
    {
      code: 57,
      name: {
        long: 'KC_CAPSLOCK',
        short: 'KC_CAPS',
      },
      label: 'Caps Lock',
    },
    {
      code: 58,
      name: {
        long: 'KC_F1',
        short: 'KC_F1',
      },
      label: 'F1',
    },
    {
      code: 59,
      name: {
        long: 'KC_F2',
        short: 'KC_F2',
      },
      label: 'F2',
    },
    {
      code: 60,
      name: {
        long: 'KC_F3',
        short: 'KC_F3',
      },
      label: 'F3',
    },
    {
      code: 61,
      name: {
        long: 'KC_F4',
        short: 'KC_F4',
      },
      label: 'F4',
    },
    {
      code: 62,
      name: {
        long: 'KC_F5',
        short: 'KC_F5',
      },
      label: 'F5',
    },
    {
      code: 63,
      name: {
        long: 'KC_F6',
        short: 'KC_F6',
      },
      label: 'F6',
    },
    {
      code: 64,
      name: {
        long: 'KC_F7',
        short: 'KC_F7',
      },
      label: 'F7',
    },
    {
      code: 65,
      name: {
        long: 'KC_F8',
        short: 'KC_F8',
      },
      label: 'F8',
    },
    {
      code: 66,
      name: {
        long: 'KC_F9',
        short: 'KC_F9',
      },
      label: 'F9',
    },
    {
      code: 67,
      name: {
        long: 'KC_F10',
        short: 'KC_F10',
      },
      label: 'F10',
    },
    {
      code: 68,
      name: {
        long: 'KC_F11',
        short: 'KC_F11',
      },
      label: 'F11',
    },
    {
      code: 69,
      name: {
        long: 'KC_F12',
        short: 'KC_F12',
      },
      label: 'F12',
    },
    {
      code: 70,
      name: {
        long: 'KC_PSCREEN',
        short: 'KC_PSCR',
      },
      label: 'Print Screen',
    },
    {
      code: 71,
      name: {
        long: 'KC_SCROLLLOCK',
        short: 'KC_BRMD',
      },
      label: 'Scroll Lock',
    },
    {
      code: 72,
      name: {
        long: 'KC_PAUSE',
        short: 'KC_BRMU',
      },
      label: 'Pause',
    },
    {
      code: 73,
      name: {
        long: 'KC_INSERT',
        short: 'KC_INS',
      },
      label: 'Insert',
    },
    {
      code: 74,
      name: {
        long: 'KC_HOME',
        short: 'KC_HOME',
      },
      label: 'Home',
    },
    {
      code: 75,
      name: {
        long: 'KC_PGUP',
        short: 'KC_PGUP',
      },
      label: 'Page Up',
    },
    {
      code: 76,
      name: {
        long: 'KC_DELETE',
        short: 'KC_DEL',
      },
      label: 'Del',
    },
    {
      code: 77,
      name: {
        long: 'KC_END',
        short: 'KC_END',
      },
      label: 'End',
    },
    {
      code: 78,
      name: {
        long: 'KC_PGDOWN',
        short: 'KC_PGDN',
      },
      label: 'Page Down',
    },
    {
      code: 79,
      name: {
        long: 'KC_RIGHT',
        short: 'KC_RGHT',
      },
      label: 'Right',
    },
    {
      code: 80,
      name: {
        long: 'KC_LEFT',
        short: 'KC_LEFT',
      },
      label: 'Left',
    },
    {
      code: 81,
      name: {
        long: 'KC_DOWN',
        short: 'KC_DOWN',
      },
      label: 'Down',
    },
    {
      code: 82,
      name: {
        long: 'KC_UP',
        short: 'KC_UP',
      },
      label: 'Up',
    },
    {
      code: 83,
      name: {
        long: 'KC_NUMLOCK',
        short: 'KC_NLCK',
      },
      label: 'Num Lock',
    },
    {
      code: 84,
      name: {
        long: 'KC_KP_SLASH',
        short: 'KC_PSLS',
      },
      label: 'Num /',
    },
    {
      code: 85,
      name: {
        long: 'KC_KP_ASTERISK',
        short: 'KC_PAST',
      },
      label: 'Num *',
    },
    {
      code: 86,
      name: {
        long: 'KC_KP_MINUS',
        short: 'KC_PMNS',
      },
      label: 'Num -',
    },
    {
      code: 87,
      name: {
        long: 'KC_KP_PLUS',
        short: 'KC_PPLS',
      },
      label: 'Num +',
    },
    {
      code: 88,
      name: {
        long: 'KC_KP_ENTER',
        short: 'KC_PENT',
      },
      label: 'Num Enter',
    },
    {
      code: 89,
      name: {
        long: 'KC_KP_1',
        short: 'KC_P1',
      },
      label: 'Num 1',
    },
    {
      code: 90,
      name: {
        long: 'KC_KP_2',
        short: 'KC_P2',
      },
      label: 'Num 2',
    },
    {
      code: 91,
      name: {
        long: 'KC_KP_3',
        short: 'KC_P3',
      },
      label: 'Num 3',
    },
    {
      code: 92,
      name: {
        long: 'KC_KP_4',
        short: 'KC_P4',
      },
      label: 'Num 4',
    },
    {
      code: 93,
      name: {
        long: 'KC_KP_5',
        short: 'KC_P5',
      },
      label: 'Num 5',
    },
    {
      code: 94,
      name: {
        long: 'KC_KP_6',
        short: 'KC_P6',
      },
      label: 'Num 6',
    },
    {
      code: 95,
      name: {
        long: 'KC_KP_7',
        short: 'KC_P7',
      },
      label: 'Num 7',
    },
    {
      code: 96,
      name: {
        long: 'KC_KP_8',
        short: 'KC_P8',
      },
      label: 'Num 8',
    },
    {
      code: 97,
      name: {
        long: 'KC_KP_9',
        short: 'KC_P9',
      },
      label: 'Num 9',
    },
    {
      code: 98,
      name: {
        long: 'KC_KP_0',
        short: 'KC_P0',
      },
      label: 'Num 0',
    },
    {
      code: 99,
      name: {
        long: 'KC_KP_DOT',
        short: 'KC_PDOT',
      },
      label: 'Num .',
    },
    {
      code: 100,
      name: {
        long: 'KC_NONUS_BSLASH',
        short: 'KC_NUBS',
      },
      label: 'NUBS',
    },
    {
      code: 101,
      name: {
        long: 'KC_APPLICATION',
        short: 'KC_APP',
      },
      label: 'App',
    },
    {
      code: 102,
      name: {
        long: 'KC_POWER',
        short: 'KC_POWER',
      },
      label: 'Power',
    },
    {
      code: 103,
      name: {
        long: 'KC_KP_EQUAL',
        short: 'KC_PEQL',
      },
      label: 'Num =',
    },
    {
      code: 104,
      name: {
        long: 'KC_F13',
        short: 'KC_F13',
      },
      label: 'F13',
    },
    {
      code: 105,
      name: {
        long: 'KC_F14',
        short: 'KC_F14',
      },
      label: 'F14',
    },
    {
      code: 106,
      name: {
        long: 'KC_F15',
        short: 'KC_F15',
      },
      label: 'F15',
    },
    {
      code: 107,
      name: {
        long: 'KC_F16',
        short: 'KC_F16',
      },
      label: 'F16',
    },
    {
      code: 108,
      name: {
        long: 'KC_F17',
        short: 'KC_F17',
      },
      label: 'F17',
    },
    {
      code: 109,
      name: {
        long: 'KC_F18',
        short: 'KC_F18',
      },
      label: 'F18',
    },
    {
      code: 110,
      name: {
        long: 'KC_F19',
        short: 'KC_F19',
      },
      label: 'F19',
    },
    {
      code: 111,
      name: {
        long: 'KC_F20',
        short: 'KC_F20',
      },
      label: 'F20',
    },
    {
      code: 112,
      name: {
        long: 'KC_F21',
        short: 'KC_F21',
      },
      label: 'F21',
    },
    {
      code: 113,
      name: {
        long: 'KC_F22',
        short: 'KC_F22',
      },
      label: 'F22',
    },
    {
      code: 114,
      name: {
        long: 'KC_F23',
        short: 'KC_F23',
      },
      label: 'F23',
    },
    {
      code: 115,
      name: {
        long: 'KC_F24',
        short: 'KC_F24',
      },
      label: 'F24',
    },
    {
      code: 116,
      name: {
        long: 'KC_EXECUTE',
        short: 'KC_EXEC',
      },
      label: 'Execute',
    },
    {
      code: 117,
      name: {
        long: 'KC_HELP',
        short: 'KC_HELP',
      },
      label: 'Help',
    },
    {
      code: 118,
      name: {
        long: 'KC_MENU',
        short: 'KC_MENU',
      },
      label: 'Menu',
    },
    {
      code: 119,
      name: {
        long: 'KC_SELECT',
        short: 'KC_SLCT',
      },
      label: 'Select',
    },
    {
      code: 120,
      name: {
        long: 'KC_STOP',
        short: 'KC_STOP',
      },
      label: 'Stop',
    },
    {
      code: 121,
      name: {
        long: 'KC_AGAIN',
        short: 'KC_AGIN',
      },
      label: 'Again',
    },
    {
      code: 122,
      name: {
        long: 'KC_UNDO',
        short: 'KC_UNDO',
      },
      label: 'Undo',
    },
    {
      code: 123,
      name: {
        long: 'KC_CUT',
        short: 'KC_CUT',
      },
      label: 'Cut',
    },
    {
      code: 124,
      name: {
        long: 'KC_COPY',
        short: 'KC_COPY',
      },
      label: 'Copy',
    },
    {
      code: 125,
      name: {
        long: 'KC_PASTE',
        short: 'KC_PSTE',
      },
      label: 'Paste',
    },
    {
      code: 126,
      name: {
        long: 'KC_FIND',
        short: 'KC_FIND',
      },
      label: 'Find',
    },
    {
      code: 127,
      name: {
        long: 'KC__MUTE',
        short: 'KC__MUTE',
      },
      label: 'Mute',
    },
    {
      code: 128,
      name: {
        long: 'KC__VOLUP',
        short: 'KC__VOLUP',
      },
      label: 'Vol +',
    },
    {
      code: 129,
      name: {
        long: 'KC__VOLDOWN',
        short: 'KC__VOLDOWN',
      },
      label: 'Vol -',
    },
    {
      code: 130,
      name: {
        long: 'KC_LOCKING_CAPS',
        short: 'KC_LCAP',
      },
      label: 'Locking Caps Lock',
    },
    {
      code: 131,
      name: {
        long: 'KC_LOCKING_NUM',
        short: 'KC_LNUM',
      },
      label: 'Locking Num Lock',
    },
    {
      code: 132,
      name: {
        long: 'KC_LOCKING_SCROLL',
        short: 'KC_LSCR',
      },
      label: 'Locking Scroll Lock',
    },
    {
      code: 133,
      name: {
        long: 'KC_KP_COMMA',
        short: 'KC_PCMM',
      },
      label: 'Num ,',
    },
    {
      code: 134,
      name: {
        long: 'KC_KP_EQUAL_AS400',
        short: 'KC_KP_EQUAL_AS400',
      },
      label: 'Num = AS400',
    },
    {
      code: 135,
      name: {
        long: 'KC_INT1',
        short: 'KC_RO',
      },
      label: 'Ro',
    },
    {
      code: 136,
      name: {
        long: 'KC_INT2',
        short: 'KC_KANA',
      },
      label: 'かな',
    },
    {
      code: 137,
      name: {
        long: 'KC_INT3',
        short: 'KC_JYEN',
      },
      label: '¥',
    },
    {
      code: 138,
      name: {
        long: 'KC_INT4',
        short: 'KC_HENK',
      },
      label: '変換',
    },
    {
      code: 139,
      name: {
        long: 'KC_INT5',
        short: 'KC_MHEN',
      },
      label: '無変換',
    },
    {
      code: 140,
      name: {
        long: 'KC_INT6',
        short: 'KC_INT6',
      },
      label: 'JIS Numpad ,',
    },
    {
      code: 141,
      name: {
        long: 'KC_INT7',
        short: 'KC_INT7',
      },
      label: 'International 7',
    },
    {
      code: 142,
      name: {
        long: 'KC_INT8',
        short: 'KC_INT8',
      },
      label: 'International 8',
    },
    {
      code: 143,
      name: {
        long: 'KC_INT9',
        short: 'KC_INT9',
      },
      label: 'International 9',
    },
    {
      code: 144,
      name: {
        long: 'KC_LANG1',
        short: 'KC_HAEN',
      },
      label: 'Ha/En',
    },
    {
      code: 145,
      name: {
        long: 'KC_LANG2',
        short: 'KC_HANJ',
      },
      label: '한자',
    },
    {
      code: 146,
      name: {
        long: 'KC_LANG3',
        short: 'KC_LANG3',
      },
      label: 'JIS Katakana',
    },
    {
      code: 147,
      name: {
        long: 'KC_LANG4',
        short: 'KC_LANG4',
      },
      label: 'JIS Hiragana',
    },
    {
      code: 148,
      name: {
        long: 'KC_LANG5',
        short: 'KC_LANG5',
      },
      label: 'JIS Zenkaku/Hankaku',
    },
    {
      code: 149,
      name: {
        long: 'KC_LANG6',
        short: 'KC_LANG6',
      },
      label: 'Language 6',
    },
    {
      code: 150,
      name: {
        long: 'KC_LANG7',
        short: 'KC_LANG7',
      },
      label: 'Language 7',
    },
    {
      code: 151,
      name: {
        long: 'KC_LANG8',
        short: 'KC_LANG8',
      },
      label: 'Language 8',
    },
    {
      code: 152,
      name: {
        long: 'KC_LANG9',
        short: 'KC_LANG9',
      },
      label: 'Language 9',
    },
    {
      code: 153,
      name: {
        long: 'KC_ALT_ERASE',
        short: 'KC_ERAS',
      },
      label: 'Alt Erase',
    },
    {
      code: 154,
      name: {
        long: 'KC_SYSREQ',
        short: 'KC_SYSREQ',
      },
      label: 'SysReq',
    },
    {
      code: 155,
      name: {
        long: 'KC_CANCEL',
        short: 'KC_CANCEL',
      },
      label: 'Cancel',
    },
    {
      code: 156,
      name: {
        long: 'KC_CLEAR',
        short: 'KC_CLR',
      },
      label: 'Clear',
    },
    {
      code: 157,
      name: {
        long: 'KC_PRIOR',
        short: 'KC_PRIOR',
      },
      label: 'Prior',
    },
    {
      code: 158,
      name: {
        long: 'KC_RETURN',
        short: 'KC_RETURN',
      },
      label: 'Return',
    },
    {
      code: 159,
      name: {
        long: 'KC_SEPARATOR',
        short: 'KC_SEPARATOR',
      },
      label: 'Separator',
    },
    {
      code: 160,
      name: {
        long: 'KC_OUT',
        short: 'KC_OUT',
      },
      label: 'Out',
    },
    {
      code: 161,
      name: {
        long: 'KC_OPER',
        short: 'KC_OPER',
      },
      label: 'Oper',
    },
    {
      code: 162,
      name: {
        long: 'KC_CLEAR_AGAIN',
        short: 'KC_CLEAR_AGAIN',
      },
      label: 'Clear/Again',
    },
    {
      code: 163,
      name: {
        long: 'KC_CRSEL',
        short: 'KC_CRSEL',
      },
      label: 'CrSel/Props',
    },
    {
      code: 164,
      name: {
        long: 'KC_EXSEL',
        short: 'KC_EXSEL',
      },
      label: 'ExSel',
    },
    {
      code: 165,
      name: {
        long: 'KC_SYSTEM_POWER',
        short: 'KC_PWR',
      },
      label: 'System Power Down',
    },
    {
      code: 166,
      name: {
        long: 'KC_SYSTEM_SLEEP',
        short: 'KC_SLEP',
      },
      label: 'Sleep',
    },
    {
      code: 167,
      name: {
        long: 'KC_SYSTEM_WAKE',
        short: 'KC_WAKE',
      },
      label: 'Wake',
    },
    {
      code: 168,
      name: {
        long: 'KC_AUDIO_MUTE',
        short: 'KC_MUTE',
      },
      label: 'Audio Mute',
    },
    {
      code: 169,
      name: {
        long: 'KC_AUDIO_VOL_UP',
        short: 'KC_VOLU',
      },
      label: 'Audio Vol +',
    },
    {
      code: 170,
      name: {
        long: 'KC_AUDIO_VOL_DOWN',
        short: 'KC_VOLD',
      },
      label: 'Audio Vol -',
    },
    {
      code: 171,
      name: {
        long: 'KC_MEDIA_NEXT_TRACK',
        short: 'KC_MNXT',
      },
      label: 'Next',
    },
    {
      code: 172,
      name: {
        long: 'KC_MEDIA_PREV_TRACK',
        short: 'KC_MPRV',
      },
      label: 'Previous',
    },
    {
      code: 173,
      name: {
        long: 'KC_MEDIA_STOP',
        short: 'KC_MSTP',
      },
      label: 'Media Stop',
    },
    {
      code: 174,
      name: {
        long: 'KC_MEDIA_PLAY_PAUSE',
        short: 'KC_MPLY',
      },
      label: 'Play',
    },
    {
      code: 175,
      name: {
        long: 'KC_MEDIA_SELECT',
        short: 'KC_MSEL',
      },
      label: 'Select',
    },
    {
      code: 176,
      name: {
        long: 'KC_MEDIA_EJECT',
        short: 'KC_EJCT',
      },
      label: 'Eject',
    },
    {
      code: 177,
      name: {
        long: 'KC_MAIL',
        short: 'KC_MAIL',
      },
      label: 'Mail',
    },
    {
      code: 178,
      name: {
        long: 'KC_CALCULATOR',
        short: 'KC_CALC',
      },
      label: 'Calculator',
    },
    {
      code: 179,
      name: {
        long: 'KC_MY_COMPUTER',
        short: 'KC_MYCM',
      },
      label: 'My Computer',
    },
    {
      code: 180,
      name: {
        long: 'KC_WWW_SEARCH',
        short: 'KC_WSCH',
      },
      label: 'WWW Search',
    },
    {
      code: 181,
      name: {
        long: 'KC_WWW_HOME',
        short: 'KC_WHOM',
      },
      label: 'WWW Home',
    },
    {
      code: 182,
      name: {
        long: 'KC_WWW_BACK',
        short: 'KC_WBAK',
      },
      label: 'WWW Back',
    },
    {
      code: 183,
      name: {
        long: 'KC_WWW_FORWARD',
        short: 'KC_WFWD',
      },
      label: 'WWW Forward',
    },
    {
      code: 184,
      name: {
        long: 'KC_WWW_STOP',
        short: 'KC_WSTP',
      },
      label: 'WWW Stop',
    },
    {
      code: 185,
      name: {
        long: 'KC_WWW_REFRESH',
        short: 'KC_WREF',
      },
      label: 'WWW Refresh',
    },
    {
      code: 186,
      name: {
        long: 'KC_WWW_FAVORITES',
        short: 'KC_WFAV',
      },
      label: 'WWW Favorite',
    },
    {
      code: 187,
      name: {
        long: 'KC_MEDIA_FAST_FORWARD',
        short: 'KC_MFFD',
      },
      label: 'Fast Forward',
    },
    {
      code: 188,
      name: {
        long: 'KC_MEDIA_REWIND',
        short: 'KC_MRWD',
      },
      label: 'Rewind',
    },
    {
      code: 189,
      name: {
        long: 'KC_BRIGHTNESS_UP',
        short: 'KC_BRIU',
      },
      label: 'Screen +',
    },
    {
      code: 190,
      name: {
        long: 'KC_BRIGHTNESS_DOWN',
        short: 'KC_BRID',
      },
      label: 'Screen -',
    },
    {
      code: 192,
      name: {
        long: 'KC_FN0',
        short: 'KC_FN0',
      },
      label: 'FN0',
    },
    {
      code: 193,
      name: {
        long: 'KC_FN1',
        short: 'KC_FN1',
      },
      label: 'FN1',
    },
    {
      code: 194,
      name: {
        long: 'KC_FN2',
        short: 'KC_FN2',
      },
      label: 'FN2',
    },
    {
      code: 195,
      name: {
        long: 'KC_FN3',
        short: 'KC_FN3',
      },
      label: 'FN3',
    },
    {
      code: 196,
      name: {
        long: 'KC_FN4',
        short: 'KC_FN4',
      },
      label: 'FN4',
    },
    {
      code: 197,
      name: {
        long: 'KC_FN5',
        short: 'KC_FN5',
      },
      label: 'FN5',
    },
    {
      code: 198,
      name: {
        long: 'KC_FN6',
        short: 'KC_FN6',
      },
      label: 'FN6',
    },
    {
      code: 199,
      name: {
        long: 'KC_FN7',
        short: 'KC_FN7',
      },
      label: 'FN7',
    },
    {
      code: 200,
      name: {
        long: 'KC_FN8',
        short: 'KC_FN8',
      },
      label: 'FN8',
    },
    {
      code: 201,
      name: {
        long: 'KC_FN9',
        short: 'KC_FN9',
      },
      label: 'FN9',
    },
    {
      code: 202,
      name: {
        long: 'KC_FN10',
        short: 'KC_FN10',
      },
      label: 'FN10',
    },
    {
      code: 203,
      name: {
        long: 'KC_FN11',
        short: 'KC_FN11',
      },
      label: 'FN11',
    },
    {
      code: 204,
      name: {
        long: 'KC_FN12',
        short: 'KC_FN12',
      },
      label: 'FN12',
    },
    {
      code: 205,
      name: {
        long: 'KC_FN13',
        short: 'KC_FN13',
      },
      label: 'FN13',
    },
    {
      code: 206,
      name: {
        long: 'KC_FN14',
        short: 'KC_FN14',
      },
      label: 'FN14',
    },
    {
      code: 207,
      name: {
        long: 'KC_FN15',
        short: 'KC_FN15',
      },
      label: 'FN15',
    },
    {
      code: 208,
      name: {
        long: 'KC_FN16',
        short: 'KC_FN16',
      },
      label: 'FN16',
    },
    {
      code: 209,
      name: {
        long: 'KC_FN17',
        short: 'KC_FN17',
      },
      label: 'FN17',
    },
    {
      code: 210,
      name: {
        long: 'KC_FN18',
        short: 'KC_FN18',
      },
      label: 'FN18',
    },
    {
      code: 211,
      name: {
        long: 'KC_FN19',
        short: 'KC_FN19',
      },
      label: 'FN19',
    },
    {
      code: 212,
      name: {
        long: 'KC_FN20',
        short: 'KC_FN20',
      },
      label: 'FN20',
    },
    {
      code: 213,
      name: {
        long: 'KC_FN21',
        short: 'KC_FN21',
      },
      label: 'FN21',
    },
    {
      code: 214,
      name: {
        long: 'KC_FN22',
        short: 'KC_FN22',
      },
      label: 'FN22',
    },
    {
      code: 215,
      name: {
        long: 'KC_FN23',
        short: 'KC_FN23',
      },
      label: 'FN23',
    },
    {
      code: 216,
      name: {
        long: 'KC_FN24',
        short: 'KC_FN24',
      },
      label: 'FN24',
    },
    {
      code: 217,
      name: {
        long: 'KC_FN25',
        short: 'KC_FN25',
      },
      label: 'FN25',
    },
    {
      code: 218,
      name: {
        long: 'KC_FN26',
        short: 'KC_FN26',
      },
      label: 'FN26',
    },
    {
      code: 219,
      name: {
        long: 'KC_FN27',
        short: 'KC_FN27',
      },
      label: 'FN27',
    },
    {
      code: 220,
      name: {
        long: 'KC_FN28',
        short: 'KC_FN28',
      },
      label: 'FN28',
    },
    {
      code: 221,
      name: {
        long: 'KC_FN29',
        short: 'KC_FN29',
      },
      label: 'FN29',
    },
    {
      code: 222,
      name: {
        long: 'KC_FN30',
        short: 'KC_FN30',
      },
      label: 'FN30',
    },
    {
      code: 223,
      name: {
        long: 'KC_FN31',
        short: 'KC_FN31',
      },
      label: 'FN31',
    },
    {
      code: 224,
      name: {
        long: 'KC_LCTRL',
        short: 'KC_LCTL',
      },
      label: 'Left Ctrl',
    },
    {
      code: 225,
      name: {
        long: 'KC_LSHIFT',
        short: 'KC_LSFT',
      },
      label: 'Left Shift',
    },
    {
      code: 226,
      name: {
        long: 'KC_LALT',
        short: 'KC_LOPT',
      },
      label: 'Left Alt',
    },
    {
      code: 227,
      name: {
        long: 'KC_LGUI',
        short: 'KC_LWIN',
      },
      label: 'Left Win',
    },
    {
      code: 228,
      name: {
        long: 'KC_RCTRL',
        short: 'KC_RCTL',
      },
      label: 'Right Ctrl',
    },
    {
      code: 229,
      name: {
        long: 'KC_RSHIFT',
        short: 'KC_RSFT',
      },
      label: 'Right Shift',
    },
    {
      code: 230,
      name: {
        long: 'KC_RALT',
        short: 'KC_ROPT',
      },
      label: 'Right Alt',
    },
    {
      code: 231,
      name: {
        long: 'KC_RGUI',
        short: 'KC_RWIN',
      },
      label: 'Right Win',
    },
    {
      code: 240,
      name: {
        long: 'KC_MS_UP,',
        short: 'KC_MS_UP,',
      },
      label: 'Mouse ↑',
    },
    {
      code: 241,
      name: {
        long: 'KC_MS_DOWN',
        short: 'KC_MS_D',
      },
      label: 'Mouse ↓',
    },
    {
      code: 242,
      name: {
        long: 'KC_MS_LEFT',
        short: 'KC_MS_L',
      },
      label: 'Mouse ←',
    },
    {
      code: 243,
      name: {
        long: 'KC_MS_RIGHT',
        short: 'KC_MS_R',
      },
      label: 'Mouse →',
    },
    {
      code: 244,
      name: {
        long: 'KC_MS_BTN1',
        short: 'KC_BTN1',
      },
      label: 'Mouse Btn1',
    },
    {
      code: 245,
      name: {
        long: 'KC_MS_BTN2',
        short: 'KC_BTN2',
      },
      label: 'Mouse Btn2',
    },
    {
      code: 246,
      name: {
        long: 'KC_MS_BTN3',
        short: 'KC_BTN3',
      },
      label: 'Mouse Btn3',
    },
    {
      code: 247,
      name: {
        long: 'KC_MS_BTN4',
        short: 'KC_BTN4',
      },
      label: 'Mouse Btn4',
    },
    {
      code: 248,
      name: {
        long: 'KC_MS_BTN5',
        short: 'KC_BTN5',
      },
      label: 'Mouse Btn5',
    },
    {
      code: 249,
      name: {
        long: 'KC_MS_WH_UP',
        short: 'KC_WH_U',
      },
      label: 'Mouse Wh ↑',
    },
    {
      code: 250,
      name: {
        long: 'KC_MS_WH_DOWN',
        short: 'KC_WH_D',
      },
      label: 'Mouse Wh ↓',
    },
    {
      code: 251,
      name: {
        long: 'KC_MS_WH_LEFT',
        short: 'KC_WH_L',
      },
      label: 'Mouse Wh ←',
    },
    {
      code: 252,
      name: {
        long: 'KC_MS_WH_RIGHT',
        short: 'KC_WH_R',
      },
      label: 'Mouse Wh →',
    },
    {
      code: 253,
      name: {
        long: 'KC_MS_ACCEL0',
        short: 'KC_ACL0',
      },
      label: 'Mouse Acc0',
    },
    {
      code: 254,
      name: {
        long: 'KC_MS_ACCEL1',
        short: 'KC_ACL1',
      },
      label: 'Mouse Acc1',
    },
    {
      code: 255,
      name: {
        long: 'KC_MS_ACCEL2',
        short: 'KC_ACL2',
      },
      label: 'Mouse Acc2',
    },
    {
      code: 542,
      name: {
        long: 'KC_EXCLAIM',
        short: 'KC_EXLM',
      },
      label: '!',
    },
    {
      code: 543,
      name: {
        long: 'KC_AT',
        short: 'KC_AT',
      },
      label: '@',
    },
    {
      code: 544,
      name: {
        long: 'KC_HASH',
        short: 'KC_HASH',
      },
      label: '#',
    },
    {
      code: 545,
      name: {
        long: 'KC_DOLLAR',
        short: 'KC_DLR',
      },
      label: '$',
    },
    {
      code: 546,
      name: {
        long: 'KC_PERCENT',
        short: 'KC_PERC',
      },
      label: '%',
    },
    {
      code: 547,
      name: {
        long: 'KC_CIRCUMFLEX',
        short: 'KC_CIRC',
      },
      label: '^',
    },
    {
      code: 548,
      name: {
        long: 'KC_AMPERSAND',
        short: 'KC_AMPR',
      },
      label: '&',
    },
    {
      code: 549,
      name: {
        long: 'KC_ASTERISK',
        short: 'KC_ASTR',
      },
      label: '*',
    },
    {
      code: 550,
      name: {
        long: 'KC_LEFT_PAREN',
        short: 'KC_LPRN',
      },
      label: '(',
    },
    {
      code: 551,
      name: {
        long: 'KC_RIGHT_PAREN',
        short: 'KC_RPRN',
      },
      label: ')',
    },
    {
      code: 557,
      name: {
        long: 'KC_UNDERSCORE',
        short: 'KC_UNDS',
      },
      label: '_',
    },
    {
      code: 558,
      name: {
        long: 'KC_PLUS',
        short: 'KC_PLUS',
      },
      label: '+',
    },
    {
      code: 559,
      name: {
        long: 'KC_LEFT_CURLY_BRACE',
        short: 'KC_LCBR',
      },
      label: '{',
    },
    {
      code: 560,
      name: {
        long: 'KC_RIGHT_CURLY_BRACE',
        short: 'KC_RCBR',
      },
      label: '}',
    },
    {
      code: 561,
      name: {
        long: 'KC_PIPE',
        short: 'KC_PIPE',
      },
      label: '|',
    },
    {
      code: 563,
      name: {
        long: 'KC_COLON',
        short: 'KC_COLN',
      },
      label: ':',
    },
    {
      code: 564,
      name: {
        long: 'KC_DOUBLE_QUOTE',
        short: 'KC_DQT',
      },
      label: '"',
    },
    {
      code: 565,
      name: {
        long: 'KC_TILDE',
        short: 'KC_TILD',
      },
      label: '~',
    },
    {
      code: 566,
      name: {
        long: 'KC_LEFT_ANGLE_BRACKET',
        short: 'KC_LABK',
      },
      label: '<',
    },
    {
      code: 567,
      name: {
        long: 'KC_RIGHT_ANGLE_BRACKET',
        short: 'KC_RABK',
      },
      label: '>',
    },
    {
      code: 568,
      name: {
        long: 'KC_QUESTION',
        short: 'KC_QUES',
      },
      label: '?',
    },
    {
      code: 16684,
      name: {
        long: 'SPACE_FN1',
        short: 'SPC_FN1',
      },
      label: 'Space Fn1',
    },
    {
      code: 16940,
      name: {
        long: 'SPACE_FN2',
        short: 'SPC_FN2',
      },
      label: 'Space Fn2',
    },
    {
      code: 17196,
      name: {
        long: 'SPACE_FN3',
        short: 'SPC_FN3',
      },
      label: 'Space Fn3',
    },
    {
      code: 20496,
      name: {
        long: 'TO(0)',
        short: 'TO(0)',
      },
      label: 'TO(0)',
    },
    {
      code: 20497,
      name: {
        long: 'TO(1)',
        short: 'TO(1)',
      },
      label: 'TO(1)',
    },
    {
      code: 20498,
      name: {
        long: 'TO(2)',
        short: 'TO(2)',
      },
      label: 'TO(2)',
    },
    {
      code: 20499,
      name: {
        long: 'TO(3)',
        short: 'TO(3)',
      },
      label: 'TO(3)',
    },
    {
      code: 20500,
      name: {
        long: 'TO(4)',
        short: 'TO(4)',
      },
      label: 'TO(4)',
    },
    {
      code: 20501,
      name: {
        long: 'TO(5)',
        short: 'TO(5)',
      },
      label: 'TO(5)',
    },
    {
      code: 20502,
      name: {
        long: 'TO(6)',
        short: 'TO(6)',
      },
      label: 'TO(6)',
    },
    {
      code: 20503,
      name: {
        long: 'TO(7)',
        short: 'TO(7)',
      },
      label: 'TO(7)',
    },
    {
      code: 20736,
      name: {
        long: 'MO(0)',
        short: 'MO(0)',
      },
      label: 'MO(0)',
    },
    {
      code: 20737,
      name: {
        long: 'MO(1)',
        short: 'MO(1)',
      },
      label: 'MO(1)',
    },
    {
      code: 20738,
      name: {
        long: 'MO(2)',
        short: 'MO(2)',
      },
      label: 'MO(2)',
    },
    {
      code: 20739,
      name: {
        long: 'MO(3)',
        short: 'MO(3)',
      },
      label: 'MO(3)',
    },
    {
      code: 20740,
      name: {
        long: 'MO(4)',
        short: 'MO(4)',
      },
      label: 'MO(4)',
    },
    {
      code: 20741,
      name: {
        long: 'MO(5)',
        short: 'MO(5)',
      },
      label: 'MO(5)',
    },
    {
      code: 20742,
      name: {
        long: 'MO(6)',
        short: 'MO(6)',
      },
      label: 'MO(6)',
    },
    {
      code: 20743,
      name: {
        long: 'MO(7)',
        short: 'MO(7)',
      },
      label: 'MO(7)',
    },
    {
      code: 21248,
      name: {
        long: 'TG(0)',
        short: 'TG(0)',
      },
      label: 'TG(0)',
    },
    {
      code: 21249,
      name: {
        long: 'TG(1)',
        short: 'TG(1)',
      },
      label: 'TG(1)',
    },
    {
      code: 21250,
      name: {
        long: 'TG(2)',
        short: 'TG(2)',
      },
      label: 'TG(2)',
    },
    {
      code: 21251,
      name: {
        long: 'TG(3)',
        short: 'TG(3)',
      },
      label: 'TG(3)',
    },
    {
      code: 21252,
      name: {
        long: 'TG(4)',
        short: 'TG(4)',
      },
      label: 'TG(4)',
    },
    {
      code: 21253,
      name: {
        long: 'TG(5)',
        short: 'TG(5)',
      },
      label: 'TG(5)',
    },
    {
      code: 21254,
      name: {
        long: 'TG(6)',
        short: 'TG(6)',
      },
      label: 'TG(6)',
    },
    {
      code: 21255,
      name: {
        long: 'TG(7)',
        short: 'TG(7)',
      },
      label: 'TG(7)',
    },
    {
      code: 21504,
      name: {
        long: 'OSL(0)',
        short: 'OSL(0)',
      },
      label: 'OSL(0)',
    },
    {
      code: 21505,
      name: {
        long: 'OSL(1)',
        short: 'OSL(1)',
      },
      label: 'OSL(1)',
    },
    {
      code: 21506,
      name: {
        long: 'OSL(2)',
        short: 'OSL(2)',
      },
      label: 'OSL(2)',
    },
    {
      code: 21507,
      name: {
        long: 'OSL(3)',
        short: 'OSL(3)',
      },
      label: 'OSL(3)',
    },
    {
      code: 21508,
      name: {
        long: 'OSL(4)',
        short: 'OSL(4)',
      },
      label: 'OSL(4)',
    },
    {
      code: 21509,
      name: {
        long: 'OSL(5)',
        short: 'OSL(5)',
      },
      label: 'OSL(5)',
    },
    {
      code: 21510,
      name: {
        long: 'OSL(6)',
        short: 'OSL(6)',
      },
      label: 'OSL(6)',
    },
    {
      code: 21511,
      name: {
        long: 'OSL(7)',
        short: 'OSL(7)',
      },
      label: 'OSL(7)',
    },
    {
      code: 22528,
      name: {
        long: 'TT(0)',
        short: 'TT(0)',
      },
      label: 'TT(0)',
    },
    {
      code: 22529,
      name: {
        long: 'TT(1)',
        short: 'TT(1)',
      },
      label: 'TT(1)',
    },
    {
      code: 22530,
      name: {
        long: 'TT(2)',
        short: 'TT(2)',
      },
      label: 'TT(2)',
    },
    {
      code: 22531,
      name: {
        long: 'TT(3)',
        short: 'TT(3)',
      },
      label: 'TT(3)',
    },
    {
      code: 22532,
      name: {
        long: 'TT(4)',
        short: 'TT(4)',
      },
      label: 'TT(4)',
    },
    {
      code: 22533,
      name: {
        long: 'TT(5)',
        short: 'TT(5)',
      },
      label: 'TT(5)',
    },
    {
      code: 22534,
      name: {
        long: 'TT(6)',
        short: 'TT(6)',
      },
      label: 'TT(6)',
    },
    {
      code: 22535,
      name: {
        long: 'TT(7)',
        short: 'TT(7)',
      },
      label: 'TT(7)',
    },
    {
      code: 23552,
      name: {
        long: 'RESET',
        short: 'RESET',
      },
      label: 'Reset',
    },
    {
      code: 23553,
      name: {
        long: 'DEBUG',
        short: 'DEBUG',
      },
      label: 'Debug',
    },
    {
      code: 23554,
      name: {
        long: 'MAGIC_SWAP_CONTROL_CAPSLOCK',
        short: 'CL_SWAP',
      },
      label: 'MAGIC_SWAP_CONTROL_CAPSLOCK',
    },
    {
      code: 23555,
      name: {
        long: 'MAGIC_CAPSLOCK_TO_CONTROL',
        short: 'CL_CTRL',
      },
      label: 'MAGIC_CAPSLOCK_TO_CONTROL',
    },
    {
      code: 23556,
      name: {
        long: 'MAGIC_SWAP_LALT_LGUI',
        short: 'LAG_SWP',
      },
      label: 'MAGIC_SWAP_LALT_LGUI',
    },
    {
      code: 23557,
      name: {
        long: 'MAGIC_SWAP_RALT_RGUI',
        short: 'RAG_SWP',
      },
      label: 'MAGIC_SWAP_RALT_RGUI',
    },
    {
      code: 23558,
      name: {
        long: 'MAGIC_NO_GUI',
        short: 'GUI_OFF',
      },
      label: 'MAGIC_NO_GUI',
    },
    {
      code: 23559,
      name: {
        long: 'MAGIC_SWAP_GRAVE_ESC',
        short: 'GE_SWAP',
      },
      label: 'MAGIC_SWAP_GRAVE_ESC',
    },
    {
      code: 23560,
      name: {
        long: 'MAGIC_SWAP_BACKSLASH_BACKSPACE',
        short: 'BS_SWAP',
      },
      label: 'MAGIC_SWAP_BACKSLASH_BACKSPACE',
    },
    {
      code: 23561,
      name: {
        long: 'MAGIC_HOST_NKRO',
        short: 'NK_ON',
      },
      label: 'MAGIC_HOST_NKRO',
    },
    {
      code: 23562,
      name: {
        long: 'MAGIC_SWAP_ALT_GUI',
        short: 'AG_SWAP',
      },
      label: 'MAGIC_SWAP_ALT_GUI',
    },
    {
      code: 23563,
      name: {
        long: 'MAGIC_UNSWAP_CONTROL_CAPSLOCK',
        short: 'CL_NORM',
      },
      label: 'MAGIC_UNSWAP_CONTROL_CAPSLOCK',
    },
    {
      code: 23564,
      name: {
        long: 'MAGIC_UNCAPSLOCK_TO_CONTROL',
        short: 'CL_CAPS',
      },
      label: 'MAGIC_UNCAPSLOCK_TO_CONTROL',
    },
    {
      code: 23565,
      name: {
        long: 'MAGIC_UNSWAP_LALT_LGUI',
        short: 'LAG_NRM',
      },
      label: 'MAGIC_UNSWAP_LALT_LGUI',
    },
    {
      code: 23566,
      name: {
        long: 'MAGIC_UNSWAP_RALT_RGUI',
        short: 'RAG_NRM',
      },
      label: 'MAGIC_UNSWAP_RALT_RGUI',
    },
    {
      code: 23567,
      name: {
        long: 'MAGIC_UNNO_GUI',
        short: 'GUI_ON',
      },
      label: 'MAGIC_UNNO_GUI',
    },
    {
      code: 23568,
      name: {
        long: 'MAGIC_UNSWAP_GRAVE_ESC',
        short: 'GE_NORM',
      },
      label: 'MAGIC_UNSWAP_GRAVE_ESC',
    },
    {
      code: 23569,
      name: {
        long: 'MAGIC_UNSWAP_BACKSLASH_BACKSPACE',
        short: 'BS_NORM',
      },
      label: 'MAGIC_UNSWAP_BACKSLASH_BACKSPACE',
    },
    {
      code: 23570,
      name: {
        long: 'MAGIC_UNHOST_NKRO',
        short: 'NK_OFF',
      },
      label: 'MAGIC_UNHOST_NKRO',
    },
    {
      code: 23571,
      name: {
        long: 'MAGIC_UNSWAP_ALT_GUI',
        short: 'AG_NORM',
      },
      label: 'MAGIC_UNSWAP_ALT_GUI',
    },
    {
      code: 23572,
      name: {
        long: 'MAGIC_TOGGLE_NKRO',
        short: 'NK_TOGG',
      },
      label: 'Toggle NKRO',
    },
    {
      code: 23573,
      name: {
        long: 'MAGIC_TOGGLE_ALT_GUI',
        short: 'AG_TOGG',
      },
      label: 'MAGIC_TOGGLE_ALT_GUI',
    },
    {
      code: 23574,
      name: {
        long: 'GRAVE_ESC',
        short: 'KC_GESC',
      },
      label: 'Esc `',
    },
    {
      code: 23581,
      name: {
        long: 'AU_ON',
        short: 'AU_ON',
      },
      label: 'Audio On',
    },
    {
      code: 23582,
      name: {
        long: 'AU_OFF',
        short: 'AU_OFF',
      },
      label: 'Audio Off',
    },
    {
      code: 23583,
      name: {
        long: 'AU_TOG',
        short: 'AU_TOG',
      },
      label: 'Audio Toggle',
    },
    {
      code: 23584,
      name: {
        long: 'CLICKY_TOGGLE',
        short: 'CLICKY_TOGGLE',
      },
      label: 'Clicky Toggle',
    },
    {
      code: 23585,
      name: {
        long: 'CLICKY_ENABLE',
        short: 'CLICKY_ENABLE',
      },
      label: 'Clicky Enable',
    },
    {
      code: 23586,
      name: {
        long: 'CLICKY_DISABLE',
        short: 'CLICKY_DISABLE',
      },
      label: 'Clicky Disable',
    },
    {
      code: 23587,
      name: {
        long: 'CLICKY_UP',
        short: 'CLICKY_UP',
      },
      label: 'Clicky Up',
    },
    {
      code: 23588,
      name: {
        long: 'CLICKY_DOWN',
        short: 'CLICKY_DOWN',
      },
      label: 'Clicky Down',
    },
    {
      code: 23589,
      name: {
        long: 'CLICKY_RESET',
        short: 'CLICKY_RESET',
      },
      label: 'Clicky Reset',
    },
    {
      code: 23590,
      name: {
        long: 'MU_ON',
        short: 'MU_ON',
      },
      label: 'Music On',
    },
    {
      code: 23591,
      name: {
        long: 'MU_OFF',
        short: 'MU_OFF',
      },
      label: 'Music Off',
    },
    {
      code: 23592,
      name: {
        long: 'MU_TOG',
        short: 'MU_TOG',
      },
      label: 'Music Toggle',
    },
    {
      code: 23593,
      name: {
        long: 'MU_MOD',
        short: 'MU_MOD',
      },
      label: 'Music Mode',
    },
    {
      code: 23739,
      name: {
        long: 'BL_ON',
        short: 'BL_ON',
      },
      label: 'BL On',
    },
    {
      code: 23740,
      name: {
        long: 'BL_OFF',
        short: 'BL_OFF',
      },
      label: 'BL Off',
    },
    {
      code: 23741,
      name: {
        long: 'BL_DEC',
        short: 'BL_DEC',
      },
      label: 'BL -',
    },
    {
      code: 23742,
      name: {
        long: 'BL_INC',
        short: 'BL_INC',
      },
      label: 'BL +',
    },
    {
      code: 23743,
      name: {
        long: 'BL_TOGG',
        short: 'BL_TOGG',
      },
      label: 'BL Toggle',
    },
    {
      code: 23744,
      name: {
        long: 'BL_STEP',
        short: 'BL_STEP',
      },
      label: 'BL Cycle',
    },
    {
      code: 23745,
      name: {
        long: 'BL_BRTG',
        short: 'BL_BRTG',
      },
      label: 'BR Toggle',
    },
    {
      code: 23746,
      name: {
        long: 'RGB_TOG',
        short: 'RGB_TOG',
      },
      label: 'RGB Toggle',
    },
    {
      code: 23747,
      name: {
        long: 'RGB_MODE_FORWARD',
        short: 'RGB_MODE_FORWARD',
      },
      label: 'RGB Mode +',
    },
    {
      code: 23748,
      name: {
        long: 'RGB_MODE_REVERSE',
        short: 'RGB_MODE_REVERSE',
      },
      label: 'RGB Mode -',
    },
    {
      code: 23749,
      name: {
        long: 'RGB_HUI',
        short: 'RGB_HUI',
      },
      label: 'Hue +',
    },
    {
      code: 23750,
      name: {
        long: 'RGB_HUD',
        short: 'RGB_HUD',
      },
      label: 'Hue -',
    },
    {
      code: 23751,
      name: {
        long: 'RGB_SAI',
        short: 'RGB_SAI',
      },
      label: 'Sat +',
    },
    {
      code: 23752,
      name: {
        long: 'RGB_SAD',
        short: 'RGB_SAD',
      },
      label: 'Sat -',
    },
    {
      code: 23753,
      name: {
        long: 'RGB_VAI',
        short: 'RGB_VAI',
      },
      label: 'Bright +',
    },
    {
      code: 23754,
      name: {
        long: 'RGB_VAD',
        short: 'RGB_VAD',
      },
      label: 'Bright -',
    },
    {
      code: 23755,
      name: {
        long: 'RGB_SPI',
        short: 'RGB_SPI',
      },
      label: 'Effect Speed +',
    },
    {
      code: 23756,
      name: {
        long: 'RGB_SPD',
        short: 'RGB_SPD',
      },
      label: 'Effect Speed -',
    },
    {
      code: 23757,
      name: {
        long: 'RGB_MODE_PLAIN',
        short: 'RGB_MODE_PLAIN',
      },
      label: 'RGB Mode P',
    },
    {
      code: 23758,
      name: {
        long: 'RGB_MODE_BREATHE',
        short: 'RGB_MODE_BREATHE',
      },
      label: 'RGB Mode B',
    },
    {
      code: 23759,
      name: {
        long: 'RGB_MODE_RAINBOW',
        short: 'RGB_MODE_RAINBOW',
      },
      label: 'RGB Mode R',
    },
    {
      code: 23760,
      name: {
        long: 'RGB_MODE_SWIRL',
        short: 'RGB_MODE_SWIRL',
      },
      label: 'RGB Mode SW',
    },
    {
      code: 23761,
      name: {
        long: 'RGB_MODE_SNAKE',
        short: 'RGB_MODE_SNAKE',
      },
      label: 'RGB Mode SN',
    },
    {
      code: 23762,
      name: {
        long: 'RGB_MODE_KNIGHT',
        short: 'RGB_MODE_KNIGHT',
      },
      label: 'RGB Mode K',
    },
    {
      code: 23763,
      name: {
        long: 'RGB_MODE_XMAS',
        short: 'RGB_MODE_XMAS',
      },
      label: 'RGB Mode X',
    },
    {
      code: 23764,
      name: {
        long: 'RGB_MODE_GRADIENT',
        short: 'RGB_MODE_GRADIENT',
      },
      label: 'RGB Mode G',
    },
    {
      code: 23767,
      name: {
        long: 'KC_LSPO',
        short: 'KC_LSPO',
      },
      label: 'LS (',
    },
    {
      code: 23768,
      name: {
        long: 'KC_RSPC',
        short: 'KC_RSPC',
      },
      label: 'RS )',
    },
    {
      code: 23769,
      name: {
        long: 'KC_SFTENT',
        short: 'KC_SFTENT',
      },
      label: 'SftEnt',
    },
    {
      code: 23795,
      name: {
        long: 'KC_LCPO',
        short: 'KC_LCPO',
      },
      label: 'LC (',
    },
    {
      code: 23796,
      name: {
        long: 'KC_RCPC',
        short: 'KC_RCPC',
      },
      label: 'RC )',
    },
    {
      code: 23797,
      name: {
        long: 'KC_LAPO',
        short: 'KC_LAPO',
      },
      label: 'LA (',
    },
    {
      code: 23798,
      name: {
        long: 'KC_RAPC',
        short: 'KC_RAPC',
      },
      label: 'RA )',
    },
    {
      code: 24336,
      name: {
        long: 'FN_MO13',
        short: 'FN_MO13',
      },
      label: 'Fn1 (Fn3)',
    },
    {
      code: 24337,
      name: {
        long: 'FN_MO23',
        short: 'FN_MO23',
      },
      label: 'Fn2 (Fn3)',
    },
    {
      code: 24338,
      name: {
        long: 'MACRO00',
        short: 'M0',
      },
      label: 'M0',
    },
    {
      code: 24339,
      name: {
        long: 'MACRO01',
        short: 'M1',
      },
      label: 'M1',
    },
    {
      code: 24340,
      name: {
        long: 'MACRO02',
        short: 'M2',
      },
      label: 'M2',
    },
    {
      code: 24341,
      name: {
        long: 'MACRO03',
        short: 'M3',
      },
      label: 'M3',
    },
    {
      code: 24342,
      name: {
        long: 'MACRO04',
        short: 'M4',
      },
      label: 'M4',
    },
    {
      code: 24343,
      name: {
        long: 'MACRO05',
        short: 'M5',
      },
      label: 'M5',
    },
    {
      code: 24344,
      name: {
        long: 'MACRO06',
        short: 'M6',
      },
      label: 'M6',
    },
    {
      code: 24345,
      name: {
        long: 'MACRO07',
        short: 'M7',
      },
      label: 'M7',
    },
    {
      code: 24346,
      name: {
        long: 'MACRO08',
        short: 'M8',
      },
      label: 'M8',
    },
    {
      code: 24347,
      name: {
        long: 'MACRO09',
        short: 'M9',
      },
      label: 'M9',
    },
    {
      code: 24348,
      name: {
        long: 'MACRO10',
        short: 'M10',
      },
      label: 'M10',
    },
    {
      code: 24349,
      name: {
        long: 'MACRO11',
        short: 'M11',
      },
      label: 'M11',
    },
    {
      code: 24350,
      name: {
        long: 'MACRO12',
        short: 'M12',
      },
      label: 'M12',
    },
    {
      code: 24351,
      name: {
        long: 'MACRO13',
        short: 'M13',
      },
      label: 'M13',
    },
    {
      code: 24352,
      name: {
        long: 'MACRO14',
        short: 'M14',
      },
      label: 'M14',
    },
    {
      code: 24353,
      name: {
        long: 'MACRO15',
        short: 'M15',
      },
      label: 'M15',
    },
  ];
}
