import { describe, expect, it } from 'vitest';
import { parseKeymapC } from './KeymapCParser';

const SIMPLE_KEYMAP = `// Copyright 2023 QMK
// SPDX-License-Identifier: GPL-2.0-or-later

#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT_ortho_4x4(
        KC_1,    KC_2,    KC_3,    KC_A,
        KC_4,    KC_5,    KC_6,    KC_B,
        KC_7,    KC_8,    KC_9,    KC_C,
        KC_LSFT, KC_0,    KC_DEL,  KC_ENT
    )
};
`;

const MULTI_LAYER_KEYMAP = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT_split_3x6_3(
        KC_ESC,  KC_Q,    KC_W,    KC_E,    KC_R,    KC_T,                      KC_Y,    KC_U,    KC_I,    KC_O,    KC_P,    KC_BSPC,
        KC_TAB,  KC_A,    KC_S,    KC_D,    KC_F,    KC_G,                      KC_H,    KC_J,    KC_K,    KC_L,    KC_SCLN, KC_QUOT,
        KC_LSFT, KC_Z,    KC_X,    KC_C,    KC_V,    KC_B,                      KC_N,    KC_M,    KC_COMM, KC_DOT,  KC_SLSH, KC_RSFT,
                                            KC_LGUI, MO(1),   KC_SPC,  KC_ENT,  MO(2),   KC_RALT
    ),
    [1] = LAYOUT_split_3x6_3(
        KC_GRV,  KC_1,    KC_2,    KC_3,    KC_4,    KC_5,                      KC_6,    KC_7,    KC_8,    KC_9,    KC_0,    KC_DEL,
        _______, _______, _______, _______, _______, _______,                   KC_LEFT, KC_DOWN, KC_UP,   KC_RGHT, _______, _______,
        _______, _______, _______, _______, _______, _______,                   _______, _______, _______, _______, _______, _______,
                                            KC_LGUI, _______, KC_SPC,  KC_ENT,  MO(3),   KC_RALT
    ),
    [2] = LAYOUT_split_3x6_3(
        KC_TILD, KC_EXLM, KC_AT,   KC_HASH, KC_DLR,  KC_PERC,                  KC_CIRC, KC_AMPR, KC_ASTR, KC_LPRN, KC_RPRN, KC_DEL,
        _______, _______, _______, _______, _______, _______,                   KC_MINS, KC_EQL,  KC_LBRC, KC_RBRC, KC_BSLS, KC_GRV,
        _______, _______, _______, _______, _______, _______,                   KC_UNDS, KC_PLUS, KC_LCBR, KC_RCBR, KC_PIPE, KC_TILD,
                                            KC_LGUI, MO(3),   KC_SPC,  KC_ENT,  _______, KC_RALT
    )
};
`;

const COMPOSITE_KEYMAP = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(
        KC_ESC,        LT(1, KC_SPC),   MT(MOD_LCTL, KC_A),
        LCTL_T(KC_B),  RSFT(KC_C),      MO(2)
    )
};
`;

const KEYMAP_WITH_COMMENTS = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(
        // Row 1
        KC_A, KC_B, KC_C,
        /* Row 2 */
        KC_D, KC_E, KC_F
    )
};
`;

const KEYMAP_WITH_POSTAMBLE = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(KC_A, KC_B)
};

#ifdef ENCODER_ENABLE
bool encoder_update_user(uint8_t index, bool clockwise) {
    return false;
}
#endif
`;

describe('KeymapCParser', () => {
  describe('parseKeymapC', () => {
    it('parses a simple single-layer keymap', () => {
      const result = parseKeymapC(SIMPLE_KEYMAP);
      expect(result).not.toBeNull();
      expect(result!.layoutMacroName).toBe('LAYOUT_ortho_4x4');
      expect(result!.layers).toHaveLength(1);
      expect(result!.layers[0].index).toBe('0');
      expect(result!.layers[0].keycodeNames).toHaveLength(16);
      expect(result!.layers[0].keycodeNames[0]).toBe('KC_1');
      expect(result!.layers[0].keycodeNames[3]).toBe('KC_A');
      expect(result!.layers[0].keycodeNames[12]).toBe('KC_LSFT');
      expect(result!.layers[0].keycodeNames[15]).toBe('KC_ENT');
    });

    it('preserves preamble and postamble', () => {
      const result = parseKeymapC(KEYMAP_WITH_POSTAMBLE);
      expect(result).not.toBeNull();
      expect(result!.preamble).toContain('#include QMK_KEYBOARD_H');
      expect(result!.postamble).toContain('ENCODER_ENABLE');
    });

    it('parses a multi-layer keymap', () => {
      const result = parseKeymapC(MULTI_LAYER_KEYMAP);
      expect(result).not.toBeNull();
      expect(result!.layoutMacroName).toBe('LAYOUT_split_3x6_3');
      expect(result!.layers).toHaveLength(3);
      expect(result!.layers[0].index).toBe('0');
      expect(result!.layers[1].index).toBe('1');
      expect(result!.layers[2].index).toBe('2');
    });

    it('correctly parses MO() in multi-layer keymap', () => {
      const result = parseKeymapC(MULTI_LAYER_KEYMAP);
      expect(result).not.toBeNull();
      const layer0 = result!.layers[0].keycodeNames;
      expect(layer0).toContain('MO(1)');
      expect(layer0).toContain('MO(2)');
    });

    it('correctly parses transparent keys', () => {
      const result = parseKeymapC(MULTI_LAYER_KEYMAP);
      expect(result).not.toBeNull();
      const layer1 = result!.layers[1].keycodeNames;
      expect(layer1).toContain('_______');
    });

    it('parses composite keycodes with nested parentheses', () => {
      const result = parseKeymapC(COMPOSITE_KEYMAP);
      expect(result).not.toBeNull();
      const keys = result!.layers[0].keycodeNames;
      expect(keys).toHaveLength(6);
      expect(keys[1]).toBe('LT(1, KC_SPC)');
      expect(keys[2]).toBe('MT(MOD_LCTL, KC_A)');
      expect(keys[3]).toBe('LCTL_T(KC_B)');
      expect(keys[4]).toBe('RSFT(KC_C)');
      expect(keys[5]).toBe('MO(2)');
    });

    it('strips comments from keycode area', () => {
      const result = parseKeymapC(KEYMAP_WITH_COMMENTS);
      expect(result).not.toBeNull();
      const keys = result!.layers[0].keycodeNames;
      expect(keys).toHaveLength(6);
      expect(keys[0]).toBe('KC_A');
      expect(keys[3]).toBe('KC_D');
    });

    it('returns null for invalid content', () => {
      expect(parseKeymapC('')).toBeNull();
      expect(parseKeymapC('not a keymap')).toBeNull();
      expect(parseKeymapC('#include QMK_KEYBOARD_H')).toBeNull();
    });

    it('returns null for content without valid layers', () => {
      const noLayers = `#include QMK_KEYBOARD_H
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
};`;
      expect(parseKeymapC(noLayers)).toBeNull();
    });

    it('handles each layer having correct key count for split_3x6_3', () => {
      const result = parseKeymapC(MULTI_LAYER_KEYMAP);
      expect(result).not.toBeNull();
      expect(result!.layers[0].keycodeNames).toHaveLength(42);
      expect(result!.layers[1].keycodeNames).toHaveLength(42);
      expect(result!.layers[2].keycodeNames).toHaveLength(42);
    });

    it('parses layers with enum name indices', () => {
      const enumKeymap = `#include QMK_KEYBOARD_H

enum layer_number { _QWERTY = 0, _LOWER, _RAISE };

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [_QWERTY] = LAYOUT(KC_A, KC_B),
    [_LOWER] = LAYOUT(KC_1, KC_2),
    [_RAISE] = LAYOUT(KC_3, KC_4)
};
`;
      const result = parseKeymapC(enumKeymap);
      expect(result).not.toBeNull();
      expect(result!.layers).toHaveLength(3);
      expect(result!.layers[0].index).toBe('_QWERTY');
      expect(result!.layers[1].index).toBe('_LOWER');
      expect(result!.layers[2].index).toBe('_RAISE');
      expect(result!.layers[0].keycodeNames).toEqual(['KC_A', 'KC_B']);
    });
  });
});
