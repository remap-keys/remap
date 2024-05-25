import {
  ICommandRequest,
  ICommandResponse,
  ICommandResponseHandler,
} from './WebHid';
import { ICommand } from './Hid';
import { outputUint8Array } from '../../utils/ArrayUtils';
import { ObjectValueListType } from '../../utils/ObjectUtils';

export abstract class AbstractCommand<
  TRequest extends ICommandRequest,
  TResponse extends ICommandResponse,
> implements ICommand
{
  private readonly request: TRequest;
  private readonly responseHandler: ICommandResponseHandler<TResponse>;

  static RAW_BUFFER_SIZE: number = 32;

  constructor(
    request: TRequest,
    responseHandler: ICommandResponseHandler<TResponse>,
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
  // eslint-disable-next-line no-unused-vars
  abstract createResponse(resultArray: Uint8Array): TResponse;
  // eslint-disable-next-line no-unused-vars
  abstract isSameRequest(resultArray: Uint8Array): boolean;

  async sendReport(device: HIDDevice): Promise<void> {
    try {
      const outputReport = new Uint8Array(AbstractCommand.RAW_BUFFER_SIZE);
      outputReport.set(this.createReport());
      const outputReportId = this.getOutputReportId(device);
      outputUint8Array(
        `Send data (output report ID: ${outputReportId})`,
        outputReport,
      );
      await device.sendReport(outputReportId, outputReport);
    } catch (error) {
      await this.getResponseHandler()({
        success: false,
        error: 'Sending report failed.',
        cause: error,
      });
    }
  }

  getOutputReportId(device: HIDDevice): number {
    const infos = device.collections;
    if (infos) {
      for (const info of infos) {
        const outputReports = info.outputReports;
        if (outputReports && outputReports.length) {
          const reportId = outputReports[0].reportId;
          if (reportId) {
            return reportId;
          }
        }
      }
    }
    console.warn(
      "The device doesn't return an output report ID value. Use the default value: 0x00",
    );
    return 0x00; // Return the default value in Remap.
  }

  async handleInputReport(data: any): Promise<void> {
    const resultArray = new Uint8Array(data.data.buffer);
    await this.getResponseHandler()({
      success: true,
      response: this.createResponse(resultArray),
    });
  }

  canHandleInputReport(data: any): boolean {
    const resultArray = new Uint8Array(data.data.buffer);
    return this.isSameRequest(resultArray);
  }
}

const id_get_protocol_version = 0x01;
const id_get_keyboard_value = 0x02;
const id_set_keyboard_value = 0x03;
const id_dynamic_keymap_get_keycode = 0x04;
const id_dynamic_keymap_set_keycode = 0x05;
const id_dynamic_keymap_reset = 0x06;
const id_custom_set_value = 0x07;
const id_custom_get_value = 0x08;
const id_custom_save = 0x09;
// const id_eeprom_reset = 0x0a;
// const id_bootloader_jump = 0x0b;
const id_dynamic_keymap_macro_get_count = 0x0c;
const id_dynamic_keymap_macro_get_buffer_size = 0x0d;
const id_dynamic_keymap_macro_get_buffer = 0x0e;
const id_dynamic_keymap_macro_set_buffer = 0x0f;
// const id_dynamic_keymap_macro_reset = 0x10;
const id_dynamic_keymap_get_layer_count = 0x11;
const id_dynamic_keymap_get_buffer = 0x12;
// const id_dynamic_keymap_set_buffer = 0x13;
const id_dynamic_keymap_get_encoder = 0x14;
const id_dynamic_keymap_set_encoder = 0x15;
// const id_unhandled = 0xff;

// const id_uptime = 0x01;
const id_layout_options = 0x02;
const id_switch_matrix_state = 0x03;
// const id_firmware_version = 0x04;
// const id_device_indication = 0x05;

// const id_custom_channel = 0;
const id_qmk_backlight_channel = 1;
const id_qmk_rgblight_channel = 2;
// const id_qmk_rgb_matrix_channel = 3;
// const id_qmk_audio_channel = 4;
// const id_qmk_led_matrix_channel = 5;

export const BacklightValueId = {
  id_qmk_backlight_brightness: 1,
  id_qmk_backlight_effect: 2,
} as const;
type BacklightValueIdType = ObjectValueListType<typeof BacklightValueId>;

export const RgbLightValueId = {
  id_qmk_rgblight_brightness: 1,
  id_qmk_rgblight_effect: 2,
  id_qmk_rgblight_effect_speed: 3,
  id_qmk_rgblight_color: 4,
} as const;
type RgbLightValueIdType = ObjectValueListType<typeof RgbLightValueId>;

export interface IBacklightGetValueRequest extends ICommandRequest {
  valueId: BacklightValueIdType;
}

export interface IBacklightGetValueResponse extends ICommandResponse {
  value: number;
}

export class BacklightGetValueCommand extends AbstractCommand<
  IBacklightGetValueRequest,
  IBacklightGetValueResponse
> {
  createReport(): Uint8Array {
    const valueId = this.getRequest().valueId;
    return new Uint8Array([
      id_custom_get_value,
      id_qmk_backlight_channel,
      valueId,
    ]);
  }

  createResponse(resultArray: Uint8Array): IBacklightGetValueResponse {
    return {
      value: resultArray[3],
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return (
      resultArray[0] === id_custom_get_value &&
      resultArray[1] === id_qmk_backlight_channel &&
      resultArray[2] === this.getRequest().valueId
    );
  }
}

export interface IBacklightSetValueRequest extends ICommandRequest {
  valueId: BacklightValueIdType;
  value: number;
}

export interface IBacklightSetValueResponse extends ICommandResponse {
  value: number;
}

export class BacklightSetValueCommand extends AbstractCommand<
  IBacklightSetValueRequest,
  IBacklightSetValueResponse
> {
  createReport(): Uint8Array {
    const valueId = this.getRequest().valueId;
    return new Uint8Array([
      id_custom_set_value,
      id_qmk_backlight_channel,
      valueId,
      this.getRequest().value,
    ]);
  }

  createResponse(resultArray: Uint8Array): IBacklightSetValueResponse {
    return {
      value: resultArray[3],
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    const valueId = this.getRequest().valueId;
    return (
      resultArray[0] === id_custom_set_value &&
      resultArray[1] === id_qmk_backlight_channel &&
      resultArray[2] === valueId &&
      resultArray[3] === this.getRequest().value
    );
  }
}

export class BacklightSaveCommand extends AbstractCommand<
  ICommandRequest,
  ICommandResponse
> {
  createReport(): Uint8Array {
    return new Uint8Array([id_custom_save, id_qmk_backlight_channel]);
  }

  // eslint-disable-next-line no-unused-vars
  createResponse(resultArray: Uint8Array): ICommandResponse {
    return {};
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return (
      resultArray[0] === id_custom_save &&
      resultArray[1] === id_qmk_backlight_channel
    );
  }
}

export interface IRgbLightGetValueRequest extends ICommandRequest {
  valueId: RgbLightValueIdType;
}

export interface IRgbLightGetValueResponse extends ICommandResponse {
  value1: number;
  value2: number;
}

export class RgbLightGetValueCommand extends AbstractCommand<
  IRgbLightGetValueRequest,
  IRgbLightGetValueResponse
> {
  createReport(): Uint8Array {
    const valueId = this.getRequest().valueId;
    return new Uint8Array([
      id_custom_get_value,
      id_qmk_rgblight_channel,
      valueId,
    ]);
  }

  createResponse(resultArray: Uint8Array): IRgbLightGetValueResponse {
    return {
      value1: resultArray[3],
      value2: resultArray[4],
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return (
      resultArray[0] === id_custom_get_value &&
      resultArray[1] === id_qmk_rgblight_channel &&
      resultArray[2] === this.getRequest().valueId
    );
  }
}

export interface IRgbLightSetValueRequest extends ICommandRequest {
  valueId: RgbLightValueIdType;
  value1: number;
  value2: number;
}

export interface IRgbLightSetValueResponse extends ICommandResponse {
  value1: number;
  value2: number;
}

export class RgbLightSetValueCommand extends AbstractCommand<
  IRgbLightSetValueRequest,
  IRgbLightSetValueResponse
> {
  createReport(): Uint8Array {
    const valueId = this.getRequest().valueId;
    return new Uint8Array([
      id_custom_set_value,
      id_qmk_rgblight_channel,
      valueId,
      this.getRequest().value1,
      this.getRequest().value2,
    ]);
  }

  createResponse(resultArray: Uint8Array): IRgbLightSetValueResponse {
    return {
      value1: resultArray[3],
      value2: resultArray[3],
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    const valueId = this.getRequest().valueId;
    return (
      resultArray[0] === id_custom_set_value &&
        resultArray[1] === id_qmk_rgblight_channel &&
        resultArray[2] === valueId &&
        resultArray[3] === this.getRequest().value1,
      resultArray[4] === this.getRequest().value2
    );
  }
}

export class RgbLightSaveCommand extends AbstractCommand<
  ICommandRequest,
  ICommandResponse
> {
  createReport(): Uint8Array {
    return new Uint8Array([id_custom_save, id_qmk_rgblight_channel]);
  }

  // eslint-disable-next-line no-unused-vars
  createResponse(resultArray: Uint8Array): ICommandResponse {
    return {};
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return (
      resultArray[0] === id_custom_save &&
      resultArray[1] === id_qmk_rgblight_channel
    );
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
    return new Uint8Array([
      id_dynamic_keymap_get_keycode,
      req.layer,
      req.row,
      req.column,
    ]);
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

  isSameRequest(resultArray: Uint8Array): boolean {
    const req = this.getRequest();
    return (
      resultArray[0] === id_dynamic_keymap_get_keycode &&
      resultArray[1] === req.layer &&
      resultArray[2] === req.row &&
      resultArray[3] === req.column
    );
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
      id_dynamic_keymap_set_keycode,
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

  isSameRequest(resultArray: Uint8Array): boolean {
    const req = this.getRequest();
    return (
      resultArray[0] === id_dynamic_keymap_set_keycode &&
      resultArray[1] === req.layer &&
      resultArray[2] === req.row &&
      resultArray[3] === req.column &&
      resultArray[4] === req.code >> 8 &&
      resultArray[5] === (req.code & 0xff)
    );
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
    return new Uint8Array([id_dynamic_keymap_get_layer_count]);
  }

  createResponse(resultArray: Uint8Array): IDynamicKeymapGetLayerCountResponse {
    return {
      value: resultArray[1],
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return resultArray[0] === id_dynamic_keymap_get_layer_count;
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
    return new Uint8Array([
      id_dynamic_keymap_get_buffer,
      req.offset >> 8,
      req.offset & 0xff,
      req.size,
    ]);
  }

  createResponse(resultArray: Uint8Array): IDynamicKeymapReadBufferResponse {
    const offset = (resultArray[1] << 8) | resultArray[2];
    const size = resultArray[3];
    return {
      offset,
      size,
      buffer: resultArray.slice(4),
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    const req = this.getRequest();
    return (
      resultArray[0] === id_dynamic_keymap_get_buffer &&
      resultArray[1] === req.offset >> 8 &&
      resultArray[2] === (req.offset & 0xff) &&
      resultArray[3] === req.size
    );
  }
}

export class DynamicKeymapResetCommand extends AbstractCommand<
  ICommandRequest,
  ICommandResponse
> {
  createReport(): Uint8Array {
    return new Uint8Array([id_dynamic_keymap_reset]);
  }

  // eslint-disable-next-line no-unused-vars
  createResponse(resultArray: Uint8Array): ICommandResponse {
    return {};
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return resultArray[0] === id_dynamic_keymap_reset;
  }
}

export interface IBleMicroProStoreKeymapPersistentlyResponse
  extends ICommandResponse {
  resultCode: number;
}

export class BleMicroProStoreKeymapPersistentlyCommand extends AbstractCommand<
  ICommandRequest,
  IBleMicroProStoreKeymapPersistentlyResponse
> {
  createReport(): Uint8Array {
    return new Uint8Array([id_set_keyboard_value, 0xff]);
  }

  // eslint-disable-next-line no-unused-vars
  createResponse(
    resultArray: Uint8Array,
  ): IBleMicroProStoreKeymapPersistentlyResponse {
    return {
      resultCode: resultArray[2],
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return resultArray[0] === id_set_keyboard_value && resultArray[1] === 0xff;
  }
}

export interface IDynamicKeymapMacroGetCountResponse extends ICommandResponse {
  count: number;
}

export class DynamicKeymapMacroGetCountCommand extends AbstractCommand<
  ICommandRequest,
  IDynamicKeymapMacroGetCountResponse
> {
  createReport(): Uint8Array {
    return new Uint8Array([id_dynamic_keymap_macro_get_count]);
  }

  createResponse(resultArray: Uint8Array): IDynamicKeymapMacroGetCountResponse {
    const count = resultArray[1];
    return {
      count,
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return resultArray[0] === id_dynamic_keymap_macro_get_count;
  }
}

export interface IDynamicKeymapMacroGetBufferSizeResponse
  extends ICommandResponse {
  bufferSize: number;
}

export class DynamicKeymapMacroGetBufferSizeCommand extends AbstractCommand<
  ICommandRequest,
  IDynamicKeymapMacroGetBufferSizeResponse
> {
  createReport(): Uint8Array {
    return new Uint8Array([id_dynamic_keymap_macro_get_buffer_size]);
  }

  createResponse(
    resultArray: Uint8Array,
  ): IDynamicKeymapMacroGetBufferSizeResponse {
    const bufferSize = resultArray[1] << 8 || resultArray[2];
    return {
      bufferSize,
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return resultArray[0] === id_dynamic_keymap_macro_get_buffer_size;
  }
}

export interface ISwitchLayerStateRequest extends ICommandRequest {
  offset: number;
}

export interface ISwitchLayerStateResponse extends ICommandResponse {
  state: Uint8Array;
}

export class SwitchMatrixStateCommand extends AbstractCommand<
  ISwitchLayerStateRequest,
  ISwitchLayerStateResponse
> {
  createReport(): Uint8Array {
    const offset = this.getRequest().offset;
    return new Uint8Array([
      id_get_keyboard_value,
      id_switch_matrix_state,
      offset,
    ]);
  }

  createResponse(resultArray: Uint8Array): ISwitchLayerStateResponse {
    return {
      state: resultArray.slice(3),
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return (
      resultArray[0] === id_get_keyboard_value &&
      resultArray[1] === id_switch_matrix_state &&
      resultArray[2] === this.getRequest().offset
    );
  }
}

export interface IGetLayoutOptionsResponse extends ICommandResponse {
  value: number;
}

export class GetLayoutOptionsCommand extends AbstractCommand<
  ICommandRequest,
  IGetLayoutOptionsResponse
> {
  createReport(): Uint8Array {
    return new Uint8Array([id_get_keyboard_value, id_layout_options]);
  }

  createResponse(resultArray: Uint8Array): IGetLayoutOptionsResponse {
    const value =
      resultArray[2] << 24 ||
      resultArray[3] << 16 ||
      resultArray[4] << 8 ||
      resultArray[5];
    return {
      value,
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return (
      resultArray[0] === id_get_keyboard_value &&
      resultArray[1] === id_layout_options
    );
  }
}

export interface IDynamicKeymapMacroGetBufferRequest extends ICommandRequest {
  offset: number;
  size: number;
}

export interface IDynamicKeymapMacroGetBufferResponse extends ICommandResponse {
  offset: number;
  size: number;
  buffer: Uint8Array;
}

export class DynamicKeymapMacroGetBufferCommand extends AbstractCommand<
  IDynamicKeymapMacroGetBufferRequest,
  IDynamicKeymapMacroGetBufferResponse
> {
  createReport(): Uint8Array {
    const req = this.getRequest();
    return new Uint8Array([
      id_dynamic_keymap_macro_get_buffer,
      req.offset >> 8,
      req.offset & 0xff,
      req.size,
    ]);
  }

  createResponse(
    resultArray: Uint8Array,
  ): IDynamicKeymapMacroGetBufferResponse {
    const offset = (resultArray[1] << 8) | resultArray[2];
    const size = resultArray[3];
    return {
      offset,
      size,
      buffer: resultArray.slice(4),
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    const req = this.getRequest();
    return (
      resultArray[0] === id_dynamic_keymap_macro_get_buffer &&
      resultArray[1] === req.offset >> 8 &&
      resultArray[2] === (req.offset & 0xff) &&
      resultArray[3] === req.size
    );
  }
}

export interface IDynamicKeymapMacroSetBufferRequest extends ICommandRequest {
  offset: number;
  size: number;
  buffer: Uint8Array;
}

export interface IDynamicKeymapMacroSetBufferResponse extends ICommandResponse {
  offset: number;
  size: number;
  buffer: Uint8Array;
}

export class DynamicKeymapMacroSetBufferCommand extends AbstractCommand<
  IDynamicKeymapMacroSetBufferRequest,
  IDynamicKeymapMacroSetBufferResponse
> {
  createReport(): Uint8Array {
    const req = this.getRequest();
    const buf = new Uint8Array(4 + Math.min(req.buffer.length, 28));
    buf[0] = id_dynamic_keymap_macro_set_buffer;
    buf[1] = req.offset >> 8;
    buf[2] = req.offset & 0xff;
    buf[3] = req.size;
    buf.set(req.buffer, 4);
    return buf;
  }

  createResponse(
    resultArray: Uint8Array,
  ): IDynamicKeymapMacroSetBufferResponse {
    const offset = (resultArray[1] << 8) | resultArray[2];
    const size = resultArray[3];
    const buffer = resultArray.slice(4);
    return {
      offset,
      size,
      buffer,
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    const req = this.getRequest();
    return (
      resultArray[0] === id_dynamic_keymap_macro_set_buffer &&
      resultArray[1] === req.offset >> 8 &&
      resultArray[2] === (req.offset & 0xff) &&
      resultArray[3] === req.size
    );
  }
}

export interface ISetLayoutOptionsRequest extends ICommandRequest {
  value: number;
}

export class SetLayoutOptionsCommand extends AbstractCommand<
  ISetLayoutOptionsRequest,
  ICommandResponse
> {
  createReport(): Uint8Array {
    const value = this.getRequest().value;
    return new Uint8Array([
      id_set_keyboard_value,
      0x02,
      (value >> 24) & 0xff,
      (value >> 16) & 0xff,
      (value >> 8) & 0xff,
      value & 0xff,
    ]);
  }

  // eslint-disable-next-line no-unused-vars
  createResponse(resultArray: Uint8Array): ICommandResponse {
    return {};
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return resultArray[0] === id_set_keyboard_value && resultArray[1] === 0x02;
  }
}

export interface IGetProtocolVersionResponse extends ICommandResponse {
  protocolVersion: number;
}

export class GetProtocolVersionCommand extends AbstractCommand<
  ICommandRequest,
  IGetProtocolVersionResponse
> {
  createReport(): Uint8Array {
    return new Uint8Array([id_get_protocol_version]);
  }

  createResponse(resultArray: Uint8Array): IGetProtocolVersionResponse {
    return {
      protocolVersion: (resultArray[1] << 8) | resultArray[2],
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return resultArray[0] === id_get_protocol_version;
  }
}

export interface IDynamicKeymapGetEncoderRequest extends ICommandRequest {
  layer: number;
  encoderId: number;
  clockwise: boolean;
}

export interface IDynamicKeymapGetEncoderResponse extends ICommandResponse {
  code: number;
}

export class DynamicKeymapGetEncoderCommand extends AbstractCommand<
  IDynamicKeymapGetEncoderRequest,
  IDynamicKeymapGetEncoderResponse
> {
  createReport(): Uint8Array {
    const req = this.getRequest();
    return new Uint8Array([
      id_dynamic_keymap_get_encoder,
      req.layer,
      req.encoderId,
      req.clockwise ? 0x01 : 0x00,
    ]);
  }

  createResponse(resultArray: Uint8Array): IDynamicKeymapGetEncoderResponse {
    return {
      code: (resultArray[4] << 8) | resultArray[5],
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    const req = this.getRequest();
    return (
      resultArray[0] === id_dynamic_keymap_get_encoder &&
      resultArray[1] === req.layer &&
      resultArray[2] === req.encoderId &&
      resultArray[3] === (req.clockwise ? 0x01 : 0x00)
    );
  }
}

export interface IDynamicKeymapSetEncoderRequest extends ICommandRequest {
  layer: number;
  encoderId: number;
  clockwise: boolean;
  code: number;
}

export class DynamicKeymapSetEncoderCommand extends AbstractCommand<
  IDynamicKeymapSetEncoderRequest,
  ICommandResponse
> {
  createReport(): Uint8Array {
    const req = this.getRequest();
    return new Uint8Array([
      id_dynamic_keymap_set_encoder,
      req.layer,
      req.encoderId,
      req.clockwise ? 0x01 : 0x00,
      req.code >> 8,
      req.code & 0xff,
    ]);
  }

  // eslint-disable-next-line no-unused-vars
  createResponse(resultArray: Uint8Array): ICommandResponse {
    return {};
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    const req = this.getRequest();
    return (
      resultArray[0] === id_dynamic_keymap_set_encoder &&
      resultArray[1] === req.layer &&
      resultArray[2] === req.encoderId &&
      resultArray[3] === (req.clockwise ? 0x01 : 0x00) &&
      resultArray[4] === req.code >> 8 &&
      resultArray[5] === (req.code & 0xff)
    );
  }
}
