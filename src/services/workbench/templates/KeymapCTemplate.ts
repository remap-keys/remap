import {
  IFileGenerationConfig,
  IGeneratedFile,
} from '../types/FileGenerationTypes';

/**
 * Service for generating keymap.c files for QMK Firmware
 */
export class KeymapCTemplate {
  /**
   * Generate keymap.c file content
   * @param config File generation configuration
   * @returns Generated file object
   */
  static async generate(
    config: IFileGenerationConfig
  ): Promise<IGeneratedFile> {
    // Fetch the keymap.c template file from the GitHub repository
    const keymapCUrl = `https://raw.githubusercontent.com/qmk/qmk_firmware/refs/heads/master/layouts/default/${config.layout}/default_${config.layout}/keymap.c`;
    const response = await fetch(keymapCUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch keymap.c template: ${response.statusText}`
      );
    }
    const keymapCContent = await response.text();
    return {
      fileType: 'keymap',
      content: keymapCContent,
      path: 'keymap.c',
    };
  }
}
