import immer from 'immer';
import {
  Device,
  KEYCODEKEY_ACTIONS,
  KEYCODEKEY_UPDATE_HOVER_KEY,
  KEYCODEKEY_UPDATE_SELECTED_KEY,
  KEYCODES_ACTIONS,
  KEYCODES_UPDATE_CATEGORY_INDEX,
  KEYCODES_UPDATE_MACRO,
} from '../actions/actions';
import {
  HID_ACTIONS,
  HID_OPEN_DEVICE,
  HID_UPDATE_DEVICE_LIST,
} from '../actions/hid.action';
import { MacroKeycodeType } from '../components/configure/keycodes/Keycodes.container';

import { INIT_STATE, RootState } from './state';

export type Action = { type: string; value: any };

const reducers = (state: RootState = INIT_STATE, action: Action) =>
  immer(state, (draft) => {
    if (action.type.startsWith(KEYCODES_ACTIONS)) {
      keycodesReducer(action, draft);
    } else if (action.type.startsWith(KEYCODEKEY_ACTIONS)) {
      keycodekeyReducer(action, draft);
    } else if (action.type.startsWith(HID_ACTIONS)) {
      hidReducer(action, draft);
    }
  });

const hidReducer = (action: Action, draft: RootState) => {
  // TODO: type-safe
  switch (action.type) {
    case HID_OPEN_DEVICE: {
      draft.hid.openedDeviceId = action.value.id;
      break;
    }
    case HID_UPDATE_DEVICE_LIST: {
      // TODO: id SHOULD be keyboard id like uuid, NOT index.
      const devices: Device[] = action.value.devices;
      draft.hid.devices = devices.reduce((obj, device, index) => {
        return { ...obj, [index]: device };
      }, {});
      break;
    }
  }
};

const keycodesReducer = (action: Action, draft: RootState) => {
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
export default reducers;
