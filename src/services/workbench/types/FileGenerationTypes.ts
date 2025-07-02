/**
 * Configuration interface for file generation
 */
export interface IFileGenerationConfig {
  manufacturerName: string;
  maintainerName: string;
  keyboardName: string;
  mcuType: string;
  mcu: string;
  vendorId: string;
  productId: string;
}

import { IBuildableFirmwareFileType } from '../../storage/Storage';

/**
 * Generated file interface
 */
export interface IGeneratedFile {
  fileType: IBuildableFirmwareFileType;
  content: string;
  path: string;
}
