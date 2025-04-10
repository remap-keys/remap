import { IEmptyResult, IResult } from '../../types';
import {
  FirmwareWriterPhaseListener,
  FirmwareWriterProgressListener,
} from './FirmwareWriter';

export interface IBootloader {
  read(
    // eslint-disable-next-line no-unused-vars
    size: number,
    // eslint-disable-next-line no-unused-vars
    progress: FirmwareWriterProgressListener,
    // eslint-disable-next-line no-unused-vars
    phase: FirmwareWriterPhaseListener
  ): Promise<IResult<{ bytes: Uint8Array }>>;

  write(
    // eslint-disable-next-line no-unused-vars
    flashBytes: Uint8Array,
    // eslint-disable-next-line no-unused-vars
    eepromBytes: Uint8Array | null,
    // eslint-disable-next-line no-unused-vars
    progress: FirmwareWriterProgressListener,
    // eslint-disable-next-line no-unused-vars
    phase: FirmwareWriterPhaseListener
  ): Promise<IEmptyResult>;

  verify(
    // eslint-disable-next-line no-unused-vars
    bytes: Uint8Array,
    // eslint-disable-next-line no-unused-vars
    progress: FirmwareWriterProgressListener,
    // eslint-disable-next-line no-unused-vars
    phase: FirmwareWriterPhaseListener
  ): Promise<IEmptyResult>;
}
