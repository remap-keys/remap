import { IBootloader, IBootloaderReadResult } from '../Bootloader';
import {
  DFU_COMMAND,
  DFU_DETACH_TIMEOUT,
  DFU_STATUS,
  IDfuStatus,
  IUsb,
  USB_CLASS_APP_SPECIFIC,
  USB_STATE,
  USB_SUBCLASS_DFU,
} from '../usb/Usb';
import {
  FirmwareWriterPhaseListener,
  FirmwareWriterProgressListener,
} from '../FirmwareWriter';
import { IResult } from '../Types';
import { IDfuTargetMapping } from './DfuBootloader';

interface IDfuGetStatusResult extends IResult {
  status?: IDfuStatus;
}

interface IDfuUploadResult extends IResult {
  data?: DataView;
}

interface IMakeIdleResult extends IResult {
  shouldRetry?: boolean;
}

export abstract class AbstractDfuBootloader implements IBootloader {
  private readonly usb: IUsb;
  private readonly dfuTargetMapping: IDfuTargetMapping;
  private transaction: number;

  protected constructor(usb: IUsb, dfuTargetMapping: IDfuTargetMapping) {
    this.usb = usb;
    this.dfuTargetMapping = dfuTargetMapping;
    this.transaction = 0;
  }

  abstract isSupportedDevice(): boolean;

  abstract read(
    // eslint-disable-next-line no-unused-vars
    size: number,
    // eslint-disable-next-line no-unused-vars
    progress: FirmwareWriterProgressListener,
    // eslint-disable-next-line no-unused-vars
    phase: FirmwareWriterPhaseListener
  ): Promise<IBootloaderReadResult>;

  abstract verify(
    // eslint-disable-next-line no-unused-vars
    bytes: Uint8Array,
    // eslint-disable-next-line no-unused-vars
    progress: FirmwareWriterProgressListener,
    // eslint-disable-next-line no-unused-vars
    phase: FirmwareWriterPhaseListener
  ): Promise<IResult>;

  abstract write(
    // eslint-disable-next-line no-unused-vars
    flashBytes: Uint8Array,
    // eslint-disable-next-line no-unused-vars
    eepromBytes: Uint8Array | null,
    // eslint-disable-next-line no-unused-vars
    progress: FirmwareWriterProgressListener,
    // eslint-disable-next-line no-unused-vars
    phase: FirmwareWriterPhaseListener
  ): Promise<IResult>;

  protected getDfuTargetMapping(): IDfuTargetMapping {
    return this.dfuTargetMapping;
  }

  protected async close(): Promise<IResult> {
    return await this.usb.close();
  }

  protected async dfuInitializeDevice(
    retries: number,
    honorInterfaceClass: boolean,
    initialAbort: boolean,
    progress: FirmwareWriterProgressListener
  ): Promise<IResult> {
    progress(
      `DFU initialize device: retries:${retries}, honorInterfaceClass:${honorInterfaceClass}, initialAbort:${initialAbort}`
    );
    if (retries < 0) {
      return {
        success: false,
        error: 'DFU Device Initialization failed',
      };
    }
    const dfuFindInterfaceResult = await this.usb.findInterface(
      honorInterfaceClass,
      USB_CLASS_APP_SPECIFIC,
      USB_SUBCLASS_DFU
    );
    if (!dfuFindInterfaceResult.success) {
      return dfuFindInterfaceResult;
    }
    progress(
      `DFU interface found: Configuration:${dfuFindInterfaceResult.configuration!}, Interface:${dfuFindInterfaceResult.interfaceNumber!}`
    );
    await this.usb.setConfigurationAndInterface(
      dfuFindInterfaceResult.configuration!,
      dfuFindInterfaceResult.interfaceNumber!
    );

    const makeIdleResult = await this.dfuMakeIdle(initialAbort, progress);
    if (!makeIdleResult.success) {
      return makeIdleResult;
    }
    if (makeIdleResult.shouldRetry) {
      return await this.dfuInitializeDevice(
        --retries,
        honorInterfaceClass,
        initialAbort,
        progress
      );
    }
    return { success: true };
  }

  protected async dfuDownload(data: Uint8Array): Promise<IResult> {
    // outputUint8Array('dfuDownload - data', data);
    let transferOutResult = await this.usb.controlTransferOut(
      DFU_COMMAND.DOWNLOAD,
      this.transaction++,
      data
    );
    if (!transferOutResult.success) {
      return transferOutResult;
    }
    return {
      success: true,
    };
  }

  protected async dfuGetStatus(): Promise<IDfuGetStatusResult> {
    const controlTransferInResult = await this.usb.controlTransferIn(
      DFU_COMMAND.GETSTATUS,
      0,
      6
    );
    if (!controlTransferInResult.success) {
      return controlTransferInResult;
    }
    const data = controlTransferInResult.data!;
    return {
      success: true,
      status: {
        status: data.getUint8(0),
        pollTimeout: data.getUint32(1, true) & 0xffffff,
        state: data.getUint8(4),
      },
    };
  }

  protected async dfuClearStatus(): Promise<IResult> {
    const dfuClearStatusResult = await this.usb.controlTransferOut(
      DFU_COMMAND.CLRSTATUS,
      0
    );
    if (!dfuClearStatusResult.success) {
      console.error(
        `DFU_COMMAND.CLRSTATUS failed. Ignore. error=${dfuClearStatusResult.error}`
      );
      return dfuClearStatusResult;
    }
    return {
      success: true,
    };
  }

  protected async dfuUpload(length: number): Promise<IDfuUploadResult> {
    const controlTransferInResult = await this.usb.controlTransferIn(
      DFU_COMMAND.UPLOAD,
      this.transaction++,
      length
    );
    if (!controlTransferInResult.success) {
      return controlTransferInResult;
    }
    const data = controlTransferInResult.data!;
    // outputUint8Array('dfuUpload - data', new Uint8Array(data.buffer));
    return {
      success: true,
      data,
    };
  }

  private async dfuMakeIdle(
    initialAbort: boolean,
    progress: FirmwareWriterProgressListener
  ): Promise<IMakeIdleResult> {
    let retries = 4;
    if (initialAbort) {
      progress(`DFU abort command.`);
      const dfuAbortResult = await this.usb.controlTransferOut(
        DFU_COMMAND.ABORT,
        0
      );
      if (!dfuAbortResult.success) {
        return dfuAbortResult;
      }
    }
    while (0 < retries) {
      const dfuGetStatusResult = await this.dfuGetStatus();
      if (!dfuGetStatusResult.success) {
        const dfuClearStatusResult = await this.usb.controlTransferOut(
          DFU_COMMAND.CLRSTATUS,
          0
        );
        if (!dfuClearStatusResult.success) {
          progress(
            `DFU_COMMAND.CLRSTATUS failed. Ignore. error=${dfuClearStatusResult.error}`
          );
        }
        continue;
      }
      const status = dfuGetStatusResult.status!;
      progress(`DFU State: ${status.state}`);
      switch (status.state!) {
        case USB_STATE.DFU_IDLE: {
          if (DFU_STATUS.OK === status.status) {
            return {
              success: true,
              shouldRetry: false,
            };
          }
          const dfuClearStatusResult = await this.usb.controlTransferOut(
            DFU_COMMAND.CLRSTATUS,
            0
          );
          if (!dfuClearStatusResult.success) {
            progress(
              `DFU_COMMAND.CLRSTATUS failed. error=${dfuClearStatusResult.error}`
            );
          }
          break;
        }
        case USB_STATE.DFU_DOWNLOAD_SYNC:
        case USB_STATE.DFU_DOWNLOAD_IDLE:
        case USB_STATE.DFU_MANIFEST_SYNC:
        case USB_STATE.DFU_UPLOAD_IDLE:
        case USB_STATE.DFU_DOWNLOAD_BUSY:
        case USB_STATE.DFU_MANIFEST: {
          const dfuAbortResult = await this.usb.controlTransferOut(
            DFU_COMMAND.ABORT,
            0
          );
          if (!dfuAbortResult.success) {
            progress(`DFU_COMMAND.ABORT failed: ${dfuAbortResult.error}`);
          }
          break;
        }
        case USB_STATE.DFU_ERROR: {
          const dfuClearStatusResult = await this.usb.controlTransferOut(
            DFU_COMMAND.CLRSTATUS,
            0
          );
          if (!dfuClearStatusResult.success) {
            progress(
              `DFU_COMMAND.CLRSTATUS failed. error=${dfuClearStatusResult.error}`
            );
          }
          break;
        }
        case USB_STATE.APP_IDLE: {
          const dfuDetachResult = await this.usb.controlTransferOut(
            DFU_COMMAND.DETACH,
            DFU_DETACH_TIMEOUT
          );
          if (!dfuDetachResult.success) {
            progress(
              `DFU_COMMAND.DETACH failed: error=${dfuDetachResult.error}`
            );
          }
          break;
        }
        case USB_STATE.APP_DETACH:
        case USB_STATE.DFU_MANIFEST_WAIT_RESET: {
          progress('Resetting the device');
          const resetDeviceResult = await this.usb.resetDevice();
          if (!resetDeviceResult.success) {
            progress(`Resetting the device failed: ${resetDeviceResult.error}`);
          }
          return {
            success: true,
            shouldRetry: true,
          };
        }
      }
      retries--;
    }
    progress('Not able to transition the device into the dfuIdle state.');
    return {
      success: false,
      error: 'Not able to transition the device into the dfuIdle state.',
    };
  }
}
