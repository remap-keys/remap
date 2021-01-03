import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
  IFetchLayerCountResult,
  IHid,
  IKeyboard,
  IResult,
} from '../services/hid/hid';
import { RootState } from '../store/state';

export const HID_ACTIONS = '@Hid';
export const HID_CONNECT_KEYBOARD = `${HID_ACTIONS}/ConnectDevice`;
export const HID_DISCONNECT_KEYBOARD = `${HID_ACTIONS}/DisconnectDevice`;
export const HID_OPEN_KEYBOARD = `${HID_ACTIONS}/OpenKeyboard`;
export const HID_UPDATE_KEYBOARD_LAYER_COUNT = `${HID_ACTIONS}/UpdateKeyboardLayerCount`;
export const HID_UPDATE_KEYBOARD_LIST = `${HID_ACTIONS}/UpdateKeyboardList`;
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
};

type ActionTypes = ReturnType<typeof hidActions[keyof typeof hidActions]>;
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
    if (result.success) {
      // TODO: 認可済みキーボードもconnectできてしまうので、ここでconnectアクションするとkeyboardsリストに同一のIKeyboardオブジェクトが追加されてしまう
      dispatch(hidActions.connectKeyboard(result.keyboard!));
    }
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
    const rowCount = 8;
    const columnCount = 6;

    const result = await keyboard.open();
    if (!result.success) {
      // TODO: show error message
      console.log(result);
      return;
    }

    const layerResult = await keyboard.fetchLayerCount();
    if (!layerResult.success) {
      // TODO:show error message
      console.log(layerResult);
      return;
    }

    /*
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
      keymapsResult.keymap!;
    }
    */

    dispatch(hidActions.openKeyboard(keyboard));
    dispatch(hidActions.updateKeyboardLayerCount(layerResult.layerCount!));
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
