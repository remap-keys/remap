import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FileGenerator } from './FileGenerator';
import { IFileGenerationConfig } from './types/FileGenerationTypes';
import { KeyboardJsonTemplate } from './templates/KeyboardJsonTemplate';
import { KeymapCTemplate } from './templates/KeymapCTemplate';

// Mock the template classes
vi.mock('./templates/KeyboardJsonTemplate');
vi.mock('./templates/KeymapCTemplate');

describe('FileGenerator', () => {
  const testConfig: IFileGenerationConfig = {
    manufacturerName: 'Test Manufacturer',
    maintainerName: 'test_user',
    keyboardName: 'test_keyboard',
    mcuType: 'integrated_mcu',
    mcu: 'RP2040',
    vendorId: 'FEED',
    productId: '0000',
    layout: 'ortho_4x4',
  };

  const mockKeyboardJsonFile = {
    fileType: 'keyboard' as const,
    path: 'keyboard.json',
    content: JSON.stringify({
      keyboard_name: 'test_keyboard',
      manufacturer: 'Test Manufacturer',
      maintainer: 'test_user',
      usb: { vid: '0xFEED', pid: '0x0000' },
      processor: 'RP2040',
      bootloader: 'rp2040',
    }),
  };

  const mockKeymapCFile = {
    fileType: 'keymap' as const,
    path: 'keymap.c',
    content: `// Copyright 2023 QMK
// SPDX-License-Identifier: GPL-2.0-or-later

#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT_ortho_4x4(
        KC_1, KC_2, KC_3, KC_A,
        KC_4, KC_5, KC_6, KC_B,
        KC_7, KC_8, KC_9, KC_C,
        KC_LSFT, KC_0, KC_DEL, KC_ENT
    )
};`,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(KeyboardJsonTemplate.generate).mockResolvedValue(
      mockKeyboardJsonFile
    );
    vi.mocked(KeymapCTemplate.generate).mockResolvedValue(mockKeymapCFile);
  });

  describe('generateKeyboardJson', () => {
    it('should generate keyboard.json file', async () => {
      const result = await FileGenerator.generateKeyboardJson(testConfig);

      expect(result.fileType).toBe('keyboard');
      expect(result.path).toBe('keyboard.json');
      expect(result.content).toBeDefined();

      const keyboardJson = JSON.parse(result.content);
      expect(keyboardJson.keyboard_name).toBe('test_keyboard');
      expect(keyboardJson.manufacturer).toBe('Test Manufacturer');
      expect(keyboardJson.maintainer).toBe('test_user');
      expect(keyboardJson.usb.vid).toBe('0xFEED');
      expect(keyboardJson.usb.pid).toBe('0x0000');
      expect(keyboardJson.processor).toBe('RP2040');
      expect(keyboardJson.bootloader).toBe('rp2040');
    });

    it('should call KeyboardJsonTemplate.generate with correct config', async () => {
      await FileGenerator.generateKeyboardJson(testConfig);

      expect(KeyboardJsonTemplate.generate).toHaveBeenCalledWith(testConfig);
    });
  });

  describe('generateKeymapC', () => {
    it('should generate keymap.c file', async () => {
      const result = await FileGenerator.generateKeymapC(testConfig);

      expect(result.fileType).toBe('keymap');
      expect(result.path).toBe('keymap.c');
      expect(result.content).toBeDefined();

      const content = result.content;
      expect(content).toContain('// Copyright');
      expect(content).toContain('// SPDX-License-Identifier: GPL-2.0-or-later');
      expect(content).toContain('#include QMK_KEYBOARD_H');
      expect(content).toContain(
        'const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS]'
      );
      expect(content).toContain('[0] = LAYOUT_ortho_4x4(');
    });

    it('should call KeymapCTemplate.generate with correct config', async () => {
      await FileGenerator.generateKeymapC(testConfig);

      expect(KeymapCTemplate.generate).toHaveBeenCalledWith(testConfig);
    });
  });

  describe('generateFiles', () => {
    it('should generate both keyboard.json and keymap.c files successfully', async () => {
      const result = await FileGenerator.generateFiles(testConfig);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        const files = result.value;
        expect(files).toHaveLength(2);

        const keyboardFile = files.find((f) => f.fileType === 'keyboard');
        const keymapFile = files.find((f) => f.fileType === 'keymap');

        expect(keyboardFile).toBeDefined();
        expect(keymapFile).toBeDefined();

        expect(keyboardFile!.path).toBe('keyboard.json');
        expect(keymapFile!.path).toBe('keymap.c');
      }
    });

    it('should handle keyboard.json generation error gracefully', async () => {
      vi.mocked(KeyboardJsonTemplate.generate).mockRejectedValue(
        new Error('Failed to generate keyboard.json')
      );

      const result = await FileGenerator.generateFiles(testConfig);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error).toBe('Failed to generate keyboard.json');
      }
    });

    it('should handle keymap.c generation error gracefully', async () => {
      vi.mocked(KeymapCTemplate.generate).mockRejectedValue(
        new Error('Failed to generate keymap.c')
      );

      const result = await FileGenerator.generateFiles(testConfig);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error).toBe('Failed to generate keymap.c');
      }
    });

    it('should handle unknown error types gracefully', async () => {
      vi.mocked(KeyboardJsonTemplate.generate).mockRejectedValue(
        'String error'
      );

      const result = await FileGenerator.generateFiles(testConfig);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error).toBe('Unknown error');
      }
    });

    it('should call both template generators with correct config', async () => {
      await FileGenerator.generateFiles(testConfig);

      expect(KeyboardJsonTemplate.generate).toHaveBeenCalledWith(testConfig);
      expect(KeymapCTemplate.generate).toHaveBeenCalledWith(testConfig);
    });
  });
});
