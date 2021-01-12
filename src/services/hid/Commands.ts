import {
  ICommandRequest,
  ICommandResponse,
  ICommandResponseHandler,
} from './WebHid';
import { ICommand } from './Hid';

export abstract class AbstractCommand<
  TRequest extends ICommandRequest,
  TResponse extends ICommandResponse
> implements ICommand {
  private readonly request: TRequest;
  private readonly responseHandler: ICommandResponseHandler<TResponse>;

  static OUTPUT_REPORT_ID: number = 0x00;

  constructor(
    request: TRequest,
    responseHandler: ICommandResponseHandler<TResponse>
  ) {
    this.request = request;
    this.responseHandler = responseHandler;
  }

  protected getRequest(): TRequest {
    return this.request;
  }

  protected getResponseHandler(): ICommandResponseHandler<TResponse> {
    return this.responseHandler;
  }

  abstract createReport(): Uint8Array;
  // eslint-disable-next-line
  abstract createResponse(resultArray: Uint8Array): TResponse;

  async sendReport(device: any): Promise<void> {
    try {
      const outputReport = this.createReport();
      await device.sendReport(AbstractCommand.OUTPUT_REPORT_ID, outputReport);
    } catch (error) {
      await this.getResponseHandler()({
        success: false,
        error: 'Sending report failed.',
        cause: error,
      });
    }
  }

  async handleInputReport(data: any): Promise<void> {
    const resultArray = new Uint8Array(data.data.buffer);
    this.outputUint8Array(resultArray);
    await this.getResponseHandler()({
      success: true,
      response: this.createResponse(resultArray),
    });
  }

  protected outputUint8Array(array: Uint8Array) {
    let lines = '';
    let out = '';
    let ascii = '';
    for (let i = 0; i < array.length; i++) {
      // out += String.fromCharCode(array[i]);
      let value = Number(array[i]).toString(16).toUpperCase();
      if (value.length === 1) {
        value = '0' + value;
      }
      out += value;
      if (i % 2 !== 0) {
        out += ' ';
      }
      if (0x20 <= array[i] && array[i] <= 0x7e) {
        ascii += String.fromCharCode(array[i]);
      } else {
        ascii += '.';
      }
      if ((i + 1) % 16 === 0) {
        lines += out + ' ' + ascii + '\n';
        out = '';
        ascii = '';
      }
    }
    if (out) {
      lines += out + ' ' + ascii + '\n';
    }
    console.log(lines);
  }
}

export interface ILightingGetValueResponse extends ICommandResponse {
  value: number;
}

export class LightingGetValueCommand extends AbstractCommand<
  ICommandRequest,
  ILightingGetValueResponse
> {
  createReport(): Uint8Array {
    return new Uint8Array([0x08, 0x81]);
  }

  createResponse(resultArray: Uint8Array): ILightingGetValueResponse {
    return {
      value: resultArray[2],
    };
  }
}

export interface ILightingSetValueRequest extends ICommandRequest {
  value: number;
}

export interface ILightingSetValueResponse extends ICommandResponse {
  value: number;
}

export class LightingSetValueCommand extends AbstractCommand<
  ILightingSetValueRequest,
  ILightingSetValueResponse
> {
  createReport(): Uint8Array {
    return new Uint8Array([0x07, 0x81, this.getRequest().value]);
  }

  createResponse(resultArray: Uint8Array): ILightingSetValueResponse {
    return {
      value: resultArray[2],
    };
  }
}

export interface IDynamicKeymapGetKeycodeRequest extends ICommandRequest {
  layer: number;
  row: number;
  column: number;
}

export interface IDynamicKeymapGetKeycodeResponse extends ICommandResponse {
  layer: number;
  row: number;
  column: number;
  code: number;
}

export class DynamicKeymapGetKeycodeCommand extends AbstractCommand<
  IDynamicKeymapGetKeycodeRequest,
  IDynamicKeymapGetKeycodeResponse
> {
  createReport(): Uint8Array {
    const req = this.getRequest();
    return new Uint8Array([0x04, req.layer, req.row, req.column]);
  }

  createResponse(resultArray: Uint8Array): IDynamicKeymapGetKeycodeResponse {
    const req = this.getRequest();
    const code = (resultArray[4] << 8) | resultArray[5];
    return {
      layer: req.layer,
      row: req.row,
      column: req.column,
      code,
    };
  }
}

export interface IDynamicKeymapSetKeycodeRequest extends ICommandRequest {
  layer: number;
  row: number;
  column: number;
  code: number;
}

export interface IDynamicKeymapSetKeycodeResponse extends ICommandResponse {
  layer: number;
  row: number;
  column: number;
  code: number;
}

export class DynamicKeymapSetKeycodeCommand extends AbstractCommand<
  IDynamicKeymapSetKeycodeRequest,
  IDynamicKeymapSetKeycodeResponse
> {
  createReport(): Uint8Array {
    const req = this.getRequest();
    return new Uint8Array([
      0x05,
      req.layer,
      req.row,
      req.column,
      req.code >> 8,
      req.code & 0xff,
    ]);
  }

  createResponse(resultArray: Uint8Array): IDynamicKeymapSetKeycodeResponse {
    const req = this.getRequest();
    const code = (resultArray[4] << 8) | resultArray[5];
    return {
      layer: req.layer,
      row: req.row,
      column: req.column,
      code,
    };
  }
}

export interface IDynamicKeymapGetLayerCountResponse extends ICommandResponse {
  value: number;
}

export class DynamicKeymapGetLayerCountCommand extends AbstractCommand<
  ICommandRequest,
  IDynamicKeymapGetLayerCountResponse
> {
  createReport(): Uint8Array {
    return new Uint8Array([0x11]);
  }

  createResponse(resultArray: Uint8Array): IDynamicKeymapGetLayerCountResponse {
    return {
      value: resultArray[1],
    };
  }
}

export interface IDynamicKeymapReadBufferRequest extends ICommandRequest {
  offset: number;
  size: number;
}

export interface IDynamicKeymapReadBufferResponse extends ICommandResponse {
  offset: number;
  size: number;
  buffer: Uint8Array;
}

export class DynamicKeymapReadBufferCommand extends AbstractCommand<
  IDynamicKeymapReadBufferRequest,
  IDynamicKeymapReadBufferResponse
> {
  createReport(): Uint8Array {
    const req = this.getRequest();
    return new Uint8Array([0x12, req.offset >> 8, req.offset & 0xff, req.size]);
  }

  createResponse(resultArray: Uint8Array): IDynamicKeymapReadBufferResponse {
    return {
      offset: (resultArray[1] << 8) | resultArray[2],
      size: resultArray[3],
      buffer: resultArray.slice(4),
    };
  }
}
