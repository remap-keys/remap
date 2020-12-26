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
  IKeycodeInfo,
  IKeycodeCategoryInfo,
  IFetchKeymapResult,
  IFetchLayerCountResult,
  IKeymap,
} from './hid';
import keycodeArray from './assets/keycodes.json';
import basic from './assets/keycodes-basic.json';
import layers from './assets/keycodes-layers.json';
import lighting from './assets/keycodes-lighting.json';
import macro from './assets/keycodes-macro.json';
import media from './assets/keycodes-media.json';
import kp from './assets/keycodes-number.json';
import special from './assets/keycodes-special.json';
import {
  DynamicKeymapGetKeycodeCommand,
  DynamicKeymapGetLayerCountCommand,
  DynamicKeymapSetKeycodeCommand,
  IDynamicKeymapGetKeycodeResponse,
} from './commands';

const basicKeycodes: IKeycodeInfo[] = (basic as IKeycodeCategoryInfo).codes.map(
  (code) =>
    (keycodeArray as IKeycodeInfo[]).find((keycode) => keycode.code === code)!
);
const layersKeycodes: IKeycodeInfo[] = (layers as IKeycodeCategoryInfo).codes.map(
  (code) =>
    (keycodeArray as IKeycodeInfo[]).find((keycode) => keycode.code === code)!
);
const lightingKeycodes: IKeycodeInfo[] = (lighting as IKeycodeCategoryInfo).codes.map(
  (code) =>
    (keycodeArray as IKeycodeInfo[]).find((keycode) => keycode.code === code)!
);
const macroKeycodes: IKeycodeInfo[] = (macro as IKeycodeCategoryInfo).codes.map(
  (code) =>
    (keycodeArray as IKeycodeInfo[]).find((keycode) => keycode.code === code)!
);
const mediaKeycodes: IKeycodeInfo[] = (media as IKeycodeCategoryInfo).codes.map(
  (code) =>
    (keycodeArray as IKeycodeInfo[]).find((keycode) => keycode.code === code)!
);
const numberKeycodes: IKeycodeInfo[] = (kp as IKeycodeCategoryInfo).codes.map(
  (code) =>
    (keycodeArray as IKeycodeInfo[]).find((keycode) => keycode.code === code)!
);
const specialKeycodes: IKeycodeInfo[] = (special as IKeycodeCategoryInfo).codes.map(
  (code) =>
    (keycodeArray as IKeycodeInfo[]).find((keycode) => keycode.code === code)!
);

const categoryToKeycodesMap: { [p: string]: IKeycodeInfo[] } = {
  basic: basicKeycodes,
  layers: layersKeycodes,
  lighting: lightingKeycodes,
  macro: macroKeycodes,
  media: mediaKeycodes,
  number: numberKeycodes,
  special: specialKeycodes,
};

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

  async fetchKeymaps(
    layer: number,
    rowCount: number,
    columnCount: number
  ): Promise<IFetchKeymapResult> {
    const commandResults: Promise<IDynamicKeymapGetKeycodeResponse>[] = [];
    for (let r = 0; r < rowCount; r++) {
      for (let c = 0; c < columnCount; c++) {
        commandResults.push(
          new Promise<IDynamicKeymapGetKeycodeResponse>((resolve, reject) => {
            const command = new DynamicKeymapGetKeycodeCommand(
              {
                layer,
                row: r,
                column: c,
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
      }
    }
    try {
      const responses = await Promise.all<IDynamicKeymapGetKeycodeResponse>(
        commandResults
      );
      return {
        success: true,
        keymap: responses.reduce((map, response) => {
          const keycodeInfo = this.hid.getKeycodeInfo(response.code);
          let keymap: IKeymap;
          if (keycodeInfo) {
            keymap = {
              isAny: false,
              code: response.code,
              keycodeInfo,
            };
          } else {
            keymap = {
              isAny: true,
              code: response.code,
            };
          }
          map[`${response.row},${response.column}`] = keymap;
          return map;
        }, {} as { [pos: string]: IKeymap }),
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
    return new Promise<IFetchLayerCountResult>((resolve, reject) => {
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
    return new Promise<IResult>((resolve, reject) => {
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
  (result: ICommandResult<T>): Promise<void>;
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
  }

  getKeycodeCandidatesByCategory(category: string): IKeycodeInfo[] {
    return categoryToKeycodesMap[category];
  }

  getKeycodeInfo(code: number): IKeycodeInfo | undefined {
    return keycodeArray.find((keycode) => keycode.code === code);
  }
}
