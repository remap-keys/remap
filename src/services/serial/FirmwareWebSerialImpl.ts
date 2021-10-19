import {
  FirmwareOperationProgressListener,
  IFirmware,
  IFirmwareReadResult,
} from './Firmware';
import { CaterinaBootloader } from './caterina/CaterinaBootloader';
import { WebSerial } from './WebSerial';

export class FirmwareWebSerialImpl implements IFirmware {
  async read(
    size: number,
    progress: FirmwareOperationProgressListener
  ): Promise<IFirmwareReadResult> {
    const serial = await WebSerial.openWebSerialPort(progress);
    const bootloader = new CaterinaBootloader(serial);
    const readResult = await bootloader.read(size, progress);
    if (!readResult.success) {
      return {
        success: false,
        error: readResult.error,
        cause: readResult.cause,
      };
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
