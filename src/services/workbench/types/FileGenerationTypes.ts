/**
 * MCU type options for keyboard generation
 */
export type MCUType = 'development_board' | 'integrated_mcu';

/**
 * Configuration interface for file generation
 */
export interface IFileGenerationConfig {
  manufacturerName: string;
  maintainerName: string;
  keyboardName: string;
  mcuType: MCUType;
  mcu: string;
  vendorId: string;
  productId: string;
  layout: string;
}

import { IBuildableFirmwareFileType } from '../../storage/Storage';

/**
 * QMK layout key position interface
 */
export interface IQMKLayoutKey {
  x: number;
  y: number;
  w?: number; // Width (default: 1)
  h?: number; // Height (default: 1)
}

/**
 * QMK layout definition interface
 */
export interface IQMKLayoutDefinition {
  layout: IQMKLayoutKey[];
}

/**
 * QMK layout info interface
 */
export interface IQMKLayoutInfo {
  keyboard_name: string;
  url: string;
  maintainer: string;
  layouts: {
    [layoutName: string]: IQMKLayoutDefinition;
  };
}

/**
 * Available layout option interface
 */
export interface ILayoutOption {
  name: string;
  displayName: string;
  description: string;
  keyCount: number;
  width: number;
  height: number;
}

/**
 * Generated file interface
 */
export interface IGeneratedFile {
  fileType: IBuildableFirmwareFileType;
  content: string;
  path: string;
}
