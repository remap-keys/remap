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
