import { parseRemapLayoutOptions } from './RemapLayoutOptionsParser';
import type { QmkLayoutKey } from './QmkLayoutParser';

describe('parseRemapLayoutOptions', () => {
  describe('absence handling', () => {
    test('returns data: null when the JSON is not an object', () => {
      const result = parseRemapLayoutOptions({ keyboardJson: null });
      expect(result).toEqual({ success: true, data: null });
    });

    test('returns data: null when the remap field is absent', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: { keyboard_name: 'K' },
      });
      expect(result).toEqual({ success: true, data: null });
    });

    test('returns data: null when remap.layout_options is absent', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: { remap: {} },
      });
      expect(result).toEqual({ success: true, data: null });
    });

    test('rejects a non-object remap field', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: { remap: 'nope' },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(/remap must be an object/);
      }
    });

    test('rejects a non-object remap.layout_options', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: { remap: { layout_options: 'nope' } },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(
          /remap\.layout_options must be an object/
        );
      }
    });
  });

  describe('valid parsing', () => {
    test('accepts a minimal, well-formed 2-choice Split Backspace layout', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['Split Backspace', 'Off', 'On']],
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [{ matrix: [0, 13], x: 13, y: 0, w: 2 }],
                },
                {
                  option: 0,
                  choice: 1,
                  keys: [
                    { matrix: [0, 13], x: 13, y: 0 },
                    { matrix: [0, 14], x: 14, y: 0 },
                  ],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          labels: [['Split Backspace', 'Off', 'On']],
          variants: [
            {
              option: 0,
              choice: 0,
              keys: [{ matrix: [0, 13], x: 13, y: 0, w: 2 }],
            },
            {
              option: 0,
              choice: 1,
              keys: [
                { matrix: [0, 13], x: 13, y: 0 },
                { matrix: [0, 14], x: 14, y: 0 },
              ],
            },
          ],
        });
      }
    });

    test('accepts a 1-element (implicit Off/On) label with two variants', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['ISO Enter']],
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [{ matrix: [0, 13], x: 13, y: 0 }],
                },
                {
                  option: 0,
                  choice: 1,
                  keys: [{ matrix: [0, 14], x: 14, y: 0 }],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(true);
    });

    test('accepts a 3-choice option with three variants', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['Bottom Row', 'Standard', 'Split', 'Wide']],
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [{ matrix: [3, 5], x: 5, y: 3, w: 6 }],
                },
                {
                  option: 0,
                  choice: 1,
                  keys: [
                    { matrix: [3, 5], x: 5, y: 3, w: 3 },
                    { matrix: [3, 8], x: 8, y: 3, w: 3 },
                  ],
                },
                {
                  option: 0,
                  choice: 2,
                  keys: [{ matrix: [3, 5], x: 5, y: 3, w: 6 }],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(true);
    });

    test('preserves optional key fields (w, h, r, rx, ry)', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['Rot']],
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [
                    {
                      matrix: [0, 0],
                      x: 0,
                      y: 0,
                      w: 1.5,
                      h: 1.25,
                      r: 15,
                      rx: 0.5,
                      ry: 0.5,
                    },
                  ],
                },
                {
                  option: 0,
                  choice: 1,
                  keys: [{ matrix: [0, 1], x: 1, y: 0 }],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.variants[0].keys[0]).toEqual({
          matrix: [0, 0],
          x: 0,
          y: 0,
          w: 1.5,
          h: 1.25,
          r: 15,
          rx: 0.5,
          ry: 0.5,
        });
      }
    });
  });

  describe('labels validation', () => {
    test('rejects a 2-element label as ambiguous', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['Split BS', 'Nope']],
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [{ matrix: [0, 0], x: 0, y: 0 }],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(/length 2, which is ambiguous/);
      }
    });

    test('rejects an empty label entry', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [[]],
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [{ matrix: [0, 0], x: 0, y: 0 }],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(
          /must be a non-empty array of strings/
        );
      }
    });

    test('rejects labels that is not an array', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: 'nope',
              variants: [],
            },
          },
        },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(
          /remap\.layout_options\.labels must be an array/
        );
      }
    });
  });

  describe('variants validation', () => {
    test('rejects empty variants', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['Split BS']],
              variants: [],
            },
          },
        },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(/variants must not be empty/);
      }
    });

    test('rejects variants[].keys being empty', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['Split BS']],
              variants: [{ option: 0, choice: 0, keys: [] }],
            },
          },
        },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(/keys must contain at least one key/);
      }
    });

    test('rejects variants[].option out of range', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['Split BS']],
              variants: [
                {
                  option: 1,
                  choice: 0,
                  keys: [{ matrix: [0, 0], x: 0, y: 0 }],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(/option \(1\) is out of range/);
      }
    });

    test('rejects variants[].choice exceeding the option range', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['ISO Enter']], // implicit Off/On, max choice = 1
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [{ matrix: [0, 0], x: 0, y: 0 }],
                },
                {
                  option: 0,
                  choice: 2, // out of range
                  keys: [{ matrix: [0, 1], x: 1, y: 0 }],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(
          /choice \(2\) exceeds the max choice \(1\)/
        );
      }
    });

    test('rejects a key with a non-array matrix', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['Split BS']],
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [{ matrix: 'nope', x: 0, y: 0 }],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(/matrix must be a two-element array/);
      }
    });

    test('rejects a key missing x or y', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['Split BS']],
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [{ matrix: [0, 0] }],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(/x and .* must be numbers/);
      }
    });
  });

  describe('choice coverage', () => {
    test('rejects when a required choice is missing (implicit Off/On)', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['Split BS']], // needs both choice 0 and 1
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [{ matrix: [0, 0], x: 0, y: 0 }],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(/is missing variants for choice 1/);
      }
    });

    test('rejects when a required choice is missing (explicit 3-choice)', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['Bottom', 'A', 'B', 'C']], // needs choices 0, 1, 2
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [{ matrix: [0, 0], x: 0, y: 0 }],
                },
                {
                  option: 0,
                  choice: 2,
                  keys: [{ matrix: [0, 1], x: 1, y: 0 }],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(/is missing variants for choice 1/);
      }
    });
  });

  describe('matrix uniqueness', () => {
    test('rejects when a variant key shares a matrix with LAYOUT_default', () => {
      const layoutDefaultKeys: QmkLayoutKey[] = [
        { matrix: [0, 0], x: 0, y: 0 },
      ];
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['ISO Enter']],
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [{ matrix: [0, 0], x: 0, y: 0 }],
                },
                {
                  option: 0,
                  choice: 1,
                  keys: [{ matrix: [0, 1], x: 1, y: 0 }],
                },
              ],
            },
          },
        },
        layoutDefaultKeys,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(
          /matrix 0,0 also appears in the default layout/
        );
      }
    });

    test('rejects when the same matrix appears twice for the same (option, choice)', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['ISO Enter']],
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [
                    { matrix: [0, 0], x: 0, y: 0 },
                    { matrix: [0, 0], x: 0, y: 0 },
                  ],
                },
                {
                  option: 0,
                  choice: 1,
                  keys: [{ matrix: [0, 1], x: 1, y: 0 }],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toMatch(
          /matrix 0,0 is duplicated for option 0 choice 0/
        );
      }
    });

    test('allows the same matrix across different (option, choice) pairs', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['ISO Enter']],
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [{ matrix: [0, 0], x: 0, y: 0 }],
                },
                {
                  option: 0,
                  choice: 1,
                  keys: [{ matrix: [0, 0], x: 0, y: 0, w: 2 }],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(true);
    });

    test('skips the LAYOUT_default cross-check when layoutDefaultKeys is omitted', () => {
      const result = parseRemapLayoutOptions({
        keyboardJson: {
          remap: {
            layout_options: {
              labels: [['ISO Enter']],
              variants: [
                {
                  option: 0,
                  choice: 0,
                  keys: [{ matrix: [0, 0], x: 0, y: 0 }],
                },
                {
                  option: 0,
                  choice: 1,
                  keys: [{ matrix: [0, 0], x: 0, y: 0, w: 2 }],
                },
              ],
            },
          },
        },
      });
      expect(result.success).toBe(true);
    });
  });
});

export {};
