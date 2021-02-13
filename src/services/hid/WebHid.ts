/* eslint-disable no-undef */
import {
  ICommand,
  IConnectParams,
  IKeyboard,
  IHid,
  IDeviceInformation,
  IResult,
  IConnectResult,
  IConnectionEventHandler,
  IFetchKeymapResult,
  IFetchLayerCountResult,
  IKeymap,
  IKeycodeCategory,
} from './Hid';
import { KeycodeList } from './KeycodeList';

import {
  DynamicKeymapGetLayerCountCommand,
  DynamicKeymapReadBufferCommand,
  DynamicKeymapSetKeycodeCommand,
  IDynamicKeymapReadBufferResponse,
} from './Commands';
import {
  IKeycodeCompositionFactory,
  KeycodeCompositionFactory,
} from './Composition';
import { KeyCategory } from './KeyCategoryList';

export class Keyboard implements IKeyboard {
  private readonly hid: IHid;
  private readonly device: any;
  private commandQueue: ICommand[];

  constructor(hid: IHid, device: any) {
    this.hid = hid;
    this.commandQueue = [];
    this.device = device;
  }

  getHid(): IHid {
    return this.hid;
  }

  getInformation(): IDeviceInformation {
    return {
      vendorId: this.device.vendorId,
      productId: this.device.productId,
      productName: this.device.productName,
    };
  }

  isOpened(): boolean {
    return this.device.opened;
  }

  async close(): Promise<void> {
    try {
      this.getDevice().removeEventListener(
        'inputreport',
        this.handleInputReport
      );
      await this.device.close();
    } catch (error) {
      console.log(error);
      // Ignore.
    }
  }

  getDevice(): any {
    return this.device;
  }

  isSameDevice(target: IKeyboard): boolean {
    return this.device === target.getDevice();
  }

  async open(): Promise<IResult> {
    if (this.isOpened()) {
      return {
        success: false,
        error: 'The keyboard already connected and opened.',
      };
    }
    const device = this.getDevice();
    try {
      await device.open();
      device.addEventListener('inputreport', this.handleInputReport);
    } catch (error) {
      return {
        success: false,
        error: 'The device cannot be opened.',
        cause: error,
      };
    }
    return {
      success: true,
    };
  }

  handleInputReport = async (e: any): Promise<void> => {
    this.outputUint8Array(new Uint8Array(e.data.buffer));
    if (this.commandQueue.length > 0) {
      const command = this.commandQueue[0];
      if (command!.canHandleInputReport(e)) {
        this.commandQueue.shift();
        await command!.handleInputReport(e);
        if (this.commandQueue.length > 0) {
          await this.commandQueue[0].sendReport(this.getDevice());
          return;
        }
      } else {
        // FIXME: 2021/01/16 For Windows:
        // If command.canHandleInputReport === false, Windows Chrome might return duplicate response.
        // The response should be ignored, and should wait a next response.
        console.warn('Duplicate response was handled. Ignore.');
      }
    } else {
      console.log(
        'Bytes received but the command queue is empty. Close the keyboard.'
      );
      this.hid.close(this);
    }
  };

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

  async enqueue(command: ICommand): Promise<IResult> {
    if (this.isOpened()) {
      this.commandQueue.push(command);
      if (this.commandQueue.length === 1) {
        await this.commandQueue[0].sendReport(this.getDevice());
      }
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: 'Not connected or opened.',
      };
    }
  }

  async fetchKeymaps(
    layer: number,
    rowCount: number,
    columnCount: number
  ): Promise<IFetchKeymapResult> {
    const totalSize = rowCount * columnCount * 2;
    let offset = layer * totalSize;
    const commandResults: Promise<IDynamicKeymapReadBufferResponse>[] = [];
    let remainingSize = totalSize;
    do {
      let size: number;
      if (28 < remainingSize) {
        size = 28;
        remainingSize = remainingSize - 28;
      } else {
        size = remainingSize;
        remainingSize = 0;
      }
      commandResults.push(
        new Promise<IDynamicKeymapReadBufferResponse>((resolve, reject) => {
          const command = new DynamicKeymapReadBufferCommand(
            {
              offset,
              size,
            },
            async (result) => {
              if (result.success) {
                resolve(result.response!);
              } else {
                console.log(result.cause!);
                reject(result.error!);
              }
            }
          );
          return this.enqueue(command);
        })
      );
      offset = offset + 28;
    } while (remainingSize !== 0);
    try {
      const responses = await Promise.all<IDynamicKeymapReadBufferResponse>(
        commandResults
      );
      let row = 0;
      let column = 0;
      const keymapMap: { [pos: string]: IKeymap } = {};
      responses.forEach((response) => {
        if (rowCount === row) {
          return;
        }
        const buffer = response.buffer;
        if (buffer.length % 2 !== 0) {
          throw new Error(`Invalid buffer size: ${buffer.length}`);
        }
        for (let i = 0; i < buffer.length; i += 2) {
          const code = (buffer[i] << 8) | buffer[i + 1];
          const keymap = KeycodeList.getKeymap(code);
          keymapMap[`${row},${column}`] = keymap;
          column = column + 1;
          if (columnCount === column) {
            column = 0;
            row = row + 1;
          }
          if (rowCount === row) {
            break;
          }
        }
      });
      return {
        success: true,
        keymap: keymapMap,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: 'Fetching keymaps failed.',
        cause: error,
      };
    }
  }

  fetchLayerCount(): Promise<IFetchLayerCountResult> {
    return new Promise<IFetchLayerCountResult>((resolve) => {
      const command = new DynamicKeymapGetLayerCountCommand(
        {},
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
              layerCount: result.response!.value,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }

  updateKeymap(
    layer: number,
    row: number,
    column: number,
    code: number
  ): Promise<IResult> {
    return new Promise<IResult>((resolve) => {
      const command = new DynamicKeymapSetKeycodeCommand(
        {
          layer,
          row,
          column,
          code,
        },
        async (result) => {
          if (result.success) {
            resolve({
              success: true,
            });
          } else {
            resolve({
              success: false,
              error: result.error,
              cause: result.cause,
            });
          }
        }
      );
      return this.enqueue(command);
    });
  }
}

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

export class WebHid implements IHid {
  private handler?: IConnectionEventHandler;

  async detectKeyboards(): Promise<IKeyboard[]> {
    const devices = await (navigator as any).hid.getDevices();
    return devices
      .filter((device: any) => {
        const collectionInfo = device.collections[0];
        return (
          collectionInfo &&
          collectionInfo.usage === 0x61 &&
          collectionInfo.usagePage === 0xff60
        );
      })
      .map((device: any) => {
        return new Keyboard(this, device);
      });
  }

  async connect(connectParams?: IConnectParams): Promise<IConnectResult> {
    let device;
    try {
      let devices;
      if (connectParams) {
        devices = await (navigator as any).hid.requestDevice({
          filters: [
            {
              vendorId: connectParams.vendorId,
              productId: connectParams.productId,
              usagePage: 0xff60,
              usage: 0x61,
            },
          ],
        });
      } else {
        devices = await (navigator as any).hid.requestDevice({
          filters: [
            {
              usagePage: 0xff60,
              usage: 0x61,
            },
          ],
        });
      }
      device = devices[0];
    } catch (error) {
      return {
        success: false,
        error: 'The connection failed.',
        cause: error,
      };
    }
    if (device === undefined) {
      return {
        success: false,
        error: 'No device was selected.',
      };
    }
    return {
      success: true,
      keyboard: new Keyboard(this, device),
    };
  }

  checkViaSupportedDevice(device: any): boolean {
    const collection = device.collections[0];
    if (collection) {
      return collection.usage === 0x61 && collection.usagePage === 0xff60;
    } else {
      return false;
    }
  }

  setConnectionEventHandler(handler: IConnectionEventHandler): void {
    (navigator as any).hid.addEventListener('connect', (e: any) => {
      if (this.checkViaSupportedDevice(e.device)) {
        handler.connect(new Keyboard(this, e.device));
      }
    });
    (navigator as any).hid.addEventListener('disconnect', (e: any) => {
      if (this.checkViaSupportedDevice(e.device)) {
        handler.disconnect(new Keyboard(this, e.device));
      }
    });
    this.handler = handler;
  }

  getKeymapCandidatesByCategory(
    category: string,
    layerCount: number
  ): IKeymap[] {
    let keymaps: IKeymap[] = [];
    switch (category) {
      case IKeycodeCategory.BASIC:
        keymaps = KeyCategory.basic();
        break;
      case IKeycodeCategory.SYMBOL:
        keymaps = KeyCategory.symbol();
        break;
      case IKeycodeCategory.FUNCTIONS:
        keymaps = KeyCategory.functions();
        break;
      case IKeycodeCategory.LAYERS:
        keymaps = KeyCategory.layer(layerCount);
        break;
      case IKeycodeCategory.SPECIAL:
        keymaps = KeyCategory.special();
        break;
      case IKeycodeCategory.DEVICE:
        keymaps = KeyCategory.device();
        break;
      case IKeycodeCategory.MACRO:
        keymaps = KeyCategory.macro();
        break;
    }

    return keymaps;
  }

  close(keyboard: IKeyboard): void {
    this.handler!.close(keyboard);
  }

  createKeycodeCompositionFactory(code: number): IKeycodeCompositionFactory {
    return new KeycodeCompositionFactory(code);
  }
}
