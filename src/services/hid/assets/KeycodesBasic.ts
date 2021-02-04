import { IKeycodeCategoryInfo } from '../Hid';

export const keycodesBasic: IKeycodeCategoryInfo = {
  categories: ['Basic'],
  codes: [1, 2, 3],
};

export const keycodesBasicF: IKeycodeCategoryInfo = {
  categories: ['Basic', 'F'],
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
  categories: ['Basic', 'Func'],
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
  categories: ['Basic', 'Letter'],
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

export const keycodesBasicLock: IKeycodeCategoryInfo = {
  categories: ['Basic', 'Lock'],
  codes: [57, 71, 83, 130, 131, 132],
};

export const keycodesBasicModifier: IKeycodeCategoryInfo = {
  categories: ['Basic', 'Modifier'],
  codes: [224, 225, 226, 227, 228, 229, 230, 231],
};

export const keycodesBasicNumber: IKeycodeCategoryInfo = {
  categories: ['Basic', 'Number'],
  codes: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
};

export const keycodesBasicPunctuation: IKeycodeCategoryInfo = {
  categories: ['Basic', 'Punctuation'],
  codes: [40, 41, 42, 43, 44, 45, 46, 53, 47, 48, 49, 51, 52, 54, 55, 56, 100],
};

export const keycodesBasicSpacing: IKeycodeCategoryInfo = {
  categories: ['Basic', 'Spacing'],
  codes: [40, 41, 42, 43, 44],
};
// DEPRECATED
export const keycodesBasicAll: IKeycodeCategoryInfo = {
  categories: ['Basic'],
  codes: [
    ...keycodesBasic.codes,
    ...keycodesBasicF.codes,
    ...keycodesBasicLetter.codes,
    ...keycodesBasicLock.codes,
    ...keycodesBasicModifier.codes,
    ...keycodesBasicNumber.codes,
    ...keycodesBasicPunctuation.codes,
  ],
};
