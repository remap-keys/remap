import {
  ICatalogPhase,
  IConditionNotSelected,
  IKeyboardFeatures,
} from '../store/state';
import { IKeymap } from '../services/hid/Hid';

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
};

export const CATALOG_KEYBOARD_ACTIONS = `@CatalogKeyboard`;
export const CATALOG_KEYBOARD_UPDATE_KEYMAPS = `${CATALOG_KEYBOARD_ACTIONS}/UpdateKeymaps`;
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
};
