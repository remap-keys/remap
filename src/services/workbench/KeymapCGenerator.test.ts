import { describe, expect, it } from 'vitest';
import { generateKeymapC } from './KeymapCGenerator';
import { parseKeymapC, ParsedKeymap } from './KeymapCParser';

describe('KeymapCGenerator', () => {
  describe('generateKeymapC', () => {
    it('generates keycodes on one line when keysPerRow is not provided', () => {
      const parsed: ParsedKeymap = {
        preamble:
          '#include QMK_KEYBOARD_H\n\nconst uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {',
        layoutMacroName: 'LAYOUT',
        layers: [
          {
            index: '0',
            keycodeNames: ['KC_A', 'KC_B', 'KC_C', 'KC_D'],
          },
        ],
        postamble: '',
      };

      const result = generateKeymapC(parsed);
      expect(result).toContain('KC_A, KC_B, KC_C, KC_D');
    });

    it('formats keycodes with keysPerRow', () => {
      const parsed: ParsedKeymap = {
        preamble:
          '#include QMK_KEYBOARD_H\n\nconst uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {',
        layoutMacroName: 'LAYOUT',
        layers: [
          {
            index: '0',
            keycodeNames: ['KC_A', 'KC_B', 'KC_C', 'KC_D', 'KC_E', 'KC_F'],
          },
        ],
        postamble: '',
      };

      const result = generateKeymapC(parsed, [3, 3]);
      expect(result).toContain('KC_A, KC_B, KC_C,');
      expect(result).toContain('KC_D, KC_E, KC_F');
      // Last row should NOT have trailing comma
      expect(result).not.toMatch(/KC_F,\s*\n/);
    });

    it('preserves preamble', () => {
      const original = `// Copyright 2023 QMK
// SPDX-License-Identifier: GPL-2.0-or-later

#include QMK_KEYBOARD_H

#define _BASE 0

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(KC_A, KC_B)
};
`;
      const parsed = parseKeymapC(original);
      expect(parsed).not.toBeNull();

      parsed!.layers[0].keycodeNames[0] = 'KC_Z';
      const result = generateKeymapC(parsed!);

      expect(result).toContain('Copyright 2023 QMK');
      expect(result).toContain('SPDX-License-Identifier');
      expect(result).toContain('#define _BASE 0');
      expect(result).toContain('KC_Z');
    });

    it('preserves postamble', () => {
      const original = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(KC_A, KC_B)
};

#ifdef ENCODER_ENABLE
bool encoder_update_user(uint8_t index, bool clockwise) {
    if (clockwise) {
        tap_code(KC_VOLU);
    }
    return false;
}
#endif

void keyboard_post_init_user(void) {
    rgb_matrix_mode(RGB_MATRIX_SOLID_COLOR);
}
`;
      const parsed = parseKeymapC(original);
      expect(parsed).not.toBeNull();

      parsed!.layers[0].keycodeNames[0] = 'KC_Z';
      const result = generateKeymapC(parsed!);

      expect(result).toContain('ENCODER_ENABLE');
      expect(result).toContain('encoder_update_user');
      expect(result).toContain('tap_code(KC_VOLU)');
      expect(result).toContain('keyboard_post_init_user');
      expect(result).toContain('rgb_matrix_mode');
    });

    it('handles multi-layer keymap', () => {
      const parsed: ParsedKeymap = {
        preamble:
          '#include QMK_KEYBOARD_H\n\nconst uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {',
        layoutMacroName: 'LAYOUT',
        layers: [
          { index: '0', keycodeNames: ['KC_A', 'KC_B', 'MO(1)'] },
          { index: '1', keycodeNames: ['KC_1', 'KC_2', '_______'] },
        ],
        postamble: '',
      };

      const result = generateKeymapC(parsed);
      expect(result).toContain('[0] = LAYOUT(');
      expect(result).toContain('[1] = LAYOUT(');
      // Comma between layers
      const lines = result.split('\n');
      const layer0Close = lines.find((l) => l.trim() === '),');
      const layer1Close = lines.find((l) => l.trim() === ')');
      expect(layer0Close).toBeDefined();
      expect(layer1Close).toBeDefined();
    });
  });

  describe('RGB/UG compatibility shim', () => {
    const SHIM_BEGIN_MARKER = '/* BEGIN Remap shim: RGB/UG compat */';
    const SHIM_END_MARKER = '/* END Remap shim: RGB/UG compat */';

    it('injects shim before keymaps array when UG_* keycodes are present', () => {
      const parsed: ParsedKeymap = {
        preamble:
          '#include QMK_KEYBOARD_H\n\nconst uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {',
        layoutMacroName: 'LAYOUT',
        layers: [{ index: '0', keycodeNames: ['KC_A', 'UG_TOGG', 'KC_B'] }],
        postamble: '',
      };

      const result = generateKeymapC(parsed);
      expect(result).toContain(SHIM_BEGIN_MARKER);
      expect(result).toContain(SHIM_END_MARKER);
      expect(result).toContain('#if !defined(UG_TOGG) && defined(RGB_TOG)');
      expect(result).toContain('#  define UG_TOGG');
      expect(result).toContain('#  define UG_SPDD');

      // Shim must appear before the keymaps array declaration.
      const shimIdx = result.indexOf(SHIM_BEGIN_MARKER);
      const keymapsIdx = result.indexOf('const uint16_t PROGMEM keymaps');
      expect(shimIdx).toBeGreaterThanOrEqual(0);
      expect(keymapsIdx).toBeGreaterThan(shimIdx);
    });

    it('does not inject shim when no UG_* keycodes are present', () => {
      const parsed: ParsedKeymap = {
        preamble:
          '#include QMK_KEYBOARD_H\n\nconst uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {',
        layoutMacroName: 'LAYOUT',
        layers: [{ index: '0', keycodeNames: ['KC_A', 'KC_B', 'KC_C'] }],
        postamble: '',
      };

      const result = generateKeymapC(parsed);
      expect(result).not.toContain(SHIM_BEGIN_MARKER);
      expect(result).not.toContain('#  define UG_TOGG');
    });

    it('does not duplicate shim across round-trips', () => {
      const original = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(KC_A, UG_TOGG, KC_B)
};
`;

      let content = original;
      for (let i = 0; i < 3; i++) {
        const parsed = parseKeymapC(content);
        expect(parsed).not.toBeNull();
        content = generateKeymapC(parsed!);
      }

      const beginCount = (
        content.match(/BEGIN Remap shim: RGB\/UG compat/g) || []
      ).length;
      const endCount = (content.match(/END Remap shim: RGB\/UG compat/g) || [])
        .length;
      expect(beginCount).toBe(1);
      expect(endCount).toBe(1);
    });

    it('refreshes an existing shim rather than stacking a second one', () => {
      // Preamble already contains a (possibly older) shim block.
      const original = `#include QMK_KEYBOARD_H

${SHIM_BEGIN_MARKER}
#if !defined(UG_TOGG) && defined(RGB_TOG)
#  define UG_TOGG RGB_TOG
#endif
${SHIM_END_MARKER}

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(KC_A, UG_TOGG, KC_B)
};
`;
      const parsed = parseKeymapC(original);
      expect(parsed).not.toBeNull();
      const result = generateKeymapC(parsed!);

      const beginCount = (
        result.match(/BEGIN Remap shim: RGB\/UG compat/g) || []
      ).length;
      expect(beginCount).toBe(1);
      // Fresh shim must contain all eleven UG_* definitions.
      expect(result).toContain('#  define UG_SPDD');
    });

    it('strips unmarked legacy shims that share our #if signature', () => {
      // Real-world input: the user's file ended up with both a pre-existing
      // unmarked legacy shim and a Remap-marked shim. A regenerate must
      // collapse everything down to one canonical shim.
      const legacyPlusMarked = `// Copyright 2023 QMK
// SPDX-License-Identifier: GPL-2.0-or-later

#include QMK_KEYBOARD_H

#if !defined(UG_TOGG) && defined(RGB_TOG)
    #define UG_TOGG  RGB_TOG
    #define UG_NEXT  RGB_MODE_FORWARD
    #define UG_PREV  RGB_MODE_REVERSE
    #define UG_HUEU  RGB_HUI
    #define UG_HUED  RGB_HUD
    #define UG_SATU  RGB_SAI
    #define UG_SATD  RGB_SAD
    #define UG_VALU  RGB_VAI
    #define UG_VALD  RGB_VAD
    #define UG_SPDU  RGB_SPI
    #define UG_SPDD  RGB_SPD
#endif

${SHIM_BEGIN_MARKER}
#if !defined(UG_TOGG) && defined(RGB_TOG)
#  define UG_TOGG  RGB_TOG
#endif
${SHIM_END_MARKER}

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(UG_TOGG)
};
`;
      const parsed = parseKeymapC(legacyPlusMarked);
      expect(parsed).not.toBeNull();
      const result = generateKeymapC(parsed!);

      // Only one shim should remain, and the unmarked block must be gone.
      const beginCount = (
        result.match(/BEGIN Remap shim: RGB\/UG compat/g) || []
      ).length;
      expect(beginCount).toBe(1);

      const rawIfCount = (
        result.match(/#if\s+!defined\(UG_TOGG\) && defined\(RGB_TOG\)/g) || []
      ).length;
      expect(rawIfCount).toBe(1);

      // The 4-space-indented legacy `    #define` must be purged.
      expect(result).not.toMatch(/ {4}#define UG_TOGG/);
    });

    it('strips a lone unmarked legacy shim (no Remap markers at all)', () => {
      const legacyOnly = `#include QMK_KEYBOARD_H

#if !defined(UG_TOGG) && defined(RGB_TOG)
    #define UG_TOGG  RGB_TOG
    #define UG_NEXT  RGB_MODE_FORWARD
#endif

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(UG_TOGG, KC_A)
};
`;
      const parsed = parseKeymapC(legacyOnly);
      expect(parsed).not.toBeNull();
      const result = generateKeymapC(parsed!);

      const beginCount = (
        result.match(/BEGIN Remap shim: RGB\/UG compat/g) || []
      ).length;
      expect(beginCount).toBe(1);
      // The 4-space indentation legacy form must be gone.
      expect(result).not.toMatch(/ {4}#define UG_TOGG/);
    });

    it('collapses two existing shim blocks into one', () => {
      const doubled = `#include QMK_KEYBOARD_H

${SHIM_BEGIN_MARKER}
#if !defined(UG_TOGG) && defined(RGB_TOG)
#  define UG_TOGG RGB_TOG
#endif
${SHIM_END_MARKER}

${SHIM_BEGIN_MARKER}
#if !defined(UG_TOGG) && defined(RGB_TOG)
#  define UG_TOGG RGB_TOG
#endif
${SHIM_END_MARKER}

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(KC_A, UG_TOGG, KC_B)
};
`;
      const parsed = parseKeymapC(doubled);
      expect(parsed).not.toBeNull();
      const result = generateKeymapC(parsed!);

      const beginCount = (
        result.match(/BEGIN Remap shim: RGB\/UG compat/g) || []
      ).length;
      expect(beginCount).toBe(1);
    });

    it('does not accumulate blank lines around the shim across round-trips', () => {
      const original = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(KC_A, UG_TOGG, KC_B)
};
`;
      let content = original;
      for (let i = 0; i < 5; i++) {
        const parsed = parseKeymapC(content);
        expect(parsed).not.toBeNull();
        content = generateKeymapC(parsed!);
      }

      // At most one blank line between each adjacent pair of sections.
      const blankBetweenIncludeAndShim = content
        .split('#include QMK_KEYBOARD_H')[1]
        .split(SHIM_BEGIN_MARKER)[0];
      expect(blankBetweenIncludeAndShim).toBe('\n\n');

      const blankBetweenShimEndAndArray = content
        .split(SHIM_END_MARKER)[1]
        .split('const uint16_t')[0];
      expect(blankBetweenShimEndAndArray).toBe('\n\n');
    });
  });

  describe('round-trip: parse → modify → generate → parse', () => {
    it('round-trips preserving keycode data after modification', () => {
      const original = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(
        KC_A, KC_B, KC_C
    )
};
`;
      const parsed1 = parseKeymapC(original);
      expect(parsed1).not.toBeNull();

      parsed1!.layers[0].keycodeNames[1] = 'KC_Z';
      const generated = generateKeymapC(parsed1!);
      const parsed2 = parseKeymapC(generated);
      expect(parsed2).not.toBeNull();
      expect(parsed2!.layers[0].keycodeNames).toEqual(['KC_A', 'KC_Z', 'KC_C']);
    });

    it('round-trips preserving preamble and postamble', () => {
      const original = `// License header
#include QMK_KEYBOARD_H

#define MY_MACRO 42

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(KC_A, KC_B)
};

void my_custom_function(void) {
    // important code
}
`;
      const parsed = parseKeymapC(original);
      expect(parsed).not.toBeNull();

      parsed!.layers[0].keycodeNames[0] = 'KC_Z';
      const generated = generateKeymapC(parsed!);

      expect(generated).toContain('License header');
      expect(generated).toContain('#define MY_MACRO 42');
      expect(generated).toContain('my_custom_function');
      expect(generated).toContain('important code');

      const reParsed = parseKeymapC(generated);
      expect(reParsed).not.toBeNull();
      expect(reParsed!.preamble).toContain('#define MY_MACRO 42');
      expect(reParsed!.postamble).toContain('my_custom_function');
    });

    it('does not accumulate blank lines between array and postamble across round-trips', () => {
      const original = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(KC_A, KC_B)
};

layer_state_t layer_state_set_user(layer_state_t state) {
    return state;
}
`;
      let content = original;
      for (let i = 0; i < 5; i++) {
        const parsed = parseKeymapC(content);
        expect(parsed).not.toBeNull();
        content = generateKeymapC(parsed!);
      }

      const blankLinesBetween = content
        .split('};')[1]
        .split('layer_state_t')[0];
      expect(blankLinesBetween).toBe('\n\n');
    });
  });
});
