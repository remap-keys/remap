import { IKeycodeInfo } from './Hid';

export const KC_NO = 0;

export type KeyInfo = {
  desc: string;
  keycodeInfo: IKeycodeInfo;
};
export const keyInfoList: KeyInfo[] = [
  {
    desc: 'Ignore this key (NOOP)',
    keycodeInfo: {
      code: KC_NO,
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
      code: 0x1, // 1 0b1
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
      code: 0x4, // 4 0b100
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
      code: 0x5, // 5 0b101
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
      code: 0x6, // 6 0b110
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
      code: 0x7, // 7 0b111
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
      code: 0x8, // 8 0b1000
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
      code: 0x9, // 9 0b1001
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
      code: 0xa, // 10 0b1010
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
      code: 0xb, // 11 0b1011
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
      code: 0xc, // 12 0b1100
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
      code: 0xd, // 13 0b1101
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
      code: 0xe, // 14 0b1110
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
      code: 0xf, // 15 0b1111
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
      code: 0x10, // 16 0b10000
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
      code: 0x11, // 17 0b10001
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
      code: 0x12, // 18 0b10010
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
      code: 0x13, // 19 0b10011
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
      code: 0x14, // 20 0b10100
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
      code: 0x15, // 21 0b10101
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
      code: 0x16, // 22 0b10110
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
      code: 0x17, // 23 0b10111
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
      code: 0x18, // 24 0b11000
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
      code: 0x19, // 25 0b11001
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
      code: 0x1a, // 26 0b11010
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
      code: 0x1b, // 27 0b11011
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
      code: 0x1c, // 28 0b11100
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
      code: 0x1d, // 29 0b11101
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
      code: 0x1e, // 30 0b11110
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
      code: 0x1f, // 31 0b11111
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
      code: 0x20, // 32 0b100000
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
      code: 0x21, // 33 0b100001
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
      code: 0x22, // 34 0b100010
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
      code: 0x23, // 35 0b100011
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
      code: 0x24, // 36 0b100100
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
      code: 0x25, // 37 0b100101
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
      code: 0x26, // 38 0b100110
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
      code: 0x27, // 39 0b100111
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
      code: 0x28, // 40 0b101000
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
      code: 0x29, // 41 0b101001
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
      code: 0x2a, // 42 0b101010
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
      code: 0x2b, // 43 0b101011
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
      code: 0x2c, // 44 0b101100
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
      code: 0x2d, // 45 0b101101
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
      code: 0x2e, // 46 0b101110
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
      code: 0x2f, // 47 0b101111
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
      code: 0x30, // 48 0b110000
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
      code: 0x31, // 49 0b110001
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
      code: 0x32, // 50 0b110010
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
      code: 0x33, // 51 0b110011
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
      code: 0x34, // 52 0b110100
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
      code: 0x35, // 53 0b110101
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
      code: 0x36, // 54 0b110110
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
      code: 0x37, // 55 0b110111
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
      code: 0x38, // 56 0b111000
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
      code: 0x39, // 57 0b111001
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
      code: 0x3a, // 58 0b111010
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
      code: 0x3b, // 59 0b111011
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
      code: 0x3c, // 60 0b111100
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
      code: 0x3d, // 61 0b111101
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
      code: 0x3e, // 62 0b111110
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
      code: 0x3f, // 63 0b111111
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
      code: 0x40, // 64 0b1000000
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
      code: 0x41, // 65 0b1000001
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
      code: 0x42, // 66 0b1000010
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
      code: 0x43, // 67 0b1000011
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
      code: 0x44, // 68 0b1000100
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
      code: 0x45, // 69 0b1000101
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
      code: 0x46, // 70 0b1000110
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
      code: 0x47, // 71 0b1000111
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
      code: 0x48, // 72 0b1001000
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
      code: 0x49, // 73 0b1001001
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
      code: 0x4a, // 74 0b1001010
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
      code: 0x4b, // 75 0b1001011
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
      code: 0x4c, // 76 0b1001100
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
      code: 0x4d, // 77 0b1001101
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
      code: 0x4e, // 78 0b1001110
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
      code: 0x4f, // 79 0b1001111
      label: '→',
      name: {
        long: 'KC_RIGHT',
        short: 'KC_RGHT',
      },
      keywords: ['right arrow', 'rght', 'arrow', 'arrowright', '→'],
    },
  },
  {
    desc: 'Left Arrow',
    keycodeInfo: {
      code: 0x50, // 80 0b1010000
      label: '←',
      name: {
        long: 'KC_LEFT',
        short: 'KC_LEFT',
      },
      keywords: ['left arrow', 'arrow', 'arrowleft', '←'],
    },
  },
  {
    desc: 'Down Arrow',
    keycodeInfo: {
      code: 0x51, // 81 0b1010001
      label: '↓',
      name: {
        long: 'KC_DOWN',
        short: 'KC_DOWN',
      },
      keywords: ['down arrow', 'arrow', 'arrowdown', '↓'],
    },
  },
  {
    desc: 'Up Arrow',
    keycodeInfo: {
      code: 0x52, // 82 0b1010010
      label: '↑',
      name: {
        long: 'KC_UP',
        short: 'KC_UP',
      },
      keywords: ['up arrow', 'arrow', 'arrowup', '↑'],
    },
  },
  {
    desc: 'Keypad Num Lock and Clear',
    keycodeInfo: {
      code: 0x53, // 83 0b1010011
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
      code: 0x54, // 84 0b1010100
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
      code: 0x55, // 85 0b1010101
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
      code: 0x56, // 86 0b1010110
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
      code: 0x57, // 87 0b1010111
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
      code: 0x58, // 88 0b1011000
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
      code: 0x59, // 89 0b1011001
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
      code: 0x5a, // 90 0b1011010
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
      code: 0x5b, // 91 0b1011011
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
      code: 0x5c, // 92 0b1011100
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
      code: 0x5d, // 93 0b1011101
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
      code: 0x5e, // 94 0b1011110
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
      code: 0x5f, // 95 0b1011111
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
      code: 0x60, // 96 0b1100000
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
      code: 0x61, // 97 0b1100001
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
      code: 0x62, // 98 0b1100010
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
      code: 0x63, // 99 0b1100011
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
      code: 0x64, // 100 0b1100100
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
      code: 0x65, // 101 0b1100101
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
      code: 0x66, // 102 0b1100110
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
      code: 0x67, // 103 0b1100111
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
      code: 0x68, // 104 0b1101000
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
      code: 0x69, // 105 0b1101001
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
      code: 0x6a, // 106 0b1101010
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
      code: 0x6b, // 107 0b1101011
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
      code: 0x6c, // 108 0b1101100
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
      code: 0x6d, // 109 0b1101101
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
      code: 0x6e, // 110 0b1101110
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
      code: 0x6f, // 111 0b1101111
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
      code: 0x70, // 112 0b1110000
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
      code: 0x71, // 113 0b1110001
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
      code: 0x72, // 114 0b1110010
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
      code: 0x73, // 115 0b1110011
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
      code: 0x74, // 116 0b1110100
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
      code: 0x75, // 117 0b1110101
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
      code: 0x76, // 118 0b1110110
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
      code: 0x77, // 119 0b1110111
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
      code: 0x78, // 120 0b1111000
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
      code: 0x79, // 121 0b1111001
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
      code: 0x7a, // 122 0b1111010
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
      code: 0x7b, // 123 0b1111011
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
      code: 0x7c, // 124 0b1111100
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
      code: 0x7d, // 125 0b1111101
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
      code: 0x7e, // 126 0b1111110
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
      code: 0x7f, // 127 0b1111111
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
      code: 0x80, // 128 0b10000000
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
      code: 0x81, // 129 0b10000001
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
      code: 0x82, // 130 0b10000010
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
      code: 0x83, // 131 0b10000011
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
      code: 0x84, // 132 0b10000100
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
      code: 0x85, // 133 0b10000101
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
      code: 0x86, // 134 0b10000110
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
      code: 0x87, // 135 0b10000111
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
      code: 0x88, // 136 0b10001000
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
      code: 0x89, // 137 0b10001001
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
      code: 0x8a, // 138 0b10001010
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
      code: 0x8b, // 139 0b10001011
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
      code: 0x8c, // 140 0b10001100
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
      code: 0x8d, // 141 0b10001101
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
      code: 0x8e, // 142 0b10001110
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
      code: 0x8f, // 143 0b10001111
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
      code: 0x90, // 144 0b10010000
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
      code: 0x91, // 145 0b10010001
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
      code: 0x92, // 146 0b10010010
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
      code: 0x93, // 147 0b10010011
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
      code: 0x94, // 148 0b10010100
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
      code: 0x95, // 149 0b10010101
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
      code: 0x96, // 150 0b10010110
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
      code: 0x97, // 151 0b10010111
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
      code: 0x98, // 152 0b10011000
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
      code: 0x99, // 153 0b10011001
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
      code: 0x9a, // 154 0b10011010
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
      code: 0x9b, // 155 0b10011011
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
      code: 0x9c, // 156 0b10011100
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
      code: 0x9d, // 157 0b10011101
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
      code: 0x9e, // 158 0b10011110
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
      code: 0x9f, // 159 0b10011111
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
      code: 0xa0, // 160 0b10100000
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
      code: 0xa1, // 161 0b10100001
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
      code: 0xa2, // 162 0b10100010
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
      code: 0xa3, // 163 0b10100011
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
      code: 0xa4, // 164 0b10100100
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
      code: 0xa5, // 165 0b10100101
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
      code: 0xa6, // 166 0b10100110
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
      code: 0xa7, // 167 0b10100111
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
      code: 0xa8, // 168 0b10101000
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
      code: 0xa9, // 169 0b10101001
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
      code: 0xaa, // 170 0b10101010
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
      code: 0xab, // 171 0b10101011
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
      code: 0xac, // 172 0b10101100
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
      code: 0xad, // 173 0b10101101
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
      code: 0xae, // 174 0b10101110
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
      code: 0xaf, // 175 0b10101111
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
      code: 0xb0, // 176 0b10110000
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
      code: 0xb1, // 177 0b10110001
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
      code: 0xb2, // 178 0b10110010
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
      code: 0xb3, // 179 0b10110011
      label: 'My Computer',
      name: {
        long: 'KC_MY_COMPUTER',
        short: 'KC_MYCM',
      },
      keywords: ['my_computer', 'mycm'],
    },
  },
  {
    desc: 'Browser Search',
    keycodeInfo: {
      code: 0xb4, // 180 0b10110100
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
      code: 0xb5, // 181 0b10110101
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
      code: 0xb6, // 182 0b10110110
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
      code: 0xb7, // 183 0b10110111
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
      code: 0xb8, // 184 0b10111000
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
      code: 0xb9, // 185 0b10111001
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
      code: 0xba, // 186 0b10111010
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
      code: 0xbb, // 187 0b10111011
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
      code: 0xbc, // 188 0b10111100
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
      code: 0xbd, // 189 0b10111101
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
      code: 0xbe, // 190 0b10111110
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
      code: 0xbf, // 191 0b10111111
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
      code: 0xc0, // 192 0b11000000
      label: 'Assistant',
      name: {
        long: 'KC_ASSISTANT',
        short: 'KC_ASST',
      },
      keywords: ['assistant'],
    },
  },
  {
    desc: 'Open Mission Control',
    keycodeInfo: {
      code: 0xc1, // 193 0b11000001
      label: 'Mission Control',
      name: {
        long: 'KC_MISSION_CONTROL',
        short: 'KC_MCTL',
      },
      keywords: ['mission control'],
    },
  },
  {
    desc: 'Open Launchpad',
    keycodeInfo: {
      code: 0xc2, // 194 0b11000010
      label: 'Launchpad',
      name: {
        long: 'KC_LAUNCHPAD',
        short: 'KC_LPAD',
      },
      keywords: ['launchpad'],
    },
  },
  {
    desc: 'Mouse Cursor Up',
    keycodeInfo: {
      code: 0xcd, // 205 0b11001101
      label: 'Mouse ↑',
      name: {
        long: 'KC_MS_UP',
        short: 'KC_MS_U',
      },
      keywords: ['mouse cursor up'],
    },
  },
  {
    desc: 'Mouse Cursor Down',
    keycodeInfo: {
      code: 0xce, // 206 0b11001110
      label: 'Mouse ↓',
      name: {
        long: 'KC_MS_DOWN',
        short: 'KC_MS_D',
      },
      keywords: ['mouse cursor down'],
    },
  },
  {
    desc: 'Mouse Cursor Left',
    keycodeInfo: {
      code: 0xcf, // 207 0b11001111
      label: 'Mouse ←',
      name: {
        long: 'KC_MS_LEFT',
        short: 'KC_MS_L',
      },
      keywords: ['mouse cursor left'],
    },
  },
  {
    desc: 'Mouse Cursor Right',
    keycodeInfo: {
      code: 0xd0, // 208 0b11010000
      label: 'Mouse →',
      name: {
        long: 'KC_MS_RIGHT',
        short: 'KC_MS_R',
      },
      keywords: ['mouse cursor right'],
    },
  },
  {
    desc: 'Mouse Button 1',
    keycodeInfo: {
      code: 0xd1, // 209 0b11010001
      label: 'Mouse Btn1',
      name: {
        long: 'KC_MS_BTN1',
        short: 'KC_BTN1',
      },
      keywords: ['mouse button 1'],
    },
  },
  {
    desc: 'Mouse Button 2',
    keycodeInfo: {
      code: 0xd2, // 210 0b11010010
      label: 'Mouse Btn2',
      name: {
        long: 'KC_MS_BTN2',
        short: 'KC_BTN2',
      },
      keywords: ['mouse button 2'],
    },
  },
  {
    desc: 'Mouse Button 3',
    keycodeInfo: {
      code: 0xd3, // 211 0b11010011
      label: 'Mouse Btn3',
      name: {
        long: 'KC_MS_BTN3',
        short: 'KC_BTN3',
      },
      keywords: ['mouse button 3'],
    },
  },
  {
    desc: 'Mouse Button 4',
    keycodeInfo: {
      code: 0xd4, // 212 0b11010100
      label: 'Mouse Btn4',
      name: {
        long: 'KC_MS_BTN4',
        short: 'KC_BTN4',
      },
      keywords: ['mouse button 4'],
    },
  },
  {
    desc: 'Mouse Button 5',
    keycodeInfo: {
      code: 0xd5, // 213 0b11010101
      label: 'Mouse Btn5',
      name: {
        long: 'KC_MS_BTN5',
        short: 'KC_BTN5',
      },
      keywords: ['mouse button 5'],
    },
  },
  {
    desc: 'Press button 6',
    keycodeInfo: {
      code: 0xd6, // 214 0b11010110
      label: 'Mouse Btn6',
      name: {
        long: 'KC_MS_BTN6',
        short: 'KC_BTN6',
      },
      keywords: ['mouse button 6'],
    },
  },
  {
    desc: 'Press button 7',
    keycodeInfo: {
      code: 0xd7, // 215 0b11010111
      label: 'Mouse Btn7',
      name: {
        long: 'KC_MS_BTN7',
        short: 'KC_BTN7',
      },
      keywords: ['mouse button 7'],
    },
  },
  {
    desc: 'Press button 8',
    keycodeInfo: {
      code: 0xd8, // 216 0b11011000
      label: 'Mouse Btn8',
      name: {
        long: 'KC_MS_BTN8',
        short: 'KC_BTN8',
      },
      keywords: ['mouse button 8'],
    },
  },
  {
    desc: 'Mouse Wheel Up',
    keycodeInfo: {
      code: 0xd9, // 217 0b11011001
      label: 'Mouse Wh ↑',
      name: {
        long: 'KC_MS_WH_UP',
        short: 'KC_WH_U',
      },
      keywords: ['mouse wheel up'],
    },
  },
  {
    desc: 'Mouse Wheel Down',
    keycodeInfo: {
      code: 0xda, // 218 0b11011010
      label: 'Mouse Wh ↓',
      name: {
        long: 'KC_MS_WH_DOWN',
        short: 'KC_WH_D',
      },
      keywords: ['mouse wheel down'],
    },
  },
  {
    desc: 'Mouse Wheel Left',
    keycodeInfo: {
      code: 0xdb, // 219 0b11011011
      label: 'Mouse Wh ←',
      name: {
        long: 'KC_MS_WH_LEFT',
        short: 'KC_WH_L',
      },
      keywords: ['mouse wheel left'],
    },
  },
  {
    desc: 'Mouse Wheel Right',
    keycodeInfo: {
      code: 0xdc, // 220 0b11011100
      label: 'Mouse Wh →',
      name: {
        long: 'KC_MS_WH_RIGHT',
        short: 'KC_WH_R',
      },
      keywords: ['mouse wheel right'],
    },
  },
  {
    desc: 'Set mouse acceleration to 0',
    keycodeInfo: {
      code: 0xdd, // 221 0b11011101
      label: 'Mouse Acc0',
      name: {
        long: 'KC_MS_ACCEL0',
        short: 'KC_ACL0',
      },
      keywords: ['mouse acceleration 0'],
    },
  },
  {
    desc: 'Set mouse acceleration to 1',
    keycodeInfo: {
      code: 0xde, // 222 0b11011110
      label: 'Mouse Acc1',
      name: {
        long: 'KC_MS_ACCEL1',
        short: 'KC_ACL1',
      },
      keywords: ['mouse acceleration 1'],
    },
  },
  {
    desc: 'Set mouse acceleration to 2',
    keycodeInfo: {
      code: 0xdf, // 223 0b11011111
      label: 'Mouse Acc2',
      name: {
        long: 'KC_MS_ACCEL2',
        short: 'KC_ACL2',
      },
      keywords: ['mouse acceleration 2'],
    },
  },
  {
    desc: 'Left Control',
    keycodeInfo: {
      code: 0xe0, // 224 0b11100000
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
      code: 0xe1, // 225 0b11100001
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
      code: 0xe2, // 226 0b11100010
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
      code: 0xe3, // 227 0b11100011
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
      code: 0xe4, // 228 0b11100100
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
      code: 0xe5, // 229 0b11100101
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
      code: 0xe6, // 230 0b11100110
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
      code: 0xe7, // 231 0b11100111
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
      code: 0x56f0, // 22256 0b101011011110000
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
      code: 0x56f1, // 22257 0b101011011110001
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
      code: 0x56f2, // 22258 0b101011011110010
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
      code: 0x56f3, // 22259 0b101011011110011
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
      code: 0x56f4, // 22260 0b101011011110100
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
      code: 0x56f5, // 22261 0b101011011110101
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
      code: 0x56f6, // 22262 0b101011011110110
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
      code: 0x7000, // 28672 0b111000000000000
      label: 'Swap Ctrl CapsLock',
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
      code: 0x7001, // 28673 0b111000000000001
      label: 'Unswap Ctrl CapsLock',
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
      code: 0x7002, // 28674 0b111000000000010
      label: 'Toggle Ctrl CapsLock',
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
      code: 0x7003, // 28675 0b111000000000011
      label: 'CapsLock As Ctrl Off',
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
      code: 0x7004, // 28676 0b111000000000100
      label: 'CapsLock As Ctrl On',
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
      code: 0x7005, // 28677 0b111000000000101
      label: 'Swap *Alt *GUI',
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
      code: 0x7006, // 28678 0b111000000000110
      label: 'Unswap *Alt *GUI',
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
      code: 0x7007, // 28679 0b111000000000111
      label: 'Swap Alt* GUI*',
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
      code: 0x7008, // 28680 0b111000000001000
      label: 'Unswap Alt* GUI*',
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
      code: 0x7009, // 28681 0b111000000001001
      label: 'GUI On',
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
      code: 0x700a, // 28682 0b111000000001010
      label: 'GUI Off',
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
      code: 0x700b, // 28683 0b111000000001011
      label: 'Toggle GUI',
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
      code: 0x700c, // 28684 0b111000000001100
      label: 'Swap ` ESC',
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
      code: 0x700d, // 28685 0b111000000001101
      label: 'Unswap ` ESC',
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
      code: 0x700e, // 28686 0b111000000001110
      label: 'Swap \\ Backspace',
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
      code: 0x700f, // 28687 0b111000000001111
      label: 'Unswap \\ Backspace',
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
      code: 0x7010, // 28688 0b111000000010000
      label: 'Toggle \\ Backspace',
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
      code: 0x7011, // 28689 0b111000000010001
      label: 'NKRO On',
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
      code: 0x7012, // 28690 0b111000000010010
      label: 'NKRO Off',
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
      code: 0x7013, // 28691 0b111000000010011
      label: 'Toggle NKRO',
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
      code: 0x7014, // 28692 0b111000000010100
      label: 'Swap Alt GUI',
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
      code: 0x7015, // 28693 0b111000000010101
      label: 'Unswap Alt GUI',
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
      code: 0x7016, // 28694 0b111000000010110
      label: 'Toggle Alt GUI',
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
      code: 0x7017, // 28695 0b111000000010111
      label: 'Swap *Ctl *GUI',
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
      code: 0x7018, // 28696 0b111000000011000
      label: 'Unswap *Ctl *GUI',
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
      code: 0x7019, // 28697 0b111000000011001
      label: 'Swap Ctl* GUI*',
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
      code: 0x701a, // 28698 0b111000000011010
      label: 'Unswap Ctl* GUI*',
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
      code: 0x701b, // 28699 0b111000000011011
      label: 'Swap Ctrl GUI',
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
      code: 0x701c, // 28700 0b111000000011100
      label: 'Unswap Ctrl GUI',
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
      code: 0x701d, // 28701 0b111000000011101
      label: 'Toggle Ctrl GUI',
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
      code: 0x701e, // 28702 0b111000000011110
      label: 'EE Hands Left',
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
      code: 0x701f, // 28703 0b111000000011111
      label: 'EE Hands Right',
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
      code: 0x7020, // 28704 0b111000000100000
      label: 'Swap ESC CapsLock',
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
      code: 0x7021, // 28705 0b111000000100001
      label: 'Unswap ESC CapsLock',
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
      code: 0x7022, // 28706 0b111000000100010
      label: 'Toggle ESC CapsLock',
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
      code: 0x7100, // 28928 0b111000100000000
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
      code: 0x7101, // 28929 0b111000100000001
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
      code: 0x7102, // 28930 0b111000100000010
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
      code: 0x7103, // 28931 0b111000100000011
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
      code: 0x7104, // 28932 0b111000100000100
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
      code: 0x7105, // 28933 0b111000100000101
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
      code: 0x7106, // 28934 0b111000100000110
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
      code: 0x7107, // 28935 0b111000100000111
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
      code: 0x7108, // 28936 0b111000100001000
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
      code: 0x7109, // 28937 0b111000100001001
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
      code: 0x710a, // 28938 0b111000100001010
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
      code: 0x710b, // 28939 0b111000100001011
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
      code: 0x710c, // 28940 0b111000100001100
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
      code: 0x710d, // 28941 0b111000100001101
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
      code: 0x710e, // 28942 0b111000100001110
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
      code: 0x710f, // 28943 0b111000100001111
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
      code: 0x7110, // 28944 0b111000100010000
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
      code: 0x7111, // 28945 0b111000100010001
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
      code: 0x7112, // 28946 0b111000100010010
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
      code: 0x7113, // 28947 0b111000100010011
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
      code: 0x7114, // 28948 0b111000100010100
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
      code: 0x7115, // 28949 0b111000100010101
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
      code: 0x7116, // 28950 0b111000100010110
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
      code: 0x7117, // 28951 0b111000100010111
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
      code: 0x7118, // 28952 0b111000100011000
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
      code: 0x7119, // 28953 0b111000100011001
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
      code: 0x711a, // 28954 0b111000100011010
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
      code: 0x711b, // 28955 0b111000100011011
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
      code: 0x711c, // 28956 0b111000100011100
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
      code: 0x711d, // 28957 0b111000100011101
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
      code: 0x711e, // 28958 0b111000100011110
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
      code: 0x711f, // 28959 0b111000100011111
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
      code: 0x7120, // 28960 0b111000100100000
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
      code: 0x7121, // 28961 0b111000100100001
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
      code: 0x7122, // 28962 0b111000100100010
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
      code: 0x7123, // 28963 0b111000100100011
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
      code: 0x7124, // 28964 0b111000100100100
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
      code: 0x7125, // 28965 0b111000100100101
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
      code: 0x7126, // 28966 0b111000100100110
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
      code: 0x7127, // 28967 0b111000100100111
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
      code: 0x7128, // 28968 0b111000100101000
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
      code: 0x7129, // 28969 0b111000100101001
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
      code: 0x712a, // 28970 0b111000100101010
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
      code: 0x712b, // 28971 0b111000100101011
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
      code: 0x712c, // 28972 0b111000100101100
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
      code: 0x712d, // 28973 0b111000100101101
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
      code: 0x712e, // 28974 0b111000100101110
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
      code: 0x712f, // 28975 0b111000100101111
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
      code: 0x7130, // 28976 0b111000100110000
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
      code: 0x7131, // 28977 0b111000100110001
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
      code: 0x7132, // 28978 0b111000100110010
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
      code: 0x7133, // 28979 0b111000100110011
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
      code: 0x7134, // 28980 0b111000100110100
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
      code: 0x7135, // 28981 0b111000100110101
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
      code: 0x7136, // 28982 0b111000100110110
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
      code: 0x7137, // 28983 0b111000100110111
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
      code: 0x7138, // 28984 0b111000100111000
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
      code: 0x7139, // 28985 0b111000100111001
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
      code: 0x713a, // 28986 0b111000100111010
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
      code: 0x713b, // 28987 0b111000100111011
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
      code: 0x713c, // 28988 0b111000100111100
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
      code: 0x713d, // 28989 0b111000100111101
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
      code: 0x713e, // 28990 0b111000100111110
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
      code: 0x713f, // 28991 0b111000100111111
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
      code: 0x7140, // 28992 0b111000101000000
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
      code: 0x7141, // 28993 0b111000101000001
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
      code: 0x7142, // 28994 0b111000101000010
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
      code: 0x7143, // 28995 0b111000101000011
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
      code: 0x7144, // 28996 0b111000101000100
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
      code: 0x7145, // 28997 0b111000101000101
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
      code: 0x7146, // 28998 0b111000101000110
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
      code: 0x7147, // 28999 0b111000101000111
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
      code: 0x7148, // 29000 0b111000101001000
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
      code: 0x7149, // 29001 0b111000101001001
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
      code: 0x714a, // 29002 0b111000101001010
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
      code: 0x714b, // 29003 0b111000101001011
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
      code: 0x714c, // 29004 0b111000101001100
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
      code: 0x714d, // 29005 0b111000101001101
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
      code: 0x714e, // 29006 0b111000101001110
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
      code: 0x714f, // 29007 0b111000101001111
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
      code: 0x7150, // 29008 0b111000101010000
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
      code: 0x7151, // 29009 0b111000101010001
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
      code: 0x7152, // 29010 0b111000101010010
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
      code: 0x7153, // 29011 0b111000101010011
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
      code: 0x7154, // 29012 0b111000101010100
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
      code: 0x7155, // 29013 0b111000101010101
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
      code: 0x7156, // 29014 0b111000101010110
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
      code: 0x7157, // 29015 0b111000101010111
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
      code: 0x7158, // 29016 0b111000101011000
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
      code: 0x7159, // 29017 0b111000101011001
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
      code: 0x715a, // 29018 0b111000101011010
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
      code: 0x715b, // 29019 0b111000101011011
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
      code: 0x715c, // 29020 0b111000101011100
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
      code: 0x715d, // 29021 0b111000101011101
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
      code: 0x715e, // 29022 0b111000101011110
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
      code: 0x715f, // 29023 0b111000101011111
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
      code: 0x7160, // 29024 0b111000101100000
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
      code: 0x7161, // 29025 0b111000101100001
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
      code: 0x7162, // 29026 0b111000101100010
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
      code: 0x7163, // 29027 0b111000101100011
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
      code: 0x7164, // 29028 0b111000101100100
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
      code: 0x7165, // 29029 0b111000101100101
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
      code: 0x7166, // 29030 0b111000101100110
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
      code: 0x7167, // 29031 0b111000101100111
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
      code: 0x7168, // 29032 0b111000101101000
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
      code: 0x7169, // 29033 0b111000101101001
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
      code: 0x716a, // 29034 0b111000101101010
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
      code: 0x716b, // 29035 0b111000101101011
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
      code: 0x716c, // 29036 0b111000101101100
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
      code: 0x716d, // 29037 0b111000101101101
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
      code: 0x716e, // 29038 0b111000101101110
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
      code: 0x716f, // 29039 0b111000101101111
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
      code: 0x7170, // 29040 0b111000101110000
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
      code: 0x7171, // 29041 0b111000101110001
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
      code: 0x7172, // 29042 0b111000101110010
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
      code: 0x7173, // 29043 0b111000101110011
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
      code: 0x7174, // 29044 0b111000101110100
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
      code: 0x7175, // 29045 0b111000101110101
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
      code: 0x7176, // 29046 0b111000101110110
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
      code: 0x7177, // 29047 0b111000101110111
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
      code: 0x7178, // 29048 0b111000101111000
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
      code: 0x7179, // 29049 0b111000101111001
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
      code: 0x717a, // 29050 0b111000101111010
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
      code: 0x717b, // 29051 0b111000101111011
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
      code: 0x717c, // 29052 0b111000101111100
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
      code: 0x717d, // 29053 0b111000101111101
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
      code: 0x717e, // 29054 0b111000101111110
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
      code: 0x717f, // 29055 0b111000101111111
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
      code: 0x7180, // 29056 0b111000110000000
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
      code: 0x7181, // 29057 0b111000110000001
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
      code: 0x7182, // 29058 0b111000110000010
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
      code: 0x7183, // 29059 0b111000110000011
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
      code: 0x7184, // 29060 0b111000110000100
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
      code: 0x7185, // 29061 0b111000110000101
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
      code: 0x7186, // 29062 0b111000110000110
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
      code: 0x7187, // 29063 0b111000110000111
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
      code: 0x7188, // 29064 0b111000110001000
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
      code: 0x7189, // 29065 0b111000110001001
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
      code: 0x718a, // 29066 0b111000110001010
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
      code: 0x718b, // 29067 0b111000110001011
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
      code: 0x718c, // 29068 0b111000110001100
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
      code: 0x718d, // 29069 0b111000110001101
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
      code: 0x718e, // 29070 0b111000110001110
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
      code: 0x718f, // 29071 0b111000110001111
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
      code: 0x7200, // 29184 0b111001000000000
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
      code: 0x7201, // 29185 0b111001000000001
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
      code: 0x7202, // 29186 0b111001000000010
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
      code: 0x7203, // 29187 0b111001000000011
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
      code: 0x7204, // 29188 0b111001000000100
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
      code: 0x7205, // 29189 0b111001000000101
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
      code: 0x7206, // 29190 0b111001000000110
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
      code: 0x7207, // 29191 0b111001000000111
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
      code: 0x7208, // 29192 0b111001000001000
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
      code: 0x7400, // 29696 0b111010000000000
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
      code: 0x7401, // 29697 0b111010000000001
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
      code: 0x7402, // 29698 0b111010000000010
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
      code: 0x7403, // 29699 0b111010000000011
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
      code: 0x7404, // 29700 0b111010000000100
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
      code: 0x7405, // 29701 0b111010000000101
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
      code: 0x7406, // 29702 0b111010000000110
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
      code: 0x7407, // 29703 0b111010000000111
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
      code: 0x7408, // 29704 0b111010000001000
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
      code: 0x7409, // 29705 0b111010000001001
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
      code: 0x740a, // 29706 0b111010000001010
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
      code: 0x740b, // 29707 0b111010000001011
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
      code: 0x740c, // 29708 0b111010000001100
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
      code: 0x740d, // 29709 0b111010000001101
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
      code: 0x740e, // 29710 0b111010000001110
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
      code: 0x740f, // 29711 0b111010000001111
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
      code: 0x7410, // 29712 0b111010000010000
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
      code: 0x7411, // 29713 0b111010000010001
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
      code: 0x7412, // 29714 0b111010000010010
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
      code: 0x7413, // 29715 0b111010000010011
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
      code: 0x7414, // 29716 0b111010000010100
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
      code: 0x7415, // 29717 0b111010000010101
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
      code: 0x7416, // 29718 0b111010000010110
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
      code: 0x7417, // 29719 0b111010000010111
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
      code: 0x7418, // 29720 0b111010000011000
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
      code: 0x7419, // 29721 0b111010000011001
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
      code: 0x741a, // 29722 0b111010000011010
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
      code: 0x741b, // 29723 0b111010000011011
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
      code: 0x741c, // 29724 0b111010000011100
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
      code: 0x741d, // 29725 0b111010000011101
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
      code: 0x741e, // 29726 0b111010000011110
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
      code: 0x741f, // 29727 0b111010000011111
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
      code: 0x7440, // 29760 0b111010001000000
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
      code: 0x7441, // 29761 0b111010001000001
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
      code: 0x7442, // 29762 0b111010001000010
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
      code: 0x7443, // 29763 0b111010001000011
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
      code: 0x7444, // 29764 0b111010001000100
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
      code: 0x7445, // 29765 0b111010001000101
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
      code: 0x7446, // 29766 0b111010001000110
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
      code: 0x7447, // 29767 0b111010001000111
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
      code: 0x7448, // 29768 0b111010001001000
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
      code: 0x7449, // 29769 0b111010001001001
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
      code: 0x744a, // 29770 0b111010001001010
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
      code: 0x744b, // 29771 0b111010001001011
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
      code: 0x744c, // 29772 0b111010001001100
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
      code: 0x744d, // 29773 0b111010001001101
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
      code: 0x744e, // 29774 0b111010001001110
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
      code: 0x744f, // 29775 0b111010001001111
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
      code: 0x7450, // 29776 0b111010001010000
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
      code: 0x7451, // 29777 0b111010001010001
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
      code: 0x7452, // 29778 0b111010001010010
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
      code: 0x7453, // 29779 0b111010001010011
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
      code: 0x7454, // 29780 0b111010001010100
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
      code: 0x7455, // 29781 0b111010001010101
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
      code: 0x7456, // 29782 0b111010001010110
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
      code: 0x7457, // 29783 0b111010001010111
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
      code: 0x7458, // 29784 0b111010001011000
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
      code: 0x7459, // 29785 0b111010001011001
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
      code: 0x745a, // 29786 0b111010001011010
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
      code: 0x745b, // 29787 0b111010001011011
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
      code: 0x745c, // 29788 0b111010001011100
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
      code: 0x745d, // 29789 0b111010001011101
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
      code: 0x745e, // 29790 0b111010001011110
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
      code: 0x745f, // 29791 0b111010001011111
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
      code: 0x7480, // 29824 0b111010010000000
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
      code: 0x7481, // 29825 0b111010010000001
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
      code: 0x7482, // 29826 0b111010010000010
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
      code: 0x748a, // 29834 0b111010010001010
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
      code: 0x748b, // 29835 0b111010010001011
      label: 'Audio Clicky On',
      name: {
        long: 'QK_AUDIO_CLICKY_ON',
        short: 'CK_ON',
      },
      keywords: ['Audio Clicky On'],
    },
  },
  {
    desc: 'Turns off Audio clicky mode',
    keycodeInfo: {
      code: 0x748c, // 29836 0b111010010001100
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
      code: 0x748d, // 29837 0b111010010001101
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
      code: 0x748e, // 29838 0b111010010001110
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
      code: 0x748f, // 29839 0b111010010001111
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
      code: 0x7490, // 29840 0b111010010010000
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
      code: 0x7491, // 29841 0b111010010010001
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
      code: 0x7492, // 29842 0b111010010010010
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
      code: 0x7493, // 29843 0b111010010010011
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
      code: 0x7494, // 29844 0b111010010010100
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
      code: 0x7495, // 29845 0b111010010010101
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
      code: 0x74f0, // 29936 0b111010011110000
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
      code: 0x74f1, // 29937 0b111010011110001
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
      code: 0x74f2, // 29938 0b111010011110010
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
      code: 0x74fc, // 29948 0b111010011111100
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
      code: 0x7700, // 30464 0b111011100000000
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
      code: 0x7701, // 30465 0b111011100000001
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
      code: 0x7702, // 30466 0b111011100000010
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
      code: 0x7703, // 30467 0b111011100000011
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
      code: 0x7704, // 30468 0b111011100000100
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
      code: 0x7705, // 30469 0b111011100000101
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
      code: 0x7706, // 30470 0b111011100000110
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
      code: 0x7707, // 30471 0b111011100000111
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
      code: 0x7708, // 30472 0b111011100001000
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
      code: 0x7709, // 30473 0b111011100001001
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
      code: 0x770a, // 30474 0b111011100001010
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
      code: 0x770b, // 30475 0b111011100001011
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
      code: 0x770c, // 30476 0b111011100001100
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
      code: 0x770d, // 30477 0b111011100001101
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
      code: 0x770e, // 30478 0b111011100001110
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
      code: 0x770f, // 30479 0b111011100001111
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
      code: 0x7710, // 30480 0b111011100010000
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
      code: 0x7711, // 30481 0b111011100010001
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
      code: 0x7712, // 30482 0b111011100010010
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
      code: 0x7713, // 30483 0b111011100010011
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
      code: 0x7714, // 30484 0b111011100010100
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
      code: 0x7715, // 30485 0b111011100010101
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
      code: 0x7716, // 30486 0b111011100010110
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
      code: 0x7717, // 30487 0b111011100010111
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
      code: 0x7718, // 30488 0b111011100011000
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
      code: 0x7719, // 30489 0b111011100011001
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
      code: 0x771a, // 30490 0b111011100011010
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
      code: 0x771b, // 30491 0b111011100011011
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
      code: 0x771c, // 30492 0b111011100011100
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
      code: 0x771d, // 30493 0b111011100011101
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
      code: 0x771e, // 30494 0b111011100011110
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
      code: 0x771f, // 30495 0b111011100011111
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
      code: 0x7800, // 30720 0b111100000000000
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
      code: 0x7801, // 30721 0b111100000000001
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
      code: 0x7802, // 30722 0b111100000000010
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
      code: 0x7803, // 30723 0b111100000000011
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
      code: 0x7804, // 30724 0b111100000000100
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
      code: 0x7805, // 30725 0b111100000000101
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
      code: 0x7806, // 30726 0b111100000000110
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
      code: 0x7820, // 30752 0b111100000100000
      label: 'RGB Toggle',
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
      code: 0x7821, // 30753 0b111100000100001
      label: 'RGB Mode +',
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
      code: 0x7822, // 30754 0b111100000100010
      label: 'RGB Mode -',
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
      code: 0x7823, // 30755 0b111100000100011
      label: 'RGB HUE +',
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
      code: 0x7824, // 30756 0b111100000100100
      label: 'RGB HUE -',
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
      code: 0x7825, // 30757 0b111100000100101
      label: 'RGB SAT +',
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
      code: 0x7826, // 30758 0b111100000100110
      label: 'RGB SAT -',
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
      code: 0x7827, // 30759 0b111100000100111
      label: 'RGB Bright +',
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
      code: 0x7828, // 30760 0b111100000101000
      label: 'RGB Bright -',
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
      code: 0x7829, // 30761 0b111100000101001
      label: 'RGB Effect Speed +',
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
      code: 0x782a, // 30762 0b111100000101010
      label: 'RGB Effect Speed -',
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
      code: 0x782b, // 30763 0b111100000101011
      label: 'RGB Mode Plain',
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
      code: 0x782c, // 30764 0b111100000101100
      label: 'RGB Mode Breathe',
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
      code: 0x782d, // 30765 0b111100000101101
      label: 'RGB Mode Rainbow',
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
      code: 0x782e, // 30766 0b111100000101110
      label: 'RGB Mode Swirl',
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
      code: 0x782f, // 30767 0b111100000101111
      label: 'RGB Mode Snake',
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
      code: 0x7830, // 30768 0b111100000110000
      label: 'RGB Mode Knight',
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
      code: 0x7831, // 30769 0b111100000110001
      label: 'RGB Mode Xmas',
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
      code: 0x7832, // 30770 0b111100000110010
      label: 'RGB Mode Gradient',
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
      code: 0x7833, // 30771 0b111100000110011
      label: 'RGB Mode RGB Test',
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
      code: 0x7834, // 30772 0b111100000110100
      label: 'RGB Mode Twinkle',
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
      code: 0x7c00, // 31744 0b111110000000000
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
      code: 0x7c01, // 31745 0b111110000000001
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
      code: 0x7c02, // 31746 0b111110000000010
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
      code: 0x7c03, // 31747 0b111110000000011
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
      code: 0x7c04, // 31748 0b111110000000100
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
      code: 0x7c10, // 31760 0b111110000010000
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
      code: 0x7c11, // 31761 0b111110000010001
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
      code: 0x7c12, // 31762 0b111110000010010
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
      code: 0x7c13, // 31763 0b111110000010011
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
      code: 0x7c14, // 31764 0b111110000010100
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
      code: 0x7c15, // 31765 0b111110000010101
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
      code: 0x7c16, // 31766 0b111110000010110
      label: 'ESC `',
      name: {
        long: 'QK_GRAVE_ESCAPE',
        short: 'QK_GESC',
      },
      keywords: ['Grave Escape', '`'],
    },
  },
  {
    desc: 'Velocikey Toggle',
    keycodeInfo: {
      code: 0x7c17, // 31767 0b111110000010111
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
      code: 0x7c18, // 31768 0b111110000011000
      label: '*Ctrl (',
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
      code: 0x7c19, // 31769 0b111110000011001
      label: 'Ctrl* )',
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
      code: 0x7c1a, // 31770 0b111110000011010
      label: '*Shift (',
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
      code: 0x7c1b, // 31771 0b111110000011011
      label: 'Shift* )',
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
      code: 0x7c1c, // 31772 0b111110000011100
      label: '*Alt (',
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
      code: 0x7c1d, // 31773 0b111110000011101
      label: 'Alt* )',
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
      code: 0x7c1e, // 31774 0b111110000011110
      label: 'Shift* Enter',
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
      code: 0x7c20, // 31776 0b111110000100000
      label: 'Bluetooth Output Auto',
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
      code: 0x7c21, // 31777 0b111110000100001
      label: 'Bluetooth Output Usb',
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
      code: 0x7c22, // 31778 0b111110000100010
      label: 'Bluetooth Output Bluetooth',
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
      code: 0x7c30, // 31792 0b111110000110000
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
      code: 0x7c31, // 31793 0b111110000110001
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
      code: 0x7c32, // 31794 0b111110000110010
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
      code: 0x7c33, // 31795 0b111110000110011
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
      code: 0x7c34, // 31796 0b111110000110100
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
      code: 0x7c35, // 31797 0b111110000110101
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
      code: 0x7c36, // 31798 0b111110000110110
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
      code: 0x7c37, // 31799 0b111110000110111
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
      code: 0x7c40, // 31808 0b111110001000000
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
      code: 0x7c41, // 31809 0b111110001000001
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
      code: 0x7c42, // 31810 0b111110001000010
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
      code: 0x7c43, // 31811 0b111110001000011
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
      code: 0x7c44, // 31812 0b111110001000100
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
      code: 0x7c45, // 31813 0b111110001000101
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
      code: 0x7c46, // 31814 0b111110001000110
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
      code: 0x7c47, // 31815 0b111110001000111
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
      code: 0x7c48, // 31816 0b111110001001000
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
      code: 0x7c49, // 31817 0b111110001001001
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
      code: 0x7c4a, // 31818 0b111110001001010
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
      code: 0x7c4b, // 31819 0b111110001001011
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
      code: 0x7c4c, // 31820 0b111110001001100
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
      code: 0x7c50, // 31824 0b111110001010000
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
      code: 0x7c51, // 31825 0b111110001010001
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
      code: 0x7c52, // 31826 0b111110001010010
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
      code: 0x7c53, // 31827 0b111110001010011
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
      code: 0x7c54, // 31828 0b111110001010100
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
      code: 0x7c55, // 31829 0b111110001010101
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
      code: 0x7c56, // 31830 0b111110001010110
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
      code: 0x7c57, // 31831 0b111110001010111
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
      code: 0x7c58, // 31832 0b111110001011000
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
      code: 0x7c59, // 31833 0b111110001011001
      label: 'Key Lock',
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
      code: 0x7c5a, // 31834 0b111110001011010
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
      code: 0x7c5b, // 31835 0b111110001011011
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
      code: 0x7c5c, // 31836 0b111110001011100
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
      code: 0x7c5d, // 31837 0b111110001011101
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
      code: 0x7c5e, // 31838 0b111110001011110
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
      code: 0x7c5f, // 31839 0b111110001011111
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
      code: 0x7c60, // 31840 0b111110001100000
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
      code: 0x7c61, // 31841 0b111110001100001
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
      code: 0x7c62, // 31842 0b111110001100010
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
      code: 0x7c63, // 31843 0b111110001100011
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
      code: 0x7c70, // 31856 0b111110001110000
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
      code: 0x7c71, // 31857 0b111110001110001
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
      code: 0x7c72, // 31858 0b111110001110010
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
      code: 0x7c73, // 31859 0b111110001110011
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
      code: 0x7c74, // 31860 0b111110001110100
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
      code: 0x7c75, // 31861 0b111110001110101
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
      code: 0x7c76, // 31862 0b111110001110110
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
      code: 0x7c77, // 31863 0b111110001110111
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
      code: 0x7c78, // 31864 0b111110001111000
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
      code: 0x7c79, // 31865 0b111110001111001
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
      code: 0x7c7a, // 31866 0b111110001111010
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
      code: 0x7e00, // 32256 0b111111000000000
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
      code: 0x7e01, // 32257 0b111111000000001
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
      code: 0x7e02, // 32258 0b111111000000010
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
      code: 0x7e03, // 32259 0b111111000000011
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
      code: 0x7e04, // 32260 0b111111000000100
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
      code: 0x7e05, // 32261 0b111111000000101
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
      code: 0x7e06, // 32262 0b111111000000110
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
      code: 0x7e07, // 32263 0b111111000000111
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
      code: 0x7e08, // 32264 0b111111000001000
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
      code: 0x7e09, // 32265 0b111111000001001
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
      code: 0x7e0a, // 32266 0b111111000001010
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
      code: 0x7e0b, // 32267 0b111111000001011
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
      code: 0x7e0c, // 32268 0b111111000001100
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
      code: 0x7e0d, // 32269 0b111111000001101
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
      code: 0x7e0e, // 32270 0b111111000001110
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
      code: 0x7e0f, // 32271 0b111111000001111
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
      code: 0x7e10, // 32272 0b111111000010000
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
      code: 0x7e11, // 32273 0b111111000010001
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
      code: 0x7e12, // 32274 0b111111000010010
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
      code: 0x7e13, // 32275 0b111111000010011
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
      code: 0x7e14, // 32276 0b111111000010100
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
      code: 0x7e15, // 32277 0b111111000010101
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
      code: 0x7e16, // 32278 0b111111000010110
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
      code: 0x7e17, // 32279 0b111111000010111
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
      code: 0x7e18, // 32280 0b111111000011000
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
      code: 0x7e19, // 32281 0b111111000011001
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
      code: 0x7e1a, // 32282 0b111111000011010
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
      code: 0x7e1b, // 32283 0b111111000011011
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
      code: 0x7e1c, // 32284 0b111111000011100
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
      code: 0x7e1d, // 32285 0b111111000011101
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
      code: 0x7e1e, // 32286 0b111111000011110
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
      code: 0x7e1f, // 32287 0b111111000011111
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
      code: 0x7e40, // 32320 0b111111001000000
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
      code: 0x7e41, // 32321 0b111111001000001
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
      code: 0x7e42, // 32322 0b111111001000010
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
      code: 0x7e43, // 32323 0b111111001000011
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
      code: 0x7e44, // 32324 0b111111001000100
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
      code: 0x7e45, // 32325 0b111111001000101
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
      code: 0x7e46, // 32326 0b111111001000110
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
      code: 0x7e47, // 32327 0b111111001000111
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
      code: 0x7e48, // 32328 0b111111001001000
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
      code: 0x7e49, // 32329 0b111111001001001
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
      code: 0x7e4a, // 32330 0b111111001001010
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
      code: 0x7e4b, // 32331 0b111111001001011
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
      code: 0x7e4c, // 32332 0b111111001001100
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
      code: 0x7e4d, // 32333 0b111111001001101
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
      code: 0x7e4e, // 32334 0b111111001001110
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
      code: 0x7e4f, // 32335 0b111111001001111
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
      code: 0x7e50, // 32336 0b111111001010000
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
      code: 0x7e51, // 32337 0b111111001010001
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
      code: 0x7e52, // 32338 0b111111001010010
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
      code: 0x7e53, // 32339 0b111111001010011
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
      code: 0x7e54, // 32340 0b111111001010100
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
      code: 0x7e55, // 32341 0b111111001010101
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
      code: 0x7e56, // 32342 0b111111001010110
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
      code: 0x7e57, // 32343 0b111111001010111
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
      code: 0x7e58, // 32344 0b111111001011000
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
      code: 0x7e59, // 32345 0b111111001011001
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
      code: 0x7e5a, // 32346 0b111111001011010
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
      code: 0x7e5b, // 32347 0b111111001011011
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
      code: 0x7e5c, // 32348 0b111111001011100
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
      code: 0x7e5d, // 32349 0b111111001011101
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
      code: 0x7e5e, // 32350 0b111111001011110
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
      code: 0x7e5f, // 32351 0b111111001011111
      label: 'User 31',
      name: {
        long: 'QK_USER_31',
        short: 'QK_USER_31',
      },
      keywords: ['User 31'],
    },
  },
];
