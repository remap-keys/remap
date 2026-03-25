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
