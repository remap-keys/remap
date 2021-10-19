import { IResult } from './Types';

export type ISerialReadBytesErrorHandler = (error: string, cause?: any) => void;
export interface ISerialReadBytesResult extends IResult {
  bytes?: Uint8Array;
}

export interface ISerial {
  open(): Promise<IResult>;
  start(errorHandler: ISerialReadBytesErrorHandler): void;
  writeString(message: string): Promise<IResult>;
  writeBytes(bytes: Uint8Array): Promise<IResult>;
  readBytes(size: number, timeout: number): Promise<ISerialReadBytesResult>;
  skipBytesUntilNonZero(timeout: number): Promise<IResult>;
  close(): Promise<void>;
}
