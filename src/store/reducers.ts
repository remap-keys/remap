import immer from 'immer';
import { WritableDraft } from 'immer/dist/internal';
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
  KEYCODEKEY_UPDATE_DRAGGING_KEY,
  KEYDIFF_ACTIONS,
  KEYDIFF_UPDATE_KEYDIFF,
  KEYDIFF_CLEAR_KEYDIFF,
  KEYBOARDS_UPDATE_SELECTED_POS,
  KEYBOARDS_CLEAR_SELECTED_POS,
  APP_ACTIONS,
  APP_REMAPS_SET_KEY,
  APP_REMAPS_INIT,
  APP_REMAPS_REMOVE_KEY,
  APP_PACKAGE_INIT,
  NOTIFICATION_REMOVE,
  NOTIFICATION_ADD_INFO,
  NOTIFICATION_ADD_SUCCESS,
  APP_UPDATE_SETUP_PHASE,
  KEYBOARD_DEFINITION_FORM_UPDATE_DRAGGING,
  KEYBOARD_DEFINITION_FORM_ACTIONS,
  APP_REMAPS_CLEAR,
  KEYCODEKEY_CLEAR,
  ANYKEYCODEKEY_ACTIONS,
  ANYKEYCODEKEY_ADD_ANYKEY,
  ANYKEYCODEKEY_UPDATE_ANYKEY,
  LAYOUT_OPTIONS_ACTIONS,
  LAYOUT_OPTIONS_UPDATE_SELECTED_OPTION,
  LAYOUT_OPTIONS_INIT_SELECTED_OPTION,
} from '../actions/actions';
import {
  HID_ACTIONS,
  HID_CONNECT_KEYBOARD,
  HID_DISCONNECT_KEYBOARD,
  HID_UPDATE_KEYBOARD,
  HID_UPDATE_KEYBOARD_LAYER_COUNT,
  HID_UPDATE_KEYBOARD_LIST,
  HID_UPDATE_KEYMAPS,
} from '../actions/hid.action';
import {
  STORAGE_ACTIONS,
  STORAGE_UPDATE_KEYBOARD_DEFINITION,
} from '../actions/storage.action';
import { AnyKey } from '../components/configure/keycodekey/KeycodeKey';
import {
  Key,
  KeycodeInfo,
} from '../components/configure/keycodekey/KeycodeKey.container';
import { IKeyboard, IKeycodeCategory } from '../services/hid/Hid';
import { INIT_STATE, RootState } from './state';

export type Action = { type: string; value: any };

const reducers = (state: RootState = INIT_STATE, action: Action) =>
  immer(state, (draft) => {
    if (action.type.startsWith(HID_ACTIONS)) {
      hidReducer(action, draft);
    } else if (action.type.startsWith(HEADER_ACTIONS)) {
      headerReducer(action, draft);
    } else if (action.type.startsWith(KEYCODES_ACTIONS)) {
      keycodesReducer(action, draft);
    } else if (action.type.startsWith(KEYBOARDS_ACTIONS)) {
      keyboardsReducer(action, draft);
    } else if (action.type.startsWith(ANYKEYCODEKEY_ACTIONS)) {
      keycodeAddKeyReducer(action, draft);
    } else if (action.type.startsWith(KEYCODEKEY_ACTIONS)) {
      keycodekeyReducer(action, draft);
    } else if (action.type.startsWith(KEYDIFF_ACTIONS)) {
      keydiffReducer(action, draft);
    } else if (action.type.startsWith(LAYOUT_OPTIONS_ACTIONS)) {
      layoutOptionsReducer(action, draft);
    } else if (action.type.startsWith(NOTIFICATION_ACTIONS)) {
      notificationReducer(action, draft);
    } else if (action.type.startsWith(APP_ACTIONS)) {
      appReducer(action, draft);
    } else if (action.type.startsWith(STORAGE_ACTIONS)) {
      storageReducer(action, draft);
    } else if (action.type.startsWith(KEYBOARD_DEFINITION_FORM_ACTIONS)) {
      keyboardDefinitionFormReducer(action, draft);
    }
  });

const keyboardDefinitionFormReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case KEYBOARD_DEFINITION_FORM_UPDATE_DRAGGING:
      draft.keyboardDefinitionForm.dragging = action.value;
      break;
  }
};

const storageReducer = (action: Action, draft: WritableDraft<RootState>) => {
  switch (action.type) {
    case STORAGE_UPDATE_KEYBOARD_DEFINITION: {
      draft.entities.keyboardDefinition = action.value;
      break;
    }
  }
};

const appReducer = (action: Action, draft: WritableDraft<RootState>) => {
  switch (action.type) {
    case APP_UPDATE_SETUP_PHASE: {
      draft.app.setupPhase = action.value;
      break;
    }
    case APP_REMAPS_INIT: {
      draft.app.remaps = action.value;
      break;
    }
    case APP_REMAPS_SET_KEY: {
      const layer = action.value.layer;
      draft.app.remaps[layer][action.value.pos] = action.value.keymap;
      break;
    }
    case APP_REMAPS_REMOVE_KEY: {
      const layer = action.value.layer;
      const pos = action.value.pos;
      delete draft.app.remaps[layer][pos];
      break;
    }
    case APP_REMAPS_CLEAR: {
      draft.app.remaps = [];
      break;
    }
    case APP_PACKAGE_INIT: {
      draft.app.package.name = action.value.name;
      draft.app.package.version = action.value.version;
      break;
    }
  }
};

const hidReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case HID_CONNECT_KEYBOARD: {
      const keyboard: IKeyboard = action.value.keyboard;
      draft.entities.keyboards.push(keyboard);
      break;
    }
    case HID_DISCONNECT_KEYBOARD: {
      const keyboard: IKeyboard = action.value.keyboard;
      draft.entities.keyboards = draft.entities.keyboards.filter((item) => {
        return !item.isSameDevice(keyboard);
      });
      break;
    }
    case HID_UPDATE_KEYBOARD: {
      const keyboard: IKeyboard = action.value.keyboard;
      draft.entities.keyboard = keyboard;
      break;
    }
    case HID_UPDATE_KEYBOARD_LAYER_COUNT: {
      const layerCount = action.value.layerCount;
      draft.entities.device.layerCount = layerCount;
      break;
    }
    case HID_UPDATE_KEYBOARD_LIST: {
      const keyboards: IKeyboard[] = action.value.keyboards;
      draft.entities.keyboards = keyboards;
      break;
    }
    case HID_UPDATE_KEYMAPS: {
      draft.entities.device.keymaps = action.value.keymaps;
      break;
    }
  }
};

const keyboardsReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYBOARDS_CLEAR_SELECTED_POS: {
      draft.keyboards.selectedPos = '';
      break;
    }
    case KEYBOARDS_UPDATE_SELECTED_LAYER: {
      draft.keyboards.selectedLayer = action.value;
      break;
    }
    case KEYBOARDS_UPDATE_SELECTED_POS: {
      draft.keyboards.selectedPos = action.value;
      break;
    }
  }
};

const keycodesReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYCODES_UPDATE_CATEGORY: {
      draft.keycodes.category = action.value;
      break;
    }
    case KEYCODES_UPDATE_MACRO: {
      const code = action.value.code;
      draft.entities.device.macros[code] = action.value.text;
      break;
    }
    case KEYCODES_LOAD_KEYCODE_INFO_FOR_ALL_CATEGORIES: {
      draft.keycodes.keys = action.value;
      break;
    }
  }
};

const keydiffReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYDIFF_UPDATE_KEYDIFF: {
      draft.keydiff.origin = action.value.origin;
      draft.keydiff.destination = action.value.destination;
      break;
    }
    case KEYDIFF_CLEAR_KEYDIFF: {
      draft.keydiff.origin = null;
      draft.keydiff.destination = null;
      break;
    }
  }
};

const keycodeAddKeyReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  // TODO: type-safe
  switch (action.type) {
    case ANYKEYCODEKEY_ADD_ANYKEY: {
      const anyKey: AnyKey = action.value;
      const key: Key = {
        label: anyKey.label,
        meta: '',
        keymap: {
          isAny: true,
          code: anyKey.code,
          keycodeInfo: new KeycodeInfo(anyKey.label, anyKey.code),
        },
      };
      draft.keycodes.keys[IKeycodeCategory.ANY] = [
        ...draft.keycodes.keys[IKeycodeCategory.ANY],
        key,
      ];
      break;
    }
    case ANYKEYCODEKEY_UPDATE_ANYKEY: {
      const { index, anyKey } = action.value;
      const key: Key = {
        label: anyKey.label,
        meta: '',
        keymap: {
          isAny: true,
          code: anyKey.code,
          keycodeInfo: new KeycodeInfo(anyKey.label, anyKey.code),
        },
      };
      console.log(draft.keycodes.keys[IKeycodeCategory.ANY]);
      draft.keycodes.keys[IKeycodeCategory.ANY] = draft.keycodes.keys[
        IKeycodeCategory.ANY
      ].map((k, i) => {
        return i == index ? key : k;
      });
      console.log(draft.keycodes.keys[IKeycodeCategory.ANY]);

      break;
    }
  }
};

const keycodekeyReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYCODEKEY_UPDATE_DRAGGING_KEY: {
      draft.keycodeKey.draggingKey = action.value;
      break;
    }
    case KEYCODEKEY_UPDATE_SELECTED_KEY: {
      draft.keycodeKey.selectedKey = action.value;
      break;
    }
    case KEYCODEKEY_UPDATE_HOVER_KEY: {
      draft.keycodeKey.hoverKey = action.value;
      break;
    }
    case KEYCODEKEY_CLEAR: {
      draft.keycodeKey.draggingKey = null;
      draft.keycodeKey.selectedKey = null;
      draft.keycodeKey.hoverKey = null;
      break;
    }
  }
};

const layoutOptionsReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case LAYOUT_OPTIONS_UPDATE_SELECTED_OPTION: {
      const { optionIndex, option } = action.value;
      draft.layoutOptions.selectedOptions = draft.layoutOptions.selectedOptions.map(
        (value, index) => {
          return index == optionIndex ? option : value;
        }
      );
      break;
    }
    case LAYOUT_OPTIONS_INIT_SELECTED_OPTION: {
      draft.layoutOptions.selectedOptions = action.value;
      break;
    }
  }
};

const notificationReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  // TODO: type-safe
  switch (action.type) {
    case NOTIFICATION_ADD_ERROR: {
      draft.app.notifications = [
        ...draft.app.notifications,
        {
          key: Date.now().toString(),
          type: 'error',
          message: action.value.message,
        },
      ];
      break;
    }
    case NOTIFICATION_ADD_WARN: {
      draft.app.notifications = [
        ...draft.app.notifications,
        {
          key: Date.now().toString(),
          type: 'warning',
          message: action.value.message,
        },
      ];
      break;
    }
    case NOTIFICATION_ADD_INFO: {
      draft.app.notifications = [
        ...draft.app.notifications,
        {
          key: Date.now().toString(),
          type: 'info',
          message: action.value,
        },
      ];
      break;
    }
    case NOTIFICATION_ADD_SUCCESS: {
      draft.app.notifications = [
        ...draft.app.notifications,
        {
          key: Date.now().toString(),
          type: 'success',
          message: action.value,
        },
      ];
      break;
    }
    case NOTIFICATION_REMOVE: {
      const key = action.value;
      draft.app.notifications = draft.app.notifications.filter(
        (item) => item.key != key
      );
      break;
    }
  }
};

const headerReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case HEADER_UPDATE_FLUSH_LOADING: {
      draft.header.flushLoading = action.value;
      break;
    }
  }
};

export default reducers;
