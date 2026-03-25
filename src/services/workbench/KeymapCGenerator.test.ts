import { describe, expect, it } from 'vitest';
import { generateKeymapC } from './KeymapCGenerator';
import { parseKeymapC } from './KeymapCParser';

describe('KeymapCGenerator', () => {
  describe('generateKeymapC', () => {
    it('preserves original formatting when no keycodes change', () => {
      const original = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT_ortho_4x4(
        KC_1,    KC_2,    KC_3,    KC_A,
        KC_4,    KC_5,    KC_6,    KC_B,
        KC_7,    KC_8,    KC_9,    KC_C,
        KC_LSFT, KC_0,    KC_DEL,  KC_ENT
    )
};
`;
      const parsed = parseKeymapC(original);
      expect(parsed).not.toBeNull();
      const result = generateKeymapC(parsed!);
      // Should be identical since no keycodes changed
      expect(result).toBe(original);
    });

    it('replaces a single keycode while preserving everything else', () => {
      const original = `// Copyright
#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(
        KC_A, KC_B, KC_C
    )
};

void custom_function(void) {}
`;
      const parsed = parseKeymapC(original);
      expect(parsed).not.toBeNull();

      // Change KC_B to KC_Z
      parsed!.layers[0].keycodeNames[1] = 'KC_Z';
      const result = generateKeymapC(parsed!);

      expect(result).toContain('// Copyright');
      expect(result).toContain('#include QMK_KEYBOARD_H');
      expect(result).toContain('KC_Z');
      expect(result).not.toContain('KC_B');
      expect(result).toContain('void custom_function(void) {}');
    });

    it('preserves comments inside keymaps array', () => {
      const original = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    /*
     * Layout diagram here
     */
    [0] = LAYOUT(
        KC_A, KC_B
    )
};
`;
      const parsed = parseKeymapC(original);
      expect(parsed).not.toBeNull();

      parsed!.layers[0].keycodeNames[0] = 'KC_Z';
      const result = generateKeymapC(parsed!);

      expect(result).toContain('Layout diagram here');
      expect(result).toContain('KC_Z');
    });

    it('preserves postamble code', () => {
      const original = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(KC_A, KC_B)
};

#ifdef ENCODER_ENABLE
bool encoder_update_user(uint8_t index, bool clockwise) {
    if (clockwise) {
        tap_code(KC_VOLU);
    } else {
        tap_code(KC_VOLD);
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

    it('preserves preamble with defines', () => {
      const original = `// Copyright 2023 QMK
// SPDX-License-Identifier: GPL-2.0-or-later

#include QMK_KEYBOARD_H

#define _BASE 0
#define _LOWER 1

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(KC_A, KC_B)
};
`;
      const parsed = parseKeymapC(original);
      expect(parsed).not.toBeNull();

      parsed!.layers[0].keycodeNames[0] = 'KC_Z';
      const result = generateKeymapC(parsed!);

      expect(result).toContain('Copyright 2023 QMK');
      expect(result).toContain('#define _BASE 0');
      expect(result).toContain('#define _LOWER 1');
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

      expect(parsed2!.layers[0].keycodeNames).toEqual([
        'KC_A',
        'KC_Z',
        'KC_C',
      ]);
    });

    it('round-trips multi-layer keymap', () => {
      const original = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(
        KC_A, KC_B, MO(1)
    ),
    [1] = LAYOUT(
        KC_1, KC_2, _______
    )
};
`;
      const parsed1 = parseKeymapC(original);
      expect(parsed1).not.toBeNull();
      expect(parsed1!.layers).toHaveLength(2);

      parsed1!.layers[0].keycodeNames[0] = 'KC_Z';
      parsed1!.layers[1].keycodeNames[1] = 'KC_9';
      const generated = generateKeymapC(parsed1!);
      const parsed2 = parseKeymapC(generated);
      expect(parsed2).not.toBeNull();

      expect(parsed2!.layers[0].keycodeNames[0]).toBe('KC_Z');
      expect(parsed2!.layers[1].keycodeNames[1]).toBe('KC_9');
    });
  });
});
