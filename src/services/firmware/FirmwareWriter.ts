import { IErrorHandler, IResult } from './Types';
import { IFirmware } from '../storage/Storage';

export type FirmwareWriterProgressListener = (
  message: string,
  lineBreak?: boolean
) => void;

export interface IFirmwareWriterReadResult extends IResult {
  bytes?: Uint8Array;
}

export type IFirmwareWriterPhase =
  | 'opened'
  | 'initialized'
  | 'cleared'
  | 'read'
  | 'wrote'
  | 'verified'
  | 'closed';

export type FirmwareWriterPhaseListener = (phase: IFirmwareWriterPhase) => void;

export interface IFirmwareWriter {
  read(
    firmware: IFirmware,
    size: number,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener,
    errorHandler: IErrorHandler
  ): Promise<IFirmwareWriterReadResult>;
  verify(
    firmware: IFirmware,
    bytes: Uint8Array,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener,
    errorHandler: IErrorHandler
  ): Promise<IResult>;
  write(
    firmware: IFirmware,
    flashBytes: Uint8Array,
    eepromBytes: Uint8Array | null,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener,
    errorHandler: IErrorHandler
  ): Promise<IResult>;
}
