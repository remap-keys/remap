import immer from 'immer';
import {
  KEYCODEKEY_ACTIONS,
  KEYCODEKEY_UPDATE_HOVER_KEY,
  KEYCODEKEY_UPDATE_SELECTED_KEY,
  KEYCODES_ACTIONS,
  KEYCODES_UPDATE_CATEGORY,
  KEYCODES_UPDATE_MACRO,
  KEYCODES_LOAD_KEYCODE_INFO_FOR_ALL_CATEGORIES,
  KEYBOARDS_UPDATE_SELECTED_LAYER,
  KEYBOARDS_ACTIONS,
  NOTIFICATION_ACTIONS,
  NOTIFICATION_ADD_ERROR,
  NOTIFICATION_ADD_WARN,
  HEADER_UPDATE_FLUSH_LOADING,
  HEADER_ACTIONS,
} from '../actions/actions';
import {
  HID_ACTIONS,
  HID_CONNECT_KEYBOARD,
  HID_DISCONNECT_KEYBOARD,
  HID_OPEN_KEYBOARD,
  HID_UPDATE_KEYBOARD_LAYER_COUNT,
  HID_UPDATE_KEYBOARD_LIST,
  HID_UPDATE_KEYMAPS,
  HID_UPDATE_OPENING,
} from '../actions/hid.action';
import { Key } from '../components/configure/keycodes/Keycodes.container';
import { IKeyboard, IKeycodeCategory } from '../services/hid/hid';

import { INIT_STATE, RootState } from './state';

export type Action = { type: string; value: any };

const reducers = (state: RootState = INIT_STATE, action: Action) =>
  immer(state, (draft) => {
    if (action.type.startsWith(KEYCODES_ACTIONS)) {
      keycodesReducer(action, draft);
    } else if (action.type.startsWith(KEYBOARDS_ACTIONS)) {
      keyboardsReducer(action, draft);
    } else if (action.type.startsWith(KEYCODEKEY_ACTIONS)) {
      keycodekeyReducer(action, draft);
    } else if (action.type.startsWith(HID_ACTIONS)) {
      hidReducer(action, draft);
    } else if (action.type.startsWith(NOTIFICATION_ACTIONS)) {
      notificationReducer(action, draft);
    } else if (action.type.startsWith(HEADER_ACTIONS)) {
      headerReducer(action, draft);
    }
  });

const hidReducer = (action: Action, draft: RootState) => {
  // TODO: type-safe
  switch (action.type) {
    case HID_CONNECT_KEYBOARD: {
      const keyboard: IKeyboard = action.value.keyboard;
      draft.hid.keyboards.push(keyboard);
      break;
    }
    case HID_DISCONNECT_KEYBOARD: {
      const keyboard: IKeyboard = action.value.keyboard;
      draft.hid.keyboards.filter((item) => {
        return item != keyboard;
      });
      if (draft.hid.openedKeyboard == keyboard) {
        draft.hid.openedKeyboard = null;
      }
      break;
    }
    case HID_OPEN_KEYBOARD: {
      const keyboard: IKeyboard = action.value.keyboard;
      draft.hid.openedKeyboard = keyboard;
      break;
    }
    case HID_UPDATE_KEYBOARD_LAYER_COUNT: {
      const layerCount = action.value.layerCount;
      draft.entities.device.layerCount = layerCount;
      break;
    }
    case HID_UPDATE_KEYBOARD_LIST: {
      const keyboards: IKeyboard[] = action.value.keyboards;
      draft.hid.keyboards = keyboards;
      break;
    }
    case HID_UPDATE_KEYMAPS: {
      draft.entities.device.keymaps = action.value.keymaps;
      break;
    }
    case HID_UPDATE_OPENING: {
      draft.hid.openingKeyboard = action.value;
      break;
    }
  }
};

const keyboardsReducer = (action: Action, draft: RootState) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYBOARDS_UPDATE_SELECTED_LAYER: {
      draft.keyboards.selectedLayer = action.value;
      break;
    }
  }
};

const keycodesReducer = (action: Action, draft: RootState) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYCODES_UPDATE_CATEGORY: {
      draft.keycodes.category = action.value;
      break;
    }
    case KEYCODES_UPDATE_MACRO: {
      const code = action.value.code;
      draft.entities.macros[code] = action.value.text;
      break;
    }
    case KEYCODES_LOAD_KEYCODE_INFO_FOR_ALL_CATEGORIES: {
      const setKeycodeInfoByCategory = (category: string) => {
        draft.keycodes.keys[
          category
        ] = draft.hid.instance
          .getKeycodeCandidatesByCategory(category)
          .map<Key>((keycodeInfo) => ({
            code: keycodeInfo.code,
            label: keycodeInfo.label,
            meta: '',
            keycodeInfo,
          }));
      };
      setKeycodeInfoByCategory(IKeycodeCategory.BASIC);
      setKeycodeInfoByCategory(IKeycodeCategory.LAYERS);
      setKeycodeInfoByCategory(IKeycodeCategory.LIGHTING);
      setKeycodeInfoByCategory(IKeycodeCategory.MEDIA);
      setKeycodeInfoByCategory(IKeycodeCategory.NUMBER);
      setKeycodeInfoByCategory(IKeycodeCategory.SPECIAL);
      setKeycodeInfoByCategory(IKeycodeCategory.MACRO);
      break;
    }
  }
};

const keycodekeyReducer = (action: Action, draft: RootState) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYCODEKEY_UPDATE_SELECTED_KEY: {
      draft.keycodeKey.selectedKey = action.value;
      break;
    }
    case KEYCODEKEY_UPDATE_HOVER_KEY: {
      draft.keycodeKey.hoverKey = action.value;
      break;
    }
  }
};

const notificationReducer = (action: Action, draft: RootState) => {
  // TODO: type-safe
  switch (action.type) {
    case NOTIFICATION_ADD_ERROR: {
      // TODO: do something
      break;
    }
    case NOTIFICATION_ADD_WARN: {
      // TODO: do something
      break;
    }
  }
};

const headerReducer = (action: Action, draft: RootState) => {
  // TODO: type-safe
  switch (action.type) {
    case HEADER_UPDATE_FLUSH_LOADING: {
      draft.header.flushLoading = action.value;
      break;
    }
  }
};

export default reducers;
