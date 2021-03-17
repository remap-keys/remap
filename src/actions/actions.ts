import { AnyKey } from '../components/configure/keycodekey/KeycodeKey';
import { Key } from '../components/configure/keycodekey/KeyGen';
import KeyModel from '../models/KeyModel';
import { IKeymap } from '../services/hid/Hid';
import { KeyboardLabelLang } from '../services/labellang/KeyLabelLangs';
import { ISetupPhase, RootState, SetupPhase } from '../store/state';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { hidActionsThunk } from './hid.action';

export const KEYMAP_ACTIONS = '@Keymap';
export const KEYMAP_CLEAR_SELECTED_POS = `${KEYMAP_ACTIONS}/ClearSelectedLayer`;
export const KEYMAP_UPDATE_SELECTED_LAYER = `${KEYMAP_ACTIONS}/UpdateSelectedLayer`;
export const KEYMAP_UPDATE_SELECTED_POS = `${KEYMAP_ACTIONS}/UpdateSelectedPos`;
export const KeymapActions = {
  clearSelectedPos: () => {
    return {
      type: KEYMAP_UPDATE_SELECTED_POS,
    };
  },
  updateSelectedLayer: (layer: number) => {
    return {
      type: KEYMAP_UPDATE_SELECTED_LAYER,
      value: layer,
    };
  },
  updateSelectedPos: (pos: string) => {
    return {
      type: KEYMAP_UPDATE_SELECTED_POS,
      value: pos,
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
export type NotificationType = typeof NotifyType[number];
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
export const APP_REMAPS_REMOVE_KEY = `${APP_ACTIONS}/RemapsRemoveKey`;
export const APP_REMAPS_CLEAR = `${APP_ACTIONS}/Clear`;
export const APP_PACKAGE_INIT = `${APP_ACTIONS}/PackageInit`;
export const APP_UPDATE_KEYBOARD_SIZE = `${APP_ACTIONS}/UpdateKeyboardSize`;
export const APP_UPDATE_LANG_LABEL = `${APP_ACTIONS}/UpdateLangLabel`;
export const APP_UPDATE_SIGNED_IN = `${APP_ACTIONS}/SignedIn`;
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
};

type ActionTypes = ReturnType<
  | typeof AppActions[keyof typeof AppActions]
  | typeof NotificationActions[keyof typeof NotificationActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const AppActionsThunk = {
  // eslint-disable-next-line no-undef
  logout: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    // eslint-disable-next-line no-unused-vars
    getState: () => RootState
  ) => {
    const { auth } = getState();
    await auth.instance!.signOut();
    dispatch(AppActions.updateSignedIn(false));
    dispatch(await hidActionsThunk.closeOpenedKeyboard);
    dispatch(AppActions.updateSetupPhase(SetupPhase.keyboardNotSelected));
  },
  loginWithGitHubAccount: (): ThunkPromiseAction<void> => async (
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
  loginWithGoogleAccount: (): ThunkPromiseAction<void> => async (
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
  linkToGoogleAccount: (): ThunkPromiseAction<void> => async (
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
  linkToGitHubAccount: (): ThunkPromiseAction<void> => async (
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
};

export const LAYOUT_OPTIONS_ACTIONS = '@LayoutOptions';
export const LAYOUT_OPTIONS_INIT_SELECTED_OPTION = `${LAYOUT_OPTIONS_ACTIONS}/InitSelectedOption`;
export const LAYOUT_OPTIONS_UPDATE_SELECTED_OPTION = `${LAYOUT_OPTIONS_ACTIONS}/UpdateSelectedOption`;
export const LayoutOptionsActions = {
  updateSelectedOption: (optionIndex: number, option: string | null) => {
    return {
      type: LAYOUT_OPTIONS_UPDATE_SELECTED_OPTION,
      value: {
        optionIndex,
        option,
      },
    };
  },
  initSelectedOptions: (options: (string | string[])[]) => {
    const list: (null | string)[] = options.map((item) => {
      return typeof item == 'string' ? null : item[1]; // the default value should be off or 1st value
    });
    return {
      type: LAYOUT_OPTIONS_INIT_SELECTED_OPTION,
      value: list,
    };
  },
};
