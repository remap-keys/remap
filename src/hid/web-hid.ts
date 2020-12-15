import { ICommand, IConnectParams, IKeyboard, IHid, IDeviceInformation, IResult } from './hid';

export class Keyboard implements IKeyboard {

  private readonly device: any;

  constructor(device: any) {
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
    this.device.close();
  }

  getDevice(): any {
    return this.device;
  }

}

export interface ICommandRequest {
}

export interface ICommandResponse {
}

export interface ICommandResult<T> {
  success: boolean;
  response?: T;
  error?: string;
  cause?: any;
}

export interface ICommandResponseHandler<T extends ICommandResponse> {
  (result: ICommandResult<T>): Promise<void>;
}

export abstract class AbstractCommand<TRequest extends ICommandRequest, TResponse extends ICommandResponse> implements ICommand {

  private readonly request: TRequest;
  private readonly responseHandler: ICommandResponseHandler<TResponse>;

  static OUTPUT_REPORT_ID: number = 0x00;

  protected constructor(request: TRequest, responseHandler: ICommandResponseHandler<TResponse>) {
    this.request = request
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
    let lines = "";
    let out = "";
    let ascii = "";
    for (let i = 0; i < array.length; i++) {
      // out += String.fromCharCode(array[i]);
      let value = (Number(array[i])).toString(16).toUpperCase();
      if (value.length === 1) {
        value = "0" + value;
      }
      out += value;
      if (i % 2 !== 0) {
        out += " ";
      }
      if (0x20 <= array[i] && array[i] <= 0x7e) {
        ascii += String.fromCharCode(array[i]);
      } else {
        ascii += ".";
      }
      if (((i + 1) % 16) === 0) {
        lines += out + " " + ascii + "\n";
        out = "";
        ascii = "";
      }
    }
    if (out) {
      lines += out + " " + ascii + "\n";
    }
    console.log(lines);
  }

}

export class WebHid implements IHid {

  private keyboard?: Keyboard;
  private commandQueue: ICommand[];

  constructor() {
    this.commandQueue = [];
  }


  async connect(connectParams: IConnectParams): Promise<IResult> {
    if (this.keyboard) {
      return {
        success: false,
        error: 'The keyboard already connected.',
      };
    }
    let device;
    try {
      const devices = await (navigator as any).hid.requestDevice({
        filters: [{
          vendorId: connectParams.vendorId,
          productId: connectParams.productId,
          usagePage: 0xFF60,
          usage: 0x61,
        }]
      });
      device = devices[0];
    } catch(error) {
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
    try {
      await device.open();
      device.addEventListener(
        'inputreport',
        async (e: any) => this.handleInputReport(e)
      );
    } catch(error) {
      return {
        success: false,
        error: 'The device cannot be opened.',
        cause: error,
      };
    }
    this.keyboard = new Keyboard(device);
    return {
      success: true,
    };
  }

  isConnected(): boolean {
    return this.keyboard !== undefined;
  }

  isOpened(): boolean {
    return this.keyboard !== undefined && this.keyboard.isOpened();
  }

  getKeyboard(): IKeyboard | undefined {
    return this.keyboard;
  }

  async close(): Promise<void> {
    if (this.keyboard) {
      try {
        await this.keyboard.close();
      } catch (error) {
        console.log(error);
        // Ignore.
      }
      this.keyboard = undefined;
    }
  }

  async execute(command: AbstractCommand<ICommandRequest, ICommandResponseHandler<ICommandResponse>>): Promise<void> {
    this.commandQueue.push(command);
    if (this.commandQueue.length === 1) {
      await this.commandQueue[0].sendReport(this.keyboard!.getDevice());
    }
  }

  private async handleInputReport(e: any): Promise<void> {
    const command = this.commandQueue.shift();
    if (command) {
      await command.handleInputReport(e);
      if (this.commandQueue.length > 0) {
        await this.commandQueue[0].sendReport(this.keyboard!.getDevice());
      }
    } else {
      throw new Error('The command queue is empty.');
    }
  }

}
