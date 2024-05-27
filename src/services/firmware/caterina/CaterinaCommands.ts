import { AbstractCommand, ICommandRequest, ICommandResponse } from '../Command';
import { FirmwareFlashType, IResult } from '../Types';
import { ISerial } from '../serial/Serial';
import { encodeStringToBytes } from '../../../utils/StringUtils';
import { concatUint8Array } from '../../../utils/ArrayUtils';

abstract class AbstractCaterinaCommand<
  TRequest extends ICommandRequest,
  TResponse extends ICommandResponse,
> extends AbstractCommand<TRequest, TResponse> {
  protected async verify(serial: ISerial): Promise<IResult> {
    const readResult = await serial.readBytes(1, this.getVerifyTimeout());
    if (!readResult.success) {
      return readResult;
    }
    const resultCode = readResult.bytes![0];
    if (resultCode !== '\r'.charCodeAt(0)) {
      return {
        success: false,
        error: `The command failed. The result code: ${resultCode}`,
      };
    }
    return {
      success: true,
    };
  }
}

export interface IFetchSoftwareIdentifierCommandResponse
  extends ICommandResponse {
  softwareIdentifier: string;
}

export class FetchSoftwareIdentifierCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  IFetchSoftwareIdentifierCommandResponse
> {
  createRequest(): string | Uint8Array | null {
    return 'S';
  }

  createResponse(
    resultArray: Uint8Array
  ): IFetchSoftwareIdentifierCommandResponse {
    return {
      softwareIdentifier: new TextDecoder().decode(
        Uint8Array.from(resultArray)
      ),
    };
  }

  getReadBytesLength(): number {
    return 7;
  }
}

export interface IFetchVersionNumberResponse extends ICommandResponse {
  versionNumber: number;
}

export class FetchVersionNumberCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  IFetchVersionNumberResponse
> {
  createRequest(): string | Uint8Array | null {
    return 'v';
  }

  createResponse(resultArray: Uint8Array): IFetchVersionNumberResponse {
    return {
      versionNumber: resultArray[0],
    };
  }

  getReadBytesLength(): number {
    return 1;
  }
}

export interface IFetchRevisionNumberResponse extends ICommandResponse {
  revisionNumber: number;
}

export class FetchRevisionNumberCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  IFetchRevisionNumberResponse
> {
  createRequest(): string | Uint8Array | null {
    return null;
  }

  createResponse(resultArray: Uint8Array): IFetchRevisionNumberResponse {
    return {
      revisionNumber: resultArray[0],
    };
  }

  getReadBytesLength(): number {
    return 1;
  }
}

export interface IFetchProgramTypeResponse extends ICommandResponse {
  programType: number;
}

export class FetchProgramTypeCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  IFetchProgramTypeResponse
> {
  createRequest(): string | Uint8Array | null {
    return 'p';
  }

  createResponse(resultArray: Uint8Array): IFetchProgramTypeResponse {
    return {
      programType: resultArray[0],
    };
  }

  getReadBytesLength(): number {
    return 1;
  }
}

export interface IFetchAutoAddressIncrementSupportResponse
  extends ICommandResponse {
  autoAddressIncrementSupport: boolean;
}

export class FetchAutoAddressIncrementSupportCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  IFetchAutoAddressIncrementSupportResponse
> {
  createRequest(): string | Uint8Array | null {
    return 'a';
  }

  createResponse(
    resultArray: Uint8Array
  ): IFetchAutoAddressIncrementSupportResponse {
    return {
      autoAddressIncrementSupport: resultArray[0] === 'Y'.charCodeAt(0),
    };
  }

  getReadBytesLength(): number {
    return 1;
  }
}

export interface IFetchBufferAccessResponse extends ICommandResponse {
  bufferAccess: boolean;
}

export class FetchBufferAccessCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  IFetchBufferAccessResponse
> {
  createRequest(): string | Uint8Array | null {
    return 'b';
  }

  createResponse(resultArray: Uint8Array): IFetchBufferAccessResponse {
    return {
      bufferAccess: resultArray[0] === 'Y'.charCodeAt(0),
    };
  }

  getReadBytesLength(): number {
    return 1;
  }
}

export interface IFetchBufferSizeResponse extends ICommandResponse {
  bufferSize: number;
}

export class FetchBufferSizeCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  IFetchBufferSizeResponse
> {
  createRequest(): string | Uint8Array | null {
    return null;
  }

  createResponse(resultArray: Uint8Array): IFetchBufferSizeResponse {
    return {
      bufferSize: (resultArray[0] << 8) | resultArray[1],
    };
  }

  getReadBytesLength(): number {
    return 2;
  }
}

export interface IFetchDeviceTypeResponse extends ICommandResponse {
  deviceType: number;
}

export class FetchDeviceTypeCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  IFetchDeviceTypeResponse
> {
  createRequest(): string | Uint8Array | null {
    return 't';
  }

  createResponse(resultArray: Uint8Array): IFetchDeviceTypeResponse {
    return {
      deviceType: resultArray[0],
    };
  }

  getReadBytesLength(): number {
    return 1;
  }
}

export interface ISetDeviceTypeRequest extends ICommandRequest {
  deviceType: number;
}

export class SetDeviceTypeCommand extends AbstractCaterinaCommand<
  ISetDeviceTypeRequest,
  ICommandResponse
> {
  createRequest(): string | Uint8Array | null {
    return concatUint8Array(
      encodeStringToBytes('T'),
      Uint8Array.from([this.getRequest()!.deviceType])
    );
  }

  // eslint-disable-next-line no-unused-vars
  createResponse(resultArray: Uint8Array): ICommandResponse {
    return {};
  }

  getReadBytesLength(): number {
    return 0;
  }

  protected isVerify(): boolean {
    return true;
  }
}

export interface IFetchExtendedFuseBitsResponse extends ICommandResponse {
  extendedFuseBits: number;
}

export class FetchExtendedFuseBitsCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  IFetchExtendedFuseBitsResponse
> {
  createRequest(): string | Uint8Array | null {
    return 'Q';
  }

  createResponse(resultArray: Uint8Array): IFetchExtendedFuseBitsResponse {
    return {
      extendedFuseBits: resultArray[0],
    };
  }

  getReadBytesLength(): number {
    return 1;
  }
}

export interface IFetchLowFuseBitsResponse extends ICommandResponse {
  lowFuseBits: number;
}

export class FetchLowFuseBitsCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  IFetchLowFuseBitsResponse
> {
  createRequest(): string | Uint8Array | null {
    return 'F';
  }

  createResponse(resultArray: Uint8Array): IFetchLowFuseBitsResponse {
    return {
      lowFuseBits: resultArray[0],
    };
  }

  getReadBytesLength(): number {
    return 1;
  }
}

export interface IFetchHighFuseBitsResponse extends ICommandResponse {
  highFuseBits: number;
}

export class FetchHighFuseBitsCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  IFetchHighFuseBitsResponse
> {
  createRequest(): string | Uint8Array | null {
    return 'N';
  }

  createResponse(resultArray: Uint8Array): IFetchHighFuseBitsResponse {
    return {
      highFuseBits: resultArray[0],
    };
  }

  getReadBytesLength(): number {
    return 1;
  }
}

export interface IFetchLockBitsResponse extends ICommandResponse {
  lockBits: number;
}

export class FetchLockBitsCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  IFetchLockBitsResponse
> {
  createRequest(): string | Uint8Array | null {
    return 'r';
  }

  createResponse(resultArray: Uint8Array): IFetchLockBitsResponse {
    return {
      lockBits: resultArray[0],
    };
  }

  getReadBytesLength(): number {
    return 1;
  }
}

export interface IFetchSignatureResponse extends ICommandResponse {
  signature: number;
}

export class FetchSignatureCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  IFetchSignatureResponse
> {
  createRequest(): string | Uint8Array | null {
    return 's';
  }

  createResponse(resultArray: Uint8Array): IFetchSignatureResponse {
    return {
      signature:
        (resultArray[2] << 16) | (resultArray[1] << 8) | resultArray[0],
    };
  }

  getReadBytesLength(): number {
    return 3;
  }
}

export interface ISetAddressRequest extends ICommandRequest {
  address: number;
}

export class SetAddressCommand extends AbstractCaterinaCommand<
  ISetAddressRequest,
  ICommandResponse
> {
  createRequest(): string | Uint8Array | null {
    const request = this.getRequest();
    const address = request!.address;
    const command = Array(3);
    command[0] = 'A'.charCodeAt(0);
    command[1] = address >> 8;
    command[2] = address & 0xff;
    return Uint8Array.from(command);
  }

  // eslint-disable-next-line no-unused-vars
  createResponse(resultArray: Uint8Array): ICommandResponse {
    return {};
  }

  getReadBytesLength(): number {
    return 0;
  }

  protected isVerify(): boolean {
    return true;
  }
}

export class ExitCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  ICommandResponse
> {
  createRequest(): string | Uint8Array | null {
    return 'E';
  }

  // eslint-disable-next-line no-unused-vars
  createResponse(resultArray: Uint8Array): ICommandResponse {
    return {};
  }

  getReadBytesLength(): number {
    return 0;
  }

  protected isVerify(): boolean {
    return true;
  }
}

export interface IFetchBytesFromMemoryRequest extends ICommandRequest {
  flashType: FirmwareFlashType;
  bufferSize: number;
}

export interface IFetchBytesFromMemoryResponse extends ICommandResponse {
  bytes: Uint8Array;
  blockSize: number;
}

export class FetchBytesFromMemoryCommand extends AbstractCaterinaCommand<
  IFetchBytesFromMemoryRequest,
  IFetchBytesFromMemoryResponse
> {
  private blockSize: number;

  constructor(request: IFetchBytesFromMemoryRequest) {
    super(request);
    this.blockSize = 0;
  }

  createRequest(): string | Uint8Array | null {
    const request = this.getRequest();
    const flashType = request!.flashType;
    const bufferSize = request!.bufferSize;
    const command = Array(4);
    command[0] = 'g'.charCodeAt(0);
    if (flashType === 'flash') {
      command[3] = 'F'.charCodeAt(0);
      this.blockSize = bufferSize;
    } else if (flashType === 'eeprom') {
      command[3] = 'E'.charCodeAt(0);
      this.blockSize = 1;
    } else {
      throw new Error('Unknown flash type.');
    }
    command[1] = this.blockSize >> 8;
    command[2] = this.blockSize & 0xff;
    return Uint8Array.from(command);
  }

  createResponse(resultArray: Uint8Array): IFetchBytesFromMemoryResponse {
    return {
      bytes: resultArray,
      blockSize: this.blockSize,
    };
  }

  getReadBytesLength(): number {
    return this.blockSize;
  }
}

export class EnterProgramModeCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  ICommandResponse
> {
  createRequest(): string | Uint8Array | null {
    return 'P';
  }

  // eslint-disable-next-line no-unused-vars
  createResponse(resultArray: Uint8Array): ICommandResponse {
    return {};
  }

  getReadBytesLength(): number {
    return 0;
  }

  protected isVerify(): boolean {
    return true;
  }
}

export class LeaveProgramModeCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  ICommandResponse
> {
  createRequest(): string | Uint8Array | null {
    return 'L';
  }

  // eslint-disable-next-line no-unused-vars
  createResponse(resultArray: Uint8Array): ICommandResponse {
    return {};
  }

  getReadBytesLength(): number {
    return 0;
  }

  protected isVerify(): boolean {
    return true;
  }
}

export class ClearApplicationSectionOfFlashCommand extends AbstractCaterinaCommand<
  ICommandRequest,
  ICommandResponse
> {
  createRequest(): string | Uint8Array | null {
    return 'e';
  }

  // eslint-disable-next-line no-unused-vars
  createResponse(resultArray: Uint8Array): ICommandResponse {
    return {};
  }

  getReadBytesLength(): number {
    return 0;
  }

  protected isVerify(): boolean {
    return true;
  }

  protected getVerifyTimeout(): number {
    return 6000;
  }
}

export interface IWriteBytesToMemoryRequest extends ICommandRequest {
  bytes: Uint8Array;
  flashType: FirmwareFlashType;
  blockSize: number;
}

export class WriteBytesToMemoryCommand extends AbstractCaterinaCommand<
  IWriteBytesToMemoryRequest,
  ICommandResponse
> {
  createRequest(): string | Uint8Array | null {
    const request = this.getRequest()!;
    const bytes = request.bytes;
    const flashType = request.flashType;
    const blockSize = request.blockSize;
    const command = Array(4);
    command[0] = 'B'.charCodeAt(0);
    command[1] = blockSize >> 8;
    command[2] = blockSize & 0xff;
    if (flashType === 'flash') {
      command[3] = 'F'.charCodeAt(0);
    } else if (flashType === 'eeprom') {
      command[3] = 'E'.charCodeAt(0);
    } else {
      throw new Error(`Unknown flash type: ${flashType}`);
    }
    return concatUint8Array(Uint8Array.from(command), bytes);
  }

  // eslint-disable-next-line no-unused-vars
  createResponse(resultArray: Uint8Array): ICommandResponse {
    return {};
  }

  getReadBytesLength(): number {
    return 0;
  }

  protected isVerify(): boolean {
    return true;
  }
}
