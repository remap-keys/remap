import { describe, expect, it } from 'vitest';
import { nameToCode, codeToName } from './QmkKeycodeMapper';

describe('QmkKeycodeMapper', () => {
  describe('nameToCode', () => {
    describe('basic keycodes', () => {
      it('converts KC_A to 0x04', () => {
        expect(nameToCode('KC_A')).toBe(0x04);
      });

      it('converts KC_NO to 0x00', () => {
        expect(nameToCode('KC_NO')).toBe(0x00);
      });

      it('converts KC_TRANSPARENT to 0x01', () => {
        expect(nameToCode('KC_TRANSPARENT')).toBe(0x01);
      });

      it('converts short alias XXXXXXX to 0x00', () => {
        expect(nameToCode('XXXXXXX')).toBe(0x00);
      });

      it('converts short alias _______ to 0x01', () => {
        expect(nameToCode('_______')).toBe(0x01);
      });

      it('converts KC_SPACE', () => {
        expect(nameToCode('KC_SPACE')).not.toBeNull();
      });

      it('converts KC_ENTER', () => {
        expect(nameToCode('KC_ENTER')).not.toBeNull();
      });

      it('converts KC_ESCAPE / KC_ESC', () => {
        const escCode = nameToCode('KC_ESCAPE');
        expect(escCode).not.toBeNull();
      });

      it('converts KC_LCTL', () => {
        expect(nameToCode('KC_LCTL')).not.toBeNull();
      });
    });

    describe('layer keycodes', () => {
      it('converts MO(0)', () => {
        const code = nameToCode('MO(0)');
        expect(code).not.toBeNull();
        expect(codeToName(code!)).toBe('MO(0)');
      });

      it('converts MO(1)', () => {
        const code = nameToCode('MO(1)');
        expect(code).not.toBeNull();
        expect(codeToName(code!)).toBe('MO(1)');
      });

      it('converts TG(2)', () => {
        const code = nameToCode('TG(2)');
        expect(code).not.toBeNull();
        expect(codeToName(code!)).toBe('TG(2)');
      });

      it('converts TO(3)', () => {
        const code = nameToCode('TO(3)');
        expect(code).not.toBeNull();
        expect(codeToName(code!)).toBe('TO(3)');
      });

      it('converts DF(0)', () => {
        const code = nameToCode('DF(0)');
        expect(code).not.toBeNull();
        expect(codeToName(code!)).toBe('DF(0)');
      });

      it('converts TT(1)', () => {
        const code = nameToCode('TT(1)');
        expect(code).not.toBeNull();
        expect(codeToName(code!)).toBe('TT(1)');
      });

      it('converts OSL(2)', () => {
        const code = nameToCode('OSL(2)');
        expect(code).not.toBeNull();
        expect(codeToName(code!)).toBe('OSL(2)');
      });
    });

    describe('layer tap keycodes', () => {
      it('converts LT(1, KC_SPACE)', () => {
        const code = nameToCode('LT(1, KC_SPACE)');
        expect(code).not.toBeNull();
      });

      it('converts LT(2, KC_A)', () => {
        const code = nameToCode('LT(2, KC_A)');
        expect(code).not.toBeNull();
        const name = codeToName(code!);
        expect(name).toContain('LT(2');
        expect(name).toContain('KC_A');
      });

      it('converts LT without spaces: LT(0,KC_ESC)', () => {
        const code = nameToCode('LT(0,KC_ESC)');
        expect(code).not.toBeNull();
      });
    });

    describe('mod tap keycodes', () => {
      it('converts MT(MOD_LCTL, KC_A)', () => {
        const code = nameToCode('MT(MOD_LCTL, KC_A)');
        expect(code).not.toBeNull();
      });

      it('converts LCTL_T(KC_A)', () => {
        const code = nameToCode('LCTL_T(KC_A)');
        expect(code).not.toBeNull();
      });

      it('converts RSFT_T(KC_SPACE)', () => {
        const code = nameToCode('RSFT_T(KC_SPACE)');
        expect(code).not.toBeNull();
      });
    });

    describe('modifier wrapper keycodes', () => {
      it('converts LCTL(KC_A)', () => {
        const code = nameToCode('LCTL(KC_A)');
        expect(code).not.toBeNull();
      });

      it('converts RSFT(KC_B)', () => {
        const code = nameToCode('RSFT(KC_B)');
        expect(code).not.toBeNull();
      });

      it('converts HYPR(KC_A)', () => {
        const code = nameToCode('HYPR(KC_A)');
        expect(code).not.toBeNull();
      });
    });

    describe('one shot keycodes', () => {
      it('converts OSM(MOD_LSFT)', () => {
        const code = nameToCode('OSM(MOD_LSFT)');
        expect(code).not.toBeNull();
        expect(codeToName(code!)).toBe('OSM(MOD_LSFT)');
      });
    });

    describe('tap dance', () => {
      it('converts TD(0)', () => {
        const code = nameToCode('TD(0)');
        expect(code).not.toBeNull();
        expect(codeToName(code!)).toBe('TD(0)');
      });
    });

    describe('swap hands', () => {
      it('converts SH_TOGGLE', () => {
        const code = nameToCode('SH_TOGGLE');
        expect(code).not.toBeNull();
        expect(codeToName(code!)).toBe('SH_TOGGLE');
      });

      it('converts SH_T(KC_A)', () => {
        const code = nameToCode('SH_T(KC_A)');
        expect(code).not.toBeNull();
      });
    });

    describe('layer mod', () => {
      it('converts LM(1, MOD_LCTL)', () => {
        const code = nameToCode('LM(1, MOD_LCTL)');
        expect(code).not.toBeNull();
      });
    });

    describe('shifted keycode aliases', () => {
      it('converts KC_EXLM (shifted KC_1)', () => {
        const code = nameToCode('KC_EXLM');
        expect(code).not.toBeNull();
        expect(codeToName(code!)).toBe('KC_EXLM');
      });

      it('converts KC_AT (shifted KC_2)', () => {
        const code = nameToCode('KC_AT');
        expect(code).not.toBeNull();
        expect(codeToName(code!)).toBe('KC_AT');
      });

      it('converts KC_HASH (shifted KC_3)', () => {
        const code = nameToCode('KC_HASH');
        expect(code).not.toBeNull();
      });

      it('converts KC_DLR (shifted KC_4)', () => {
        expect(nameToCode('KC_DLR')).not.toBeNull();
      });

      it('converts KC_PERC (shifted KC_5)', () => {
        expect(nameToCode('KC_PERC')).not.toBeNull();
      });

      it('converts KC_CIRC (shifted KC_6)', () => {
        expect(nameToCode('KC_CIRC')).not.toBeNull();
      });

      it('converts KC_AMPR (shifted KC_7)', () => {
        expect(nameToCode('KC_AMPR')).not.toBeNull();
      });

      it('converts KC_ASTR (shifted KC_8)', () => {
        expect(nameToCode('KC_ASTR')).not.toBeNull();
      });

      it('converts KC_LPRN (shifted KC_9)', () => {
        expect(nameToCode('KC_LPRN')).not.toBeNull();
      });

      it('converts KC_RPRN (shifted KC_0)', () => {
        expect(nameToCode('KC_RPRN')).not.toBeNull();
      });

      it('converts KC_UNDS (shifted KC_MINUS)', () => {
        expect(nameToCode('KC_UNDS')).not.toBeNull();
      });

      it('converts KC_PLUS (shifted KC_EQUAL)', () => {
        expect(nameToCode('KC_PLUS')).not.toBeNull();
      });

      it('converts KC_LCBR (shifted KC_LEFT_BRACKET)', () => {
        expect(nameToCode('KC_LCBR')).not.toBeNull();
      });

      it('converts KC_RCBR (shifted KC_RIGHT_BRACKET)', () => {
        expect(nameToCode('KC_RCBR')).not.toBeNull();
      });

      it('converts KC_PIPE (shifted KC_BACKSLASH)', () => {
        expect(nameToCode('KC_PIPE')).not.toBeNull();
      });

      it('converts KC_TILD (shifted KC_GRAVE)', () => {
        expect(nameToCode('KC_TILD')).not.toBeNull();
      });

      it('converts KC_COLN (shifted KC_SEMICOLON)', () => {
        expect(nameToCode('KC_COLN')).not.toBeNull();
      });

      it('converts KC_DQUO (shifted KC_QUOTE)', () => {
        expect(nameToCode('KC_DQUO')).not.toBeNull();
      });

      it('converts KC_LABK (shifted KC_COMMA)', () => {
        expect(nameToCode('KC_LABK')).not.toBeNull();
      });

      it('converts KC_RABK (shifted KC_DOT)', () => {
        expect(nameToCode('KC_RABK')).not.toBeNull();
      });

      it('converts KC_QUES (shifted KC_SLASH)', () => {
        expect(nameToCode('KC_QUES')).not.toBeNull();
      });

      it('converts long aliases like KC_EXCLAIM', () => {
        const short = nameToCode('KC_EXLM');
        const long = nameToCode('KC_EXCLAIM');
        expect(long).toBe(short);
      });

      it('converts long aliases like KC_LEFT_PAREN', () => {
        const short = nameToCode('KC_LPRN');
        const long = nameToCode('KC_LEFT_PAREN');
        expect(long).toBe(short);
      });
    });

    describe('UG_* keycode aliases', () => {
      it('converts UG_TOGG (alias for RGB_TOG)', () => {
        const ugCode = nameToCode('UG_TOGG');
        const rgbCode = nameToCode('RGB_TOG');
        expect(ugCode).not.toBeNull();
        expect(ugCode).toBe(rgbCode);
      });

      it('converts UG_NEXT (alias for RGB_MODE_FORWARD)', () => {
        const ugCode = nameToCode('UG_NEXT');
        const rgbCode = nameToCode('RGB_MODE_FORWARD');
        expect(ugCode).not.toBeNull();
        expect(ugCode).toBe(rgbCode);
      });

      it('converts UG_HUEU (alias for RGB_HUI)', () => {
        expect(nameToCode('UG_HUEU')).toBe(nameToCode('RGB_HUI'));
      });

      it('converts UG_HUED (alias for RGB_HUD)', () => {
        expect(nameToCode('UG_HUED')).toBe(nameToCode('RGB_HUD'));
      });

      it('converts UG_SATU (alias for RGB_SAI)', () => {
        expect(nameToCode('UG_SATU')).toBe(nameToCode('RGB_SAI'));
      });

      it('converts UG_SATD (alias for RGB_SAD)', () => {
        expect(nameToCode('UG_SATD')).toBe(nameToCode('RGB_SAD'));
      });

      it('converts UG_VALU (alias for RGB_VAI)', () => {
        expect(nameToCode('UG_VALU')).toBe(nameToCode('RGB_VAI'));
      });

      it('converts UG_VALD (alias for RGB_VAD)', () => {
        expect(nameToCode('UG_VALD')).toBe(nameToCode('RGB_VAD'));
      });

      it('converts QK_UNDERGLOW_TOGGLE long name', () => {
        expect(nameToCode('QK_UNDERGLOW_TOGGLE')).toBe(nameToCode('RGB_TOG'));
      });

      it('converts UG_PREV', () => {
        expect(nameToCode('UG_PREV')).toBe(nameToCode('RGB_MODE_REVERSE'));
      });

      it('converts UG_SPDU', () => {
        expect(nameToCode('UG_SPDU')).toBe(nameToCode('RGB_SPI'));
      });

      it('converts UG_SPDD', () => {
        expect(nameToCode('UG_SPDD')).toBe(nameToCode('RGB_SPD'));
      });
    });

    describe('edge cases', () => {
      it('returns null for unknown keycode', () => {
        expect(nameToCode('NONEXISTENT')).toBeNull();
      });

      it('handles whitespace', () => {
        expect(nameToCode('  KC_A  ')).toBe(0x04);
      });

      it('handles LT with spaces', () => {
        const code1 = nameToCode('LT(1, KC_A)');
        const code2 = nameToCode('LT(1,KC_A)');
        expect(code1).toBe(code2);
      });
    });
  });

  describe('codeToName', () => {
    describe('basic keycodes', () => {
      it('converts 0x04 to KC_A', () => {
        expect(codeToName(0x04)).toBe('KC_A');
      });

      it('converts 0x00 to KC_NO', () => {
        expect(codeToName(0x00)).toBe('KC_NO');
      });

      it('converts 0x01 to KC_TRANSPARENT', () => {
        expect(codeToName(0x01)).toBe('KC_TRANSPARENT');
      });
    });

    describe('layer keycodes', () => {
      it('generates MO(n) format', () => {
        const code = nameToCode('MO(3)');
        expect(codeToName(code!)).toBe('MO(3)');
      });

      it('generates TG(n) format', () => {
        const code = nameToCode('TG(1)');
        expect(codeToName(code!)).toBe('TG(1)');
      });
    });

    describe('composite keycodes', () => {
      it('generates LT format', () => {
        const code = nameToCode('LT(1, KC_SPACE)');
        expect(code).not.toBeNull();
        const name = codeToName(code!);
        expect(name).toMatch(/^LT\(1, KC_/);
      });

      it('generates MT format', () => {
        const code = nameToCode('MT(MOD_LCTL, KC_A)');
        expect(code).not.toBeNull();
        const name = codeToName(code!);
        expect(name).toMatch(/^MT\(MOD_LCTL, KC_A\)$/);
      });
    });

    describe('round-trip consistency', () => {
      const testCases = [
        'KC_A',
        'KC_NO',
        'MO(1)',
        'TG(2)',
        'TO(0)',
        'DF(1)',
        'TT(3)',
        'OSL(2)',
        'OSM(MOD_LSFT)',
        'TD(0)',
        'SH_TOGGLE',
      ];

      testCases.forEach((name) => {
        it(`round-trips ${name}`, () => {
          const code = nameToCode(name);
          expect(code).not.toBeNull();
          expect(codeToName(code!)).toBe(name);
        });
      });
    });
  });
});
