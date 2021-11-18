import {
  FirmwareWriterPhaseListener,
  FirmwareWriterProgressListener,
  IFirmwareWriter,
} from './FirmwareWriter';
import { CaterinaBootloader } from './caterina/CaterinaBootloader';
import { WebSerial } from './serial/WebSerial';
import { IBootloaderType, IErrorHandler, IResult } from './Types';
import { ISerial } from './serial/Serial';
import { IUsb } from './usb/Usb';
import WebUsb from './usb/WebUsb';
import { IBootloader } from './Bootloader';
import { DfuBootloader } from './dfu/DfuBootloader';

const BAUD_RATE = 115200;
const BUFFER_SIZE = 81920;
const CHUNK_SIZE = 128;

export class FirmwareWriterWebApiImpl implements IFirmwareWriter {
  async write(
    bootloaderType: IBootloaderType,
    flashBytes: Uint8Array,
    eepromBytes: Uint8Array | null,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener,
    errorHandler: IErrorHandler
  ): Promise<IResult> {
    if (bootloaderType === 'caterina') {
      const serial: ISerial = new WebSerial(CHUNK_SIZE);
      const openResult = await serial.open(
        BAUD_RATE,
        BUFFER_SIZE,
        errorHandler
      );
      if (!openResult.success) {
        return openResult;
      }
      phase('opened');
      const bootloader: IBootloader = new CaterinaBootloader(serial);
      return await bootloader.write(flashBytes, eepromBytes, progress, phase);
    } else if (bootloaderType === 'dfu') {
      const usb: IUsb = new WebUsb();
      const openResult = await usb.open();
      if (!openResult.success) {
        return openResult;
      }
      phase('opened');
      const createDfuBootloaderResult = DfuBootloader.createDfuBootloader(
        usb,
        progress
      );
      if (!createDfuBootloaderResult.success) {
        await usb.close();
        return createDfuBootloaderResult;
      }
      const bootloader: IBootloader = createDfuBootloaderResult.bootloader!;
      return await bootloader.write(flashBytes, eepromBytes, progress, phase);
    } else {
      throw new Error(`Unknown bootloader type: ${bootloaderType}`);
    }
  }
}
