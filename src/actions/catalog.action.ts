import {
  IBuildableFirmwareCodeParameterValues,
  ICatalogPhase,
  IConditionNotSelected,
  IKeyboardFeatures,
  RootState,
} from '../store/state';
import { IEncoderKeymaps, IKeymap } from '../services/hid/Hid';
import { KeyboardLabelLang } from '../services/labellang/KeyLabelLangs';
import {
  AbstractKeymapData,
  IFirmwareBuildingTask,
  isError,
  isSuccessful,
} from '../services/storage/Storage';
import { KeycodeList } from '../services/hid/KeycodeList';
import {
  AppActions,
  LayoutOptionsActions,
  NotificationActions,
} from './actions';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { getEncoderIdList } from './utils';
import { KC_NO } from '../services/hid/KeycodeInfoList';
import { StorageActions } from './storage.action';

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
export const CATALOG_SEARCH_UPDATE_ORGANIZATION = `${CATALOG_SEARCH_ACTIONS}/UpdateOrganization`;
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
  updateOrganizationId: (organizationId: string | undefined) => {
    return {
      type: CATALOG_SEARCH_UPDATE_ORGANIZATION,
      value: organizationId,
    };
  },
};

export const CATALOG_KEYBOARD_ACTIONS = `@CatalogKeyboard`;
export const CATALOG_KEYBOARD_UPDATE_KEYMAPS = `${CATALOG_KEYBOARD_ACTIONS}/UpdateKeymaps`;
export const CATALOG_KEYBOARD_UPDATE_ENCODERS_KEYMAPS = `${CATALOG_KEYBOARD_ACTIONS}/UpdateEncodersKeymaps`;
export const CATALOG_KEYBOARD_UPDATE_SELECTED_LAYER = `${CATALOG_KEYBOARD_ACTIONS}/UpdateSelectedLayer`;
export const CATALOG_KEYBOARD_UPDATE_LANG_LABEL = `${CATALOG_KEYBOARD_ACTIONS}/UpdateLangLabel`;
export const CATALOG_KEYBOARD_CLEAR_KEYMAP = `${CATALOG_KEYBOARD_ACTIONS}/ClearKeymap`;
export const CATALOG_KEYBOARD_UPDATE_SELECTED_KEYMAP_DATA = `${CATALOG_KEYBOARD_ACTIONS}/UpdateSelectedKeymapData`;
export const CATALOG_KEYBOARRD_UPDATE_BUILDABLE_FIRMWARE_CODE_PARAMETER_VALUES = `${CATALOG_KEYBOARD_ACTIONS}/UpdateBuildableFirmwareCodeParameterValues`;
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
  updateEncodersKeymaps: (encodersKeymaps: IEncoderKeymaps[]) => {
    return {
      type: CATALOG_KEYBOARD_UPDATE_ENCODERS_KEYMAPS,
      value: encodersKeymaps,
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
  updateBuildableFirmwareCodeParameterValues: (
    values: IBuildableFirmwareCodeParameterValues
  ) => {
    return {
      type: CATALOG_KEYBOARRD_UPDATE_BUILDABLE_FIRMWARE_CODE_PARAMETER_VALUES,
      value: values,
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
  applySharedKeymapData:
    (savedKeymapData: AbstractKeymapData): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      const { entities } = getState();
      const labelLang = savedKeymapData.label_lang;
      const layoutOptions = savedKeymapData.layout_options;

      const keycodes: { [pos: string]: IKeymap }[] = [];
      const savedKeycodes: { [pos: string]: number }[] =
        savedKeymapData.keycodes;
      for (let i = 0; i < savedKeycodes.length; i++) {
        const savedCode = savedKeycodes[i];
        const keymaps: { [pos: string]: IKeymap } = {};
        // When the savedKeycodes was stored for BMP MCU, the length may be 11.
        // Therefore, the target layer must be checked to ensure that the value
        // is less than the savedKeycodes length.
        // See: https://github.com/remap-keys/remap/issues/454
        if (i < savedKeycodes.length) {
          Object.keys(savedCode).forEach((pos) => {
            keymaps[pos] = KeycodeList.getKeymap(
              savedCode[pos],
              labelLang,
              entities.keyboardDefinition!.customKeycodes
            );
          });
        }
        keycodes.push(keymaps);
      }

      const encoderIdList = getEncoderIdList(
        entities.keyboardDefinition!.layouts.keymap
      );
      const encodersKeycodes: IEncoderKeymaps[] = [];
      const savedEncodersKeycodes: {
        [id: number]: { clockwise: number; counterclockwise: number };
      }[] =
        savedKeymapData.encoderKeycodes ||
        // Shared keymaps don't have any encoder's key codes before supporting encoders in Remap.
        // Therefore, set initial key codes (KC_NO) for encoders here.
        (
          new Array(savedKeycodes.length) as {
            [id: number]: { clockwise: number; counterclockwise: number };
          }[]
        ).fill(
          encoderIdList.reduce<{
            [id: number]: { clockwise: number; counterclockwise: number };
          }>(
            (result, encoderId) => {
              result[encoderId] = { clockwise: KC_NO, counterclockwise: KC_NO };
              return result;
            },
            {} as {
              [id: number]: { clockwise: number; counterclockwise: number };
            }
          )
        );
      for (let i = 0; i < savedEncodersKeycodes.length; i++) {
        const savedEncodersCode = savedEncodersKeycodes[i];
        const encodersKeymaps: IEncoderKeymaps = {};
        // When the savedKeycodes was stored for BMP MCU, the length may be 11.
        // Therefore, the target layer must be checked to ensure that the value
        // is less than the savedKeycodes length.
        // See: https://github.com/remap-keys/remap/issues/454
        if (i < savedEncodersKeycodes.length) {
          Object.keys(savedEncodersCode).forEach((id) => {
            encodersKeymaps[Number(id)] = {
              clockwise: KeycodeList.getKeymap(
                savedEncodersCode[Number(id)].clockwise,
                labelLang,
                entities.keyboardDefinition!.customKeycodes
              ),
              counterclockwise: KeycodeList.getKeymap(
                savedEncodersCode[Number(id)].counterclockwise,
                labelLang,
                entities.keyboardDefinition!.customKeycodes
              ),
            };
          });
        }
        encodersKeycodes.push(encodersKeymaps);
      }

      dispatch(CatalogKeyboardActions.updateLangLabel(labelLang));
      dispatch(AppActions.updateLangLabel(labelLang));
      dispatch(CatalogKeyboardActions.updateKeymaps(keycodes));
      dispatch(CatalogKeyboardActions.updateEncodersKeymaps(encodersKeycodes));
      dispatch(LayoutOptionsActions.restoreLayoutOptions(layoutOptions));
      dispatch(CatalogKeyboardActions.updateSelectedLayer(0));
      dispatch(
        CatalogKeyboardActions.updateSelectedKeymapData(savedKeymapData)
      );
    },
  applySharedKeymap:
    (definitionId: string, keymapId: string): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const result = await storage.instance!.fetchSharedKeymap(keymapId);
      if (isSuccessful(result)) {
        dispatch(
          await catalogActionsThunk.applySharedKeymapData(
            result.value.sharedKeymap
          )
        );
      } else {
        console.error(result.error);
        dispatch(NotificationActions.addError(result.error!, result.cause));
        history.replaceState(null, 'Remap', `/catalog/${definitionId}/keymap`);
      }
    },
  logout:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { auth } = getState();
      dispatch(AppActions.updateSignedIn(false));
      await auth.instance!.signOut();
    },

  createFirmwareBuildingTask: (
    keyboardDefinitionId: string,
    description: string,
    parametersJson: string
  ): ThunkPromiseAction<void> => {
    return async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      dispatch(CatalogAppActions.updatePhase('processing'));
      const { storage } = getState();
      const result = await storage.instance!.createFirmwareBuildingTask(
        keyboardDefinitionId,
        description,
        parametersJson
      );
      if (isError(result)) {
        dispatch(NotificationActions.addError(result.error!, result.cause));
        dispatch(CatalogAppActions.updatePhase('build'));
        return;
      }
      await dispatch(
        catalogActionsThunk.updateFirmwareBuildingTasks(keyboardDefinitionId)
      );
      dispatch(CatalogAppActions.updatePhase('build'));
      dispatch(
        NotificationActions.addSuccess(
          'The firmware building task has been registered.'
        )
      );
    };
  },

  updateFirmwareBuildingTasks:
    (keyboardDefinitionId: string) =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      dispatch(StorageActions.updateFirmwareBuildingTasks([]));
      const { storage } = getState();
      const result = await storage.instance!.fetchFirmwareBuildingTasks(
        keyboardDefinitionId
      );
      if (isError(result)) {
        dispatch(NotificationActions.addError(result.error!, result.cause));
        return;
      }
      dispatch(StorageActions.updateFirmwareBuildingTasks(result.value));
    },

  deleteFirmwareBuildingTask:
    (keyboardDefinitionId: string, task: IFirmwareBuildingTask) =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const result = await storage.instance!.deleteFirmwareBuildingTask(task);
      if (isError(result)) {
        dispatch(NotificationActions.addError(result.error!, result.cause));
        return;
      }
      await dispatch(
        catalogActionsThunk.updateFirmwareBuildingTasks(keyboardDefinitionId)
      );
    },

  updateFirmwareBuildingTaskDescription:
    (taskId: string, description: string) =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, entities } = getState();
      const result =
        await storage.instance!.updateFirmwareBuildingTaskDescription(
          taskId,
          description
        );
      if (isError(result)) {
        dispatch(NotificationActions.addError(result.error!, result.cause));
        return;
      }
      dispatch(
        StorageActions.updateFirmwareBuildingTasks(
          entities.firmwareBuildingTasks.map<IFirmwareBuildingTask>((value) => {
            if (value.id === taskId) {
              return {
                ...value,
                description: description,
              };
            }
            return value;
          })
        )
      );
      dispatch(
        NotificationActions.addSuccess('The memorandum has been updated.')
      );
    },
};
