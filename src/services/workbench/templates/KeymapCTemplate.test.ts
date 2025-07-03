import { describe, it, expect, vi, beforeEach } from 'vitest';
import { KeymapCTemplate } from './KeymapCTemplate';
import { IFileGenerationConfig } from '../types/FileGenerationTypes';

describe('KeymapCTemplate', () => {
  const baseConfig: IFileGenerationConfig = {
    manufacturerName: 'Test Manufacturer',
    maintainerName: 'test_user',
    keyboardName: 'test_keyboard',
    mcuType: 'integrated_mcu',
    mcu: 'RP2040',
    vendorId: 'FEED',
    productId: '0001',
    layout: 'ortho_4x4',
  };

  const mockKeymapCContent = `// Copyright 2023 QMK
// SPDX-License-Identifier: GPL-2.0-or-later

#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT_ortho_4x4(
        KC_1,    KC_2,    KC_3,    KC_A,
        KC_4,    KC_5,    KC_6,    KC_B,
        KC_7,    KC_8,    KC_9,    KC_C,
        KC_LSFT, KC_0,    KC_DEL,  KC_ENT
    )
};`;

  beforeEach(() => {
    // Mock fetch to return the keymap.c content
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockKeymapCContent),
    });
  });

  describe('generate', () => {
    it('should generate keymap.c file with correct structure', async () => {
      const result = await KeymapCTemplate.generate(baseConfig);

      expect(result.fileType).toBe('keymap');
      expect(result.path).toBe('keymap.c');
      expect(result.content).toBe(mockKeymapCContent);
    });

    it('should use correct GitHub URL for fetching keymap.c template', async () => {
      await KeymapCTemplate.generate(baseConfig);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/qmk/qmk_firmware/refs/heads/master/layouts/default/ortho_4x4/default_ortho_4x4/keymap.c'
      );
    });

    it('should handle different layout types correctly', async () => {
      const config60: IFileGenerationConfig = {
        ...baseConfig,
        layout: '60_ansi',
      };

      await KeymapCTemplate.generate(config60);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/qmk/qmk_firmware/refs/heads/master/layouts/default/60_ansi/default_60_ansi/keymap.c'
      );
    });

    it('should throw error when fetch fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(KeymapCTemplate.generate(baseConfig)).rejects.toThrow(
        'Failed to fetch keymap.c template: Not Found'
      );
    });

    it('should handle network errors correctly', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(KeymapCTemplate.generate(baseConfig)).rejects.toThrow(
        'Network error'
      );
    });

    it('should return content as-is from GitHub', async () => {
      const customContent = `// Custom keymap content
#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT_custom(
        KC_ESC,  KC_1,    KC_2,    KC_3,
        KC_TAB,  KC_Q,    KC_W,    KC_E,
        KC_CAPS, KC_A,    KC_S,    KC_D,
        KC_LSFT, KC_Z,    KC_X,    KC_C
    )
};`;

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(customContent),
      });

      const result = await KeymapCTemplate.generate(baseConfig);

      expect(result.content).toBe(customContent);
    });

    it('should handle empty response correctly', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(''),
      });

      const result = await KeymapCTemplate.generate(baseConfig);

      expect(result.content).toBe('');
      expect(result.fileType).toBe('keymap');
      expect(result.path).toBe('keymap.c');
    });

    it('should handle various HTTP error codes', async () => {
      const errorCases = [
        { status: 404, statusText: 'Not Found' },
        { status: 500, statusText: 'Internal Server Error' },
        { status: 403, statusText: 'Forbidden' },
      ];

      for (const { status, statusText } of errorCases) {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status,
          statusText,
        });

        await expect(KeymapCTemplate.generate(baseConfig)).rejects.toThrow(
          `Failed to fetch keymap.c template: ${statusText}`
        );
      }
    });
  });
});
