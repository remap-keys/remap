import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { IHid, IKeyboard, IKeymaps } from '../services/hid/hid';
import { RootState } from '../store/state';
import { KeyboardsActions, NotificationActions } from './actions';

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
  | typeof NotificationActions[keyof typeof NotificationActions]
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
    const { hid, entities } = getState();
    const keyboards: IKeyboard[] = hid.keyboards;

    const result = await hid.instance.connect();
    if (!result.success) return; // no selected device

    const keyboard: IKeyboard = result.keyboard!;
    const device = keyboard.getDevice();

    // Opened keyboard MUST had been authorized
    if (keyboard.isOpened()) {
      /**
       * If the connected device has opened by this app, do nothing.
       * We should NOT do something except showing a message if another application has opened the device.
       */
      const listedKbd = keyboards.find((kbd) => kbd.getDevice() === device);
      if (listedKbd) return;

      const msg = 'This device has already opened by another application';
      console.log(msg);
      dispatch(NotificationActions.addWarn(msg));
      return;
    }

    /**
     * If the connected device has already included in state, use the keyboard object in state in order not to effect the keyboard list state.
     * Unless the connected device has included in state, use it and add to the keyboard list in state.
     */

    const listedKbd = keyboards.find((kbd) => kbd.getDevice() === device);
    const targetKbd = listedKbd ? listedKbd : keyboard;
    const resultOpen = await targetKbd.open();
    if (!resultOpen.success) {
      console.error('Could not open');
      dispatch(NotificationActions.addError('Could not open'));
      return;
    }
    if (hid.openedKeyboard) {
      await hid.openedKeyboard.close();
    }

    initOpenedKeyboard(
      dispatch,
      targetKbd,
      entities.device.rowCount,
      entities.device.columnCount
    );

    if (!listedKbd) {
      dispatch(hidActions.updateKeyboardList([...keyboards, keyboard]));
    }
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
    await initOpenedKeyboard(
      dispatch,
      keyboard,
      device.rowCount,
      device.columnCount
    );
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

const initOpenedKeyboard = async (
  dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
  keyboard: IKeyboard,
  rowCount: number,
  columnCount: number
) => {
  const layerResult = await keyboard.fetchLayerCount();
  if (!layerResult.success) {
    // TODO:show error message
    console.log(layerResult);
    return;
  }

  const keymaps: IKeymaps[] = [];
  for (let i = 0; i < layerResult.layerCount!; i++) {
    const keymapsResult = await keyboard.fetchKeymaps(i, rowCount, columnCount);
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
};
