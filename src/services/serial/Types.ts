export type IResult = {
  success: boolean;
  error?: string;
  cause?: any;
};

export type FirmwareFlashType = 'flash' | 'eeprom';

export type IMcu = {
  signature: number;
  flashMemorySize: number;
  eepromSize: number;
  bootAddress: number;
};

export const MCU = {
  atmega32u4: {
    signature: 0x1e9587,
    flashMemorySize: 32768,
    eepromSize: 1024,
    bootAddress: 0x7000,
  },
};

export type IErrorHandler = (error: string, cause?: any) => void;
