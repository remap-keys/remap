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
      label: ' ',
      name: {
        long: 'KC_NO',
        short: 'XXXXXXX',
      },
      keywords: ['no', 'noop', 'ignore'],
    },
  },
  {
    desc: 'Use the next lowest non-transparent key',
    keycodeInfo: {
      code: 1,
      label: '▽',
      name: {
        long: 'KC_TRANSPARENT',
        short: '_______',
      },
      keywords: ['transparent', 'trns'],
    },
  },
  {
    desc: 'a and A',
    keycodeInfo: {
      code: 4,
      label: 'A',
      name: {
        long: 'KC_A',
        short: 'KC_A',
      },
      keywords: [],
      ascii: 97,
    },
  },
  {
    desc: 'b and B',
    keycodeInfo: {
      code: 5,
      label: 'B',
      name: {
        long: 'KC_B',
        short: 'KC_B',
      },
      keywords: [],
      ascii: 98,
    },
  },
  {
    desc: 'c and C',
    keycodeInfo: {
      code: 6,
      label: 'C',
      name: {
        long: 'KC_C',
        short: 'KC_C',
      },
      keywords: [],
      ascii: 99,
    },
  },
  {
    desc: 'd and D',
    keycodeInfo: {
      code: 7,
      label: 'D',
      name: {
        long: 'KC_D',
        short: 'KC_D',
      },
      keywords: [],
      ascii: 100,
    },
  },
  {
    desc: 'e and E',
    keycodeInfo: {
      code: 8,
      label: 'E',
      name: {
        long: 'KC_E',
        short: 'KC_E',
      },
      keywords: [],
      ascii: 101,
    },
  },
  {
    desc: 'f and F',
    keycodeInfo: {
      code: 9,
      label: 'F',
      name: {
        long: 'KC_F',
        short: 'KC_F',
      },
      keywords: [],
      ascii: 102,
    },
  },
  {
    desc: 'g and G',
    keycodeInfo: {
      code: 10,
      label: 'G',
      name: {
        long: 'KC_G',
        short: 'KC_G',
      },
      keywords: [],
      ascii: 103,
    },
  },
  {
    desc: 'h and H',
    keycodeInfo: {
      code: 11,
      label: 'H',
      name: {
        long: 'KC_H',
        short: 'KC_H',
      },
      keywords: [],
      ascii: 104,
    },
  },
  {
    desc: 'i and I',
    keycodeInfo: {
      code: 12,
      label: 'I',
      name: {
        long: 'KC_I',
        short: 'KC_I',
      },
      keywords: [],
      ascii: 105,
    },
  },
  {
    desc: 'j and J',
    keycodeInfo: {
      code: 13,
      label: 'J',
      name: {
        long: 'KC_J',
        short: 'KC_J',
      },
      keywords: [],
      ascii: 106,
    },
  },
  {
    desc: 'k and K',
    keycodeInfo: {
      code: 14,
      label: 'K',
      name: {
        long: 'KC_K',
        short: 'KC_K',
      },
      keywords: [],
      ascii: 107,
    },
  },
  {
    desc: 'l and L',
    keycodeInfo: {
      code: 15,
      label: 'L',
      name: {
        long: 'KC_L',
        short: 'KC_L',
      },
      keywords: [],
      ascii: 108,
    },
  },
  {
    desc: 'm and M',
    keycodeInfo: {
      code: 16,
      label: 'M',
      name: {
        long: 'KC_M',
        short: 'KC_M',
      },
      keywords: [],
      ascii: 109,
    },
  },
  {
    desc: 'n and N',
    keycodeInfo: {
      code: 17,
      label: 'N',
      name: {
        long: 'KC_N',
        short: 'KC_N',
      },
      keywords: [],
      ascii: 110,
    },
  },
  {
    desc: 'o and O',
    keycodeInfo: {
      code: 18,
      label: 'O',
      name: {
        long: 'KC_O',
        short: 'KC_O',
      },
      keywords: [],
      ascii: 111,
    },
  },
  {
    desc: 'p and P',
    keycodeInfo: {
      code: 19,
      label: 'P',
      name: {
        long: 'KC_P',
        short: 'KC_P',
      },
      keywords: [],
      ascii: 112,
    },
  },
  {
    desc: 'q and Q',
    keycodeInfo: {
      code: 20,
      label: 'Q',
      name: {
        long: 'KC_Q',
        short: 'KC_Q',
      },
      keywords: [],
      ascii: 113,
    },
  },
  {
    desc: 'r and R',
    keycodeInfo: {
      code: 21,
      label: 'R',
      name: {
        long: 'KC_R',
        short: 'KC_R',
      },
      keywords: [],
      ascii: 114,
    },
  },
  {
    desc: 's and S',
    keycodeInfo: {
      code: 22,
      label: 'S',
      name: {
        long: 'KC_S',
        short: 'KC_S',
      },
      keywords: [],
      ascii: 115,
    },
  },
  {
    desc: 't and T',
    keycodeInfo: {
      code: 23,
      label: 'T',
      name: {
        long: 'KC_T',
        short: 'KC_T',
      },
      keywords: [],
      ascii: 116,
    },
  },
  {
    desc: 'u and U',
    keycodeInfo: {
      code: 24,
      label: 'U',
      name: {
        long: 'KC_U',
        short: 'KC_U',
      },
      keywords: [],
      ascii: 117,
    },
  },
  {
    desc: 'v and V',
    keycodeInfo: {
      code: 25,
      label: 'V',
      name: {
        long: 'KC_V',
        short: 'KC_V',
      },
      keywords: [],
      ascii: 118,
    },
  },
  {
    desc: 'w and W',
    keycodeInfo: {
      code: 26,
      label: 'W',
      name: {
        long: 'KC_W',
        short: 'KC_W',
      },
      keywords: [],
      ascii: 119,
    },
  },
  {
    desc: 'x and X',
    keycodeInfo: {
      code: 27,
      label: 'X',
      name: {
        long: 'KC_X',
        short: 'KC_X',
      },
      keywords: [],
      ascii: 120,
    },
  },
  {
    desc: 'y and Y',
    keycodeInfo: {
      code: 28,
      label: 'Y',
      name: {
        long: 'KC_Y',
        short: 'KC_Y',
      },
      keywords: [],
      ascii: 121,
    },
  },
  {
    desc: 'z and Z',
    keycodeInfo: {
      code: 29,
      label: 'Z',
      name: {
        long: 'KC_Z',
        short: 'KC_Z',
      },
      keywords: [],
      ascii: 122,
    },
  },
  {
    desc: '1 and !',
    keycodeInfo: {
      code: 30,
      label: '1',
      name: {
        long: 'KC_1',
        short: 'KC_1',
      },
      keywords: [],
      ascii: 49,
    },
  },
  {
    desc: '2 and @',
    keycodeInfo: {
      code: 31,
      label: '2',
      name: {
        long: 'KC_2',
        short: 'KC_2',
      },
      keywords: [],
      ascii: 50,
    },
  },
  {
    desc: '3 and #',
    keycodeInfo: {
      code: 32,
      label: '3',
      name: {
        long: 'KC_3',
        short: 'KC_3',
      },
      keywords: [],
      ascii: 51,
    },
  },
  {
    desc: '4 and $',
    keycodeInfo: {
      code: 33,
      label: '4',
      name: {
        long: 'KC_4',
        short: 'KC_4',
      },
      keywords: [],
      ascii: 52,
    },
  },
  {
    desc: '5 and %',
    keycodeInfo: {
      code: 34,
      label: '5',
      name: {
        long: 'KC_5',
        short: 'KC_5',
      },
      keywords: [],
      ascii: 53,
    },
  },
  {
    desc: '6 and ^',
    keycodeInfo: {
      code: 35,
      label: '6',
      name: {
        long: 'KC_6',
        short: 'KC_6',
      },
      keywords: [],
      ascii: 54,
    },
  },
  {
    desc: '7 and &',
    keycodeInfo: {
      code: 36,
      label: '7',
      name: {
        long: 'KC_7',
        short: 'KC_7',
      },
      keywords: [],
      ascii: 55,
    },
  },
  {
    desc: '8 and *',
    keycodeInfo: {
      code: 37,
      label: '8',
      name: {
        long: 'KC_8',
        short: 'KC_8',
      },
      keywords: [],
      ascii: 56,
    },
  },
  {
    desc: '9 and (',
    keycodeInfo: {
      code: 38,
      label: '9',
      name: {
        long: 'KC_9',
        short: 'KC_9',
      },
      keywords: [],
      ascii: 57,
    },
  },
  {
    desc: '0 and )',
    keycodeInfo: {
      code: 39,
      label: '0',
      name: {
        long: 'KC_0',
        short: 'KC_0',
      },
      keywords: [],
      ascii: 48,
    },
  },
  {
    desc: 'Return (Enter)',
    keycodeInfo: {
      code: 40,
      label: 'Enter',
      name: {
        long: 'KC_ENTER',
        short: 'KC_ENT',
      },
      keywords: [],
    },
  },
  {
    desc: 'Escape',
    keycodeInfo: {
      code: 41,
      label: 'Esc',
      name: {
        long: 'KC_ESCAPE',
        short: 'KC_ESC',
      },
      keywords: ['escape'],
      ascii: 27,
    },
  },
  {
    desc: 'Delete (Backspace)',
    keycodeInfo: {
      code: 42,
      label: 'BS',
      name: {
        long: 'KC_BACKSPACE',
        short: 'KC_BSPC',
      },
      keywords: ['backspace', 'delete', 'bspace', 'bspc'],
      ascii: 8,
    },
  },
  {
    desc: 'Tab',
    keycodeInfo: {
      code: 43,
      label: 'Tab',
      name: {
        long: 'KC_TAB',
        short: 'KC_TAB',
      },
      keywords: [],
      ascii: 9,
    },
  },
  {
    desc: 'Spacebar',
    keycodeInfo: {
      code: 44,
      label: 'Space',
      name: {
        long: 'KC_SPACE',
        short: 'KC_SPC',
      },
      keywords: ['spc'],
      ascii: 32,
    },
  },
  {
    desc: '- and _',
    keycodeInfo: {
      code: 45,
      label: '-',
      name: {
        long: 'KC_MINUS',
        short: 'KC_MINS',
      },
      keywords: ['minus', 'mins', 'hyphen'],
      ascii: 45,
    },
  },
  {
    desc: '= and +',
    keycodeInfo: {
      code: 46,
      label: '=',
      name: {
        long: 'KC_EQUAL',
        short: 'KC_EQL',
      },
      keywords: ['equal', 'eql'],
      ascii: 61,
    },
  },
  {
    desc: '[ and {',
    keycodeInfo: {
      code: 47,
      label: '[',
      name: {
        long: 'KC_LEFT_BRACKET',
        short: 'KC_LBRC',
      },
      keywords: ['lbracket', 'lbrc'],
      ascii: 91,
    },
  },
  {
    desc: '] and }',
    keycodeInfo: {
      code: 48,
      label: ']',
      name: {
        long: 'KC_RIGHT_BRACKET',
        short: 'KC_RBRC',
      },
      keywords: ['rbracket', 'rbrc'],
      ascii: 93,
    },
  },
  {
    desc: '\\ and |',
    keycodeInfo: {
      code: 49,
      label: '\\',
      name: {
        long: 'KC_BACKSLASH',
        short: 'KC_BSLS',
      },
      keywords: ['bslash', 'bsls'],
      ascii: 92,
    },
  },
  {
    desc: 'Non-US # and ~',
    keycodeInfo: {
      code: 50,
      label: 'NUHS',
      name: {
        long: 'KC_NONUS_HASH',
        short: 'KC_NUHS',
      },
      keywords: ['nonus_hash'],
    },
  },
  {
    desc: '; and :',
    keycodeInfo: {
      code: 51,
      label: ';',
      name: {
        long: 'KC_SEMICOLON',
        short: 'KC_SCLN',
      },
      keywords: ['scolon', 'scln', 'semi colon', 'colon'],
      ascii: 59,
    },
  },
  {
    desc: '\' and "',
    keycodeInfo: {
      code: 52,
      label: "'",
      name: {
        long: 'KC_QUOTE',
        short: 'KC_QUOT',
      },
      keywords: ['quote', 'quot'],
      ascii: 39,
    },
  },
  {
    desc: '` and ~',
    keycodeInfo: {
      code: 53,
      label: '`',
      name: {
        long: 'KC_GRAVE',
        short: 'KC_GRV',
      },
      keywords: ['zenkaku', 'hankaku', 'grave', 'zkhk'],
      ascii: 96,
    },
  },
  {
    desc: ', and <',
    keycodeInfo: {
      code: 54,
      label: ',',
      name: {
        long: 'KC_COMMA',
        short: 'KC_COMM',
      },
      keywords: ['comma'],
      ascii: 44,
    },
  },
  {
    desc: '. and >',
    keycodeInfo: {
      code: 55,
      label: '.',
      name: {
        long: 'KC_DOT',
        short: 'KC_DOT',
      },
      keywords: ['dot'],
      ascii: 46,
    },
  },
  {
    desc: '/ and ?',
    keycodeInfo: {
      code: 56,
      label: '/',
      name: {
        long: 'KC_SLASH',
        short: 'KC_SLSH',
      },
      keywords: ['slash', 'slsh'],
      ascii: 47,
    },
  },
  {
    desc: 'Caps Lock',
    keycodeInfo: {
      code: 57,
      label: 'Caps Lock',
      name: {
        long: 'KC_CAPS_LOCK',
        short: 'KC_CAPS',
      },
      keywords: ['capslock'],
    },
  },
  {
    desc: 'F1',
    keycodeInfo: {
      code: 58,
      label: 'F1',
      name: {
        long: 'KC_F1',
        short: 'KC_F1',
      },
      keywords: [],
    },
  },
  {
    desc: 'F2',
    keycodeInfo: {
      code: 59,
      label: 'F2',
      name: {
        long: 'KC_F2',
        short: 'KC_F2',
      },
      keywords: [],
    },
  },
  {
    desc: 'F3',
    keycodeInfo: {
      code: 60,
      label: 'F3',
      name: {
        long: 'KC_F3',
        short: 'KC_F3',
      },
      keywords: [],
    },
  },
  {
    desc: 'F4',
    keycodeInfo: {
      code: 61,
      label: 'F4',
      name: {
        long: 'KC_F4',
        short: 'KC_F4',
      },
      keywords: [],
    },
  },
  {
    desc: 'F5',
    keycodeInfo: {
      code: 62,
      label: 'F5',
      name: {
        long: 'KC_F5',
        short: 'KC_F5',
      },
      keywords: [],
    },
  },
  {
    desc: 'F6',
    keycodeInfo: {
      code: 63,
      label: 'F6',
      name: {
        long: 'KC_F6',
        short: 'KC_F6',
      },
      keywords: [],
    },
  },
  {
    desc: 'F7',
    keycodeInfo: {
      code: 64,
      label: 'F7',
      name: {
        long: 'KC_F7',
        short: 'KC_F7',
      },
      keywords: [],
    },
  },
  {
    desc: 'F8',
    keycodeInfo: {
      code: 65,
      label: 'F8',
      name: {
        long: 'KC_F8',
        short: 'KC_F8',
      },
      keywords: [],
    },
  },
  {
    desc: 'F9',
    keycodeInfo: {
      code: 66,
      label: 'F9',
      name: {
        long: 'KC_F9',
        short: 'KC_F9',
      },
      keywords: [],
    },
  },
  {
    desc: 'F10',
    keycodeInfo: {
      code: 67,
      label: 'F10',
      name: {
        long: 'KC_F10',
        short: 'KC_F10',
      },
      keywords: [],
    },
  },
  {
    desc: 'F11',
    keycodeInfo: {
      code: 68,
      label: 'F11',
      name: {
        long: 'KC_F11',
        short: 'KC_F11',
      },
      keywords: [],
    },
  },
  {
    desc: 'F12',
    keycodeInfo: {
      code: 69,
      label: 'F12',
      name: {
        long: 'KC_F12',
        short: 'KC_F12',
      },
      keywords: [],
    },
  },
  {
    desc: 'Print Screen',
    keycodeInfo: {
      code: 70,
      label: 'Print Screen',
      name: {
        long: 'KC_PRINT_SCREEN',
        short: 'KC_PSCR',
      },
      keywords: ['pscreen', 'pscr'],
    },
  },
  {
    desc: 'Scroll Lock, Brightness Down (macOS)',
    keycodeInfo: {
      code: 71,
      label: 'Scroll Lock',
      name: {
        long: 'KC_SCROLL_LOCK',
        short: 'KC_SCRL',
      },
      keywords: ['scrolllock', 'brmd'],
    },
  },
  {
    desc: 'Pause, Brightness Up (macOS)',
    keycodeInfo: {
      code: 72,
      label: 'Pause',
      name: {
        long: 'KC_PAUSE',
        short: 'KC_PAUS',
      },
      keywords: ['brmu'],
    },
  },
  {
    desc: 'Insert',
    keycodeInfo: {
      code: 73,
      label: 'Insert',
      name: {
        long: 'KC_INSERT',
        short: 'KC_INS',
      },
      keywords: [],
    },
  },
  {
    desc: 'Home',
    keycodeInfo: {
      code: 74,
      label: 'Home',
      name: {
        long: 'KC_HOME',
        short: 'KC_HOME',
      },
      keywords: [],
    },
  },
  {
    desc: 'Page Up',
    keycodeInfo: {
      code: 75,
      label: 'Page Up',
      name: {
        long: 'KC_PAGE_UP',
        short: 'KC_PGUP',
      },
      keywords: ['pgup'],
    },
  },
  {
    desc: 'Forward Delete',
    keycodeInfo: {
      code: 76,
      label: 'Del',
      name: {
        long: 'KC_DELETE',
        short: 'KC_DEL',
      },
      keywords: ['delete'],
      ascii: 127,
    },
  },
  {
    desc: 'End',
    keycodeInfo: {
      code: 77,
      label: 'End',
      name: {
        long: 'KC_END',
        short: 'KC_END',
      },
      keywords: [],
    },
  },
  {
    desc: 'Page Down',
    keycodeInfo: {
      code: 78,
      label: 'Page Down',
      name: {
        long: 'KC_PAGE_DOWN',
        short: 'KC_PGDN',
      },
      keywords: ['pgdown', 'pgdn'],
    },
  },
  {
    desc: 'Right Arrow',
    keycodeInfo: {
      code: 79,
      label: '→',
      name: {
        long: 'KC_RIGHT',
        short: 'KC_RGHT',
      },
      keywords: ['right arrow', 'rght', 'arrow', 'arrowright'],
    },
  },
  {
    desc: 'Left Arrow',
    keycodeInfo: {
      code: 80,
      label: '←',
      name: {
        long: 'KC_LEFT',
        short: 'KC_LEFT',
      },
      keywords: ['left arrow', 'arrow', 'arrowleft'],
    },
  },
  {
    desc: 'Down Arrow',
    keycodeInfo: {
      code: 81,
      label: '↓',
      name: {
        long: 'KC_DOWN',
        short: 'KC_DOWN',
      },
      keywords: ['down arrow', 'arrow', 'arrowdown'],
    },
  },
  {
    desc: 'Up Arrow',
    keycodeInfo: {
      code: 82,
      label: '↑',
      name: {
        long: 'KC_UP',
        short: 'KC_UP',
      },
      keywords: ['up arrow', 'arrow', 'arrowup'],
    },
  },
  {
    desc: 'Keypad Num Lock and Clear',
    keycodeInfo: {
      code: 83,
      label: 'Num Lock',
      name: {
        long: 'KC_NUM_LOCK',
        short: 'KC_NUM',
      },
      keywords: ['numlock', 'nlck'],
    },
  },
  {
    desc: 'Keypad /',
    keycodeInfo: {
      code: 84,
      label: 'Num /',
      name: {
        long: 'KC_KP_SLASH',
        short: 'KC_PSLS',
      },
      keywords: ['kp_slash', 'psls', 'kp_/'],
    },
  },
  {
    desc: 'Keypad *',
    keycodeInfo: {
      code: 85,
      label: 'Num *',
      name: {
        long: 'KC_KP_ASTERISK',
        short: 'KC_PAST',
      },
      keywords: ['kp_asterisk', 'past', 'kp_*'],
    },
  },
  {
    desc: 'Keypad -',
    keycodeInfo: {
      code: 86,
      label: 'Num -',
      name: {
        long: 'KC_KP_MINUS',
        short: 'KC_PMNS',
      },
      keywords: ['num minus', 'kp_minus', 'pmns', 'kp_-'],
    },
  },
  {
    desc: 'Keypad +',
    keycodeInfo: {
      code: 87,
      label: 'Num +',
      name: {
        long: 'KC_KP_PLUS',
        short: 'KC_PPLS',
      },
      keywords: ['num plus', 'kp_plus', 'ppls', 'kp_+'],
    },
  },
  {
    desc: 'Keypad Enter',
    keycodeInfo: {
      code: 88,
      label: 'Num Enter',
      name: {
        long: 'KC_KP_ENTER',
        short: 'KC_PENT',
      },
      keywords: ['kp_enter', 'pent'],
    },
  },
  {
    desc: 'Keypad 1 and End',
    keycodeInfo: {
      code: 89,
      label: 'Num 1',
      name: {
        long: 'KC_KP_1',
        short: 'KC_P1',
      },
      keywords: ['kp_1', 'p1'],
    },
  },
  {
    desc: 'Keypad 2 and Down Arrow',
    keycodeInfo: {
      code: 90,
      label: 'Num 2',
      name: {
        long: 'KC_KP_2',
        short: 'KC_P2',
      },
      keywords: ['kp_2', 'p2'],
    },
  },
  {
    desc: 'Keypad 3 and Page Down',
    keycodeInfo: {
      code: 91,
      label: 'Num 3',
      name: {
        long: 'KC_KP_3',
        short: 'KC_P3',
      },
      keywords: ['kp_3', 'p3'],
    },
  },
  {
    desc: 'Keypad 4 and Left Arrow',
    keycodeInfo: {
      code: 92,
      label: 'Num 4',
      name: {
        long: 'KC_KP_4',
        short: 'KC_P4',
      },
      keywords: ['kp_4', 'p4'],
    },
  },
  {
    desc: 'Keypad 5',
    keycodeInfo: {
      code: 93,
      label: 'Num 5',
      name: {
        long: 'KC_KP_5',
        short: 'KC_P5',
      },
      keywords: ['kp_5', 'p5'],
    },
  },
  {
    desc: 'Keypad 6 and Right Arrow',
    keycodeInfo: {
      code: 94,
      label: 'Num 6',
      name: {
        long: 'KC_KP_6',
        short: 'KC_P6',
      },
      keywords: ['kp_6', 'p6'],
    },
  },
  {
    desc: 'Keypad 7 and Home',
    keycodeInfo: {
      code: 95,
      label: 'Num 7',
      name: {
        long: 'KC_KP_7',
        short: 'KC_P7',
      },
      keywords: ['kp_7', 'p7'],
    },
  },
  {
    desc: 'Keypad 8 and Up Arrow',
    keycodeInfo: {
      code: 96,
      label: 'Num 8',
      name: {
        long: 'KC_KP_8',
        short: 'KC_P8',
      },
      keywords: ['kp_8', 'p8'],
    },
  },
  {
    desc: 'Keypad 9 and Page Up',
    keycodeInfo: {
      code: 97,
      label: 'Num 9',
      name: {
        long: 'KC_KP_9',
        short: 'KC_P9',
      },
      keywords: ['kp_9', 'p9'],
    },
  },
  {
    desc: 'Keypad 0 and Insert',
    keycodeInfo: {
      code: 98,
      label: 'Num 0',
      name: {
        long: 'KC_KP_0',
        short: 'KC_P0',
      },
      keywords: ['kp_0', 'p0'],
    },
  },
  {
    desc: 'Keypad . and Delete',
    keycodeInfo: {
      code: 99,
      label: 'Num .',
      name: {
        long: 'KC_KP_DOT',
        short: 'KC_PDOT',
      },
      keywords: ['kp_dot', 'pdot', 'kp_.'],
    },
  },
  {
    desc: 'Non-US \\ and |',
    keycodeInfo: {
      code: 100,
      label: 'NUBS',
      name: {
        long: 'KC_NONUS_BACKSLASH',
        short: 'KC_NUBS',
      },
      keywords: ['nonus_bslash'],
    },
  },
  {
    desc: 'Application (Windows Context Menu Key)',
    keycodeInfo: {
      code: 101,
      label: 'App',
      name: {
        long: 'KC_APPLICATION',
        short: 'KC_APP',
      },
      keywords: ['application'],
    },
  },
  {
    desc: 'System Power',
    keycodeInfo: {
      code: 102,
      label: 'Power',
      name: {
        long: 'KC_KB_POWER',
        short: 'KC_KB_POWER',
      },
      keywords: [],
    },
  },
  {
    desc: 'Keypad =',
    keycodeInfo: {
      code: 103,
      label: 'Num =',
      name: {
        long: 'KC_KP_EQUAL',
        short: 'KC_PEQL',
      },
      keywords: ['num equal', 'kq_equal', 'peql'],
    },
  },
  {
    desc: 'F13',
    keycodeInfo: {
      code: 104,
      label: 'F13',
      name: {
        long: 'KC_F13',
        short: 'KC_F13',
      },
      keywords: [],
    },
  },
  {
    desc: 'F14',
    keycodeInfo: {
      code: 105,
      label: 'F14',
      name: {
        long: 'KC_F14',
        short: 'KC_F14',
      },
      keywords: [],
    },
  },
  {
    desc: 'F15',
    keycodeInfo: {
      code: 106,
      label: 'F15',
      name: {
        long: 'KC_F15',
        short: 'KC_F15',
      },
      keywords: [],
    },
  },
  {
    desc: 'F16',
    keycodeInfo: {
      code: 107,
      label: 'F16',
      name: {
        long: 'KC_F16',
        short: 'KC_F16',
      },
      keywords: [],
    },
  },
  {
    desc: 'F17',
    keycodeInfo: {
      code: 108,
      label: 'F17',
      name: {
        long: 'KC_F17',
        short: 'KC_F17',
      },
      keywords: [],
    },
  },
  {
    desc: 'F18',
    keycodeInfo: {
      code: 109,
      label: 'F18',
      name: {
        long: 'KC_F18',
        short: 'KC_F18',
      },
      keywords: [],
    },
  },
  {
    desc: 'F19',
    keycodeInfo: {
      code: 110,
      label: 'F19',
      name: {
        long: 'KC_F19',
        short: 'KC_F19',
      },
      keywords: [],
    },
  },
  {
    desc: 'F20',
    keycodeInfo: {
      code: 111,
      label: 'F20',
      name: {
        long: 'KC_F20',
        short: 'KC_F20',
      },
      keywords: [],
    },
  },
  {
    desc: 'F21',
    keycodeInfo: {
      code: 112,
      label: 'F21',
      name: {
        long: 'KC_F21',
        short: 'KC_F21',
      },
      keywords: [],
    },
  },
  {
    desc: 'F22',
    keycodeInfo: {
      code: 113,
      label: 'F22',
      name: {
        long: 'KC_F22',
        short: 'KC_F22',
      },
      keywords: [],
    },
  },
  {
    desc: 'F23',
    keycodeInfo: {
      code: 114,
      label: 'F23',
      name: {
        long: 'KC_F23',
        short: 'KC_F23',
      },
      keywords: [],
    },
  },
  {
    desc: 'F24',
    keycodeInfo: {
      code: 115,
      label: 'F24',
      name: {
        long: 'KC_F24',
        short: 'KC_F24',
      },
      keywords: [],
    },
  },
  {
    desc: 'Execute',
    keycodeInfo: {
      code: 116,
      label: 'Execute',
      name: {
        long: 'KC_EXECUTE',
        short: 'KC_EXEC',
      },
      keywords: [],
    },
  },
  {
    desc: 'Help',
    keycodeInfo: {
      code: 117,
      label: 'Help',
      name: {
        long: 'KC_HELP',
        short: 'KC_HELP',
      },
      keywords: [],
    },
  },
  {
    desc: 'Menu',
    keycodeInfo: {
      code: 118,
      label: 'Menu',
      name: {
        long: 'KC_MENU',
        short: 'KC_MENU',
      },
      keywords: [],
    },
  },
  {
    desc: 'Select',
    keycodeInfo: {
      code: 119,
      label: 'Select',
      name: {
        long: 'KC_SELECT',
        short: 'KC_SLCT',
      },
      keywords: ['slct'],
    },
  },
  {
    desc: 'Stop',
    keycodeInfo: {
      code: 120,
      label: 'Stop',
      name: {
        long: 'KC_STOP',
        short: 'KC_STOP',
      },
      keywords: [],
    },
  },
  {
    desc: 'Again',
    keycodeInfo: {
      code: 121,
      label: 'Again',
      name: {
        long: 'KC_AGAIN',
        short: 'KC_AGIN',
      },
      keywords: ['agin'],
    },
  },
  {
    desc: 'Undo',
    keycodeInfo: {
      code: 122,
      label: 'Undo',
      name: {
        long: 'KC_UNDO',
        short: 'KC_UNDO',
      },
      keywords: [],
    },
  },
  {
    desc: 'Cut',
    keycodeInfo: {
      code: 123,
      label: 'Cut',
      name: {
        long: 'KC_CUT',
        short: 'KC_CUT',
      },
      keywords: [],
    },
  },
  {
    desc: 'Copy',
    keycodeInfo: {
      code: 124,
      label: 'Copy',
      name: {
        long: 'KC_COPY',
        short: 'KC_COPY',
      },
      keywords: [],
    },
  },
  {
    desc: 'Paste',
    keycodeInfo: {
      code: 125,
      label: 'Paste',
      name: {
        long: 'KC_PASTE',
        short: 'KC_PSTE',
      },
      keywords: ['pste'],
    },
  },
  {
    desc: 'Find',
    keycodeInfo: {
      code: 126,
      label: 'Find',
      name: {
        long: 'KC_FIND',
        short: 'KC_FIND',
      },
      keywords: [],
    },
  },
  {
    desc: 'Mute',
    keycodeInfo: {
      code: 127,
      label: 'Mute',
      name: {
        long: 'KC_KB_MUTE',
        short: 'KC_KB_MUTE',
      },
      keywords: [],
    },
  },
  {
    desc: 'Volume Up',
    keycodeInfo: {
      code: 128,
      label: 'Vol +',
      name: {
        long: 'KC_KB_VOLUME_UP',
        short: 'KC_KB_VOLUME_UP',
      },
      keywords: ['volume plus', 'volup'],
    },
  },
  {
    desc: 'Volume Down',
    keycodeInfo: {
      code: 129,
      label: 'Vol -',
      name: {
        long: 'KC_KB_VOLUME_DOWN',
        short: 'KC_KB_VOLUME_DOWN',
      },
      keywords: ['volume minus', 'voldown'],
    },
  },
  {
    desc: 'Locking Caps Lock',
    keycodeInfo: {
      code: 130,
      label: 'Locking Caps Lock',
      name: {
        long: 'KC_LOCKING_CAPS_LOCK',
        short: 'KC_LCAP',
      },
      keywords: ['locking_caps', 'lcap'],
    },
  },
  {
    desc: 'Locking Num Lock',
    keycodeInfo: {
      code: 131,
      label: 'Locking Num Lock',
      name: {
        long: 'KC_LOCKING_NUM_LOCK',
        short: 'KC_LNUM',
      },
      keywords: ['locking_num', 'lnum'],
    },
  },
  {
    desc: 'Locking Scroll Lock',
    keycodeInfo: {
      code: 132,
      label: 'Locking Scroll Lock',
      name: {
        long: 'KC_LOCKING_SCROLL_LOCK',
        short: 'KC_LSCR',
      },
      keywords: ['locking_scroll', 'lscr'],
    },
  },
  {
    desc: 'Keypad ,',
    keycodeInfo: {
      code: 133,
      label: 'Num ,',
      name: {
        long: 'KC_KP_COMMA',
        short: 'KC_PCMM',
      },
      keywords: ['kp_comma', 'pcmm'],
    },
  },
  {
    desc: 'Keypad = on AS/400 keyboards',
    keycodeInfo: {
      code: 134,
      label: 'Num = AS400',
      name: {
        long: 'KC_KP_EQUAL_AS400',
        short: 'KC_KP_EQUAL_AS400',
      },
      keywords: ['num equal as400', 'kp_equal_as400'],
    },
  },
  {
    desc: 'International 1',
    keycodeInfo: {
      code: 135,
      label: 'Ro',
      name: {
        long: 'KC_INTERNATIONAL_1',
        short: 'KC_INT1',
      },
      keywords: ['int1'],
    },
  },
  {
    desc: 'International 2',
    keycodeInfo: {
      code: 136,
      label: 'かな',
      name: {
        long: 'KC_INTERNATIONAL_2',
        short: 'KC_INT2',
      },
      keywords: ['kana', 'int2'],
    },
  },
  {
    desc: 'International 3',
    keycodeInfo: {
      code: 137,
      label: '¥',
      name: {
        long: 'KC_INTERNATIONAL_3',
        short: 'KC_INT3',
      },
      keywords: ['yen', 'int3'],
    },
  },
  {
    desc: 'International 4',
    keycodeInfo: {
      code: 138,
      label: '変換',
      name: {
        long: 'KC_INTERNATIONAL_4',
        short: 'KC_INT4',
      },
      keywords: ['henkan', 'int4'],
    },
  },
  {
    desc: 'International 5',
    keycodeInfo: {
      code: 139,
      label: '無変換',
      name: {
        long: 'KC_INTERNATIONAL_5',
        short: 'KC_INT5',
      },
      keywords: ['muhenkan', 'int5'],
    },
  },
  {
    desc: 'International 6',
    keycodeInfo: {
      code: 140,
      label: 'JIS Numpad ,',
      name: {
        long: 'KC_INTERNATIONAL_6',
        short: 'KC_INT6',
      },
      keywords: ['int6'],
    },
  },
  {
    desc: 'International 7',
    keycodeInfo: {
      code: 141,
      label: 'Int 7',
      name: {
        long: 'KC_INTERNATIONAL_7',
        short: 'KC_INT7',
      },
      keywords: ['int7'],
    },
  },
  {
    desc: 'International 8',
    keycodeInfo: {
      code: 142,
      label: 'Int 8',
      name: {
        long: 'KC_INTERNATIONAL_8',
        short: 'KC_INT8',
      },
      keywords: ['int8'],
    },
  },
  {
    desc: 'International 9',
    keycodeInfo: {
      code: 143,
      label: 'Int 9',
      name: {
        long: 'KC_INTERNATIONAL_9',
        short: 'KC_INT9',
      },
      keywords: ['int9'],
    },
  },
  {
    desc: 'Language 1',
    keycodeInfo: {
      code: 144,
      label: 'Lang 1',
      name: {
        long: 'KC_LANGUAGE_1',
        short: 'KC_LNG1',
      },
      keywords: ['lang1', 'haen'],
    },
  },
  {
    desc: 'Language 2',
    keycodeInfo: {
      code: 145,
      label: 'Lang 2',
      name: {
        long: 'KC_LANGUAGE_2',
        short: 'KC_LNG2',
      },
      keywords: ['lang2', 'hanj'],
    },
  },
  {
    desc: 'Language 3',
    keycodeInfo: {
      code: 146,
      label: 'JIS Katakana',
      name: {
        long: 'KC_LANGUAGE_3',
        short: 'KC_LNG3',
      },
      keywords: ['lang3'],
    },
  },
  {
    desc: 'Language 4',
    keycodeInfo: {
      code: 147,
      label: 'JIS Hiragana',
      name: {
        long: 'KC_LANGUAGE_4',
        short: 'KC_LNG4',
      },
      keywords: ['lang4'],
    },
  },
  {
    desc: 'Language 5',
    keycodeInfo: {
      code: 148,
      label: 'Lang 5',
      name: {
        long: 'KC_LANGUAGE_5',
        short: 'KC_LNG5',
      },
      keywords: ['lang5'],
    },
  },
  {
    desc: 'Language 6',
    keycodeInfo: {
      code: 149,
      label: 'Lang 6',
      name: {
        long: 'KC_LANGUAGE_6',
        short: 'KC_LNG6',
      },
      keywords: ['lang6'],
    },
  },
  {
    desc: 'Language 7',
    keycodeInfo: {
      code: 150,
      label: 'Lang 7',
      name: {
        long: 'KC_LANGUAGE_7',
        short: 'KC_LNG7',
      },
      keywords: ['lang7'],
    },
  },
  {
    desc: 'Language 8',
    keycodeInfo: {
      code: 151,
      label: 'Lang 8',
      name: {
        long: 'KC_LANGUAGE_8',
        short: 'KC_LNG8',
      },
      keywords: ['lang8'],
    },
  },
  {
    desc: 'Language 9',
    keycodeInfo: {
      code: 152,
      label: 'Lang 9',
      name: {
        long: 'KC_LANGUAGE_9',
        short: 'KC_LNG9',
      },
      keywords: ['lang9'],
    },
  },
  {
    desc: 'Alternate Erase',
    keycodeInfo: {
      code: 153,
      label: 'Alt Erase',
      name: {
        long: 'KC_ALTERNATE_ERASE',
        short: 'KC_ERAS',
      },
      keywords: ['alt_erase', 'eras'],
    },
  },
  {
    desc: 'SysReq/Attention',
    keycodeInfo: {
      code: 154,
      label: 'SysReq',
      name: {
        long: 'KC_SYSTEM_REQUEST',
        short: 'KC_SYRQ',
      },
      keywords: [],
    },
  },
  {
    desc: 'Cancel',
    keycodeInfo: {
      code: 155,
      label: 'Cancel',
      name: {
        long: 'KC_CANCEL',
        short: 'KC_CNCL',
      },
      keywords: [],
    },
  },
  {
    desc: 'Clear',
    keycodeInfo: {
      code: 156,
      label: 'Clear',
      name: {
        long: 'KC_CLEAR',
        short: 'KC_CLR',
      },
      keywords: ['clr'],
    },
  },
  {
    desc: 'Prior',
    keycodeInfo: {
      code: 157,
      label: 'Prior',
      name: {
        long: 'KC_PRIOR',
        short: 'KC_PRIR',
      },
      keywords: [],
    },
  },
  {
    desc: 'Return',
    keycodeInfo: {
      code: 158,
      label: 'Return',
      name: {
        long: 'KC_RETURN',
        short: 'KC_RETN',
      },
      keywords: [],
    },
  },
  {
    desc: 'Separator',
    keycodeInfo: {
      code: 159,
      label: 'Separator',
      name: {
        long: 'KC_SEPARATOR',
        short: 'KC_SEPR',
      },
      keywords: [],
    },
  },
  {
    desc: 'Out',
    keycodeInfo: {
      code: 160,
      label: 'Out',
      name: {
        long: 'KC_OUT',
        short: 'KC_OUT',
      },
      keywords: [],
    },
  },
  {
    desc: 'Oper',
    keycodeInfo: {
      code: 161,
      label: 'Oper',
      name: {
        long: 'KC_OPER',
        short: 'KC_OPER',
      },
      keywords: [],
    },
  },
  {
    desc: 'Clear/Again',
    keycodeInfo: {
      code: 162,
      label: 'Clear/Again',
      name: {
        long: 'KC_CLEAR_AGAIN',
        short: 'KC_CLAG',
      },
      keywords: ['clear_again'],
    },
  },
  {
    desc: 'CrSel/Props',
    keycodeInfo: {
      code: 163,
      label: 'CrSel/Props',
      name: {
        long: 'KC_CRSEL',
        short: 'KC_CRSL',
      },
      keywords: ['crsel'],
    },
  },
  {
    desc: 'ExSel',
    keycodeInfo: {
      code: 164,
      label: 'ExSel',
      name: {
        long: 'KC_EXSEL',
        short: 'KC_EXSL',
      },
      keywords: [],
    },
  },
  {
    desc: 'System Power Down',
    keycodeInfo: {
      code: 165,
      label: 'System Power Down',
      name: {
        long: 'KC_SYSTEM_POWER',
        short: 'KC_PWR',
      },
      keywords: ['system_power', 'pwr'],
    },
  },
  {
    desc: 'System Sleep',
    keycodeInfo: {
      code: 166,
      label: 'Sleep',
      name: {
        long: 'KC_SYSTEM_SLEEP',
        short: 'KC_SLEP',
      },
      keywords: ['system_sleep', 'slep'],
    },
  },
  {
    desc: 'System Wake',
    keycodeInfo: {
      code: 167,
      label: 'Wake',
      name: {
        long: 'KC_SYSTEM_WAKE',
        short: 'KC_WAKE',
      },
      keywords: ['system_wake', 'wake'],
    },
  },
  {
    desc: 'Mute',
    keycodeInfo: {
      code: 168,
      label: 'Audio Mute',
      name: {
        long: 'KC_AUDIO_MUTE',
        short: 'KC_MUTE',
      },
      keywords: ['audio_mute'],
    },
  },
  {
    desc: 'Volume Up',
    keycodeInfo: {
      code: 169,
      label: 'Audio Vol +',
      name: {
        long: 'KC_AUDIO_VOL_UP',
        short: 'KC_VOLU',
      },
      keywords: ['audio volume plus', 'audio_vol_up', 'volu'],
    },
  },
  {
    desc: 'Volume Down',
    keycodeInfo: {
      code: 170,
      label: 'Audio Vol -',
      name: {
        long: 'KC_AUDIO_VOL_DOWN',
        short: 'KC_VOLD',
      },
      keywords: ['audio volume minus', 'audio_vol_down', 'vold'],
    },
  },
  {
    desc: 'Next Track',
    keycodeInfo: {
      code: 171,
      label: 'Next',
      name: {
        long: 'KC_MEDIA_NEXT_TRACK',
        short: 'KC_MNXT',
      },
      keywords: ['media_next_track', 'mnxt'],
    },
  },
  {
    desc: 'Previous Track',
    keycodeInfo: {
      code: 172,
      label: 'Previous',
      name: {
        long: 'KC_MEDIA_PREV_TRACK',
        short: 'KC_MPRV',
      },
      keywords: ['media_prev_track', 'mprv'],
    },
  },
  {
    desc: 'Stop Track',
    keycodeInfo: {
      code: 173,
      label: 'Media Stop',
      name: {
        long: 'KC_MEDIA_STOP',
        short: 'KC_MSTP',
      },
      keywords: ['medai_stop', 'mstp'],
    },
  },
  {
    desc: 'Play/Pause Track',
    keycodeInfo: {
      code: 174,
      label: 'Play',
      name: {
        long: 'KC_MEDIA_PLAY_PAUSE',
        short: 'KC_MPLY',
      },
      keywords: ['medai_play_pause', 'mply'],
    },
  },
  {
    desc: 'Launch Media Player',
    keycodeInfo: {
      code: 175,
      label: 'Select',
      name: {
        long: 'KC_MEDIA_SELECT',
        short: 'KC_MSEL',
      },
      keywords: ['media_select', 'msel'],
    },
  },
  {
    desc: 'Eject',
    keycodeInfo: {
      code: 176,
      label: 'Eject',
      name: {
        long: 'KC_MEDIA_EJECT',
        short: 'KC_EJCT',
      },
      keywords: ['media_eject', 'ejct'],
    },
  },
  {
    desc: 'Launch Mail',
    keycodeInfo: {
      code: 177,
      label: 'Mail',
      name: {
        long: 'KC_MAIL',
        short: 'KC_MAIL',
      },
      keywords: [],
    },
  },
  {
    desc: 'Launch Calculator',
    keycodeInfo: {
      code: 178,
      label: 'Calculator',
      name: {
        long: 'KC_CALCULATOR',
        short: 'KC_CALC',
      },
      keywords: [],
    },
  },
  {
    desc: 'Launch My Computer',
    keycodeInfo: {
      code: 179,
      label: 'My Computer',
      name: {
        long: 'KC_MY_COMPUTER',
        short: 'KC_MYCM',
      },
      keywords: ['my_comuter', 'mycm'],
    },
  },
  {
    desc: 'Browser Search',
    keycodeInfo: {
      code: 180,
      label: 'WWW Search',
      name: {
        long: 'KC_WWW_SEARCH',
        short: 'KC_WSCH',
      },
      keywords: ['www_search', 'wsch'],
    },
  },
  {
    desc: 'Browser Home',
    keycodeInfo: {
      code: 181,
      label: 'WWW Home',
      name: {
        long: 'KC_WWW_HOME',
        short: 'KC_WHOM',
      },
      keywords: ['www_home', 'whom'],
    },
  },
  {
    desc: 'Browser Back',
    keycodeInfo: {
      code: 182,
      label: 'WWW Back',
      name: {
        long: 'KC_WWW_BACK',
        short: 'KC_WBAK',
      },
      keywords: ['www_back', 'wbak'],
    },
  },
  {
    desc: 'Browser Forward',
    keycodeInfo: {
      code: 183,
      label: 'WWW Forward',
      name: {
        long: 'KC_WWW_FORWARD',
        short: 'KC_WFWD',
      },
      keywords: ['www_forward', 'wfwd'],
    },
  },
  {
    desc: 'Browser Stop',
    keycodeInfo: {
      code: 184,
      label: 'WWW Stop',
      name: {
        long: 'KC_WWW_STOP',
        short: 'KC_WSTP',
      },
      keywords: ['www_stop', 'wstp'],
    },
  },
  {
    desc: 'Browser Refresh',
    keycodeInfo: {
      code: 185,
      label: 'WWW Refresh',
      name: {
        long: 'KC_WWW_REFRESH',
        short: 'KC_WREF',
      },
      keywords: ['www_refresh', 'wref'],
    },
  },
  {
    desc: 'Browser Favorites',
    keycodeInfo: {
      code: 186,
      label: 'WWW Favorite',
      name: {
        long: 'KC_WWW_FAVORITES',
        short: 'KC_WFAV',
      },
      keywords: ['www_favorites', 'wfav'],
    },
  },
  {
    desc: 'Next Track',
    keycodeInfo: {
      code: 187,
      label: 'Fast Forward',
      name: {
        long: 'KC_MEDIA_FAST_FORWARD',
        short: 'KC_MFFD',
      },
      keywords: ['media_fast_forward', 'mffd'],
    },
  },
  {
    desc: 'Previous Track',
    keycodeInfo: {
      code: 188,
      label: 'Rewind',
      name: {
        long: 'KC_MEDIA_REWIND',
        short: 'KC_MRWD',
      },
      keywords: ['media_rewind', 'mrwd'],
    },
  },
  {
    desc: 'Brightness Up',
    keycodeInfo: {
      code: 189,
      label: 'Screen +',
      name: {
        long: 'KC_BRIGHTNESS_UP',
        short: 'KC_BRIU',
      },
      keywords: ['screen plus', 'brightness up', 'brightness_up', 'briu'],
    },
  },
  {
    desc: 'Brightness Down',
    keycodeInfo: {
      code: 190,
      label: 'Screen -',
      name: {
        long: 'KC_BRIGHTNESS_DOWN',
        short: 'KC_BRID',
      },
      keywords: ['screen minus', 'brightness down', 'brightness_down', 'brid'],
    },
  },
  {
    desc: 'Open Control Panel',
    keycodeInfo: {
      code: 191,
      label: 'Open Control Panel',
      name: {
        long: 'KC_CONTROL_PANEL',
        short: 'KC_CPNL',
      },
      keywords: ['Open Control Panel'],
    },
  },
  {
    desc: 'Launch Context-Aware Assistant',
    keycodeInfo: {
      code: 192,
      label: 'Func0',
      name: {
        long: 'KC_ASSISTANT',
        short: 'KC_ASST',
      },
      keywords: ['fn0'],
    },
  },
  {
    desc: 'Open Mission Control',
    keycodeInfo: {
      code: 193,
      label: 'Func1',
      name: {
        long: 'KC_MISSION_CONTROL',
        short: 'KC_MCTL',
      },
      keywords: ['fn1'],
    },
  },
  {
    desc: 'Open Launchpad',
    keycodeInfo: {
      code: 194,
      label: 'Func2',
      name: {
        long: 'KC_LAUNCHPAD',
        short: 'KC_LPAD',
      },
      keywords: ['fn2'],
    },
  },
  {
    desc: 'Mouse Cursor Up',
    keycodeInfo: {
      code: 205,
      label: 'Func13',
      name: {
        long: 'KC_MS_UP',
        short: 'KC_MS_U',
      },
      keywords: ['fn13'],
    },
  },
  {
    desc: 'Mouse Cursor Down',
    keycodeInfo: {
      code: 206,
      label: 'Func14',
      name: {
        long: 'KC_MS_DOWN',
        short: 'KC_MS_D',
      },
      keywords: ['fn14'],
    },
  },
  {
    desc: 'Mouse Cursor Left',
    keycodeInfo: {
      code: 207,
      label: 'Func15',
      name: {
        long: 'KC_MS_LEFT',
        short: 'KC_MS_L',
      },
      keywords: ['fn15'],
    },
  },
  {
    desc: 'Mouse Cursor Right',
    keycodeInfo: {
      code: 208,
      label: 'Func16',
      name: {
        long: 'KC_MS_RIGHT',
        short: 'KC_MS_R',
      },
      keywords: ['fn16'],
    },
  },
  {
    desc: 'Mouse Button 1',
    keycodeInfo: {
      code: 209,
      label: 'Func17',
      name: {
        long: 'KC_MS_BTN1',
        short: 'KC_BTN1',
      },
      keywords: ['fn17'],
    },
  },
  {
    desc: 'Mouse Button 2',
    keycodeInfo: {
      code: 210,
      label: 'Func18',
      name: {
        long: 'KC_MS_BTN2',
        short: 'KC_BTN2',
      },
      keywords: ['fn18'],
    },
  },
  {
    desc: 'Mouse Button 3',
    keycodeInfo: {
      code: 211,
      label: 'Func19',
      name: {
        long: 'KC_MS_BTN3',
        short: 'KC_BTN3',
      },
      keywords: ['fn19'],
    },
  },
  {
    desc: 'Mouse Button 4',
    keycodeInfo: {
      code: 212,
      label: 'Func20',
      name: {
        long: 'KC_MS_BTN4',
        short: 'KC_BTN4',
      },
      keywords: ['fn20'],
    },
  },
  {
    desc: 'Mouse Button 5',
    keycodeInfo: {
      code: 213,
      label: 'Func21',
      name: {
        long: 'KC_MS_BTN5',
        short: 'KC_BTN5',
      },
      keywords: ['fn21'],
    },
  },
  {
    desc: 'Press button 6',
    keycodeInfo: {
      code: 214,
      label: 'Func22',
      name: {
        long: 'KC_MS_BTN6',
        short: 'KC_BTN6',
      },
      keywords: ['fn22'],
    },
  },
  {
    desc: 'Press button 7',
    keycodeInfo: {
      code: 215,
      label: 'Func23',
      name: {
        long: 'KC_MS_BTN7',
        short: 'KC_BTN7',
      },
      keywords: ['fn23'],
    },
  },
  {
    desc: 'Press button 8',
    keycodeInfo: {
      code: 216,
      label: 'Func24',
      name: {
        long: 'KC_MS_BTN8',
        short: 'KC_BTN8',
      },
      keywords: ['fn24'],
    },
  },
  {
    desc: 'Mouse Wheel Up',
    keycodeInfo: {
      code: 217,
      label: 'Func25',
      name: {
        long: 'KC_MS_WH_UP',
        short: 'KC_WH_U',
      },
      keywords: ['fn25'],
    },
  },
  {
    desc: 'Mouse Wheel Down',
    keycodeInfo: {
      code: 218,
      label: 'Func26',
      name: {
        long: 'KC_MS_WH_DOWN',
        short: 'KC_WH_D',
      },
      keywords: ['fn26'],
    },
  },
  {
    desc: 'Mouse Wheel Left',
    keycodeInfo: {
      code: 219,
      label: 'Func27',
      name: {
        long: 'KC_MS_WH_LEFT',
        short: 'KC_WH_L',
      },
      keywords: ['fn27'],
    },
  },
  {
    desc: 'Mouse Wheel Right',
    keycodeInfo: {
      code: 220,
      label: 'Func28',
      name: {
        long: 'KC_MS_WH_RIGHT',
        short: 'KC_WH_R',
      },
      keywords: ['fn28'],
    },
  },
  {
    desc: 'Set mouse acceleration to 0',
    keycodeInfo: {
      code: 221,
      label: 'Func29',
      name: {
        long: 'KC_MS_ACCEL0',
        short: 'KC_ACL0',
      },
      keywords: ['fn29'],
    },
  },
  {
    desc: 'Set mouse acceleration to 1',
    keycodeInfo: {
      code: 222,
      label: 'Func30',
      name: {
        long: 'KC_MS_ACCEL1',
        short: 'KC_ACL1',
      },
      keywords: ['fn30'],
    },
  },
  {
    desc: 'Set mouse acceleration to 2',
    keycodeInfo: {
      code: 223,
      label: 'Func31',
      name: {
        long: 'KC_MS_ACCEL2',
        short: 'KC_ACL2',
      },
      keywords: ['fn31'],
    },
  },
  {
    desc: 'Left Control',
    keycodeInfo: {
      code: 224,
      label: '*Ctrl',
      name: {
        long: 'KC_LEFT_CTRL',
        short: 'KC_LCTL',
      },
      keywords: ['lctrl', 'lctl', 'lcontrol'],
    },
  },
  {
    desc: 'Left Shift',
    keycodeInfo: {
      code: 225,
      label: '*Shift',
      name: {
        long: 'KC_LEFT_SHIFT',
        short: 'KC_LSFT',
      },
      keywords: ['lshift', 'lsft'],
    },
  },
  {
    desc: 'Left Alt (Option)',
    keycodeInfo: {
      code: 226,
      label: '*Alt',
      name: {
        long: 'KC_LEFT_ALT',
        short: 'KC_LALT',
      },
      keywords: ['lalt', 'lopt'],
    },
  },
  {
    desc: 'Left GUI (Windows/Command/Meta key)',
    keycodeInfo: {
      code: 227,
      label: '*Win',
      name: {
        long: 'KC_LEFT_GUI',
        short: 'KC_LGUI',
      },
      keywords: ['lgui', 'lwin', 'meta', 'lmeta'],
    },
  },
  {
    desc: 'Right Control',
    keycodeInfo: {
      code: 228,
      label: 'Ctrl*',
      name: {
        long: 'KC_RIGHT_CTRL',
        short: 'KC_RCTL',
      },
      keywords: ['rctrl', 'rctl', 'rcontrol'],
    },
  },
  {
    desc: 'Right Shift',
    keycodeInfo: {
      code: 229,
      label: 'Shift*',
      name: {
        long: 'KC_RIGHT_SHIFT',
        short: 'KC_RSFT',
      },
      keywords: ['rshift', 'rsft'],
    },
  },
  {
    desc: 'Right Alt (Option/AltGr)',
    keycodeInfo: {
      code: 230,
      label: 'Alt*',
      name: {
        long: 'KC_RIGHT_ALT',
        short: 'KC_RALT',
      },
      keywords: ['ralt', 'ropt'],
    },
  },
  {
    desc: 'Right GUI (Windows/Command/Meta key)',
    keycodeInfo: {
      code: 231,
      label: 'Win*',
      name: {
        long: 'KC_RIGHT_GUI',
        short: 'KC_RGUI',
      },
      keywords: ['rgui', 'rwin', 'rmeta'],
    },
  },
  {
    desc: 'Toggle hand swap',
    keycodeInfo: {
      code: 22256,
      label: 'Swap Hands Toggle',
      name: {
        long: 'QK_SWAP_HANDS_TOGGLE',
        short: 'SH_TOGG',
      },
      keywords: ['Swap Hands Toggle'],
    },
  },
  {
    desc: 'Momentary swap when held, toggle when tapped',
    keycodeInfo: {
      code: 22257,
      label: 'Swap Hands Tap Toggle',
      name: {
        long: 'QK_SWAP_HANDS_TAP_TOGGLE',
        short: 'SH_TT',
      },
      keywords: ['Swap Hands Tap Toggle'],
    },
  },
  {
    desc: 'Turn on hand swap while held',
    keycodeInfo: {
      code: 22258,
      label: 'Swap Hands Momentary On',
      name: {
        long: 'QK_SWAP_HANDS_MOMENTARY_ON',
        short: 'SH_MON',
      },
      keywords: ['Swap Hands Momentary On'],
    },
  },
  {
    desc: 'Turn off hand swap while held',
    keycodeInfo: {
      code: 22259,
      label: 'Swap Hands Momentary Off',
      name: {
        long: 'QK_SWAP_HANDS_MOMENTARY_OFF',
        short: 'SH_MOFF',
      },
      keywords: ['Swap Hands Momentary Off'],
    },
  },
  {
    desc: 'Turn off hand swap',
    keycodeInfo: {
      code: 22260,
      label: 'Swap Hands Off',
      name: {
        long: 'QK_SWAP_HANDS_OFF',
        short: 'SH_OFF',
      },
      keywords: ['Swap Hands Off'],
    },
  },
  {
    desc: 'Turn on hand swap',
    keycodeInfo: {
      code: 22261,
      label: 'Swap Hands On',
      name: {
        long: 'QK_SWAP_HANDS_ON',
        short: 'SH_ON',
      },
      keywords: ['Swap Hands On'],
    },
  },
  {
    desc: 'Turn on hand swap while held or until next key press',
    keycodeInfo: {
      code: 22262,
      label: 'Swap Hands One Shot',
      name: {
        long: 'QK_SWAP_HANDS_ONE_SHOT',
        short: 'SH_OS',
      },
      keywords: ['Swap Hands One Shot'],
    },
  },
  {
    desc: 'Swap Caps Lock and Left Control',
    keycodeInfo: {
      code: 28672,
      label: 'Magic Swap Control Caps Lock',
      name: {
        long: 'QK_MAGIC_SWAP_CONTROL_CAPS_LOCK',
        short: 'CL_SWAP',
      },
      keywords: ['Magic Swap Control Caps Lock'],
    },
  },
  {
    desc: 'Unswap Caps Lock and Left Control',
    keycodeInfo: {
      code: 28673,
      label: 'Magic Unswap Control Caps Lock',
      name: {
        long: 'QK_MAGIC_UNSWAP_CONTROL_CAPS_LOCK',
        short: 'CL_NORM',
      },
      keywords: ['Magic Unswap Control Caps Lock'],
    },
  },
  {
    desc: 'Toggle Caps Lock and Left Control swap',
    keycodeInfo: {
      code: 28674,
      label: 'Magic Toggle Control Caps Lock',
      name: {
        long: 'QK_MAGIC_TOGGLE_CONTROL_CAPS_LOCK',
        short: 'CL_TOGG',
      },
      keywords: ['Magic Toggle Control Caps Lock'],
    },
  },
  {
    desc: 'Stop treating Caps Lock as Control',
    keycodeInfo: {
      code: 28675,
      label: 'Magic Caps Lock As Control Off',
      name: {
        long: 'QK_MAGIC_CAPS_LOCK_AS_CONTROL_OFF',
        short: 'CL_CAPS',
      },
      keywords: ['Magic Caps Lock As Control Off'],
    },
  },
  {
    desc: 'Treat Caps Lock as Control',
    keycodeInfo: {
      code: 28676,
      label: 'Magic Caps Lock As Control On',
      name: {
        long: 'QK_MAGIC_CAPS_LOCK_AS_CONTROL_ON',
        short: 'CL_CTRL',
      },
      keywords: ['Magic Caps Lock As Control On'],
    },
  },
  {
    desc: 'Swap Left Alt and GUI',
    keycodeInfo: {
      code: 28677,
      label: 'Magic Swap Lalt Lgui',
      name: {
        long: 'QK_MAGIC_SWAP_LALT_LGUI',
        short: 'AG_LSWP',
      },
      keywords: ['Magic Swap Lalt Lgui'],
    },
  },
  {
    desc: 'Unswap Left Alt and GUI',
    keycodeInfo: {
      code: 28678,
      label: 'Magic Unswap Lalt Lgui',
      name: {
        long: 'QK_MAGIC_UNSWAP_LALT_LGUI',
        short: 'AG_LNRM',
      },
      keywords: ['Magic Unswap Lalt Lgui'],
    },
  },
  {
    desc: 'Swap Right Alt and GUI',
    keycodeInfo: {
      code: 28679,
      label: 'Magic Swap Ralt Rgui',
      name: {
        long: 'QK_MAGIC_SWAP_RALT_RGUI',
        short: 'AG_RSWP',
      },
      keywords: ['Magic Swap Ralt Rgui'],
    },
  },
  {
    desc: 'Unswap Right Alt and GUI',
    keycodeInfo: {
      code: 28680,
      label: 'Magic Unswap Ralt Rgui',
      name: {
        long: 'QK_MAGIC_UNSWAP_RALT_RGUI',
        short: 'AG_RNRM',
      },
      keywords: ['Magic Unswap Ralt Rgui'],
    },
  },
  {
    desc: 'Enable the GUI keys',
    keycodeInfo: {
      code: 28681,
      label: 'Magic Gui On',
      name: {
        long: 'QK_MAGIC_GUI_ON',
        short: 'GU_ON',
      },
      keywords: ['Magic Gui On'],
    },
  },
  {
    desc: 'Disable the GUI keys',
    keycodeInfo: {
      code: 28682,
      label: 'Magic Gui Off',
      name: {
        long: 'QK_MAGIC_GUI_OFF',
        short: 'GU_OFF',
      },
      keywords: ['Magic Gui Off'],
    },
  },
  {
    desc: 'Toggles the status of the GUI keys',
    keycodeInfo: {
      code: 28683,
      label: 'Magic Toggle Gui',
      name: {
        long: 'QK_MAGIC_TOGGLE_GUI',
        short: 'GU_TOGG',
      },
      keywords: ['Magic Toggle Gui'],
    },
  },
  {
    desc: 'Swap ` and Escape',
    keycodeInfo: {
      code: 28684,
      label: 'Magic Swap Grave Esc',
      name: {
        long: 'QK_MAGIC_SWAP_GRAVE_ESC',
        short: 'GE_SWAP',
      },
      keywords: ['Magic Swap Grave Esc'],
    },
  },
  {
    desc: 'Unswap ` and Escape',
    keycodeInfo: {
      code: 28685,
      label: 'Magic Unswap Grave Esc',
      name: {
        long: 'QK_MAGIC_UNSWAP_GRAVE_ESC',
        short: 'GE_NORM',
      },
      keywords: ['Magic Unswap Grave Esc'],
    },
  },
  {
    desc: 'Swap \\ and Backspace',
    keycodeInfo: {
      code: 28686,
      label: 'Magic Swap Backslash Backspace',
      name: {
        long: 'QK_MAGIC_SWAP_BACKSLASH_BACKSPACE',
        short: 'BS_SWAP',
      },
      keywords: ['Magic Swap Backslash Backspace'],
    },
  },
  {
    desc: 'Unswap \\ and Backspace',
    keycodeInfo: {
      code: 28687,
      label: 'Magic Unswap Backslash Backspace',
      name: {
        long: 'QK_MAGIC_UNSWAP_BACKSLASH_BACKSPACE',
        short: 'BS_NORM',
      },
      keywords: ['Magic Unswap Backslash Backspace'],
    },
  },
  {
    desc: 'Toggle \\ and Backspace swap state',
    keycodeInfo: {
      code: 28688,
      label: 'Magic Toggle Backslash Backspace',
      name: {
        long: 'QK_MAGIC_TOGGLE_BACKSLASH_BACKSPACE',
        short: 'BS_TOGG',
      },
      keywords: ['Magic Toggle Backslash Backspace'],
    },
  },
  {
    desc: 'Enable N-key rollover',
    keycodeInfo: {
      code: 28689,
      label: 'Magic Nkro On',
      name: {
        long: 'QK_MAGIC_NKRO_ON',
        short: 'NK_ON',
      },
      keywords: ['Magic Nkro On'],
    },
  },
  {
    desc: 'Disable N-key rollover',
    keycodeInfo: {
      code: 28690,
      label: 'Magic Nkro Off',
      name: {
        long: 'QK_MAGIC_NKRO_OFF',
        short: 'NK_OFF',
      },
      keywords: ['Magic Nkro Off'],
    },
  },
  {
    desc: 'Toggle N-key rollover',
    keycodeInfo: {
      code: 28691,
      label: 'Magic Toggle Nkro',
      name: {
        long: 'QK_MAGIC_TOGGLE_NKRO',
        short: 'NK_TOGG',
      },
      keywords: ['Magic Toggle Nkro'],
    },
  },
  {
    desc: 'Swap Alt and GUI on both sides',
    keycodeInfo: {
      code: 28692,
      label: 'Magic Swap Alt Gui',
      name: {
        long: 'QK_MAGIC_SWAP_ALT_GUI',
        short: 'AG_SWAP',
      },
      keywords: ['Magic Swap Alt Gui'],
    },
  },
  {
    desc: 'Unswap Alt and GUI on both sides',
    keycodeInfo: {
      code: 28693,
      label: 'Magic Unswap Alt Gui',
      name: {
        long: 'QK_MAGIC_UNSWAP_ALT_GUI',
        short: 'AG_NORM',
      },
      keywords: ['Magic Unswap Alt Gui'],
    },
  },
  {
    desc: 'Toggle Alt and GUI swap on both sides',
    keycodeInfo: {
      code: 28694,
      label: 'Magic Toggle Alt Gui',
      name: {
        long: 'QK_MAGIC_TOGGLE_ALT_GUI',
        short: 'AG_TOGG',
      },
      keywords: ['Magic Toggle Alt Gui'],
    },
  },
  {
    desc: 'Swap Left Control and GUI',
    keycodeInfo: {
      code: 28695,
      label: 'Magic Swap Lctl Lgui',
      name: {
        long: 'QK_MAGIC_SWAP_LCTL_LGUI',
        short: 'CG_LSWP',
      },
      keywords: ['Magic Swap Lctl Lgui'],
    },
  },
  {
    desc: 'Unswap Left Control and GUI',
    keycodeInfo: {
      code: 28696,
      label: 'Magic Unswap Lctl Lgui',
      name: {
        long: 'QK_MAGIC_UNSWAP_LCTL_LGUI',
        short: 'CG_LNRM',
      },
      keywords: ['Magic Unswap Lctl Lgui'],
    },
  },
  {
    desc: 'Swap Right Control and GUI',
    keycodeInfo: {
      code: 28697,
      label: 'Magic Swap Rctl Rgui',
      name: {
        long: 'QK_MAGIC_SWAP_RCTL_RGUI',
        short: 'CG_RSWP',
      },
      keywords: ['Magic Swap Rctl Rgui'],
    },
  },
  {
    desc: 'Unswap Right Control and GUI',
    keycodeInfo: {
      code: 28698,
      label: 'Magic Unswap Rctl Rgui',
      name: {
        long: 'QK_MAGIC_UNSWAP_RCTL_RGUI',
        short: 'CG_RNRM',
      },
      keywords: ['Magic Unswap Rctl Rgui'],
    },
  },
  {
    desc: 'Swap Control and GUI on both sides',
    keycodeInfo: {
      code: 28699,
      label: 'Magic Swap Ctl Gui',
      name: {
        long: 'QK_MAGIC_SWAP_CTL_GUI',
        short: 'CG_SWAP',
      },
      keywords: ['Magic Swap Ctl Gui'],
    },
  },
  {
    desc: 'Unswap Control and GUI on both sides',
    keycodeInfo: {
      code: 28700,
      label: 'Magic Unswap Ctl Gui',
      name: {
        long: 'QK_MAGIC_UNSWAP_CTL_GUI',
        short: 'CG_NORM',
      },
      keywords: ['Magic Unswap Ctl Gui'],
    },
  },
  {
    desc: 'Toggle Control and GUI swap on both sides',
    keycodeInfo: {
      code: 28701,
      label: 'Magic Toggle Ctl Gui',
      name: {
        long: 'QK_MAGIC_TOGGLE_CTL_GUI',
        short: 'CG_TOGG',
      },
      keywords: ['Magic Toggle Ctl Gui'],
    },
  },
  {
    desc: 'Set the master half of a split keyboard as the left hand (for EE_HANDS)',
    keycodeInfo: {
      code: 28702,
      label: 'Magic Ee Hands Left',
      name: {
        long: 'QK_MAGIC_EE_HANDS_LEFT',
        short: 'EH_LEFT',
      },
      keywords: ['Magic Ee Hands Left'],
    },
  },
  {
    desc: 'Set the master half of a split keyboard as the right hand (for EE_HANDS)',
    keycodeInfo: {
      code: 28703,
      label: 'Magic Ee Hands Right',
      name: {
        long: 'QK_MAGIC_EE_HANDS_RIGHT',
        short: 'EH_RGHT',
      },
      keywords: ['Magic Ee Hands Right'],
    },
  },
  {
    desc: 'Swap Caps Lock and Escape',
    keycodeInfo: {
      code: 28704,
      label: 'Magic Swap Escape Caps Lock',
      name: {
        long: 'QK_MAGIC_SWAP_ESCAPE_CAPS_LOCK',
        short: 'EC_SWAP',
      },
      keywords: ['Magic Swap Escape Caps Lock'],
    },
  },
  {
    desc: 'Unswap Caps Lock and Escape',
    keycodeInfo: {
      code: 28705,
      label: 'Magic Unswap Escape Caps Lock',
      name: {
        long: 'QK_MAGIC_UNSWAP_ESCAPE_CAPS_LOCK',
        short: 'EC_NORM',
      },
      keywords: ['Magic Unswap Escape Caps Lock'],
    },
  },
  {
    desc: 'Toggle Caps Lock and Escape swap',
    keycodeInfo: {
      code: 28706,
      label: 'Magic Toggle Escape Caps Lock',
      name: {
        long: 'QK_MAGIC_TOGGLE_ESCAPE_CAPS_LOCK',
        short: 'EC_TOGG',
      },
      keywords: ['Magic Toggle Escape Caps Lock'],
    },
  },
  {
    desc: 'Turn MIDI on',
    keycodeInfo: {
      code: 28928,
      label: 'Midi On',
      name: {
        long: 'QK_MIDI_ON',
        short: 'MI_ON',
      },
      keywords: ['Midi On'],
    },
  },
  {
    desc: 'Turn MIDI off',
    keycodeInfo: {
      code: 28929,
      label: 'Midi Off',
      name: {
        long: 'QK_MIDI_OFF',
        short: 'MI_OFF',
      },
      keywords: ['Midi Off'],
    },
  },
  {
    desc: 'Toggle MIDI enabled',
    keycodeInfo: {
      code: 28930,
      label: 'Midi Toggle',
      name: {
        long: 'QK_MIDI_TOGGLE',
        short: 'MI_TOGG',
      },
      keywords: ['Midi Toggle'],
    },
  },
  {
    desc: 'C octave 0',
    keycodeInfo: {
      code: 28931,
      label: 'Midi Note C 0',
      name: {
        long: 'QK_MIDI_NOTE_C_0',
        short: 'MI_C',
      },
      keywords: ['Midi Note C 0'],
    },
  },
  {
    desc: 'C♯/D♭ octave 0',
    keycodeInfo: {
      code: 28932,
      label: 'Midi Note C Sharp 0',
      name: {
        long: 'QK_MIDI_NOTE_C_SHARP_0',
        short: 'MI_Cs',
      },
      keywords: ['Midi Note C Sharp 0'],
    },
  },
  {
    desc: 'D octave 0',
    keycodeInfo: {
      code: 28933,
      label: 'Midi Note D 0',
      name: {
        long: 'QK_MIDI_NOTE_D_0',
        short: 'MI_D',
      },
      keywords: ['Midi Note D 0'],
    },
  },
  {
    desc: 'D♯/E♭ octave 0',
    keycodeInfo: {
      code: 28934,
      label: 'Midi Note D Sharp 0',
      name: {
        long: 'QK_MIDI_NOTE_D_SHARP_0',
        short: 'MI_Ds',
      },
      keywords: ['Midi Note D Sharp 0'],
    },
  },
  {
    desc: 'E octave 0',
    keycodeInfo: {
      code: 28935,
      label: 'Midi Note E 0',
      name: {
        long: 'QK_MIDI_NOTE_E_0',
        short: 'MI_E',
      },
      keywords: ['Midi Note E 0'],
    },
  },
  {
    desc: 'F octave 0',
    keycodeInfo: {
      code: 28936,
      label: 'Midi Note F 0',
      name: {
        long: 'QK_MIDI_NOTE_F_0',
        short: 'MI_F',
      },
      keywords: ['Midi Note F 0'],
    },
  },
  {
    desc: 'F♯/G♭ octave 0',
    keycodeInfo: {
      code: 28937,
      label: 'Midi Note F Sharp 0',
      name: {
        long: 'QK_MIDI_NOTE_F_SHARP_0',
        short: 'MI_Fs',
      },
      keywords: ['Midi Note F Sharp 0'],
    },
  },
  {
    desc: 'G octave 0',
    keycodeInfo: {
      code: 28938,
      label: 'Midi Note G 0',
      name: {
        long: 'QK_MIDI_NOTE_G_0',
        short: 'MI_G',
      },
      keywords: ['Midi Note G 0'],
    },
  },
  {
    desc: 'G♯/A♭ octave 0',
    keycodeInfo: {
      code: 28939,
      label: 'Midi Note G Sharp 0',
      name: {
        long: 'QK_MIDI_NOTE_G_SHARP_0',
        short: 'MI_Gs',
      },
      keywords: ['Midi Note G Sharp 0'],
    },
  },
  {
    desc: 'A octave 0',
    keycodeInfo: {
      code: 28940,
      label: 'Midi Note A 0',
      name: {
        long: 'QK_MIDI_NOTE_A_0',
        short: 'MI_A',
      },
      keywords: ['Midi Note A 0'],
    },
  },
  {
    desc: 'A♯/B♭ octave 0',
    keycodeInfo: {
      code: 28941,
      label: 'Midi Note A Sharp 0',
      name: {
        long: 'QK_MIDI_NOTE_A_SHARP_0',
        short: 'MI_As',
      },
      keywords: ['Midi Note A Sharp 0'],
    },
  },
  {
    desc: 'B octave 0',
    keycodeInfo: {
      code: 28942,
      label: 'Midi Note B 0',
      name: {
        long: 'QK_MIDI_NOTE_B_0',
        short: 'MI_B',
      },
      keywords: ['Midi Note B 0'],
    },
  },
  {
    desc: 'C octave 1',
    keycodeInfo: {
      code: 28943,
      label: 'Midi Note C 1',
      name: {
        long: 'QK_MIDI_NOTE_C_1',
        short: 'MI_C1',
      },
      keywords: ['Midi Note C 1'],
    },
  },
  {
    desc: 'C♯/D♭ octave 1',
    keycodeInfo: {
      code: 28944,
      label: 'Midi Note C Sharp 1',
      name: {
        long: 'QK_MIDI_NOTE_C_SHARP_1',
        short: 'MI_Cs1',
      },
      keywords: ['Midi Note C Sharp 1'],
    },
  },
  {
    desc: 'D octave 1',
    keycodeInfo: {
      code: 28945,
      label: 'Midi Note D 1',
      name: {
        long: 'QK_MIDI_NOTE_D_1',
        short: 'MI_D1',
      },
      keywords: ['Midi Note D 1'],
    },
  },
  {
    desc: 'D♯/E♭ octave 1',
    keycodeInfo: {
      code: 28946,
      label: 'Midi Note D Sharp 1',
      name: {
        long: 'QK_MIDI_NOTE_D_SHARP_1',
        short: 'MI_Ds1',
      },
      keywords: ['Midi Note D Sharp 1'],
    },
  },
  {
    desc: 'E octave 1',
    keycodeInfo: {
      code: 28947,
      label: 'Midi Note E 1',
      name: {
        long: 'QK_MIDI_NOTE_E_1',
        short: 'MI_E1',
      },
      keywords: ['Midi Note E 1'],
    },
  },
  {
    desc: 'F octave 1',
    keycodeInfo: {
      code: 28948,
      label: 'Midi Note F 1',
      name: {
        long: 'QK_MIDI_NOTE_F_1',
        short: 'MI_F1',
      },
      keywords: ['Midi Note F 1'],
    },
  },
  {
    desc: 'F♯/G♭ octave 1',
    keycodeInfo: {
      code: 28949,
      label: 'Midi Note F Sharp 1',
      name: {
        long: 'QK_MIDI_NOTE_F_SHARP_1',
        short: 'MI_Fs1',
      },
      keywords: ['Midi Note F Sharp 1'],
    },
  },
  {
    desc: 'G octave 1',
    keycodeInfo: {
      code: 28950,
      label: 'Midi Note G 1',
      name: {
        long: 'QK_MIDI_NOTE_G_1',
        short: 'MI_G1',
      },
      keywords: ['Midi Note G 1'],
    },
  },
  {
    desc: 'G♯/A♭ octave 1',
    keycodeInfo: {
      code: 28951,
      label: 'Midi Note G Sharp 1',
      name: {
        long: 'QK_MIDI_NOTE_G_SHARP_1',
        short: 'MI_Gs1',
      },
      keywords: ['Midi Note G Sharp 1'],
    },
  },
  {
    desc: 'A octave 1',
    keycodeInfo: {
      code: 28952,
      label: 'Midi Note A 1',
      name: {
        long: 'QK_MIDI_NOTE_A_1',
        short: 'MI_A1',
      },
      keywords: ['Midi Note A 1'],
    },
  },
  {
    desc: 'A♯/B♭ octave 1',
    keycodeInfo: {
      code: 28953,
      label: 'Midi Note A Sharp 1',
      name: {
        long: 'QK_MIDI_NOTE_A_SHARP_1',
        short: 'MI_As1',
      },
      keywords: ['Midi Note A Sharp 1'],
    },
  },
  {
    desc: 'B octave 1',
    keycodeInfo: {
      code: 28954,
      label: 'Midi Note B 1',
      name: {
        long: 'QK_MIDI_NOTE_B_1',
        short: 'MI_B1',
      },
      keywords: ['Midi Note B 1'],
    },
  },
  {
    desc: 'C octave 2',
    keycodeInfo: {
      code: 28955,
      label: 'Midi Note C 2',
      name: {
        long: 'QK_MIDI_NOTE_C_2',
        short: 'MI_C2',
      },
      keywords: ['Midi Note C 2'],
    },
  },
  {
    desc: 'C♯/D♭ octave 2',
    keycodeInfo: {
      code: 28956,
      label: 'Midi Note C Sharp 2',
      name: {
        long: 'QK_MIDI_NOTE_C_SHARP_2',
        short: 'MI_Cs2',
      },
      keywords: ['Midi Note C Sharp 2'],
    },
  },
  {
    desc: 'D octave 2',
    keycodeInfo: {
      code: 28957,
      label: 'Midi Note D 2',
      name: {
        long: 'QK_MIDI_NOTE_D_2',
        short: 'MI_D2',
      },
      keywords: ['Midi Note D 2'],
    },
  },
  {
    desc: 'D♯/E♭ octave 2',
    keycodeInfo: {
      code: 28958,
      label: 'Midi Note D Sharp 2',
      name: {
        long: 'QK_MIDI_NOTE_D_SHARP_2',
        short: 'MI_Ds2',
      },
      keywords: ['Midi Note D Sharp 2'],
    },
  },
  {
    desc: 'E octave 2',
    keycodeInfo: {
      code: 28959,
      label: 'Midi Note E 2',
      name: {
        long: 'QK_MIDI_NOTE_E_2',
        short: 'MI_E2',
      },
      keywords: ['Midi Note E 2'],
    },
  },
  {
    desc: 'F octave 2',
    keycodeInfo: {
      code: 28960,
      label: 'Midi Note F 2',
      name: {
        long: 'QK_MIDI_NOTE_F_2',
        short: 'MI_F2',
      },
      keywords: ['Midi Note F 2'],
    },
  },
  {
    desc: 'F♯/G♭ octave 2',
    keycodeInfo: {
      code: 28961,
      label: 'Midi Note F Sharp 2',
      name: {
        long: 'QK_MIDI_NOTE_F_SHARP_2',
        short: 'MI_Fs2',
      },
      keywords: ['Midi Note F Sharp 2'],
    },
  },
  {
    desc: 'G octave 2',
    keycodeInfo: {
      code: 28962,
      label: 'Midi Note G 2',
      name: {
        long: 'QK_MIDI_NOTE_G_2',
        short: 'MI_G2',
      },
      keywords: ['Midi Note G 2'],
    },
  },
  {
    desc: 'G♯/A♭ octave 2',
    keycodeInfo: {
      code: 28963,
      label: 'Midi Note G Sharp 2',
      name: {
        long: 'QK_MIDI_NOTE_G_SHARP_2',
        short: 'MI_Gs2',
      },
      keywords: ['Midi Note G Sharp 2'],
    },
  },
  {
    desc: 'A octave 2',
    keycodeInfo: {
      code: 28964,
      label: 'Midi Note A 2',
      name: {
        long: 'QK_MIDI_NOTE_A_2',
        short: 'MI_A2',
      },
      keywords: ['Midi Note A 2'],
    },
  },
  {
    desc: 'A♯/B♭ octave 2',
    keycodeInfo: {
      code: 28965,
      label: 'Midi Note A Sharp 2',
      name: {
        long: 'QK_MIDI_NOTE_A_SHARP_2',
        short: 'MI_As2',
      },
      keywords: ['Midi Note A Sharp 2'],
    },
  },
  {
    desc: 'B octave 2',
    keycodeInfo: {
      code: 28966,
      label: 'Midi Note B 2',
      name: {
        long: 'QK_MIDI_NOTE_B_2',
        short: 'MI_B2',
      },
      keywords: ['Midi Note B 2'],
    },
  },
  {
    desc: 'C octave 3',
    keycodeInfo: {
      code: 28967,
      label: 'Midi Note C 3',
      name: {
        long: 'QK_MIDI_NOTE_C_3',
        short: 'MI_C3',
      },
      keywords: ['Midi Note C 3'],
    },
  },
  {
    desc: 'C♯/D♭ octave 3',
    keycodeInfo: {
      code: 28968,
      label: 'Midi Note C Sharp 3',
      name: {
        long: 'QK_MIDI_NOTE_C_SHARP_3',
        short: 'MI_Cs3',
      },
      keywords: ['Midi Note C Sharp 3'],
    },
  },
  {
    desc: 'D octave 3',
    keycodeInfo: {
      code: 28969,
      label: 'Midi Note D 3',
      name: {
        long: 'QK_MIDI_NOTE_D_3',
        short: 'MI_D3',
      },
      keywords: ['Midi Note D 3'],
    },
  },
  {
    desc: 'D♯/E♭ octave 3',
    keycodeInfo: {
      code: 28970,
      label: 'Midi Note D Sharp 3',
      name: {
        long: 'QK_MIDI_NOTE_D_SHARP_3',
        short: 'MI_Ds3',
      },
      keywords: ['Midi Note D Sharp 3'],
    },
  },
  {
    desc: 'E octave 3',
    keycodeInfo: {
      code: 28971,
      label: 'Midi Note E 3',
      name: {
        long: 'QK_MIDI_NOTE_E_3',
        short: 'MI_E3',
      },
      keywords: ['Midi Note E 3'],
    },
  },
  {
    desc: 'F octave 3',
    keycodeInfo: {
      code: 28972,
      label: 'Midi Note F 3',
      name: {
        long: 'QK_MIDI_NOTE_F_3',
        short: 'MI_F3',
      },
      keywords: ['Midi Note F 3'],
    },
  },
  {
    desc: 'F♯/G♭ octave 3',
    keycodeInfo: {
      code: 28973,
      label: 'Midi Note F Sharp 3',
      name: {
        long: 'QK_MIDI_NOTE_F_SHARP_3',
        short: 'MI_Fs3',
      },
      keywords: ['Midi Note F Sharp 3'],
    },
  },
  {
    desc: 'G octave 3',
    keycodeInfo: {
      code: 28974,
      label: 'Midi Note G 3',
      name: {
        long: 'QK_MIDI_NOTE_G_3',
        short: 'MI_G3',
      },
      keywords: ['Midi Note G 3'],
    },
  },
  {
    desc: 'G♯/A♭ octave 3',
    keycodeInfo: {
      code: 28975,
      label: 'Midi Note G Sharp 3',
      name: {
        long: 'QK_MIDI_NOTE_G_SHARP_3',
        short: 'MI_Gs3',
      },
      keywords: ['Midi Note G Sharp 3'],
    },
  },
  {
    desc: 'A octave 3',
    keycodeInfo: {
      code: 28976,
      label: 'Midi Note A 3',
      name: {
        long: 'QK_MIDI_NOTE_A_3',
        short: 'MI_A3',
      },
      keywords: ['Midi Note A 3'],
    },
  },
  {
    desc: 'A♯/B♭ octave 3',
    keycodeInfo: {
      code: 28977,
      label: 'Midi Note A Sharp 3',
      name: {
        long: 'QK_MIDI_NOTE_A_SHARP_3',
        short: 'MI_As3',
      },
      keywords: ['Midi Note A Sharp 3'],
    },
  },
  {
    desc: 'B octave 3',
    keycodeInfo: {
      code: 28978,
      label: 'Midi Note B 3',
      name: {
        long: 'QK_MIDI_NOTE_B_3',
        short: 'MI_B3',
      },
      keywords: ['Midi Note B 3'],
    },
  },
  {
    desc: 'C octave 4',
    keycodeInfo: {
      code: 28979,
      label: 'Midi Note C 4',
      name: {
        long: 'QK_MIDI_NOTE_C_4',
        short: 'MI_C4',
      },
      keywords: ['Midi Note C 4'],
    },
  },
  {
    desc: 'C♯/D♭ octave 4',
    keycodeInfo: {
      code: 28980,
      label: 'Midi Note C Sharp 4',
      name: {
        long: 'QK_MIDI_NOTE_C_SHARP_4',
        short: 'MI_Cs4',
      },
      keywords: ['Midi Note C Sharp 4'],
    },
  },
  {
    desc: 'D octave 4',
    keycodeInfo: {
      code: 28981,
      label: 'Midi Note D 4',
      name: {
        long: 'QK_MIDI_NOTE_D_4',
        short: 'MI_D4',
      },
      keywords: ['Midi Note D 4'],
    },
  },
  {
    desc: 'D♯/E♭ octave 4',
    keycodeInfo: {
      code: 28982,
      label: 'Midi Note D Sharp 4',
      name: {
        long: 'QK_MIDI_NOTE_D_SHARP_4',
        short: 'MI_Ds4',
      },
      keywords: ['Midi Note D Sharp 4'],
    },
  },
  {
    desc: 'E octave 4',
    keycodeInfo: {
      code: 28983,
      label: 'Midi Note E 4',
      name: {
        long: 'QK_MIDI_NOTE_E_4',
        short: 'MI_E4',
      },
      keywords: ['Midi Note E 4'],
    },
  },
  {
    desc: 'F octave 4',
    keycodeInfo: {
      code: 28984,
      label: 'Midi Note F 4',
      name: {
        long: 'QK_MIDI_NOTE_F_4',
        short: 'MI_F4',
      },
      keywords: ['Midi Note F 4'],
    },
  },
  {
    desc: 'F♯/G♭ octave 4',
    keycodeInfo: {
      code: 28985,
      label: 'Midi Note F Sharp 4',
      name: {
        long: 'QK_MIDI_NOTE_F_SHARP_4',
        short: 'MI_Fs4',
      },
      keywords: ['Midi Note F Sharp 4'],
    },
  },
  {
    desc: 'G octave 4',
    keycodeInfo: {
      code: 28986,
      label: 'Midi Note G 4',
      name: {
        long: 'QK_MIDI_NOTE_G_4',
        short: 'MI_G4',
      },
      keywords: ['Midi Note G 4'],
    },
  },
  {
    desc: 'G♯/A♭ octave 4',
    keycodeInfo: {
      code: 28987,
      label: 'Midi Note G Sharp 4',
      name: {
        long: 'QK_MIDI_NOTE_G_SHARP_4',
        short: 'MI_Gs4',
      },
      keywords: ['Midi Note G Sharp 4'],
    },
  },
  {
    desc: 'A octave 4',
    keycodeInfo: {
      code: 28988,
      label: 'Midi Note A 4',
      name: {
        long: 'QK_MIDI_NOTE_A_4',
        short: 'MI_A4',
      },
      keywords: ['Midi Note A 4'],
    },
  },
  {
    desc: 'A♯/B♭ octave 4',
    keycodeInfo: {
      code: 28989,
      label: 'Midi Note A Sharp 4',
      name: {
        long: 'QK_MIDI_NOTE_A_SHARP_4',
        short: 'MI_As4',
      },
      keywords: ['Midi Note A Sharp 4'],
    },
  },
  {
    desc: 'B octave 4',
    keycodeInfo: {
      code: 28990,
      label: 'Midi Note B 4',
      name: {
        long: 'QK_MIDI_NOTE_B_4',
        short: 'MI_B4',
      },
      keywords: ['Midi Note B 4'],
    },
  },
  {
    desc: 'C octave 5',
    keycodeInfo: {
      code: 28991,
      label: 'Midi Note C 5',
      name: {
        long: 'QK_MIDI_NOTE_C_5',
        short: 'MI_C5',
      },
      keywords: ['Midi Note C 5'],
    },
  },
  {
    desc: 'C♯/D♭ octave 5',
    keycodeInfo: {
      code: 28992,
      label: 'Midi Note C Sharp 5',
      name: {
        long: 'QK_MIDI_NOTE_C_SHARP_5',
        short: 'MI_Cs5',
      },
      keywords: ['Midi Note C Sharp 5'],
    },
  },
  {
    desc: 'D octave 5',
    keycodeInfo: {
      code: 28993,
      label: 'Midi Note D 5',
      name: {
        long: 'QK_MIDI_NOTE_D_5',
        short: 'MI_D5',
      },
      keywords: ['Midi Note D 5'],
    },
  },
  {
    desc: 'D♯/E♭ octave 5',
    keycodeInfo: {
      code: 28994,
      label: 'Midi Note D Sharp 5',
      name: {
        long: 'QK_MIDI_NOTE_D_SHARP_5',
        short: 'MI_Ds5',
      },
      keywords: ['Midi Note D Sharp 5'],
    },
  },
  {
    desc: 'E octave 5',
    keycodeInfo: {
      code: 28995,
      label: 'Midi Note E 5',
      name: {
        long: 'QK_MIDI_NOTE_E_5',
        short: 'MI_E5',
      },
      keywords: ['Midi Note E 5'],
    },
  },
  {
    desc: 'F octave 5',
    keycodeInfo: {
      code: 28996,
      label: 'Midi Note F 5',
      name: {
        long: 'QK_MIDI_NOTE_F_5',
        short: 'MI_F5',
      },
      keywords: ['Midi Note F 5'],
    },
  },
  {
    desc: 'F♯/G♭ octave 5',
    keycodeInfo: {
      code: 28997,
      label: 'Midi Note F Sharp 5',
      name: {
        long: 'QK_MIDI_NOTE_F_SHARP_5',
        short: 'MI_Fs5',
      },
      keywords: ['Midi Note F Sharp 5'],
    },
  },
  {
    desc: 'G octave 5',
    keycodeInfo: {
      code: 28998,
      label: 'Midi Note G 5',
      name: {
        long: 'QK_MIDI_NOTE_G_5',
        short: 'MI_G5',
      },
      keywords: ['Midi Note G 5'],
    },
  },
  {
    desc: 'G♯/A♭ octave 5',
    keycodeInfo: {
      code: 28999,
      label: 'Midi Note G Sharp 5',
      name: {
        long: 'QK_MIDI_NOTE_G_SHARP_5',
        short: 'MI_Gs5',
      },
      keywords: ['Midi Note G Sharp 5'],
    },
  },
  {
    desc: 'A octave 5',
    keycodeInfo: {
      code: 29000,
      label: 'Midi Note A 5',
      name: {
        long: 'QK_MIDI_NOTE_A_5',
        short: 'MI_A5',
      },
      keywords: ['Midi Note A 5'],
    },
  },
  {
    desc: 'A♯/B♭ octave 5',
    keycodeInfo: {
      code: 29001,
      label: 'Midi Note A Sharp 5',
      name: {
        long: 'QK_MIDI_NOTE_A_SHARP_5',
        short: 'MI_As5',
      },
      keywords: ['Midi Note A Sharp 5'],
    },
  },
  {
    desc: 'B octave 5',
    keycodeInfo: {
      code: 29002,
      label: 'Midi Note B 5',
      name: {
        long: 'QK_MIDI_NOTE_B_5',
        short: 'MI_B5',
      },
      keywords: ['Midi Note B 5'],
    },
  },
  {
    desc: 'Set octave to -2',
    keycodeInfo: {
      code: 29003,
      label: 'Midi Octave N2',
      name: {
        long: 'QK_MIDI_OCTAVE_N2',
        short: 'MI_OCN2',
      },
      keywords: ['Midi Octave N2'],
    },
  },
  {
    desc: 'Set octave to -1',
    keycodeInfo: {
      code: 29004,
      label: 'Midi Octave N1',
      name: {
        long: 'QK_MIDI_OCTAVE_N1',
        short: 'MI_OCN1',
      },
      keywords: ['Midi Octave N1'],
    },
  },
  {
    desc: 'Set octave to 0',
    keycodeInfo: {
      code: 29005,
      label: 'Midi Octave 0',
      name: {
        long: 'QK_MIDI_OCTAVE_0',
        short: 'MI_OC0',
      },
      keywords: ['Midi Octave 0'],
    },
  },
  {
    desc: 'Set octave to 1',
    keycodeInfo: {
      code: 29006,
      label: 'Midi Octave 1',
      name: {
        long: 'QK_MIDI_OCTAVE_1',
        short: 'MI_OC1',
      },
      keywords: ['Midi Octave 1'],
    },
  },
  {
    desc: 'Set octave to 2',
    keycodeInfo: {
      code: 29007,
      label: 'Midi Octave 2',
      name: {
        long: 'QK_MIDI_OCTAVE_2',
        short: 'MI_OC2',
      },
      keywords: ['Midi Octave 2'],
    },
  },
  {
    desc: 'Set octave to 3',
    keycodeInfo: {
      code: 29008,
      label: 'Midi Octave 3',
      name: {
        long: 'QK_MIDI_OCTAVE_3',
        short: 'MI_OC3',
      },
      keywords: ['Midi Octave 3'],
    },
  },
  {
    desc: 'Set octave to 4',
    keycodeInfo: {
      code: 29009,
      label: 'Midi Octave 4',
      name: {
        long: 'QK_MIDI_OCTAVE_4',
        short: 'MI_OC4',
      },
      keywords: ['Midi Octave 4'],
    },
  },
  {
    desc: 'Set octave to 5',
    keycodeInfo: {
      code: 29010,
      label: 'Midi Octave 5',
      name: {
        long: 'QK_MIDI_OCTAVE_5',
        short: 'MI_OC5',
      },
      keywords: ['Midi Octave 5'],
    },
  },
  {
    desc: 'Set octave to 6',
    keycodeInfo: {
      code: 29011,
      label: 'Midi Octave 6',
      name: {
        long: 'QK_MIDI_OCTAVE_6',
        short: 'MI_OC6',
      },
      keywords: ['Midi Octave 6'],
    },
  },
  {
    desc: 'Set octave to 7',
    keycodeInfo: {
      code: 29012,
      label: 'Midi Octave 7',
      name: {
        long: 'QK_MIDI_OCTAVE_7',
        short: 'MI_OC7',
      },
      keywords: ['Midi Octave 7'],
    },
  },
  {
    desc: 'Move down an octave',
    keycodeInfo: {
      code: 29013,
      label: 'Midi Octave Down',
      name: {
        long: 'QK_MIDI_OCTAVE_DOWN',
        short: 'MI_OCTD',
      },
      keywords: ['Midi Octave Down'],
    },
  },
  {
    desc: 'Move up an octave',
    keycodeInfo: {
      code: 29014,
      label: 'Midi Octave Up',
      name: {
        long: 'QK_MIDI_OCTAVE_UP',
        short: 'MI_OCTU',
      },
      keywords: ['Midi Octave Up'],
    },
  },
  {
    desc: 'Set transposition to -6 semitones',
    keycodeInfo: {
      code: 29015,
      label: 'Midi Transpose N6',
      name: {
        long: 'QK_MIDI_TRANSPOSE_N6',
        short: 'MI_TRN6',
      },
      keywords: ['Midi Transpose N6'],
    },
  },
  {
    desc: 'Set transposition to -5 semitones',
    keycodeInfo: {
      code: 29016,
      label: 'Midi Transpose N5',
      name: {
        long: 'QK_MIDI_TRANSPOSE_N5',
        short: 'MI_TRN5',
      },
      keywords: ['Midi Transpose N5'],
    },
  },
  {
    desc: 'Set transposition to -4 semitones',
    keycodeInfo: {
      code: 29017,
      label: 'Midi Transpose N4',
      name: {
        long: 'QK_MIDI_TRANSPOSE_N4',
        short: 'MI_TRN4',
      },
      keywords: ['Midi Transpose N4'],
    },
  },
  {
    desc: 'Set transposition to -3 semitones',
    keycodeInfo: {
      code: 29018,
      label: 'Midi Transpose N3',
      name: {
        long: 'QK_MIDI_TRANSPOSE_N3',
        short: 'MI_TRN3',
      },
      keywords: ['Midi Transpose N3'],
    },
  },
  {
    desc: 'Set transposition to -2 semitones',
    keycodeInfo: {
      code: 29019,
      label: 'Midi Transpose N2',
      name: {
        long: 'QK_MIDI_TRANSPOSE_N2',
        short: 'MI_TRN2',
      },
      keywords: ['Midi Transpose N2'],
    },
  },
  {
    desc: 'Set transposition to -1 semitone',
    keycodeInfo: {
      code: 29020,
      label: 'Midi Transpose N1',
      name: {
        long: 'QK_MIDI_TRANSPOSE_N1',
        short: 'MI_TRN1',
      },
      keywords: ['Midi Transpose N1'],
    },
  },
  {
    desc: 'No transposition',
    keycodeInfo: {
      code: 29021,
      label: 'Midi Transpose 0',
      name: {
        long: 'QK_MIDI_TRANSPOSE_0',
        short: 'MI_TR0',
      },
      keywords: ['Midi Transpose 0'],
    },
  },
  {
    desc: 'Set transposition to +1 semitone',
    keycodeInfo: {
      code: 29022,
      label: 'Midi Transpose 1',
      name: {
        long: 'QK_MIDI_TRANSPOSE_1',
        short: 'MI_TR1',
      },
      keywords: ['Midi Transpose 1'],
    },
  },
  {
    desc: 'Set transposition to +2 semitones',
    keycodeInfo: {
      code: 29023,
      label: 'Midi Transpose 2',
      name: {
        long: 'QK_MIDI_TRANSPOSE_2',
        short: 'MI_TR2',
      },
      keywords: ['Midi Transpose 2'],
    },
  },
  {
    desc: 'Set transposition to +3 semitones',
    keycodeInfo: {
      code: 29024,
      label: 'Midi Transpose 3',
      name: {
        long: 'QK_MIDI_TRANSPOSE_3',
        short: 'MI_TR3',
      },
      keywords: ['Midi Transpose 3'],
    },
  },
  {
    desc: 'Set transposition to +4 semitones',
    keycodeInfo: {
      code: 29025,
      label: 'Midi Transpose 4',
      name: {
        long: 'QK_MIDI_TRANSPOSE_4',
        short: 'MI_TR4',
      },
      keywords: ['Midi Transpose 4'],
    },
  },
  {
    desc: 'Set transposition to +5 semitones',
    keycodeInfo: {
      code: 29026,
      label: 'Midi Transpose 5',
      name: {
        long: 'QK_MIDI_TRANSPOSE_5',
        short: 'MI_TR5',
      },
      keywords: ['Midi Transpose 5'],
    },
  },
  {
    desc: 'Set transposition to +6 semitones',
    keycodeInfo: {
      code: 29027,
      label: 'Midi Transpose 6',
      name: {
        long: 'QK_MIDI_TRANSPOSE_6',
        short: 'MI_TR6',
      },
      keywords: ['Midi Transpose 6'],
    },
  },
  {
    desc: 'Decrease transposition',
    keycodeInfo: {
      code: 29028,
      label: 'Midi Transpose Down',
      name: {
        long: 'QK_MIDI_TRANSPOSE_DOWN',
        short: 'MI_TRSD',
      },
      keywords: ['Midi Transpose Down'],
    },
  },
  {
    desc: 'Increase transposition',
    keycodeInfo: {
      code: 29029,
      label: 'Midi Transpose Up',
      name: {
        long: 'QK_MIDI_TRANSPOSE_UP',
        short: 'MI_TRSU',
      },
      keywords: ['Midi Transpose Up'],
    },
  },
  {
    desc: 'Set velocity to 0',
    keycodeInfo: {
      code: 29030,
      label: 'Midi Velocity 0',
      name: {
        long: 'QK_MIDI_VELOCITY_0',
        short: 'MI_VL0',
      },
      keywords: ['Midi Velocity 0'],
    },
  },
  {
    desc: 'Set velocity to 12',
    keycodeInfo: {
      code: 29031,
      label: 'Midi Velocity 1',
      name: {
        long: 'QK_MIDI_VELOCITY_1',
        short: 'MI_VL1',
      },
      keywords: ['Midi Velocity 1'],
    },
  },
  {
    desc: 'Set velocity to 25',
    keycodeInfo: {
      code: 29032,
      label: 'Midi Velocity 2',
      name: {
        long: 'QK_MIDI_VELOCITY_2',
        short: 'MI_VL2',
      },
      keywords: ['Midi Velocity 2'],
    },
  },
  {
    desc: 'Set velocity to 38',
    keycodeInfo: {
      code: 29033,
      label: 'Midi Velocity 3',
      name: {
        long: 'QK_MIDI_VELOCITY_3',
        short: 'MI_VL3',
      },
      keywords: ['Midi Velocity 3'],
    },
  },
  {
    desc: 'Set velocity to 51',
    keycodeInfo: {
      code: 29034,
      label: 'Midi Velocity 4',
      name: {
        long: 'QK_MIDI_VELOCITY_4',
        short: 'MI_VL4',
      },
      keywords: ['Midi Velocity 4'],
    },
  },
  {
    desc: 'Set velocity to 64',
    keycodeInfo: {
      code: 29035,
      label: 'Midi Velocity 5',
      name: {
        long: 'QK_MIDI_VELOCITY_5',
        short: 'MI_VL5',
      },
      keywords: ['Midi Velocity 5'],
    },
  },
  {
    desc: 'Set velocity to 76',
    keycodeInfo: {
      code: 29036,
      label: 'Midi Velocity 6',
      name: {
        long: 'QK_MIDI_VELOCITY_6',
        short: 'MI_VL6',
      },
      keywords: ['Midi Velocity 6'],
    },
  },
  {
    desc: 'Set velocity to 89',
    keycodeInfo: {
      code: 29037,
      label: 'Midi Velocity 7',
      name: {
        long: 'QK_MIDI_VELOCITY_7',
        short: 'MI_VL7',
      },
      keywords: ['Midi Velocity 7'],
    },
  },
  {
    desc: 'Set velocity to 102',
    keycodeInfo: {
      code: 29038,
      label: 'Midi Velocity 8',
      name: {
        long: 'QK_MIDI_VELOCITY_8',
        short: 'MI_VL8',
      },
      keywords: ['Midi Velocity 8'],
    },
  },
  {
    desc: 'Set velocity to 114',
    keycodeInfo: {
      code: 29039,
      label: 'Midi Velocity 9',
      name: {
        long: 'QK_MIDI_VELOCITY_9',
        short: 'MI_VL9',
      },
      keywords: ['Midi Velocity 9'],
    },
  },
  {
    desc: 'Set velocity to 127',
    keycodeInfo: {
      code: 29040,
      label: 'Midi Velocity 10',
      name: {
        long: 'QK_MIDI_VELOCITY_10',
        short: 'MI_VL10',
      },
      keywords: ['Midi Velocity 10'],
    },
  },
  {
    desc: 'Decrease velocity',
    keycodeInfo: {
      code: 29041,
      label: 'Midi Velocity Down',
      name: {
        long: 'QK_MIDI_VELOCITY_DOWN',
        short: 'MI_VELD',
      },
      keywords: ['Midi Velocity Down'],
    },
  },
  {
    desc: 'Increase velocity',
    keycodeInfo: {
      code: 29042,
      label: 'Midi Velocity Up',
      name: {
        long: 'QK_MIDI_VELOCITY_UP',
        short: 'MI_VELU',
      },
      keywords: ['Midi Velocity Up'],
    },
  },
  {
    desc: 'Set channel to 1',
    keycodeInfo: {
      code: 29043,
      label: 'Midi Channel 1',
      name: {
        long: 'QK_MIDI_CHANNEL_1',
        short: 'MI_CH1',
      },
      keywords: ['Midi Channel 1'],
    },
  },
  {
    desc: 'Set channel to 2',
    keycodeInfo: {
      code: 29044,
      label: 'Midi Channel 2',
      name: {
        long: 'QK_MIDI_CHANNEL_2',
        short: 'MI_CH2',
      },
      keywords: ['Midi Channel 2'],
    },
  },
  {
    desc: 'Set channel to 3',
    keycodeInfo: {
      code: 29045,
      label: 'Midi Channel 3',
      name: {
        long: 'QK_MIDI_CHANNEL_3',
        short: 'MI_CH3',
      },
      keywords: ['Midi Channel 3'],
    },
  },
  {
    desc: 'Set channel to 4',
    keycodeInfo: {
      code: 29046,
      label: 'Midi Channel 4',
      name: {
        long: 'QK_MIDI_CHANNEL_4',
        short: 'MI_CH4',
      },
      keywords: ['Midi Channel 4'],
    },
  },
  {
    desc: 'Set channel to 5',
    keycodeInfo: {
      code: 29047,
      label: 'Midi Channel 5',
      name: {
        long: 'QK_MIDI_CHANNEL_5',
        short: 'MI_CH5',
      },
      keywords: ['Midi Channel 5'],
    },
  },
  {
    desc: 'Set channel to 6',
    keycodeInfo: {
      code: 29048,
      label: 'Midi Channel 6',
      name: {
        long: 'QK_MIDI_CHANNEL_6',
        short: 'MI_CH6',
      },
      keywords: ['Midi Channel 6'],
    },
  },
  {
    desc: 'Set channel to 7',
    keycodeInfo: {
      code: 29049,
      label: 'Midi Channel 7',
      name: {
        long: 'QK_MIDI_CHANNEL_7',
        short: 'MI_CH7',
      },
      keywords: ['Midi Channel 7'],
    },
  },
  {
    desc: 'Set channel to 8',
    keycodeInfo: {
      code: 29050,
      label: 'Midi Channel 8',
      name: {
        long: 'QK_MIDI_CHANNEL_8',
        short: 'MI_CH8',
      },
      keywords: ['Midi Channel 8'],
    },
  },
  {
    desc: 'Set channel to 9',
    keycodeInfo: {
      code: 29051,
      label: 'Midi Channel 9',
      name: {
        long: 'QK_MIDI_CHANNEL_9',
        short: 'MI_CH9',
      },
      keywords: ['Midi Channel 9'],
    },
  },
  {
    desc: 'Set channel to 10',
    keycodeInfo: {
      code: 29052,
      label: 'Midi Channel 10',
      name: {
        long: 'QK_MIDI_CHANNEL_10',
        short: 'MI_CH10',
      },
      keywords: ['Midi Channel 10'],
    },
  },
  {
    desc: 'Set channel to 11',
    keycodeInfo: {
      code: 29053,
      label: 'Midi Channel 11',
      name: {
        long: 'QK_MIDI_CHANNEL_11',
        short: 'MI_CH11',
      },
      keywords: ['Midi Channel 11'],
    },
  },
  {
    desc: 'Set channel to 12',
    keycodeInfo: {
      code: 29054,
      label: 'Midi Channel 12',
      name: {
        long: 'QK_MIDI_CHANNEL_12',
        short: 'MI_CH12',
      },
      keywords: ['Midi Channel 12'],
    },
  },
  {
    desc: 'Set channel to 13',
    keycodeInfo: {
      code: 29055,
      label: 'Midi Channel 13',
      name: {
        long: 'QK_MIDI_CHANNEL_13',
        short: 'MI_CH13',
      },
      keywords: ['Midi Channel 13'],
    },
  },
  {
    desc: 'Set channel to 14',
    keycodeInfo: {
      code: 29056,
      label: 'Midi Channel 14',
      name: {
        long: 'QK_MIDI_CHANNEL_14',
        short: 'MI_CH14',
      },
      keywords: ['Midi Channel 14'],
    },
  },
  {
    desc: 'Set channel to 15',
    keycodeInfo: {
      code: 29057,
      label: 'Midi Channel 15',
      name: {
        long: 'QK_MIDI_CHANNEL_15',
        short: 'MI_CH15',
      },
      keywords: ['Midi Channel 15'],
    },
  },
  {
    desc: 'Set channel to 16',
    keycodeInfo: {
      code: 29058,
      label: 'Midi Channel 16',
      name: {
        long: 'QK_MIDI_CHANNEL_16',
        short: 'MI_CH16',
      },
      keywords: ['Midi Channel 16'],
    },
  },
  {
    desc: 'Decrease channel',
    keycodeInfo: {
      code: 29059,
      label: 'Midi Channel Down',
      name: {
        long: 'QK_MIDI_CHANNEL_DOWN',
        short: 'MI_CHND',
      },
      keywords: ['Midi Channel Down'],
    },
  },
  {
    desc: 'Increase channel',
    keycodeInfo: {
      code: 29060,
      label: 'Midi Channel Up',
      name: {
        long: 'QK_MIDI_CHANNEL_UP',
        short: 'MI_CHNU',
      },
      keywords: ['Midi Channel Up'],
    },
  },
  {
    desc: 'Stop all notes',
    keycodeInfo: {
      code: 29061,
      label: 'Midi All Notes Off',
      name: {
        long: 'QK_MIDI_ALL_NOTES_OFF',
        short: 'MI_AOFF',
      },
      keywords: ['Midi All Notes Off'],
    },
  },
  {
    desc: 'Sustain',
    keycodeInfo: {
      code: 29062,
      label: 'Midi Sustain',
      name: {
        long: 'QK_MIDI_SUSTAIN',
        short: 'MI_SUST',
      },
      keywords: ['Midi Sustain'],
    },
  },
  {
    desc: 'Portmento',
    keycodeInfo: {
      code: 29063,
      label: 'Midi Portamento',
      name: {
        long: 'QK_MIDI_PORTAMENTO',
        short: 'MI_PORT',
      },
      keywords: ['Midi Portamento'],
    },
  },
  {
    desc: 'Sostenuto',
    keycodeInfo: {
      code: 29064,
      label: 'Midi Sostenuto',
      name: {
        long: 'QK_MIDI_SOSTENUTO',
        short: 'MI_SOST',
      },
      keywords: ['Midi Sostenuto'],
    },
  },
  {
    desc: 'Soft Pedal',
    keycodeInfo: {
      code: 29065,
      label: 'Midi Soft',
      name: {
        long: 'QK_MIDI_SOFT',
        short: 'MI_SOFT',
      },
      keywords: ['Midi Soft'],
    },
  },
  {
    desc: 'Legato',
    keycodeInfo: {
      code: 29066,
      label: 'Midi Legato',
      name: {
        long: 'QK_MIDI_LEGATO',
        short: 'MI_LEG',
      },
      keywords: ['Midi Legato'],
    },
  },
  {
    desc: 'Modulation',
    keycodeInfo: {
      code: 29067,
      label: 'Midi Modulation',
      name: {
        long: 'QK_MIDI_MODULATION',
        short: 'MI_MOD',
      },
      keywords: ['Midi Modulation'],
    },
  },
  {
    desc: 'Decrease modulation speed',
    keycodeInfo: {
      code: 29068,
      label: 'Midi Modulation Speed Down',
      name: {
        long: 'QK_MIDI_MODULATION_SPEED_DOWN',
        short: 'MI_MODD',
      },
      keywords: ['Midi Modulation Speed Down'],
    },
  },
  {
    desc: 'Increase modulation speed',
    keycodeInfo: {
      code: 29069,
      label: 'Midi Modulation Speed Up',
      name: {
        long: 'QK_MIDI_MODULATION_SPEED_UP',
        short: 'MI_MODU',
      },
      keywords: ['Midi Modulation Speed Up'],
    },
  },
  {
    desc: 'Bend pitch down',
    keycodeInfo: {
      code: 29070,
      label: 'Midi Pitch Bend Down',
      name: {
        long: 'QK_MIDI_PITCH_BEND_DOWN',
        short: 'MI_BNDD',
      },
      keywords: ['Midi Pitch Bend Down'],
    },
  },
  {
    desc: 'Bend pitch up',
    keycodeInfo: {
      code: 29071,
      label: 'Midi Pitch Bend Up',
      name: {
        long: 'QK_MIDI_PITCH_BEND_UP',
        short: 'MI_BNDU',
      },
      keywords: ['Midi Pitch Bend Up'],
    },
  },
  {
    desc: 'Sequencer On',
    keycodeInfo: {
      code: 29184,
      label: 'Sequencer On',
      name: {
        long: 'QK_SEQUENCER_ON',
        short: 'SQ_ON',
      },
      keywords: ['Sequencer On'],
    },
  },
  {
    desc: 'Sequencer Off',
    keycodeInfo: {
      code: 29185,
      label: 'Sequencer Off',
      name: {
        long: 'QK_SEQUENCER_OFF',
        short: 'SQ_OFF',
      },
      keywords: ['Sequencer Off'],
    },
  },
  {
    desc: 'Sequencer Toggle',
    keycodeInfo: {
      code: 29186,
      label: 'Sequencer Toggle',
      name: {
        long: 'QK_SEQUENCER_TOGGLE',
        short: 'SQ_TOGG',
      },
      keywords: ['Sequencer Toggle'],
    },
  },
  {
    desc: 'Sequencer Tempo Down',
    keycodeInfo: {
      code: 29187,
      label: 'Sequencer Tempo Down',
      name: {
        long: 'QK_SEQUENCER_TEMPO_DOWN',
        short: 'SQ_TMPD',
      },
      keywords: ['Sequencer Tempo Down'],
    },
  },
  {
    desc: 'Sequencer Tempo Up',
    keycodeInfo: {
      code: 29188,
      label: 'Sequencer Tempo Up',
      name: {
        long: 'QK_SEQUENCER_TEMPO_UP',
        short: 'SQ_TMPU',
      },
      keywords: ['Sequencer Tempo Up'],
    },
  },
  {
    desc: 'Sequencer Resolution Down',
    keycodeInfo: {
      code: 29189,
      label: 'Sequencer Resolution Down',
      name: {
        long: 'QK_SEQUENCER_RESOLUTION_DOWN',
        short: 'SQ_RESD',
      },
      keywords: ['Sequencer Resolution Down'],
    },
  },
  {
    desc: 'Sequencer Resolution Up',
    keycodeInfo: {
      code: 29190,
      label: 'Sequencer Resolution Up',
      name: {
        long: 'QK_SEQUENCER_RESOLUTION_UP',
        short: 'SQ_RESU',
      },
      keywords: ['Sequencer Resolution Up'],
    },
  },
  {
    desc: 'Sequencer Steps All',
    keycodeInfo: {
      code: 29191,
      label: 'Sequencer Steps All',
      name: {
        long: 'QK_SEQUENCER_STEPS_ALL',
        short: 'SQ_SALL',
      },
      keywords: ['Sequencer Steps All'],
    },
  },
  {
    desc: 'Sequencer Steps Clear',
    keycodeInfo: {
      code: 29192,
      label: 'Sequencer Steps Clear',
      name: {
        long: 'QK_SEQUENCER_STEPS_CLEAR',
        short: 'SQ_SCLR',
      },
      keywords: ['Sequencer Steps Clear'],
    },
  },
  {
    desc: 'Button 0',
    keycodeInfo: {
      code: 29696,
      label: 'Joystick Button 0',
      name: {
        long: 'QK_JOYSTICK_BUTTON_0',
        short: 'JS_0',
      },
      keywords: ['Joystick Button 0'],
    },
  },
  {
    desc: 'Button 1',
    keycodeInfo: {
      code: 29697,
      label: 'Joystick Button 1',
      name: {
        long: 'QK_JOYSTICK_BUTTON_1',
        short: 'JS_1',
      },
      keywords: ['Joystick Button 1'],
    },
  },
  {
    desc: 'Button 2',
    keycodeInfo: {
      code: 29698,
      label: 'Joystick Button 2',
      name: {
        long: 'QK_JOYSTICK_BUTTON_2',
        short: 'JS_2',
      },
      keywords: ['Joystick Button 2'],
    },
  },
  {
    desc: 'Button 3',
    keycodeInfo: {
      code: 29699,
      label: 'Joystick Button 3',
      name: {
        long: 'QK_JOYSTICK_BUTTON_3',
        short: 'JS_3',
      },
      keywords: ['Joystick Button 3'],
    },
  },
  {
    desc: 'Button 4',
    keycodeInfo: {
      code: 29700,
      label: 'Joystick Button 4',
      name: {
        long: 'QK_JOYSTICK_BUTTON_4',
        short: 'JS_4',
      },
      keywords: ['Joystick Button 4'],
    },
  },
  {
    desc: 'Button 5',
    keycodeInfo: {
      code: 29701,
      label: 'Joystick Button 5',
      name: {
        long: 'QK_JOYSTICK_BUTTON_5',
        short: 'JS_5',
      },
      keywords: ['Joystick Button 5'],
    },
  },
  {
    desc: 'Button 6',
    keycodeInfo: {
      code: 29702,
      label: 'Joystick Button 6',
      name: {
        long: 'QK_JOYSTICK_BUTTON_6',
        short: 'JS_6',
      },
      keywords: ['Joystick Button 6'],
    },
  },
  {
    desc: 'Button 7',
    keycodeInfo: {
      code: 29703,
      label: 'Joystick Button 7',
      name: {
        long: 'QK_JOYSTICK_BUTTON_7',
        short: 'JS_7',
      },
      keywords: ['Joystick Button 7'],
    },
  },
  {
    desc: 'Button 8',
    keycodeInfo: {
      code: 29704,
      label: 'Joystick Button 8',
      name: {
        long: 'QK_JOYSTICK_BUTTON_8',
        short: 'JS_8',
      },
      keywords: ['Joystick Button 8'],
    },
  },
  {
    desc: 'Button 9',
    keycodeInfo: {
      code: 29705,
      label: 'Joystick Button 9',
      name: {
        long: 'QK_JOYSTICK_BUTTON_9',
        short: 'JS_9',
      },
      keywords: ['Joystick Button 9'],
    },
  },
  {
    desc: 'Button 10',
    keycodeInfo: {
      code: 29706,
      label: 'Joystick Button 10',
      name: {
        long: 'QK_JOYSTICK_BUTTON_10',
        short: 'JS_10',
      },
      keywords: ['Joystick Button 10'],
    },
  },
  {
    desc: 'Button 11',
    keycodeInfo: {
      code: 29707,
      label: 'Joystick Button 11',
      name: {
        long: 'QK_JOYSTICK_BUTTON_11',
        short: 'JS_11',
      },
      keywords: ['Joystick Button 11'],
    },
  },
  {
    desc: 'Button 12',
    keycodeInfo: {
      code: 29708,
      label: 'Joystick Button 12',
      name: {
        long: 'QK_JOYSTICK_BUTTON_12',
        short: 'JS_12',
      },
      keywords: ['Joystick Button 12'],
    },
  },
  {
    desc: 'Button 13',
    keycodeInfo: {
      code: 29709,
      label: 'Joystick Button 13',
      name: {
        long: 'QK_JOYSTICK_BUTTON_13',
        short: 'JS_13',
      },
      keywords: ['Joystick Button 13'],
    },
  },
  {
    desc: 'Button 14',
    keycodeInfo: {
      code: 29710,
      label: 'Joystick Button 14',
      name: {
        long: 'QK_JOYSTICK_BUTTON_14',
        short: 'JS_14',
      },
      keywords: ['Joystick Button 14'],
    },
  },
  {
    desc: 'Button 15',
    keycodeInfo: {
      code: 29711,
      label: 'Joystick Button 15',
      name: {
        long: 'QK_JOYSTICK_BUTTON_15',
        short: 'JS_15',
      },
      keywords: ['Joystick Button 15'],
    },
  },
  {
    desc: 'Button 16',
    keycodeInfo: {
      code: 29712,
      label: 'Joystick Button 16',
      name: {
        long: 'QK_JOYSTICK_BUTTON_16',
        short: 'JS_16',
      },
      keywords: ['Joystick Button 16'],
    },
  },
  {
    desc: 'Button 17',
    keycodeInfo: {
      code: 29713,
      label: 'Joystick Button 17',
      name: {
        long: 'QK_JOYSTICK_BUTTON_17',
        short: 'JS_17',
      },
      keywords: ['Joystick Button 17'],
    },
  },
  {
    desc: 'Button 18',
    keycodeInfo: {
      code: 29714,
      label: 'Joystick Button 18',
      name: {
        long: 'QK_JOYSTICK_BUTTON_18',
        short: 'JS_18',
      },
      keywords: ['Joystick Button 18'],
    },
  },
  {
    desc: 'Button 19',
    keycodeInfo: {
      code: 29715,
      label: 'Joystick Button 19',
      name: {
        long: 'QK_JOYSTICK_BUTTON_19',
        short: 'JS_19',
      },
      keywords: ['Joystick Button 19'],
    },
  },
  {
    desc: 'Button 20',
    keycodeInfo: {
      code: 29716,
      label: 'Joystick Button 20',
      name: {
        long: 'QK_JOYSTICK_BUTTON_20',
        short: 'JS_20',
      },
      keywords: ['Joystick Button 20'],
    },
  },
  {
    desc: 'Button 21',
    keycodeInfo: {
      code: 29717,
      label: 'Joystick Button 21',
      name: {
        long: 'QK_JOYSTICK_BUTTON_21',
        short: 'JS_21',
      },
      keywords: ['Joystick Button 21'],
    },
  },
  {
    desc: 'Button 22',
    keycodeInfo: {
      code: 29718,
      label: 'Joystick Button 22',
      name: {
        long: 'QK_JOYSTICK_BUTTON_22',
        short: 'JS_22',
      },
      keywords: ['Joystick Button 22'],
    },
  },
  {
    desc: 'Button 23',
    keycodeInfo: {
      code: 29719,
      label: 'Joystick Button 23',
      name: {
        long: 'QK_JOYSTICK_BUTTON_23',
        short: 'JS_23',
      },
      keywords: ['Joystick Button 23'],
    },
  },
  {
    desc: 'Button 24',
    keycodeInfo: {
      code: 29720,
      label: 'Joystick Button 24',
      name: {
        long: 'QK_JOYSTICK_BUTTON_24',
        short: 'JS_24',
      },
      keywords: ['Joystick Button 24'],
    },
  },
  {
    desc: 'Button 25',
    keycodeInfo: {
      code: 29721,
      label: 'Joystick Button 25',
      name: {
        long: 'QK_JOYSTICK_BUTTON_25',
        short: 'JS_25',
      },
      keywords: ['Joystick Button 25'],
    },
  },
  {
    desc: 'Button 26',
    keycodeInfo: {
      code: 29722,
      label: 'Joystick Button 26',
      name: {
        long: 'QK_JOYSTICK_BUTTON_26',
        short: 'JS_26',
      },
      keywords: ['Joystick Button 26'],
    },
  },
  {
    desc: 'Button 27',
    keycodeInfo: {
      code: 29723,
      label: 'Joystick Button 27',
      name: {
        long: 'QK_JOYSTICK_BUTTON_27',
        short: 'JS_27',
      },
      keywords: ['Joystick Button 27'],
    },
  },
  {
    desc: 'Button 28',
    keycodeInfo: {
      code: 29724,
      label: 'Joystick Button 28',
      name: {
        long: 'QK_JOYSTICK_BUTTON_28',
        short: 'JS_28',
      },
      keywords: ['Joystick Button 28'],
    },
  },
  {
    desc: 'Button 29',
    keycodeInfo: {
      code: 29725,
      label: 'Joystick Button 29',
      name: {
        long: 'QK_JOYSTICK_BUTTON_29',
        short: 'JS_29',
      },
      keywords: ['Joystick Button 29'],
    },
  },
  {
    desc: 'Button 30',
    keycodeInfo: {
      code: 29726,
      label: 'Joystick Button 30',
      name: {
        long: 'QK_JOYSTICK_BUTTON_30',
        short: 'JS_30',
      },
      keywords: ['Joystick Button 30'],
    },
  },
  {
    desc: 'Button 31',
    keycodeInfo: {
      code: 29727,
      label: 'Joystick Button 31',
      name: {
        long: 'QK_JOYSTICK_BUTTON_31',
        short: 'JS_31',
      },
      keywords: ['Joystick Button 31'],
    },
  },
  {
    desc: 'Programmable button 1',
    keycodeInfo: {
      code: 29760,
      label: 'Programmable Button 1',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_1',
        short: 'PB_1',
      },
      keywords: ['Programmable Button 1'],
    },
  },
  {
    desc: 'Programmable button 2',
    keycodeInfo: {
      code: 29761,
      label: 'Programmable Button 2',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_2',
        short: 'PB_2',
      },
      keywords: ['Programmable Button 2'],
    },
  },
  {
    desc: 'Programmable button 3',
    keycodeInfo: {
      code: 29762,
      label: 'Programmable Button 3',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_3',
        short: 'PB_3',
      },
      keywords: ['Programmable Button 3'],
    },
  },
  {
    desc: 'Programmable button 4',
    keycodeInfo: {
      code: 29763,
      label: 'Programmable Button 4',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_4',
        short: 'PB_4',
      },
      keywords: ['Programmable Button 4'],
    },
  },
  {
    desc: 'Programmable button 5',
    keycodeInfo: {
      code: 29764,
      label: 'Programmable Button 5',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_5',
        short: 'PB_5',
      },
      keywords: ['Programmable Button 5'],
    },
  },
  {
    desc: 'Programmable button 6',
    keycodeInfo: {
      code: 29765,
      label: 'Programmable Button 6',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_6',
        short: 'PB_6',
      },
      keywords: ['Programmable Button 6'],
    },
  },
  {
    desc: 'Programmable button 7',
    keycodeInfo: {
      code: 29766,
      label: 'Programmable Button 7',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_7',
        short: 'PB_7',
      },
      keywords: ['Programmable Button 7'],
    },
  },
  {
    desc: 'Programmable button 8',
    keycodeInfo: {
      code: 29767,
      label: 'Programmable Button 8',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_8',
        short: 'PB_8',
      },
      keywords: ['Programmable Button 8'],
    },
  },
  {
    desc: 'Programmable button 9',
    keycodeInfo: {
      code: 29768,
      label: 'Programmable Button 9',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_9',
        short: 'PB_9',
      },
      keywords: ['Programmable Button 9'],
    },
  },
  {
    desc: 'Programmable button 10',
    keycodeInfo: {
      code: 29769,
      label: 'Programmable Button 10',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_10',
        short: 'PB_10',
      },
      keywords: ['Programmable Button 10'],
    },
  },
  {
    desc: 'Programmable button 11',
    keycodeInfo: {
      code: 29770,
      label: 'Programmable Button 11',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_11',
        short: 'PB_11',
      },
      keywords: ['Programmable Button 11'],
    },
  },
  {
    desc: 'Programmable button 12',
    keycodeInfo: {
      code: 29771,
      label: 'Programmable Button 12',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_12',
        short: 'PB_12',
      },
      keywords: ['Programmable Button 12'],
    },
  },
  {
    desc: 'Programmable button 13',
    keycodeInfo: {
      code: 29772,
      label: 'Programmable Button 13',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_13',
        short: 'PB_13',
      },
      keywords: ['Programmable Button 13'],
    },
  },
  {
    desc: 'Programmable button 14',
    keycodeInfo: {
      code: 29773,
      label: 'Programmable Button 14',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_14',
        short: 'PB_14',
      },
      keywords: ['Programmable Button 14'],
    },
  },
  {
    desc: 'Programmable button 15',
    keycodeInfo: {
      code: 29774,
      label: 'Programmable Button 15',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_15',
        short: 'PB_15',
      },
      keywords: ['Programmable Button 15'],
    },
  },
  {
    desc: 'Programmable button 16',
    keycodeInfo: {
      code: 29775,
      label: 'Programmable Button 16',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_16',
        short: 'PB_16',
      },
      keywords: ['Programmable Button 16'],
    },
  },
  {
    desc: 'Programmable button 17',
    keycodeInfo: {
      code: 29776,
      label: 'Programmable Button 17',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_17',
        short: 'PB_17',
      },
      keywords: ['Programmable Button 17'],
    },
  },
  {
    desc: 'Programmable button 18',
    keycodeInfo: {
      code: 29777,
      label: 'Programmable Button 18',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_18',
        short: 'PB_18',
      },
      keywords: ['Programmable Button 18'],
    },
  },
  {
    desc: 'Programmable button 19',
    keycodeInfo: {
      code: 29778,
      label: 'Programmable Button 19',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_19',
        short: 'PB_19',
      },
      keywords: ['Programmable Button 19'],
    },
  },
  {
    desc: 'Programmable button 20',
    keycodeInfo: {
      code: 29779,
      label: 'Programmable Button 20',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_20',
        short: 'PB_20',
      },
      keywords: ['Programmable Button 20'],
    },
  },
  {
    desc: 'Programmable button 21',
    keycodeInfo: {
      code: 29780,
      label: 'Programmable Button 21',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_21',
        short: 'PB_21',
      },
      keywords: ['Programmable Button 21'],
    },
  },
  {
    desc: 'Programmable button 22',
    keycodeInfo: {
      code: 29781,
      label: 'Programmable Button 22',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_22',
        short: 'PB_22',
      },
      keywords: ['Programmable Button 22'],
    },
  },
  {
    desc: 'Programmable button 23',
    keycodeInfo: {
      code: 29782,
      label: 'Programmable Button 23',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_23',
        short: 'PB_23',
      },
      keywords: ['Programmable Button 23'],
    },
  },
  {
    desc: 'Programmable button 24',
    keycodeInfo: {
      code: 29783,
      label: 'Programmable Button 24',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_24',
        short: 'PB_24',
      },
      keywords: ['Programmable Button 24'],
    },
  },
  {
    desc: 'Programmable button 25',
    keycodeInfo: {
      code: 29784,
      label: 'Programmable Button 25',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_25',
        short: 'PB_25',
      },
      keywords: ['Programmable Button 25'],
    },
  },
  {
    desc: 'Programmable button 26',
    keycodeInfo: {
      code: 29785,
      label: 'Programmable Button 26',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_26',
        short: 'PB_26',
      },
      keywords: ['Programmable Button 26'],
    },
  },
  {
    desc: 'Programmable button 27',
    keycodeInfo: {
      code: 29786,
      label: 'Programmable Button 27',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_27',
        short: 'PB_27',
      },
      keywords: ['Programmable Button 27'],
    },
  },
  {
    desc: 'Programmable button 28',
    keycodeInfo: {
      code: 29787,
      label: 'Programmable Button 28',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_28',
        short: 'PB_28',
      },
      keywords: ['Programmable Button 28'],
    },
  },
  {
    desc: 'Programmable button 29',
    keycodeInfo: {
      code: 29788,
      label: 'Programmable Button 29',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_29',
        short: 'PB_29',
      },
      keywords: ['Programmable Button 29'],
    },
  },
  {
    desc: 'Programmable button 30',
    keycodeInfo: {
      code: 29789,
      label: 'Programmable Button 30',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_30',
        short: 'PB_30',
      },
      keywords: ['Programmable Button 30'],
    },
  },
  {
    desc: 'Programmable button 31',
    keycodeInfo: {
      code: 29790,
      label: 'Programmable Button 31',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_31',
        short: 'PB_31',
      },
      keywords: ['Programmable Button 31'],
    },
  },
  {
    desc: 'Programmable button 32',
    keycodeInfo: {
      code: 29791,
      label: 'Programmable Button 32',
      name: {
        long: 'QK_PROGRAMMABLE_BUTTON_32',
        short: 'PB_32',
      },
      keywords: ['Programmable Button 32'],
    },
  },
  {
    desc: 'Turns on Audio Feature',
    keycodeInfo: {
      code: 29824,
      label: 'Audio On',
      name: {
        long: 'QK_AUDIO_ON',
        short: 'AU_ON',
      },
      keywords: ['Audio On'],
    },
  },
  {
    desc: 'Turns off Audio Feature',
    keycodeInfo: {
      code: 29825,
      label: 'Audio Off',
      name: {
        long: 'QK_AUDIO_OFF',
        short: 'AU_OFF',
      },
      keywords: ['Audio Off'],
    },
  },
  {
    desc: 'Toggles Audio state',
    keycodeInfo: {
      code: 29826,
      label: 'Audio Toggle',
      name: {
        long: 'QK_AUDIO_TOGGLE',
        short: 'AU_TOGG',
      },
      keywords: ['Audio Toggle'],
    },
  },
  {
    desc: 'Toggles Audio clicky mode',
    keycodeInfo: {
      code: 29834,
      label: 'Audio Clicky Toggle',
      name: {
        long: 'QK_AUDIO_CLICKY_TOGGLE',
        short: 'CK_TOGG',
      },
      keywords: ['Audio Clicky Toggle'],
    },
  },
  {
    desc: 'Turns on Audio clicky mode',
    keycodeInfo: {
      code: 29835,
      label: 'Audio Clicky On',
      name: {
        long: 'QK_AUDIO_CLICKY_ON',
        short: 'CK_ON',
      },
      keywords: ['Audio Clicky On'],
    },
  },
  {
    desc: 'Turns on Audio clicky mode',
    keycodeInfo: {
      code: 29836,
      label: 'Audio Clicky Off',
      name: {
        long: 'QK_AUDIO_CLICKY_OFF',
        short: 'CK_OFF',
      },
      keywords: ['Audio Clicky Off'],
    },
  },
  {
    desc: 'Increases frequency of the clicks',
    keycodeInfo: {
      code: 29837,
      label: 'Audio Clicky Up',
      name: {
        long: 'QK_AUDIO_CLICKY_UP',
        short: 'CK_UP',
      },
      keywords: ['Audio Clicky Up'],
    },
  },
  {
    desc: 'Decreases frequency of the clicks',
    keycodeInfo: {
      code: 29838,
      label: 'Audio Clicky Down',
      name: {
        long: 'QK_AUDIO_CLICKY_DOWN',
        short: 'CK_DOWN',
      },
      keywords: ['Audio Clicky Down'],
    },
  },
  {
    desc: 'Resets frequency to default',
    keycodeInfo: {
      code: 29839,
      label: 'Audio Clicky Reset',
      name: {
        long: 'QK_AUDIO_CLICKY_RESET',
        short: 'CK_RST',
      },
      keywords: ['Audio Clicky Reset'],
    },
  },
  {
    desc: 'Turns on Music Mode',
    keycodeInfo: {
      code: 29840,
      label: 'Music On',
      name: {
        long: 'QK_MUSIC_ON',
        short: 'MU_ON',
      },
      keywords: ['Music On'],
    },
  },
  {
    desc: 'Turns off Music Mode',
    keycodeInfo: {
      code: 29841,
      label: 'Music Off',
      name: {
        long: 'QK_MUSIC_OFF',
        short: 'MU_OFF',
      },
      keywords: ['Music Off'],
    },
  },
  {
    desc: 'Toggles Music Mode',
    keycodeInfo: {
      code: 29842,
      label: 'Music Toggle',
      name: {
        long: 'QK_MUSIC_TOGGLE',
        short: 'MU_TOGG',
      },
      keywords: ['Music Toggle'],
    },
  },
  {
    desc: 'Cycles through the music modes',
    keycodeInfo: {
      code: 29843,
      label: 'Music Mode Next',
      name: {
        long: 'QK_MUSIC_MODE_NEXT',
        short: 'MU_NEXT',
      },
      keywords: ['Music Mode Next'],
    },
  },
  {
    desc: 'Cycles through the audio voices',
    keycodeInfo: {
      code: 29844,
      label: 'Audio Voice Next',
      name: {
        long: 'QK_AUDIO_VOICE_NEXT',
        short: 'AU_NEXT',
      },
      keywords: ['Audio Voice Next'],
    },
  },
  {
    desc: 'Cycles through the audio voices in reverse',
    keycodeInfo: {
      code: 29845,
      label: 'Audio Voice Previous',
      name: {
        long: 'QK_AUDIO_VOICE_PREVIOUS',
        short: 'AU_PREV',
      },
      keywords: ['Audio Voice Previous'],
    },
  },
  {
    desc: 'Steno Bolt',
    keycodeInfo: {
      code: 29936,
      label: 'Steno Bolt',
      name: {
        long: 'QK_STENO_BOLT',
        short: 'QK_STENO_BOLT',
      },
      keywords: ['Steno Bolt'],
    },
  },
  {
    desc: 'Steno Gemini',
    keycodeInfo: {
      code: 29937,
      label: 'Steno Gemini',
      name: {
        long: 'QK_STENO_GEMINI',
        short: 'QK_STENO_GEMINI',
      },
      keywords: ['Steno Gemini'],
    },
  },
  {
    desc: 'Steno Comb',
    keycodeInfo: {
      code: 29938,
      label: 'Steno Comb',
      name: {
        long: 'QK_STENO_COMB',
        short: 'QK_STENO_COMB',
      },
      keywords: ['Steno Comb'],
    },
  },
  {
    desc: 'Steno Comb Max',
    keycodeInfo: {
      code: 29948,
      label: 'Steno Comb Max',
      name: {
        long: 'QK_STENO_COMB_MAX',
        short: 'QK_STENO_COMB_MAX',
      },
      keywords: ['Steno Comb Max'],
    },
  },
  {
    desc: 'Macro 0',
    keycodeInfo: {
      code: 30464,
      label: 'Macro 0',
      name: {
        long: 'QK_MACRO_0',
        short: 'MC_0',
      },
      keywords: ['Macro 0'],
    },
  },
  {
    desc: 'Macro 1',
    keycodeInfo: {
      code: 30465,
      label: 'Macro 1',
      name: {
        long: 'QK_MACRO_1',
        short: 'MC_1',
      },
      keywords: ['Macro 1'],
    },
  },
  {
    desc: 'Macro 2',
    keycodeInfo: {
      code: 30466,
      label: 'Macro 2',
      name: {
        long: 'QK_MACRO_2',
        short: 'MC_2',
      },
      keywords: ['Macro 2'],
    },
  },
  {
    desc: 'Macro 3',
    keycodeInfo: {
      code: 30467,
      label: 'Macro 3',
      name: {
        long: 'QK_MACRO_3',
        short: 'MC_3',
      },
      keywords: ['Macro 3'],
    },
  },
  {
    desc: 'Macro 4',
    keycodeInfo: {
      code: 30468,
      label: 'Macro 4',
      name: {
        long: 'QK_MACRO_4',
        short: 'MC_4',
      },
      keywords: ['Macro 4'],
    },
  },
  {
    desc: 'Macro 5',
    keycodeInfo: {
      code: 30469,
      label: 'Macro 5',
      name: {
        long: 'QK_MACRO_5',
        short: 'MC_5',
      },
      keywords: ['Macro 5'],
    },
  },
  {
    desc: 'Macro 6',
    keycodeInfo: {
      code: 30470,
      label: 'Macro 6',
      name: {
        long: 'QK_MACRO_6',
        short: 'MC_6',
      },
      keywords: ['Macro 6'],
    },
  },
  {
    desc: 'Macro 7',
    keycodeInfo: {
      code: 30471,
      label: 'Macro 7',
      name: {
        long: 'QK_MACRO_7',
        short: 'MC_7',
      },
      keywords: ['Macro 7'],
    },
  },
  {
    desc: 'Macro 8',
    keycodeInfo: {
      code: 30472,
      label: 'Macro 8',
      name: {
        long: 'QK_MACRO_8',
        short: 'MC_8',
      },
      keywords: ['Macro 8'],
    },
  },
  {
    desc: 'Macro 9',
    keycodeInfo: {
      code: 30473,
      label: 'Macro 9',
      name: {
        long: 'QK_MACRO_9',
        short: 'MC_9',
      },
      keywords: ['Macro 9'],
    },
  },
  {
    desc: 'Macro 10',
    keycodeInfo: {
      code: 30474,
      label: 'Macro 10',
      name: {
        long: 'QK_MACRO_10',
        short: 'MC_10',
      },
      keywords: ['Macro 10'],
    },
  },
  {
    desc: 'Macro 11',
    keycodeInfo: {
      code: 30475,
      label: 'Macro 11',
      name: {
        long: 'QK_MACRO_11',
        short: 'MC_11',
      },
      keywords: ['Macro 11'],
    },
  },
  {
    desc: 'Macro 12',
    keycodeInfo: {
      code: 30476,
      label: 'Macro 12',
      name: {
        long: 'QK_MACRO_12',
        short: 'MC_12',
      },
      keywords: ['Macro 12'],
    },
  },
  {
    desc: 'Macro 13',
    keycodeInfo: {
      code: 30477,
      label: 'Macro 13',
      name: {
        long: 'QK_MACRO_13',
        short: 'MC_13',
      },
      keywords: ['Macro 13'],
    },
  },
  {
    desc: 'Macro 14',
    keycodeInfo: {
      code: 30478,
      label: 'Macro 14',
      name: {
        long: 'QK_MACRO_14',
        short: 'MC_14',
      },
      keywords: ['Macro 14'],
    },
  },
  {
    desc: 'Macro 15',
    keycodeInfo: {
      code: 30479,
      label: 'Macro 15',
      name: {
        long: 'QK_MACRO_15',
        short: 'MC_15',
      },
      keywords: ['Macro 15'],
    },
  },
  {
    desc: 'Macro 16',
    keycodeInfo: {
      code: 30480,
      label: 'Macro 16',
      name: {
        long: 'QK_MACRO_16',
        short: 'MC_16',
      },
      keywords: ['Macro 16'],
    },
  },
  {
    desc: 'Macro 17',
    keycodeInfo: {
      code: 30481,
      label: 'Macro 17',
      name: {
        long: 'QK_MACRO_17',
        short: 'MC_17',
      },
      keywords: ['Macro 17'],
    },
  },
  {
    desc: 'Macro 18',
    keycodeInfo: {
      code: 30482,
      label: 'Macro 18',
      name: {
        long: 'QK_MACRO_18',
        short: 'MC_18',
      },
      keywords: ['Macro 18'],
    },
  },
  {
    desc: 'Macro 19',
    keycodeInfo: {
      code: 30483,
      label: 'Macro 19',
      name: {
        long: 'QK_MACRO_19',
        short: 'MC_19',
      },
      keywords: ['Macro 19'],
    },
  },
  {
    desc: 'Macro 20',
    keycodeInfo: {
      code: 30484,
      label: 'Macro 20',
      name: {
        long: 'QK_MACRO_20',
        short: 'MC_20',
      },
      keywords: ['Macro 20'],
    },
  },
  {
    desc: 'Macro 21',
    keycodeInfo: {
      code: 30485,
      label: 'Macro 21',
      name: {
        long: 'QK_MACRO_21',
        short: 'MC_21',
      },
      keywords: ['Macro 21'],
    },
  },
  {
    desc: 'Macro 22',
    keycodeInfo: {
      code: 30486,
      label: 'Macro 22',
      name: {
        long: 'QK_MACRO_22',
        short: 'MC_22',
      },
      keywords: ['Macro 22'],
    },
  },
  {
    desc: 'Macro 23',
    keycodeInfo: {
      code: 30487,
      label: 'Macro 23',
      name: {
        long: 'QK_MACRO_23',
        short: 'MC_23',
      },
      keywords: ['Macro 23'],
    },
  },
  {
    desc: 'Macro 24',
    keycodeInfo: {
      code: 30488,
      label: 'Macro 24',
      name: {
        long: 'QK_MACRO_24',
        short: 'MC_24',
      },
      keywords: ['Macro 24'],
    },
  },
  {
    desc: 'Macro 25',
    keycodeInfo: {
      code: 30489,
      label: 'Macro 25',
      name: {
        long: 'QK_MACRO_25',
        short: 'MC_25',
      },
      keywords: ['Macro 25'],
    },
  },
  {
    desc: 'Macro 26',
    keycodeInfo: {
      code: 30490,
      label: 'Macro 26',
      name: {
        long: 'QK_MACRO_26',
        short: 'MC_26',
      },
      keywords: ['Macro 26'],
    },
  },
  {
    desc: 'Macro 27',
    keycodeInfo: {
      code: 30491,
      label: 'Macro 27',
      name: {
        long: 'QK_MACRO_27',
        short: 'MC_27',
      },
      keywords: ['Macro 27'],
    },
  },
  {
    desc: 'Macro 28',
    keycodeInfo: {
      code: 30492,
      label: 'Macro 28',
      name: {
        long: 'QK_MACRO_28',
        short: 'MC_28',
      },
      keywords: ['Macro 28'],
    },
  },
  {
    desc: 'Macro 29',
    keycodeInfo: {
      code: 30493,
      label: 'Macro 29',
      name: {
        long: 'QK_MACRO_29',
        short: 'MC_29',
      },
      keywords: ['Macro 29'],
    },
  },
  {
    desc: 'Macro 30',
    keycodeInfo: {
      code: 30494,
      label: 'Macro 30',
      name: {
        long: 'QK_MACRO_30',
        short: 'MC_30',
      },
      keywords: ['Macro 30'],
    },
  },
  {
    desc: 'Macro 31',
    keycodeInfo: {
      code: 30495,
      label: 'Macro 31',
      name: {
        long: 'QK_MACRO_31',
        short: 'MC_31',
      },
      keywords: ['Macro 31'],
    },
  },
  {
    desc: 'Set the backlight to max brightness',
    keycodeInfo: {
      code: 30720,
      label: 'Backlight On',
      name: {
        long: 'QK_BACKLIGHT_ON',
        short: 'BL_ON',
      },
      keywords: ['Backlight On'],
    },
  },
  {
    desc: 'Turn the backlight off',
    keycodeInfo: {
      code: 30721,
      label: 'Backlight Off',
      name: {
        long: 'QK_BACKLIGHT_OFF',
        short: 'BL_OFF',
      },
      keywords: ['Backlight Off'],
    },
  },
  {
    desc: 'Turn the backlight on or off',
    keycodeInfo: {
      code: 30722,
      label: 'Backlight Toggle',
      name: {
        long: 'QK_BACKLIGHT_TOGGLE',
        short: 'BL_TOGG',
      },
      keywords: ['Backlight Toggle'],
    },
  },
  {
    desc: 'Decrease the backlight level',
    keycodeInfo: {
      code: 30723,
      label: 'Backlight Down',
      name: {
        long: 'QK_BACKLIGHT_DOWN',
        short: 'BL_DOWN',
      },
      keywords: ['Backlight Down'],
    },
  },
  {
    desc: 'Increase the backlight level',
    keycodeInfo: {
      code: 30724,
      label: 'Backlight Up',
      name: {
        long: 'QK_BACKLIGHT_UP',
        short: 'BL_UP',
      },
      keywords: ['Backlight Up'],
    },
  },
  {
    desc: 'Cycle through backlight levels',
    keycodeInfo: {
      code: 30725,
      label: 'Backlight Step',
      name: {
        long: 'QK_BACKLIGHT_STEP',
        short: 'BL_STEP',
      },
      keywords: ['Backlight Step'],
    },
  },
  {
    desc: 'Toggle backlight breathing',
    keycodeInfo: {
      code: 30726,
      label: 'Backlight Toggle Breathing',
      name: {
        long: 'QK_BACKLIGHT_TOGGLE_BREATHING',
        short: 'BL_BRTG',
      },
      keywords: ['Backlight Toggle Breathing'],
    },
  },
  {
    desc: 'Toggle RGB lighting on or off',
    keycodeInfo: {
      code: 30752,
      label: 'Rgb Tog',
      name: {
        long: 'RGB_TOG',
        short: 'RGB_TOG',
      },
      keywords: ['Rgb Tog'],
    },
  },
  {
    desc: 'Cycle through modes, reverse direction when Shift is held',
    keycodeInfo: {
      code: 30753,
      label: 'Rgb Mode Forward',
      name: {
        long: 'RGB_MODE_FORWARD',
        short: 'RGB_MOD',
      },
      keywords: ['Rgb Mode Forward'],
    },
  },
  {
    desc: 'Cycle through modes in reverse, forward direction when Shift is held',
    keycodeInfo: {
      code: 30754,
      label: 'Rgb Mode Reverse',
      name: {
        long: 'RGB_MODE_REVERSE',
        short: 'RGB_RMOD',
      },
      keywords: ['Rgb Mode Reverse'],
    },
  },
  {
    desc: 'Increase hue, decrease hue when Shift is held',
    keycodeInfo: {
      code: 30755,
      label: 'Rgb Hui',
      name: {
        long: 'RGB_HUI',
        short: 'RGB_HUI',
      },
      keywords: ['Rgb Hui'],
    },
  },
  {
    desc: 'Decrease hue, increase hue when Shift is held',
    keycodeInfo: {
      code: 30756,
      label: 'Rgb Hud',
      name: {
        long: 'RGB_HUD',
        short: 'RGB_HUD',
      },
      keywords: ['Rgb Hud'],
    },
  },
  {
    desc: 'Increase saturation, decrease saturation when Shift is held',
    keycodeInfo: {
      code: 30757,
      label: 'Rgb Sai',
      name: {
        long: 'RGB_SAI',
        short: 'RGB_SAI',
      },
      keywords: ['Rgb Sai'],
    },
  },
  {
    desc: 'Decrease saturation, increase saturation when Shift is held',
    keycodeInfo: {
      code: 30758,
      label: 'Rgb Sad',
      name: {
        long: 'RGB_SAD',
        short: 'RGB_SAD',
      },
      keywords: ['Rgb Sad'],
    },
  },
  {
    desc: 'Increase value (brightness), decrease value when Shift is held',
    keycodeInfo: {
      code: 30759,
      label: 'Rgb Vai',
      name: {
        long: 'RGB_VAI',
        short: 'RGB_VAI',
      },
      keywords: ['Rgb Vai'],
    },
  },
  {
    desc: 'Decrease value (brightness), increase value when Shift is held',
    keycodeInfo: {
      code: 30760,
      label: 'Rgb Vad',
      name: {
        long: 'RGB_VAD',
        short: 'RGB_VAD',
      },
      keywords: ['Rgb Vad'],
    },
  },
  {
    desc: 'Increase effect speed (does not support eeprom yet), decrease speed when Shift is held',
    keycodeInfo: {
      code: 30761,
      label: 'Rgb Spi',
      name: {
        long: 'RGB_SPI',
        short: 'RGB_SPI',
      },
      keywords: ['Rgb Spi'],
    },
  },
  {
    desc: 'Decrease effect speed (does not support eeprom yet), increase speed when Shift is held',
    keycodeInfo: {
      code: 30762,
      label: 'Rgb Spd',
      name: {
        long: 'RGB_SPD',
        short: 'RGB_SPD',
      },
      keywords: ['Rgb Spd'],
    },
  },
  {
    desc: 'Static (no animation) mode',
    keycodeInfo: {
      code: 30763,
      label: 'Rgb Mode Plain',
      name: {
        long: 'RGB_MODE_PLAIN',
        short: 'RGB_M_P',
      },
      keywords: ['Rgb Mode Plain'],
    },
  },
  {
    desc: 'Breathing animation mode',
    keycodeInfo: {
      code: 30764,
      label: 'Rgb Mode Breathe',
      name: {
        long: 'RGB_MODE_BREATHE',
        short: 'RGB_M_B',
      },
      keywords: ['Rgb Mode Breathe'],
    },
  },
  {
    desc: 'Rainbow animation mode',
    keycodeInfo: {
      code: 30765,
      label: 'Rgb Mode Rainbow',
      name: {
        long: 'RGB_MODE_RAINBOW',
        short: 'RGB_M_R',
      },
      keywords: ['Rgb Mode Rainbow'],
    },
  },
  {
    desc: 'Swirl animation mode',
    keycodeInfo: {
      code: 30766,
      label: 'Rgb Mode Swirl',
      name: {
        long: 'RGB_MODE_SWIRL',
        short: 'RGB_M_SW',
      },
      keywords: ['Rgb Mode Swirl'],
    },
  },
  {
    desc: 'Snake animation mode',
    keycodeInfo: {
      code: 30767,
      label: 'Rgb Mode Snake',
      name: {
        long: 'RGB_MODE_SNAKE',
        short: 'RGB_M_SN',
      },
      keywords: ['Rgb Mode Snake'],
    },
  },
  {
    desc: '“Knight Rider” animation mode',
    keycodeInfo: {
      code: 30768,
      label: 'Rgb Mode Knight',
      name: {
        long: 'RGB_MODE_KNIGHT',
        short: 'RGB_M_K',
      },
      keywords: ['Rgb Mode Knight'],
    },
  },
  {
    desc: 'Christmas animation mode',
    keycodeInfo: {
      code: 30769,
      label: 'Rgb Mode Xmas',
      name: {
        long: 'RGB_MODE_XMAS',
        short: 'RGB_M_X',
      },
      keywords: ['Rgb Mode Xmas'],
    },
  },
  {
    desc: 'Static gradient animation mode',
    keycodeInfo: {
      code: 30770,
      label: 'Rgb Mode Gradient',
      name: {
        long: 'RGB_MODE_GRADIENT',
        short: 'RGB_M_G',
      },
      keywords: ['Rgb Mode Gradient'],
    },
  },
  {
    desc: 'Red,Green,Blue test animation mode',
    keycodeInfo: {
      code: 30771,
      label: 'Rgb Mode Rgbtest',
      name: {
        long: 'RGB_MODE_RGBTEST',
        short: 'RGB_M_T',
      },
      keywords: ['Rgb Mode Rgbtest'],
    },
  },
  {
    desc: 'Rgb Mode Twinkle',
    keycodeInfo: {
      code: 30772,
      label: 'Rgb Mode Twinkle',
      name: {
        long: 'RGB_MODE_TWINKLE',
        short: 'RGB_M_TW',
      },
      keywords: ['Rgb Mode Twinkle'],
    },
  },
  {
    desc: 'Put the keyboard into bootloader mode for flashing',
    keycodeInfo: {
      code: 31744,
      label: 'Bootloader',
      name: {
        long: 'QK_BOOTLOADER',
        short: 'QK_BOOT',
      },
      keywords: ['Bootloader'],
    },
  },
  {
    desc: 'Resets the keyboard. Does not load the bootloader',
    keycodeInfo: {
      code: 31745,
      label: 'Reboot',
      name: {
        long: 'QK_REBOOT',
        short: 'QK_RBT',
      },
      keywords: ['Reboot'],
    },
  },
  {
    desc: 'Toggle debug mode',
    keycodeInfo: {
      code: 31746,
      label: 'Debug Toggle',
      name: {
        long: 'QK_DEBUG_TOGGLE',
        short: 'DB_TOGG',
      },
      keywords: ['Debug Toggle'],
    },
  },
  {
    desc: 'Reinitializes the keyboard’s EEPROM (persistent memory)',
    keycodeInfo: {
      code: 31747,
      label: 'Clear Eeprom',
      name: {
        long: 'QK_CLEAR_EEPROM',
        short: 'EE_CLR',
      },
      keywords: ['Clear Eeprom'],
    },
  },
  {
    desc: 'Sends qmk compile -kb (keyboard) -km (keymap), or qmk flash if shift is held. Puts keyboard into bootloader mode if shift & control are held',
    keycodeInfo: {
      code: 31748,
      label: 'Make',
      name: {
        long: 'QK_MAKE',
        short: 'QK_MAKE',
      },
      keywords: ['Make'],
    },
  },
  {
    desc: 'Lower the Auto Shift timeout variable (down)',
    keycodeInfo: {
      code: 31760,
      label: 'Auto Shift Down',
      name: {
        long: 'QK_AUTO_SHIFT_DOWN',
        short: 'AS_DOWN',
      },
      keywords: ['Auto Shift Down'],
    },
  },
  {
    desc: 'Raise the Auto Shift timeout variable (up)',
    keycodeInfo: {
      code: 31761,
      label: 'Auto Shift Up',
      name: {
        long: 'QK_AUTO_SHIFT_UP',
        short: 'AS_UP',
      },
      keywords: ['Auto Shift Up'],
    },
  },
  {
    desc: 'Report your current Auto Shift timeout value',
    keycodeInfo: {
      code: 31762,
      label: 'Auto Shift Report',
      name: {
        long: 'QK_AUTO_SHIFT_REPORT',
        short: 'AS_RPT',
      },
      keywords: ['Auto Shift Report'],
    },
  },
  {
    desc: 'Turns on the Auto Shift Function',
    keycodeInfo: {
      code: 31763,
      label: 'Auto Shift On',
      name: {
        long: 'QK_AUTO_SHIFT_ON',
        short: 'AS_ON',
      },
      keywords: ['Auto Shift On'],
    },
  },
  {
    desc: 'Turns off the Auto Shift Function',
    keycodeInfo: {
      code: 31764,
      label: 'Auto Shift Off',
      name: {
        long: 'QK_AUTO_SHIFT_OFF',
        short: 'AS_OFF',
      },
      keywords: ['Auto Shift Off'],
    },
  },
  {
    desc: 'Toggles the state of the Auto Shift feature',
    keycodeInfo: {
      code: 31765,
      label: 'Auto Shift Toggle',
      name: {
        long: 'QK_AUTO_SHIFT_TOGGLE',
        short: 'AS_TOGG',
      },
      keywords: ['Auto Shift Toggle'],
    },
  },
  {
    desc: 'Escape when pressed, ` when Shift or GUI are held',
    keycodeInfo: {
      code: 31766,
      label: 'Grave Escape',
      name: {
        long: 'QK_GRAVE_ESCAPE',
        short: 'QK_GESC',
      },
      keywords: ['Grave Escape'],
    },
  },
  {
    desc: 'Velocikey Toggle',
    keycodeInfo: {
      code: 31767,
      label: 'Velocikey Toggle',
      name: {
        long: 'QK_VELOCIKEY_TOGGLE',
        short: 'VK_TOGG',
      },
      keywords: ['Velocikey Toggle'],
    },
  },
  {
    desc: 'Left Control when held, ( when tapped',
    keycodeInfo: {
      code: 31768,
      label: 'Space Cadet Left Ctrl Parenthesis Open',
      name: {
        long: 'QK_SPACE_CADET_LEFT_CTRL_PARENTHESIS_OPEN',
        short: 'SC_LCPO',
      },
      keywords: ['Space Cadet Left Ctrl Parenthesis Open'],
    },
  },
  {
    desc: 'Right Control when held, ) when tapped',
    keycodeInfo: {
      code: 31769,
      label: 'Space Cadet Right Ctrl Parenthesis Close',
      name: {
        long: 'QK_SPACE_CADET_RIGHT_CTRL_PARENTHESIS_CLOSE',
        short: 'SC_RCPC',
      },
      keywords: ['Space Cadet Right Ctrl Parenthesis Close'],
    },
  },
  {
    desc: 'Left Shift when held, ( when tapped',
    keycodeInfo: {
      code: 31770,
      label: 'Space Cadet Left Shift Parenthesis Open',
      name: {
        long: 'QK_SPACE_CADET_LEFT_SHIFT_PARENTHESIS_OPEN',
        short: 'SC_LSPO',
      },
      keywords: ['Space Cadet Left Shift Parenthesis Open'],
    },
  },
  {
    desc: 'Right Shift when held, ) when tapped',
    keycodeInfo: {
      code: 31771,
      label: 'Space Cadet Right Shift Parenthesis Close',
      name: {
        long: 'QK_SPACE_CADET_RIGHT_SHIFT_PARENTHESIS_CLOSE',
        short: 'SC_RSPC',
      },
      keywords: ['Space Cadet Right Shift Parenthesis Close'],
    },
  },
  {
    desc: 'Left Alt when held, ( when tapped',
    keycodeInfo: {
      code: 31772,
      label: 'Space Cadet Left Alt Parenthesis Open',
      name: {
        long: 'QK_SPACE_CADET_LEFT_ALT_PARENTHESIS_OPEN',
        short: 'SC_LAPO',
      },
      keywords: ['Space Cadet Left Alt Parenthesis Open'],
    },
  },
  {
    desc: 'Right Alt when held, ) when tapped',
    keycodeInfo: {
      code: 31773,
      label: 'Space Cadet Right Alt Parenthesis Close',
      name: {
        long: 'QK_SPACE_CADET_RIGHT_ALT_PARENTHESIS_CLOSE',
        short: 'SC_RAPC',
      },
      keywords: ['Space Cadet Right Alt Parenthesis Close'],
    },
  },
  {
    desc: 'Right Shift when held, Enter when tapped',
    keycodeInfo: {
      code: 31774,
      label: 'Space Cadet Right Shift Enter',
      name: {
        long: 'QK_SPACE_CADET_RIGHT_SHIFT_ENTER',
        short: 'SC_SENT',
      },
      keywords: ['Space Cadet Right Shift Enter'],
    },
  },
  {
    desc: 'Automatically switch between USB and Bluetooth',
    keycodeInfo: {
      code: 31776,
      label: 'Output Auto',
      name: {
        long: 'QK_OUTPUT_AUTO',
        short: 'OU_AUTO',
      },
      keywords: ['Output Auto'],
    },
  },
  {
    desc: 'USB only',
    keycodeInfo: {
      code: 31777,
      label: 'Output Usb',
      name: {
        long: 'QK_OUTPUT_USB',
        short: 'OU_USB',
      },
      keywords: ['Output Usb'],
    },
  },
  {
    desc: 'Bluetooth only',
    keycodeInfo: {
      code: 31778,
      label: 'Output Bluetooth',
      name: {
        long: 'QK_OUTPUT_BLUETOOTH',
        short: 'OU_BT',
      },
      keywords: ['Output Bluetooth'],
    },
  },
  {
    desc: 'Cycle through selected input modes',
    keycodeInfo: {
      code: 31792,
      label: 'Unicode Mode Next',
      name: {
        long: 'QK_UNICODE_MODE_NEXT',
        short: 'UC_NEXT',
      },
      keywords: ['Unicode Mode Next'],
    },
  },
  {
    desc: 'Cycle through selected input modes in reverse',
    keycodeInfo: {
      code: 31793,
      label: 'Unicode Mode Previous',
      name: {
        long: 'QK_UNICODE_MODE_PREVIOUS',
        short: 'UC_PREV',
      },
      keywords: ['Unicode Mode Previous'],
    },
  },
  {
    desc: 'Switch to macOS input',
    keycodeInfo: {
      code: 31794,
      label: 'Unicode Mode Macos',
      name: {
        long: 'QK_UNICODE_MODE_MACOS',
        short: 'UC_MAC',
      },
      keywords: ['Unicode Mode Macos'],
    },
  },
  {
    desc: 'Switch to Linux input',
    keycodeInfo: {
      code: 31795,
      label: 'Unicode Mode Linux',
      name: {
        long: 'QK_UNICODE_MODE_LINUX',
        short: 'UC_LINX',
      },
      keywords: ['Unicode Mode Linux'],
    },
  },
  {
    desc: 'Switch to Windows input',
    keycodeInfo: {
      code: 31796,
      label: 'Unicode Mode Windows',
      name: {
        long: 'QK_UNICODE_MODE_WINDOWS',
        short: 'UC_WIN',
      },
      keywords: ['Unicode Mode Windows'],
    },
  },
  {
    desc: 'Switch to BSD input (not implemented)',
    keycodeInfo: {
      code: 31797,
      label: 'Unicode Mode Bsd',
      name: {
        long: 'QK_UNICODE_MODE_BSD',
        short: 'UC_BSD',
      },
      keywords: ['Unicode Mode Bsd'],
    },
  },
  {
    desc: 'Switch to Windows input using WinCompose',
    keycodeInfo: {
      code: 31798,
      label: 'Unicode Mode Wincompose',
      name: {
        long: 'QK_UNICODE_MODE_WINCOMPOSE',
        short: 'UC_WINC',
      },
      keywords: ['Unicode Mode Wincompose'],
    },
  },
  {
    desc: 'Switch to emacs (C-x-8 RET)',
    keycodeInfo: {
      code: 31799,
      label: 'Unicode Mode Emacs',
      name: {
        long: 'QK_UNICODE_MODE_EMACS',
        short: 'UC_EMAC',
      },
      keywords: ['Unicode Mode Emacs'],
    },
  },
  {
    desc: 'Haptic On',
    keycodeInfo: {
      code: 31808,
      label: 'Haptic On',
      name: {
        long: 'QK_HAPTIC_ON',
        short: 'HF_ON',
      },
      keywords: ['Haptic On'],
    },
  },
  {
    desc: 'Haptic Off',
    keycodeInfo: {
      code: 31809,
      label: 'Haptic Off',
      name: {
        long: 'QK_HAPTIC_OFF',
        short: 'HF_OFF',
      },
      keywords: ['Haptic Off'],
    },
  },
  {
    desc: 'Haptic Toggle',
    keycodeInfo: {
      code: 31810,
      label: 'Haptic Toggle',
      name: {
        long: 'QK_HAPTIC_TOGGLE',
        short: 'HF_TOGG',
      },
      keywords: ['Haptic Toggle'],
    },
  },
  {
    desc: 'Haptic Reset',
    keycodeInfo: {
      code: 31811,
      label: 'Haptic Reset',
      name: {
        long: 'QK_HAPTIC_RESET',
        short: 'HF_RST',
      },
      keywords: ['Haptic Reset'],
    },
  },
  {
    desc: 'Haptic Feedback Toggle',
    keycodeInfo: {
      code: 31812,
      label: 'Haptic Feedback Toggle',
      name: {
        long: 'QK_HAPTIC_FEEDBACK_TOGGLE',
        short: 'HF_FDBK',
      },
      keywords: ['Haptic Feedback Toggle'],
    },
  },
  {
    desc: 'Haptic Buzz Toggle',
    keycodeInfo: {
      code: 31813,
      label: 'Haptic Buzz Toggle',
      name: {
        long: 'QK_HAPTIC_BUZZ_TOGGLE',
        short: 'HF_BUZZ',
      },
      keywords: ['Haptic Buzz Toggle'],
    },
  },
  {
    desc: 'Haptic Mode Next',
    keycodeInfo: {
      code: 31814,
      label: 'Haptic Mode Next',
      name: {
        long: 'QK_HAPTIC_MODE_NEXT',
        short: 'HF_NEXT',
      },
      keywords: ['Haptic Mode Next'],
    },
  },
  {
    desc: 'Haptic Mode Previous',
    keycodeInfo: {
      code: 31815,
      label: 'Haptic Mode Previous',
      name: {
        long: 'QK_HAPTIC_MODE_PREVIOUS',
        short: 'HF_PREV',
      },
      keywords: ['Haptic Mode Previous'],
    },
  },
  {
    desc: 'Haptic Continuous Toggle',
    keycodeInfo: {
      code: 31816,
      label: 'Haptic Continuous Toggle',
      name: {
        long: 'QK_HAPTIC_CONTINUOUS_TOGGLE',
        short: 'HF_CONT',
      },
      keywords: ['Haptic Continuous Toggle'],
    },
  },
  {
    desc: 'Haptic Continuous Up',
    keycodeInfo: {
      code: 31817,
      label: 'Haptic Continuous Up',
      name: {
        long: 'QK_HAPTIC_CONTINUOUS_UP',
        short: 'HF_CONU',
      },
      keywords: ['Haptic Continuous Up'],
    },
  },
  {
    desc: 'Haptic Continuous Down',
    keycodeInfo: {
      code: 31818,
      label: 'Haptic Continuous Down',
      name: {
        long: 'QK_HAPTIC_CONTINUOUS_DOWN',
        short: 'HF_COND',
      },
      keywords: ['Haptic Continuous Down'],
    },
  },
  {
    desc: 'Haptic Dwell Up',
    keycodeInfo: {
      code: 31819,
      label: 'Haptic Dwell Up',
      name: {
        long: 'QK_HAPTIC_DWELL_UP',
        short: 'HF_DWLU',
      },
      keywords: ['Haptic Dwell Up'],
    },
  },
  {
    desc: 'Haptic Dwell Down',
    keycodeInfo: {
      code: 31820,
      label: 'Haptic Dwell Down',
      name: {
        long: 'QK_HAPTIC_DWELL_DOWN',
        short: 'HF_DWLD',
      },
      keywords: ['Haptic Dwell Down'],
    },
  },
  {
    desc: 'Combo On',
    keycodeInfo: {
      code: 31824,
      label: 'Combo On',
      name: {
        long: 'QK_COMBO_ON',
        short: 'CM_ON',
      },
      keywords: ['Combo On'],
    },
  },
  {
    desc: 'Combo Off',
    keycodeInfo: {
      code: 31825,
      label: 'Combo Off',
      name: {
        long: 'QK_COMBO_OFF',
        short: 'CM_OFF',
      },
      keywords: ['Combo Off'],
    },
  },
  {
    desc: 'Combo Toggle',
    keycodeInfo: {
      code: 31826,
      label: 'Combo Toggle',
      name: {
        long: 'QK_COMBO_TOGGLE',
        short: 'CM_TOGG',
      },
      keywords: ['Combo Toggle'],
    },
  },
  {
    desc: 'Start recording Macro 1',
    keycodeInfo: {
      code: 31827,
      label: 'Dynamic Macro Record Start 1',
      name: {
        long: 'QK_DYNAMIC_MACRO_RECORD_START_1',
        short: 'DM_REC1',
      },
      keywords: ['Dynamic Macro Record Start 1'],
    },
  },
  {
    desc: 'Start recording Macro 2',
    keycodeInfo: {
      code: 31828,
      label: 'Dynamic Macro Record Start 2',
      name: {
        long: 'QK_DYNAMIC_MACRO_RECORD_START_2',
        short: 'DM_REC2',
      },
      keywords: ['Dynamic Macro Record Start 2'],
    },
  },
  {
    desc: 'Finish the macro that is currently being recorded.',
    keycodeInfo: {
      code: 31829,
      label: 'Dynamic Macro Record Stop',
      name: {
        long: 'QK_DYNAMIC_MACRO_RECORD_STOP',
        short: 'DM_RSTP',
      },
      keywords: ['Dynamic Macro Record Stop'],
    },
  },
  {
    desc: 'Replay Macro 1',
    keycodeInfo: {
      code: 31830,
      label: 'Dynamic Macro Play 1',
      name: {
        long: 'QK_DYNAMIC_MACRO_PLAY_1',
        short: 'DM_PLY1',
      },
      keywords: ['Dynamic Macro Play 1'],
    },
  },
  {
    desc: 'Replay Macro 2',
    keycodeInfo: {
      code: 31831,
      label: 'Dynamic Macro Play 2',
      name: {
        long: 'QK_DYNAMIC_MACRO_PLAY_2',
        short: 'DM_PLY2',
      },
      keywords: ['Dynamic Macro Play 2'],
    },
  },
  {
    desc: 'Leader',
    keycodeInfo: {
      code: 31832,
      label: 'Leader',
      name: {
        long: 'QK_LEADER',
        short: 'QK_LEAD',
      },
      keywords: ['Leader'],
    },
  },
  {
    desc: 'Hold down the next key pressed, until the key is pressed again',
    keycodeInfo: {
      code: 31833,
      label: 'Lock',
      name: {
        long: 'QK_LOCK',
        short: 'QK_LOCK',
      },
      keywords: ['Lock'],
    },
  },
  {
    desc: 'Turns One Shot keys on',
    keycodeInfo: {
      code: 31834,
      label: 'One Shot On',
      name: {
        long: 'QK_ONE_SHOT_ON',
        short: 'OS_ON',
      },
      keywords: ['One Shot On'],
    },
  },
  {
    desc: 'Turns One Shot keys off',
    keycodeInfo: {
      code: 31835,
      label: 'One Shot Off',
      name: {
        long: 'QK_ONE_SHOT_OFF',
        short: 'OS_OFF',
      },
      keywords: ['One Shot Off'],
    },
  },
  {
    desc: 'Toggles One Shot keys status',
    keycodeInfo: {
      code: 31836,
      label: 'One Shot Toggle',
      name: {
        long: 'QK_ONE_SHOT_TOGGLE',
        short: 'OS_TOGG',
      },
      keywords: ['One Shot Toggle'],
    },
  },
  {
    desc: 'Key Override Toggle',
    keycodeInfo: {
      code: 31837,
      label: 'Key Override Toggle',
      name: {
        long: 'QK_KEY_OVERRIDE_TOGGLE',
        short: 'KO_TOGG',
      },
      keywords: ['Key Override Toggle'],
    },
  },
  {
    desc: 'Key Override On',
    keycodeInfo: {
      code: 31838,
      label: 'Key Override On',
      name: {
        long: 'QK_KEY_OVERRIDE_ON',
        short: 'KO_ON',
      },
      keywords: ['Key Override On'],
    },
  },
  {
    desc: 'Key Override Off',
    keycodeInfo: {
      code: 31839,
      label: 'Key Override Off',
      name: {
        long: 'QK_KEY_OVERRIDE_OFF',
        short: 'KO_OFF',
      },
      keywords: ['Key Override Off'],
    },
  },
  {
    desc: 'Secure Lock',
    keycodeInfo: {
      code: 31840,
      label: 'Secure Lock',
      name: {
        long: 'QK_SECURE_LOCK',
        short: 'SE_LOCK',
      },
      keywords: ['Secure Lock'],
    },
  },
  {
    desc: 'Secure Unlock',
    keycodeInfo: {
      code: 31841,
      label: 'Secure Unlock',
      name: {
        long: 'QK_SECURE_UNLOCK',
        short: 'SE_UNLK',
      },
      keywords: ['Secure Unlock'],
    },
  },
  {
    desc: 'Secure Toggle',
    keycodeInfo: {
      code: 31842,
      label: 'Secure Toggle',
      name: {
        long: 'QK_SECURE_TOGGLE',
        short: 'SE_TOGG',
      },
      keywords: ['Secure Toggle'],
    },
  },
  {
    desc: 'Secure Request',
    keycodeInfo: {
      code: 31843,
      label: 'Secure Request',
      name: {
        long: 'QK_SECURE_REQUEST',
        short: 'SE_REQ',
      },
      keywords: ['Secure Request'],
    },
  },
  {
    desc: 'Types the current tapping term, in milliseconds',
    keycodeInfo: {
      code: 31856,
      label: 'Dynamic Tapping Term Print',
      name: {
        long: 'QK_DYNAMIC_TAPPING_TERM_PRINT',
        short: 'DT_PRNT',
      },
      keywords: ['Dynamic Tapping Term Print'],
    },
  },
  {
    desc: 'Increases the current tapping term by DYNAMIC_TAPPING_TERM_INCREMENTms (5ms by default)',
    keycodeInfo: {
      code: 31857,
      label: 'Dynamic Tapping Term Up',
      name: {
        long: 'QK_DYNAMIC_TAPPING_TERM_UP',
        short: 'DT_UP',
      },
      keywords: ['Dynamic Tapping Term Up'],
    },
  },
  {
    desc: 'Decreases the current tapping term by DYNAMIC_TAPPING_TERM_INCREMENTms (5ms by default)',
    keycodeInfo: {
      code: 31858,
      label: 'Dynamic Tapping Term Down',
      name: {
        long: 'QK_DYNAMIC_TAPPING_TERM_DOWN',
        short: 'DT_DOWN',
      },
      keywords: ['Dynamic Tapping Term Down'],
    },
  },
  {
    desc: 'Toggles Caps Word',
    keycodeInfo: {
      code: 31859,
      label: 'Caps Word Toggle',
      name: {
        long: 'QK_CAPS_WORD_TOGGLE',
        short: 'CW_TOGG',
      },
      keywords: ['Caps Word Toggle'],
    },
  },
  {
    desc: 'Turns on the Autocorrect feature.',
    keycodeInfo: {
      code: 31860,
      label: 'Autocorrect On',
      name: {
        long: 'QK_AUTOCORRECT_ON',
        short: 'AC_ON',
      },
      keywords: ['Autocorrect On'],
    },
  },
  {
    desc: 'Turns off the Autocorrect feature.',
    keycodeInfo: {
      code: 31861,
      label: 'Autocorrect Off',
      name: {
        long: 'QK_AUTOCORRECT_OFF',
        short: 'AC_OFF',
      },
      keywords: ['Autocorrect Off'],
    },
  },
  {
    desc: 'Toggles the status of the Autocorrect feature.',
    keycodeInfo: {
      code: 31862,
      label: 'Autocorrect Toggle',
      name: {
        long: 'QK_AUTOCORRECT_TOGGLE',
        short: 'AC_TOGG',
      },
      keywords: ['Autocorrect Toggle'],
    },
  },
  {
    desc: 'Tri Layer Lower',
    keycodeInfo: {
      code: 31863,
      label: 'Tri Layer Lower',
      name: {
        long: 'QK_TRI_LAYER_LOWER',
        short: 'TL_LOWR',
      },
      keywords: ['Tri Layer Lower'],
    },
  },
  {
    desc: 'Tri Layer Upper',
    keycodeInfo: {
      code: 31864,
      label: 'Tri Layer Upper',
      name: {
        long: 'QK_TRI_LAYER_UPPER',
        short: 'TL_UPPR',
      },
      keywords: ['Tri Layer Upper'],
    },
  },
  {
    desc: 'Repeat the last pressed key',
    keycodeInfo: {
      code: 31865,
      label: 'Repeat Key',
      name: {
        long: 'QK_REPEAT_KEY',
        short: 'QK_REP',
      },
      keywords: ['Repeat Key'],
    },
  },
  {
    desc: 'Perform alternate of the last key',
    keycodeInfo: {
      code: 31866,
      label: 'Alt Repeat Key',
      name: {
        long: 'QK_ALT_REPEAT_KEY',
        short: 'QK_AREP',
      },
      keywords: ['Alt Repeat Key'],
    },
  },
  {
    desc: 'Kb 0',
    keycodeInfo: {
      code: 32256,
      label: 'Kb 0',
      name: {
        long: 'QK_KB_0',
        short: 'QK_KB_0',
      },
      keywords: ['Kb 0'],
    },
  },
  {
    desc: 'Kb 1',
    keycodeInfo: {
      code: 32257,
      label: 'Kb 1',
      name: {
        long: 'QK_KB_1',
        short: 'QK_KB_1',
      },
      keywords: ['Kb 1'],
    },
  },
  {
    desc: 'Kb 2',
    keycodeInfo: {
      code: 32258,
      label: 'Kb 2',
      name: {
        long: 'QK_KB_2',
        short: 'QK_KB_2',
      },
      keywords: ['Kb 2'],
    },
  },
  {
    desc: 'Kb 3',
    keycodeInfo: {
      code: 32259,
      label: 'Kb 3',
      name: {
        long: 'QK_KB_3',
        short: 'QK_KB_3',
      },
      keywords: ['Kb 3'],
    },
  },
  {
    desc: 'Kb 4',
    keycodeInfo: {
      code: 32260,
      label: 'Kb 4',
      name: {
        long: 'QK_KB_4',
        short: 'QK_KB_4',
      },
      keywords: ['Kb 4'],
    },
  },
  {
    desc: 'Kb 5',
    keycodeInfo: {
      code: 32261,
      label: 'Kb 5',
      name: {
        long: 'QK_KB_5',
        short: 'QK_KB_5',
      },
      keywords: ['Kb 5'],
    },
  },
  {
    desc: 'Kb 6',
    keycodeInfo: {
      code: 32262,
      label: 'Kb 6',
      name: {
        long: 'QK_KB_6',
        short: 'QK_KB_6',
      },
      keywords: ['Kb 6'],
    },
  },
  {
    desc: 'Kb 7',
    keycodeInfo: {
      code: 32263,
      label: 'Kb 7',
      name: {
        long: 'QK_KB_7',
        short: 'QK_KB_7',
      },
      keywords: ['Kb 7'],
    },
  },
  {
    desc: 'Kb 8',
    keycodeInfo: {
      code: 32264,
      label: 'Kb 8',
      name: {
        long: 'QK_KB_8',
        short: 'QK_KB_8',
      },
      keywords: ['Kb 8'],
    },
  },
  {
    desc: 'Kb 9',
    keycodeInfo: {
      code: 32265,
      label: 'Kb 9',
      name: {
        long: 'QK_KB_9',
        short: 'QK_KB_9',
      },
      keywords: ['Kb 9'],
    },
  },
  {
    desc: 'Kb 10',
    keycodeInfo: {
      code: 32266,
      label: 'Kb 10',
      name: {
        long: 'QK_KB_10',
        short: 'QK_KB_10',
      },
      keywords: ['Kb 10'],
    },
  },
  {
    desc: 'Kb 11',
    keycodeInfo: {
      code: 32267,
      label: 'Kb 11',
      name: {
        long: 'QK_KB_11',
        short: 'QK_KB_11',
      },
      keywords: ['Kb 11'],
    },
  },
  {
    desc: 'Kb 12',
    keycodeInfo: {
      code: 32268,
      label: 'Kb 12',
      name: {
        long: 'QK_KB_12',
        short: 'QK_KB_12',
      },
      keywords: ['Kb 12'],
    },
  },
  {
    desc: 'Kb 13',
    keycodeInfo: {
      code: 32269,
      label: 'Kb 13',
      name: {
        long: 'QK_KB_13',
        short: 'QK_KB_13',
      },
      keywords: ['Kb 13'],
    },
  },
  {
    desc: 'Kb 14',
    keycodeInfo: {
      code: 32270,
      label: 'Kb 14',
      name: {
        long: 'QK_KB_14',
        short: 'QK_KB_14',
      },
      keywords: ['Kb 14'],
    },
  },
  {
    desc: 'Kb 15',
    keycodeInfo: {
      code: 32271,
      label: 'Kb 15',
      name: {
        long: 'QK_KB_15',
        short: 'QK_KB_15',
      },
      keywords: ['Kb 15'],
    },
  },
  {
    desc: 'Kb 16',
    keycodeInfo: {
      code: 32272,
      label: 'Kb 16',
      name: {
        long: 'QK_KB_16',
        short: 'QK_KB_16',
      },
      keywords: ['Kb 16'],
    },
  },
  {
    desc: 'Kb 17',
    keycodeInfo: {
      code: 32273,
      label: 'Kb 17',
      name: {
        long: 'QK_KB_17',
        short: 'QK_KB_17',
      },
      keywords: ['Kb 17'],
    },
  },
  {
    desc: 'Kb 18',
    keycodeInfo: {
      code: 32274,
      label: 'Kb 18',
      name: {
        long: 'QK_KB_18',
        short: 'QK_KB_18',
      },
      keywords: ['Kb 18'],
    },
  },
  {
    desc: 'Kb 19',
    keycodeInfo: {
      code: 32275,
      label: 'Kb 19',
      name: {
        long: 'QK_KB_19',
        short: 'QK_KB_19',
      },
      keywords: ['Kb 19'],
    },
  },
  {
    desc: 'Kb 20',
    keycodeInfo: {
      code: 32276,
      label: 'Kb 20',
      name: {
        long: 'QK_KB_20',
        short: 'QK_KB_20',
      },
      keywords: ['Kb 20'],
    },
  },
  {
    desc: 'Kb 21',
    keycodeInfo: {
      code: 32277,
      label: 'Kb 21',
      name: {
        long: 'QK_KB_21',
        short: 'QK_KB_21',
      },
      keywords: ['Kb 21'],
    },
  },
  {
    desc: 'Kb 22',
    keycodeInfo: {
      code: 32278,
      label: 'Kb 22',
      name: {
        long: 'QK_KB_22',
        short: 'QK_KB_22',
      },
      keywords: ['Kb 22'],
    },
  },
  {
    desc: 'Kb 23',
    keycodeInfo: {
      code: 32279,
      label: 'Kb 23',
      name: {
        long: 'QK_KB_23',
        short: 'QK_KB_23',
      },
      keywords: ['Kb 23'],
    },
  },
  {
    desc: 'Kb 24',
    keycodeInfo: {
      code: 32280,
      label: 'Kb 24',
      name: {
        long: 'QK_KB_24',
        short: 'QK_KB_24',
      },
      keywords: ['Kb 24'],
    },
  },
  {
    desc: 'Kb 25',
    keycodeInfo: {
      code: 32281,
      label: 'Kb 25',
      name: {
        long: 'QK_KB_25',
        short: 'QK_KB_25',
      },
      keywords: ['Kb 25'],
    },
  },
  {
    desc: 'Kb 26',
    keycodeInfo: {
      code: 32282,
      label: 'Kb 26',
      name: {
        long: 'QK_KB_26',
        short: 'QK_KB_26',
      },
      keywords: ['Kb 26'],
    },
  },
  {
    desc: 'Kb 27',
    keycodeInfo: {
      code: 32283,
      label: 'Kb 27',
      name: {
        long: 'QK_KB_27',
        short: 'QK_KB_27',
      },
      keywords: ['Kb 27'],
    },
  },
  {
    desc: 'Kb 28',
    keycodeInfo: {
      code: 32284,
      label: 'Kb 28',
      name: {
        long: 'QK_KB_28',
        short: 'QK_KB_28',
      },
      keywords: ['Kb 28'],
    },
  },
  {
    desc: 'Kb 29',
    keycodeInfo: {
      code: 32285,
      label: 'Kb 29',
      name: {
        long: 'QK_KB_29',
        short: 'QK_KB_29',
      },
      keywords: ['Kb 29'],
    },
  },
  {
    desc: 'Kb 30',
    keycodeInfo: {
      code: 32286,
      label: 'Kb 30',
      name: {
        long: 'QK_KB_30',
        short: 'QK_KB_30',
      },
      keywords: ['Kb 30'],
    },
  },
  {
    desc: 'Kb 31',
    keycodeInfo: {
      code: 32287,
      label: 'Kb 31',
      name: {
        long: 'QK_KB_31',
        short: 'QK_KB_31',
      },
      keywords: ['Kb 31'],
    },
  },
  {
    desc: 'User 0',
    keycodeInfo: {
      code: 32320,
      label: 'User 0',
      name: {
        long: 'QK_USER_0',
        short: 'QK_USER_0',
      },
      keywords: ['User 0'],
    },
  },
  {
    desc: 'User 1',
    keycodeInfo: {
      code: 32321,
      label: 'User 1',
      name: {
        long: 'QK_USER_1',
        short: 'QK_USER_1',
      },
      keywords: ['User 1'],
    },
  },
  {
    desc: 'User 2',
    keycodeInfo: {
      code: 32322,
      label: 'User 2',
      name: {
        long: 'QK_USER_2',
        short: 'QK_USER_2',
      },
      keywords: ['User 2'],
    },
  },
  {
    desc: 'User 3',
    keycodeInfo: {
      code: 32323,
      label: 'User 3',
      name: {
        long: 'QK_USER_3',
        short: 'QK_USER_3',
      },
      keywords: ['User 3'],
    },
  },
  {
    desc: 'User 4',
    keycodeInfo: {
      code: 32324,
      label: 'User 4',
      name: {
        long: 'QK_USER_4',
        short: 'QK_USER_4',
      },
      keywords: ['User 4'],
    },
  },
  {
    desc: 'User 5',
    keycodeInfo: {
      code: 32325,
      label: 'User 5',
      name: {
        long: 'QK_USER_5',
        short: 'QK_USER_5',
      },
      keywords: ['User 5'],
    },
  },
  {
    desc: 'User 6',
    keycodeInfo: {
      code: 32326,
      label: 'User 6',
      name: {
        long: 'QK_USER_6',
        short: 'QK_USER_6',
      },
      keywords: ['User 6'],
    },
  },
  {
    desc: 'User 7',
    keycodeInfo: {
      code: 32327,
      label: 'User 7',
      name: {
        long: 'QK_USER_7',
        short: 'QK_USER_7',
      },
      keywords: ['User 7'],
    },
  },
  {
    desc: 'User 8',
    keycodeInfo: {
      code: 32328,
      label: 'User 8',
      name: {
        long: 'QK_USER_8',
        short: 'QK_USER_8',
      },
      keywords: ['User 8'],
    },
  },
  {
    desc: 'User 9',
    keycodeInfo: {
      code: 32329,
      label: 'User 9',
      name: {
        long: 'QK_USER_9',
        short: 'QK_USER_9',
      },
      keywords: ['User 9'],
    },
  },
  {
    desc: 'User 10',
    keycodeInfo: {
      code: 32330,
      label: 'User 10',
      name: {
        long: 'QK_USER_10',
        short: 'QK_USER_10',
      },
      keywords: ['User 10'],
    },
  },
  {
    desc: 'User 11',
    keycodeInfo: {
      code: 32331,
      label: 'User 11',
      name: {
        long: 'QK_USER_11',
        short: 'QK_USER_11',
      },
      keywords: ['User 11'],
    },
  },
  {
    desc: 'User 12',
    keycodeInfo: {
      code: 32332,
      label: 'User 12',
      name: {
        long: 'QK_USER_12',
        short: 'QK_USER_12',
      },
      keywords: ['User 12'],
    },
  },
  {
    desc: 'User 13',
    keycodeInfo: {
      code: 32333,
      label: 'User 13',
      name: {
        long: 'QK_USER_13',
        short: 'QK_USER_13',
      },
      keywords: ['User 13'],
    },
  },
  {
    desc: 'User 14',
    keycodeInfo: {
      code: 32334,
      label: 'User 14',
      name: {
        long: 'QK_USER_14',
        short: 'QK_USER_14',
      },
      keywords: ['User 14'],
    },
  },
  {
    desc: 'User 15',
    keycodeInfo: {
      code: 32335,
      label: 'User 15',
      name: {
        long: 'QK_USER_15',
        short: 'QK_USER_15',
      },
      keywords: ['User 15'],
    },
  },
  {
    desc: 'User 16',
    keycodeInfo: {
      code: 32336,
      label: 'User 16',
      name: {
        long: 'QK_USER_16',
        short: 'QK_USER_16',
      },
      keywords: ['User 16'],
    },
  },
  {
    desc: 'User 17',
    keycodeInfo: {
      code: 32337,
      label: 'User 17',
      name: {
        long: 'QK_USER_17',
        short: 'QK_USER_17',
      },
      keywords: ['User 17'],
    },
  },
  {
    desc: 'User 18',
    keycodeInfo: {
      code: 32338,
      label: 'User 18',
      name: {
        long: 'QK_USER_18',
        short: 'QK_USER_18',
      },
      keywords: ['User 18'],
    },
  },
  {
    desc: 'User 19',
    keycodeInfo: {
      code: 32339,
      label: 'User 19',
      name: {
        long: 'QK_USER_19',
        short: 'QK_USER_19',
      },
      keywords: ['User 19'],
    },
  },
  {
    desc: 'User 20',
    keycodeInfo: {
      code: 32340,
      label: 'User 20',
      name: {
        long: 'QK_USER_20',
        short: 'QK_USER_20',
      },
      keywords: ['User 20'],
    },
  },
  {
    desc: 'User 21',
    keycodeInfo: {
      code: 32341,
      label: 'User 21',
      name: {
        long: 'QK_USER_21',
        short: 'QK_USER_21',
      },
      keywords: ['User 21'],
    },
  },
  {
    desc: 'User 22',
    keycodeInfo: {
      code: 32342,
      label: 'User 22',
      name: {
        long: 'QK_USER_22',
        short: 'QK_USER_22',
      },
      keywords: ['User 22'],
    },
  },
  {
    desc: 'User 23',
    keycodeInfo: {
      code: 32343,
      label: 'User 23',
      name: {
        long: 'QK_USER_23',
        short: 'QK_USER_23',
      },
      keywords: ['User 23'],
    },
  },
  {
    desc: 'User 24',
    keycodeInfo: {
      code: 32344,
      label: 'User 24',
      name: {
        long: 'QK_USER_24',
        short: 'QK_USER_24',
      },
      keywords: ['User 24'],
    },
  },
  {
    desc: 'User 25',
    keycodeInfo: {
      code: 32345,
      label: 'User 25',
      name: {
        long: 'QK_USER_25',
        short: 'QK_USER_25',
      },
      keywords: ['User 25'],
    },
  },
  {
    desc: 'User 26',
    keycodeInfo: {
      code: 32346,
      label: 'User 26',
      name: {
        long: 'QK_USER_26',
        short: 'QK_USER_26',
      },
      keywords: ['User 26'],
    },
  },
  {
    desc: 'User 27',
    keycodeInfo: {
      code: 32347,
      label: 'User 27',
      name: {
        long: 'QK_USER_27',
        short: 'QK_USER_27',
      },
      keywords: ['User 27'],
    },
  },
  {
    desc: 'User 28',
    keycodeInfo: {
      code: 32348,
      label: 'User 28',
      name: {
        long: 'QK_USER_28',
        short: 'QK_USER_28',
      },
      keywords: ['User 28'],
    },
  },
  {
    desc: 'User 29',
    keycodeInfo: {
      code: 32349,
      label: 'User 29',
      name: {
        long: 'QK_USER_29',
        short: 'QK_USER_29',
      },
      keywords: ['User 29'],
    },
  },
  {
    desc: 'User 30',
    keycodeInfo: {
      code: 32350,
      label: 'User 30',
      name: {
        long: 'QK_USER_30',
        short: 'QK_USER_30',
      },
      keywords: ['User 30'],
    },
  },
  {
    desc: 'User 31',
    keycodeInfo: {
      code: 32351,
      label: 'User 31',
      name: {
        long: 'QK_USER_31',
        short: 'QK_USER_31',
      },
      keywords: ['User 31'],
    },
  },
];
