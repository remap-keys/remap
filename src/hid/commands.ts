import { AbstractCommand, ICommandRequest, ICommandResponse } from './web-hid';

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

export class DynamicKeymapSetKeycodeCommand extends AbstractCommand<IDynamicKeymapSetKeycodeRequest, IDynamicKeymapSetKeycodeResponse> {

  createReport(): Uint8Array {
    const req = this.getRequest();
    return new Uint8Array([0x05, req.layer, req.row, req.column, req.code >> 8, req.code & 0xFF]);
  }

  createResponse(resultArray: Uint8Array): IDynamicKeymapSetKeycodeResponse {
    const req = this.getRequest();
    const code = (resultArray[4] << 8) | (resultArray[5]);
    return {
      layer: req.layer,
      row: req.row,
      column: req.column,
      code
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
