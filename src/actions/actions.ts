import { Key } from '../components/configure/keycodes/Keycodes.container';

export const KEYBOARDS_ACTIONS = '@Keyboards';
export const KEYBOARDS_UPDATE_SELECTED_LAYER = `${KEYBOARDS_ACTIONS}/UpdateSelectedLayer`;
export const KeyboardsActions = {
  updateSelectedLayer: (layer: number) => {
    return {
      type: KEYBOARDS_UPDATE_SELECTED_LAYER,
      value: layer,
    };
  },
};

export const KEYCODES_ACTIONS = '@Keycodes';
export const KEYCODES_UPDATE_CATEGORY = `${KEYCODES_ACTIONS}/UpdateCategory`;
export const KEYCODES_UPDATE_MACRO = `${KEYCODES_ACTIONS}/UpdateMacro`;
export const KEYCODES_LOAD_KEYCODE_INFO_FOR_ALL_CATEGORIES = `${KEYCODES_ACTIONS}/LoadKeycodeInfoForAllCategories`;
export const KeycodesActions = {
  updateCategory: (value: string) => {
    return {
      type: KEYCODES_UPDATE_CATEGORY,
      value: value,
    };
  },
  updateMacro: (code: number | undefined, text: string) => {
    return {
      type: KEYCODES_UPDATE_MACRO,
      value: { code: code, text: text },
    };
  },
  loadKeycodeInfoForAllCategories: () => {
    return {
      type: KEYCODES_LOAD_KEYCODE_INFO_FOR_ALL_CATEGORIES,
    };
  },
};

export const KEYCODEKEY_ACTIONS = '@KeycodeKey';
export const KEYCODEKEY_UPDATE_SELECTED_KEY = `${KEYCODEKEY_ACTIONS}/UpdateSelectedKey`;
export const KEYCODEKEY_UPDATE_HOVER_KEY = `${KEYCODEKEY_ACTIONS}/UpdateHoverKey`;
export const KeycodeKeyActions = {
  updateSelectedKey: (key: Key) => {
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
};

export const NOTIFICATION_ACTIONS = '@Notification';
export const NOTIFICATION_ADD_ERROR = `${NOTIFICATION_ACTIONS}/AddError`;
export const NOTIFICATION_ADD_WARN = `${NOTIFICATION_ACTIONS}/AddWarn`;
export const NotificationActions = {
  addError: (message: string) => {
    return {
      type: NOTIFICATION_ADD_ERROR,
      value: message,
    };
  },
  addWarn: (message: string) => {
    return {
      type: NOTIFICATION_ADD_WARN,
      value: message,
    };
  },
};

export const HEADER_ACTIONS = '@Header';
export const HEADER_UPDATE_FLUSH_LOADING = `${HEADER_ACTIONS}/UpdateFlushLoading`;
export const HeaderActions = {
  updateFlush: (loading: boolean) => {
    return {
      type: HEADER_UPDATE_FLUSH_LOADING,
      value: loading,
    };
  },
};

export const APP_ACTIONS = '@App';
export const APP_UPDATE_OPENING = `${APP_ACTIONS}/UpdateOpening`;
export const AppActions = {
  updateOpeningKeyboard: (opening: boolean) => {
    return {
      type: APP_UPDATE_OPENING,
      value: opening,
    };
  },
}
