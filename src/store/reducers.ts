import immer from 'immer';
import {
  KEYCODEKEY_ACTIONS,
  KEYCODEKEY_UPDATE_HOVER_KEY,
  KEYCODEKEY_UPDATE_SELECTED_KEY,
} from '../components/configure/keycodekey/KeycodeKey.container';
import {
  KEYCODES_ACTIONS,
  KEYCODES_UPDATE_CATEGORY_INDEX,
  KEYCODES_UPDATE_MACRO,
  MacroKeycodeType,
} from '../components/configure/keycodes/Keycodes.container';
import { INIT_STATE, StateType } from './state';

export type Action = { type: string; value: any };

const reducers = (state: StateType = INIT_STATE, action: Action) =>
  immer(state, (draft) => {
    if (action.type.startsWith(KEYCODES_ACTIONS)) {
      keycodesReducer(action, draft);
    } else if (action.type.startsWith(KEYCODEKEY_ACTIONS)) {
      keycodekeyReducer(action, draft);
    }
  });

const keycodesReducer = (action: Action, draft: StateType) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYCODES_UPDATE_CATEGORY_INDEX: {
      draft.keycodes.categoryIndex = action.value;
      break;
    }
    case KEYCODES_UPDATE_MACRO: {
      const code = action.value.code as MacroKeycodeType;
      draft.entities.macros[code] = action.value.text;
      break;
    }
  }
};

const keycodekeyReducer = (action: Action, draft: StateType) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYCODEKEY_UPDATE_SELECTED_KEY: {
      draft.keycodekey.selectedKey = action.value;
      break;
    }
    case KEYCODEKEY_UPDATE_HOVER_KEY: {
      draft.keycodekey.hoverKey = action.value;
      break;
    }
  }
};
export default reducers;
