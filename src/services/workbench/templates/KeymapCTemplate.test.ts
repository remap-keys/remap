import { describe, it, expect } from 'vitest';
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
    productId: '0000',
    layout: 'ortho_4x4',
  };

  describe('generate', () => {
    it('should generate keymap.c for ortho_4x4 layout', () => {
      const result = KeymapCTemplate.generate(baseConfig);

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

    it('should include current year in copyright', () => {
      const result = KeymapCTemplate.generate(baseConfig);
      const currentYear = new Date().getFullYear();

      expect(result.content).toContain(`// Copyright ${currentYear} QMK`);
    });

    it('should generate correct layout comment for ortho layout', () => {
      const result = KeymapCTemplate.generate(baseConfig);

      expect(result.content).toContain('4x4 Ortholinear Layout');
    });

    it('should generate correct layout comment for 60% layout', () => {
      const config60: IFileGenerationConfig = {
        ...baseConfig,
        layout: '60_ansi',
      };

      const result = KeymapCTemplate.generate(config60);

      expect(result.content).toContain('60% Keyboard Layout');
    });

    it('should generate correct layout comment for 65% layout', () => {
      const config65: IFileGenerationConfig = {
        ...baseConfig,
        layout: '65_ansi',
      };

      const result = KeymapCTemplate.generate(config65);

      expect(result.content).toContain('65% Keyboard Layout');
    });

    it('should generate correct layout comment for TKL layout', () => {
      const configTkl: IFileGenerationConfig = {
        ...baseConfig,
        layout: 'tkl_ansi',
      };

      const result = KeymapCTemplate.generate(configTkl);

      expect(result.content).toContain('Tenkeyless Layout');
    });

    it('should generate correct layout comment for split layout', () => {
      const configSplit: IFileGenerationConfig = {
        ...baseConfig,
        layout: 'split_3x6_3',
      };

      const result = KeymapCTemplate.generate(configSplit);

      expect(result.content).toContain('Split Keyboard Layout');
    });

    it('should generate correct layout comment for Alice layout', () => {
      const configAlice: IFileGenerationConfig = {
        ...baseConfig,
        layout: 'alice',
      };

      const result = KeymapCTemplate.generate(configAlice);

      expect(result.content).toContain('Alice Layout');
    });

    it('should generate correct layout comment for numpad layout', () => {
      const configNumpad: IFileGenerationConfig = {
        ...baseConfig,
        layout: 'numpad_5x4',
      };

      const result = KeymapCTemplate.generate(configNumpad);

      expect(result.content).toContain('Numpad Layout');
    });

    it('should generate specific keycodes for ortho_4x4 layout', () => {
      const result = KeymapCTemplate.generate(baseConfig);

      const expectedKeycodes = [
        'KC_P7',
        'KC_P8',
        'KC_P9',
        'KC_PSLS',
        'KC_P4',
        'KC_P5',
        'KC_P6',
        'KC_PAST',
        'KC_P1',
        'KC_P2',
        'KC_P3',
        'KC_PMNS',
        'KC_P0',
        'KC_PDOT',
        'KC_PENT',
        'KC_PPLS',
      ];

      expectedKeycodes.forEach((keycode) => {
        expect(result.content).toContain(keycode);
      });
    });

    it('should generate specific keycodes for numpad_5x4 layout', () => {
      const configNumpad: IFileGenerationConfig = {
        ...baseConfig,
        layout: 'numpad_5x4',
      };

      const result = KeymapCTemplate.generate(configNumpad);

      const expectedKeycodes = [
        'KC_NLCK',
        'KC_PSLS',
        'KC_PAST',
        'KC_PMNS',
        'KC_P7',
        'KC_P8',
        'KC_P9',
        'KC_PPLS',
        'KC_P4',
        'KC_P5',
        'KC_P6',
        'KC_P1',
        'KC_P2',
        'KC_P3',
        'KC_PENT',
        'KC_P0',
        'KC_PDOT',
      ];

      expectedKeycodes.forEach((keycode) => {
        expect(result.content).toContain(keycode);
      });
    });

    it('should generate generic keycodes for other layouts', () => {
      const configGeneric: IFileGenerationConfig = {
        ...baseConfig,
        layout: '60_ansi',
      };

      const result = KeymapCTemplate.generate(configGeneric);

      // Should contain numeric keycodes
      expect(result.content).toContain('KC_0');
      expect(result.content).toContain('KC_1');
      expect(result.content).toContain('KC_9');

      // Should contain letter keycodes
      expect(result.content).toContain('KC_A');
      expect(result.content).toContain('KC_B');
      expect(result.content).toContain('KC_Z');

      // Should contain KC_NO for remaining keys
      expect(result.content).toContain('KC_NO');
    });

    it('should properly format keycode array with indentation', () => {
      const result = KeymapCTemplate.generate(baseConfig);

      // Check that keycodes are properly indented
      const lines = result.content.split('\n');
      const keycodeLine = lines.find((line) => line.includes('KC_P7'));
      expect(keycodeLine).toMatch(/^\s{8}KC_P7/); // 8 spaces indentation
    });

    it('should use correct layout macro name', () => {
      const testCases = [
        { layout: 'ortho_4x4', expectedMacro: 'LAYOUT_ortho_4x4' },
        { layout: '60_ansi', expectedMacro: 'LAYOUT_60_ansi' },
        { layout: 'split_3x6_3', expectedMacro: 'LAYOUT_split_3x6_3' },
      ];

      testCases.forEach(({ layout, expectedMacro }) => {
        const config: IFileGenerationConfig = {
          ...baseConfig,
          layout,
        };

        const result = KeymapCTemplate.generate(config);
        expect(result.content).toContain(`[0] = ${expectedMacro}(`);
      });
    });

    it('should generate correct number of keycodes for different layouts', () => {
      const testCases = [
        { layout: 'ortho_4x4', expectedKeyCount: 16 },
        { layout: 'numpad_5x4', expectedKeyCount: 20 },
        { layout: '60_ansi', expectedKeyCount: 61 },
        { layout: 'split_3x6_3', expectedKeyCount: 42 },
      ];

      testCases.forEach(({ layout, expectedKeyCount }) => {
        const config: IFileGenerationConfig = {
          ...baseConfig,
          layout,
        };

        const result = KeymapCTemplate.generate(config);

        // Count the number of KC_ occurrences
        const keycodeMatches = result.content.match(/KC_\w+/g);
        expect(keycodeMatches).toHaveLength(expectedKeyCount);
      });
    });

    it('should handle generic keycodes correctly for large layouts', () => {
      const configLarge: IFileGenerationConfig = {
        ...baseConfig,
        layout: 'fullsize_ansi', // 104 keys
      };

      const result = KeymapCTemplate.generate(configLarge);

      // Should have numbers (0-9), letters (A-Z), and KC_NO
      expect(result.content).toContain('KC_0');
      expect(result.content).toContain('KC_9');
      expect(result.content).toContain('KC_A');
      expect(result.content).toContain('KC_Z');
      expect(result.content).toContain('KC_NO');

      // Should have exactly 104 keycodes
      const keycodeMatches = result.content.match(/KC_\w+/g);
      expect(keycodeMatches).toHaveLength(104);
    });

    it('should throw error for unknown layout', () => {
      const invalidConfig: IFileGenerationConfig = {
        ...baseConfig,
        layout: 'unknown_layout',
      };

      expect(() => {
        KeymapCTemplate.generate(invalidConfig);
      }).toThrow('Unknown layout: unknown_layout');
    });
  });
});
