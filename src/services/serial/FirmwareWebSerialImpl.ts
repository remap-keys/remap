import {
  FirmwareOperationProgressListener,
  IFirmware,
  IFirmwareReadResult,
} from './Firmware';
import { CaterinaBootloader } from './caterina/CaterinaBootloader';
import { WebSerial } from './WebSerial';
import { IErrorHandler, IResult } from './Types';

const BAUD_RATE = 115200;
const BUFFER_SIZE = 81920;
const CHUNK_SIZE = 128;

export class FirmwareWebSerialImpl implements IFirmware {
  async read(
    size: number,
    progress: FirmwareOperationProgressListener,
    errorHandler: IErrorHandler
  ): Promise<IFirmwareReadResult> {
    const serial = new WebSerial(CHUNK_SIZE);
    const openResult = await serial.open(BAUD_RATE, BUFFER_SIZE, errorHandler);
    if (!openResult.success) {
      return openResult;
    }
    const bootloader = new CaterinaBootloader(serial);
    const readResult = await bootloader.read(size, progress);
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
    progress: FirmwareOperationProgressListener,
    errorHandler: IErrorHandler
  ): Promise<IResult> {
    const serial = new WebSerial(CHUNK_SIZE);
    const openResult = await serial.open(BAUD_RATE, BUFFER_SIZE, errorHandler);
    if (!openResult.success) {
      return openResult;
    }
    const bootloader = new CaterinaBootloader(serial);
    return await bootloader.verify(bytes, progress);
  }

  // eslint-disable-next-line no-unused-vars
  write(progressListener: FirmwareOperationProgressListener): Promise<void> {
    return Promise.resolve(undefined);
  }
}
