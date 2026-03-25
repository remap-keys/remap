import { describe, expect, it } from 'vitest';
import { generateKeymapC } from './KeymapCGenerator';
import { parseKeymapC, ParsedKeymap } from './KeymapCParser';

describe('KeymapCGenerator', () => {
  describe('generateKeymapC', () => {
    it('generates valid keymap.c from a ParsedKeymap', () => {
      const parsed: ParsedKeymap = {
        preamble:
          '#include QMK_KEYBOARD_H\n\nconst uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {',
        layoutMacroName: 'LAYOUT_ortho_4x4',
        layers: [
          {
            index: 0,
            keycodeNames: [
              'KC_1',
              'KC_2',
              'KC_3',
              'KC_A',
              'KC_4',
              'KC_5',
              'KC_6',
              'KC_B',
              'KC_7',
              'KC_8',
              'KC_9',
              'KC_C',
              'KC_LSFT',
              'KC_0',
              'KC_DEL',
              'KC_ENT',
            ],
          },
        ],
        postamble: '',
      };

      const result = generateKeymapC(parsed, 4);
      expect(result).toContain('#include QMK_KEYBOARD_H');
      expect(result).toContain('LAYOUT_ortho_4x4');
      expect(result).toContain('KC_1, KC_2, KC_3, KC_A');
      expect(result).toContain('KC_LSFT, KC_0, KC_DEL, KC_ENT');
      expect(result).toContain('};');
    });

    it('generates multi-layer keymap', () => {
      const parsed: ParsedKeymap = {
        preamble:
          '#include QMK_KEYBOARD_H\n\nconst uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {',
        layoutMacroName: 'LAYOUT',
        layers: [
          {
            index: 0,
            keycodeNames: ['KC_A', 'KC_B', 'MO(1)'],
          },
          {
            index: 1,
            keycodeNames: ['KC_1', 'KC_2', '_______'],
          },
        ],
        postamble: '',
      };

      const result = generateKeymapC(parsed);
      expect(result).toContain('[0] = LAYOUT(');
      expect(result).toContain('[1] = LAYOUT(');
      expect(result).toContain('MO(1)');
      // First layer should have comma after closing paren, second should not
      const lines = result.split('\n');
      const layer0Close = lines.find((l) => l.trim() === '),');
      const layer1Close = lines.find((l) => l.trim() === ')');
      expect(layer0Close).toBeDefined();
      expect(layer1Close).toBeDefined();
    });

    it('generates with postamble', () => {
      const parsed: ParsedKeymap = {
        preamble:
          '#include QMK_KEYBOARD_H\n\nconst uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {',
        layoutMacroName: 'LAYOUT',
        layers: [{ index: 0, keycodeNames: ['KC_A'] }],
        postamble:
          '\n\n#ifdef ENCODER_ENABLE\nbool encoder_update_user(uint8_t index, bool clockwise) {\n    return false;\n}\n#endif\n',
      };

      const result = generateKeymapC(parsed);
      expect(result).toContain('ENCODER_ENABLE');
      expect(result).toContain('encoder_update_user');
    });

    it('handles composite keycodes in output', () => {
      const parsed: ParsedKeymap = {
        preamble:
          '#include QMK_KEYBOARD_H\n\nconst uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {',
        layoutMacroName: 'LAYOUT',
        layers: [
          {
            index: 0,
            keycodeNames: ['LT(1, KC_SPC)', 'MT(MOD_LCTL, KC_A)', 'MO(2)'],
          },
        ],
        postamble: '',
      };

      const result = generateKeymapC(parsed);
      expect(result).toContain('LT(1, KC_SPC)');
      expect(result).toContain('MT(MOD_LCTL, KC_A)');
      expect(result).toContain('MO(2)');
    });
  });

  describe('round-trip: parse → generate → parse', () => {
    const SIMPLE_KEYMAP = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT_ortho_4x4(
        KC_1, KC_2, KC_3, KC_A,
        KC_4, KC_5, KC_6, KC_B,
        KC_7, KC_8, KC_9, KC_C,
        KC_LSFT, KC_0, KC_DEL, KC_ENT
    )
};
`;

    const COMPOSITE_KEYMAP = `#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(
        KC_ESC, LT(1, KC_SPC), MT(MOD_LCTL, KC_A),
        LCTL_T(KC_B), RSFT(KC_C), MO(2)
    )
};
`;

    it('round-trips simple keymap preserving keycode data', () => {
      const parsed1 = parseKeymapC(SIMPLE_KEYMAP);
      expect(parsed1).not.toBeNull();

      const generated = generateKeymapC(parsed1!, 4);
      const parsed2 = parseKeymapC(generated);
      expect(parsed2).not.toBeNull();

      expect(parsed2!.layoutMacroName).toBe(parsed1!.layoutMacroName);
      expect(parsed2!.layers).toHaveLength(parsed1!.layers.length);
      expect(parsed2!.layers[0].keycodeNames).toEqual(
        parsed1!.layers[0].keycodeNames
      );
    });

    it('round-trips composite keymap preserving keycode data', () => {
      const parsed1 = parseKeymapC(COMPOSITE_KEYMAP);
      expect(parsed1).not.toBeNull();

      const generated = generateKeymapC(parsed1!);
      const parsed2 = parseKeymapC(generated);
      expect(parsed2).not.toBeNull();

      expect(parsed2!.layers[0].keycodeNames).toEqual(
        parsed1!.layers[0].keycodeNames
      );
    });

    it('round-trips preserving preamble content', () => {
      const KEYMAP_WITH_PREAMBLE = `// Copyright 2023 QMK
// SPDX-License-Identifier: GPL-2.0-or-later

#include QMK_KEYBOARD_H

#define _BASE 0
#define _LOWER 1

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT(KC_A, KC_B)
};
`;
      const parsed = parseKeymapC(KEYMAP_WITH_PREAMBLE);
      expect(parsed).not.toBeNull();

      const generated = generateKeymapC(parsed!);
      expect(generated).toContain('Copyright 2023 QMK');
      expect(generated).toContain('SPDX-License-Identifier');
      expect(generated).toContain('#define _BASE 0');
      expect(generated).toContain('#define _LOWER 1');

      const reParsed = parseKeymapC(generated);
      expect(reParsed).not.toBeNull();
      expect(reParsed!.preamble).toContain('#define _BASE 0');
      expect(reParsed!.preamble).toContain('#define _LOWER 1');
    });

    it('round-trips preserving postamble content', () => {
      const KEYMAP_WITH_POSTAMBLE = `#include QMK_KEYBOARD_H

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
      const parsed = parseKeymapC(KEYMAP_WITH_POSTAMBLE);
      expect(parsed).not.toBeNull();

      const generated = generateKeymapC(parsed!);
      expect(generated).toContain('ENCODER_ENABLE');
      expect(generated).toContain('encoder_update_user');
      expect(generated).toContain('tap_code(KC_VOLU)');
      expect(generated).toContain('keyboard_post_init_user');
      expect(generated).toContain('rgb_matrix_mode');

      const reParsed = parseKeymapC(generated);
      expect(reParsed).not.toBeNull();
      expect(reParsed!.postamble).toContain('encoder_update_user');
      expect(reParsed!.postamble).toContain('keyboard_post_init_user');
    });
  });
});
