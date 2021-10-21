import { IErrorHandler, IResult } from './Types';

export type FirmwareOperationProgressListener = (
  message: string,
  lineBreak?: boolean
) => void;

export interface IFirmwareReadResult extends IResult {
  bytes?: Uint8Array;
}

export interface IFirmware {
  read(
    size: number,
    progress: FirmwareOperationProgressListener,
    errorHandler: IErrorHandler
  ): Promise<IFirmwareReadResult>;
  verify(
    bytes: Uint8Array,
    progress: FirmwareOperationProgressListener,
    errorHandler: IErrorHandler
  ): Promise<IResult>;
  write(
    flashBytes: Uint8Array,
    eepromBytes: Uint8Array | null,
    progress: FirmwareOperationProgressListener,
    errorHandler: IErrorHandler
  ): Promise<IResult>;
}
