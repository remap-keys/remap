import {
  Key,
  MacroKeycodeType,
} from '../components/configure/keycodes/Keycodes.container';

export type Device = {
  productName: string;
  vendorId: number;
  productId: number;
};

export const KEYCODES_ACTIONS = '@Keycodes';
export const KEYCODES_UPDATE_CATEGORY_INDEX = `${KEYCODES_ACTIONS}/UpdateCategoryIndex`;
export const KEYCODES_UPDATE_MACRO = `${KEYCODES_ACTIONS}/UpdateMacro`;
export const KeycodesActions = {
  updateCategoryIndex: (value: number) => {
    return {
      type: KEYCODES_UPDATE_CATEGORY_INDEX,
      value: value,
    };
  },

  updateMacro: (code: MacroKeycodeType, text: string) => {
    return {
      type: KEYCODES_UPDATE_MACRO,
      value: { code: code, text: text },
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
