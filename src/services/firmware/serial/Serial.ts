import { IErrorHandler, IResult } from '../Types';

export interface ISerialReadBytesResult extends IResult {
  bytes?: Uint8Array;
}

export interface ISerial {
  open(
    baudRate: number,
    bufferSize: number,
    errorHandler: IErrorHandler,
  ): Promise<IResult>;
  writeString(message: string): Promise<IResult>;
  writeBytes(bytes: Uint8Array): Promise<IResult>;
  readBytes(size: number, timeout: number): Promise<ISerialReadBytesResult>;
  skipBytesUntilNonZero(timeout: number): Promise<IResult>;
  close(): Promise<void>;
}
