import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';
import {
  AsciiComposition,
  BasicComposition,
  DefLayerComposition,
  LayerTapToggleComposition,
  LooseKeycodeComposition,
  MomentaryComposition,
  OneShotLayerComposition,
  SwapHandsComposition,
  ToComposition,
  ToggleLayerComposition,
} from './Composition';
import { IKeycodeCategoryInfo, IKeymap } from './Hid';
import { range } from '../../utils/ArrayUtils';
import { encodeMacroText, IMacroBuffer } from '../macro/Macro';

export class KeyCategory {
  private static _basic: { [pos: string]: IKeymap[] } = {};
  private static _symbol: { [pos: string]: IKeymap[] } = {};
  private static _functions: { [pos: string]: IKeymap[] } = {};
  private static _layer: { [layerCount: number]: IKeymap[] } = {};
  private static _special: { [pos: string]: IKeymap[] } = {};
  private static _device: { [pos: string]: IKeymap[] } = {};
  private static _midi: IKeymap[];
  private static _bmp: IKeymap[];

  static ascii(): IKeymap[] {
    // No need to be cached here because AsciiComposition has the cache.
    const keymaps: IKeymap[] = AsciiComposition.genKeymaps();
    return keymaps;
  }

  static basic(labelLang: KeyboardLabelLang): IKeymap[] {
    if (Object.prototype.hasOwnProperty.call(KeyCategory._basic, labelLang)) {
      return KeyCategory._basic[labelLang];
    }

    const codes: number[] = [
      ...KEY_SUB_CATEGORY_LETTER.codes,
      ...KEY_SUB_CATEGORY_NUMBER.codes,
      ...KEY_SUB_CATEGORY_MODIFIER.codes,
      ...KEY_SUB_CATEGORY_EDIT.codes,
      ...KEY_SUB_CATEGORY_MOVE.codes,
      ...KEY_SUB_CATEGORY_NUMPAD.codes,
    ];
    const keymaps: IKeymap[] = codes.map(
      (code) => BasicComposition.findKeymap(code, labelLang)!
    );
    KeyCategory._basic[labelLang] = keymaps;
    return keymaps;
  }

  static symbol(labelLang: KeyboardLabelLang): IKeymap[] {
    if (Object.prototype.hasOwnProperty.call(KeyCategory._symbol, labelLang)) {
      return KeyCategory._symbol[labelLang];
    }
    const basicCodes: number[] = [
      ...KEY_SUB_CATEGORY_BLANK.codes,
      ...KEY_SUB_CATEGORY_PUNCTUATION.codes,
    ];
    const looseCodes: number[] = [
      ...KEY_SUB_CATEGORY_SPACE_CADET.codes,
      ...KEY_SUB_CATEGORY_GRAVE_ESCAPE.codes,
    ];

    const basicKeymaps: IKeymap[] = basicCodes.map(
      (code) => BasicComposition.findKeymap(code, labelLang)!
    );
    const looseKeymaps: IKeymap[] = looseCodes.map(
      (code) => LooseKeycodeComposition.findKeymap(code)!
    );
    KeyCategory._symbol[labelLang] = [...basicKeymaps, ...looseKeymaps];
    return KeyCategory._symbol[labelLang];
  }

  static functions(labelLang: KeyboardLabelLang): IKeymap[] {
    if (
      Object.prototype.hasOwnProperty.call(KeyCategory._functions, labelLang)
    ) {
      return KeyCategory._functions[labelLang];
    }

    const basicCodes: number[] = [
      ...KEY_SUB_CATEGORY_F.codes,
      ...KEY_SUB_CATEGORY_INTERNATIONAL.codes,
      ...KEY_SUB_CATEGORY_LANGUAGE.codes,
      ...KEY_SUB_CATEGORY_LOCK.codes,
    ];
    const looseCodes: number[] = [...KEY_SUB_CATEGORY_COMBO.codes];
    const basicKeymaps: IKeymap[] = basicCodes.map(
      (code) => BasicComposition.findKeymap(code, labelLang)!
    );
    const looseKeymaps: IKeymap[] = looseCodes.map(
      (code) => LooseKeycodeComposition.findKeymap(code)!
    );
    KeyCategory._functions[labelLang] = [...basicKeymaps, ...looseKeymaps];
    return KeyCategory._functions[labelLang];
  }

  static layer(layerCount: number): IKeymap[] {
    if (Object.prototype.hasOwnProperty.call(KeyCategory._layer, layerCount))
      return KeyCategory._layer[layerCount];

    const keymaps: IKeymap[] = [
      ...ToComposition.genKeymaps(layerCount),
      ...ToggleLayerComposition.genKeymaps(layerCount),
      ...LayerTapToggleComposition.genKeymaps(layerCount),
      ...MomentaryComposition.genKeymaps(layerCount),
      ...OneShotLayerComposition.genKeymaps(layerCount),
      ...DefLayerComposition.genKeymaps(layerCount),
    ];
    KeyCategory._layer[layerCount] = keymaps;

    return keymaps;
  }

  static special(labelLang: KeyboardLabelLang): IKeymap[] {
    if (Object.prototype.hasOwnProperty.call(KeyCategory._special, labelLang)) {
      return KeyCategory._special[labelLang];
    }

    const basicCodes: number[] = [
      ...KEY_SUB_CATEGORY_GUI.codes,
      ...KEY_SUB_CATEGORY_COMMAND.codes,
      ...KEY_SUB_CATEGORY_MEDIA.codes,
      ...KEY_SUB_CATEGORY_APPLICATION.codes,
      ...KEY_SUB_CATEGORY_EMBED_FUNCTION.codes,
    ];
    const basicKeymaps: IKeymap[] = basicCodes.map(
      (code) => BasicComposition.findKeymap(code, labelLang)!
    );
    const shKeymaps: IKeymap[] = SwapHandsComposition.genSwapHandsOptionKeymaps();
    KeyCategory._special[labelLang] = [...basicKeymaps, ...shKeymaps];
    return KeyCategory._special[labelLang];
  }

  static device(labelLang: KeyboardLabelLang): IKeymap[] {
    if (Object.prototype.hasOwnProperty.call(KeyCategory._device, labelLang)) {
      return KeyCategory._device[labelLang];
    }

    const basicCodes: number[] = [
      ...KEY_SUB_CATEGORY_DEVICE.codes,
      ...KEY_SUB_CATEGORY_MOUSE.codes,
    ];

    const looseCodes: number[] = [
      ...KEY_SUB_CATEGORY_KEYBOARD.codes,
      ...KEY_SUB_CATEGORY_BOOTMAGIC.codes,
      ...KEY_SUB_CATEGORY_SOUND.codes,
      ...KEY_SUB_CATEGORY_BACKLIGHT.codes,
      ...KEY_SUB_CATEGORY_UNDERGLOW.codes,
    ];

    const basicKeymaps: IKeymap[] = basicCodes.map(
      (code) => BasicComposition.findKeymap(code, labelLang)!
    );
    const looseKeymaps: IKeymap[] = looseCodes.map(
      (code) => LooseKeycodeComposition.findKeymap(code)!
    );
    KeyCategory._device[labelLang] = [...basicKeymaps, ...looseKeymaps];
    return KeyCategory._device[labelLang];
  }

  static bmp(): IKeymap[] {
    if (KeyCategory._bmp) {
      return KeyCategory._bmp;
    }

    const looseKeymaps: IKeymap[] = LooseKeycodeComposition.genExtendsBmpKeymaps();
    KeyCategory._bmp = looseKeymaps;
    return KeyCategory._bmp;
  }

  static midi(): IKeymap[] {
    if (KeyCategory._midi) return KeyCategory._midi;

    KeyCategory._midi = KEY_SUB_CATEGORY_MIDI.codes.map(
      (code) => LooseKeycodeComposition.findKeymap(code)!
    );
    return KeyCategory._midi;
  }

  static macro(
    maxMacroCount: number,
    macroBuffer: IMacroBuffer | null,
    labelLang: KeyboardLabelLang
  ): IKeymap[] {
    if (KEY_SUB_CATEGORY_MACRO.codes.length < maxMacroCount) {
      throw new Error(`Invalid max macro count: ${maxMacroCount}`);
    }

    const macroKeymaps = KEY_SUB_CATEGORY_MACRO.codes
      .map((code) => LooseKeycodeComposition.findKeymap(code)!)
      .slice(0, maxMacroCount);

    if (macroBuffer) {
      const macros = macroBuffer.generateMacros();
      for (let i = 0; i < macros.length; i++) {
        const macro = macros[i];
        const macroKeysResult = macro.generateMacroKeys(labelLang);
        if (!macroKeysResult.success) {
          console.error(macroKeysResult.error!);
          continue;
        }
        const desc = encodeMacroText(macroKeysResult.macroKeys);
        macroKeymaps[i] = { ...macroKeymaps[i], desc };
      }
    }
    // set desc text
    return macroKeymaps;
  }
}

// NO, TRANS
export const KEY_SUB_CATEGORY_BLANK: IKeycodeCategoryInfo = {
  kinds: ['symbol'],
  codes: [0, 1],
};
// A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
export const KEY_SUB_CATEGORY_LETTER: IKeycodeCategoryInfo = {
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
// 1 2 3 4 5 6 7 8 9 0
export const KEY_SUB_CATEGORY_NUMBER: IKeycodeCategoryInfo = {
  kinds: ['basic', 'number'],
  codes: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
};
// Left Ctrl, Left Shift, Left Alt, Left Win, Right Ctrl, Right Shift, Right Alt, Right Win
export const KEY_SUB_CATEGORY_MODIFIER: IKeycodeCategoryInfo = {
  kinds: ['basic', 'mods'],
  codes: [224, 225, 226, 227, 228, 229, 230, 231],
};
// Enter, Esc, Backspace, Tab, Space, Del, Insert, Undo, Cut, Copy, Paste
export const KEY_SUB_CATEGORY_EDIT: IKeycodeCategoryInfo = {
  kinds: ['basic', 'edit'],
  codes: [40, 41, 42, 43, 44, 76, 73, 122, 123, 124, 125],
};
// Home, Page Up, End, Page Down, Right, Left, Down, Up
export const KEY_SUB_CATEGORY_MOVE: IKeycodeCategoryInfo = {
  kinds: ['basic', 'move'],
  codes: [74, 75, 77, 78, 79, 80, 81, 82],
};
// F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23, F24
export const KEY_SUB_CATEGORY_F: IKeycodeCategoryInfo = {
  kinds: ['function', 'f'],
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
// Ro, かな, ¥, 変換, 無変換, International 7, International 8, International 9
export const KEY_SUB_CATEGORY_INTERNATIONAL: IKeycodeCategoryInfo = {
  kinds: ['function', 'int'],
  codes: [135, 136, 137, 138, 139, 141, 142, 143],
};
// Ha/En, 한자, JIS Katakana, JIS Hiragana, JIS Zenkaku/Hankaku, Language 6, Language 7, Language 8, Language 9
export const KEY_SUB_CATEGORY_LANGUAGE: IKeycodeCategoryInfo = {
  kinds: ['function', 'lang'],
  codes: [144, 145, 146, 147, 148, 149, 150, 151, 152],
};
// Caps Lock, Scroll Lock, Num Lock, Locking Caps Lock, Locking Num Lock, Locking Scroll Lock
export const KEY_SUB_CATEGORY_LOCK: IKeycodeCategoryInfo = {
  kinds: ['function', 'lock'],
  codes: [57, 71, 83, 130, 131, 132],
};
// - = ` [ ] | \ NUHS ; ' , . / NUBS
export const KEY_SUB_CATEGORY_PUNCTUATION: IKeycodeCategoryInfo = {
  kinds: ['symbol', 'punctuation'],
  codes: [45, 46, 53, 47, 48, 49, 50, 51, 52, 54, 55, 56, 100],
};
// Num 1, Num 2, Num 3, Num 4, Num 5, Num 6, Num 7, Num 8, Num 9, Num 0, Num +, Num -, Num *, Num /, Num =, Num ,, Num = AS400, Num ., Num Enter, JIS Numpad ,
export const KEY_SUB_CATEGORY_NUMPAD: IKeycodeCategoryInfo = {
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
    140,
  ],
};
// LS (, RS ), SftEnt, LC (, RC ), LA (, RA )
export const KEY_SUB_CATEGORY_SPACE_CADET: IKeycodeCategoryInfo = {
  kinds: ['symbol', 'cadet'],
  codes: [23767, 23768, 23769, 23795, 23796, 23797, 23798],
};
// ESC `
export const KEY_SUB_CATEGORY_GRAVE_ESCAPE: IKeycodeCategoryInfo = {
  kinds: ['symbol', 'grave_escape'],
  codes: [23574],
};
// App, Menu
export const KEY_SUB_CATEGORY_GUI: IKeycodeCategoryInfo = {
  kinds: ['special', 'gui'],
  codes: [101, 118],
};
// Print Screen, Pause, Execute, Help, Select, Stop, Again, Find, Alt Erase, SysReq, Cancel, Clear, Prior, Return, Separator, Out, Oper, Clear/Again, CrSel/Props, ExSel
export const KEY_SUB_CATEGORY_COMMAND: IKeycodeCategoryInfo = {
  kinds: ['special', 'command'],
  codes: [
    70,
    72,
    116,
    117,
    119,
    120,
    121,
    126,
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
  ],
};
// Func0, Func1, Func2, Func3, Func4, Func5, Func6, Func7, Func8, Func9, Func10, Func11, Func12, Func13, Func14, Func15, Func16, Func17, Func18, Func19, Func20, Func21, Func22, Func23, Func24, Func25, Func26, Func27, Func28, Func29, Func30, Func31
export const KEY_SUB_CATEGORY_EMBED_FUNCTION: IKeycodeCategoryInfo = {
  kinds: ['special', 'func'],
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
// Audio Mute, Audio Vol+, Audio Vol-, Next, Previous, Media Stop, Play, Select, Eject, Mute, Vol+, Vol-, Fast Forward, Rewind
export const KEY_SUB_CATEGORY_MEDIA: IKeycodeCategoryInfo = {
  kinds: ['special', 'media'],
  codes: [168, 169, 170, 171, 172, 173, 174, 175, 176, 127, 128, 129, 187, 188],
};
// Mail, Calculator, My Computer, WWW Search, WWW Home, WWW Back, WWW Forward, WWW Stop, WWW Refresh, WWW Favorite
export const KEY_SUB_CATEGORY_APPLICATION: IKeycodeCategoryInfo = {
  kinds: ['special', 'app'],
  codes: [177, 178, 179, 180, 181, 182, 183, 184, 185, 186],
};
// Power,  System Power Down, Sleep, Wake, Screen+, Screen-
export const KEY_SUB_CATEGORY_DEVICE: IKeycodeCategoryInfo = {
  kinds: ['device', 'device'],
  codes: [102, 165, 166, 167, 189, 190],
};
// Mouse↑, Mouse↓, Mouse←, Mouse→, Mouse Btn1, Mouse Btn2, Mouse Btn3, Mouse Btn4, Mouse Btn5, Mouse Wh↑, Mouse Wh↓, Mouse Wh←, Mouse Wh→, Mouse Acc0, Mouse Acc1, Mouse Acc2
export const KEY_SUB_CATEGORY_MOUSE: IKeycodeCategoryInfo = {
  kinds: ['device', 'mouse'],
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
// Reset, Debug
export const KEY_SUB_CATEGORY_KEYBOARD: IKeycodeCategoryInfo = {
  kinds: ['device', 'keyboard'],
  codes: [23552, 23553, 23774],
};
// CL SWAP, CL CTRL, LAG SWP, RAG SWP, GUI OFF, GE SWAP, BS SWAP, NK ON, AG SWAP, CL NORM, CL CAPS, LAG NRM, RAG NRM, GUI ON, GE NORM, BS NORM, NK OFF, AG NORM, NK TOGG, AG TOGG
export const KEY_SUB_CATEGORY_BOOTMAGIC: IKeycodeCategoryInfo = {
  kinds: ['device', 'bootmagic'],
  codes: [
    23554,
    23555,
    23556,
    23557,
    23558,
    23559,
    23560,
    23561,
    23562,
    23563,
    23564,
    23565,
    23566,
    23567,
    23568,
    23569,
    23570,
    23571,
    23572,
    23573,
    23802,
    23803,
    23804,
    23805,
    23806,
    23807,
    23808,
    23809,
    23810,
    23772,
    23773,
    23849,
  ],
};
// Audio On, Audio Off, Audio Toggle, Clicky Toggle, Clicky Enable, Clicky Disable, Clicky Up, Clicky Down, Clicky Reset, Music On, Music Off, Music Toggle, Music Mode
export const KEY_SUB_CATEGORY_SOUND: IKeycodeCategoryInfo = {
  kinds: ['device', 'sound'],
  codes: [
    23581,
    23582,
    23583,
    23584,
    23585,
    23586,
    23587,
    23588,
    23589,
    23590,
    23591,
    23592,
    23593,
  ],
};
// BL On, BL Off, BL-, BL+, BL Toggle, BL Cycle, BR Toggle
export const KEY_SUB_CATEGORY_BACKLIGHT: IKeycodeCategoryInfo = {
  kinds: ['device', 'backlight'],
  codes: [23739, 23740, 23741, 23742, 23743, 23744, 23745],
};
// RGB Toggle, RGB Mode+, RGB Mode-, Hue+, Hue-, Sat+, Sat-, Bright+, Bright-, Effect Speed+, Effect Speed-, RGB Mode P, RGB Mode R, RGB Mode SW, RGB Mode SN, RGB Mode K, RGB Mode X, RGB Mode G
export const KEY_SUB_CATEGORY_UNDERGLOW: IKeycodeCategoryInfo = {
  kinds: ['device', 'underglow'],
  codes: [
    23746,
    23747,
    23748,
    23749,
    23750,
    23751,
    23752,
    23753,
    23754,
    23755,
    23756,
    23757,
    23758,
    23759,
    23760,
    23761,
    23762,
    23763,
    23764,
    23765,
  ],
};
// Macro
export const KEY_SUB_CATEGORY_MACRO: IKeycodeCategoryInfo = {
  kinds: ['macro'],
  codes: [
    24338,
    24339,
    24340,
    24341,
    24342,
    24343,
    24344,
    24345,
    24346,
    24347,
    24348,
    24349,
    24350,
    24351,
    24352,
    24353,
  ],
};
// Combo
export const KEY_SUB_CATEGORY_COMBO: IKeycodeCategoryInfo = {
  kinds: ['function', 'combo'],
  codes: [23575, 23576, 23577, 23578, 23579, 23580, 23799, 23800, 23801],
};
// MIDI
export const KEY_SUB_CATEGORY_MIDI: IKeycodeCategoryInfo = {
  kinds: ['midi'],
  codes: range(23596, 23738),
};

// ASCII
export const KEY_CATEGORY_ASCII: IKeycodeCategoryInfo = {
  kinds: ['ascii'],
  codes: [
    33,
    34,
    35,
    36,
    37,
    38,
    40,
    41,
    42,
    43,
    60,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
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
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    94,
    95,
    123,
    124,
    125,
    126,
  ],
};
