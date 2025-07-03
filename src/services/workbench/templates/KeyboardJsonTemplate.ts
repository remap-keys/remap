import { MCU2BOOTLOADER } from '../constants/McuConstants';
import {
  IFileGenerationConfig,
  IGeneratedFile,
} from '../types/FileGenerationTypes';
import templageKeyboardJson from './template_keyboard_json.json';

/**
 * Service for generating keyboard.json files for QMK Firmware
 */
export class KeyboardJsonTemplate {
  /**
   * Generate keyboard.json file content
   * @param config File generation configuration
   * @returns Generated file object
   */
  static async generate(
    config: IFileGenerationConfig
  ): Promise<IGeneratedFile> {
    // Create a deep copy of the template to avoid modifying the original
    const keyboardJson = JSON.parse(JSON.stringify(templageKeyboardJson));

    // Set the keyboard name and other properties from the config
    keyboardJson.keyboard_name = config.keyboardName;
    keyboardJson.manufacturer = config.manufacturerName;
    keyboardJson.maintainer = config.maintainerName;
    keyboardJson.usb.vid = `0x${String(config.vendorId).toUpperCase().padStart(4, '0')}`;
    keyboardJson.usb.pid = `0x${String(config.productId).toUpperCase().padStart(4, '0')}`;

    switch (config.mcuType) {
      case 'development_board':
        keyboardJson.development_board = config.mcu;
        break;
      case 'integrated_mcu':
        keyboardJson.processor = config.mcu;
        keyboardJson.bootloader = this.selectDefaultBootloader(config.mcu);
        break;
    }

    // Fetch the info file from the GitHub repository
    const infoJsonFile = await this.fetchInfoJsonFile(config.layout);

    const infoJson = JSON.parse(infoJsonFile);
    const layout = (Object.values(infoJson.layouts)[0] as any).layout as {
      x: number;
      y: number;
    }[];
    let width = 0;
    let height = 0;
    layout.forEach((item) => {
      width = Math.max(width, Math.trunc(item.x) + 1);
      height = Math.max(height, Math.trunc(item.y) + 1);
    });

    // Set the matrix pins based on the layout dimensions
    keyboardJson.matrix_pins = {
      cols: Array.from({ length: width }, (_, i) => `C${i}`),
      rows: Array.from({ length: height }, (_, i) => `D${i}`),
    };

    // Set the layout definition
    keyboardJson.layouts = {
      [`LAYOUT_${config.layout}`]: {
        layout: layout.map((key) => ({
          x: key.x,
          y: key.y,
          matrix: [Math.trunc(key.y), Math.trunc(key.x)],
        })),
      },
    };

    // Return the generated file object
    return {
      fileType: 'keyboard',
      content: JSON.stringify(keyboardJson, null, 2),
      path: 'keyboard.json',
    };
  }

  private static async fetchInfoJsonFile(layout: string): Promise<string> {
    // Fetch the info.json file from the QMK repository
    const url = `https://raw.githubusercontent.com/qmk/qmk_firmware/refs/heads/master/layouts/default/${layout}/info.json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch info.json for layout ${layout}`);
    }
    return response.text();
  }

  private static selectDefaultBootloader(mcu: string): string {
    // Select the default bootloader based on the MCU type
    return MCU2BOOTLOADER[mcu] || 'custom';
  }
}
