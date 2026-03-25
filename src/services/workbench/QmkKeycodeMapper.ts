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
