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
  static generateKeyboardJson(config: IFileGenerationConfig): IGeneratedFile {
    return KeyboardJsonTemplate.generate(config);
  }

  /**
   * Generate keymap.c file
   * @param config File generation configuration
   * @returns Generated keymap.c file
   */
  static generateKeymapC(config: IFileGenerationConfig): IGeneratedFile {
    return KeymapCTemplate.generate(config);
  }

  /**
   * Generate all required files
   * @param config File generation configuration
   * @returns File generation result with all generated files
   */
  static generateFiles(
    config: IFileGenerationConfig
  ): IResult<IGeneratedFile[]> {
    try {
      const files: IGeneratedFile[] = [
        this.generateKeyboardJson(config),
        this.generateKeymapC(config),
      ];

      return successResultOf(files);
    } catch (error) {
      return errorResultOf(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}
