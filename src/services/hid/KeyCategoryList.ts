import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';
import { ICustomKeycode, IKeycodeCategoryInfo, IKeymap } from './Hid';
import { range } from '../../utils/ArrayUtils';
import { encodeMacroText, IMacroBuffer } from '../macro/Macro';
import { BasicComposition } from './compositions/BasicComposition';
import { ToComposition } from './compositions/ToComposition';
import { MomentaryComposition } from './compositions/MomentaryComposition';
import { DefLayerComposition } from './compositions/DefLayerComposition';
import { ToggleLayerComposition } from './compositions/ToggleLayerComposition';
import { OneShotLayerComposition } from './compositions/OneShotLayerComposition';
import { SwapHandsComposition } from './compositions/SwapHandsComposition';
import { LayerTapToggleComposition } from './compositions/LayerTapToggleComposition';
import { LooseKeycodeComposition } from './compositions/LooseKeycodeComposition';
import { ViaUserKeyComposition } from './compositions/ViaUserKeyComposition';
import { AsciiComposition } from './compositions/AsciiComposition';
import { LayerModComposition } from './compositions/LayerModComposition';

export class KeyCategory {
  private static _basic: { [pos: string]: IKeymap[] } = {};
  private static _functions: { [pos: string]: IKeymap[] } = {};
  private static _layer: { [layerCount: number]: IKeymap[] } = {};
  private static _special: { [pos: string]: IKeymap[] } = {};
  private static _device: { [pos: string]: IKeymap[] } = {};
  private static _midi: IKeymap[];
  private static _bmp: IKeymap[];

  static ascii(): IKeymap[] {
    // No need to be cached here because AsciiComposition has the cache.
    return AsciiComposition.genKeymaps();
  }

  static basic(labelLang: KeyboardLabelLang): IKeymap[] {
    if (Object.prototype.hasOwnProperty.call(KeyCategory._basic, labelLang)) {
      return KeyCategory._basic[labelLang];
    }

    const basicCodes1: number[] = [
      ...KEY_SUB_CATEGORY_BLANK.codes,
      ...KEY_SUB_CATEGORY_LETTER.codes,
      ...KEY_SUB_CATEGORY_NUMBER.codes,
      ...KEY_SUB_CATEGORY_PUNCTUATION.codes,
    ];
    const basicKeymaps1: IKeymap[] = basicCodes1.map(
      (code) => BasicComposition.findKeymap(code, labelLang)!
    );

    const looseKeycodes: number[] = [
      ...KEY_SUB_CATEGORY_GRAVE_ESCAPE.codes,
      ...KEY_SUB_CATEGORY_SPACE_CADET_SHIFT.codes,
    ];
    const looseKeymaps: IKeymap[] = looseKeycodes.map((code) => {
      return LooseKeycodeComposition.findKeymap(code)!;
    });

    const basicCodes2: number[] = [
      ...KEY_SUB_CATEGORY_F.codes,
      ...KEY_SUB_CATEGORY_MODIFIER.codes,
      ...KEY_SUB_CATEGORY_EDIT.codes,
      ...KEY_SUB_CATEGORY_MOVE.codes,
      ...KEY_SUB_CATEGORY_NUMPAD.codes,
    ];
    const basicKeymaps2: IKeymap[] = basicCodes2.map(
      (code) => BasicComposition.findKeymap(code, labelLang)!
    );

    KeyCategory._basic[labelLang] = [
      ...basicKeymaps1,
      ...looseKeymaps,
      ...basicKeymaps2,
    ];
    return KeyCategory._basic[labelLang];
  }

  static functions(
    labelLang: KeyboardLabelLang,
    customKeycodes: ICustomKeycode[] | undefined
  ): IKeymap[] {
    // It is necessary to build keymaps every time for custom keycodes.
    const functionsCodes: number[] = [
      ...KEY_SUB_CATEGORY_INTERNATIONAL.codes,
      ...KEY_SUB_CATEGORY_LANGUAGE.codes,
      ...KEY_SUB_CATEGORY_LOCK.codes,
    ];
    const functionsKeymaps: IKeymap[] = functionsCodes.map(
      (code) => BasicComposition.findKeymap(code, labelLang)!
    );

    const looseKeycodes1: number[] = [
      ...KEY_SUB_CATEGORY_COMBO.codes,
      ...KEY_SUB_CATEGORY_AUTO_SHIFT.codes,
    ];
    const looseKeymaps1: IKeymap[] = looseKeycodes1.map((code) => {
      return LooseKeycodeComposition.findKeymap(code)!;
    });

    const viaUserCodes: number[] = [...KEY_SUB_CATEGORY_VIA_USER_KEY.codes];
    const viaUserKeymaps: IKeymap[] = viaUserCodes.map(
      (code) => ViaUserKeyComposition.findKeymap(code, customKeycodes)!
    );

    const looseKeycodes2: number[] = [
      ...KEY_SUB_CATEGORY_PROGRAMMABLE_BUTTON.codes,
      ...KEY_SUB_CATEGORY_USER.codes,
      ...KEY_SUB_CATEGORY_LEADER_KEY.codes,
      ...KEY_SUB_CATEGORY_DYNAMIC_MACRO.codes,
    ];
    const looseKeymaps2: IKeymap[] = looseKeycodes2.map((code) => {
      return LooseKeycodeComposition.findKeymap(code)!;
    });

    KeyCategory._functions[labelLang] = [
      ...functionsKeymaps,
      ...looseKeymaps1,
      ...viaUserKeymaps,
      ...looseKeymaps2,
    ];
    return KeyCategory._functions[labelLang];
  }

  static layer(layerCount: number): IKeymap[] {
    if (Object.prototype.hasOwnProperty.call(KeyCategory._layer, layerCount))
      return KeyCategory._layer[layerCount];

    const triLayerCodes: number[] = [...KEY_SUB_CATEGORY_TRI_LAYER.codes];
    const triLayerKeymaps: IKeymap[] = triLayerCodes.map(
      (code) => LooseKeycodeComposition.findKeymap(code)!
    );

    const keymaps: IKeymap[] = [
      ...ToComposition.genKeymaps(layerCount),
      ...ToggleLayerComposition.genKeymaps(layerCount),
      ...LayerModComposition.genKeymaps(layerCount),
      ...LayerTapToggleComposition.genKeymaps(layerCount),
      ...MomentaryComposition.genKeymaps(layerCount),
      ...OneShotLayerComposition.genKeymaps(layerCount),
      ...DefLayerComposition.genKeymaps(layerCount),
      ...triLayerKeymaps,
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
    const basicKeymaps: IKeymap[] = basicCodes.map((code) => {
      return BasicComposition.findKeymap(code, labelLang)!;
    });

    const shKeymaps: IKeymap[] =
      SwapHandsComposition.genSwapHandsOptionKeymaps();

    const looseKeycodes: number[] = [
      ...KEY_SUB_CATEGORY_ONE_SHOT_KEYS.codes,
      ...KEY_SUB_CATEGORY_KEY_OVERRIDE.codes,
      ...KEY_SUB_CATEGORY_TAPPING_TERM.codes,
      ...KEY_SUB_CATEGORY_AUTO_CORRECT.codes,
      ...KEY_SUB_CATEGORY_REPEAT_KEY.codes,
      ...KEY_SUB_CATEGORY_KEY_LOCK.codes,
      ...KEY_SUB_CATEGORY_CAPS_WORD.codes,
      ...KEY_SUB_CATEGORY_STENO.codes,
      ...KEY_SUB_CATEGORY_UNICODE_MODE.codes,
    ];
    const looseKeymaps: IKeymap[] = looseKeycodes.map((code) => {
      return LooseKeycodeComposition.findKeymap(code)!;
    });

    KeyCategory._special[labelLang] = [
      ...basicKeymaps,
      ...shKeymaps,
      ...looseKeymaps,
    ];
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
      ...KEY_SUB_CATEGORY_UNDERGLOW.codes,
      ...KEY_SUB_CATEGORY_BACKLIGHT.codes,
      ...KEY_SUB_CATEGORY_AUDIO.codes,
      ...KEY_SUB_CATEGORY_MAGIC.codes,
      ...KEY_SUB_CATEGORY_BLUETOOTH.codes,
      ...KEY_SUB_CATEGORY_JOYSTICK.codes,
      ...KEY_SUB_CATEGORY_HAPTIC_FEEDBACK.codes,
      ...KEY_SUB_CATEGORY_SECURE.codes,
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

    KeyCategory._bmp = LooseKeycodeComposition.genExtendsBmpKeymaps();
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
      ...KEY_SUB_CATEGORY_SEQUENCER.codes,
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
  codes: [0x39, 0x47, 0x53, 0x82, 0x83, 0x84],
};

// Caps Word
export const KEY_SUB_CATEGORY_CAPS_WORD: IKeycodeCategoryInfo = {
  kinds: ['special', 'caps_word'],
  codes: [0x7c73],
};

// Key Lock
export const KEY_SUB_CATEGORY_KEY_LOCK: IKeycodeCategoryInfo = {
  kinds: ['special', 'key_lock'],
  codes: [0x7c59],
};

// - = ` [ ] | \ NUHS ; ' , . / NUBS
export const KEY_SUB_CATEGORY_PUNCTUATION: IKeycodeCategoryInfo = {
  kinds: ['symbol', 'punctuation'],
  codes: [
    0x2d, 0x2e, 0x35, 0x2f, 0x30, 0x31, 0x32, 0x33, 0x34, 0x36, 0x37, 0x38,
    0x64,
  ],
};

// Grave Escape
export const KEY_SUB_CATEGORY_GRAVE_ESCAPE: IKeycodeCategoryInfo = {
  kinds: ['symbol', 'grave_escape'],
  codes: [0x7c16],
};

// Num 1, Num 2, Num 3, Num 4, Num 5, Num 6, Num 7, Num 8, Num 9, Num 0, Num +, Num -, Num *, Num /, Num =, Num ,, Num = AS400, Num ., Num Enter,
export const KEY_SUB_CATEGORY_NUMPAD: IKeycodeCategoryInfo = {
  kinds: ['basic', 'numpad'],
  codes: [
    89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 87, 86, 85, 84, 103, 133, 134, 99,
    88,
  ],
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

// CL SWAP, CL CTRL, LAG SWP, RAG SWP, GUI OFF, GE SWAP, BS SWAP, NK ON, AG SWAP, CL NORM, CL CAPS, LAG NRM, RAG NRM, GUI ON, GE NORM, BS NORM, NK OFF, AG NORM, NK TOGG, AG TOGG
export const KEY_SUB_CATEGORY_MAGIC: IKeycodeCategoryInfo = {
  kinds: ['device', 'magic'],
  codes: range(0x7000, 0x7022),
};

// Audio On, Audio Off, Audio Toggle, Clicky Toggle, Clicky Enable, Clicky Disable, Clicky Up, Clicky Down, Clicky Reset, Music On, Music Off, Music Toggle, Music Mode
export const KEY_SUB_CATEGORY_AUDIO: IKeycodeCategoryInfo = {
  kinds: ['device', 'audio'],
  codes: [...range(0x7480, 0x7482), ...range(0x748a, 0x7495)],
};

// BL On, BL Off, BL-, BL+, BL Toggle, BL Cycle, BR Toggle
export const KEY_SUB_CATEGORY_BACKLIGHT: IKeycodeCategoryInfo = {
  kinds: ['device', 'backlight'],
  codes: range(0x7800, 0x7806),
};

// RGB Toggle, RGB Mode+, RGB Mode-, Hue+, Hue-, Sat+, Sat-, Bright+, Bright-, Effect Speed+, Effect Speed-, RGB Mode P, RGB Mode R, RGB Mode SW, RGB Mode SN, RGB Mode K, RGB Mode X, RGB Mode G
export const KEY_SUB_CATEGORY_UNDERGLOW: IKeycodeCategoryInfo = {
  kinds: ['device', 'underglow'],
  codes: [...range(0x7820, 0x7834), 0x7c17],
};

// Macro
export const KEY_SUB_CATEGORY_MACRO: IKeycodeCategoryInfo = {
  kinds: ['macro'],
  codes: range(0x7700, 0x771f),
};

// MIDI(Notes)
export const KEY_SUB_CATEGORY_MIDI_NOTES: IKeycodeCategoryInfo = {
  kinds: ['midi', 'notes'],
  codes: range(0x7103, 0x714a),
};

// MIDI(Octave)
export const KEY_SUB_CATEGORY_MIDI_OCTAVE: IKeycodeCategoryInfo = {
  kinds: ['midi', 'octave'],
  codes: range(0x714b, 0x7156),
};

// MIDI(Transpose)
export const KEY_SUB_CATEGORY_MIDI_TRANSPOSE: IKeycodeCategoryInfo = {
  kinds: ['midi', 'transpose'],
  codes: range(0x7157, 0x7165),
};

// MIDI(Velocity)
export const KEY_SUB_CATEGORY_MIDI_VELOCITY: IKeycodeCategoryInfo = {
  kinds: ['midi', 'velocity'],
  codes: range(0x7166, 0x7172),
};

// MIDI(Channel)
export const KEY_SUB_CATEGORY_MIDI_CHANNEL: IKeycodeCategoryInfo = {
  kinds: ['midi', 'channel'],
  codes: range(0x7173, 0x7184),
};

// MIDI(Misc)
export const KEY_SUB_CATEGORY_MIDI_MISC: IKeycodeCategoryInfo = {
  kinds: ['midi', 'misc'],
  codes: [...range(0x7100, 0x7102), ...range(0x7185, 0x718f)],
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

// VIA USER
export const KEY_SUB_CATEGORY_VIA_USER_KEY: IKeycodeCategoryInfo = {
  kinds: ['function', 'via_user_key'],
  codes: range(32256, 32287), // QK_KB_0 - QK_KB_31
};

// Sequencer
export const KEY_SUB_CATEGORY_SEQUENCER: IKeycodeCategoryInfo = {
  kinds: ['midi', 'sequencer'],
  codes: range(0x7200, 0x7208),
};

// JoyStick
export const KEY_SUB_CATEGORY_JOYSTICK: IKeycodeCategoryInfo = {
  kinds: ['device', 'joystick'],
  codes: range(0x7400, 0x741f),
};

// Programmable Button
export const KEY_SUB_CATEGORY_PROGRAMMABLE_BUTTON: IKeycodeCategoryInfo = {
  kinds: ['special', 'programmable_button'],
  codes: range(0x7440, 0x745f),
};

// Stenography
export const KEY_SUB_CATEGORY_STENO: IKeycodeCategoryInfo = {
  kinds: ['special', 'steno'],
  codes: [...range(0x74f0, 0x74f2), 0x74fc],
};

// Leader Key
export const KEY_SUB_CATEGORY_LEADER_KEY: IKeycodeCategoryInfo = {
  kinds: ['function', 'leader_key'],
  codes: [0x7c58],
};

// Repeat Key
export const KEY_SUB_CATEGORY_REPEAT_KEY: IKeycodeCategoryInfo = {
  kinds: ['special', 'repeat_key'],
  codes: [0x7c79, 0x7c7a],
};

// Bluetooth
export const KEY_SUB_CATEGORY_BLUETOOTH: IKeycodeCategoryInfo = {
  kinds: ['device', 'bluetooth'],
  codes: range(0x7c20, 0x7c22),
};

// Auto Correct
export const KEY_SUB_CATEGORY_AUTO_CORRECT: IKeycodeCategoryInfo = {
  kinds: ['special', 'auto_correct'],
  codes: range(0x7c74, 0x7c76),
};

// Tapping Term
export const KEY_SUB_CATEGORY_TAPPING_TERM: IKeycodeCategoryInfo = {
  kinds: ['special', 'tapping_term'],
  codes: range(0x7c70, 0x7c72),
};

// Secure
export const KEY_SUB_CATEGORY_SECURE: IKeycodeCategoryInfo = {
  kinds: ['device', 'secure'],
  codes: range(0x7c60, 0x7c63),
};

// Key Override
export const KEY_SUB_CATEGORY_KEY_OVERRIDE: IKeycodeCategoryInfo = {
  kinds: ['special', 'key_override'],
  codes: range(0x7c5d, 0x7c5f),
};

// One Shot Keys
export const KEY_SUB_CATEGORY_ONE_SHOT_KEYS: IKeycodeCategoryInfo = {
  kinds: ['special', 'one_shot_keys'],
  codes: range(0x7c5a, 0x7c5c),
};

// Dynamic Macro
export const KEY_SUB_CATEGORY_DYNAMIC_MACRO: IKeycodeCategoryInfo = {
  kinds: ['function', 'dynamic_macro'],
  codes: range(0x7c53, 0x7c57),
};

// Haptic Feedback
export const KEY_SUB_CATEGORY_HAPTIC_FEEDBACK: IKeycodeCategoryInfo = {
  kinds: ['device', 'haptic_feedback'],
  codes: range(0x7c40, 0x7c4c),
};

// Unicode Mode
export const KEY_SUB_CATEGORY_UNICODE_MODE: IKeycodeCategoryInfo = {
  kinds: ['special', 'unicode_mode'],
  codes: range(0x7c30, 0x7c37),
};

// Space Cadet Shift
export const KEY_SUB_CATEGORY_SPACE_CADET_SHIFT: IKeycodeCategoryInfo = {
  kinds: ['function', 'space_cadet'],
  codes: range(0x7c18, 0x7c1e),
};

// Auto Shift
export const KEY_SUB_CATEGORY_AUTO_SHIFT: IKeycodeCategoryInfo = {
  kinds: ['function', 'auto_shift'],
  codes: range(0x7c10, 0x7c15),
};

// Keyboard
export const KEY_SUB_CATEGORY_KEYBOARD: IKeycodeCategoryInfo = {
  kinds: ['device', 'keyboard'],
  codes: range(0x7c00, 0x7c04),
};

// User
export const KEY_SUB_CATEGORY_USER: IKeycodeCategoryInfo = {
  kinds: ['special', 'user'],
  codes: range(0x7e40, 0x7e5f),
};

// Tri-Layer
export const KEY_SUB_CATEGORY_TRI_LAYER: IKeycodeCategoryInfo = {
  kinds: ['tri_layer'],
  codes: [0x7c77, 0x7c78],
};

// Combo
export const KEY_SUB_CATEGORY_COMBO: IKeycodeCategoryInfo = {
  kinds: ['combo'],
  codes: range(0x7c50, 0x7c52),
};
