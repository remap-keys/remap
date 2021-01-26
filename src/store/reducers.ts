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
  KEYMAP_UPDATE_SELECTED_LAYER,
  KEYMAP_ACTIONS,
  NOTIFICATION_ACTIONS,
  NOTIFICATION_ADD_ERROR,
  NOTIFICATION_ADD_WARN,
  HEADER_UPDATE_FLASHING,
  HEADER_ACTIONS,
  KEYCODEKEY_UPDATE_DRAGGING_KEY,
  KEYDIFF_ACTIONS,
  KEYDIFF_UPDATE_KEYDIFF,
  KEYDIFF_CLEAR_KEYDIFF,
  KEYMAP_UPDATE_SELECTED_POS,
  KEYMAP_CLEAR_SELECTED_POS,
  APP_ACTIONS,
  APP_REMAPS_SET_KEY,
  APP_REMAPS_INIT,
  APP_REMAPS_REMOVE_KEY,
  APP_PACKAGE_INIT,
  NOTIFICATION_REMOVE,
  NOTIFICATION_ADD_INFO,
  NOTIFICATION_ADD_SUCCESS,
  APP_UPDATE_SETUP_PHASE,
  APP_REMAPS_CLEAR,
  KEYCODEKEY_CLEAR,
  ANYKEYCODEKEY_ACTIONS,
  ANYKEYCODEKEY_ADD_ANYKEY,
  ANYKEYCODEKEY_UPDATE_ANYKEY,
  LAYOUT_OPTIONS_ACTIONS,
  LAYOUT_OPTIONS_UPDATE_SELECTED_OPTION,
  LAYOUT_OPTIONS_INIT_SELECTED_OPTION,
  APP_UPDATE_KEYBOARD_SIZE,
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
  STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENTS,
} from '../actions/storage.action';
import { AnyKey } from '../components/configure/keycodekey/KeycodeKey';
import {
  Key,
  KeycodeInfo,
} from '../components/configure/keycodekey/KeycodeKey.container';
import { IKeyboard, IKeycodeCategory } from '../services/hid/Hid';
import { INIT_STATE, RootState } from './state';
import {
  KEYBOARDS_APP_ACTIONS,
  KEYBOARDS_APP_UPDATE_PHASE,
  KEYBOARDS_CREATE_KEYBOARD_ACTIONS,
  KEYBOARDS_CREATE_KEYBOARD_CLEAR,
  KEYBOARDS_CREATE_KEYBOARD_UPDATE_JSON_FILENAME,
  KEYBOARDS_CREATE_KEYBOARD_UPDATE_JSON_STRING,
  KEYBOARDS_CREATE_KEYBOARD_UPDATE_KEYBOARD_DEFINITION,
  KEYBOARDS_CREATE_KEYBOARD_UPDATE_PRODUCT_NAME,
} from '../actions/keyboards.actions';

export type Action = { type: string; value: any };

const reducers = (state: RootState = INIT_STATE, action: Action) =>
  immer(state, (draft) => {
    if (action.type.startsWith(HID_ACTIONS)) {
      hidReducer(action, draft);
    } else if (action.type.startsWith(HEADER_ACTIONS)) {
      headerReducer(action, draft);
    } else if (action.type.startsWith(KEYCODES_ACTIONS)) {
      keycodesReducer(action, draft);
    } else if (action.type.startsWith(ANYKEYCODEKEY_ACTIONS)) {
      keycodeAddKeyReducer(action, draft);
    } else if (action.type.startsWith(KEYCODEKEY_ACTIONS)) {
      keycodekeyReducer(action, draft);
    } else if (action.type.startsWith(KEYDIFF_ACTIONS)) {
      keydiffReducer(action, draft);
    } else if (action.type.startsWith(KEYMAP_ACTIONS)) {
      keymapReducer(action, draft);
    } else if (action.type.startsWith(LAYOUT_OPTIONS_ACTIONS)) {
      layoutOptionsReducer(action, draft);
    } else if (action.type.startsWith(NOTIFICATION_ACTIONS)) {
      notificationReducer(action, draft);
    } else if (action.type.startsWith(APP_ACTIONS)) {
      appReducer(action, draft);
    } else if (action.type.startsWith(STORAGE_ACTIONS)) {
      storageReducer(action, draft);
    } else if (action.type.startsWith(KEYBOARDS_APP_ACTIONS)) {
      keyboardsAppReducer(action, draft);
    } else if (action.type.startsWith(KEYBOARDS_CREATE_KEYBOARD_ACTIONS)) {
      keyboardsCreateKeyboardReducer(action, draft);
    }
  });

const keyboardsCreateKeyboardReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case KEYBOARDS_CREATE_KEYBOARD_CLEAR:
      draft.keyboards.createKeyboard.keyboardDefinition = null;
      draft.keyboards.createKeyboard.productName = '';
      draft.keyboards.createKeyboard.jsonFilename = '';
      draft.keyboards.createKeyboard.jsonString = '';
      break;
    case KEYBOARDS_CREATE_KEYBOARD_UPDATE_JSON_FILENAME:
      draft.keyboards.createKeyboard.jsonFilename = action.value;
      break;
    case KEYBOARDS_CREATE_KEYBOARD_UPDATE_JSON_STRING:
      draft.keyboards.createKeyboard.jsonString = action.value;
      break;
    case KEYBOARDS_CREATE_KEYBOARD_UPDATE_KEYBOARD_DEFINITION:
      draft.keyboards.createKeyboard.keyboardDefinition = action.value;
      break;
    case KEYBOARDS_CREATE_KEYBOARD_UPDATE_PRODUCT_NAME:
      draft.keyboards.createKeyboard.productName = action.value;
      break;
  }
};

const keyboardsAppReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case KEYBOARDS_APP_UPDATE_PHASE: {
      draft.keyboards.app.phase = action.value;
      break;
    }
  }
};

const storageReducer = (action: Action, draft: WritableDraft<RootState>) => {
  switch (action.type) {
    case STORAGE_UPDATE_KEYBOARD_DEFINITION: {
      draft.entities.keyboardDefinition = action.value;
      break;
    }
    case STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENTS: {
      draft.entities.keyboardDefinitionDocuments = action.value;
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
    case APP_UPDATE_KEYBOARD_SIZE: {
      draft.app.keyboardHeight = action.value.height;
      draft.app.keyboardWidth = action.value.width;
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

const keymapReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYMAP_CLEAR_SELECTED_POS: {
      draft.configure.keymap.selectedPos = '';
      break;
    }
    case KEYMAP_UPDATE_SELECTED_LAYER: {
      draft.configure.keymap.selectedLayer = action.value;
      break;
    }
    case KEYMAP_UPDATE_SELECTED_POS: {
      draft.configure.keymap.selectedPos = action.value;
      break;
    }
  }
};

const keycodesReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYCODES_UPDATE_CATEGORY: {
      draft.configure.keycodes.category = action.value;
      break;
    }
    case KEYCODES_UPDATE_MACRO: {
      const code = action.value.code;
      draft.entities.device.macros[code] = action.value.text;
      break;
    }
    case KEYCODES_LOAD_KEYCODE_INFO_FOR_ALL_CATEGORIES: {
      draft.configure.keycodes.keys = action.value;
      break;
    }
  }
};

const keydiffReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYDIFF_UPDATE_KEYDIFF: {
      draft.configure.keydiff.origin = action.value.origin;
      draft.configure.keydiff.destination = action.value.destination;
      break;
    }
    case KEYDIFF_CLEAR_KEYDIFF: {
      draft.configure.keydiff.origin = null;
      draft.configure.keydiff.destination = null;
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
      draft.configure.keycodes.keys[IKeycodeCategory.ANY] = [
        ...draft.configure.keycodes.keys[IKeycodeCategory.ANY],
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
      console.log(draft.configure.keycodes.keys[IKeycodeCategory.ANY]);
      draft.configure.keycodes.keys[
        IKeycodeCategory.ANY
      ] = draft.configure.keycodes.keys[IKeycodeCategory.ANY].map((k, i) => {
        return i == index ? key : k;
      });
      console.log(draft.configure.keycodes.keys[IKeycodeCategory.ANY]);

      break;
    }
  }
};

const keycodekeyReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYCODEKEY_UPDATE_DRAGGING_KEY: {
      draft.configure.keycodeKey.draggingKey = action.value;
      break;
    }
    case KEYCODEKEY_UPDATE_SELECTED_KEY: {
      draft.configure.keycodeKey.selectedKey = action.value;
      break;
    }
    case KEYCODEKEY_UPDATE_HOVER_KEY: {
      draft.configure.keycodeKey.hoverKey = action.value;
      break;
    }
    case KEYCODEKEY_CLEAR: {
      draft.configure.keycodeKey.draggingKey = null;
      draft.configure.keycodeKey.selectedKey = null;
      draft.configure.keycodeKey.hoverKey = null;
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
      draft.configure.layoutOptions.selectedOptions = draft.configure.layoutOptions.selectedOptions.map(
        (value, index) => {
          return index == optionIndex ? option : value;
        }
      );
      break;
    }
    case LAYOUT_OPTIONS_INIT_SELECTED_OPTION: {
      draft.configure.layoutOptions.selectedOptions = action.value;
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
    case HEADER_UPDATE_FLASHING: {
      draft.configure.header.flashing = action.value;
      break;
    }
  }
};

export default reducers;
