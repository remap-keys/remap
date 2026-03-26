import { keyInfoList } from '../hid/KeycodeInfoList';
import { KeycodeCompositionFactory } from '../hid/Composition';
import {
  QK_MOMENTARY_MIN,
  QK_MOMENTARY_MAX,
} from '../hid/compositions/MomentaryComposition';
import {
  QK_TOGGLE_LAYER_MIN,
  QK_TOGGLE_LAYER_MAX,
} from '../hid/compositions/ToggleLayerComposition';
import {
  QK_TO_MIN,
  QK_TO_MAX,
} from '../hid/compositions/ToComposition';
import {
  QK_DEF_LAYER_MIN,
  QK_DEF_LAYER_MAX,
} from '../hid/compositions/DefLayerComposition';
import {
  QK_ONE_SHOT_LAYER_MIN,
  QK_ONE_SHOT_LAYER_MAX,
} from '../hid/compositions/OneShotLayerComposition';
import {
  QK_LAYER_TAP_TOGGLE_MIN,
  QK_LAYER_TAP_TOGGLE_MAX,
} from '../hid/compositions/LayerTapToggleComposition';
import {
  QK_LAYER_TAP_MIN,
  QK_LAYER_TAP_MAX,
} from '../hid/compositions/LayerTapComposition';
import {
  QK_MOD_TAP_MIN,
  QK_MOD_TAP_MAX,
} from '../hid/compositions/ModTapComposition';
import {
  QK_ONE_SHOT_MOD_MIN,
  QK_ONE_SHOT_MOD_MAX,
} from '../hid/compositions/OneShotModComposition';
import {
  QK_LAYER_MOD_MIN,
  QK_LAYER_MOD_MAX,
} from '../hid/compositions/LayerModComposition';
import {
  QK_TAP_DANCE_MIN,
  QK_TAP_DANCE_MAX,
} from '../hid/compositions/TapDanceComposition';
import {
  QK_MACRO_MIN,
  QK_MACRO_MAX,
} from '../hid/compositions/MacroComposition';
import {
  QK_SWAP_HANDS_MIN,
  QK_SWAP_HANDS_MAX,
} from '../hid/compositions/SwapHandsComposition';
import {
  QK_MODS_MIN,
  QK_MODS_MAX,
} from '../hid/compositions/ModsComposition';

// Shifted keycode aliases from QMK's keymap_us.h
// Each maps to S(base) = LSFT(base) = QK_MODS_MIN | (0x02 << 8) | baseCode
const SHIFTED_ALIASES: Record<string, string> = {
  KC_TILD: 'KC_GRAVE',
  KC_TILDE: 'KC_GRAVE',
  KC_EXLM: 'KC_1',
  KC_EXCLAIM: 'KC_1',
  KC_AT: 'KC_2',
  KC_HASH: 'KC_3',
  KC_DLR: 'KC_4',
  KC_DOLLAR: 'KC_4',
  KC_PERC: 'KC_5',
  KC_PERCENT: 'KC_5',
  KC_CIRC: 'KC_6',
  KC_CIRCUMFLEX: 'KC_6',
  KC_AMPR: 'KC_7',
  KC_AMPERSAND: 'KC_7',
  KC_ASTR: 'KC_8',
  KC_ASTERISK: 'KC_8',
  KC_LPRN: 'KC_9',
  KC_LEFT_PAREN: 'KC_9',
  KC_RPRN: 'KC_0',
  KC_RIGHT_PAREN: 'KC_0',
  KC_UNDS: 'KC_MINUS',
  KC_UNDERSCORE: 'KC_MINUS',
  KC_PLUS: 'KC_EQUAL',
  KC_LCBR: 'KC_LEFT_BRACKET',
  KC_LEFT_CURLY_BRACE: 'KC_LEFT_BRACKET',
  KC_RCBR: 'KC_RIGHT_BRACKET',
  KC_RIGHT_CURLY_BRACE: 'KC_RIGHT_BRACKET',
  KC_PIPE: 'KC_BACKSLASH',
  KC_COLN: 'KC_SEMICOLON',
  KC_COLON: 'KC_SEMICOLON',
  KC_DQUO: 'KC_QUOTE',
  KC_DOUBLE_QUOTE: 'KC_QUOTE',
  KC_DQT: 'KC_QUOTE',
  KC_LABK: 'KC_COMMA',
  KC_LEFT_ANGLE_BRACKET: 'KC_COMMA',
  KC_LT: 'KC_COMMA',
  KC_RABK: 'KC_DOT',
  KC_RIGHT_ANGLE_BRACKET: 'KC_DOT',
  KC_GT: 'KC_DOT',
  KC_QUES: 'KC_SLASH',
  KC_QUESTION: 'KC_SLASH',
};

// Reverse map: numeric shifted code → preferred short alias name
const SHIFTED_CODE_TO_NAME: Record<number, string> = {};

// UG_* keycode aliases (QMK v0.0.4+) mapping to legacy RGB_* names in keyInfoList
const UG_ALIASES: Record<string, string> = {
  UG_TOGG: 'RGB_TOG',
  QK_UNDERGLOW_TOGGLE: 'RGB_TOG',
  UG_NEXT: 'RGB_MODE_FORWARD',
  QK_UNDERGLOW_MODE_NEXT: 'RGB_MODE_FORWARD',
  UG_PREV: 'RGB_MODE_REVERSE',
  QK_UNDERGLOW_MODE_PREVIOUS: 'RGB_MODE_REVERSE',
  UG_HUEU: 'RGB_HUI',
  QK_UNDERGLOW_HUE_UP: 'RGB_HUI',
  UG_HUED: 'RGB_HUD',
  QK_UNDERGLOW_HUE_DOWN: 'RGB_HUD',
  UG_SATU: 'RGB_SAI',
  QK_UNDERGLOW_SATURATION_UP: 'RGB_SAI',
  UG_SATD: 'RGB_SAD',
  QK_UNDERGLOW_SATURATION_DOWN: 'RGB_SAD',
  UG_VALU: 'RGB_VAI',
  QK_UNDERGLOW_VALUE_UP: 'RGB_VAI',
  UG_VALD: 'RGB_VAD',
  QK_UNDERGLOW_VALUE_DOWN: 'RGB_VAD',
  UG_SPDU: 'RGB_SPI',
  QK_UNDERGLOW_SPEED_UP: 'RGB_SPI',
  UG_SPDD: 'RGB_SPD',
  QK_UNDERGLOW_SPEED_DOWN: 'RGB_SPD',
};

// Lazy-initialized reverse lookup map: QMK keycode name → numeric code
let nameToCodeMap: Map<string, number> | null = null;

function getNameToCodeMap(): Map<string, number> {
  if (nameToCodeMap !== null) {
    return nameToCodeMap;
  }
  nameToCodeMap = new Map();
  for (const info of keyInfoList) {
    const { code, name } = info.keycodeInfo;
    if (name.long) {
      nameToCodeMap.set(name.long, code);
    }
    if (name.short && name.short !== name.long) {
      nameToCodeMap.set(name.short, code);
    }
  }

  // Register shifted aliases: KC_EXLM → LSFT(KC_1), etc.
  const lsftBits = 0x02;
  for (const [alias, baseName] of Object.entries(SHIFTED_ALIASES)) {
    const baseCode = nameToCodeMap.get(baseName);
    if (baseCode !== undefined) {
      const shiftedCode = QK_MODS_MIN | (lsftBits << 8) | (baseCode & 0xff);
      nameToCodeMap.set(alias, shiftedCode);
    }
  }

  // Build reverse map for shifted codes (prefer shortest alias)
  for (const [alias, baseName] of Object.entries(SHIFTED_ALIASES)) {
    const baseCode = nameToCodeMap.get(baseName);
    if (baseCode !== undefined) {
      const shiftedCode = QK_MODS_MIN | (lsftBits << 8) | (baseCode & 0xff);
      const existing = SHIFTED_CODE_TO_NAME[shiftedCode];
      if (!existing || alias.length < existing.length) {
        SHIFTED_CODE_TO_NAME[shiftedCode] = alias;
      }
    }
  }

  // Register UG_* aliases by resolving to the same code as the legacy RGB_* name
  for (const [ugName, rgbName] of Object.entries(UG_ALIASES)) {
    const code = nameToCodeMap.get(rgbName);
    if (code !== undefined) {
      nameToCodeMap.set(ugName, code);
    }
  }

  return nameToCodeMap;
}

// Mod bit constants matching QMK's mod definitions
const MOD_BITS: Record<string, number> = {
  MOD_LCTL: 0x01,
  MOD_LSFT: 0x02,
  MOD_LALT: 0x04,
  MOD_LGUI: 0x08,
  MOD_RCTL: 0x11,
  MOD_RSFT: 0x12,
  MOD_RALT: 0x14,
  MOD_RGUI: 0x18,
  MOD_MEH: 0x07, // Ctrl+Shift+Alt
  MOD_HYPR: 0x0f, // Ctrl+Shift+Alt+GUI
};

// Modifier wrapper function names (e.g., LCTL(kc), RSFT(kc))
const MOD_WRAPPER_NAMES: Record<string, number> = {
  LCTL: 0x01,
  LSFT: 0x02,
  LALT: 0x04,
  LGUI: 0x08,
  RCTL: 0x11,
  RSFT: 0x12,
  RALT: 0x14,
  RGUI: 0x18,
  HYPR: 0x0f,
  MEH: 0x07,
  LCAG: 0x0d, // Ctrl+Alt+GUI
  SGUI: 0x0a, // Shift+GUI
  LCA: 0x05, // Ctrl+Alt
  LSA: 0x06, // Shift+Alt
  RSA: 0x16, // Right Shift+Alt
  RCS: 0x13, // Right Ctrl+Shift
  SAGR: 0x16, // Same as RSA
};

// SwapHands option keycodes
const SH_OPTIONS: Record<string, number> = {
  SH_TOGGLE: 0x56f0,
  SH_ON: 0x56f1,
  SH_OFF: 0x56f2,
  SH_OFF_ON: 0x56f3,
  SH_ON_OFF: 0x56f4,
  SH_ONESHOT: 0x56f5,
  SH_TAP_TOGGLE: 0x56f6,
};

type CompositePattern = {
  regex: RegExp;
  // eslint-disable-next-line no-unused-vars
  toCode: (match: RegExpMatchArray, nameToCode: Map<string, number>) => number;
};

const COMPOSITE_PATTERNS: CompositePattern[] = [
  // MO(layer)
  {
    regex: /^MO\((\d+)\)$/,
    toCode: (m) => QK_MOMENTARY_MIN | parseInt(m[1]),
  },
  // TG(layer)
  {
    regex: /^TG\((\d+)\)$/,
    toCode: (m) => QK_TOGGLE_LAYER_MIN | parseInt(m[1]),
  },
  // TO(layer)
  {
    regex: /^TO\((\d+)\)$/,
    toCode: (m) => QK_TO_MIN | parseInt(m[1]),
  },
  // DF(layer)
  {
    regex: /^DF\((\d+)\)$/,
    toCode: (m) => QK_DEF_LAYER_MIN | parseInt(m[1]),
  },
  // TT(layer)
  {
    regex: /^TT\((\d+)\)$/,
    toCode: (m) => QK_LAYER_TAP_TOGGLE_MIN | parseInt(m[1]),
  },
  // OSL(layer)
  {
    regex: /^OSL\((\d+)\)$/,
    toCode: (m) => QK_ONE_SHOT_LAYER_MIN | parseInt(m[1]),
  },
  // LT(layer, keycode)
  {
    regex: /^LT\((\d+)\s*,\s*(\w+)\)$/,
    toCode: (m, map) => {
      const layer = parseInt(m[1]);
      const baseCode = map.get(m[2]) ?? 0;
      return QK_LAYER_TAP_MIN | (layer << 8) | (baseCode & 0xff);
    },
  },
  // OSM(mod)
  {
    regex: /^OSM\((\w+)\)$/,
    toCode: (m) => {
      const modBits = MOD_BITS[m[1]] ?? 0;
      return QK_ONE_SHOT_MOD_MIN | modBits;
    },
  },
  // MT(mod, keycode) / MOD_TAP
  {
    regex: /^MT\((\w+)\s*,\s*(\w+)\)$/,
    toCode: (m, map) => {
      const modBits = MOD_BITS[m[1]] ?? 0;
      const baseCode = map.get(m[2]) ?? 0;
      return QK_MOD_TAP_MIN | (modBits << 8) | (baseCode & 0xff);
    },
  },
  // Modifier wrapper: LCTL(kc), RSFT(kc), etc.
  {
    regex:
      /^(LCTL|LSFT|LALT|LGUI|RCTL|RSFT|RALT|RGUI|HYPR|MEH|LCAG|SGUI|LCA|LSA|RSA|RCS|SAGR)\((\w+)\)$/,
    toCode: (m, map) => {
      const modBits = MOD_WRAPPER_NAMES[m[1]] ?? 0;
      const baseCode = map.get(m[2]) ?? 0;
      return QK_MODS_MIN | (modBits << 8) | (baseCode & 0xff);
    },
  },
  // Modifier tap wrapper: LCTL_T(kc), RSFT_T(kc), etc.
  {
    regex:
      /^(LCTL|LSFT|LALT|LGUI|RCTL|RSFT|RALT|RGUI|HYPR|MEH|LCAG|SGUI|LCA|LSA|RSA|RCS|SAGR)_T\((\w+)\)$/,
    toCode: (m, map) => {
      const modBits = MOD_WRAPPER_NAMES[m[1]] ?? 0;
      const baseCode = map.get(m[2]) ?? 0;
      return QK_MOD_TAP_MIN | (modBits << 8) | (baseCode & 0xff);
    },
  },
  // LM(layer, mod)
  {
    regex: /^LM\((\d+)\s*,\s*(\w+)\)$/,
    toCode: (m) => {
      const layer = parseInt(m[1]);
      const modBits = MOD_BITS[m[2]] ?? 0;
      return QK_LAYER_MOD_MIN | (layer << 5) | (modBits & 0x1f);
    },
  },
  // TD(n)
  {
    regex: /^TD\((\d+)\)$/,
    toCode: (m) => QK_TAP_DANCE_MIN | parseInt(m[1]),
  },
  // SH_T(keycode) - SwapHands tap
  {
    regex: /^SH_T\((\w+)\)$/,
    toCode: (m, map) => {
      const baseCode = map.get(m[1]) ?? 0;
      return QK_SWAP_HANDS_MIN | (baseCode & 0xff);
    },
  },
];

/**
 * Convert a QMK keycode name string to its numeric code.
 * Supports basic keycodes (KC_A), composite keycodes (MO(1), LT(1, KC_SPC)),
 * modifier wrappers (LCTL(KC_A)), and swap hands options (SH_TOGGLE).
 */
export function nameToCode(name: string): number | null {
  const trimmed = name.trim();
  const map = getNameToCodeMap();

  // Direct lookup for basic keycodes
  const directCode = map.get(trimmed);
  if (directCode !== undefined) {
    return directCode;
  }

  // SwapHands options
  if (trimmed in SH_OPTIONS) {
    return SH_OPTIONS[trimmed];
  }

  // Composite patterns
  for (const pattern of COMPOSITE_PATTERNS) {
    const match = trimmed.match(pattern.regex);
    if (match) {
      return pattern.toCode(match, map);
    }
  }

  return null;
}

/**
 * Convert a numeric QMK keycode to its C macro name string.
 * Returns the most idiomatic QMK name (e.g., "MO(1)", "KC_A", "LT(1, KC_SPC)").
 */
export function codeToName(code: number): string {
  const map = getNameToCodeMap();

  // Check composite keycodes first (they take priority over basic lookups)
  const factory = new KeycodeCompositionFactory(code, 'en-us');

  if (factory.isMomentary()) {
    const layer = code - QK_MOMENTARY_MIN;
    return `MO(${layer})`;
  }
  if (factory.isToggleLayer()) {
    const layer = code - QK_TOGGLE_LAYER_MIN;
    return `TG(${layer})`;
  }
  if (factory.isTo()) {
    const layer = code - QK_TO_MIN;
    return `TO(${layer})`;
  }
  if (factory.isDefLayer()) {
    const layer = code - QK_DEF_LAYER_MIN;
    return `DF(${layer})`;
  }
  if (factory.isLayerTapToggle()) {
    const layer = code - QK_LAYER_TAP_TOGGLE_MIN;
    return `TT(${layer})`;
  }
  if (factory.isOneShotLayer()) {
    const layer = code - QK_ONE_SHOT_LAYER_MIN;
    return `OSL(${layer})`;
  }
  if (factory.isLayerTap()) {
    const layer = (code >> 8) & 0x0f;
    const baseCode = code & 0xff;
    const baseName = findBasicName(baseCode, map);
    return `LT(${layer}, ${baseName})`;
  }
  if (factory.isModTap()) {
    const modBits = (code >> 8) & 0x1f;
    const baseCode = code & 0xff;
    const baseName = findBasicName(baseCode, map);
    const modName = findModName(modBits);
    return `MT(${modName}, ${baseName})`;
  }
  if (factory.isOneShotMod()) {
    const modBits = code & 0x1f;
    const modName = findModName(modBits);
    return `OSM(${modName})`;
  }
  if (factory.isLayerMod()) {
    const layer = (code >> 5) & 0x0f;
    const modBits = code & 0x1f;
    const modName = findModName(modBits);
    return `LM(${layer}, ${modName})`;
  }
  if (factory.isTapDance()) {
    const n = code - QK_TAP_DANCE_MIN;
    return `TD(${n})`;
  }
  if (factory.isMacro()) {
    const n = code - QK_MACRO_MIN;
    // QMK uses QK_MACRO_0 etc., but in C code it appears as macro index
    return `QK_MACRO_${n}`;
  }
  if (factory.isSwapHands()) {
    // Check swap hands options first
    for (const [name, optCode] of Object.entries(SH_OPTIONS)) {
      if (code === optCode) {
        return name;
      }
    }
    // SH_T(keycode) for tap
    const baseCode = code & 0xff;
    const baseName = findBasicName(baseCode, map);
    return `SH_T(${baseName})`;
  }
  if (factory.isMods()) {
    // Check for shifted keycode aliases (e.g., LSFT(KC_1) → KC_EXLM)
    const shiftedAlias = SHIFTED_CODE_TO_NAME[code];
    if (shiftedAlias) {
      return shiftedAlias;
    }
    const modBits = (code >> 8) & 0x1f;
    const baseCode = code & 0xff;
    const baseName = findBasicName(baseCode, map);
    const wrapperName = findModWrapperName(modBits);
    if (wrapperName) {
      return `${wrapperName}(${baseName})`;
    }
    return `0x${code.toString(16).toUpperCase().padStart(4, '0')}`;
  }

  // Basic keycodes and loose keycodes: look up in the map
  for (const info of keyInfoList) {
    if (info.keycodeInfo.code === code) {
      return info.keycodeInfo.name.long;
    }
  }

  // Fallback: hex representation
  return `0x${code.toString(16).toUpperCase().padStart(4, '0')}`;
}

function findBasicName(
  baseCode: number,
  map: Map<string, number>
): string {
  for (const [name, code] of map) {
    if (code === baseCode && name.startsWith('KC_')) {
      return name;
    }
  }
  // Fallback
  for (const info of keyInfoList) {
    if (info.keycodeInfo.code === baseCode) {
      return info.keycodeInfo.name.long;
    }
  }
  return `0x${baseCode.toString(16).toUpperCase().padStart(2, '0')}`;
}

function findModName(modBits: number): string {
  for (const [name, bits] of Object.entries(MOD_BITS)) {
    if (bits === modBits) {
      return name;
    }
  }
  return `0x${modBits.toString(16).toUpperCase().padStart(2, '0')}`;
}

function findModWrapperName(modBits: number): string | null {
  for (const [name, bits] of Object.entries(MOD_WRAPPER_NAMES)) {
    if (bits === modBits) {
      return name;
    }
  }
  return null;
}
