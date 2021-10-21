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
    progressListener: FirmwareOperationProgressListener,
    errorHandler: IErrorHandler
  ): Promise<IFirmwareReadResult>;
  verify(
    bytes: Uint8Array,
    progressListener: FirmwareOperationProgressListener,
    errorHandler: IErrorHandler
  ): Promise<IResult>;
  write(progressListener: FirmwareOperationProgressListener): Promise<void>;
}
