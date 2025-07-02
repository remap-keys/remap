import { describe, it, expect } from 'vitest';
import { FileGenerator } from './FileGenerator';
import { IFileGenerationConfig } from './types/FileGenerationTypes';

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

  describe('generateKeyboardJson', () => {
    it('should generate keyboard.json file', () => {
      const result = FileGenerator.generateKeyboardJson(testConfig);

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
  });

  describe('generateKeymapC', () => {
    it('should generate keymap.c file', () => {
      const result = FileGenerator.generateKeymapC(testConfig);

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
  });

  describe('generateFiles', () => {
    it('should generate both keyboard.json and keymap.c files successfully', () => {
      const result = FileGenerator.generateFiles(testConfig);

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

    it('should handle invalid layout gracefully', () => {
      const invalidConfig: IFileGenerationConfig = {
        ...testConfig,
        layout: 'invalid_layout',
      };

      const result = FileGenerator.generateFiles(invalidConfig);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error).toContain('Unknown layout');
      }
    });
  });
});
