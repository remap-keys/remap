import { KEY_SIZE } from '../../components/configure/keycap/Keycap';
import {
  parseQmkKeyboardJson,
  qmkLayoutKeyToKeyModel,
  qmkLayoutToKeyModels,
  getLayoutViewContent,
  QmkLayoutKey,
} from './QmkLayoutParser';

describe('qmkLayoutKeyToKeyModel', () => {
  test('converts a basic 1u key', () => {
    const key: QmkLayoutKey = { matrix: [0, 0], x: 0, y: 0 };
    const model = qmkLayoutKeyToKeyModel(key);

    expect(model.pos).toBe('0,0');
    expect(model.left).toBe(0);
    expect(model.top).toBe(0);
    expect(model.width).toBe(KEY_SIZE);
    expect(model.height).toBe(KEY_SIZE);
    expect(model.color).toBe('#cccccc');
    expect(model.rotate).toBe(0);
    expect(model.encoderId).toBeNull();
  });

  test('converts a key with position offset', () => {
    const key: QmkLayoutKey = { matrix: [1, 3], x: 3, y: 1 };
    const model = qmkLayoutKeyToKeyModel(key);

    expect(model.pos).toBe('1,3');
    expect(model.left).toBe(3 * KEY_SIZE);
    expect(model.top).toBe(1 * KEY_SIZE);
  });

  test('converts a key with custom width and height', () => {
    const key: QmkLayoutKey = { matrix: [0, 0], x: 0, y: 0, w: 1.5, h: 2 };
    const model = qmkLayoutKeyToKeyModel(key);

    expect(model.width).toBe(1.5 * KEY_SIZE);
    expect(model.height).toBe(2 * KEY_SIZE);
    expect(model.w).toBe(1.5);
    expect(model.h).toBe(2);
  });

  test('converts a key with rotation', () => {
    const key: QmkLayoutKey = {
      matrix: [0, 0],
      x: 2,
      y: 1,
      r: 15,
      rx: 2,
      ry: 0,
    };
    const model = qmkLayoutKeyToKeyModel(key);

    expect(model.rotate).toBe(15);
    expect(model.originLeft).toBe(2 * KEY_SIZE);
    expect(model.originTop).toBe(0);
  });
});

describe('qmkLayoutToKeyModels', () => {
  test('converts an array of QMK layout keys', () => {
    const layout: QmkLayoutKey[] = [
      { matrix: [0, 0], x: 0, y: 0 },
      { matrix: [0, 1], x: 1, y: 0 },
      { matrix: [1, 0], x: 0, y: 1 },
      { matrix: [1, 1], x: 1, y: 1 },
    ];
    const models = qmkLayoutToKeyModels(layout);

    expect(models).toHaveLength(4);
    expect(models[0].pos).toBe('0,0');
    expect(models[1].pos).toBe('0,1');
    expect(models[2].pos).toBe('1,0');
    expect(models[3].pos).toBe('1,1');
  });
});

describe('getLayoutViewContent', () => {
  test('computes bounding box for a 2x2 layout', () => {
    const layout: QmkLayoutKey[] = [
      { matrix: [0, 0], x: 0, y: 0 },
      { matrix: [0, 1], x: 1, y: 0 },
      { matrix: [1, 0], x: 0, y: 1 },
      { matrix: [1, 1], x: 1, y: 1 },
    ];
    const models = qmkLayoutToKeyModels(layout);
    const content = getLayoutViewContent(models);

    expect(content.keyModels).toHaveLength(4);
    expect(content.width).toBe(2 * KEY_SIZE);
    expect(content.height).toBe(2 * KEY_SIZE);
    expect(content.left).toBe(0);
    expect(content.top).toBe(0);
  });

  test('handles keys with custom sizes in bounding box', () => {
    const layout: QmkLayoutKey[] = [
      { matrix: [0, 0], x: 0, y: 0, w: 2.25 },
      { matrix: [0, 1], x: 2.25, y: 0 },
    ];
    const models = qmkLayoutToKeyModels(layout);
    const content = getLayoutViewContent(models);

    expect(content.width).toBe(3.25 * KEY_SIZE);
    expect(content.height).toBe(KEY_SIZE);
  });
});

describe('parseQmkKeyboardJson', () => {
  test('parses a keyboard.json with a single layout', () => {
    const json = JSON.stringify({
      keyboard_name: 'Test',
      layouts: {
        LAYOUT: {
          layout: [
            { matrix: [0, 0], x: 0, y: 0 },
            { matrix: [0, 1], x: 1, y: 0 },
          ],
        },
      },
    });

    const result = parseQmkKeyboardJson(json);
    expect(result.layoutNames).toEqual(['LAYOUT']);

    const models = result.getKeyModels('LAYOUT');
    expect(models).toHaveLength(2);
  });

  test('parses a keyboard.json with multiple layouts', () => {
    const json = JSON.stringify({
      layouts: {
        LAYOUT_ansi: {
          layout: [{ matrix: [0, 0], x: 0, y: 0 }],
        },
        LAYOUT_iso: {
          layout: [
            { matrix: [0, 0], x: 0, y: 0 },
            { matrix: [0, 1], x: 1, y: 0 },
          ],
        },
      },
    });

    const result = parseQmkKeyboardJson(json);
    expect(result.layoutNames).toEqual(['LAYOUT_ansi', 'LAYOUT_iso']);
    expect(result.getKeyModels('LAYOUT_ansi')).toHaveLength(1);
    expect(result.getKeyModels('LAYOUT_iso')).toHaveLength(2);
  });

  test('returns empty layoutNames when layouts property is missing', () => {
    const json = JSON.stringify({ keyboard_name: 'Test' });
    const result = parseQmkKeyboardJson(json);

    expect(result.layoutNames).toEqual([]);
  });

  test('returns empty layoutNames when layouts is empty', () => {
    const json = JSON.stringify({ layouts: {} });
    const result = parseQmkKeyboardJson(json);

    expect(result.layoutNames).toEqual([]);
  });

  test('throws error for non-existent layout name', () => {
    const json = JSON.stringify({
      layouts: {
        LAYOUT: { layout: [{ matrix: [0, 0], x: 0, y: 0 }] },
      },
    });

    const result = parseQmkKeyboardJson(json);
    expect(() => result.getKeyModels('LAYOUT_nonexistent')).toThrow(
      'Layout "LAYOUT_nonexistent" not found'
    );
  });

  test('getLayoutViewContent returns correct bounding box', () => {
    const json = JSON.stringify({
      layouts: {
        LAYOUT_ortho_4x4: {
          layout: [
            { matrix: [0, 0], x: 0, y: 0 },
            { matrix: [0, 1], x: 1, y: 0 },
            { matrix: [0, 2], x: 2, y: 0 },
            { matrix: [0, 3], x: 3, y: 0 },
            { matrix: [1, 0], x: 0, y: 1 },
            { matrix: [1, 1], x: 1, y: 1 },
            { matrix: [1, 2], x: 2, y: 1 },
            { matrix: [1, 3], x: 3, y: 1 },
          ],
        },
      },
    });

    const result = parseQmkKeyboardJson(json);
    const content = result.getLayoutViewContent('LAYOUT_ortho_4x4');

    expect(content.keyModels).toHaveLength(8);
    expect(content.width).toBe(4 * KEY_SIZE);
    expect(content.height).toBe(2 * KEY_SIZE);
  });
});
