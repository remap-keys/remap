import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
  IFetchLayerCountResult,
  IHid,
  IKeyboard,
  IKeymap,
  IKeymaps,
  IResult,
} from '../services/hid/hid';
import { RootState } from '../store/state';
import { KeyboardsActions } from './actions';

export const HID_ACTIONS = '@Hid';
export const HID_CONNECT_KEYBOARD = `${HID_ACTIONS}/ConnectDevice`;
export const HID_DISCONNECT_KEYBOARD = `${HID_ACTIONS}/DisconnectDevice`;
export const HID_OPEN_KEYBOARD = `${HID_ACTIONS}/OpenKeyboard`;
export const HID_UPDATE_KEYBOARD_LAYER_COUNT = `${HID_ACTIONS}/UpdateKeyboardLayerCount`;
export const HID_UPDATE_KEYBOARD_LIST = `${HID_ACTIONS}/UpdateKeyboardList`;
export const HID_UPDATE_KEYMAPS = `${HID_ACTIONS}/UpdateKeymaps`;
const hidActions = {
  connectKeyboard: (keyboard: IKeyboard) => {
    return {
      type: HID_CONNECT_KEYBOARD,
      value: { keyboard: keyboard },
    };
  },

  disconnectKeyboard: (keyboard: IKeyboard) => {
    return {
      type: HID_DISCONNECT_KEYBOARD,
      value: { keyboard: keyboard },
    };
  },

  openKeyboard: (keyboard: IKeyboard) => {
    return {
      type: HID_OPEN_KEYBOARD,
      value: { keyboard: keyboard },
    };
  },

  updateKeyboardLayerCount: (layerCount: number) => {
    return {
      type: HID_UPDATE_KEYBOARD_LAYER_COUNT,
      value: { layerCount: layerCount },
    };
  },

  updateKeyboardList: (keyboards: IKeyboard[]) => {
    return {
      type: HID_UPDATE_KEYBOARD_LIST,
      value: { keyboards: keyboards },
    };
  },
  updateKeymaps: (keymaps: IKeymaps[]) => {
    return {
      type: HID_UPDATE_KEYMAPS,
      value: { keymaps: keymaps },
    };
  },
};

type ActionTypes = ReturnType<
  | typeof hidActions[keyof typeof hidActions]
  | typeof KeyboardsActions[keyof typeof KeyboardsActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const hidActionsThunk = {
  connectAnotherKeyboard: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { hid } = getState();
    const result = await hid.instance.connect();
    console.log(result);
    if (!result.success) return;

    /**
     * Need to update the authorized device list because a user
     * can connect authorized device whose object is NOT equal
     * to the object this app has already had.
     */
    const keyboard: IKeyboard = result.keyboard!;
    dispatch(hidActions.connectKeyboard(result.keyboard!));
    console.log(keyboard);
    //TODO: close current connected keyboard if exist
    //TODO: open the connected keyboard
    //TODO: update state of connected keyboard
  },

  openKeyboard: (keyboard: IKeyboard): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    //TODO:show loading animation for setting up if needed
    // TODO: load config file
    const { device } = getState().entities;

    if (!keyboard.isOpened()) {
      const result = await keyboard.open();
      if (!result.success) {
        // TODO: show error message
        console.log(result);
        return;
      }
    }

    const layerResult = await keyboard.fetchLayerCount();
    if (!layerResult.success) {
      // TODO:show error message
      console.log(layerResult);
      return;
    }

    const rowCount = device.rowCount;
    const columnCount = device.columnCount;
    const keymaps: IKeymaps[] = [];
    for (let i = 0; i < layerResult.layerCount!; i++) {
      const keymapsResult = await keyboard.fetchKeymaps(
        i,
        rowCount,
        columnCount
      );
      if (!keymapsResult.success) {
        // TODO: show error message
        console.log(keymapsResult);
        return;
      }
      keymaps.push(keymapsResult.keymap!);
    }

    dispatch(hidActions.updateKeyboardLayerCount(layerResult.layerCount!));
    dispatch(hidActions.updateKeymaps(keymaps));
    dispatch(KeyboardsActions.updateSelectedLayer(0)); // initial selected layer
    dispatch(hidActions.openKeyboard(keyboard));
  },

  updateAuthorizedKeyboardList: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { hid } = getState();
    const keyboards: IKeyboard[] = await getAuthorizedKeyboard(hid.instance);
    dispatch(hidActions.updateKeyboardList(keyboards));
  },
};

const getAuthorizedKeyboard = async (hid: IHid): Promise<IKeyboard[]> => {
  const keyboards: IKeyboard[] = await hid.detectKeyboards();
  return keyboards;
};
