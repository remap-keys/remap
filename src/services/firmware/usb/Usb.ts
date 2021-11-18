import { IResult } from '../Types';

export const USB_CLASS_APP_SPECIFIC = 0xfe;
export const USB_SUBCLASS_DFU = 0x01;

export const GET_DESCRIPTOR = 0x06;

export const DESCRIPTOR_TYPE_INTERFACE = 0x04;
export const DESCRIPTOR_TYPE_STRING = 0x03;

export const DFU_COMMAND = {
  DETACH: 0x00,
  DOWNLOAD: 0x01,
  UPLOAD: 0x02,
  GETSTATUS: 0x03,
  CLRSTATUS: 0x04,
  ABORT: 0x06,
};

export const DFU_DETACH_TIMEOUT = 1000;

export const USB_STATE = {
  DFU_IDLE: 0x02,
  DFU_DOWNLOAD_SYNC: 0x03,
  DFU_DOWNLOAD_BUSY: 0x04,
  DFU_DOWNLOAD_IDLE: 0x05,
  DFU_MANIFEST_SYNC: 0x06,
  DFU_UPLOAD_IDLE: 0x09,
  DFU_MANIFEST: 0x07,
  DFU_ERROR: 0x0a,
  APP_IDLE: 0x00,
  APP_DETACH: 0x01,
  DFU_MANIFEST_WAIT_RESET: 0x08,
};

export const DFU_STATUS = {
  OK: 0x00,
  ERROR_TARGET: 0x01,
  ERROR_FILE: 0x02,
  ERROR_WRITE: 0x03,
  ERROR_ERASE: 0x04,
  ERROR_CHECK_ERASED: 0x05,
  ERROR_PROG: 0x06,
  ERROR_VERIFY: 0x07,
  ERROR_ADDRESS: 0x08,
  ERROR_NOTDONE: 0x09,
  ERROR_FIRMWARE: 0x0a,
  ERROR_VENDOR: 0x0b,
  ERROR_USBR: 0x0c,
  ERROR_POR: 0x0d,
  ERROR_UNKNOWN: 0x0e,
  ERROR_STALLEDPKT: 0x0f,
};

export const ALL_MEMORY_TYPE = ['flash', 'eeprom', 'user'] as const;
type memoryTypeTuple = typeof ALL_MEMORY_TYPE;
export type IMemoryType = memoryTypeTuple[number];

export type IDfuStatus = {
  status: number;
  pollTimeout: number;
  state: number;
};

export const UINT8_MAX = 255;
export const UINT16_MAX = 65535;
export const UINT32_MAX = 4294967295;

export interface IControlTransferInResult extends IResult {
  data?: DataView;
}

export interface IDfuFindInterfaceResult extends IResult {
  configuration?: number;
  interfaceNumber?: number;
}

export interface IGetDeviceInformationResult extends IResult {
  vendorId?: number;
  productId?: number;
}

export interface IUsb {
  open(): Promise<IResult>;
  getDeviceInformation(): IGetDeviceInformationResult;
  setConfigurationAndInterface(
    // eslint-disable-next-line no-unused-vars
    configuration: number,
    // eslint-disable-next-line no-unused-vars
    interfaceNumber: number
  ): Promise<IResult>;
  controlTransferOut(
    // eslint-disable-next-line no-unused-vars
    request: number,
    // eslint-disable-next-line no-unused-vars
    value: number,
    // eslint-disable-next-line no-unused-vars
    data?: Uint8Array
  ): Promise<IResult>;
  controlTransferIn(
    // eslint-disable-next-line no-unused-vars
    request: number,
    // eslint-disable-next-line no-unused-vars
    value: number,
    // eslint-disable-next-line no-unused-vars
    length: number
  ): Promise<IControlTransferInResult>;
  resetDevice(): Promise<IResult>;
  findInterface(
    // eslint-disable-next-line no-unused-vars
    honorInterfaceClass: boolean,
    // eslint-disable-next-line no-unused-vars
    interfaceClass?: number,
    // eslint-disable-next-line no-unused-vars
    interfaceSubClass?: number
  ): Promise<IDfuFindInterfaceResult>;
  close(): Promise<IResult>;
}
