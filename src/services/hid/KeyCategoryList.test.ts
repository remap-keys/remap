import { KEY_SUB_CATEGORY_MACRO, KeyCategory } from './KeyCategoryList';

describe('KeyCategoryList', () => {
  describe('macro', () => {
    test('normal', () => {
      const actual = KeyCategory.macro(5, null, 'en-us');
      expect(actual.length).toEqual(5);
      expect(actual[0].code).toEqual(24338);
      expect(actual[1].code).toEqual(24339);
      expect(actual[2].code).toEqual(24340);
      expect(actual[3].code).toEqual(24341);
      expect(actual[4].code).toEqual(24342);
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
          'en-us'
        );
      }).toThrowError();
    });
  });
});
