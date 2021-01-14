import { AnyKey } from '../components/configure/keycodekey/KeycodeKey';
import { Key } from '../components/configure/keycodekey/KeycodeKey.container';
import KeyModel from '../models/KeyModel';
import { IHid, IKeycodeCategory, IKeymap } from '../services/hid/Hid';
import { ISetupPhase } from '../store/state';

export const KEYBOARDS_ACTIONS = '@Keyboards';
export const KEYBOARDS_CLEAR_SELECTED_POS = `${KEYBOARDS_ACTIONS}/ClearSelectedLayer`;
export const KEYBOARDS_UPDATE_SELECTED_LAYER = `${KEYBOARDS_ACTIONS}/UpdateSelectedLayer`;
export const KEYBOARDS_UPDATE_SELECTED_POS = `${KEYBOARDS_ACTIONS}/UpdateSelectedPos`;
export const KeyboardsActions = {
  clearSelectedPos: () => {
    return {
      type: KEYBOARDS_UPDATE_SELECTED_POS,
    };
  },
  updateSelectedLayer: (layer: number) => {
    return {
      type: KEYBOARDS_UPDATE_SELECTED_LAYER,
      value: layer,
    };
  },
  updateSelectedPos: (pos: string) => {
    return {
      type: KEYBOARDS_UPDATE_SELECTED_POS,
      value: pos,
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
  loadKeycodeInfoForAllCategories: (hid: IHid) => {
    const getKeysByCategory = (category: string): Key[] => {
      return hid.getKeymapCandidatesByCategory(category).map<Key>((keymap) => ({
        code: keymap.code,
        label: keymap.keycodeInfo!.label,
        meta: '',
        keymap,
      }));
    };

    let keys: { [category: string]: Key[] } = {};
    [
      IKeycodeCategory.BASIC,
      IKeycodeCategory.LAYERS,
      IKeycodeCategory.LIGHTING,
      IKeycodeCategory.MEDIA,
      IKeycodeCategory.NUMBER,
      IKeycodeCategory.SPECIAL,
      IKeycodeCategory.MACRO,
    ].forEach((category) => {
      keys[category] = getKeysByCategory(category);
    });
    keys[IKeycodeCategory.ANY] = [];

    return {
      type: KEYCODES_LOAD_KEYCODE_INFO_FOR_ALL_CATEGORIES,
      value: keys,
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
export const HEADER_UPDATE_FLUSH_LOADING = `${HEADER_ACTIONS}/UpdateFlushLoading`;
export const HeaderActions = {
  updateFlush: (loading: boolean) => {
    return {
      type: HEADER_UPDATE_FLUSH_LOADING,
      value: loading,
    };
  },
};

export const KEYBOARD_DEFINITION_FORM_ACTIONS = '@KeyboardDefinitionForm';
export const KEYBOARD_DEFINITION_FORM_UPDATE_DRAGGING = `${KEYBOARD_DEFINITION_FORM_ACTIONS}/UpdateDragging`;
export const KeyboardDefinitionFormActions = {
  updateDragging: (dragging: boolean) => {
    return {
      type: KEYBOARD_DEFINITION_FORM_UPDATE_DRAGGING,
      value: dragging,
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
};
