import { ISerial } from './serial/Serial';
import { IResult } from './Types';

export interface ICommandRequest {}

export interface ICommandResponse {}

export interface ICommandResult<T> {
  success: boolean;
  response?: T;
  error?: string;
  cause?: any;
}

export interface ICommandResponseHandler<T extends ICommandResponse> {
  // eslint-disable-next-line
  (result: ICommandResult<T>): Promise<void>;
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
  protected async verify(_serial: ISerial): Promise<IResult> {
    return {
      success: false,
      error: 'Verification logic not implemented.',
    };
  }

  abstract createRequest(): string | Uint8Array | null;
  abstract getReadBytesLength(): number;
  // eslint-disable-next-line no-unused-vars
  abstract createResponse(resultArray: Uint8Array): TResponse;

  async writeRequest(serial: ISerial): Promise<ICommandResult<TResponse>> {
    const request = this.createRequest();
    if (request !== null) {
      let writeResult;
      if (typeof request === 'string') {
        writeResult = await serial.writeString(request as string);
      } else {
        writeResult = await serial.writeBytes(request as Uint8Array);
      }
      if (!writeResult.success) {
        return {
          success: false,
          error: writeResult.error,
          cause: writeResult.cause,
        };
      }
    }
    const readBytesLength = this.getReadBytesLength();
    if (readBytesLength > 0) {
      const readResult = await serial.readBytes(
        this.getReadBytesLength(),
        this.getTimeout()
      );
      if (!readResult.success) {
        return {
          success: false,
          error: readResult.error,
          cause: readResult.cause,
        };
      }
      if (this.isVerify()) {
        const verifyResult = await this.verify(serial);
        if (!verifyResult.success) {
          return verifyResult;
        }
      }
      return {
        success: true,
        response: this.createResponse(readResult.bytes!),
      };
    } else {
      if (this.isVerify()) {
        const verifyResult = await this.verify(serial);
        if (!verifyResult.success) {
          return verifyResult;
        }
      }
      return {
        success: true,
      };
    }
  }
}
