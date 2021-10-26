import {
  FirmwareWriterPhaseListener,
  FirmwareWriterProgressListener,
  IFirmwareWriter,
  IFirmwareWriterReadResult,
} from './FirmwareWriter';
import { CaterinaBootloader } from './caterina/CaterinaBootloader';
import { WebSerial } from './serial/WebSerial';
import { IErrorHandler, IResult } from './Types';
import { IFirmware } from '../storage/Storage';
import { ISerial } from './serial/Serial';

const BAUD_RATE = 115200;
const BUFFER_SIZE = 81920;
const CHUNK_SIZE = 128;

export class FirmwareWriterWebApiImpl implements IFirmwareWriter {
  async read(
    firmware: IFirmware,
    size: number,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener,
    errorHandler: IErrorHandler
  ): Promise<IFirmwareWriterReadResult> {
    if (firmware.bootloader_type === 'caterina') {
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
      const bootloader = new CaterinaBootloader(serial);
      const readResult = await bootloader.read(size, progress, phase);
      if (!readResult.success) {
        return readResult;
      }
      return {
        success: true,
        bytes: readResult.bytes!,
      };
    } else {
      throw new Error(
        `Unknown MCU type: ${firmware.mcu_type}/${firmware.bootloader_type}`
      );
    }
  }

  // eslint-disable-next-line no-unused-vars
  async verify(
    firmware: IFirmware,
    bytes: Uint8Array,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener,
    errorHandler: IErrorHandler
  ): Promise<IResult> {
    if (firmware.bootloader_type === 'caterina') {
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
      const bootloader = new CaterinaBootloader(serial);
      return await bootloader.verify(bytes, progress, phase);
    } else {
      throw new Error(
        `Unknown MCU type: ${firmware.mcu_type}/${firmware.bootloader_type}`
      );
    }
  }

  // eslint-disable-next-line no-unused-vars
  async write(
    firmware: IFirmware,
    flashBytes: Uint8Array,
    eepromBytes: Uint8Array | null,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener,
    errorHandler: IErrorHandler
  ): Promise<IResult> {
    if (firmware.bootloader_type === 'caterina') {
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
      const bootloader = new CaterinaBootloader(serial);
      return await bootloader.write(flashBytes, eepromBytes, progress, phase);
    } else {
      throw new Error(
        `Unknown MCU type: ${firmware.mcu_type}/${firmware.bootloader_type}`
      );
    }
  }
}
