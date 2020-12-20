/* eslint-disable no-undef */
// Usage example:
//
// // Connect a device.
// const hid = new WebHid();
// const result = await hid.connect();
// if (!result.success) {
//    const errorMessage = result.error;
//    const cause = result.cause;
//    // Do something.
// }
// // Open the keyboard
// const keyboard = result.keyboard;
// await keyboard.open();
// // Get the keycode.
// const command = new DynamicKeymapGetKeycodeCommand(
//   { layer: 0, row: 0, column: 1 },
//   async (result): Promise<void> => {
//     if (!result.success) {
//       const errorMessage = result.error;
//       const cause = result.cause;
//       // Do something.
//     } else {
//       const keycode = result.response!.value;
//       // Do something.
//     }
//   }
// );
// await keyboard.execute(command);
// // Close the device.
// await keyboard.close();

import {
  ICommand,
  IConnectParams,
  IKeyboard,
  IHid,
  IDeviceInformation,
  IResult,
  IConnectResult,
  IConnectionEventHandler,
} from './hid';

export class Keyboard implements IKeyboard {
  private readonly device: any;
  private commandQueue: ICommand[];

  constructor(device: any) {
    this.commandQueue = [];
    this.device = device;
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
    const command = this.commandQueue.shift();
    if (command) {
      await command.handleInputReport(e);
      if (this.commandQueue.length > 0) {
        await this.commandQueue[0].sendReport(this.getDevice());
      }
    } else {
      throw new Error('The command queue is empty.');
    }
  };

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

  equals(keyboard: IKeyboard): boolean {
    return (
      this.getInformation().vendorId === keyboard.getInformation().vendorId &&
      this.getInformation().productId === keyboard.getInformation().productId
    );
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
  (result: ICommandResult<T>): Promise<void>;
}

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

export class WebHid implements IHid {
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
        return new Keyboard(device);
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
      keyboard: new Keyboard(device),
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
        handler.connect(new Keyboard(e.device));
      }
    });
    (navigator as any).hid.addEventListener('disconnect', (e: any) => {
      if (this.checkViaSupportedDevice(e.device)) {
        handler.disconnect(new Keyboard(e.device));
      }
    });
  }
}
