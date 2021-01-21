import {
  SchemaValidateError,
  validateKeyboardDefinitionSchema,
} from './Validator';
import actualSchema from './assets/keyboard-definition-schema.json';

const KEYLABEL_LEGENDS_PATTERN =
  '^([1-9][0-9]*|0),([1-9][0-9]*|0)((\n.*){2}?\n([1-9][0-9]*|0),([1-9][0-9]*|0)(\n.*){0,8}?|(\n.*){0,2}?)?$';

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
      const expected: SchemaValidateError = {
        keyword: 'type',
        dataPath: '/name',
        schemaPath: '#/properties/name/type',
        message: 'should be string',
        params: {
          type: 'string',
        },
      };
      expect(result.errors![0]).toEqual(expected);
    });

    test.each([{ names: 'hoge' }, { hoge: 'huga' }])(
      'invalid property',
      (obj) => {
        const result = validateKeyboardDefinitionSchema(obj, schema);
        const expected: SchemaValidateError = {
          keyword: 'required',
          dataPath: '',
          schemaPath: '#/required',
          message: "should have required property 'name'",
          params: {
            missingProperty: 'name',
          },
        };
        expect(result.errors![0]).toEqual(expected);
      }
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
      ])('success', (label) => {
        const obj = { name: 'hoge', label: label };
        const result = validateKeyboardDefinitionSchema(obj, schema);
        expect(result.valid).toBeTruthy();
      });

      test.each([
        '',
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
        const expected: SchemaValidateError = {
          keyword: 'pattern',
          dataPath: '/label',
          schemaPath: '#/properties/label/pattern',
          message: `should match pattern "${schema.properties.label.pattern}"`,
          params: {
            pattern: schema.properties.label.pattern,
          },
        };
        expect(result.errors![0]).toEqual(expected);
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
        message: `should be string`,
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
      const expected: SchemaValidateError = {
        keyword: 'pattern',
        dataPath: '/layouts/keymap/1/1',
        schemaPath:
          '#/properties/layouts/properties/keymap/items/anyOf/0/items/anyOf/0/pattern',
        message: `should match pattern "${
          schema.properties.layouts.properties.keymap.items!.anyOf[0].items!
            .anyOf[0].pattern
        }"`,
        params: {
          pattern: schema.properties.layouts.properties.keymap.items!.anyOf[0]
            .items!.anyOf[0].pattern,
        },
      };
      expect(result.errors![0]).toEqual(expected);
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
      test('invalid type, required and pattern', () => {
        const obj = {
          name: '123',
          matrix: {
            rows: 8,
            cols: 10,
          },
          layouts: {
            keymap: [['0,0', { x: 1, y: 0 }, '0.1']],
          },
        };
        const result = validateKeyboardDefinitionSchema(obj, schema);

        expect(result.errors!).toEqual({});
      });
    });
  });
});
