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
            keycodeNames: [
              'KC_A',
              'KC_B',
              'KC_C',
              'KC_D',
              'KC_E',
              'KC_F',
            ],
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
  });
});
