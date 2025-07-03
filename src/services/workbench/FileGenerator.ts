import {
  IFileGenerationConfig,
  IGeneratedFile,
} from './types/FileGenerationTypes';
import { KeyboardJsonTemplate } from './templates/KeyboardJsonTemplate';
import { KeymapCTemplate } from './templates/KeymapCTemplate';
import { errorResultOf, IResult, successResultOf } from '../../types';

/**
 * Main file generation service for QMK Firmware files
 */
export class FileGenerator {
  /**
   * Generate keyboard.json file
   * @param config File generation configuration
   * @returns Generated keyboard.json file
   */
  static async generateKeyboardJson(
    config: IFileGenerationConfig
  ): Promise<IGeneratedFile> {
    return await KeyboardJsonTemplate.generate(config);
  }

  /**
   * Generate keymap.c file
   * @param config File generation configuration
   * @returns Generated keymap.c file
   */
  static async generateKeymapC(
    config: IFileGenerationConfig
  ): Promise<IGeneratedFile> {
    return await KeymapCTemplate.generate(config);
  }

  /**
   * Generate all required files
   * @param config File generation configuration
   * @returns File generation result with all generated files
   */
  static async generateFiles(
    config: IFileGenerationConfig
  ): Promise<IResult<IGeneratedFile[]>> {
    try {
      const files: IGeneratedFile[] = [
        await this.generateKeyboardJson(config),
        await this.generateKeymapC(config),
      ];

      return successResultOf(files);
    } catch (error) {
      return errorResultOf(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}
