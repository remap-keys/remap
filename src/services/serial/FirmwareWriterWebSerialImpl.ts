import {
  FirmwareWriterPhaseListener,
  FirmwareWriterProgressListener,
  IFirmwareWriter,
  IFirmwareWriterReadResult,
} from './FirmwareWriter';
import { CaterinaBootloader } from './caterina/CaterinaBootloader';
import { WebSerial } from './WebSerial';
import { IErrorHandler, IResult } from './Types';

const BAUD_RATE = 115200;
const BUFFER_SIZE = 81920;
const CHUNK_SIZE = 128;

export class FirmwareWriterWebSerialImpl implements IFirmwareWriter {
  async read(
    size: number,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener,
    errorHandler: IErrorHandler
  ): Promise<IFirmwareWriterReadResult> {
    const serial = new WebSerial(CHUNK_SIZE);
    const openResult = await serial.open(BAUD_RATE, BUFFER_SIZE, errorHandler);
    if (!openResult.success) {
      return openResult;
    }
    phase('opened');
    // TODO Check the MCU type.
    const bootloader = new CaterinaBootloader(serial);
    const readResult = await bootloader.read(size, progress, phase);
    if (!readResult.success) {
      return readResult;
    }
    return {
      success: true,
      bytes: readResult.bytes!,
    };
  }

  // eslint-disable-next-line no-unused-vars
  async verify(
    bytes: Uint8Array,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener,
    errorHandler: IErrorHandler
  ): Promise<IResult> {
    const serial = new WebSerial(CHUNK_SIZE);
    const openResult = await serial.open(BAUD_RATE, BUFFER_SIZE, errorHandler);
    if (!openResult.success) {
      return openResult;
    }
    phase('opened');
    // TODO Check the MCU type.
    const bootloader = new CaterinaBootloader(serial);
    return await bootloader.verify(bytes, progress, phase);
  }

  // eslint-disable-next-line no-unused-vars
  async write(
    flashBytes: Uint8Array,
    eepromBytes: Uint8Array | null,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener,
    errorHandler: IErrorHandler
  ): Promise<IResult> {
    const serial = new WebSerial(CHUNK_SIZE);
    const openResult = await serial.open(BAUD_RATE, BUFFER_SIZE, errorHandler);
    if (!openResult.success) {
      return openResult;
    }
    phase('opened');
    // TODO Check the MCU type.
    const bootloader = new CaterinaBootloader(serial);
    return await bootloader.write(flashBytes, eepromBytes, progress, phase);
  }
}
