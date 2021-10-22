import {
  ICatalogPhase,
  IConditionNotSelected,
  IFlashFirmwareDialogMode,
  IKeyboardFeatures,
  RootState,
} from '../store/state';
import { IKeymap } from '../services/hid/Hid';
import { KeyboardLabelLang } from '../services/labellang/KeyLabelLangs';
import { AbstractKeymapData, IFirmware } from '../services/storage/Storage';
import { KeycodeList } from '../services/hid/KeycodeList';
import {
  AppActions,
  LayoutOptionsActions,
  NotificationActions,
} from './actions';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import intelHex from 'intel-hex';

export const CATALOG_APP_ACTIONS = `@CatalogApp`;
export const CATALOG_APP_UPDATE_PHASE = `${CATALOG_APP_ACTIONS}/UpdatePhase`;
export const CatalogAppActions = {
  updatePhase: (phase: ICatalogPhase) => {
    return {
      type: CATALOG_APP_UPDATE_PHASE,
      value: phase,
    };
  },
};

export const CATALOG_SEARCH_ACTIONS = `@CatalogSearch`;
export const CATALOG_SEARCH_UPDATE_FEATURES = `${CATALOG_SEARCH_ACTIONS}/UpdateFeatures`;
export const CATALOG_SEARCH_UPDATE_KEYWORD = `${CATALOG_SEARCH_ACTIONS}/UpdateKeyword`;
export const CATALOG_SEARCH_CLEAR_FEATURES = `${CATALOG_SEARCH_ACTIONS}/ClearFeatures`;
export const CATALOG_SEARCH_RESET_FEATURES = `${CATALOG_SEARCH_ACTIONS}/ResetFeatures`;
export const CatalogSearchActions = {
  updateFeatures: (
    value: IKeyboardFeatures | IConditionNotSelected,
    targetFeatures: readonly IKeyboardFeatures[]
  ) => {
    return {
      type: CATALOG_SEARCH_UPDATE_FEATURES,
      value: {
        value,
        targetFeatures,
      },
    };
  },
  updateKeyword: (value: string) => {
    return {
      type: CATALOG_SEARCH_UPDATE_KEYWORD,
      value,
    };
  },
  clearFeatures: () => {
    return {
      type: CATALOG_SEARCH_CLEAR_FEATURES,
    };
  },
  resetFeatures: (value: IKeyboardFeatures[]) => {
    return {
      type: CATALOG_SEARCH_RESET_FEATURES,
      value: value,
    };
  },
};

export const FLASH_FIRMWARE_DIALOG_ACTIONS = '@FlashFirmwareDialog';
export const FLASH_FIRMWARE_DIALOG_UPDATE_FIRMWARE = `${FLASH_FIRMWARE_DIALOG_ACTIONS}/UpdateFirmware`;
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

export const CATALOG_KEYBOARD_ACTIONS = `@CatalogKeyboard`;
export const CATALOG_KEYBOARD_UPDATE_KEYMAPS = `${CATALOG_KEYBOARD_ACTIONS}/UpdateKeymaps`;
export const CATALOG_KEYBOARD_UPDATE_SELECTED_LAYER = `${CATALOG_KEYBOARD_ACTIONS}/UpdateSelectedLayer`;
export const CATALOG_KEYBOARD_UPDATE_LANG_LABEL = `${CATALOG_KEYBOARD_ACTIONS}/UpdateLangLabel`;
export const CATALOG_KEYBOARD_CLEAR_KEYMAP = `${CATALOG_KEYBOARD_ACTIONS}/ClearKeymap`;
export const CATALOG_KEYBOARD_UPDATE_SELECTED_KEYMAP_DATA = `${CATALOG_KEYBOARD_ACTIONS}/UpdateSelectedKeymapData`;
export const CatalogKeyboardActions = {
  updateKeymaps: (
    keymaps: {
      [pos: string]: IKeymap;
    }[]
  ) => {
    return {
      type: CATALOG_KEYBOARD_UPDATE_KEYMAPS,
      value: keymaps,
    };
  },
  updateSelectedLayer: (selectedLayer: number) => {
    return {
      type: CATALOG_KEYBOARD_UPDATE_SELECTED_LAYER,
      value: selectedLayer,
    };
  },
  updateLangLabel: (langLabel: KeyboardLabelLang) => {
    return {
      type: CATALOG_KEYBOARD_UPDATE_LANG_LABEL,
      value: langLabel,
    };
  },
  clearKeymap: () => {
    return {
      type: CATALOG_KEYBOARD_CLEAR_KEYMAP,
    };
  },
  updateSelectedKeymapData: (selectedKeymapData: AbstractKeymapData) => {
    return {
      type: CATALOG_KEYBOARD_UPDATE_SELECTED_KEYMAP_DATA,
      value: selectedKeymapData,
    };
  },
};

type ActionTypes = ReturnType<
  | typeof CatalogKeyboardActions[keyof typeof CatalogKeyboardActions]
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
export const catalogActionsThunk = {
  // eslint-disable-next-line no-undef
  applySharedKeymapData: (
    savedKeymapData: AbstractKeymapData
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    // eslint-disable-next-line no-unused-vars
    getState: () => RootState
  ) => {
    const labelLang = savedKeymapData.label_lang;
    const layoutOptions = savedKeymapData.layout_options;
    let keycodes: { [pos: string]: IKeymap }[] = [];
    const savedKeycodes: { [pos: string]: number }[] = savedKeymapData.keycodes;
    for (let i = 0; i < savedKeycodes.length; i++) {
      const savedCode = savedKeycodes[i];
      const changes: { [pos: string]: IKeymap } = {};
      // When the savedKeycodes was stored for BMP MCU, the length may be 11.
      // Therefore, the target layer must be checked to ensure that the value
      // is less than the savedKeycodes length.
      // See: https://github.com/remap-keys/remap/issues/454
      if (i < savedKeycodes.length) {
        Object.keys(savedCode).forEach((pos) => {
          changes[pos] = KeycodeList.getKeymap(savedCode[pos], labelLang);
        });
      }
      keycodes.push(changes);
    }
    dispatch(CatalogKeyboardActions.updateLangLabel(labelLang));
    dispatch(AppActions.updateLangLabel(labelLang));
    dispatch(CatalogKeyboardActions.updateKeymaps(keycodes));
    dispatch(LayoutOptionsActions.restoreLayoutOptions(layoutOptions));
    dispatch(CatalogKeyboardActions.updateSelectedLayer(0));
    dispatch(CatalogKeyboardActions.updateSelectedKeymapData(savedKeymapData));
  },
  applySharedKeymap: (
    definitionId: string,
    keymapId: string
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage } = getState();
    const result = await storage.instance!.fetchSharedKeymap(keymapId);
    if (result.success) {
      dispatch(
        await catalogActionsThunk.applySharedKeymapData(result.sharedKeymap!)
      );
    } else {
      console.error(result.error);
      dispatch(NotificationActions.addError(result.error!, result.cause));
      history.replaceState(null, 'Remap', `/catalog/${definitionId}/keymap`);
    }
  },
  logout: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { auth } = getState();
    dispatch(AppActions.updateSignedIn(false));
    await auth.instance!.signOut();
  },
  flashFirmware: (): ThunkPromiseAction<void> => async (
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
    const { entities, catalog, storage, serial } = getState();
    const firmwareWriter = serial.writer;
    const definitionDocument = entities.keyboardDefinitionDocument!;
    const firmware = catalog.keyboard.flashFirmwareDialog.firmware!;
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
      FlashFirmwareDialogActions.appendLog('Reading the firmware binary done.')
    );
    dispatch(FlashFirmwareDialogActions.updateProgressRate(15));
    const writeResult = await firmwareWriter.write(
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
