import {
  IFileGenerationConfig,
  IGeneratedFile,
} from '../types/FileGenerationTypes';
import { getLayoutOption } from '../constants/LayoutConstants';

/**
 * Service for generating keyboard.json files for QMK Firmware
 */
export class KeyboardJsonTemplate {
  /**
   * Generate keyboard.json file content
   * @param config File generation configuration
   * @returns Generated file object
   */
  static generate(config: IFileGenerationConfig): IGeneratedFile {
    const selectedLayout = getLayoutOption(config.layout || 'ortho_4x4');

    if (!selectedLayout) {
      throw new Error(`Unknown layout: ${config.layout}`);
    }

    // Generate keyboard.json content based on QMK template structure
    const keyboardJson = {
      keyboard_name: config.keyboardName,
      manufacturer: config.manufacturerName,
      maintainer: config.maintainerName,
      usb: {
        vid: `0x${config.vendorId.toUpperCase()}`,
        pid: `0x${config.productId.toUpperCase()}`,
        device_version: '1.0.0',
      },
      // Set processor or development_board based on MCU type
      ...(config.mcuType === 'integrated_mcu'
        ? {
            processor: config.mcu,
            bootloader: this.getDefaultBootloader(config.mcu),
          }
        : {
            development_board: config.mcu,
          }),
      // Generate matrix configuration based on layout
      matrix_pins: this.generateMatrixPins(selectedLayout),
      diode_direction: 'COL2ROW',
      // Generate layout definition
      layouts: this.generateLayoutDefinition(selectedLayout),
      // Default features
      features: {
        bootmagic: true,
        extrakey: true,
        mousekey: true,
        nkro: true,
      },
    };

    return {
      fileType: 'keyboard' as const,
      content: JSON.stringify(keyboardJson, null, 2),
      path: 'keyboard.json',
    };
  }

  /**
   * Get default bootloader for the given MCU
   */
  private static getDefaultBootloader(mcu: string): string {
    const bootloaderMap: { [key: string]: string } = {
      atmega32u4: 'caterina',
      RP2040: 'rp2040',
      STM32F303: 'stm32-dfu',
      STM32F401: 'stm32-dfu',
      STM32F411: 'stm32-dfu',
    };
    return bootloaderMap[mcu] || 'custom';
  }

  /**
   * Generate matrix pins configuration based on layout dimensions
   */
  private static generateMatrixPins(layout: any) {
    const cols = Array.from({ length: layout.width }, (_, i) => `C${i}`);
    const rows = Array.from({ length: layout.height }, (_, i) => `D${i}`);

    return {
      cols,
      rows,
    };
  }

  /**
   * Generate layout definition based on selected layout
   */
  private static generateLayoutDefinition(layout: any) {
    const layoutName = `LAYOUT_${layout.name}`;

    // Generate key positions for the layout
    const keyPositions = [];
    for (let row = 0; row < layout.height; row++) {
      for (let col = 0; col < layout.width; col++) {
        keyPositions.push({
          x: col,
          y: row,
          matrix: [row, col],
        });
      }
    }

    return {
      [layoutName]: {
        layout: keyPositions,
      },
    };
  }
}
