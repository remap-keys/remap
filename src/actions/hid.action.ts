import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { IHid, IKeyboard, IKeymap, IKeymaps } from '../services/hid/Hid';
import { KeycodeList } from '../services/hid/KeycodeList';
import { KeyboardLabelLang } from '../services/labellang/KeyLabelLangs';
import { RootState, SetupPhase } from '../store/state';
import {
  AppActions,
  HeaderActions,
  KeymapActions,
  KeycodeKeyActions,
  KeydiffActions,
  NotificationActions,
} from './actions';
import { StorageActions, storageActionsThunk } from './storage.action';

const PRODUCT_PREFIX_FOR_BLE_MICRO_PRO = '(BMP)';

export const HID_ACTIONS = '@Hid';
export const HID_CONNECT_KEYBOARD = `${HID_ACTIONS}/ConnectDevice`;
export const HID_DISCONNECT_KEYBOARD = `${HID_ACTIONS}/DisconnectDevice`;
export const HID_UPDATE_KEYBOARD = `${HID_ACTIONS}/UpdateKeyboard`;
export const HID_UPDATE_KEYBOARD_LAYER_COUNT = `${HID_ACTIONS}/UpdateKeyboardLayerCount`;
export const HID_UPDATE_KEYBOARD_LIST = `${HID_ACTIONS}/UpdateKeyboardList`;
export const HID_UPDATE_KEYMAPS = `${HID_ACTIONS}/UpdateKeymaps`;
export const HID_UPDATE_BLE_MICRO_PRO = `${HID_ACTIONS}/UpdateBleMicroPro`;
export const HidActions = {
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

  updateKeyboard: (keyboard: IKeyboard | null) => {
    return {
      type: HID_UPDATE_KEYBOARD,
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

  updateBleMicroPro: (bleMicroPro: boolean) => {
    return {
      type: HID_UPDATE_BLE_MICRO_PRO,
      value: bleMicroPro,
    };
  },
};

type ActionTypes = ReturnType<
  | typeof HidActions[keyof typeof HidActions]
  | typeof KeymapActions[keyof typeof KeymapActions]
  | typeof NotificationActions[keyof typeof NotificationActions]
  | typeof AppActions[keyof typeof AppActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const hidActionsThunk = {
  updateKeymaps: (
    labelLang: KeyboardLabelLang
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { entities } = getState();
    const layerCount = entities.device.layerCount;
    const keymaps: { [pos: string]: IKeymap }[] = entities.device.keymaps;
    let newKeymaps: { [pos: string]: IKeymap }[] = [];
    for (let i = 0; i < layerCount; i++) {
      const keymap = keymaps[i];
      let kmap: { [pos: string]: IKeymap } = {};
      Object.keys(keymap).forEach((pos) => {
        const km = keymap[pos];
        const newKm = KeycodeList.getKeymap(km.code, labelLang);
        kmap[pos] = newKm;
      });
      newKeymaps.push(kmap);
    }

    dispatch(HidActions.updateKeymaps(newKeymaps));
  },
  connectAnotherKeyboard: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { hid, entities } = getState();
    const keyboards: IKeyboard[] = entities.keyboards;

    const result = await hid.instance.connect();
    if (!result.success) {
      // cancel: do nothing
      return;
    }

    const keyboard: IKeyboard = result.keyboard!;

    if (0 < keyboards.length) {
      // If the connecting keyboard had already added Remap state, do nothing
      const listed = keyboards.find((kbd) => kbd.isSameDevice(keyboard));
      if (listed) {
        return;
      }
    }

    // Opened keyboard MUST had been authorized
    if (keyboard.isOpened()) {
      const msg = 'This device has already opened by another application';
      dispatch(NotificationActions.addWarn(msg));
      return;
    }

    /**
     * If the connected device has already included in state, use the keyboard object in state in order not to effect the keyboard list state.
     * Unless the connected device has included in state, use it and add to the keyboard list in state.
     */
    dispatch(AppActions.updateSetupPhase(SetupPhase.connectingKeyboard));
    await dispatch(hidActionsThunk.closeOpenedKeyboard());
    const listedKbd = keyboards.find((kbd) => kbd.isSameDevice(keyboard));
    const targetKbd = listedKbd ? listedKbd : keyboard;
    if (!listedKbd) {
      dispatch(HidActions.updateKeyboardList([...keyboards, keyboard]));
    }

    console.log(targetKbd);
    dispatch(HidActions.updateKeyboard(targetKbd));
    const keyboardInfo = keyboard.getInformation();
    dispatch(
      AppActions.updateSetupPhase(SetupPhase.fetchingKeyboardDefinition)
    );
    await dispatch(
      storageActionsThunk.fetchKeyboardDefinitionByDeviceInfo(
        keyboardInfo.vendorId,
        keyboardInfo.productId,
        keyboardInfo.productName
      )
    );
  },

  connectKeyboard: (keyboard: IKeyboard): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { entities } = getState();
    const keyboards: IKeyboard[] = entities.keyboards;

    if (keyboard.isOpened()) {
      /**
       * If this keyboard is opening by this app, do nothing.
       * If this keyboard is NOT opened by this app, show warning message.
       */
      if (entities.keyboard?.isSameDevice(keyboard)) {
        return; // do nothing
      }

      const msg = 'This device has already opened by another application';
      dispatch(NotificationActions.addWarn(msg));
      return;
    }
    dispatch(AppActions.updateSetupPhase(SetupPhase.connectingKeyboard));
    await dispatch(hidActionsThunk.closeOpenedKeyboard());

    const listedKbd = keyboards.find((kbd) => kbd.isSameDevice(keyboard));
    const targetKbd = listedKbd ? listedKbd : keyboard;
    if (!listedKbd) {
      dispatch(HidActions.updateKeyboardList([...keyboards, keyboard]));
    }

    dispatch(HidActions.updateKeyboard(targetKbd));
    const keyboardInfo = keyboard.getInformation();
    dispatch(
      AppActions.updateSetupPhase(SetupPhase.fetchingKeyboardDefinition)
    );
    await dispatch(
      storageActionsThunk.fetchKeyboardDefinitionByDeviceInfo(
        keyboardInfo.vendorId,
        keyboardInfo.productId,
        keyboardInfo.productName
      )
    );
  },

  openKeyboard: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { app, entities } = getState();
    const keyboard = entities.keyboard!;
    const result = await keyboard.open();
    if (!result.success) {
      console.error('Could not open');
      dispatch(NotificationActions.addError('Could not open', result.cause));
      return;
    }
    await initOpenedKeyboard(
      dispatch,
      keyboard,
      entities.keyboardDefinition!.matrix.rows,
      entities.keyboardDefinition!.matrix.cols,
      app.labelLang
    );
    dispatch(AppActions.updateSetupPhase(SetupPhase.openedKeyboard));
  },

  updateAuthorizedKeyboardList: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { hid } = getState();
    const keyboards: IKeyboard[] = await getAuthorizedKeyboard(hid.instance);
    dispatch(HidActions.updateKeyboardList(keyboards));
    if (keyboards.length === 1) {
      const keyboard = keyboards[0];
      dispatch(HidActions.updateKeyboard(keyboard));
      const keyboardInfo = keyboard.getInformation();
      dispatch(
        AppActions.updateSetupPhase(SetupPhase.fetchingKeyboardDefinition)
      );
      await dispatch(
        storageActionsThunk.fetchKeyboardDefinitionByDeviceInfo(
          keyboardInfo.vendorId,
          keyboardInfo.productId,
          keyboardInfo.productName
        )
      );
    } else {
      dispatch(AppActions.updateSetupPhase(SetupPhase.keyboardNotSelected));
    }
  },

  closeKeyboard: (keyboard: IKeyboard): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    // eslint-disable-next-line no-unused-vars
    getState: () => RootState
  ) => {
    await keyboard.close();
    dispatch(AppActions.updateSetupPhase(SetupPhase.keyboardNotSelected));
    dispatch(AppActions.remapsClear());
    dispatch(KeydiffActions.clearKeydiff());
    dispatch(KeycodeKeyActions.clear());
    dispatch(KeymapActions.clearSelectedPos());
    dispatch(StorageActions.updateKeyboardDefinition(null));
    dispatch(HidActions.updateKeyboard(null));
  },

  closeOpenedKeyboard: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    // eslint-disable-next-line no-unused-vars
    getState: () => RootState
  ) => {
    const { entities } = getState();
    const openedKeyboard = entities.keyboard;
    if (openedKeyboard && openedKeyboard.isOpened()) {
      await openedKeyboard.close();
      dispatch(AppActions.remapsClear());
      dispatch(KeydiffActions.clearKeydiff());
      dispatch(KeycodeKeyActions.clear());
      dispatch(KeymapActions.clearSelectedPos());
      dispatch(StorageActions.updateKeyboardDefinition(null));
      dispatch(HidActions.updateKeyboard(null));
    }
  },

  flash: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { app, entities } = getState();
    const keyboard: IKeyboard = entities.keyboard!;
    const remaps = app.remaps;
    for (let layer = 0; layer < remaps.length; layer++) {
      const remap = remaps[layer];
      for (const pos of Object.keys(remap)) {
        const key = remap[pos];
        const row = Number(pos.substring(0, pos.indexOf(',')));
        const col = Number(pos.substring(pos.indexOf(',') + 1));
        const code = key.code;
        const result = await keyboard.updateKeymap(layer, row, col, code);
        if (!result.success) {
          console.error(result.cause);
          dispatch(
            NotificationActions.addError(
              `Flush error: [${pos}] ${result.error!}`,
              result.cause
            )
          );
          dispatch(HeaderActions.updateFlashing(false));
          return;
        }
      }
    }
    const keymaps: IKeymaps[] = await loadKeymap(
      dispatch,
      keyboard,
      entities.device.layerCount,
      entities.keyboardDefinition!.matrix.rows,
      entities.keyboardDefinition!.matrix.cols,
      app.labelLang
    );
    dispatch(HidActions.updateKeymaps(keymaps));
    dispatch(AppActions.remapsInit(entities.device.layerCount));
    dispatch(KeydiffActions.clearKeydiff());
    dispatch(KeycodeKeyActions.clear());
    dispatch(KeymapActions.clearSelectedPos());
    dispatch(HeaderActions.updateFlashing(false));
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
  columnCount: number,
  labelLang: KeyboardLabelLang
) => {
  dispatch(
    HidActions.updateBleMicroPro(
      keyboard
        .getInformation()
        .productName.includes(PRODUCT_PREFIX_FOR_BLE_MICRO_PRO)
    )
  );
  const layerResult = await keyboard.fetchLayerCount();
  if (!layerResult.success) {
    // TODO:show error message
    console.log(layerResult);
    return;
  }
  const layerCount = layerResult.layerCount!;
  dispatch(HidActions.updateKeyboardLayerCount(layerCount));
  const keymaps: IKeymaps[] = await loadKeymap(
    dispatch,
    keyboard,
    layerCount,
    rowCount,
    columnCount,
    labelLang
  );
  dispatch(HidActions.updateKeymaps(keymaps));
  dispatch(AppActions.remapsInit(layerCount));
  dispatch(KeymapActions.updateSelectedLayer(0)); // initial selected layer
  dispatch(HidActions.updateKeyboard(keyboard));
};

const loadKeymap = async (
  dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
  keyboard: IKeyboard,
  layerCount: number,
  rowCount: number,
  columnCount: number,
  labelLang: KeyboardLabelLang
): Promise<IKeymaps[]> => {
  const keymaps: IKeymaps[] = [];
  for (let i = 0; i < layerCount; i++) {
    const keymapsResult = await keyboard.fetchKeymaps(
      i,
      rowCount,
      columnCount,
      labelLang
    );
    if (!keymapsResult.success) {
      // TODO: show error message
      dispatch(
        NotificationActions.addError(keymapsResult.error!, keymapsResult.cause!)
      );
      console.log(keymapsResult);
      console.log(
        `layer:${i}, rowCount:${rowCount}, colCount: ${columnCount}, layerCount: ${layerCount}`
      );
      Promise.reject('something wrong in loading kerymaps');
    }
    keymaps.push(keymapsResult.keymap!);
  }
  return keymaps;
};
