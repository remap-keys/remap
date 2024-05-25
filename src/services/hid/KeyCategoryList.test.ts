import { describe, expect, test } from 'vitest';
import { KEY_SUB_CATEGORY_MACRO, KeyCategory } from './KeyCategoryList';

describe('KeyCategoryList', () => {
  describe('macro', () => {
    test('normal', () => {
      const actual = KeyCategory.macro(5, null, 'en-us');
      for (let i = 0; i < 5; i++) {
        expect(actual[i].code).toEqual(i + 30464);
      }
    });

    test('zero', () => {
      const actual = KeyCategory.macro(0, null, 'en-us');
      expect(actual.length).toEqual(0);
    });

    test('over defined macro count', () => {
      expect(() => {
        KeyCategory.macro(
          KEY_SUB_CATEGORY_MACRO.codes.length + 1,
          null,
          'en-us',
        );
      }).toThrowError();
    });
  });
});
