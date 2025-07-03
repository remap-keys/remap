import { describe, it, expect, vi, beforeEach } from 'vitest';
import { KeyboardJsonTemplate } from './KeyboardJsonTemplate';
import { IFileGenerationConfig } from '../types/FileGenerationTypes';

// Mock the MCU constants to avoid dependency on actual constants
vi.mock('../constants/McuConstants', () => ({
  MCU2BOOTLOADER: {
    RP2040: 'rp2040',
    STM32F103: 'stm32duino',
    STM32F401: 'stm32-dfu',
    atmega32u4: 'atmel-dfu',
  },
}));

// Mock the template JSON
vi.mock('./template_keyboard_json.json', () => ({
  default: {
    keyboard_name: '%KEYBOARD%',
    maintainer: '%USER_NAME%',
    manufacturer: '%REAL_NAME%',
    diode_direction: 'COL2ROW',
    matrix_pins: {
      cols: ['C2'],
      rows: ['D1'],
    },
    usb: {
      vid: '0xFEED',
      pid: '0x0000',
      device_version: '1.0.0',
    },
    features: {
      bootmagic: true,
      extrakey: true,
      mousekey: true,
      nkro: true,
    },
  },
}));

describe('KeyboardJsonTemplate', () => {
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

  const mockInfoJsonData = {
    keyboard_name: 'test_keyboard',
    url: 'https://example.com',
    maintainer: 'test_user',
    layouts: {
      LAYOUT_ortho_4x4: {
        layout: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
          { x: 3, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
          { x: 3, y: 1 },
          { x: 0, y: 2 },
          { x: 1, y: 2 },
          { x: 2, y: 2 },
          { x: 3, y: 2 },
          { x: 0, y: 3 },
          { x: 1, y: 3 },
          { x: 2, y: 3 },
          { x: 3, y: 3 },
        ],
      },
    },
  };

  beforeEach(() => {
    // Mock fetch to return the info.json data
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockInfoJsonData)),
    });
  });

  describe('generate', () => {
    it('should generate keyboard.json file with correct basic structure', async () => {
      const result = await KeyboardJsonTemplate.generate(baseConfig);

      expect(result.fileType).toBe('keyboard');
      expect(result.path).toBe('keyboard.json');
      expect(result.content).toBeDefined();

      const parsedContent = JSON.parse(result.content);
      expect(parsedContent.keyboard_name).toBe('test_keyboard');
      expect(parsedContent.maintainer).toBe('test_user');
      expect(parsedContent.manufacturer).toBe('Test Manufacturer');
    });

    it('should set USB VID and PID correctly', async () => {
      const result = await KeyboardJsonTemplate.generate(baseConfig);
      const parsedContent = JSON.parse(result.content);

      expect(parsedContent.usb.vid).toBe('0xFEED');
      expect(parsedContent.usb.pid).toBe('0x0001');
    });

    it('should handle development board MCU type', async () => {
      const devBoardConfig: IFileGenerationConfig = {
        ...baseConfig,
        mcuType: 'development_board',
        mcu: 'elite_c',
      };

      const result = await KeyboardJsonTemplate.generate(devBoardConfig);
      const parsedContent = JSON.parse(result.content);

      expect(parsedContent.development_board).toBe('elite_c');
      expect(parsedContent.processor).toBeUndefined();
      expect(parsedContent.bootloader).toBeUndefined();
    });

    it('should handle integrated MCU type with known bootloader', async () => {
      const integratedConfig: IFileGenerationConfig = {
        ...baseConfig,
        mcuType: 'integrated_mcu',
        mcu: 'RP2040',
      };

      const result = await KeyboardJsonTemplate.generate(integratedConfig);
      const parsedContent = JSON.parse(result.content);

      expect(parsedContent.processor).toBe('RP2040');
      expect(parsedContent.bootloader).toBe('rp2040');
      expect(parsedContent.development_board).toBeUndefined();
    });

    it('should handle integrated MCU type with unknown bootloader', async () => {
      const unknownMcuConfig: IFileGenerationConfig = {
        ...baseConfig,
        mcuType: 'integrated_mcu',
        mcu: 'unknown_mcu',
      };

      const result = await KeyboardJsonTemplate.generate(unknownMcuConfig);
      const parsedContent = JSON.parse(result.content);

      expect(parsedContent.processor).toBe('unknown_mcu');
      expect(parsedContent.bootloader).toBe('custom');
    });

    it('should generate correct matrix pins based on layout dimensions', async () => {
      const result = await KeyboardJsonTemplate.generate(baseConfig);
      const parsedContent = JSON.parse(result.content);

      // For ortho_4x4, width should be 4, height should be 4
      expect(parsedContent.matrix_pins.cols).toEqual(['C0', 'C1', 'C2', 'C3']);
      expect(parsedContent.matrix_pins.rows).toEqual(['D0', 'D1', 'D2', 'D3']);
    });

    it('should generate correct layout definition', async () => {
      const result = await KeyboardJsonTemplate.generate(baseConfig);
      const parsedContent = JSON.parse(result.content);

      expect(parsedContent.layouts).toHaveProperty('LAYOUT_ortho_4x4');
      const layout = parsedContent.layouts.LAYOUT_ortho_4x4.layout;

      expect(layout).toHaveLength(16);
      expect(layout[0]).toEqual({ x: 0, y: 0, matrix: [0, 0] });
      expect(layout[5]).toEqual({ x: 1, y: 1, matrix: [1, 1] });
      expect(layout[15]).toEqual({ x: 3, y: 3, matrix: [3, 3] });
    });

    it('should handle different layout dimensions correctly', async () => {
      const mockLargerLayout = {
        ...mockInfoJsonData,
        layouts: {
          LAYOUT_60_ansi: {
            layout: [
              { x: 0, y: 0 },
              { x: 1, y: 0 },
              { x: 2, y: 0 },
              { x: 0, y: 1 },
              { x: 1, y: 1 },
              { x: 2, y: 1 },
              { x: 0, y: 2 },
              { x: 1, y: 2 },
              { x: 2, y: 2 },
              { x: 0, y: 3 },
              { x: 1, y: 3 },
              { x: 2, y: 3 },
              { x: 0, y: 4 },
              { x: 1, y: 4 },
              { x: 2, y: 4 },
            ],
          },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockLargerLayout)),
      });

      const config60: IFileGenerationConfig = {
        ...baseConfig,
        layout: '60_ansi',
      };

      const result = await KeyboardJsonTemplate.generate(config60);
      const parsedContent = JSON.parse(result.content);

      expect(parsedContent.matrix_pins.cols).toEqual(['C0', 'C1', 'C2']);
      expect(parsedContent.matrix_pins.rows).toEqual([
        'D0',
        'D1',
        'D2',
        'D3',
        'D4',
      ]);
    });

    it('should handle non-integer coordinates correctly', async () => {
      const mockFloatLayout = {
        ...mockInfoJsonData,
        layouts: {
          LAYOUT_test: {
            layout: [
              { x: 0.5, y: 0.25 },
              { x: 1.75, y: 0.75 },
              { x: 2.25, y: 1.5 },
            ],
          },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockFloatLayout)),
      });

      const floatConfig: IFileGenerationConfig = {
        ...baseConfig,
        layout: 'test',
      };

      const result = await KeyboardJsonTemplate.generate(floatConfig);
      const parsedContent = JSON.parse(result.content);

      expect(parsedContent.matrix_pins.cols).toEqual(['C0', 'C1', 'C2']);
      expect(parsedContent.matrix_pins.rows).toEqual(['D0', 'D1']);

      const layout = parsedContent.layouts.LAYOUT_test.layout;
      expect(layout[0]).toEqual({ x: 0.5, y: 0.25, matrix: [0, 0] });
      expect(layout[1]).toEqual({ x: 1.75, y: 0.75, matrix: [0, 1] });
      expect(layout[2]).toEqual({ x: 2.25, y: 1.5, matrix: [1, 2] });
    });

    it('should throw error when fetch fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(KeyboardJsonTemplate.generate(baseConfig)).rejects.toThrow(
        'Failed to fetch info.json for layout ortho_4x4'
      );
    });

    it('should use correct GitHub URL for fetching layout info', async () => {
      await KeyboardJsonTemplate.generate(baseConfig);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/qmk/qmk_firmware/refs/heads/master/layouts/default/ortho_4x4/info.json'
      );
    });

    it('should preserve original template features', async () => {
      const result = await KeyboardJsonTemplate.generate(baseConfig);
      const parsedContent = JSON.parse(result.content);

      expect(parsedContent.features).toEqual({
        bootmagic: true,
        extrakey: true,
        mousekey: true,
        nkro: true,
      });
    });

    it('should preserve diode direction from template', async () => {
      const result = await KeyboardJsonTemplate.generate(baseConfig);
      const parsedContent = JSON.parse(result.content);

      expect(parsedContent.diode_direction).toBe('COL2ROW');
    });

    it('should format JSON with proper indentation', async () => {
      const result = await KeyboardJsonTemplate.generate(baseConfig);

      // Check that the JSON is properly formatted with 2-space indentation
      const lines = result.content.split('\n');
      const firstPropertyLine = lines.find((line) =>
        line.includes('"keyboard_name"')
      );
      expect(firstPropertyLine).toMatch(/^\s{2}"/); // 2 spaces for first level
    });

    it('should handle different MCU types correctly', async () => {
      const testCases = [
        {
          mcuType: 'integrated_mcu' as const,
          mcu: 'STM32F103',
          expectedBootloader: 'stm32duino',
        },
        {
          mcuType: 'integrated_mcu' as const,
          mcu: 'STM32F401',
          expectedBootloader: 'stm32-dfu',
        },
        {
          mcuType: 'integrated_mcu' as const,
          mcu: 'atmega32u4',
          expectedBootloader: 'atmel-dfu',
        },
        {
          mcuType: 'development_board' as const,
          mcu: 'elite_c',
          expectedBootloader: undefined,
        },
      ];

      for (const { mcuType, mcu, expectedBootloader } of testCases) {
        const config: IFileGenerationConfig = {
          ...baseConfig,
          mcuType,
          mcu,
        };

        const result = await KeyboardJsonTemplate.generate(config);
        const parsedContent = JSON.parse(result.content);

        if (mcuType === 'integrated_mcu') {
          expect(parsedContent.processor).toBe(mcu);
          expect(parsedContent.bootloader).toBe(expectedBootloader);
          expect(parsedContent.development_board).toBeUndefined();
        } else {
          expect(parsedContent.development_board).toBe(mcu);
          expect(parsedContent.processor).toBeUndefined();
          expect(parsedContent.bootloader).toBeUndefined();
        }
      }
    });

    it('should handle edge cases for matrix calculation', async () => {
      const mockSingleKeyLayout = {
        ...mockInfoJsonData,
        layouts: {
          LAYOUT_single: {
            layout: [{ x: 0, y: 0 }],
          },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockSingleKeyLayout)),
      });

      const singleKeyConfig: IFileGenerationConfig = {
        ...baseConfig,
        layout: 'single',
      };

      const result = await KeyboardJsonTemplate.generate(singleKeyConfig);
      const parsedContent = JSON.parse(result.content);

      expect(parsedContent.matrix_pins.cols).toEqual(['C0']);
      expect(parsedContent.matrix_pins.rows).toEqual(['D0']);
    });
  });
});
