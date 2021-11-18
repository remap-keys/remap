import {
  IUsb,
  IControlTransferInResult,
  IDfuFindInterfaceResult,
  IGetDeviceInformationResult,
} from './Usb';
import { IResult } from '../Types';

interface IGetDeviceResult extends IResult {
  // eslint-disable-next-line no-undef
  device?: USBDevice;
}

export default class WebUsb implements IUsb {
  // eslint-disable-next-line no-undef
  private device: USBDevice | null;
  private interfaceNumber: number | undefined;

  constructor() {
    this.device = null;
    this.interfaceNumber = undefined;
  }

  async open(): Promise<IResult> {
    try {
      // Open
      const selectedDevice = await navigator.usb.requestDevice({ filters: [] });
      if (!selectedDevice) {
        return {
          success: false,
          error: 'The user did not select any device.',
        };
      }
      this.device = selectedDevice;

      await this.device.open();
      console.log('The selected USB device opened');

      console.log(
        `Found device at USB: ${this.device.vendorId.toString(
          16
        )} ${this.device.productId.toString(16)}`
      );

      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
        error: `Opening a USB device failed: ${e}`,
        cause: e,
      };
    }
  }

  getDeviceInformation(): IGetDeviceInformationResult {
    const deviceResult = this.getDevice();
    if (!deviceResult.success) {
      return deviceResult;
    }
    const device = deviceResult.device!;
    return {
      success: true,
      vendorId: device.vendorId,
      productId: device.productId,
    };
  }

  async setConfigurationAndInterface(
    configuration: number,
    interfaceNumber: number
  ): Promise<IResult> {
    const deviceResult = this.getDevice();
    if (!deviceResult.success) {
      return deviceResult;
    }
    const device = deviceResult.device!;
    await device.selectConfiguration(configuration);
    await device.claimInterface(interfaceNumber);
    this.interfaceNumber = interfaceNumber;
    return {
      success: true,
    };
  }

  async close(): Promise<IResult> {
    const getDeviceResult = this.getDevice();
    if (getDeviceResult.success) {
      try {
        await getDeviceResult.device!.close();
        return {
          success: true,
        };
      } catch (e) {
        console.error(e);
        return {
          success: false,
          error: 'Closing the device failed: ${e}',
          cause: e,
        };
      } finally {
        this.interfaceNumber = undefined;
        this.device = null;
      }
    } else {
      return {
        success: true,
      };
    }
  }

  private getDevice(): IGetDeviceResult {
    if (this.device) {
      return { success: true, device: this.device };
    } else {
      return { success: false, error: 'Device not selected' };
    }
  }

  async findInterface(
    honorInterfaceClass: boolean,
    interfaceClass?: number,
    interfaceSubClass?: number
  ): Promise<IDfuFindInterfaceResult> {
    const deviceResult = this.getDevice();
    if (!deviceResult.success) {
      return deviceResult;
    }
    const device = deviceResult.device!;
    const bNumConfigurations = device.configurations.length;
    for (let c = 1; c <= bNumConfigurations; c++) {
      console.log(`configuration: ${c}`);
      await device.selectConfiguration(c);
      const configuration = device.configuration;
      if (!configuration) {
        return {
          success: false,
          error: `Selecting the configuration[${c}] failed`,
        };
      }
      const bNumInterfaces = configuration.interfaces.length;
      for (let i = 0; i < bNumInterfaces; i++) {
        console.log(`interface: ${i}`);
        const usbInterface = configuration.interfaces[i];
        for (let s = 0; s < usbInterface.alternates.length; s++) {
          console.log(`alternate: ${s}`);
          const alternate = usbInterface.alternates[s];
          console.log(
            `setting ${s}: class:${alternate.interfaceClass.toString(
              16
            )}, subclass:${alternate.interfaceSubclass.toString(
              16
            )}, protocol:${alternate.interfaceProtocol.toString(16)}`
          );
          if (honorInterfaceClass) {
            if (
              alternate.interfaceClass === interfaceClass &&
              alternate.interfaceSubclass === interfaceSubClass
            ) {
              console.log(
                `Found DFU Interface: configuration:${c}, interface:${usbInterface.interfaceNumber}`
              );
              return {
                success: true,
                configuration: c,
                interfaceNumber: usbInterface.interfaceNumber,
              };
            }
          } else {
            console.log(
              `Found DFU Interface: configuration:${c}, interface:${usbInterface.interfaceNumber}`
            );
            return {
              success: true,
              configuration: c,
              interfaceNumber: usbInterface.interfaceNumber,
            };
          }
        }
      }
    }
    return {
      success: false,
      error: 'The DFU interface not found',
    };
  }

  async resetDevice(): Promise<IResult> {
    try {
      const deviceResult = this.getDevice();
      if (!deviceResult.success) {
        return deviceResult;
      }
      const device = deviceResult.device!;
      await device.reset();
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
        error: `Resetting the device failed: ${e}`,
        cause: e,
      };
    }
  }

  async controlTransferOut(
    request: number,
    value: number,
    data?: Uint8Array
  ): Promise<IResult> {
    try {
      const deviceResult = this.getDevice();
      if (!deviceResult.success) {
        return deviceResult;
      }
      const device = deviceResult.device!;
      // eslint-disable-next-line no-undef
      const setup: USBControlTransferParameters = {
        requestType: 'class',
        recipient: 'interface',
        request,
        value,
        index: this.interfaceNumber!,
      };
      let result;
      if (data) {
        result = await device.controlTransferOut(setup, data);
      } else {
        result = await device.controlTransferOut(setup);
      }
      if (result.status !== 'ok') {
        return {
          success: false,
          error: `Control Transfer Out (request=${request}, value=${value}) failed: ${result.status}`,
        };
      }
      console.log(
        `Control Transfer Out (request=${request}, value=${value}) successfully`
      );
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
        error: `Control Transfer Out (request=${request}, value=${value}) failed: ${e}`,
        cause: e,
      };
    }
  }

  async controlTransferIn(
    request: number,
    value: number,
    length: number
  ): Promise<IControlTransferInResult> {
    try {
      const deviceResult = this.getDevice();
      if (!deviceResult.success) {
        return deviceResult;
      }
      const device = deviceResult.device!;
      // eslint-disable-next-line no-undef
      const setup: USBControlTransferParameters = {
        requestType: 'class',
        recipient: 'interface',
        request,
        value,
        index: this.interfaceNumber!,
      };
      const result = await device.controlTransferIn(setup, length);
      if (result.status !== 'ok' || !result.data) {
        return {
          success: false,
          error: `Control Transfer In (request=${request}, value=${value}, length=${length}) failed: ${result.status}`,
        };
      }
      return {
        success: true,
        data: result.data!,
      };
    } catch (e) {
      return {
        success: false,
        error: `Control Transfer In (request=${request}, value=${value}, length=${length}) failed: ${e}`,
        cause: e,
      };
    }
  }
}
