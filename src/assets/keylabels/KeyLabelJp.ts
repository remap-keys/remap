import { KeyLabel } from './KeyLabel';

// define here because of avoiding the recursive reference
const MOD_RIGHT = 0b10000;
//const MOD_CTL = 0b0001;
const MOD_SFT = 0b0010;
//const MOD_ALT = 0b0100;
//const MOD_GUI = 0b1000;

export const KeyLabelJp: KeyLabel[] = [
  {
    code: 4,
    label: 'A',
  },
  {
    code: 5,
    label: 'B',
  },
  {
    code: 6,
    label: 'C',
  },
  {
    code: 7,
    label: 'D',
  },
  {
    code: 8,
    label: 'E',
  },
  {
    code: 9,
    label: 'F',
  },
  {
    code: 10,
    label: 'G',
  },
  {
    code: 11,
    label: 'H',
  },
  {
    code: 12,
    label: 'I',
  },
  {
    code: 13,
    label: 'J',
  },
  {
    code: 14,
    label: 'K',
  },
  {
    code: 15,
    label: 'L',
  },
  {
    code: 16,
    label: 'M',
  },
  {
    code: 17,
    label: 'N',
  },
  {
    code: 18,
    label: 'O',
  },
  {
    code: 19,
    label: 'P',
  },
  {
    code: 20,
    label: 'Q',
  },
  {
    code: 21,
    label: 'R',
  },
  {
    code: 22,
    label: 'S',
  },
  {
    code: 23,
    label: 'T',
  },
  {
    code: 24,
    label: 'U',
  },
  {
    code: 25,
    label: 'V',
  },
  {
    code: 26,
    label: 'W',
  },
  {
    code: 27,
    label: 'X',
  },
  {
    code: 28,
    label: 'Y',
  },
  {
    code: 29,
    label: 'Z',
  },
  {
    code: 30,
    label: '1',
    meta: [
      {
        label: '!',
        modifiers: MOD_SFT,
      },
      {
        label: '!',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 31,
    label: '2',
    meta: [
      {
        label: '"',
        modifiers: MOD_SFT,
      },
      {
        label: '"',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 32,
    label: '3',
    meta: [
      {
        label: '#',
        modifiers: MOD_SFT,
      },
      {
        label: '#',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 33,
    label: '4',
    meta: [
      {
        label: '$',
        modifiers: MOD_SFT,
      },
      {
        label: '$',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 34,
    label: '5',
    meta: [
      {
        label: '%',
        modifiers: MOD_SFT,
      },
      {
        label: '%',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 35,
    label: '6',
    meta: [
      {
        label: '&',
        modifiers: MOD_SFT,
      },
      {
        label: '&',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 36,
    label: '7',
    meta: [
      {
        label: "'",
        modifiers: MOD_SFT,
      },
      {
        label: "'",
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 37,
    label: '8',
    meta: [
      {
        label: '(',
        modifiers: MOD_SFT,
      },
      {
        label: '(',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 38,
    label: '9',
    meta: [
      {
        label: ')',
        modifiers: MOD_SFT,
      },
      {
        label: ')',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 39,
    label: '0',
  },
  {
    code: 45,
    label: '-',
    meta: [
      {
        label: '=',
        modifiers: MOD_SFT,
      },
      {
        label: '=',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 46,
    label: '^',
    meta: [
      {
        label: '~',
        modifiers: MOD_SFT,
      },
      {
        label: '~',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 47,
    label: '@',
    meta: [
      {
        label: '`',
        modifiers: MOD_SFT,
      },
      {
        label: '`',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 48,
    label: '[',
    meta: [
      {
        label: '{',
        modifiers: MOD_SFT,
      },
      {
        label: '{',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 49,
    label: ']',
    meta: [
      {
        label: '}',
        modifiers: MOD_SFT,
      },
      {
        label: '}',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 50,
    label: ']',
    meta: [
      {
        label: '}',
        modifiers: MOD_SFT,
      },
      {
        label: '}',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 51,
    label: ';',
    meta: [
      {
        label: '+',
        modifiers: MOD_SFT,
      },
      {
        label: '+',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 52,
    label: ':',
    meta: [
      {
        label: '*',
        modifiers: MOD_SFT,
      },
      {
        label: '*',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 53,
    label: '半角/全角',
  },
  {
    code: 54,
    label: ',',
    meta: [
      {
        label: '<',
        modifiers: MOD_SFT,
      },
      {
        label: '<',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 55,
    label: '.',
    meta: [
      {
        label: '>',
        modifiers: MOD_SFT,
      },
      {
        label: '>',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 56,
    label: '/',
    meta: [
      {
        label: '?',
        modifiers: MOD_SFT,
      },
      {
        label: '?',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 57,
    label: '英数',
    meta: [
      {
        label: 'Caps Lock',
        modifiers: MOD_SFT,
      },
      {
        label: 'Caps Lock',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 135,
    label: '¥',
    meta: [
      {
        label: '_',
        modifiers: MOD_SFT,
      },
      {
        label: '_',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 136,
    label: 'カタカナ ひらがな ローマ字',
  },
  {
    code: 137,
    label: '¥',
    meta: [
      {
        label: '|',
        modifiers: MOD_SFT,
      },
      {
        label: '|',
        modifiers: MOD_RIGHT | MOD_SFT,
      },
    ],
  },
  {
    code: 138,
    label: '変換',
  },
  {
    code: 139,
    label: '無変換',
  },
  {
    code: 144,
    label: 'かな',
  },
  {
    code: 145,
    label: '英数',
  },
  {
    code: 542,
    label: '!',
  },
  {
    code: 543,
    label: '"',
  },
  {
    code: 544,
    label: '#',
  },
  {
    code: 545,
    label: '$',
  },
  {
    code: 546,
    label: '%',
  },
  {
    code: 547,
    label: '&',
  },
  {
    code: 548,
    label: "'",
  },
  {
    code: 549,
    label: '(',
  },
  {
    code: 550,
    label: ')',
  },
  {
    code: 557,
    label: '=',
  },
  {
    code: 558,
    label: '~',
  },
  {
    code: 559,
    label: '`',
  },
  {
    code: 560,
    label: '{',
  },
  {
    code: 561,
    label: '}',
  },
  {
    code: 562,
    label: '}',
  },
  {
    code: 563,
    label: '+',
  },
  {
    code: 564,
    label: '*',
  },
  {
    code: 566,
    label: '<',
  },
  {
    code: 567,
    label: '>',
  },
  {
    code: 568,
    label: '?',
  },
  {
    code: 569,
    label: 'Caps Lock',
  },
  {
    code: 647,
    label: '_',
  },
  {
    code: 649,
    label: '|',
  },
  {
    code: 4638,
    label: '!',
  },
  {
    code: 4639,
    label: '"',
  },
  {
    code: 4640,
    label: '#',
  },
  {
    code: 4641,
    label: '$',
  },
  {
    code: 4642,
    label: '%',
  },
  {
    code: 4643,
    label: '&',
  },
  {
    code: 4644,
    label: "'",
  },
  {
    code: 4645,
    label: '(',
  },
  {
    code: 4646,
    label: ')',
  },
  {
    code: 4653,
    label: '=',
  },
  {
    code: 4654,
    label: '~',
  },
  {
    code: 4655,
    label: '`',
  },
  {
    code: 4656,
    label: '{',
  },
  {
    code: 4658,
    label: '}',
  },
  {
    code: 4659,
    label: '+',
  },
  {
    code: 4660,
    label: '*',
  },
  {
    code: 4662,
    label: '<',
  },
  {
    code: 4663,
    label: '>',
  },
  {
    code: 4664,
    label: '?',
  },
  {
    code: 4665,
    label: 'Caps Lock',
  },
  {
    code: 4743,
    label: '_',
  },
  {
    code: 4745,
    label: '|',
  },
];
