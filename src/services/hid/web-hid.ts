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
  DynamicKeymapGetLayerCountCommand,
  DynamicKeymapReadBufferCommand,
  DynamicKeymapSetKeycodeCommand,
  IDynamicKeymapReadBufferResponse,
} from './commands';

const createKeymap = (code: number): IKeymap => ({
  code,
  isAny: false,
  keycodeInfo: (keycodeArray as IKeycodeInfo[]).find(
    (keycode) => keycode.code === code
  )!,
});

const basicKeymaps: IKeymap[] = (basic as IKeycodeCategoryInfo).codes.map(
  (code) => createKeymap(code)
);
const layersKeymaps: IKeymap[] = (layers as IKeycodeCategoryInfo).codes.map(
  (code) => createKeymap(code)
);
const lightingKeymaps: IKeymap[] = (lighting as IKeycodeCategoryInfo).codes.map(
  (code) => createKeymap(code)
);
const macroKeymaps: IKeymap[] = (macro as IKeycodeCategoryInfo).codes.map(
  (code) => createKeymap(code)
);
const mediaKeymaps: IKeymap[] = (media as IKeycodeCategoryInfo).codes.map(
  (code) => createKeymap(code)
);
const numberKeymaps: IKeymap[] = (kp as IKeycodeCategoryInfo).codes.map(
  (code) => createKeymap(code)
);
const specialKeymaps: IKeymap[] = (special as IKeycodeCategoryInfo).codes.map(
  (code) => createKeymap(code)
);

const categoryToKeymapsMap: { [p: string]: IKeymap[] } = {
  basic: basicKeymaps,
  layers: layersKeymaps,
  lighting: lightingKeymaps,
  macro: macroKeymaps,
  media: mediaKeymaps,
  number: numberKeymaps,
  special: specialKeymaps,
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
          const keymap = this.hid.getKeymap(code);
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

  getKeymapCandidatesByCategory(category: string): IKeymap[] {
    return categoryToKeymapsMap[category];
  }

  getKeymap(code: number): IKeymap {
    const keycodeInfo = keycodeArray.find(
      (keycodeInfo) => keycodeInfo.code === code
    );
    if (keycodeInfo) {
      return {
        code,
        isAny: false,
        keycodeInfo,
      };
    } else {
      return {
        code,
        isAny: true,
      };
    }
  }
}
