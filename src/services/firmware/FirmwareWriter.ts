import { IBootloaderType, IErrorHandler, IResult } from './Types';

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
  write(
    bootloaderType: IBootloaderType,
    flashBytes: Uint8Array,
    eepromBytes: Uint8Array | null,
    progress: FirmwareWriterProgressListener,
    phase: FirmwareWriterPhaseListener,
    errorHandler: IErrorHandler
  ): Promise<IResult>;
}
