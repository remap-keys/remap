import { IResult } from './Types';

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
    progressListener: FirmwareOperationProgressListener
  ): Promise<IFirmwareReadResult>;
  verify(progressListener: FirmwareOperationProgressListener): Promise<void>;
  write(progressListener: FirmwareOperationProgressListener): Promise<void>;
}
