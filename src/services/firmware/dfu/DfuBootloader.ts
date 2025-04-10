import { IBootloader } from '../Bootloader';
import { IUsb } from '../usb/Usb';
import AtmelDfuBootloader from './AtmelDfuBootloader';
import { FirmwareWriterProgressListener } from '../FirmwareWriter';
import {
  errorResultOf,
  IResult,
  isError,
  successResultOf,
} from '../../../types';

export const ALL_DFU_DEVICE_TYPE = ['adc_avr'] as const;
type dfuDeviceTypeTuple = typeof ALL_DFU_DEVICE_TYPE;
export type IDfuDeviceType = dfuDeviceTypeTuple[number];

export const BOOTLOADER_LOCATION = {
  BASE: 0, // Bootloader at bottom
  TOP: 1, // Bootloader at top, space included in total memory
  EXTRA: 2, // Bootloader at top in separate memory area
  SPECIFIC: 3, // Any value greater than this is a specific start address
};

export type IDfuTargetMapping = {
  name: string;
  deviceType: IDfuDeviceType;
  productId: number;
  vendorId: number;
  memorySize: number;
  bootloaderSize: number;
  bootloaderLocation: number;
  flashPageSize: number;
  eepromPageSize: number;
  eepromMemorySize: number;
};

export const dfuTargetMappings: IDfuTargetMapping[] = [
  {
    name: 'at90usb1287',
    deviceType: 'adc_avr',
    productId: 0x2ffb,
    vendorId: 0x03eb,
    memorySize: 0x20000,
    bootloaderSize: 0x2000,
    bootloaderLocation: BOOTLOADER_LOCATION.TOP,
    flashPageSize: 128,
    eepromPageSize: 128,
    eepromMemorySize: 0x1000,
  },
  {
    name: 'at90usb1286',
    deviceType: 'adc_avr',
    productId: 0x2ffb,
    vendorId: 0x03eb,
    memorySize: 0x20000,
    bootloaderSize: 0x2000,
    bootloaderLocation: BOOTLOADER_LOCATION.TOP,
    flashPageSize: 128,
    eepromPageSize: 128,
    eepromMemorySize: 0x1000,
  },
  {
    name: 'at90usb1287-4k',
    deviceType: 'adc_avr',
    productId: 0x2ffb,
    vendorId: 0x03eb,
    memorySize: 0x20000,
    bootloaderSize: 0x1000,
    bootloaderLocation: BOOTLOADER_LOCATION.TOP,
    flashPageSize: 128,
    eepromPageSize: 128,
    eepromMemorySize: 0x1000,
  },
  {
    name: 'at90usb647',
    deviceType: 'adc_avr',
    productId: 0x2ff9,
    vendorId: 0x03eb,
    memorySize: 0x10000,
    bootloaderSize: 0x2000,
    bootloaderLocation: BOOTLOADER_LOCATION.TOP,
    flashPageSize: 128,
    eepromPageSize: 128,
    eepromMemorySize: 0x0800,
  },
  {
    name: 'at90usb646',
    deviceType: 'adc_avr',
    productId: 0x2ff9,
    vendorId: 0x03eb,
    memorySize: 0x10000,
    bootloaderSize: 0x2000,
    bootloaderLocation: BOOTLOADER_LOCATION.TOP,
    flashPageSize: 128,
    eepromPageSize: 128,
    eepromMemorySize: 0x0800,
  },
  {
    name: 'at90usb162',
    deviceType: 'adc_avr',
    productId: 0x2ffa,
    vendorId: 0x03eb,
    memorySize: 0x04000,
    bootloaderSize: 0x1000,
    bootloaderLocation: BOOTLOADER_LOCATION.TOP,
    flashPageSize: 128,
    eepromPageSize: 128,
    eepromMemorySize: 0x0200,
  },
  {
    name: 'at90usb82',
    deviceType: 'adc_avr',
    productId: 0x2ff7,
    vendorId: 0x03eb,
    memorySize: 0x02000,
    bootloaderSize: 0x1000,
    bootloaderLocation: BOOTLOADER_LOCATION.TOP,
    flashPageSize: 128,
    eepromPageSize: 128,
    eepromMemorySize: 0x0200,
  },
  {
    name: 'atmega32u6',
    deviceType: 'adc_avr',
    productId: 0x2ff2,
    vendorId: 0x03eb,
    memorySize: 0x08000,
    bootloaderSize: 0x1000,
    bootloaderLocation: BOOTLOADER_LOCATION.TOP,
    flashPageSize: 128,
    eepromPageSize: 128,
    eepromMemorySize: 0x0400,
  },
  {
    name: 'atmega32u4',
    deviceType: 'adc_avr',
    productId: 0x2ff4,
    vendorId: 0x03eb,
    memorySize: 0x08000,
    bootloaderSize: 0x1000,
    bootloaderLocation: BOOTLOADER_LOCATION.TOP,
    flashPageSize: 128,
    eepromPageSize: 128,
    eepromMemorySize: 0x0400,
  },
  {
    name: 'atmega32u2',
    deviceType: 'adc_avr',
    productId: 0x2ff0,
    vendorId: 0x03eb,
    memorySize: 0x08000,
    bootloaderSize: 0x1000,
    bootloaderLocation: BOOTLOADER_LOCATION.TOP,
    flashPageSize: 128,
    eepromPageSize: 128,
    eepromMemorySize: 0x0400,
  },
  {
    name: 'atmega16u4',
    deviceType: 'adc_avr',
    productId: 0x2ff3,
    vendorId: 0x03eb,
    memorySize: 0x04000,
    bootloaderSize: 0x1000,
    bootloaderLocation: BOOTLOADER_LOCATION.TOP,
    flashPageSize: 128,
    eepromPageSize: 128,
    eepromMemorySize: 0x0200,
  },
  {
    name: 'atmega16u2',
    deviceType: 'adc_avr',
    productId: 0x2fef,
    vendorId: 0x03eb,
    memorySize: 0x04000,
    bootloaderSize: 0x1000,
    bootloaderLocation: BOOTLOADER_LOCATION.TOP,
    flashPageSize: 128,
    eepromPageSize: 128,
    eepromMemorySize: 0x0200,
  },
  {
    name: 'atmega8u2',
    deviceType: 'adc_avr',
    productId: 0x2fee,
    vendorId: 0x03eb,
    memorySize: 0x02000,
    bootloaderSize: 0x1000,
    bootloaderLocation: BOOTLOADER_LOCATION.TOP,
    flashPageSize: 128,
    eepromPageSize: 128,
    eepromMemorySize: 0x0200,
  },
];

// export interface ICreateDfuBootloaderResult extends IResult {
//   bootloader?: IBootloader;
// }

export class DfuBootloader {
  private constructor() {
    // N/A
  }

  static createDfuBootloader(
    usb: IUsb,
    progress: FirmwareWriterProgressListener
  ): IResult<{ bootloader: IBootloader }> {
    const getDeviceInformationResult = usb.getDeviceInformation();
    if (isError(getDeviceInformationResult)) {
      return getDeviceInformationResult;
    }
    const vendorId = getDeviceInformationResult.value.vendorId;
    const productId = getDeviceInformationResult.value.productId;
    progress(`Device detected: Vendor ID:${vendorId}, Product ID:${productId}`);
    const dfuTargetMapping: IDfuTargetMapping | undefined =
      dfuTargetMappings.find(
        (mapping) =>
          mapping.vendorId === vendorId && mapping.productId === productId
      );
    if (!dfuTargetMapping) {
      return errorResultOf(
        `Unsupported device: Vendor ID: ${vendorId.toString(
          16
        )} Product ID: ${productId.toString(16)}`
      );
    }
    progress(
      `DFU target mapping found: Name:${dfuTargetMapping.name}, Device type:${dfuTargetMapping.deviceType}, Bootloader size:${dfuTargetMapping.bootloaderSize}, Bootloader location:${dfuTargetMapping.bootloaderLocation}, Memory size:${dfuTargetMapping.memorySize}, Flash page size:${dfuTargetMapping.flashPageSize} EEPROM memory size:${dfuTargetMapping.eepromMemorySize} EEPROM page size:${dfuTargetMapping.eepromPageSize}`
    );
    switch (dfuTargetMapping.deviceType) {
      case 'adc_avr':
        progress(`Use Atmel DFU Bootloader.`);
        return successResultOf({
          bootloader: new AtmelDfuBootloader(usb, dfuTargetMapping),
        });
      default:
        return errorResultOf(
          `Unsupported device type: ${dfuTargetMapping.deviceType}`
        );
    }
  }
}
