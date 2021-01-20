import {
  SchemaValidateError,
  validateKeyboardDefinitionSchema,
} from './Validator';
import actualSchema from './assets/keyboard-definition-schema.json';

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
          pattern: '^[0-9]+,[0-9]+(\n.*){0,11}?$',
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
      test.each(['0,1', '2,10', '01,10', '1,0\n\n\n10,1'])(
        'success',
        (label) => {
          const obj = { name: 'hoge', label: label };
          const result = validateKeyboardDefinitionSchema(obj, schema);
          expect(result.valid).toBeTruthy();
        }
      );

      test.each(['', '0', 'a,0', '0.1', '10.20'])(
        'invalid string pattern',
        (label) => {
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
        }
      );
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
                          pattern: '^[0-9]+,[0-9]+(\n.*){0,11}?$',
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
            ['1.0', '1,1'],
          ],
        },
      };
      const result = validateKeyboardDefinitionSchema(obj, schema);
      const expected: SchemaValidateError = {
        keyword: 'pattern',
        dataPath: '/layouts/keymap/1/0',
        schemaPath:
          '#/properties/layouts/properties/keymap/items/anyOf/0/items/anyOf/0/pattern',
        message: `should match pattern "${
          schema.properties.layouts.properties.keymap.items.anyOf[0].items!
            .anyOf[0].pattern
        }"`,
        params: {
          pattern: schema.properties.layouts.properties.keymap.items.anyOf[0]
            .items!.anyOf[0].pattern,
        },
      };

      expect(result.errors![0]).toEqual(expected);
    });
  });
});
