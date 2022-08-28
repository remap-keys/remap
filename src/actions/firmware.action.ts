import {
  AppActions,
  LayoutOptionsActions,
  NotificationActions,
} from './actions';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { IFlashFirmwareDialogMode, RootState } from '../store/state';
import { sendEventToGoogleAnalytics } from '../utils/GoogleAnalytics';
import intelHex from 'intel-hex';
import { IFirmware } from '../services/storage/Storage';
import { IBootloaderType } from '../services/firmware/Types';

export const FLASH_FIRMWARE_DIALOG_ACTIONS = '@FlashFirmwareDialog';
export const FLASH_FIRMWARE_DIALOG_UPDATE_FIRMWARE = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateFirmware`;
export const FLASH_FIRMWARE_DIALOG_UPDATE_BOOTLOADER_TYPE = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateBootloaderType`;
export const FLASH_FIRMWARE_DIALOG_UPDATE_FLASHING = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateFlashing`;
export const FLASH_FIRMWARE_DIALOG_UPDATE_PROGRESS_RATE = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateProgressRate`;
export const FLASH_FIRMWARE_DIALOG_UPDATE_MODE = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateMode`;
export const FLASH_FIRMWARE_DIALOG_UPDATE_LOGS = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateLogs`;
export const FLASH_FIRMWARE_DIALOG_APPEND_LOG = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/AppendLog`;
export const FLASH_FIRMWARE_DIALOG_CLEAR = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/Clear`;
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
  // eslint-disable-next-line no-undef
  fetchAndFlashFirmware:
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
      const definitionDocument = entities.keyboardDefinitionDocument!;
      const firmware = common.firmware.flashFirmwareDialog.firmware!;
      const bootloaderType =
        common.firmware.flashFirmwareDialog.bootloaderType!;
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
      if (!fetchBlobResult.success) {
        handleError(fetchBlobResult.error!, fetchBlobResult.cause);
        return;
      }
      const blob: Blob = fetchBlobResult.blob!;
      const flashBytes = intelHex.parse(
        Buffer.from(new Uint8Array(await blob.arrayBuffer()))
      ).data;
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
