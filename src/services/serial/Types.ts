export type IResult = {
  success: boolean;
  error?: string;
  cause?: any;
};

export const ALL_FIRMWARE_FLASH_TYPE = ['flash', 'eeprom'] as const;
type firmwareFlashTypeTuple = typeof ALL_FIRMWARE_FLASH_TYPE;
export type FirmwareFlashType = firmwareFlashTypeTuple[number];

export type IMcu = {
  signature: number;
  flashMemorySize: number;
  eepromSize: number;
  bootAddress: number;
};

export const ALL_MCU_TYPE = ['atmega32u4'] as const;
type mcuTypeTuple = typeof ALL_MCU_TYPE;
export type IMcuType = mcuTypeTuple[number];

export interface IMcuMap {
  atmega32u4: IMcu;
}

export const MCU: IMcuMap = {
  atmega32u4: {
    signature: 0x1e9587,
    flashMemorySize: 32768,
    eepromSize: 1024,
    bootAddress: 0x7000,
  },
};

export const ALL_BOOTLOADER_TYPE = ['caterina'] as const;
type bootloaderTypeTuple = typeof ALL_BOOTLOADER_TYPE;
export type IBootloaderType = bootloaderTypeTuple[number];

// eslint-disable-next-line no-unused-vars
export type IErrorHandler = (error: string, cause?: any) => void;
