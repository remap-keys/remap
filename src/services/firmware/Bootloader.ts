import {
  FirmwareWriterPhaseListener,
  FirmwareWriterProgressListener,
} from './FirmwareWriter';
import { IResult } from './Types';

export interface IBootloaderReadResult extends IResult {
  bytes?: Uint8Array;
}

export interface IBootloader {
  read(
    // eslint-disable-next-line no-unused-vars
    size: number,
    // eslint-disable-next-line no-unused-vars
    progress: FirmwareWriterProgressListener,
    // eslint-disable-next-line no-unused-vars
    phase: FirmwareWriterPhaseListener,
  ): Promise<IBootloaderReadResult>;

  write(
    // eslint-disable-next-line no-unused-vars
    flashBytes: Uint8Array,
    // eslint-disable-next-line no-unused-vars
    eepromBytes: Uint8Array | null,
    // eslint-disable-next-line no-unused-vars
    progress: FirmwareWriterProgressListener,
    // eslint-disable-next-line no-unused-vars
    phase: FirmwareWriterPhaseListener,
  ): Promise<IResult>;

  verify(
    // eslint-disable-next-line no-unused-vars
    bytes: Uint8Array,
    // eslint-disable-next-line no-unused-vars
    progress: FirmwareWriterProgressListener,
    // eslint-disable-next-line no-unused-vars
    phase: FirmwareWriterPhaseListener,
  ): Promise<IResult>;
}
