import {
  errorResultOf,
  IEmptyResult,
  IResult,
  isError,
  isSuccessful,
  successResult,
  successResultOf,
} from '../../../types';
import { IUsb } from './Usb';

export default class WebUsb implements IUsb {
  // eslint-disable-next-line no-undef
  private device: USBDevice | null;
  private interfaceNumber: number | undefined;

  constructor() {
    this.device = null;
    this.interfaceNumber = undefined;
  }

  async open(): Promise<IEmptyResult> {
    try {
      // Open
      const selectedDevice = await navigator.usb.requestDevice({ filters: [] });
      if (!selectedDevice) {
        return errorResultOf('The user did not select any device.');
      }
      this.device = selectedDevice;

      await this.device.open();
      console.log('The selected USB device opened');

      console.log(
        `Found device at USB: ${this.device.vendorId.toString(
          16
        )} ${this.device.productId.toString(16)}`
      );

      return successResult();
    } catch (e) {
      return errorResultOf(`Opening a USB device failed: ${e}`, e);
    }
  }

  getDeviceInformation(): IResult<{
    vendorId: number;
    productId: number;
  }> {
    const deviceResult = this.getDevice();
    if (isError(deviceResult)) {
      return deviceResult;
    }
    const device = deviceResult.value.device;
    return successResultOf({
      vendorId: device.vendorId,
      productId: device.productId,
    });
  }

  async setConfigurationAndInterface(
    configuration: number,
    interfaceNumber: number
  ): Promise<IEmptyResult> {
    const deviceResult = this.getDevice();
    if (isError(deviceResult)) {
      return deviceResult;
    }
    const device = deviceResult.value.device;
    await device.selectConfiguration(configuration);
    await device.claimInterface(interfaceNumber);
    this.interfaceNumber = interfaceNumber;
    return successResult();
  }

  async close(): Promise<IEmptyResult> {
    const getDeviceResult = this.getDevice();
    if (isSuccessful(getDeviceResult)) {
      try {
        await getDeviceResult.value.device.close();
        return successResult();
      } catch (e) {
        console.error(e);
        return errorResultOf('Closing the device failed: ${e}', e);
      } finally {
        this.interfaceNumber = undefined;
        this.device = null;
      }
    } else {
      return successResult();
    }
  }

  private getDevice(): IResult<{ device: USBDevice }> {
    if (this.device) {
      return successResultOf({ device: this.device });
    } else {
      return errorResultOf('Device not selected');
    }
  }

  async findInterface(
    honorInterfaceClass: boolean,
    interfaceClass?: number,
    interfaceSubClass?: number
  ): Promise<IResult<{ configuration: number; interfaceNumber: number }>> {
    const deviceResult = this.getDevice();
    if (isError(deviceResult)) {
      return deviceResult;
    }
    const device = deviceResult.value.device;
    const bNumConfigurations = device.configurations.length;
    for (let c = 1; c <= bNumConfigurations; c++) {
      console.log(`configuration: ${c}`);
      await device.selectConfiguration(c);
      const configuration = device.configuration;
      if (!configuration) {
        return errorResultOf(`Selecting the configuration[${c}] failed`);
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
              return successResultOf({
                configuration: c,
                interfaceNumber: usbInterface.interfaceNumber,
              });
            }
          } else {
            console.log(
              `Found DFU Interface: configuration:${c}, interface:${usbInterface.interfaceNumber}`
            );
            return successResultOf({
              configuration: c,
              interfaceNumber: usbInterface.interfaceNumber,
            });
          }
        }
      }
    }
    return errorResultOf('The DFU interface not found');
  }

  async resetDevice(): Promise<IEmptyResult> {
    try {
      const deviceResult = this.getDevice();
      if (isError(deviceResult)) {
        return deviceResult;
      }
      const device = deviceResult.value.device;
      await device.reset();
      return successResult();
    } catch (e) {
      return errorResultOf(`Resetting the device failed: ${e}`, e);
    }
  }

  async controlTransferOut(
    request: number,
    value: number,
    data?: Uint8Array
  ): Promise<IEmptyResult> {
    try {
      const deviceResult = this.getDevice();
      if (isError(deviceResult)) {
        return deviceResult;
      }
      const device = deviceResult.value.device;
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
        return errorResultOf(
          `Control Transfer Out (request=${request}, value=${value}) failed: ${result.status}`
        );
      }
      console.log(
        `Control Transfer Out (request=${request}, value=${value}) successfully`
      );
      return successResult();
    } catch (e) {
      return errorResultOf(
        `Control Transfer Out (request=${request}, value=${value}) failed: ${e}`,
        e
      );
    }
  }

  async controlTransferIn(
    request: number,
    value: number,
    length: number
  ): Promise<IResult<{ data: DataView }>> {
    try {
      const deviceResult = this.getDevice();
      if (isError(deviceResult)) {
        return deviceResult;
      }
      const device = deviceResult.value.device;
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
        return errorResultOf(
          `Control Transfer In (request=${request}, value=${value}, length=${length}) failed: ${result.status}`
        );
      }
      return successResultOf({
        data: result.data!,
      });
    } catch (e) {
      return errorResultOf(
        `Control Transfer In (request=${request}, value=${value}, length=${length}) failed: ${e}`,
        e
      );
    }
  }
}
