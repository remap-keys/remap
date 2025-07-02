import {
  IFileGenerationConfig,
  IGeneratedFile,
} from '../types/FileGenerationTypes';
import { getLayoutOption } from '../constants/LayoutConstants';

/**
 * Service for generating keymap.c files for QMK Firmware
 */
export class KeymapCTemplate {
  /**
   * Generate keymap.c file content
   * @param config File generation configuration
   * @returns Generated file object
   */
  static generate(config: IFileGenerationConfig): IGeneratedFile {
    const selectedLayout = getLayoutOption(config.layout || 'ortho_4x4');

    if (!selectedLayout) {
      throw new Error(`Unknown layout: ${config.layout}`);
    }

    const currentYear = new Date().getFullYear();
    const layoutName = `LAYOUT_${selectedLayout.name}`;

    // Generate keymap content based on QMK template structure
    const keymapContent = this.generateKeymapContent(
      currentYear,
      selectedLayout,
      layoutName
    );

    return {
      fileType: 'keymap' as const,
      content: keymapContent,
      path: 'keymap.c',
    };
  }

  /**
   * Generate keymap.c file content
   */
  private static generateKeymapContent(
    year: number,
    layout: any,
    layoutName: string
  ): string {
    const keycodes = this.generateDefaultKeycodes(layout);

    return `// Copyright ${year} QMK
// SPDX-License-Identifier: GPL-2.0-or-later

#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    /*
     * ${this.generateLayoutComment(layout)}
     */
    [0] = ${layoutName}(
${keycodes.map((key) => `        ${key}`).join(',\n')}
    )
};`;
  }

  /**
   * Generate layout visual comment
   */
  private static generateLayoutComment(layout: any): string {
    if (layout.name.includes('ortho')) {
      return `${layout.width}x${layout.height} Ortholinear Layout`;
    } else if (layout.name.includes('60')) {
      return '60% Keyboard Layout';
    } else if (layout.name.includes('65')) {
      return '65% Keyboard Layout';
    } else if (layout.name.includes('tkl')) {
      return 'Tenkeyless Layout';
    } else if (layout.name.includes('split')) {
      return 'Split Keyboard Layout';
    } else if (layout.name === 'alice') {
      return 'Alice Layout';
    } else if (layout.name.includes('numpad')) {
      return 'Numpad Layout';
    }
    return `${layout.displayName} Layout`;
  }

  /**
   * Generate default keycodes for the layout
   */
  private static generateDefaultKeycodes(layout: any): string[] {
    const keyCount = layout.keyCount;

    // Define default keycode patterns based on layout type
    if (layout.name.includes('numpad')) {
      return this.generateNumpadKeycodes(layout);
    } else if (layout.name.includes('ortho_4x4')) {
      return this.generateOrtho4x4Keycodes();
    } else {
      return this.generateGenericKeycodes(keyCount);
    }
  }

  /**
   * Generate numpad-specific keycodes
   */
  private static generateNumpadKeycodes(layout: any): string[] {
    if (layout.name === 'numpad_5x4') {
      return [
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
        'KC_PPLS',
        'KC_P1',
        'KC_P2',
        'KC_P3',
        'KC_PENT',
        'KC_P0',
        'KC_P0',
        'KC_PDOT',
        'KC_PENT',
      ];
    }
    return this.generateGenericKeycodes(layout.keyCount);
  }

  /**
   * Generate ortho 4x4 specific keycodes
   */
  private static generateOrtho4x4Keycodes(): string[] {
    return [
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
  }

  /**
   * Generate generic keycodes for any layout
   */
  private static generateGenericKeycodes(keyCount: number): string[] {
    const keycodes = [];

    for (let i = 0; i < keyCount; i++) {
      if (i < 10) {
        keycodes.push(`KC_${i}`);
      } else if (i < 36) {
        // A-Z for remaining keys
        const letter = String.fromCharCode(65 + (i - 10));
        keycodes.push(`KC_${letter}`);
      } else {
        // Fill remaining with NO key
        keycodes.push('KC_NO');
      }
    }

    return keycodes;
  }
}
