import {
  AppActions,
  LayoutOptionsActions,
  NotificationActions,
} from './actions';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
  IFlashFirmwareDialogFlashMode,
  IFlashFirmwareDialogMode,
  RootState,
} from '../store/state';
import { sendEventToGoogleAnalytics } from '../utils/GoogleAnalytics';
import intelHex from 'intel-hex';
import {
  IFirmware,
  IFirmwareBuildingTask,
  isError,
} from '../services/storage/Storage';
import { IBootloaderType } from '../services/firmware/Types';

export const UPLOAD_FIRMWARE_DIALOG_ACTIONS = '@UploadFirmwareDialog';
export const UPLOAD_FIRMWARE_DIALOG_UPDATE_OPEN = `${UPLOAD_FIRMWARE_DIALOG_ACTIONS}/UploadOpen`;
export const UPLOAD_FIRMWARE_DIALOG_UPDATE_FIRMWARE_FILE_BUFFER = `${UPLOAD_FIRMWARE_DIALOG_ACTIONS}/UploadFirmwareFileBuffer`;
export const UploadFirmwareDialogActions = {
  updateOpen: (open: boolean) => {
    return {
      type: UPLOAD_FIRMWARE_DIALOG_UPDATE_OPEN,
      value: open,
    };
  },
  uploadFirmwareFileBuffer: (buffer: ArrayBuffer) => {
    return {
      type: UPLOAD_FIRMWARE_DIALOG_UPDATE_FIRMWARE_FILE_BUFFER,
      value: buffer,
    };
  },
};

export const FLASH_FIRMWARE_DIALOG_ACTIONS = '@FlashFirmwareDialog';
export const FLASH_FIRMWARE_DIALOG_UPDATE_FIRMWARE = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateFirmware`;
export const FLASH_FIRMWARE_DIALOG_UPDATE_BOOTLOADER_TYPE = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateBootloaderType`;
export const FLASH_FIRMWARE_DIALOG_UPDATE_FLASHING = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateFlashing`;
export const FLASH_FIRMWARE_DIALOG_UPDATE_PROGRESS_RATE = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateProgressRate`;
export const FLASH_FIRMWARE_DIALOG_UPDATE_MODE = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateMode`;
export const FLASH_FIRMWARE_DIALOG_UPDATE_LOGS = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateLogs`;
export const FLASH_FIRMWARE_DIALOG_APPEND_LOG = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/AppendLog`;
export const FLASH_FIRMWARE_DIALOG_CLEAR = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/Clear`;
export const FLASH_FIRMWARE_DIALOG_UPDATE_KEYBOARD_NAME = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateKeyboardName`;
export const FLASH_FIRMWARE_DIALOG_UPDATE_FLASH_MODE = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateFlashMode`;
export const FLASH_FIRMWARE_DIALOG_UPDATE_BUILDING_FIRMWARE_TASK = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateBuildingFirmwareTask`;
export const FlashFirmwareDialogActions = {
  updateFirmware: (firmware: IFirmware | null) => {
    return {
      type: FLASH_FIRMWARE_DIALOG_UPDATE_FIRMWARE,
      value: firmware,
    };
  },
  updateBootloaderType: (bootloaderType: IBootloaderType) => {
    return {
      type: FLASH_FIRMWARE_DIALOG_UPDATE_BOOTLOADER_TYPE,
      value: bootloaderType,
    };
  },
  updateFlashing: (flashing: boolean) => {
    return {
      type: FLASH_FIRMWARE_DIALOG_UPDATE_FLASHING,
      value: flashing,
    };
  },
  updateProgressRate: (progressRate: number) => {
    return {
      type: FLASH_FIRMWARE_DIALOG_UPDATE_PROGRESS_RATE,
      value: progressRate,
    };
  },
  updateLogs: (logs: string[]) => {
    return {
      type: FLASH_FIRMWARE_DIALOG_UPDATE_LOGS,
      value: logs,
    };
  },
  appendLog: (message: string, lineBreak: boolean = true) => {
    return {
      type: FLASH_FIRMWARE_DIALOG_APPEND_LOG,
      value: {
        message,
        lineBreak,
      },
    };
  },
  updateMode: (mode: IFlashFirmwareDialogMode) => {
    return {
      type: FLASH_FIRMWARE_DIALOG_UPDATE_MODE,
      value: mode,
    };
  },
  clear: () => {
    return {
      type: FLASH_FIRMWARE_DIALOG_CLEAR,
    };
  },
  updateKeyboardName: (keyboardName: string) => {
    return {
      type: FLASH_FIRMWARE_DIALOG_UPDATE_KEYBOARD_NAME,
      value: keyboardName,
    };
  },
  updateFlashMode: (flashMode: IFlashFirmwareDialogFlashMode) => {
    return {
      type: FLASH_FIRMWARE_DIALOG_UPDATE_FLASH_MODE,
      value: flashMode,
    };
  },
  updateBuildingFirmwareTask: (task: IFirmwareBuildingTask | null) => {
    return {
      type: FLASH_FIRMWARE_DIALOG_UPDATE_BUILDING_FIRMWARE_TASK,
      value: task,
    };
  },
};

type ActionTypes = ReturnType<
  | typeof LayoutOptionsActions[keyof typeof LayoutOptionsActions]
  | typeof NotificationActions[keyof typeof NotificationActions]
  | typeof AppActions[keyof typeof AppActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const firmwareActionsThunk = {
  uploadFirmwareFile:
    (file: File): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      // eslint-disable-next-line no-undef
      const loadBinaryFile = (file: File): Promise<ArrayBuffer> => {
        return new Promise<ArrayBuffer>((resolve) => {
          // eslint-disable-next-line no-undef
          const fileReader = new FileReader();
          fileReader.addEventListener('load', () => {
            resolve(fileReader.result as ArrayBuffer);
          });
          fileReader.readAsArrayBuffer(file);
        });
      };
      const firmwareArrayBuffer = await loadBinaryFile(file);
      dispatch(UploadFirmwareDialogActions.updateOpen(false));
      dispatch(
        UploadFirmwareDialogActions.uploadFirmwareFileBuffer(
          firmwareArrayBuffer
        )
      );
      dispatch(FlashFirmwareDialogActions.clear());
      const firmwareName = file.name;
      dispatch(FlashFirmwareDialogActions.updateKeyboardName('Your keyboard'));
      dispatch(FlashFirmwareDialogActions.updateFlashMode('upload_and_flash'));
      dispatch(
        FlashFirmwareDialogActions.updateFirmware({
          name: firmwareName,
          default_bootloader_type: 'caterina',
          flash_support: true,
          filename: firmwareName,
          description: '',
          hash: '',
          sourceCodeUrl: '',
          created_at: new Date(),
        })
      );
    },
  // eslint-disable-next-line no-undef
  flashFirmware:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const handleError = (error: string, cause?: any) => {
        console.error(error);
        dispatch(NotificationActions.addError(error, cause));
        dispatch(FlashFirmwareDialogActions.appendLog(`Error: ${error}`));
        dispatch(FlashFirmwareDialogActions.updateFlashing(false));
      };

      dispatch(FlashFirmwareDialogActions.updateLogs([]));
      dispatch(FlashFirmwareDialogActions.updateProgressRate(0));
      dispatch(FlashFirmwareDialogActions.updateMode('flashing'));
      dispatch(FlashFirmwareDialogActions.updateFlashing(true));
      const { entities, storage, serial, common } = getState();
      const firmwareWriter = serial.writer;
      const firmware = common.firmware.flashFirmwareDialog.firmware!;
      const bootloaderType =
        common.firmware.flashFirmwareDialog.bootloaderType!;
      const flashMode = common.firmware.flashFirmwareDialog.flashMode;

      let flashBytes: Buffer | undefined;
      if (flashMode === 'fetch_and_flash') {
        const definitionDocument = entities.keyboardDefinitionDocument!;
        sendEventToGoogleAnalytics('catalog/flash_firmware', {
          vendor_id: definitionDocument.vendorId,
          product_id: definitionDocument.productId,
          product_name: definitionDocument.productName,
        });
        dispatch(
          FlashFirmwareDialogActions.appendLog(
            'Reading the firmware binary from the server.',
            false
          )
        );
        const fetchBlobResult = await storage.instance!.fetchFirmwareFileBlob(
          definitionDocument.id,
          firmware.filename,
          'flash'
        );
        if (isError(fetchBlobResult)) {
          handleError(fetchBlobResult.error, fetchBlobResult.cause);
          return;
        }
        const blob: Blob = fetchBlobResult.value.blob;
        flashBytes = createFlashBytes(
          Buffer.from(new Uint8Array(await blob.arrayBuffer())),
          bootloaderType,
          dispatch
        );
        if (flashBytes === undefined) {
          return;
        }
      } else if (flashMode === 'build_and_flash') {
        dispatch(
          FlashFirmwareDialogActions.appendLog(
            'Reading the firmware binary from the server.',
            false
          )
        );
        const task = common.firmware.flashFirmwareDialog.buildingFirmwareTask!;
        const fetchBlobResult =
          await storage.instance!.fetchBuiltFirmwareFileBlob(
            task.firmwareFilePath
          );
        if (isError(fetchBlobResult)) {
          handleError(fetchBlobResult.error, fetchBlobResult.cause);
          return;
        }
        const blob: Blob = fetchBlobResult.value.blob;
        flashBytes = createFlashBytes(
          Buffer.from(new Uint8Array(await blob.arrayBuffer())),
          bootloaderType,
          dispatch
        );
        if (flashBytes === undefined) {
          return;
        }
      } else {
        flashBytes = createFlashBytes(
          Buffer.from(
            new Uint8Array(
              common.firmware.uploadFirmwareDialog.firmwareFileBuffer!
            )
          ),
          bootloaderType,
          dispatch
        );
        if (flashBytes === undefined) {
          return;
        }
      }
      dispatch(
        FlashFirmwareDialogActions.appendLog(
          'Reading the firmware binary done.'
        )
      );
      dispatch(FlashFirmwareDialogActions.updateProgressRate(15));

      const writeResult = await firmwareWriter.write(
        bootloaderType,
        flashBytes,
        null,
        (message, lineBreak) => {
          dispatch(FlashFirmwareDialogActions.appendLog(message, lineBreak));
        },
        (phase) => {
          let rate;
          switch (phase) {
            case 'opened':
              rate = 30;
              break;
            case 'initialized':
              rate = 45;
              break;
            case 'cleared':
              rate = 60;
              break;
            case 'wrote':
              rate = 75;
              break;
            case 'verified':
              rate = 90;
              break;
            case 'closed':
              rate = 100;
              break;
            default:
              throw new Error(`Unknown phase: ${phase}`);
          }
          dispatch(FlashFirmwareDialogActions.updateProgressRate(rate));
          if (phase === 'closed') {
            dispatch(
              FlashFirmwareDialogActions.appendLog(
                'Writing the firmware finished successfully.'
              )
            );
            dispatch(FlashFirmwareDialogActions.updateFlashing(false));
          }
        },
        (error, cause) => {
          handleError(error, cause);
        }
      );
      if (!writeResult.success) {
        handleError(writeResult.error!, writeResult.cause);
        return;
      }
    },
};

const createFlashBytes = (
  buffer: Buffer,
  bootloaderType: IBootloaderType,
  dispatch: ThunkDispatch<RootState, undefined, ActionTypes>
): Buffer | undefined => {
  try {
    switch (bootloaderType) {
      case 'caterina':
      case 'dfu':
        return intelHex.parse(buffer).data;
      case 'copy':
        return buffer;
    }
  } catch (error) {
    console.error(error);
    dispatch(
      NotificationActions.addError(
        'Creating the firmware binary failed.',
        error
      )
    );
    dispatch(FlashFirmwareDialogActions.appendLog(`Error: ${error}`));
    dispatch(FlashFirmwareDialogActions.updateFlashing(false));
    return undefined;
  }
};
