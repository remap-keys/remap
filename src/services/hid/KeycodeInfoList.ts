import { IKeycodeInfo } from './Hid';

export type KeyInfo = {
  desc: string;
  keycodeInfo: IKeycodeInfo;
};
export const keyInfoList: KeyInfo[] = [
  {
    desc: 'Ignore this key (NOOP)',
    keycodeInfo: {
      code: 0,
      name: {
        long: 'KC_NO',
        short: 'KC_NO',
      },
      label: ' ',
    },
  },
  {
    desc: 'Use the next lowest non-transparent key',
    keycodeInfo: {
      code: 1,
      name: {
        long: 'KC_TRANSPARENT',
        short: 'KC_TRNS',
      },
      label: '▽',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 2,
      name: {
        long: 'KC_POST_FAIL',
        short: 'KC_POST_FAIL',
      },
      label: 'PFAIL',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 3,
      name: {
        long: 'KC_UNDEFINED',
        short: 'KC_UNDEFINED',
      },
      label: 'UNDEF',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 4,
      name: {
        long: 'KC_A',
        short: 'KC_A',
      },
      label: 'A',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 5,
      name: {
        long: 'KC_B',
        short: 'KC_B',
      },
      label: 'B',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 6,
      name: {
        long: 'KC_C',
        short: 'KC_C',
      },
      label: 'C',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 7,
      name: {
        long: 'KC_D',
        short: 'KC_D',
      },
      label: 'D',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 8,
      name: {
        long: 'KC_E',
        short: 'KC_E',
      },
      label: 'E',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 9,
      name: {
        long: 'KC_F',
        short: 'KC_F',
      },
      label: 'F',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 10,
      name: {
        long: 'KC_G',
        short: 'KC_G',
      },
      label: 'G',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 11,
      name: {
        long: 'KC_H',
        short: 'KC_H',
      },
      label: 'H',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 12,
      name: {
        long: 'KC_I',
        short: 'KC_I',
      },
      label: 'I',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 13,
      name: {
        long: 'KC_J',
        short: 'KC_J',
      },
      label: 'J',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 14,
      name: {
        long: 'KC_K',
        short: 'KC_K',
      },
      label: 'K',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 15,
      name: {
        long: 'KC_L',
        short: 'KC_L',
      },
      label: 'L',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 16,
      name: {
        long: 'KC_M',
        short: 'KC_M',
      },
      label: 'M',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 17,
      name: {
        long: 'KC_N',
        short: 'KC_N',
      },
      label: 'N',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 18,
      name: {
        long: 'KC_O',
        short: 'KC_O',
      },
      label: 'O',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 19,
      name: {
        long: 'KC_P',
        short: 'KC_P',
      },
      label: 'P',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20,
      name: {
        long: 'KC_Q',
        short: 'KC_Q',
      },
      label: 'Q',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21,
      name: {
        long: 'KC_R',
        short: 'KC_R',
      },
      label: 'R',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 22,
      name: {
        long: 'KC_S',
        short: 'KC_S',
      },
      label: 'S',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 23,
      name: {
        long: 'KC_T',
        short: 'KC_T',
      },
      label: 'T',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 24,
      name: {
        long: 'KC_U',
        short: 'KC_U',
      },
      label: 'U',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 25,
      name: {
        long: 'KC_V',
        short: 'KC_V',
      },
      label: 'V',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 26,
      name: {
        long: 'KC_W',
        short: 'KC_W',
      },
      label: 'W',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 27,
      name: {
        long: 'KC_X',
        short: 'KC_X',
      },
      label: 'X',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 28,
      name: {
        long: 'KC_Y',
        short: 'KC_Y',
      },
      label: 'Y',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 29,
      name: {
        long: 'KC_Z',
        short: 'KC_Z',
      },
      label: 'Z',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 30,
      name: {
        long: 'KC_1',
        short: 'KC_1',
      },
      label: '1',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 31,
      name: {
        long: 'KC_2',
        short: 'KC_2',
      },
      label: '2',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 32,
      name: {
        long: 'KC_3',
        short: 'KC_3',
      },
      label: '3',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 33,
      name: {
        long: 'KC_4',
        short: 'KC_4',
      },
      label: '4',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 34,
      name: {
        long: 'KC_5',
        short: 'KC_5',
      },
      label: '5',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 35,
      name: {
        long: 'KC_6',
        short: 'KC_6',
      },
      label: '6',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 36,
      name: {
        long: 'KC_7',
        short: 'KC_7',
      },
      label: '7',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 37,
      name: {
        long: 'KC_8',
        short: 'KC_8',
      },
      label: '8',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 38,
      name: {
        long: 'KC_9',
        short: 'KC_9',
      },
      label: '9',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 39,
      name: {
        long: 'KC_0',
        short: 'KC_0',
      },
      label: '0',
    },
  },
  {
    desc: 'Return (Enter)',
    keycodeInfo: {
      code: 40,
      name: {
        long: 'KC_ENTER',
        short: 'KC_ENT',
      },
      label: 'Enter',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 41,
      name: {
        long: 'KC_ESCAPE',
        short: 'KC_ESC',
      },
      label: 'Esc',
    },
  },
  {
    desc: 'Delete (Backspace)',
    keycodeInfo: {
      code: 42,
      name: {
        long: 'KC_BSPACE',
        short: 'KC_BSPC',
      },
      label: 'BS',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 43,
      name: {
        long: 'KC_TAB',
        short: 'KC_TAB',
      },
      label: 'Tab',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 44,
      name: {
        long: 'KC_SPACE',
        short: 'KC_SPC',
      },
      label: 'Space',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 45,
      name: {
        long: 'KC_MINUS',
        short: 'KC_MINS',
      },
      label: '-',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 46,
      name: {
        long: 'KC_EQUAL',
        short: 'KC_EQL',
      },
      label: '=',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 47,
      name: {
        long: 'KC_LBRACKET',
        short: 'KC_LBRC',
      },
      label: '[',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 48,
      name: {
        long: 'KC_RBRACKET',
        short: 'KC_RBRC',
      },
      label: ']',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 49,
      name: {
        long: 'KC_BSLASH',
        short: 'KC_BSLS',
      },
      label: '\\',
    },
  },
  {
    desc: 'Non-US # and ~',
    keycodeInfo: {
      code: 50,
      name: {
        long: 'KC_NONUS_HASH',
        short: 'KC_NUHS',
      },
      label: 'NUHS',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 51,
      name: {
        long: 'KC_SCOLON',
        short: 'KC_SCLN',
      },
      label: ';',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 52,
      name: {
        long: 'KC_QUOTE',
        short: 'KC_QUOT',
      },
      label: "'",
    },
  },
  {
    desc: '` and ~, JIS Zenkaku/Hankaku',
    keycodeInfo: {
      code: 53,
      name: {
        long: 'KC_GRAVE',
        short: 'KC_ZKHK',
      },
      label: '`',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 54,
      name: {
        long: 'KC_COMMA',
        short: 'KC_COMM',
      },
      label: ',',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 55,
      name: {
        long: 'KC_DOT',
        short: 'KC_DOT',
      },
      label: '.',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 56,
      name: {
        long: 'KC_SLASH',
        short: 'KC_SLSH',
      },
      label: '/',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 57,
      name: {
        long: 'KC_CAPSLOCK',
        short: 'KC_CAPS',
      },
      label: 'Caps Lock',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 58,
      name: {
        long: 'KC_F1',
        short: 'KC_F1',
      },
      label: 'F1',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 59,
      name: {
        long: 'KC_F2',
        short: 'KC_F2',
      },
      label: 'F2',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 60,
      name: {
        long: 'KC_F3',
        short: 'KC_F3',
      },
      label: 'F3',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 61,
      name: {
        long: 'KC_F4',
        short: 'KC_F4',
      },
      label: 'F4',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 62,
      name: {
        long: 'KC_F5',
        short: 'KC_F5',
      },
      label: 'F5',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 63,
      name: {
        long: 'KC_F6',
        short: 'KC_F6',
      },
      label: 'F6',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 64,
      name: {
        long: 'KC_F7',
        short: 'KC_F7',
      },
      label: 'F7',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 65,
      name: {
        long: 'KC_F8',
        short: 'KC_F8',
      },
      label: 'F8',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 66,
      name: {
        long: 'KC_F9',
        short: 'KC_F9',
      },
      label: 'F9',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 67,
      name: {
        long: 'KC_F10',
        short: 'KC_F10',
      },
      label: 'F10',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 68,
      name: {
        long: 'KC_F11',
        short: 'KC_F11',
      },
      label: 'F11',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 69,
      name: {
        long: 'KC_F12',
        short: 'KC_F12',
      },
      label: 'F12',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 70,
      name: {
        long: 'KC_PSCREEN',
        short: 'KC_PSCR',
      },
      label: 'Print Screen',
    },
  },
  {
    desc: 'Scroll Lock, Brightness Down (macOS)',
    keycodeInfo: {
      code: 71,
      name: {
        long: 'KC_SCROLLLOCK',
        short: 'KC_BRMD',
      },
      label: 'Scroll Lock',
    },
  },
  {
    desc: 'Pause, Brightness Up (macOS)',
    keycodeInfo: {
      code: 72,
      name: {
        long: 'KC_PAUSE',
        short: 'KC_BRMU',
      },
      label: 'Pause',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 73,
      name: {
        long: 'KC_INSERT',
        short: 'KC_INS',
      },
      label: 'Insert',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 74,
      name: {
        long: 'KC_HOME',
        short: 'KC_HOME',
      },
      label: 'Home',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 75,
      name: {
        long: 'KC_PGUP',
        short: 'KC_PGUP',
      },
      label: 'Page Up',
    },
  },
  {
    desc: 'Forward Delete',
    keycodeInfo: {
      code: 76,
      name: {
        long: 'KC_DELETE',
        short: 'KC_DEL',
      },
      label: 'Del',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 77,
      name: {
        long: 'KC_END',
        short: 'KC_END',
      },
      label: 'End',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 78,
      name: {
        long: 'KC_PGDOWN',
        short: 'KC_PGDN',
      },
      label: 'Page Down',
    },
  },
  {
    desc: 'Right',
    keycodeInfo: {
      code: 79,
      name: {
        long: 'KC_RIGHT',
        short: 'KC_RGHT',
      },
      label: '→',
    },
  },
  {
    desc: 'Left',
    keycodeInfo: {
      code: 80,
      name: {
        long: 'KC_LEFT',
        short: 'KC_LEFT',
      },
      label: '←',
    },
  },
  {
    desc: 'Down',
    keycodeInfo: {
      code: 81,
      name: {
        long: 'KC_DOWN',
        short: 'KC_DOWN',
      },
      label: '↓',
    },
  },
  {
    desc: 'Up',
    keycodeInfo: {
      code: 82,
      name: {
        long: 'KC_UP',
        short: 'KC_UP',
      },
      label: '↑',
    },
  },
  {
    desc: 'Keypad Num Lock and Clear',
    keycodeInfo: {
      code: 83,
      name: {
        long: 'KC_NUMLOCK',
        short: 'KC_NLCK',
      },
      label: 'Num Lock',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 84,
      name: {
        long: 'KC_KP_SLASH',
        short: 'KC_PSLS',
      },
      label: 'Num /',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 85,
      name: {
        long: 'KC_KP_ASTERISK',
        short: 'KC_PAST',
      },
      label: 'Num *',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 86,
      name: {
        long: 'KC_KP_MINUS',
        short: 'KC_PMNS',
      },
      label: 'Num -',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 87,
      name: {
        long: 'KC_KP_PLUS',
        short: 'KC_PPLS',
      },
      label: 'Num +',
    },
  },
  {
    desc: 'Keypad Enter',
    keycodeInfo: {
      code: 88,
      name: {
        long: 'KC_KP_ENTER',
        short: 'KC_PENT',
      },
      label: 'Num Enter',
    },
  },
  {
    desc: 'Keypad 1 and End',
    keycodeInfo: {
      code: 89,
      name: {
        long: 'KC_KP_1',
        short: 'KC_P1',
      },
      label: 'Num 1',
    },
  },
  {
    desc: 'Keypad 2 and Down Arrow',
    keycodeInfo: {
      code: 90,
      name: {
        long: 'KC_KP_2',
        short: 'KC_P2',
      },
      label: 'Num 2',
    },
  },
  {
    desc: 'Keypad 3 and Page Down',
    keycodeInfo: {
      code: 91,
      name: {
        long: 'KC_KP_3',
        short: 'KC_P3',
      },
      label: 'Num 3',
    },
  },
  {
    desc: 'Keypad 4 and Left Arrow',
    keycodeInfo: {
      code: 92,
      name: {
        long: 'KC_KP_4',
        short: 'KC_P4',
      },
      label: 'Num 4',
    },
  },
  {
    desc: 'Keypad 5',
    keycodeInfo: {
      code: 93,
      name: {
        long: 'KC_KP_5',
        short: 'KC_P5',
      },
      label: 'Num 5',
    },
  },
  {
    desc: 'Keypad 6 and Right Arrow',
    keycodeInfo: {
      code: 94,
      name: {
        long: 'KC_KP_6',
        short: 'KC_P6',
      },
      label: 'Num 6',
    },
  },
  {
    desc: 'Keypad 7 and Home',
    keycodeInfo: {
      code: 95,
      name: {
        long: 'KC_KP_7',
        short: 'KC_P7',
      },
      label: 'Num 7',
    },
  },
  {
    desc: 'Keypad 8 and Up Arrow',
    keycodeInfo: {
      code: 96,
      name: {
        long: 'KC_KP_8',
        short: 'KC_P8',
      },
      label: 'Num 8',
    },
  },
  {
    desc: 'Keypad 9 and Page Up',
    keycodeInfo: {
      code: 97,
      name: {
        long: 'KC_KP_9',
        short: 'KC_P9',
      },
      label: 'Num 9',
    },
  },
  {
    desc: 'Keypad 0 and Insert',
    keycodeInfo: {
      code: 98,
      name: {
        long: 'KC_KP_0',
        short: 'KC_P0',
      },
      label: 'Num 0',
    },
  },
  {
    desc: 'Keypad . and Delete',
    keycodeInfo: {
      code: 99,
      name: {
        long: 'KC_KP_DOT',
        short: 'KC_PDOT',
      },
      label: 'Num .',
    },
  },
  {
    desc: 'Non-US  and |',
    keycodeInfo: {
      code: 100,
      name: {
        long: 'KC_NONUS_BSLASH',
        short: 'KC_NUBS',
      },
      label: 'NUBS',
    },
  },
  {
    desc: 'Application (Windows Context Menu Key)',
    keycodeInfo: {
      code: 101,
      name: {
        long: 'KC_APPLICATION',
        short: 'KC_APP',
      },
      label: 'App',
    },
  },
  {
    desc: 'System Power',
    keycodeInfo: {
      code: 102,
      name: {
        long: 'KC_POWER',
        short: 'KC_POWER',
      },
      label: 'Power',
    },
  },
  {
    desc: 'Keypad =',
    keycodeInfo: {
      code: 103,
      name: {
        long: 'KC_KP_EQUAL',
        short: 'KC_PEQL',
      },
      label: 'Num =',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 104,
      name: {
        long: 'KC_F13',
        short: 'KC_F13',
      },
      label: 'F13',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 105,
      name: {
        long: 'KC_F14',
        short: 'KC_F14',
      },
      label: 'F14',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 106,
      name: {
        long: 'KC_F15',
        short: 'KC_F15',
      },
      label: 'F15',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 107,
      name: {
        long: 'KC_F16',
        short: 'KC_F16',
      },
      label: 'F16',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 108,
      name: {
        long: 'KC_F17',
        short: 'KC_F17',
      },
      label: 'F17',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 109,
      name: {
        long: 'KC_F18',
        short: 'KC_F18',
      },
      label: 'F18',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 110,
      name: {
        long: 'KC_F19',
        short: 'KC_F19',
      },
      label: 'F19',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 111,
      name: {
        long: 'KC_F20',
        short: 'KC_F20',
      },
      label: 'F20',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 112,
      name: {
        long: 'KC_F21',
        short: 'KC_F21',
      },
      label: 'F21',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 113,
      name: {
        long: 'KC_F22',
        short: 'KC_F22',
      },
      label: 'F22',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 114,
      name: {
        long: 'KC_F23',
        short: 'KC_F23',
      },
      label: 'F23',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 115,
      name: {
        long: 'KC_F24',
        short: 'KC_F24',
      },
      label: 'F24',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 116,
      name: {
        long: 'KC_EXECUTE',
        short: 'KC_EXEC',
      },
      label: 'Execute',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 117,
      name: {
        long: 'KC_HELP',
        short: 'KC_HELP',
      },
      label: 'Help',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 118,
      name: {
        long: 'KC_MENU',
        short: 'KC_MENU',
      },
      label: 'Menu',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 119,
      name: {
        long: 'KC_SELECT',
        short: 'KC_SLCT',
      },
      label: 'Select',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 120,
      name: {
        long: 'KC_STOP',
        short: 'KC_STOP',
      },
      label: 'Stop',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 121,
      name: {
        long: 'KC_AGAIN',
        short: 'KC_AGIN',
      },
      label: 'Again',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 122,
      name: {
        long: 'KC_UNDO',
        short: 'KC_UNDO',
      },
      label: 'Undo',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 123,
      name: {
        long: 'KC_CUT',
        short: 'KC_CUT',
      },
      label: 'Cut',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 124,
      name: {
        long: 'KC_COPY',
        short: 'KC_COPY',
      },
      label: 'Copy',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 125,
      name: {
        long: 'KC_PASTE',
        short: 'KC_PSTE',
      },
      label: 'Paste',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 126,
      name: {
        long: 'KC_FIND',
        short: 'KC_FIND',
      },
      label: 'Find',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 127,
      name: {
        long: 'KC__MUTE',
        short: 'KC__MUTE',
      },
      label: 'Mute',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 128,
      name: {
        long: 'KC__VOLUP',
        short: 'KC__VOLUP',
      },
      label: 'Vol +',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 129,
      name: {
        long: 'KC__VOLDOWN',
        short: 'KC__VOLDOWN',
      },
      label: 'Vol -',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 130,
      name: {
        long: 'KC_LOCKING_CAPS',
        short: 'KC_LCAP',
      },
      label: 'Locking Caps Lock',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 131,
      name: {
        long: 'KC_LOCKING_NUM',
        short: 'KC_LNUM',
      },
      label: 'Locking Num Lock',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 132,
      name: {
        long: 'KC_LOCKING_SCROLL',
        short: 'KC_LSCR',
      },
      label: 'Locking Scroll Lock',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 133,
      name: {
        long: 'KC_KP_COMMA',
        short: 'KC_PCMM',
      },
      label: 'Num ,',
    },
  },
  {
    desc: 'Keypad = on AS/400 keyboards',
    keycodeInfo: {
      code: 134,
      name: {
        long: 'KC_KP_EQUAL_AS400',
        short: 'KC_KP_EQUAL_AS400',
      },
      label: 'Num = AS400',
    },
  },
  {
    desc: 'JIS \\ and _',
    keycodeInfo: {
      code: 135,
      name: {
        long: 'KC_INT1',
        short: 'KC_RO',
      },
      label: 'Ro',
    },
  },
  {
    desc: 'JIS Katakana/Hiragana',
    keycodeInfo: {
      code: 136,
      name: {
        long: 'KC_INT2',
        short: 'KC_KANA',
      },
      label: 'かな',
    },
  },
  {
    desc: 'JIS ¥ and |',
    keycodeInfo: {
      code: 137,
      name: {
        long: 'KC_INT3',
        short: 'KC_JYEN',
      },
      label: '¥',
    },
  },
  {
    desc: 'JIS Henkan',
    keycodeInfo: {
      code: 138,
      name: {
        long: 'KC_INT4',
        short: 'KC_HENK',
      },
      label: '変換',
    },
  },
  {
    desc: 'JIS Muhenkan',
    keycodeInfo: {
      code: 139,
      name: {
        long: 'KC_INT5',
        short: 'KC_MHEN',
      },
      label: '無変換',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 140,
      name: {
        long: 'KC_INT6',
        short: 'KC_INT6',
      },
      label: 'JIS Numpad ,',
    },
  },
  {
    desc: 'International 7',
    keycodeInfo: {
      code: 141,
      name: {
        long: 'KC_INT7',
        short: 'KC_INT7',
      },
      label: 'Int 7',
    },
  },
  {
    desc: 'International 8',
    keycodeInfo: {
      code: 142,
      name: {
        long: 'KC_INT8',
        short: 'KC_INT8',
      },
      label: 'Int 8',
    },
  },
  {
    desc: 'International 9',
    keycodeInfo: {
      code: 143,
      name: {
        long: 'KC_INT9',
        short: 'KC_INT9',
      },
      label: 'Int 9',
    },
  },
  {
    desc: 'Hangul/English',
    keycodeInfo: {
      code: 144,
      name: {
        long: 'KC_LANG1',
        short: 'KC_HAEN',
      },
      label: 'Ha/En',
    },
  },
  {
    desc: 'Hanja',
    keycodeInfo: {
      code: 145,
      name: {
        long: 'KC_LANG2',
        short: 'KC_HANJ',
      },
      label: '한자',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 146,
      name: {
        long: 'KC_LANG3',
        short: 'KC_LANG3',
      },
      label: 'JIS Katakana',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 147,
      name: {
        long: 'KC_LANG4',
        short: 'KC_LANG4',
      },
      label: 'JIS Hiragana',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 148,
      name: {
        long: 'KC_LANG5',
        short: 'KC_LANG5',
      },
      label: 'JIS Zenkaku/Hankaku',
    },
  },
  {
    desc: 'Language 6',
    keycodeInfo: {
      code: 149,
      name: {
        long: 'KC_LANG6',
        short: 'KC_LANG6',
      },
      label: 'Lang 6',
    },
  },
  {
    desc: 'Language 7',
    keycodeInfo: {
      code: 150,
      name: {
        long: 'KC_LANG7',
        short: 'KC_LANG7',
      },
      label: 'Lang 7',
    },
  },
  {
    desc: 'Language 8',
    keycodeInfo: {
      code: 151,
      name: {
        long: 'KC_LANG8',
        short: 'KC_LANG8',
      },
      label: 'Lang 8',
    },
  },
  {
    desc: 'Language 9',
    keycodeInfo: {
      code: 152,
      name: {
        long: 'KC_LANG9',
        short: 'KC_LANG9',
      },
      label: 'Lang 9',
    },
  },
  {
    desc: 'Alternate Erase',
    keycodeInfo: {
      code: 153,
      name: {
        long: 'KC_ALT_ERASE',
        short: 'KC_ERAS',
      },
      label: 'Alt Erase',
    },
  },
  {
    desc: 'SysReq/Attention',
    keycodeInfo: {
      code: 154,
      name: {
        long: 'KC_SYSREQ',
        short: 'KC_SYSREQ',
      },
      label: 'SysReq',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 155,
      name: {
        long: 'KC_CANCEL',
        short: 'KC_CANCEL',
      },
      label: 'Cancel',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 156,
      name: {
        long: 'KC_CLEAR',
        short: 'KC_CLR',
      },
      label: 'Clear',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 157,
      name: {
        long: 'KC_PRIOR',
        short: 'KC_PRIOR',
      },
      label: 'Prior',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 158,
      name: {
        long: 'KC_RETURN',
        short: 'KC_RETURN',
      },
      label: 'Return',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 159,
      name: {
        long: 'KC_SEPARATOR',
        short: 'KC_SEPARATOR',
      },
      label: 'Separator',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 160,
      name: {
        long: 'KC_OUT',
        short: 'KC_OUT',
      },
      label: 'Out',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 161,
      name: {
        long: 'KC_OPER',
        short: 'KC_OPER',
      },
      label: 'Oper',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 162,
      name: {
        long: 'KC_CLEAR_AGAIN',
        short: 'KC_CLEAR_AGAIN',
      },
      label: 'Clear/Again',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 163,
      name: {
        long: 'KC_CRSEL',
        short: 'KC_CRSEL',
      },
      label: 'CrSel/Props',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 164,
      name: {
        long: 'KC_EXSEL',
        short: 'KC_EXSEL',
      },
      label: 'ExSel',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 165,
      name: {
        long: 'KC_SYSTEM_POWER',
        short: 'KC_PWR',
      },
      label: 'System Power Down',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 166,
      name: {
        long: 'KC_SYSTEM_SLEEP',
        short: 'KC_SLEP',
      },
      label: 'Sleep',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 167,
      name: {
        long: 'KC_SYSTEM_WAKE',
        short: 'KC_WAKE',
      },
      label: 'Wake',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 168,
      name: {
        long: 'KC_AUDIO_MUTE',
        short: 'KC_MUTE',
      },
      label: 'Audio Mute',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 169,
      name: {
        long: 'KC_AUDIO_VOL_UP',
        short: 'KC_VOLU',
      },
      label: 'Audio Vol +',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 170,
      name: {
        long: 'KC_AUDIO_VOL_DOWN',
        short: 'KC_VOLD',
      },
      label: 'Audio Vol -',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 171,
      name: {
        long: 'KC_MEDIA_NEXT_TRACK',
        short: 'KC_MNXT',
      },
      label: 'Next',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 172,
      name: {
        long: 'KC_MEDIA_PREV_TRACK',
        short: 'KC_MPRV',
      },
      label: 'Previous',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 173,
      name: {
        long: 'KC_MEDIA_STOP',
        short: 'KC_MSTP',
      },
      label: 'Media Stop',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 174,
      name: {
        long: 'KC_MEDIA_PLAY_PAUSE',
        short: 'KC_MPLY',
      },
      label: 'Play',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 175,
      name: {
        long: 'KC_MEDIA_SELECT',
        short: 'KC_MSEL',
      },
      label: 'Select',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 176,
      name: {
        long: 'KC_MEDIA_EJECT',
        short: 'KC_EJCT',
      },
      label: 'Eject',
    },
  },
  {
    desc: 'Launch Mail',
    keycodeInfo: {
      code: 177,
      name: {
        long: 'KC_MAIL',
        short: 'KC_MAIL',
      },
      label: 'Mail',
    },
  },
  {
    desc: 'Launch Calculator',
    keycodeInfo: {
      code: 178,
      name: {
        long: 'KC_CALCULATOR',
        short: 'KC_CALC',
      },
      label: 'Calculator',
    },
  },
  {
    desc: 'Launch My Computer',
    keycodeInfo: {
      code: 179,
      name: {
        long: 'KC_MY_COMPUTER',
        short: 'KC_MYCM',
      },
      label: 'My Computer',
    },
  },
  {
    desc: 'Browser Search',
    keycodeInfo: {
      code: 180,
      name: {
        long: 'KC_WWW_SEARCH',
        short: 'KC_WSCH',
      },
      label: 'WWW Search',
    },
  },
  {
    desc: 'Browser Home',
    keycodeInfo: {
      code: 181,
      name: {
        long: 'KC_WWW_HOME',
        short: 'KC_WHOM',
      },
      label: 'WWW Home',
    },
  },
  {
    desc: 'Browser Back',
    keycodeInfo: {
      code: 182,
      name: {
        long: 'KC_WWW_BACK',
        short: 'KC_WBAK',
      },
      label: 'WWW Back',
    },
  },
  {
    desc: 'Browser Forward',
    keycodeInfo: {
      code: 183,
      name: {
        long: 'KC_WWW_FORWARD',
        short: 'KC_WFWD',
      },
      label: 'WWW Forward',
    },
  },
  {
    desc: 'Browser Stop',
    keycodeInfo: {
      code: 184,
      name: {
        long: 'KC_WWW_STOP',
        short: 'KC_WSTP',
      },
      label: 'WWW Stop',
    },
  },
  {
    desc: 'Browser Refresh',
    keycodeInfo: {
      code: 185,
      name: {
        long: 'KC_WWW_REFRESH',
        short: 'KC_WREF',
      },
      label: 'WWW Refresh',
    },
  },
  {
    desc: 'Browser Favorites',
    keycodeInfo: {
      code: 186,
      name: {
        long: 'KC_WWW_FAVORITES',
        short: 'KC_WFAV',
      },
      label: 'WWW Favorite',
    },
  },
  {
    desc: 'Next Track',
    keycodeInfo: {
      code: 187,
      name: {
        long: 'KC_MEDIA_FAST_FORWARD',
        short: 'KC_MFFD',
      },
      label: 'Fast Forward',
    },
  },
  {
    desc: 'Previous Track',
    keycodeInfo: {
      code: 188,
      name: {
        long: 'KC_MEDIA_REWIND',
        short: 'KC_MRWD',
      },
      label: 'Rewind',
    },
  },
  {
    desc: 'Brightness Up',
    keycodeInfo: {
      code: 189,
      name: {
        long: 'KC_BRIGHTNESS_UP',
        short: 'KC_BRIU',
      },
      label: 'Screen +',
    },
  },
  {
    desc: 'Brightness Down',
    keycodeInfo: {
      code: 190,
      name: {
        long: 'KC_BRIGHTNESS_DOWN',
        short: 'KC_BRID',
      },
      label: 'Screen -',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 192,
      name: {
        long: 'KC_FN0',
        short: 'KC_FN0',
      },
      label: 'Func0',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 193,
      name: {
        long: 'KC_FN1',
        short: 'KC_FN1',
      },
      label: 'Func1',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 194,
      name: {
        long: 'KC_FN2',
        short: 'KC_FN2',
      },
      label: 'Func2',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 195,
      name: {
        long: 'KC_FN3',
        short: 'KC_FN3',
      },
      label: 'Func3',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 196,
      name: {
        long: 'KC_FN4',
        short: 'KC_FN4',
      },
      label: 'Func4',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 197,
      name: {
        long: 'KC_FN5',
        short: 'KC_FN5',
      },
      label: 'Func5',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 198,
      name: {
        long: 'KC_FN6',
        short: 'KC_FN6',
      },
      label: 'Func6',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 199,
      name: {
        long: 'KC_FN7',
        short: 'KC_FN7',
      },
      label: 'Func7',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 200,
      name: {
        long: 'KC_FN8',
        short: 'KC_FN8',
      },
      label: 'Func8',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 201,
      name: {
        long: 'KC_FN9',
        short: 'KC_FN9',
      },
      label: 'Func9',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 202,
      name: {
        long: 'KC_FN10',
        short: 'KC_FN10',
      },
      label: 'Func10',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 203,
      name: {
        long: 'KC_FN11',
        short: 'KC_FN11',
      },
      label: 'Func11',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 204,
      name: {
        long: 'KC_FN12',
        short: 'KC_FN12',
      },
      label: 'Func12',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 205,
      name: {
        long: 'KC_FN13',
        short: 'KC_FN13',
      },
      label: 'Func13',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 206,
      name: {
        long: 'KC_FN14',
        short: 'KC_FN14',
      },
      label: 'Func14',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 207,
      name: {
        long: 'KC_FN15',
        short: 'KC_FN15',
      },
      label: 'Func15',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 208,
      name: {
        long: 'KC_FN16',
        short: 'KC_FN16',
      },
      label: 'Func16',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 209,
      name: {
        long: 'KC_FN17',
        short: 'KC_FN17',
      },
      label: 'Func17',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 210,
      name: {
        long: 'KC_FN18',
        short: 'KC_FN18',
      },
      label: 'Func18',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 211,
      name: {
        long: 'KC_FN19',
        short: 'KC_FN19',
      },
      label: 'Func19',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 212,
      name: {
        long: 'KC_FN20',
        short: 'KC_FN20',
      },
      label: 'Func20',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 213,
      name: {
        long: 'KC_FN21',
        short: 'KC_FN21',
      },
      label: 'Func21',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 214,
      name: {
        long: 'KC_FN22',
        short: 'KC_FN22',
      },
      label: 'Func22',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 215,
      name: {
        long: 'KC_FN23',
        short: 'KC_FN23',
      },
      label: 'Func23',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 216,
      name: {
        long: 'KC_FN24',
        short: 'KC_FN24',
      },
      label: 'Func24',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 217,
      name: {
        long: 'KC_FN25',
        short: 'KC_FN25',
      },
      label: 'Func25',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 218,
      name: {
        long: 'KC_FN26',
        short: 'KC_FN26',
      },
      label: 'Func26',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 219,
      name: {
        long: 'KC_FN27',
        short: 'KC_FN27',
      },
      label: 'Func27',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 220,
      name: {
        long: 'KC_FN28',
        short: 'KC_FN28',
      },
      label: 'Func28',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 221,
      name: {
        long: 'KC_FN29',
        short: 'KC_FN29',
      },
      label: 'Func29',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 222,
      name: {
        long: 'KC_FN30',
        short: 'KC_FN30',
      },
      label: 'Func30',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 223,
      name: {
        long: 'KC_FN31',
        short: 'KC_FN31',
      },
      label: 'Func31',
    },
  },
  {
    desc: 'Left Ctrl',
    keycodeInfo: {
      code: 224,
      name: {
        long: 'KC_LCTRL',
        short: 'KC_LCTL',
      },
      label: '*Ctrl',
    },
  },
  {
    desc: 'Left Shift',
    keycodeInfo: {
      code: 225,
      name: {
        long: 'KC_LSHIFT',
        short: 'KC_LSFT',
      },
      label: '*Shift',
    },
  },
  {
    desc: 'Left Alt',
    keycodeInfo: {
      code: 226,
      name: {
        long: 'KC_LALT',
        short: 'KC_LOPT',
      },
      label: '*Alt',
    },
  },
  {
    desc: 'Left GUI (Windows/Command/Meta key)',
    keycodeInfo: {
      code: 227,
      name: {
        long: 'KC_LGUI',
        short: 'KC_LWIN',
      },
      label: '*Win',
    },
  },
  {
    desc: 'Right Ctrl',
    keycodeInfo: {
      code: 228,
      name: {
        long: 'KC_RCTRL',
        short: 'KC_RCTL',
      },
      label: 'Ctrl*',
    },
  },
  {
    desc: 'Right Shift',
    keycodeInfo: {
      code: 229,
      name: {
        long: 'KC_RSHIFT',
        short: 'KC_RSFT',
      },
      label: 'Shift*',
    },
  },
  {
    desc: 'Right Alt',
    keycodeInfo: {
      code: 230,
      name: {
        long: 'KC_RALT',
        short: 'KC_ROPT',
      },
      label: 'Alt*',
    },
  },
  {
    desc: 'Right GUI (Windows/Command/Meta key)',
    keycodeInfo: {
      code: 231,
      name: {
        long: 'KC_RGUI',
        short: 'KC_RWIN',
      },
      label: 'Win*',
    },
  },
  {
    desc: 'Mouse Cursor Up',
    keycodeInfo: {
      code: 240,
      name: {
        long: 'KC_MS_UP,',
        short: 'KC_MS_UP,',
      },
      label: 'Mouse ↑',
    },
  },
  {
    desc: 'Mouse Cursor Down',
    keycodeInfo: {
      code: 241,
      name: {
        long: 'KC_MS_DOWN',
        short: 'KC_MS_D',
      },
      label: 'Mouse ↓',
    },
  },
  {
    desc: 'Mouse Cursor Left',
    keycodeInfo: {
      code: 242,
      name: {
        long: 'KC_MS_LEFT',
        short: 'KC_MS_L',
      },
      label: 'Mouse ←',
    },
  },
  {
    desc: 'Mouse Cursor Right',
    keycodeInfo: {
      code: 243,
      name: {
        long: 'KC_MS_RIGHT',
        short: 'KC_MS_R',
      },
      label: 'Mouse →',
    },
  },
  {
    desc: 'Mouse Button 1',
    keycodeInfo: {
      code: 244,
      name: {
        long: 'KC_MS_BTN1',
        short: 'KC_BTN1',
      },
      label: 'Mouse Btn1',
    },
  },
  {
    desc: 'Mouse Button 2',
    keycodeInfo: {
      code: 245,
      name: {
        long: 'KC_MS_BTN2',
        short: 'KC_BTN2',
      },
      label: 'Mouse Btn2',
    },
  },
  {
    desc: 'Mouse Button 3',
    keycodeInfo: {
      code: 246,
      name: {
        long: 'KC_MS_BTN3',
        short: 'KC_BTN3',
      },
      label: 'Mouse Btn3',
    },
  },
  {
    desc: 'Mouse Button 4',
    keycodeInfo: {
      code: 247,
      name: {
        long: 'KC_MS_BTN4',
        short: 'KC_BTN4',
      },
      label: 'Mouse Btn4',
    },
  },
  {
    desc: 'Mouse Button 5',
    keycodeInfo: {
      code: 248,
      name: {
        long: 'KC_MS_BTN5',
        short: 'KC_BTN5',
      },
      label: 'Mouse Btn5',
    },
  },
  {
    desc: 'Mouse Wheel Up',
    keycodeInfo: {
      code: 249,
      name: {
        long: 'KC_MS_WH_UP',
        short: 'KC_WH_U',
      },
      label: 'Mouse Wh ↑',
    },
  },
  {
    desc: 'Mouse Wheel Down',
    keycodeInfo: {
      code: 250,
      name: {
        long: 'KC_MS_WH_DOWN',
        short: 'KC_WH_D',
      },
      label: 'Mouse Wh ↓',
    },
  },
  {
    desc: 'Mouse Wheel Left',
    keycodeInfo: {
      code: 251,
      name: {
        long: 'KC_MS_WH_LEFT',
        short: 'KC_WH_L',
      },
      label: 'Mouse Wh ←',
    },
  },
  {
    desc: 'Mouse Wheel Right',
    keycodeInfo: {
      code: 252,
      name: {
        long: 'KC_MS_WH_RIGHT',
        short: 'KC_WH_R',
      },
      label: 'Mouse Wh →',
    },
  },
  {
    desc: 'Set mouse acceleration to 0',
    keycodeInfo: {
      code: 253,
      name: {
        long: 'KC_MS_ACCEL0',
        short: 'KC_ACL0',
      },
      label: 'Mouse Acc0',
    },
  },
  {
    desc: 'Set mouse acceleration to 1',
    keycodeInfo: {
      code: 254,
      name: {
        long: 'KC_MS_ACCEL1',
        short: 'KC_ACL1',
      },
      label: 'Mouse Acc1',
    },
  },
  {
    desc: 'Set mouse acceleration to 2',
    keycodeInfo: {
      code: 255,
      name: {
        long: 'KC_MS_ACCEL2',
        short: 'KC_ACL2',
      },
      label: 'Mouse Acc2',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 542,
      name: {
        long: 'KC_EXCLAIM',
        short: 'KC_EXLM',
      },
      label: '!',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 543,
      name: {
        long: 'KC_AT',
        short: 'KC_AT',
      },
      label: '@',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 544,
      name: {
        long: 'KC_HASH',
        short: 'KC_HASH',
      },
      label: '#',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 545,
      name: {
        long: 'KC_DOLLAR',
        short: 'KC_DLR',
      },
      label: '$',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 546,
      name: {
        long: 'KC_PERCENT',
        short: 'KC_PERC',
      },
      label: '%',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 547,
      name: {
        long: 'KC_CIRCUMFLEX',
        short: 'KC_CIRC',
      },
      label: '^',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 548,
      name: {
        long: 'KC_AMPERSAND',
        short: 'KC_AMPR',
      },
      label: '&',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 549,
      name: {
        long: 'KC_ASTERISK',
        short: 'KC_ASTR',
      },
      label: '*',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 550,
      name: {
        long: 'KC_LEFT_PAREN',
        short: 'KC_LPRN',
      },
      label: '(',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 551,
      name: {
        long: 'KC_RIGHT_PAREN',
        short: 'KC_RPRN',
      },
      label: ')',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 557,
      name: {
        long: 'KC_UNDERSCORE',
        short: 'KC_UNDS',
      },
      label: '_',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 558,
      name: {
        long: 'KC_PLUS',
        short: 'KC_PLUS',
      },
      label: '+',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 559,
      name: {
        long: 'KC_LEFT_CURLY_BRACE',
        short: 'KC_LCBR',
      },
      label: '{',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 560,
      name: {
        long: 'KC_RIGHT_CURLY_BRACE',
        short: 'KC_RCBR',
      },
      label: '}',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 561,
      name: {
        long: 'KC_PIPE',
        short: 'KC_PIPE',
      },
      label: '|',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 563,
      name: {
        long: 'KC_COLON',
        short: 'KC_COLN',
      },
      label: ':',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 564,
      name: {
        long: 'KC_DOUBLE_QUOTE',
        short: 'KC_DQT',
      },
      label: '"',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 565,
      name: {
        long: 'KC_TILDE',
        short: 'KC_TILD',
      },
      label: '~',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 566,
      name: {
        long: 'KC_LEFT_ANGLE_BRACKET',
        short: 'KC_LABK',
      },
      label: '<',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 567,
      name: {
        long: 'KC_RIGHT_ANGLE_BRACKET',
        short: 'KC_RABK',
      },
      label: '>',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 568,
      name: {
        long: 'KC_QUESTION',
        short: 'KC_QUES',
      },
      label: '?',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 16684,
      name: {
        long: 'SPACE_FN1',
        short: 'SPC_FN1',
      },
      label: 'Space Fn1',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 16940,
      name: {
        long: 'SPACE_FN2',
        short: 'SPC_FN2',
      },
      label: 'Space Fn2',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 17196,
      name: {
        long: 'SPACE_FN3',
        short: 'SPC_FN3',
      },
      label: 'Space Fn3',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20496,
      name: {
        long: 'TO(0)',
        short: 'TO(0)',
      },
      label: 'TO(0)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20497,
      name: {
        long: 'TO(1)',
        short: 'TO(1)',
      },
      label: 'TO(1)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20498,
      name: {
        long: 'TO(2)',
        short: 'TO(2)',
      },
      label: 'TO(2)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20499,
      name: {
        long: 'TO(3)',
        short: 'TO(3)',
      },
      label: 'TO(3)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20500,
      name: {
        long: 'TO(4)',
        short: 'TO(4)',
      },
      label: 'TO(4)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20501,
      name: {
        long: 'TO(5)',
        short: 'TO(5)',
      },
      label: 'TO(5)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20502,
      name: {
        long: 'TO(6)',
        short: 'TO(6)',
      },
      label: 'TO(6)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20503,
      name: {
        long: 'TO(7)',
        short: 'TO(7)',
      },
      label: 'TO(7)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20736,
      name: {
        long: 'MO(0)',
        short: 'MO(0)',
      },
      label: 'MO(0)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20737,
      name: {
        long: 'MO(1)',
        short: 'MO(1)',
      },
      label: 'MO(1)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20738,
      name: {
        long: 'MO(2)',
        short: 'MO(2)',
      },
      label: 'MO(2)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20739,
      name: {
        long: 'MO(3)',
        short: 'MO(3)',
      },
      label: 'MO(3)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20740,
      name: {
        long: 'MO(4)',
        short: 'MO(4)',
      },
      label: 'MO(4)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20741,
      name: {
        long: 'MO(5)',
        short: 'MO(5)',
      },
      label: 'MO(5)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20742,
      name: {
        long: 'MO(6)',
        short: 'MO(6)',
      },
      label: 'MO(6)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 20743,
      name: {
        long: 'MO(7)',
        short: 'MO(7)',
      },
      label: 'MO(7)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21248,
      name: {
        long: 'TG(0)',
        short: 'TG(0)',
      },
      label: 'TG(0)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21249,
      name: {
        long: 'TG(1)',
        short: 'TG(1)',
      },
      label: 'TG(1)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21250,
      name: {
        long: 'TG(2)',
        short: 'TG(2)',
      },
      label: 'TG(2)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21251,
      name: {
        long: 'TG(3)',
        short: 'TG(3)',
      },
      label: 'TG(3)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21252,
      name: {
        long: 'TG(4)',
        short: 'TG(4)',
      },
      label: 'TG(4)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21253,
      name: {
        long: 'TG(5)',
        short: 'TG(5)',
      },
      label: 'TG(5)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21254,
      name: {
        long: 'TG(6)',
        short: 'TG(6)',
      },
      label: 'TG(6)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21255,
      name: {
        long: 'TG(7)',
        short: 'TG(7)',
      },
      label: 'TG(7)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21504,
      name: {
        long: 'OSL(0)',
        short: 'OSL(0)',
      },
      label: 'OSL(0)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21505,
      name: {
        long: 'OSL(1)',
        short: 'OSL(1)',
      },
      label: 'OSL(1)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21506,
      name: {
        long: 'OSL(2)',
        short: 'OSL(2)',
      },
      label: 'OSL(2)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21507,
      name: {
        long: 'OSL(3)',
        short: 'OSL(3)',
      },
      label: 'OSL(3)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21508,
      name: {
        long: 'OSL(4)',
        short: 'OSL(4)',
      },
      label: 'OSL(4)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21509,
      name: {
        long: 'OSL(5)',
        short: 'OSL(5)',
      },
      label: 'OSL(5)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21510,
      name: {
        long: 'OSL(6)',
        short: 'OSL(6)',
      },
      label: 'OSL(6)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 21511,
      name: {
        long: 'OSL(7)',
        short: 'OSL(7)',
      },
      label: 'OSL(7)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 22528,
      name: {
        long: 'TT(0)',
        short: 'TT(0)',
      },
      label: 'TT(0)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 22529,
      name: {
        long: 'TT(1)',
        short: 'TT(1)',
      },
      label: 'TT(1)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 22530,
      name: {
        long: 'TT(2)',
        short: 'TT(2)',
      },
      label: 'TT(2)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 22531,
      name: {
        long: 'TT(3)',
        short: 'TT(3)',
      },
      label: 'TT(3)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 22532,
      name: {
        long: 'TT(4)',
        short: 'TT(4)',
      },
      label: 'TT(4)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 22533,
      name: {
        long: 'TT(5)',
        short: 'TT(5)',
      },
      label: 'TT(5)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 22534,
      name: {
        long: 'TT(6)',
        short: 'TT(6)',
      },
      label: 'TT(6)',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 22535,
      name: {
        long: 'TT(7)',
        short: 'TT(7)',
      },
      label: 'TT(7)',
    },
  },
  {
    desc: 'Put the keyboard into bootloader mode for flashing.',
    keycodeInfo: {
      code: 23552,
      name: {
        long: 'RESET',
        short: 'RESET',
      },
      label: 'Reset',
    },
  },
  {
    desc: 'Toggle debug mode.',
    keycodeInfo: {
      code: 23553,
      name: {
        long: 'DEBUG',
        short: 'DEBUG',
      },
      label: 'Debug',
    },
  },
  {
    desc: 'Swap Caps Lock and Left Control.',
    keycodeInfo: {
      code: 23554,
      name: {
        long: 'MAGIC_SWAP_CONTROL_CAPSLOCK',
        short: 'CL_SWAP',
      },
      label: 'CL SWAP',
    },
  },
  {
    desc: 'Treat Caps Lock as Control.',
    keycodeInfo: {
      code: 23555,
      name: {
        long: 'MAGIC_CAPSLOCK_TO_CONTROL',
        short: 'CL_CTRL',
      },
      label: 'CL CTRL',
    },
  },
  {
    desc: 'Swap Left Alt and GUI.',
    keycodeInfo: {
      code: 23556,
      name: {
        long: 'MAGIC_SWAP_LALT_LGUI',
        short: 'LAG_SWP',
      },
      label: 'LAG SWP',
    },
  },
  {
    desc: 'Swap Right Alt and GUI.',
    keycodeInfo: {
      code: 23557,
      name: {
        long: 'MAGIC_SWAP_RALT_RGUI',
        short: 'RAG_SWP',
      },
      label: 'RAG SWP',
    },
  },

  {
    desc: 'Disable the GUI keys.',
    keycodeInfo: {
      code: 23558,
      name: {
        long: 'MAGIC_NO_GUI',
        short: 'GUI_OFF',
      },
      label: 'GUI OFF',
    },
  },

  {
    desc: 'Swap ` and Escape.',
    keycodeInfo: {
      code: 23559,
      name: {
        long: 'MAGIC_SWAP_GRAVE_ESC',
        short: 'GE_SWAP',
      },
      label: 'GE SWAP',
    },
  },
  {
    desc: 'Swap  and Backspace.',
    keycodeInfo: {
      code: 23560,
      name: {
        long: 'MAGIC_SWAP_BACKSLASH_BACKSPACE',
        short: 'BS_SWAP',
      },
      label: 'BS SWAP',
    },
  },
  {
    desc: 'Enable N-key rollover.',
    keycodeInfo: {
      code: 23561,
      name: {
        long: 'MAGIC_HOST_NKRO',
        short: 'NK_ON',
      },
      label: 'NK ON',
    },
  },
  {
    desc: 'Swap Alt and Win/Cmd on both sides.',
    keycodeInfo: {
      code: 23562,
      name: {
        long: 'MAGIC_SWAP_ALT_GUI',
        short: 'AG_SWAP',
      },
      label: 'AG SWAP',
    },
  },
  {
    desc: 'Unswap Caps Lock and Left Control.',
    keycodeInfo: {
      code: 23563,
      name: {
        long: 'MAGIC_UNSWAP_CONTROL_CAPSLOCK',
        short: 'CL_NORM',
      },
      label: 'CL NORM',
    },
  },

  {
    desc: 'Stop treating Caps Lock as Control.',
    keycodeInfo: {
      code: 23564,
      name: {
        long: 'MAGIC_UNCAPSLOCK_TO_CONTROL',
        short: 'CL_CAPS',
      },
      label: 'CL CAPS',
    },
  },

  {
    desc: 'Unswap Left Alt and Win/Cmd.',
    keycodeInfo: {
      code: 23565,
      name: {
        long: 'MAGIC_UNSWAP_LALT_LGUI',
        short: 'LAG_NRM',
      },
      label: 'LAG NRM',
    },
  },

  {
    desc: 'Unswap Right Alt and Win/Cmd.',
    keycodeInfo: {
      code: 23566,
      name: {
        long: 'MAGIC_UNSWAP_RALT_RGUI',
        short: 'RAG_NRM',
      },
      label: 'RAG NRM',
    },
  },
  {
    desc: 'Enable the Win/Cmd keys.',
    keycodeInfo: {
      code: 23567,
      name: {
        long: 'MAGIC_UNNO_GUI',
        short: 'GUI_ON',
      },
      label: 'GUI ON',
    },
  },

  {
    desc: 'Unswap ` and Escape.',
    keycodeInfo: {
      code: 23568,
      name: {
        long: 'MAGIC_SWAP_GRAVE_ESC',
        short: 'GE_SWAP',
      },
      label: 'GE NORM',
    },
  },

  {
    desc: 'Unswap  and Backspace.',
    keycodeInfo: {
      code: 23569,
      name: {
        long: 'MAGIC_UNSWAP_BACKSLASH_BACKSPACE',
        short: 'BS_NORM',
      },
      label: 'BS NORM',
    },
  },
  {
    desc: 'Disable N-key rollover.',
    keycodeInfo: {
      code: 23570,
      name: {
        long: 'MAGIC_UNHOST_NKRO',
        short: 'NK_OFF',
      },
      label: 'NK OFF',
    },
  },
  {
    desc: 'Unswap Alt and GUI on both sides.',
    keycodeInfo: {
      code: 23571,
      name: {
        long: 'MAGIC_UNSWAP_ALT_GUI',
        short: 'AG_NORM',
      },
      label: 'AG NORM',
    },
  },
  {
    desc: 'Toggle N-key rollover.',
    keycodeInfo: {
      code: 23572,
      name: {
        long: 'MAGIC_TOGGLE_NKRO',
        short: 'NK_TOGG',
      },
      label: 'NK TOGG',
    },
  },
  {
    desc: 'Toggle Alt and Win/Cmd swap on both sides.',
    keycodeInfo: {
      code: 23573,
      name: {
        long: 'MAGIC_TOGGLE_ALT_GUI',
        short: 'AG_TOGG',
      },
      label: 'AG TOGG',
    },
  },
  {
    desc: 'Share the grave key (` and ~) with Escape.',
    keycodeInfo: {
      code: 23574,
      name: {
        long: 'GRAVE_ESC',
        short: 'KC_GESC',
      },
      label: 'Esc `',
    },
  },
  {
    desc: 'Audio mode on.',
    keycodeInfo: {
      code: 23581,
      name: {
        long: 'AU_ON',
        short: 'AU_ON',
      },
      label: 'Audio On',
    },
  },
  {
    desc: 'Audio mode off.',
    keycodeInfo: {
      code: 23582,
      name: {
        long: 'AU_OFF',
        short: 'AU_OFF',
      },
      label: 'Audio Off',
    },
  },
  {
    desc: 'Toggles Audio mode.',
    keycodeInfo: {
      code: 23583,
      name: {
        long: 'AU_TOG',
        short: 'AU_TOG',
      },
      label: 'Audio Toggle',
    },
  },
  {
    desc: 'Toggles Audio clicky mode.',
    keycodeInfo: {
      code: 23584,
      name: {
        long: 'CLICKY_TOGGLE',
        short: 'CLICKY_TOGGLE',
      },
      label: 'Clicky Toggle',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 23585,
      name: {
        long: 'CLICKY_ENABLE',
        short: 'CLICKY_ENABLE',
      },
      label: 'Clicky Enable',
    },
  },
  {
    desc: '',
    keycodeInfo: {
      code: 23586,
      name: {
        long: 'CLICKY_DISABLE',
        short: 'CLICKY_DISABLE',
      },
      label: 'Clicky Disable',
    },
  },
  {
    desc: 'Increases frequency of the clicks.',
    keycodeInfo: {
      code: 23587,
      name: {
        long: 'CLICKY_UP',
        short: 'CLICKY_UP',
      },
      label: 'Clicky Up',
    },
  },
  {
    desc: 'Decreases frequency of the clicks.',
    keycodeInfo: {
      code: 23588,
      name: {
        long: 'CLICKY_DOWN',
        short: 'CLICKY_DOWN',
      },
      label: 'Clicky Down',
    },
  },
  {
    desc: 'Resets frequency to default.',
    keycodeInfo: {
      code: 23589,
      name: {
        long: 'CLICKY_RESET',
        short: 'CLICKY_RESET',
      },
      label: 'Clicky Reset',
    },
  },
  {
    desc: 'Turn music mode on.',
    keycodeInfo: {
      code: 23590,
      name: {
        long: 'MU_ON',
        short: 'MU_ON',
      },
      label: 'Music On',
    },
  },
  {
    desc: 'Music Toggle.',
    keycodeInfo: {
      code: 23591,
      name: {
        long: 'MU_OFF',
        short: 'MU_OFF',
      },
      label: 'Music Off',
    },
  },
  {
    desc: 'Toggle music mode.',
    keycodeInfo: {
      code: 23592,
      name: {
        long: 'MU_TOG',
        short: 'MU_TOG',
      },
      label: 'Music Toggle',
    },
  },
  {
    desc: 'Cycle through the music modes.',
    keycodeInfo: {
      code: 23593,
      name: {
        long: 'MU_MOD',
        short: 'MU_MOD',
      },
      label: 'Music Mode',
    },
  },

  {
    desc: 'Set the backlight to max brightness.',
    keycodeInfo: {
      code: 23740,
      name: {
        long: 'BL_ON',
        short: 'BL_ON',
      },
      label: 'BL On',
    },
  },

  {
    desc: 'Turn the backlight off.',
    keycodeInfo: {
      code: 23741,
      name: {
        long: 'BL_OFF',
        short: 'BL_OFF',
      },
      label: 'BL Off',
    },
  },

  {
    desc: 'Decrease the backlight level.',
    keycodeInfo: {
      code: 23742,
      name: {
        long: 'BL_DEC',
        short: 'BL_DEC',
      },
      label: 'BL -',
    },
  },

  {
    desc: 'Increase the backlight level.',
    keycodeInfo: {
      code: 23743,
      name: {
        long: 'BL_INC',
        short: 'BL_INC',
      },
      label: 'BL +',
    },
  },

  {
    desc: 'Turn the backlight on or off.',
    keycodeInfo: {
      code: 23744,
      name: {
        long: 'BL_TOGG',
        short: 'BL_TOGG',
      },
      label: 'BL Toggle',
    },
  },

  {
    desc: 'Cycle through backlight levels.',
    keycodeInfo: {
      code: 23745,
      name: {
        long: 'BL_STEP',
        short: 'BL_STEP',
      },
      label: 'BL Cycle',
    },
  },

  {
    desc: 'Toggle backlight breathing',
    keycodeInfo: {
      code: 23746,
      name: {
        long: 'BL_BRTG',
        short: 'BL_BRTG',
      },
      label: 'BR Toggle',
    },
  },

  {
    desc: 'Toggle RGB lighting on or off.',
    keycodeInfo: {
      code: 23747,
      name: {
        long: 'RGB_TOG',
        short: 'RGB_TOG',
      },
      label: 'RGB Toggle',
    },
  },

  {
    desc: 'Cycle through modes, reverse direction when Shift is held.',
    keycodeInfo: {
      code: 23748,
      name: {
        long: 'RGB_MODE_FORWARD',
        short: 'RGB_MODE_FORWARD',
      },
      label: 'RGB Mode +',
    },
  },

  {
    desc:
      'Cycle through modes in reverse, forward direction when Shift is held.',
    keycodeInfo: {
      code: 23749,
      name: {
        long: 'RGB_MODE_REVERSE',
        short: 'RGB_MODE_REVERSE',
      },
      label: 'RGB Mode -',
    },
  },

  {
    desc: 'Increase hue, decrease hue when Shift is held.',
    keycodeInfo: {
      code: 23750,
      name: {
        long: 'RGB_HUI',
        short: 'RGB_HUI',
      },
      label: 'Hue +',
    },
  },

  {
    desc: 'Decrease hue, increase hue when Shift is held.',
    keycodeInfo: {
      code: 23751,
      name: {
        long: 'RGB_HUD',
        short: 'RGB_HUD',
      },
      label: 'Hue -',
    },
  },

  {
    desc: 'Increase saturation, decrease saturation when Shift is held.',
    keycodeInfo: {
      code: 23752,
      name: {
        long: 'RGB_SAI',
        short: 'RGB_SAI',
      },
      label: 'Sat +',
    },
  },

  {
    desc: 'Decrease saturation, increase saturation when Shift is held.',
    keycodeInfo: {
      code: 23753,
      name: {
        long: 'RGB_SAD',
        short: 'RGB_SAD',
      },
      label: 'Sat -',
    },
  },

  {
    desc: 'Increase value (brightness), decrease value when Shift is held.',
    keycodeInfo: {
      code: 23754,
      name: {
        long: 'RGB_VAI',
        short: 'RGB_VAI',
      },
      label: 'Bright +',
    },
  },

  {
    desc: 'Decrease value (brightness), increase value when Shift is held.',
    keycodeInfo: {
      code: 23755,
      name: {
        long: 'RGB_VAD',
        short: 'RGB_VAD',
      },
      label: 'Bright -',
    },
  },

  {
    desc:
      'Increase effect speed (does not support eeprom yet), decrease speed when Shift is held.',
    keycodeInfo: {
      code: 23756,
      name: {
        long: 'RGB_SPI',
        short: 'RGB_SPI',
      },
      label: 'Effect Speed +',
    },
  },

  {
    desc:
      'Decrease effect speed (does not support eeprom yet), increase speed when Shift is held.',
    keycodeInfo: {
      code: 23757,
      name: {
        long: 'RGB_SPD',
        short: 'RGB_SPD',
      },
      label: 'Effect Speed -',
    },
  },

  {
    desc: 'Static (no animation) mode.',
    keycodeInfo: {
      code: 23758,
      name: {
        long: 'RGB_MODE_PLAIN',
        short: 'RGB_MODE_PLAIN',
      },
      label: 'RGB Mode P',
    },
  },

  {
    desc: 'Breathing animation mode.',
    keycodeInfo: {
      code: 23759,
      name: {
        long: 'RGB_MODE_BREATHE',
        short: 'RGB_MODE_BREATHE',
      },
      label: 'RGB Mode B',
    },
  },

  {
    desc: 'Rainbow animation mode.',
    keycodeInfo: {
      code: 23760,
      name: {
        long: 'RGB_MODE_RAINBOW',
        short: 'RGB_MODE_RAINBOW',
      },
      label: 'RGB Mode R',
    },
  },

  {
    desc: 'Swirl animation mode.',
    keycodeInfo: {
      code: 23761,
      name: {
        long: 'RGB_MODE_SWIRL',
        short: 'RGB_MODE_SWIRL',
      },
      label: 'RGB Mode SW',
    },
  },

  {
    desc: 'Snake animation mode.',
    keycodeInfo: {
      code: 23762,
      name: {
        long: 'RGB_MODE_SNAKE',
        short: 'RGB_MODE_SNAKE',
      },
      label: 'RGB Mode SN',
    },
  },

  {
    desc: '"Knight Rider" animation mode.',
    keycodeInfo: {
      code: 23763,
      name: {
        long: 'RGB_MODE_KNIGHT',
        short: 'RGB_MODE_KNIGHT',
      },
      label: 'RGB Mode K',
    },
  },

  {
    desc: 'Christmas animation mode.',
    keycodeInfo: {
      code: 23764,
      name: {
        long: 'RGB_MODE_XMAS',
        short: 'RGB_MODE_XMAS',
      },
      label: 'RGB Mode X',
    },
  },

  {
    desc: 'Static gradient animation mode.',
    keycodeInfo: {
      code: 23765,
      name: {
        long: 'RGB_MODE_GRADIENT',
        short: 'RGB_MODE_GRADIENT',
      },
      label: 'RGB Mode G',
    },
  },

  {
    desc: 'Left Shift when held, ( when tapped.',
    keycodeInfo: {
      code: 23767,
      name: {
        long: 'KC_LSPO',
        short: 'KC_LSPO',
      },
      label: 'LS (',
    },
  },

  {
    desc: 'Right Shift when held, ) when tapped.',
    keycodeInfo: {
      code: 23768,
      name: {
        long: 'KC_RSPC',
        short: 'KC_RSPC',
      },
      label: 'RS )',
    },
  },

  {
    desc: 'Right Shift when held, Enter when tapped.',
    keycodeInfo: {
      code: 23769,
      name: {
        long: 'KC_SFTENT',
        short: 'KC_SFTENT',
      },
      label: 'SftEnt',
    },
  },

  {
    desc: "Reinitializes the keyboard's EEPROM (persistent memory)",
    keycodeInfo: {
      code: 23774,
      name: {
        long: 'EEPROM_RESET',
        short: 'EEP_RST',
      },
      label: 'EEPROM RESET',
    },
  },

  {
    desc: 'Left Control when held, ( when tapped',
    keycodeInfo: {
      code: 23795,
      name: {
        long: 'KC_LCPO',
        short: 'KC_LCPO',
      },
      label: 'LC (',
    },
  },

  {
    desc: 'Right Control when held, ) when tapped.',
    keycodeInfo: {
      code: 23796,
      name: {
        long: 'KC_RCPC',
        short: 'KC_RCPC',
      },
      label: 'RC )',
    },
  },

  {
    desc: 'Left Alt when held, ( when tapped.',
    keycodeInfo: {
      code: 23797,
      name: {
        long: 'KC_LAPO',
        short: 'KC_LAPO',
      },
      label: 'LA (',
    },
  },

  {
    desc: 'Right Alt when held, ) when tapped.',
    keycodeInfo: {
      code: 23798,
      name: {
        long: 'KC_RAPC',
        short: 'KC_RAPC',
      },
      label: 'RA )',
    },
  },

  {
    desc: '',
    keycodeInfo: {
      code: 24336,
      name: {
        long: 'FN_MO13',
        short: 'FN_MO13',
      },
      label: 'Fn1 (Fn3)',
    },
  },

  {
    desc: '',
    keycodeInfo: {
      code: 24337,
      name: {
        long: 'FN_MO23',
        short: 'FN_MO23',
      },
      label: 'Fn2 (Fn3)',
    },
  },

  {
    desc: 'Macro 0',
    keycodeInfo: {
      code: 24338,
      name: {
        long: 'MACRO00',
        short: 'M0',
      },
      label: 'M0',
    },
  },

  {
    desc: 'Macro 1',
    keycodeInfo: {
      code: 24339,
      name: {
        long: 'MACRO01',
        short: 'M1',
      },
      label: 'M1',
    },
  },

  {
    desc: 'Macro 2',
    keycodeInfo: {
      code: 24340,
      name: {
        long: 'MACRO02',
        short: 'M2',
      },
      label: 'M2',
    },
  },

  {
    desc: 'Macro 3',
    keycodeInfo: {
      code: 24341,
      name: {
        long: 'MACRO03',
        short: 'M3',
      },
      label: 'M3',
    },
  },

  {
    desc: 'Macro 4',
    keycodeInfo: {
      code: 24342,
      name: {
        long: 'MACRO04',
        short: 'M4',
      },
      label: 'M4',
    },
  },

  {
    desc: 'Macro 5',
    keycodeInfo: {
      code: 24343,
      name: {
        long: 'MACRO05',
        short: 'M5',
      },
      label: 'M5',
    },
  },

  {
    desc: 'Macro 6',
    keycodeInfo: {
      code: 24344,
      name: {
        long: 'MACRO06',
        short: 'M6',
      },
      label: 'M6',
    },
  },

  {
    desc: 'Macro 7',
    keycodeInfo: {
      code: 24345,
      name: {
        long: 'MACRO07',
        short: 'M7',
      },
      label: 'M7',
    },
  },

  {
    desc: 'Macro 8',
    keycodeInfo: {
      code: 24346,
      name: {
        long: 'MACRO08',
        short: 'M8',
      },
      label: 'M8',
    },
  },

  {
    desc: 'Macro 9',
    keycodeInfo: {
      code: 24347,
      name: {
        long: 'MACRO09',
        short: 'M9',
      },
      label: 'M9',
    },
  },

  {
    desc: 'Macro 10',
    keycodeInfo: {
      code: 24348,
      name: {
        long: 'MACRO10',
        short: 'M10',
      },
      label: 'M10',
    },
  },

  {
    desc: 'Macro 11',
    keycodeInfo: {
      code: 24349,
      name: {
        long: 'MACRO11',
        short: 'M11',
      },
      label: 'M11',
    },
  },

  {
    desc: 'Macro 12',
    keycodeInfo: {
      code: 24350,
      name: {
        long: 'MACRO12',
        short: 'M12',
      },
      label: 'M12',
    },
  },

  {
    desc: 'Macro 13',
    keycodeInfo: {
      code: 24351,
      name: {
        long: 'MACRO13',
        short: 'M13',
      },
      label: 'M13',
    },
  },

  {
    desc: 'Macro 14',
    keycodeInfo: {
      code: 24352,
      name: {
        long: 'MACRO14',
        short: 'M14',
      },
      label: 'M14',
    },
  },

  {
    desc: 'Macro 15',
    keycodeInfo: {
      code: 24353,
      name: {
        long: 'MACRO15',
        short: 'M15',
      },
      label: 'M15',
    },
  },
];
