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
  ViaUserKeyComposition,
} from './Composition';
import { ICustomKeycode, IKeycodeCategoryInfo, IKeymap } from './Hid';
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

  static functions(
    labelLang: KeyboardLabelLang,
    customKeycodes: ICustomKeycode[] | undefined
  ): IKeymap[] {
    // It is necessary to build keymaps every time for custom keycodes.
    const functionsCodes: number[] = [
      ...KEY_SUB_CATEGORY_F.codes,
      ...KEY_SUB_CATEGORY_INTERNATIONAL.codes,
      ...KEY_SUB_CATEGORY_LANGUAGE.codes,
      ...KEY_SUB_CATEGORY_LOCK.codes,
    ];
    const comboCodes: number[] = [...KEY_SUB_CATEGORY_COMBO.codes];
    const viaUserCodes: number[] = [...KEY_SUB_CATEGORY_VIA_USER_KEY.codes];
    const functionsKeymaps: IKeymap[] = functionsCodes.map(
      (code) => BasicComposition.findKeymap(code, labelLang)!
    );
    const comboKeymaps: IKeymap[] = comboCodes.map(
      (code) => LooseKeycodeComposition.findKeymap(code)!
    );
    const viaUserKeymaps: IKeymap[] = viaUserCodes.map(
      (code) => ViaUserKeyComposition.findKeymap(code, customKeycodes)!
    );
    KeyCategory._functions[labelLang] = [
      ...functionsKeymaps,
      ...comboKeymaps,
      ...viaUserKeymaps,
    ];
    return KeyCategory._functions[labelLang];
  }

  static layer(layerCount: number): IKeymap[] {
    if (Object.prototype.hasOwnProperty.call(KeyCategory._layer, layerCount))
      return KeyCategory._layer[layerCount];

    const fnmoCodes: number[] = [...KEY_SUB_CATEGORY_TRI_LAYER.codes];
    const fnmoKeymaps: IKeymap[] = fnmoCodes.map(
      (code) => LooseKeycodeComposition.findKeymap(code)!
    );

    const keymaps: IKeymap[] = [
      ...ToComposition.genKeymaps(layerCount),
      ...ToggleLayerComposition.genKeymaps(layerCount),
      ...LayerTapToggleComposition.genKeymaps(layerCount),
      ...MomentaryComposition.genKeymaps(layerCount),
      ...OneShotLayerComposition.genKeymaps(layerCount),
      ...DefLayerComposition.genKeymaps(layerCount),
      ...fnmoKeymaps,
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
    ];
    const basicKeymaps: IKeymap[] = basicCodes.map(
      (code) => BasicComposition.findKeymap(code, labelLang)!
    );
    const shKeymaps: IKeymap[] =
      SwapHandsComposition.genSwapHandsOptionKeymaps();
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

    const looseKeymaps: IKeymap[] =
      LooseKeycodeComposition.genExtendsBmpKeymaps();
    KeyCategory._bmp = looseKeymaps;
    return KeyCategory._bmp;
  }

  static midi(): IKeymap[] {
    if (KeyCategory._midi) return KeyCategory._midi;

    const midiCodes: number[] = [
      ...KEY_SUB_CATEGORY_MIDI_NOTES.codes,
      ...KEY_SUB_CATEGORY_MIDI_OCTAVE.codes,
      ...KEY_SUB_CATEGORY_MIDI_TRANSPOSE.codes,
      ...KEY_SUB_CATEGORY_MIDI_VELOCITY.codes,
      ...KEY_SUB_CATEGORY_MIDI_CHANNEL.codes,
      ...KEY_SUB_CATEGORY_MIDI_MISC.codes,
    ];

    KeyCategory._midi = midiCodes.map(
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
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    24, 25, 26, 27, 28, 29,
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
    58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 104, 105, 106, 107, 108,
    109, 110, 111, 112, 113, 114, 115,
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
// Num 1, Num 2, Num 3, Num 4, Num 5, Num 6, Num 7, Num 8, Num 9, Num 0, Num +, Num -, Num *, Num /, Num =, Num ,, Num = AS400, Num ., Num Enter,
export const KEY_SUB_CATEGORY_NUMPAD: IKeycodeCategoryInfo = {
  kinds: ['basic', 'numpad'],
  codes: [
    89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 87, 86, 85, 84, 103, 133, 134, 99,
    88,
  ],
};
// LS (, RS ), SftEnt, LC (, RC ), LA (, RA )
export const KEY_SUB_CATEGORY_SPACE_CADET: IKeycodeCategoryInfo = {
  kinds: ['symbol', 'cadet'],
  codes: [31770, 31771, 31774, 31768, 31769, 31772, 31773],
};
// ESC `
export const KEY_SUB_CATEGORY_GRAVE_ESCAPE: IKeycodeCategoryInfo = {
  kinds: ['symbol', 'grave_escape'],
  codes: [31766],
};
// App, Menu, Assistant, Mission Control, Launchpad
export const KEY_SUB_CATEGORY_GUI: IKeycodeCategoryInfo = {
  kinds: ['special', 'gui'],
  codes: [101, 118, 192, 193, 194],
};
// Print Screen, Pause, Execute, Help, Select, Stop, Again, Find, Alt Erase, SysReq, Cancel, Clear, Prior, Return, Separator, Out, Oper, Clear/Again, CrSel/Props, ExSel
export const KEY_SUB_CATEGORY_COMMAND: IKeycodeCategoryInfo = {
  kinds: ['special', 'command'],
  codes: [
    70, 72, 116, 117, 119, 120, 121, 126, 153, 154, 155, 156, 157, 158, 159,
    160, 161, 162, 163, 164,
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
// Mouse↑, Mouse↓, Mouse←, Mouse→, Mouse Btn1, Mouse Btn2, Mouse Btn3, Mouse Btn4, Mouse Btn5, Mouse Btn6, Mouse Btn7, Mouse Btn8, Mouse Wh↑, Mouse Wh↓, Mouse Wh←, Mouse Wh→, Mouse Acc0, Mouse Acc1, Mouse Acc2
export const KEY_SUB_CATEGORY_MOUSE: IKeycodeCategoryInfo = {
  kinds: ['device', 'mouse'],
  codes: [
    205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219,
    220, 221, 222, 223,
  ],
};
// Reset, Debug, Clear EEPROM
export const KEY_SUB_CATEGORY_KEYBOARD: IKeycodeCategoryInfo = {
  kinds: ['device', 'keyboard'],
  codes: [31745, 31746, 31747],
};
// CL SWAP, CL CTRL, LAG SWP, RAG SWP, GUI OFF, GE SWAP, BS SWAP, NK ON, AG SWAP, CL NORM, CL CAPS, LAG NRM, RAG NRM, GUI ON, GE NORM, BS NORM, NK OFF, AG NORM, NK TOGG, AG TOGG
export const KEY_SUB_CATEGORY_BOOTMAGIC: IKeycodeCategoryInfo = {
  kinds: ['device', 'bootmagic'],
  codes: [
    28672, 28676, 28677, 28679, 28682, 28684, 28686, 28689, 28692, 28673, 28675,
    28678, 28680, 28681, 28685, 28687, 28690, 28693, 28691, 28694, 28695, 28697,
    28696, 28698, 28699, 28700, 28701, 28702, 28703, 31776, 31777, 31778,
  ],
};
// Audio On, Audio Off, Audio Toggle, Clicky Toggle, Clicky Enable, Clicky Disable, Clicky Up, Clicky Down, Clicky Reset, Music On, Music Off, Music Toggle, Music Mode
export const KEY_SUB_CATEGORY_SOUND: IKeycodeCategoryInfo = {
  kinds: ['device', 'sound'],
  codes: [
    29824, 29825, 29826, 29834, 29835, 29836, 29837, 29838, 29839, 29840, 29841,
    29842, 29843,
  ],
};
// BL On, BL Off, BL-, BL+, BL Toggle, BL Cycle, BR Toggle
export const KEY_SUB_CATEGORY_BACKLIGHT: IKeycodeCategoryInfo = {
  kinds: ['device', 'backlight'],
  codes: [30720, 30721, 30723, 30724, 30722, 30725, 30726],
};
// RGB Toggle, RGB Mode+, RGB Mode-, Hue+, Hue-, Sat+, Sat-, Bright+, Bright-, Effect Speed+, Effect Speed-, RGB Mode P, RGB Mode R, RGB Mode SW, RGB Mode SN, RGB Mode K, RGB Mode X, RGB Mode G
export const KEY_SUB_CATEGORY_UNDERGLOW: IKeycodeCategoryInfo = {
  kinds: ['device', 'underglow'],
  codes: [
    30752, 30753, 30754, 30755, 30756, 30757, 30758, 30759, 30760, 30761, 30762,
    30763, 30764, 30765, 30766, 30767, 30768, 30769, 30770, 30771,
  ],
};
// Macro
export const KEY_SUB_CATEGORY_MACRO: IKeycodeCategoryInfo = {
  kinds: ['macro'],
  codes: range(30464, 30495),
};
// Combo
export const KEY_SUB_CATEGORY_COMBO: IKeycodeCategoryInfo = {
  kinds: ['function', 'combo'],
  codes: [31761, 31760, 31762, 31765, 31763, 31764, 31824, 31825, 31826],
};

// MIDI(Notes)
export const KEY_SUB_CATEGORY_MIDI_NOTES: IKeycodeCategoryInfo = {
  kinds: ['midi', 'notes'],
  codes: range(28931, 29002),
};

// MIDI(Octave)
export const KEY_SUB_CATEGORY_MIDI_OCTAVE: IKeycodeCategoryInfo = {
  kinds: ['midi', 'octave'],
  codes: range(29003, 29014),
};

// MIDI(Transpose)
export const KEY_SUB_CATEGORY_MIDI_TRANSPOSE: IKeycodeCategoryInfo = {
  kinds: ['midi', 'transpose'],
  codes: range(29015, 29029),
};

// MIDI(Velocity)
export const KEY_SUB_CATEGORY_MIDI_VELOCITY: IKeycodeCategoryInfo = {
  kinds: ['midi', 'velocity'],
  codes: range(29030, 29042),
};

// MIDI(Channel)
export const KEY_SUB_CATEGORY_MIDI_CHANNEL: IKeycodeCategoryInfo = {
  kinds: ['midi', 'channel'],
  codes: range(29043, 29060),
};

// MIDI(Misc)
export const KEY_SUB_CATEGORY_MIDI_MISC: IKeycodeCategoryInfo = {
  kinds: ['midi', 'misc'],
  codes: [...range(28928, 28930), ...range(29061, 29071)],
};

// ASCII
export const KEY_CATEGORY_ASCII: IKeycodeCategoryInfo = {
  kinds: ['ascii'],
  codes: [
    33, 34, 35, 36, 37, 38, 40, 41, 42, 43, 60, 62, 63, 64, 65, 66, 67, 68, 69,
    70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88,
    89, 90, 94, 95, 123, 124, 125, 126,
  ],
};

// Tri Layer
export const KEY_SUB_CATEGORY_TRI_LAYER: IKeycodeCategoryInfo = {
  kinds: ['tri_layer'],
  codes: [31863, 31864],
};

// VIA USER
export const KEY_SUB_CATEGORY_VIA_USER_KEY: IKeycodeCategoryInfo = {
  kinds: ['via_user_key'],
  codes: range(32256, 32287), // QK_KB_0 - QK_KB_31
};
