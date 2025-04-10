import { IEmptyResult, IResult } from '../../../types';
import { IErrorHandler } from '../Types';

export interface ISerial {
  open(
    baudRate: number,
    bufferSize: number,
    errorHandler: IErrorHandler
  ): Promise<IEmptyResult>;
  writeString(message: string): Promise<IEmptyResult>;
  writeBytes(bytes: Uint8Array): Promise<IEmptyResult>;
  readBytes(
    size: number,
    timeout: number
  ): Promise<IResult<{ bytes: Uint8Array }>>;
  skipBytesUntilNonZero(timeout: number): Promise<IEmptyResult>;
  close(): Promise<void>;
}
