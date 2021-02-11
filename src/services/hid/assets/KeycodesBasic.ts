import { IKeycodeCategoryInfo } from '../Hid';

export const keycodesBasic: IKeycodeCategoryInfo = {
  kinds: ['basic'],
  codes: [0, 1],
};

export const keycodesBasicF: IKeycodeCategoryInfo = {
  kinds: ['basic', 'f'],
  codes: [
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    104,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
  ],
};

export const keycodesBasicFunc: IKeycodeCategoryInfo = {
  kinds: ['basic', 'func'],
  codes: [
    192,
    193,
    194,
    195,
    196,
    197,
    198,
    199,
    200,
    201,
    202,
    203,
    204,
    205,
    206,
    207,
    208,
    209,
    210,
    211,
    212,
    213,
    214,
    215,
    216,
    217,
    218,
    219,
    220,
    221,
    222,
    223,
  ],
};

export const keycodesBasicLetter: IKeycodeCategoryInfo = {
  kinds: ['basic', 'letter'],
  codes: [
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
  ],
};

export const keycodesBasicCommand: IKeycodeCategoryInfo = {
  kinds: ['basic', 'command'],
  codes: [
    57,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    101,
    102,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,
    125,
    126,
    130,
    131,
    132,
    153,
    154,
    155,
    156,
    157,
    158,
    159,
    160,
    161,
    162,
    163,
    164,
    165,
    166,
    167,
  ],
};

export const keycodesBasicModifier: IKeycodeCategoryInfo = {
  kinds: ['basic', 'mods'],
  codes: [224, 225, 226, 227, 228, 229, 230, 231],
};

export const keycodesBasicNumber: IKeycodeCategoryInfo = {
  kinds: ['basic', 'number'],
  codes: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
};

export const keycodesBasicNumpad: IKeycodeCategoryInfo = {
  kinds: ['basic', 'numpad'],
  codes: [
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    87,
    86,
    85,
    84,
    103,
    133,
    134,
    99,
    88,
  ],
};

export const keycodesBasicPunctuation: IKeycodeCategoryInfo = {
  kinds: ['basic', 'punctuation'],
  codes: [45, 46, 53, 47, 48, 49, 50, 51, 52, 54, 55, 56, 100],
};

export const keycodesBasicSpacing: IKeycodeCategoryInfo = {
  kinds: ['basic', 'spacing'],
  codes: [40, 41, 42, 43, 44],
};

export const keycodesBasicMedia: IKeycodeCategoryInfo = {
  kinds: ['basic', 'media'],
  codes: [168, 169, 170, 171, 172, 173, 174, 175, 176, 127, 128, 129, 187, 188],
};

export const keycodesBasicMouse: IKeycodeCategoryInfo = {
  kinds: ['basic', 'mouse'],
  codes: [
    240,
    241,
    242,
    243,
    244,
    245,
    246,
    247,
    248,
    249,
    250,
    251,
    252,
    253,
    254,
    255,
  ],
};

export const keycodesBasicApp: IKeycodeCategoryInfo = {
  kinds: ['basic', 'app'],
  codes: [177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 189, 190],
};

export const keycodesBasicInt: IKeycodeCategoryInfo = {
  kinds: ['basic', 'int'],
  codes: [135, 136, 137, 138, 139, 140, 141, 142, 143],
};

export const keycodesBasicLang: IKeycodeCategoryInfo = {
  kinds: ['basic', 'lang'],
  codes: [144, 145, 146, 147, 148, 149, 150, 151, 152],
};

export const keycodesBasicUsSymbol: IKeycodeCategoryInfo = {
  kinds: ['basic', 'us-symbol'],
  codes: [
    565,
    542,
    543,
    544,
    545,
    546,
    547,
    548,
    549,
    557,
    558,
    559,
    560,
    566,
    567,
    563,
    561,
    568,
    564,
  ],
};
// DEPRECATED
export const keycodesBasicAll: IKeycodeCategoryInfo = {
  kinds: ['basic'],
  codes: [
    ...keycodesBasic.codes,
    ...keycodesBasicF.codes,
    ...keycodesBasicLetter.codes,
    ...keycodesBasicCommand.codes,
    ...keycodesBasicModifier.codes,
    ...keycodesBasicNumber.codes,
    ...keycodesBasicPunctuation.codes,
  ],
};
