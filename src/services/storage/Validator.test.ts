import { describe, expect, test } from 'vitest';
import {
  SchemaValidateError,
  validateKeyboardDefinitionSchema,
} from './Validator';

const KEYLABEL_LEGENDS_PATTERN =
  '^(([1-9][0-9]*|0),([1-9][0-9]*|0))?((\n.*){2}?\n([1-9][0-9]*|0),([1-9][0-9]*|0)(\n.*){0,8}?|(\n.*){0,2}?)?$';

describe('Validator', () => {
  describe('validateDetailKeyboardDefinition', () => {
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        label: {
          type: 'string',
          pattern: KEYLABEL_LEGENDS_PATTERN,
        },
      },
      required: ['name'],
    };
    test('success', () => {
      const obj = { name: 'hoge' };
      const result = validateKeyboardDefinitionSchema(obj, schema);
      expect(result.valid).toBeTruthy();
    });

    test.each([0, NaN, null, {}])('invalid type', (value) => {
      const obj = { name: value };
      const result = validateKeyboardDefinitionSchema(obj, schema);
      expect(result.errors![0].keyword).toEqual('type');
      expect(result.errors![0].dataPath).toEqual('/name');
      expect(result.errors![0].schemaPath).toEqual('#/properties/name/type');
      expect(result.errors![0].params.type).toEqual('string');
    });

    test.each([{ names: 'hoge' }, { hoge: 'huga' }])(
      'invalid property',
      (obj) => {
        const result = validateKeyboardDefinitionSchema(obj, schema);
        expect(result.errors![0].keyword).toEqual('required');
        expect(result.errors![0].dataPath).toEqual('/');
        expect(result.errors![0].schemaPath).toEqual('#/required');
        expect(result.errors![0].params.missingProperty).toEqual('name');
      },
    );

    describe('string pattern', () => {
      test.each([
        '0,1',
        '2,10',
        '1,10',
        '0,0\n',
        '0,0\n1',
        '0,0\na\nb',
        '1,0\n\n\n10,1',
        '0,1\na\nb\n0,0',
        '0,1\na\nb\n0,123',
        '0,1\n1\n2\n2,0\n4',
        '0,1\n1\n2\n2,0\n4\n5',
        '0,1\n1\n2\n2,0\n4\n5\n6\n7\n8\n9\n10\n11',
        '\n',
        '\n1',
        '\na\nb',
        '\n\n\n10,1',
        '\na\nb\n0,0',
        '\na\nb\n0,123',
        '\n1\n2\n2,0\n4',
        '\n1\n2\n2,0\n4\n5',
        '\n1\n2\n2,0\n4\n5\n6\n7\n8\n9\n10\n11',
      ])('success', (label) => {
        const obj = { name: 'hoge', label: label };
        const result = validateKeyboardDefinitionSchema(obj, schema);
        expect(result.valid).toBeTruthy();
      });

      test.each([
        '0',
        'a,0',
        '0.1',
        '10.20',
        '01,0',
        '0,02',
        '0,0\n1\n2\n',
        '0,0\n1\n2\n3',
        '0,0\n1\n2\n04,0',
        '0,0\n1\n2\n0,04',
        '0,0\n1\n2\n-,0',
        '0,0\n1\n2\n3,0\n4\n5\n6\n7\n8\n9\n10\n11\n',
        '0,0\n1\n2\n3,0\n4\n5\n6\n7\n8\n9\n10\n11\n12',
      ])('invalid string pattern', (label) => {
        const obj = { name: 'hoge', label: label };
        const result = validateKeyboardDefinitionSchema(obj, schema);
        expect(result.errors![0].keyword).toEqual('pattern');
        expect(result.errors![0].dataPath).toEqual('/label');
        expect(result.errors![0].schemaPath).toEqual(
          '#/properties/label/pattern',
        );
        expect(result.errors![0].params.pattern).toEqual(
          schema.properties.label.pattern,
        );
      });
    });
  });

  describe('keymap', () => {
    const schema = {
      type: 'object',
      properties: {
        layouts: {
          type: 'object',
          properties: {
            keymap: {
              type: 'array',
              items: {
                anyOf: [
                  {
                    type: 'array',
                    items: {
                      anyOf: [
                        {
                          type: 'string',
                          pattern: KEYLABEL_LEGENDS_PATTERN,
                        },
                        { type: 'object' },
                      ],
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                      },
                      author: {
                        type: 'string',
                      },
                    },
                    required: ['name'],
                  },
                ],
              },
            },
          },
        },
      },
    };
    test('success', () => {
      const obj = {
        layouts: {
          keymap: [
            ['0,1', { x: 1, y: 0 }, '0,2\n\n\n0,0'],
            ['1,0', '1,1', '1,2'],
          ],
        },
      };
      const result = validateKeyboardDefinitionSchema(obj, schema);
      expect(result.valid).toBeTruthy();
    });

    test('invalid type', () => {
      const obj = {
        layouts: {
          keymap: [[0, { x: 1, y: 0 }, '0,2\n\n\n0,0']],
        },
      };
      const result = validateKeyboardDefinitionSchema(obj, schema);
      const expected: SchemaValidateError = {
        keyword: 'type',
        dataPath: '/layouts/keymap/0/0',
        schemaPath:
          '#/properties/layouts/properties/keymap/items/anyOf/0/items/anyOf/0/type',
        message: `<strong>0</strong> should be string`,
        params: {
          type: 'string',
        },
      };
      expect(result.errors![0]).toEqual(expected);
    });

    test('invalid pattern', () => {
      const obj = {
        layouts: {
          keymap: [
            ['0,0', { x: 1, y: 0 }, '0,1\n\n\n0,0'],
            ['1,0', '1.1'],
          ],
        },
      };
      const result = validateKeyboardDefinitionSchema(obj, schema);
      expect(result.errors![0].keyword).toEqual('pattern');
      expect(result.errors![0].dataPath).toEqual('/layouts/keymap/1/1');
      expect(result.errors![0].schemaPath).toEqual(
        '#/properties/layouts/properties/keymap/items/anyOf/0/items/anyOf/0/pattern',
      );
      expect(result.errors![0].params.pattern).toEqual(
        schema.properties.layouts.properties.keymap.items!.anyOf[0].items!
          .anyOf[0].pattern,
      );
    });

    describe('multi points error', () => {
      const schema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          matrix: {
            type: 'object',
            properties: {
              rows: {
                type: 'integer',
                minimum: 0,
              },
              cols: {
                type: 'integer',
                minimum: 0,
              },
            },
            required: ['rows', 'cols'],
          },
          layouts: {
            type: 'object',
            properties: {
              keymap: {
                type: 'array',
                items: {
                  anyOf: [
                    {
                      type: 'array',
                      items: {
                        anyOf: [
                          {
                            type: 'string',
                            pattern: KEYLABEL_LEGENDS_PATTERN,
                          },
                          { type: 'object' },
                        ],
                      },
                    },
                    {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                        },
                        author: {
                          type: 'string',
                        },
                      },
                      required: ['name'],
                    },
                  ],
                },
              },
            },
          },
        },
      };
      test('invalid type, required and pattern should be checked the first error ONLY', () => {
        const obj = {
          name: 123, // INVALID(type)
          matrix: {
            rows: 8, // INVALID(required)
          },
          layouts: {
            keymap: [['0,0', { x: 1, y: 0 }, '0.1']], // INVALID(pattern)
          },
        };
        const result = validateKeyboardDefinitionSchema(obj, schema);

        expect(result.errors!).toEqual([
          {
            dataPath: '/name',
            keyword: 'type',
            message: '<strong>123</strong> should be string',
            params: { type: 'string' },
            schemaPath: '#/properties/name/type',
          },
        ]);
      });
    });
  });
});
