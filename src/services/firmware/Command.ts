import {
  errorResultOf,
  IEmptyResult,
  IResult,
  isError,
  successResultOf,
} from '../../types';
import { ISerial } from './serial/Serial';

export interface ICommandRequest {}

export interface ICommandResponse {}

export interface ICommandResponseHandler<T extends ICommandResponse> {
  // eslint-disable-next-line
  (result: IResult<{ response: T }>): Promise<void>;
}

export abstract class AbstractCommand<
  TRequest extends ICommandRequest,
  TResponse extends ICommandResponse,
> {
  private readonly request: TRequest | undefined;

  constructor(request?: TRequest) {
    this.request = request;
  }

  protected getRequest(): TRequest | undefined {
    return this.request;
  }

  protected getTimeout(): number {
    return 1000;
  }

  protected getVerifyTimeout(): number {
    return 1000;
  }

  protected isVerify(): boolean {
    return false;
  }

  // eslint-disable-next-line no-unused-vars
  protected async verify(_serial: ISerial): Promise<IEmptyResult> {
    return errorResultOf('Verification logic not implemented.');
  }

  abstract createRequest(): string | Uint8Array | null;
  abstract getReadBytesLength(): number;
  // eslint-disable-next-line no-unused-vars
  abstract createResponse(resultArray: Uint8Array): TResponse;

  async writeRequest(
    serial: ISerial
  ): Promise<IResult<{ response: TResponse }>> {
    const request = this.createRequest();
    if (request !== null) {
      let writeResult;
      if (typeof request === 'string') {
        writeResult = await serial.writeString(request as string);
      } else {
        writeResult = await serial.writeBytes(request as Uint8Array);
      }
      if (isError(writeResult)) {
        return writeResult;
      }
    }
    const readBytesLength = this.getReadBytesLength();
    if (readBytesLength > 0) {
      const readResult = await serial.readBytes(
        this.getReadBytesLength(),
        this.getTimeout()
      );
      if (isError(readResult)) {
        return readResult;
      }
      if (this.isVerify()) {
        const verifyResult = await this.verify(serial);
        if (isError(verifyResult)) {
          return verifyResult;
        }
      }
      return successResultOf({
        response: this.createResponse(readResult.value.bytes),
      });
    } else {
      if (this.isVerify()) {
        const verifyResult = await this.verify(serial);
        if (isError(verifyResult)) {
          return verifyResult;
        }
      }
      // No response expected, return an empty result.
      console.warn('No response expected, returning an empty result.');
      return successResultOf({
        response: this.createResponse(new Uint8Array(0)),
      });
    }
  }
}
