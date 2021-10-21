import {
  FirmwareOperationProgressListener,
  IFirmware,
  IFirmwareReadResult,
} from './Firmware';
import { CaterinaBootloader } from './caterina/CaterinaBootloader';
import { WebSerial } from './WebSerial';
import { IErrorHandler } from './Types';

export class FirmwareWebSerialImpl implements IFirmware {
  async read(
    size: number,
    progress: FirmwareOperationProgressListener,
    errorHandler: IErrorHandler
  ): Promise<IFirmwareReadResult> {
    const serial = new WebSerial(128);
    const openResult = await serial.open(115200, 81920, errorHandler);
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
  verify(progressListener: FirmwareOperationProgressListener): Promise<void> {
    return Promise.resolve(undefined);
  }

  // eslint-disable-next-line no-unused-vars
  write(progressListener: FirmwareOperationProgressListener): Promise<void> {
    return Promise.resolve(undefined);
  }
}
