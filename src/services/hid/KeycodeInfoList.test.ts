import { describe, expect, it } from 'vitest';
import { keyInfoList } from './KeycodeInfoList';

describe('keyInfoList', () => {
  describe('UG_* keyword aliases for RGB/Underglow keycodes', () => {
    const expected: Array<{ code: number; ugAlias: string }> = [
      { code: 0x7820, ugAlias: 'ug_togg' },
      { code: 0x7821, ugAlias: 'ug_next' },
      { code: 0x7822, ugAlias: 'ug_prev' },
      { code: 0x7823, ugAlias: 'ug_hueu' },
      { code: 0x7824, ugAlias: 'ug_hued' },
      { code: 0x7825, ugAlias: 'ug_satu' },
      { code: 0x7826, ugAlias: 'ug_satd' },
      { code: 0x7827, ugAlias: 'ug_valu' },
      { code: 0x7828, ugAlias: 'ug_vald' },
      { code: 0x7829, ugAlias: 'ug_spdu' },
      { code: 0x782a, ugAlias: 'ug_spdd' },
    ];

    expected.forEach(({ code, ugAlias }) => {
      it(`code 0x${code.toString(16)} carries '${ugAlias}' as a keyword`, () => {
        const entry = keyInfoList.find(
          (info) => info.keycodeInfo.code === code
        );
        expect(
          entry,
          `keyInfoList must have entry for 0x${code.toString(16)}`
        ).toBeDefined();
        expect(entry!.keycodeInfo.keywords).toContain(ugAlias);
      });
    });

    it('keeps the lowercase UG_* keyword so Autocomplete matches lowercased user input', () => {
      const entry = keyInfoList.find(
        (info) => info.keycodeInfo.code === 0x7820
      );
      expect(entry).toBeDefined();
      // The filterOptions in AutocompleteKeys lowercases the user's input but
      // not the stored keywords; keeping the alias lowercase is what makes
      // search work for "UG_TOGG", "ug_togg", and partial prefixes like "ug".
      const hasLowercaseAlias = entry!.keycodeInfo.keywords.some(
        (kwd) => kwd === kwd.toLowerCase() && kwd.startsWith('ug_')
      );
      expect(hasLowercaseAlias).toBe(true);
    });
  });

  describe('canonical UG_* names and labels for underglow keycodes', () => {
    const expected: Array<{
      code: number;
      long: string;
      short: string;
      label: string;
    }> = [
      { code: 0x7820, long: 'UG_TOGG', short: 'UG_TOGG', label: 'UG Toggle' },
      { code: 0x7821, long: 'UG_NEXT', short: 'UG_NEXT', label: 'UG Mode +' },
      { code: 0x7822, long: 'UG_PREV', short: 'UG_PREV', label: 'UG Mode -' },
      { code: 0x7823, long: 'UG_HUEU', short: 'UG_HUEU', label: 'UG HUE +' },
      { code: 0x7824, long: 'UG_HUED', short: 'UG_HUED', label: 'UG HUE -' },
      { code: 0x7825, long: 'UG_SATU', short: 'UG_SATU', label: 'UG SAT +' },
      { code: 0x7826, long: 'UG_SATD', short: 'UG_SATD', label: 'UG SAT -' },
      {
        code: 0x7827,
        long: 'UG_VALU',
        short: 'UG_VALU',
        label: 'UG Bright +',
      },
      {
        code: 0x7828,
        long: 'UG_VALD',
        short: 'UG_VALD',
        label: 'UG Bright -',
      },
      {
        code: 0x7829,
        long: 'UG_SPDU',
        short: 'UG_SPDU',
        label: 'UG Effect Speed +',
      },
      {
        code: 0x782a,
        long: 'UG_SPDD',
        short: 'UG_SPDD',
        label: 'UG Effect Speed -',
      },
    ];

    expected.forEach(({ code, long, short, label }) => {
      it(`code 0x${code.toString(16)} has canonical UG_* name and UG-prefixed label`, () => {
        const entry = keyInfoList.find(
          (info) => info.keycodeInfo.code === code
        );
        expect(entry).toBeDefined();
        expect(entry!.keycodeInfo.name.long).toBe(long);
        expect(entry!.keycodeInfo.name.short).toBe(short);
        expect(entry!.keycodeInfo.label).toBe(label);
      });
    });

    it('retains legacy RGB_* as a lowercase keyword for backward search', () => {
      const entry = keyInfoList.find(
        (info) => info.keycodeInfo.code === 0x7820
      );
      expect(entry).toBeDefined();
      expect(entry!.keycodeInfo.keywords).toContain('rgb_tog');
    });
  });
});
