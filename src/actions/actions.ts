import { AnyKey } from '../components/configure/keycodekey/KeycodeKey';
import { Key } from '../components/configure/keycodekey/KeyGen';
import KeyModel from '../models/KeyModel';
import { IEncoderKeymap, IKeymap } from '../services/hid/Hid';
import { KeyboardLabelLang } from '../services/labellang/KeyLabelLangs';
import { PracticeCategoryId } from '../services/practice/PracticeTexts';
import {
  IKeySwitchOperation,
  ISetupPhase,
  ITypingStatsPerKeyboard,
  IUserInformation,
  IUserPurchase,
  RootState,
  SetupPhase,
} from '../store/state';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { LayoutOption } from '../components/configure/keymap/Keymap';
import { hidActionsThunk } from './hid.action';
import { isSuccessful } from '../types';

export const KEYMAP_ACTIONS = '@Keymap';
export const KEYMAP_CLEAR_SELECTED_KEY_POSITION = `${KEYMAP_ACTIONS}/ClearSelectedKeyPosition`;
export const KEYMAP_UPDATE_SELECTED_LAYER = `${KEYMAP_ACTIONS}/UpdateSelectedLayer`;
export const KEYMAP_UPDATE_SELECTED_KEY_POSITION = `${KEYMAP_ACTIONS}/UpdateSelectedKeyPosition`;
export const KeymapActions = {
  clearSelectedKeyPosition: () => {
    return {
      type: KEYMAP_CLEAR_SELECTED_KEY_POSITION,
    };
  },
  updateSelectedLayer: (layer: number) => {
    return {
      type: KEYMAP_UPDATE_SELECTED_LAYER,
      value: layer,
    };
  },
  updateSelectedKeyPosition: (
    pos: string,
    encoderId: number | null,
    keySwitchOperation: IKeySwitchOperation
  ) => {
    return {
      type: KEYMAP_UPDATE_SELECTED_KEY_POSITION,
      value: {
        pos,
        encoderId,
        keySwitchOperation,
      },
    };
  },
};

export const KEYMAP_TOOLBAR_ACTIONS = '@KeymapToolbar';
export const KEYMAP_TOOLBAR_TEST_MATRIX_MODE = `${KEYMAP_TOOLBAR_ACTIONS}/TestMatrixMode`;
export const KEYMAP_TOOLBAR_TYPING_PRACTICE_MODE = `${KEYMAP_TOOLBAR_ACTIONS}/TypingPracticeMode`;
export const KeymapToolbarActions = {
  updateTestMatrix: (flag: boolean) => {
    return {
      type: KEYMAP_TOOLBAR_TEST_MATRIX_MODE,
      value: flag,
    };
  },
  updateTypingPractice: (flag: boolean) => {
    return {
      type: KEYMAP_TOOLBAR_TYPING_PRACTICE_MODE,
      value: flag,
    };
  },
};

export const PRACTICE_ACTIONS = '@Practice';
export const PRACTICE_START = `${PRACTICE_ACTIONS}/Start`;
export const PRACTICE_UPDATE_INPUT = `${PRACTICE_ACTIONS}/UpdateInput`;
export const PRACTICE_RESET = `${PRACTICE_ACTIONS}/Reset`;
export const PRACTICE_FINISH = `${PRACTICE_ACTIONS}/Finish`;
export const PRACTICE_UPDATE_TEXT = `${PRACTICE_ACTIONS}/UpdateText`;
export const PRACTICE_UPDATE_CATEGORY = `${PRACTICE_ACTIONS}/UpdateCategory`;
export const PRACTICE_NEXT_SENTENCE = `${PRACTICE_ACTIONS}/NextSentence`;
export const PRACTICE_UPDATE_SENTENCES = `${PRACTICE_ACTIONS}/UpdateSentences`;
export const PRACTICE_UPDATE_STATS = `${PRACTICE_ACTIONS}/UpdateStats`;
export const PRACTICE_RESET_STATISTICS = `${PRACTICE_ACTIONS}/ResetStatistics`;
export const PRACTICE_LOAD_STATS = `${PRACTICE_ACTIONS}/LoadStats`;
export const PracticeActions = {
  start: () => {
    return {
      type: PRACTICE_START,
    };
  },
  updateInput: (input: string) => {
    return {
      type: PRACTICE_UPDATE_INPUT,
      value: input,
    };
  },
  reset: () => {
    return {
      type: PRACTICE_RESET,
    };
  },
  finish: () => {
    return {
      type: PRACTICE_FINISH,
    };
  },
  updateText: (text: string) => {
    return {
      type: PRACTICE_UPDATE_TEXT,
      value: text,
    };
  },
  updateCategory: (category: PracticeCategoryId) => {
    return {
      type: PRACTICE_UPDATE_CATEGORY,
      value: category,
    };
  },
  nextSentence: () => {
    return {
      type: PRACTICE_NEXT_SENTENCE,
    };
  },
  updateSentences: (sentences: string[]) => {
    return {
      type: PRACTICE_UPDATE_SENTENCES,
      value: sentences,
    };
  },
  updateStats: (keyboardId: string, char: string, isCorrect: boolean) => {
    return {
      type: PRACTICE_UPDATE_STATS,
      value: {
        keyboardId,
        char,
        isCorrect,
      },
    };
  },
  resetStatistics: (keyboardId: string) => {
    return {
      type: PRACTICE_RESET_STATISTICS,
      value: keyboardId,
    };
  },
  loadStats: (keyboardId: string, stats: ITypingStatsPerKeyboard) => {
    return {
      type: PRACTICE_LOAD_STATS,
      value: { keyboardId, stats },
    };
  },
};

export const KEYCODES_ACTIONS = '@Keycodes';
export const KEYCODES_UPDATE_MACRO = `${KEYCODES_ACTIONS}/UpdateMacro`;
export const KeycodesActions = {
  updateMacro: (code: number | undefined, text: string) => {
    return {
      type: KEYCODES_UPDATE_MACRO,
      value: { code: code, text: text },
    };
  },
};

export const KEYCODEKEY_ACTIONS = '@KeycodeKey';
export const KEYCODEKEY_UPDATE_DRAGGING_KEY = `${KEYCODEKEY_ACTIONS}/UpdateDraggingKey`;
export const KEYCODEKEY_UPDATE_SELECTED_KEY = `${KEYCODEKEY_ACTIONS}/UpdateSelectedKey`;
export const KEYCODEKEY_UPDATE_HOVER_KEY = `${KEYCODEKEY_ACTIONS}/UpdateHoverKey`;
export const KEYCODEKEY_CLEAR = `${KEYCODEKEY_ACTIONS}/Clear`;
export const KeycodeKeyActions = {
  updateDraggingKey: (key: Key | null) => {
    return {
      type: KEYCODEKEY_UPDATE_DRAGGING_KEY,
      value: key,
    };
  },
  updateSelectedKey: (key: Key | null) => {
    return {
      type: KEYCODEKEY_UPDATE_SELECTED_KEY,
      value: key,
    };
  },
  updateHoverKey: (key: Key | null) => {
    return {
      type: KEYCODEKEY_UPDATE_HOVER_KEY,
      value: key,
    };
  },
  clear: () => {
    return {
      type: KEYCODEKEY_CLEAR,
    };
  },
};

export const ANYKEYCODEKEY_ACTIONS = '@AnyKeycodeKey';
export const ANYKEYCODEKEY_ADD_ANYKEY = `${ANYKEYCODEKEY_ACTIONS}/AddAnyKey`;
export const ANYKEYCODEKEY_UPDATE_ANYKEY = `${ANYKEYCODEKEY_ACTIONS}/UpdateAnyKey`;
export const AnyKeycodeKeyActions = {
  addAnyKey: (anyKey: AnyKey) => {
    return {
      type: ANYKEYCODEKEY_ADD_ANYKEY,
      value: anyKey,
    };
  },
  updateAnyKey: (index: number, anyKey: AnyKey) => {
    return {
      type: ANYKEYCODEKEY_UPDATE_ANYKEY,
      value: {
        index,
        anyKey,
      },
    };
  },
};

export const KEYDIFF_ACTIONS = '@Keydiff';
export const KEYDIFF_CLEAR_KEYDIFF = `${KEYDIFF_ACTIONS}/ClearKeydiff`;
export const KEYDIFF_UPDATE_KEYDIFF = `${KEYDIFF_ACTIONS}/UpdateKeydiff`;
export const KeydiffActions = {
  updateKeydiff: (orig: IKeymap, dest: IKeymap) => {
    return {
      type: KEYDIFF_UPDATE_KEYDIFF,
      value: { origin: orig, destination: dest },
    };
  },
  clearKeydiff: () => {
    return {
      type: KEYDIFF_CLEAR_KEYDIFF,
    };
  },
};

const NotifyType = ['success', 'warning', 'error', 'info'] as const;
export type NotificationType = (typeof NotifyType)[number];
export type NotificationItem = {
  key: string;
  type: NotificationType;
  message: string;
};
export const NOTIFICATION_ACTIONS = '@Notification';
export const NOTIFICATION_ADD_ERROR = `${NOTIFICATION_ACTIONS}/AddError`;
export const NOTIFICATION_ADD_WARN = `${NOTIFICATION_ACTIONS}/AddWarn`;
export const NOTIFICATION_ADD_INFO = `${NOTIFICATION_ACTIONS}/AddInfo`;
export const NOTIFICATION_ADD_SUCCESS = `${NOTIFICATION_ACTIONS}/AddSuccess`;
export const NOTIFICATION_REMOVE = `${NOTIFICATION_ACTIONS}/Remove`;
export const NotificationActions = {
  addError: (message: string, cause?: any) => {
    return {
      type: NOTIFICATION_ADD_ERROR,
      value: {
        message,
        cause,
      },
    };
  },
  addWarn: (message: string, cause?: any) => {
    return {
      type: NOTIFICATION_ADD_WARN,
      value: {
        message,
        cause,
      },
    };
  },
  addInfo: (message: string) => {
    return {
      type: NOTIFICATION_ADD_INFO,
      value: message,
    };
  },
  addSuccess: (message: string) => {
    return {
      type: NOTIFICATION_ADD_SUCCESS,
      value: message,
    };
  },
  removeNotification: (key: string) => {
    return {
      type: NOTIFICATION_REMOVE,
      value: key,
    };
  },
};

export const HEADER_ACTIONS = '@Header';
export const HEADER_UPDATE_FLASHING = `${HEADER_ACTIONS}/UpdateFlashing`;
export const HeaderActions = {
  updateFlashing: (loading: boolean) => {
    return {
      type: HEADER_UPDATE_FLASHING,
      value: loading,
    };
  },
};

export const APP_ACTIONS = '@App';
export const APP_UPDATE_SETUP_PHASE = `${APP_ACTIONS}/UpdateSetupPhase`;
export const APP_REMAPS_INIT = `${APP_ACTIONS}/RemapsInit`;
export const APP_REMAPS_SET_KEY = `${APP_ACTIONS}/RemapsSetKey`;
export const APP_REMAPS_SET_KEYS = `${APP_ACTIONS}/RemapsSetKeys`;
export const APP_REMAPS_REMOVE_KEY = `${APP_ACTIONS}/RemapsRemoveKey`;
export const APP_REMAPS_CLEAR = `${APP_ACTIONS}/Clear`;
export const APP_ENCODERS_REMAPS_INIT = `${APP_ACTIONS}/EncodersRemapsInit`;
export const APP_ENCODERS_REMAPS_SET_KEY = `${APP_ACTIONS}/EncodersRemapsSetKey`;
export const APP_ENCODERS_REMAPS_SET_KEYS = `${APP_ACTIONS}/EncodersRemapsSetKeys`;
export const APP_ENCODERS_REMAPS_REMOVE_KEY = `${APP_ACTIONS}/EncodersRemapsRemoveKey`;
export const APP_ENCODERS_REMAPS_CLEAR = `${APP_ACTIONS}/EncodersRemapsClear`;
export const APP_PACKAGE_INIT = `${APP_ACTIONS}/PackageInit`;
export const APP_UPDATE_KEYBOARD_SIZE = `${APP_ACTIONS}/UpdateKeyboardSize`;
export const APP_UPDATE_LANG_LABEL = `${APP_ACTIONS}/UpdateLangLabel`;
export const APP_UPDATE_SIGNED_IN = `${APP_ACTIONS}/SignedIn`;
export const APP_TESTED_MATRIX_CLEAR = `${APP_ACTIONS}/TestedMatrixClear`;
export const APP_TEST_MATRIX_UPDATE = `${APP_ACTIONS}/TestMatrixUpdate`;
export const APP_UPDATE_USER_INFORMATION = `${APP_ACTIONS}/UpdateUserInformation`;
export const APP_UPDATE_USER_PURCHASE = `${APP_ACTIONS}/UpdateUserPurchase`;
export const AppActions = {
  updateSetupPhase: (setupPhase: ISetupPhase) => {
    return {
      type: APP_UPDATE_SETUP_PHASE,
      value: setupPhase,
    };
  },
  remapsInit: (layerCount: number) => {
    const remaps: { [pos: string]: KeyModel }[] = new Array(layerCount).fill(
      {}
    );
    return {
      type: APP_REMAPS_INIT,
      value: remaps,
    };
  },
  remapsSetKey: (layer: number, pos: string, keymap: IKeymap) => {
    return {
      type: APP_REMAPS_SET_KEY,
      value: {
        layer: layer,
        pos: pos,
        keymap,
      },
    };
  },
  remapsSetKeys: (keymaps: { [pos: string]: IKeymap }[]) => {
    return {
      type: APP_REMAPS_SET_KEYS,
      value: keymaps,
    };
  },
  remapsRemoveKey: (layer: number, pos: string) => {
    return {
      type: APP_REMAPS_REMOVE_KEY,
      value: {
        pos: pos,
        layer: layer,
      },
    };
  },
  remapsClear: () => {
    return {
      type: APP_REMAPS_CLEAR,
    };
  },
  encodersRemapsInit: (layerCount: number) => {
    const encodersRemaps: { [id: number]: IEncoderKeymap }[] = new Array(
      layerCount
    ).fill({});
    return {
      type: APP_ENCODERS_REMAPS_INIT,
      value: encodersRemaps,
    };
  },
  encodersRemapsSetKey: (
    layer: number,
    id: number,
    keymap: IKeymap,
    keySwitchOperation: IKeySwitchOperation
  ) => {
    return {
      type: APP_ENCODERS_REMAPS_SET_KEY,
      value: {
        layer,
        id,
        keymap,
        keySwitchOperation,
      },
    };
  },
  encodersRemapsSetKeys: (
    keymaps: {
      [id: number]: {
        clockwise?: IKeymap;
        counterclockwise?: IKeymap;
      };
    }[]
  ) => {
    return {
      type: APP_ENCODERS_REMAPS_SET_KEYS,
      value: keymaps,
    };
  },
  encodersRemapsRemoveKey: (
    layer: number,
    id: number,
    keySwitchOperation: IKeySwitchOperation
  ) => {
    return {
      type: APP_ENCODERS_REMAPS_REMOVE_KEY,
      value: {
        id,
        layer,
        keySwitchOperation,
      },
    };
  },
  encodersRemapsClear: () => {
    return {
      type: APP_ENCODERS_REMAPS_CLEAR,
    };
  },
  initAppPackage: (name: string, version: string) => {
    return {
      type: APP_PACKAGE_INIT,
      value: {
        name: name,
        version: version,
      },
    };
  },
  updateKeyboardSize: (width: number, height: number) => {
    return {
      type: APP_UPDATE_KEYBOARD_SIZE,
      value: { width, height },
    };
  },
  updateLangLabel: (langLabel: KeyboardLabelLang) => {
    return {
      type: APP_UPDATE_LANG_LABEL,
      value: langLabel,
    };
  },
  updateSignedIn: (signedIn: boolean) => {
    return {
      type: APP_UPDATE_SIGNED_IN,
      value: signedIn,
    };
  },
  clearTestedMatrix: () => {
    return {
      type: APP_TESTED_MATRIX_CLEAR,
    };
  },
  updateCurrentTestMatrix: (posList: string[]) => {
    return {
      type: APP_TEST_MATRIX_UPDATE,
      value: posList,
    };
  },
  updateUserInformation: (userInformation: IUserInformation | undefined) => {
    return {
      type: APP_UPDATE_USER_INFORMATION,
      value: userInformation,
    };
  },
  updateUserPurchase: (purchase: IUserPurchase | undefined) => {
    return {
      type: APP_UPDATE_USER_PURCHASE,
      value: purchase,
    };
  },
};

type ActionTypes = ReturnType<
  | (typeof AppActions)[keyof typeof AppActions]
  | (typeof NotificationActions)[keyof typeof NotificationActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const AppActionsThunk = {
  // eslint-disable-next-line no-undef
  logout:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      const { auth } = getState();
      dispatch(AppActions.updateSignedIn(false));
      dispatch(AppActions.updateUserInformation(undefined));
      dispatch(AppActions.updateUserPurchase(undefined));
      await auth.instance!.signOut();
      dispatch(await hidActionsThunk.closeOpenedKeyboard());
      dispatch(AppActions.updateSetupPhase(SetupPhase.keyboardNotSelected));
    },
  loginWithGitHubAccount:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      const { auth } = getState();
      const result = await auth.instance!.signInWithGitHubWithPopup();
      if (!result.success) {
        console.error(result.cause!);
        dispatch(NotificationActions.addError(result.error!, result.cause));
      }
    },
  loginWithGoogleAccount:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      const { auth } = getState();
      const result = await auth.instance!.signInWithGoogleWithPopup();
      if (!result.success) {
        console.error(result.cause!);
        dispatch(NotificationActions.addError(result.error!, result.cause));
      }
    },
  linkToGoogleAccount:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      const { auth } = getState();
      const result = await auth.instance!.linkToGoogleWithPopup();
      if (!result.success) {
        console.error(result.cause!);
        dispatch(NotificationActions.addError(result.error!, result.cause));
      }
    },
  linkToGitHubAccount:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      const { auth } = getState();
      const result = await auth.instance!.linkToGitHubWithPopup();
      if (!result.success) {
        console.error(result.cause!);
        dispatch(NotificationActions.addError(result.error!, result.cause));
      }
    },
  fetchUserInformation: (): ThunkPromiseAction<void> => {
    return async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, auth, app } = getState();
      if (!app.signedIn) {
        dispatch(AppActions.updateUserInformation(undefined));
        return;
      }
      const user = auth.instance!.getCurrentAuthenticatedUserIgnoreNull();
      if (user === null) {
        dispatch(AppActions.updateUserInformation(undefined));
        return;
      }
      const result = await storage.instance!.getUserInformation(user.uid);
      if (isSuccessful(result)) {
        dispatch(AppActions.updateUserInformation(result.value));
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    };
  },
  fetchUserPurchase: (): ThunkPromiseAction<void> => {
    return async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, auth, app } = getState();
      if (!app.signedIn) {
        dispatch(AppActions.updateUserPurchase(undefined));
        return;
      }
      const user = auth.instance!.getCurrentAuthenticatedUserIgnoreNull();
      if (user === null) {
        dispatch(AppActions.updateUserPurchase(undefined));
        return;
      }
      const result = await storage.instance!.getUserPurchase(user.uid);
      if (isSuccessful(result)) {
        dispatch(AppActions.updateUserPurchase(result.value));
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    };
  },
};

export const PracticeActionsThunk = {
  loadTypingStats:
    (keyboardDefinitionId: string): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, auth, app } = getState();
      if (!app.signedIn) {
        return;
      }
      const user = auth.instance!.getCurrentAuthenticatedUserOrNull();
      if (!user) {
        return;
      }
      const result = await storage.instance!.fetchTypingStats(
        user.uid,
        keyboardDefinitionId
      );
      if (isSuccessful(result)) {
        dispatch(
          PracticeActions.loadStats(keyboardDefinitionId, result.value.stats)
        );
      } else {
        console.error(result.cause);
      }
    },
  saveTypingStats:
    (keyboardDefinitionId: string): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, auth, app, configure } = getState();
      if (!app.signedIn) {
        return;
      }
      const user = auth.instance!.getCurrentAuthenticatedUserOrNull();
      if (!user) {
        return;
      }
      const stats = configure.typingStats[keyboardDefinitionId];
      if (!stats) {
        return;
      }
      const result = await storage.instance!.saveTypingStats(
        user.uid,
        keyboardDefinitionId,
        stats
      );
      if (!isSuccessful(result)) {
        console.error(result.cause);
        dispatch(
          NotificationActions.addError(
            'Failed to save typing statistics',
            result.cause
          )
        );
      }
    },
  resetTypingStats:
    (keyboardDefinitionId: string): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, auth, app } = getState();
      dispatch(PracticeActions.resetStatistics(keyboardDefinitionId));
      if (!app.signedIn) {
        return;
      }
      const user = auth.instance!.getCurrentAuthenticatedUserOrNull();
      if (!user) {
        return;
      }
      const result = await storage.instance!.deleteTypingStats(
        user.uid,
        keyboardDefinitionId
      );
      if (!isSuccessful(result)) {
        console.error(result.cause);
        dispatch(
          NotificationActions.addError(
            'Failed to reset typing statistics',
            result.cause
          )
        );
      }
    },
};

export const LAYOUT_OPTIONS_ACTIONS = '@LayoutOptions';
export const LAYOUT_OPTIONS_INIT_SELECTED_OPTION = `${LAYOUT_OPTIONS_ACTIONS}/InitSelectedOption`;
export const LAYOUT_OPTIONS_UPDATE_SELECTED_OPTION = `${LAYOUT_OPTIONS_ACTIONS}/UpdateSelectedOption`;
export const LAYOUT_OPTIONS_RESTORE_SELECTED_OPTIONS = `${LAYOUT_OPTIONS_ACTIONS}/RestoreSelectedOptions`;
export const LayoutOptionsActions = {
  restoreLayoutOptions: (layoutOptions: LayoutOption[]) => {
    return {
      type: LAYOUT_OPTIONS_RESTORE_SELECTED_OPTIONS,
      value: layoutOptions,
    };
  },
  updateSelectedOption: (option: number, optionChoice: number) => {
    return {
      type: LAYOUT_OPTIONS_UPDATE_SELECTED_OPTION,
      value: {
        option,
        optionChoice,
      },
    };
  },

  initSelectedOptions: (options: (string | string[])[]) => {
    const list: LayoutOption[] = [];
    for (let i = 0; i < options.length; i++) {
      list.push({ option: i, optionChoice: 0 });
    }

    return {
      type: LAYOUT_OPTIONS_INIT_SELECTED_OPTION,
      value: list,
    };
  },
};
