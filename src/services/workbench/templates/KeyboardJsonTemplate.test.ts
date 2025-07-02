import { describe, it, expect } from 'vitest';
import { KeyboardJsonTemplate } from './KeyboardJsonTemplate';
import { IFileGenerationConfig } from '../types/FileGenerationTypes';

describe('KeyboardJsonTemplate', () => {
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
    it('should generate keyboard.json for ortho_4x4 layout', () => {
      const result = KeyboardJsonTemplate.generate(baseConfig);

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

    it('should generate keyboard.json for development board configuration', () => {
      const devBoardConfig: IFileGenerationConfig = {
        ...baseConfig,
        mcuType: 'development_board',
        mcu: 'promicro',
      };

      const result = KeyboardJsonTemplate.generate(devBoardConfig);
      const keyboardJson = JSON.parse(result.content);

      expect(keyboardJson.development_board).toBe('promicro');
      expect(keyboardJson.processor).toBeUndefined();
      expect(keyboardJson.bootloader).toBeUndefined();
    });

    it('should generate matrix pins based on layout dimensions', () => {
      const result = KeyboardJsonTemplate.generate(baseConfig);
      const keyboardJson = JSON.parse(result.content);

      expect(keyboardJson.matrix_pins.cols).toEqual(['C0', 'C1', 'C2', 'C3']);
      expect(keyboardJson.matrix_pins.rows).toEqual(['D0', 'D1', 'D2', 'D3']);
    });

    it('should generate layout definition with correct structure', () => {
      const result = KeyboardJsonTemplate.generate(baseConfig);
      const keyboardJson = JSON.parse(result.content);

      expect(keyboardJson.layouts).toBeDefined();
      expect(keyboardJson.layouts.LAYOUT_ortho_4x4).toBeDefined();
      expect(keyboardJson.layouts.LAYOUT_ortho_4x4.layout).toHaveLength(16);

      // Check first and last key positions
      const layout = keyboardJson.layouts.LAYOUT_ortho_4x4.layout;
      expect(layout[0]).toEqual({ x: 0, y: 0, matrix: [0, 0] });
      expect(layout[15]).toEqual({ x: 3, y: 3, matrix: [3, 3] });
    });

    it('should generate correct layout for 60_ansi', () => {
      const ansiConfig: IFileGenerationConfig = {
        ...baseConfig,
        layout: '60_ansi',
      };

      const result = KeyboardJsonTemplate.generate(ansiConfig);
      const keyboardJson = JSON.parse(result.content);

      expect(keyboardJson.matrix_pins.cols).toHaveLength(15);
      expect(keyboardJson.matrix_pins.rows).toHaveLength(5);
      expect(keyboardJson.layouts.LAYOUT_60_ansi).toBeDefined();
      expect(keyboardJson.layouts.LAYOUT_60_ansi.layout).toHaveLength(75); // 15 * 5
    });

    it('should include default features', () => {
      const result = KeyboardJsonTemplate.generate(baseConfig);
      const keyboardJson = JSON.parse(result.content);

      expect(keyboardJson.features).toEqual({
        bootmagic: true,
        extrakey: true,
        mousekey: true,
        nkro: true,
      });
    });

    it('should set diode direction to COL2ROW', () => {
      const result = KeyboardJsonTemplate.generate(baseConfig);
      const keyboardJson = JSON.parse(result.content);

      expect(keyboardJson.diode_direction).toBe('COL2ROW');
    });

    it('should set USB device version to 1.0.0', () => {
      const result = KeyboardJsonTemplate.generate(baseConfig);
      const keyboardJson = JSON.parse(result.content);

      expect(keyboardJson.usb.device_version).toBe('1.0.0');
    });

    it('should handle unknown MCU with custom bootloader', () => {
      const unknownMcuConfig: IFileGenerationConfig = {
        ...baseConfig,
        mcu: 'unknown_mcu',
      };

      const result = KeyboardJsonTemplate.generate(unknownMcuConfig);
      const keyboardJson = JSON.parse(result.content);

      expect(keyboardJson.processor).toBe('unknown_mcu');
      expect(keyboardJson.bootloader).toBe('custom');
    });

    it('should handle different bootloaders for different MCUs', () => {
      const testCases = [
        { mcu: 'atmega32u4', expectedBootloader: 'caterina' },
        { mcu: 'STM32F303', expectedBootloader: 'stm32-dfu' },
        { mcu: 'STM32F401', expectedBootloader: 'stm32-dfu' },
        { mcu: 'STM32F411', expectedBootloader: 'stm32-dfu' },
      ];

      testCases.forEach(({ mcu, expectedBootloader }) => {
        const config: IFileGenerationConfig = {
          ...baseConfig,
          mcu,
        };

        const result = KeyboardJsonTemplate.generate(config);
        const keyboardJson = JSON.parse(result.content);

        expect(keyboardJson.bootloader).toBe(expectedBootloader);
      });
    });

    it('should throw error for unknown layout', () => {
      const invalidConfig: IFileGenerationConfig = {
        ...baseConfig,
        layout: 'unknown_layout',
      };

      expect(() => {
        KeyboardJsonTemplate.generate(invalidConfig);
      }).toThrow('Unknown layout: unknown_layout');
    });

    it('should handle uppercase vendor and product IDs', () => {
      const uppercaseConfig: IFileGenerationConfig = {
        ...baseConfig,
        vendorId: 'abcd',
        productId: 'ef01',
      };

      const result = KeyboardJsonTemplate.generate(uppercaseConfig);
      const keyboardJson = JSON.parse(result.content);

      expect(keyboardJson.usb.vid).toBe('0xABCD');
      expect(keyboardJson.usb.pid).toBe('0xEF01');
    });
  });
});
