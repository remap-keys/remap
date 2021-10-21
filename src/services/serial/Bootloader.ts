import { FirmwareOperationProgressListener } from './Firmware';
import { IResult } from './Types';
import { ISerial } from './Serial';

export interface IBootloaderReadResult extends IResult {
  bytes?: Uint8Array;
}

export abstract class AbstractBootloader {
  protected serial: ISerial;

  protected constructor(serial: ISerial) {
    this.serial = serial;
  }

  abstract read(
    // eslint-disable-next-line no-unused-vars
    size: number,
    // eslint-disable-next-line no-unused-vars
    progress: FirmwareOperationProgressListener
  ): Promise<IBootloaderReadResult>;

  abstract write(
    // eslint-disable-next-line no-unused-vars
    flashBytes: Uint8Array,
    // eslint-disable-next-line no-unused-vars
    eepromBytes: Uint8Array | null,
    // eslint-disable-next-line no-unused-vars
    progress: FirmwareOperationProgressListener
  ): Promise<IResult>;

  abstract verify(
    // eslint-disable-next-line no-unused-vars
    bytes: Uint8Array,
    // eslint-disable-next-line no-unused-vars
    progress: FirmwareOperationProgressListener
  ): Promise<IResult>;
}
