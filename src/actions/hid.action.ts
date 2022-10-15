import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
  ICustomKeycode,
  IEncoderKeymaps,
  IHid,
  IKeyboard,
  IKeymap,
  IKeymaps,
} from '../services/hid/Hid';
import { KeycodeList } from '../services/hid/KeycodeList';
import { KeyboardLabelLang } from '../services/labellang/KeyLabelLangs';
import { RootState, SetupPhase } from '../store/state';
import {
  AppActions,
  HeaderActions,
  KeycodeKeyActions,
  KeydiffActions,
  KeymapActions,
  LayoutOptionsActions,
  NotificationActions,
} from './actions';
import { StorageActions, storageActionsThunk } from './storage.action';
import { sendEventToGoogleAnalytics } from '../utils/GoogleAnalytics';
import { LayoutOption } from '../components/configure/keymap/Keymap';
import { maxValueByBitLength } from '../utils/NumberUtils';
import { KeyOp } from '../gen/types/KeyboardDefinition';
import { getEncoderIdList } from './utils';

const PRODUCT_PREFIX_FOR_BLE_MICRO_PRO = '(BMP)';

export const HID_ACTIONS = '@Hid';
export const HID_CONNECT_KEYBOARD = `${HID_ACTIONS}/ConnectDevice`;
export const HID_DISCONNECT_KEYBOARD = `${HID_ACTIONS}/DisconnectDevice`;
export const HID_UPDATE_KEYBOARD = `${HID_ACTIONS}/UpdateKeyboard`;
export const HID_UPDATE_KEYBOARD_LAYER_COUNT = `${HID_ACTIONS}/UpdateKeyboardLayerCount`;
export const HID_UPDATE_KEYBOARD_LIST = `${HID_ACTIONS}/UpdateKeyboardList`;
export const HID_UPDATE_KEYMAPS = `${HID_ACTIONS}/UpdateKeymaps`;
export const HID_UPDATE_BLE_MICRO_PRO = `${HID_ACTIONS}/UpdateBleMicroPro`;
export const HID_UPDATE_MACRO_BUFFER_BYTES = `${HID_ACTIONS}/UpdateMacroBufferBytes`;
export const HID_UPDATE_MACRO_MAX_BUFFER_SIZE = `${HID_ACTIONS}/UpdateMacroMaxBufferSize`;
export const HID_UPDATE_MACRO_MAX_COUNT = `${HID_ACTIONS}/UpdateMacroMaxCount`;
export const HID_UPDATE_VIA_PROTOCOL_VERSION = `${HID_ACTIONS}/UpdateViaProtocolVersion`;
export const HID_UPDATE_ENCODERS_KEYMAPS = `${HID_ACTIONS}/UpdateEncodersKeymaps`;
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

  updateMacroBufferBytes: (bytes: Uint8Array) => {
    return {
      type: HID_UPDATE_MACRO_BUFFER_BYTES,
      value: bytes,
    };
  },

  updateMacroMaxBufferSize: (size: number) => {
    return {
      type: HID_UPDATE_MACRO_MAX_BUFFER_SIZE,
      value: size,
    };
  },

  updateMacroMaxCount: (count: number) => {
    return {
      type: HID_UPDATE_MACRO_MAX_COUNT,
      value: count,
    };
  },

  updateViaProtocolVersion: (version: number) => {
    return {
      type: HID_UPDATE_VIA_PROTOCOL_VERSION,
      value: version,
    };
  },

  updateEncodersKeymaps: (keymaps: IEncoderKeymaps[]) => {
    return {
      type: HID_UPDATE_ENCODERS_KEYMAPS,
      value: keymaps,
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
  updateKeymaps:
    (labelLang: KeyboardLabelLang): ThunkPromiseAction<void> =>
    async (
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
          const newKm = KeycodeList.getKeymap(
            km.code,
            labelLang,
            entities.keyboardDefinition!.customKeycodes
          );
          kmap[pos] = newKm;
        });
        newKeymaps.push(kmap);
      }

      dispatch(HidActions.updateKeymaps(newKeymaps));
    },
  connectAnotherKeyboard:
    (): ThunkPromiseAction<void> =>
    async (
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

  connectKeyboard:
    (keyboard: IKeyboard): ThunkPromiseAction<void> =>
    async (
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

  openKeyboard:
    (): ThunkPromiseAction<void> =>
    async (
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
      sendEventToGoogleAnalytics('configure/open', {
        vendor_id: keyboard.getInformation().vendorId,
        product_id: keyboard.getInformation().productId,
        product_name: keyboard.getInformation().productName,
      });
      dispatch(
        HidActions.updateBleMicroPro(
          keyboard
            .getInformation()
            .productName.includes(PRODUCT_PREFIX_FOR_BLE_MICRO_PRO)
        )
      );
      const viaProtocolVersionResult = await keyboard.fetchViaProtocolVersion();
      if (!viaProtocolVersionResult.success) {
        dispatch(
          NotificationActions.addError(
            'Fetching the VIA protocol version failed.'
          )
        );
        return;
      }
      const viaProtocolVersion = viaProtocolVersionResult.viaProtocolVersion!;
      dispatch(HidActions.updateViaProtocolVersion(viaProtocolVersion));
      const layerResult = await keyboard.fetchLayerCount();
      if (!layerResult.success) {
        dispatch(
          NotificationActions.addError('Fetching the layer count failed.')
        );
        return;
      }
      const layerCount = layerResult.layerCount!;
      dispatch(HidActions.updateKeyboardLayerCount(layerCount));
      const keymaps: IKeymaps[] = await loadKeymap(
        dispatch,
        keyboard,
        layerCount,
        entities.keyboardDefinition!.matrix.rows,
        entities.keyboardDefinition!.matrix.cols,
        app.labelLang,
        entities.keyboardDefinition!.customKeycodes
      );
      dispatch(HidActions.updateKeymaps(keymaps));
      const encodersKeymaps: IEncoderKeymaps[] = await loadEncodersKeymap(
        dispatch,
        keyboard,
        layerCount,
        app.labelLang,
        entities.keyboardDefinition!.customKeycodes,
        entities.keyboardDefinition!.layouts.keymap,
        viaProtocolVersion
      );
      dispatch(HidActions.updateEncodersKeymaps(encodersKeymaps));

      const macroBufferSizeResult = await keyboard.getMacroBufferSize();
      if (!macroBufferSizeResult.success) {
        dispatch(
          NotificationActions.addError(
            'Fetching the max macro buffer size failed.'
          )
        );
        return;
      }
      const macroBufferSize = macroBufferSizeResult.bufferSize!;
      dispatch(HidActions.updateMacroMaxBufferSize(macroBufferSize));
      const macroMaxCountResult = await keyboard.getMacroCount();
      if (!macroMaxCountResult.success) {
        dispatch(
          NotificationActions.addError('Fetching the max macro count failed.')
        );
        return;
      }
      dispatch(HidActions.updateMacroMaxCount(macroMaxCountResult.count!));
      const macroBufferBytesResult = await keyboard.fetchMacroBuffer(
        macroBufferSize
      );
      if (!macroBufferBytesResult.success) {
        dispatch(
          NotificationActions.addError(
            'Fetching the macro buffer bytes failed.'
          )
        );
        return;
      }
      dispatch(
        HidActions.updateMacroBufferBytes(macroBufferBytesResult.buffer!)
      );

      dispatch(AppActions.remapsInit(layerCount));
      dispatch(KeymapActions.updateSelectedLayer(0)); // initial selected layer
      dispatch(await hidActionsThunk.restoreLayoutOptions());
      dispatch(HidActions.updateKeyboard(keyboard));
      dispatch(AppActions.updateSetupPhase(SetupPhase.openedKeyboard));
    },

  updateAuthorizedKeyboardList:
    (): ThunkPromiseAction<void> =>
    async (
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

  closeKeyboard:
    (keyboard: IKeyboard): ThunkPromiseAction<void> =>
    async (
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

  closeOpenedKeyboard:
    (): ThunkPromiseAction<void> =>
    async (
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
        dispatch(StorageActions.clearKeyboardDefinitionDocument());
        dispatch(StorageActions.updateSavedKeymaps([]));
        dispatch(HidActions.updateKeyboard(null));
      }
    },

  flash:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { app, entities } = getState();
      const keyboard: IKeyboard = entities.keyboard!;
      sendEventToGoogleAnalytics('configure/flash', {
        vendor_id: keyboard.getInformation().vendorId,
        product_id: keyboard.getInformation().productId,
        product_name: keyboard.getInformation().productName,
      });
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
                `Flash error: [${pos}] ${result.error!}`,
                result.cause
              )
            );
            dispatch(HeaderActions.updateFlashing(false));
            return;
          }
        }
      }
      if (entities.device.bleMicroPro) {
        const result = await keyboard.storeKeymapPersistentlyForBleMicroPro();
        if (!result.success) {
          console.error(result.cause);
          dispatch(NotificationActions.addError(result.error!, result.cause));
          dispatch(HeaderActions.updateFlashing(false));
          return;
        }
      }
      if (0x0a <= entities.device.viaProtocolVersion) {
        const encodersRemaps = app.encodersRemaps;
        for (let layer = 0; layer < encodersRemaps.length; layer++) {
          const encodersRemap = encodersRemaps[layer];
          for (const encoderIdString of Object.keys(encodersRemap)) {
            const encoderId = Number(encoderIdString);
            const encoderKeymap = encodersRemap[encoderId];
            let result = await keyboard.updateEncoderKeymap(
              layer,
              encoderId,
              true,
              encoderKeymap.clockwise.code
            );
            if (!result.success) {
              console.error(result.cause);
              dispatch(
                NotificationActions.addError(
                  `Flash error: [${encoderId}-clockwise] ${result.error!}`,
                  result.cause
                )
              );
              dispatch(HeaderActions.updateFlashing(false));
              return;
            }
            result = await keyboard.updateEncoderKeymap(
              layer,
              encoderId,
              false,
              encoderKeymap.counterclockwise.code
            );
            if (!result.success) {
              console.error(result.cause);
              dispatch(
                NotificationActions.addError(
                  `Flash error: [${encoderId}-counterclockwise] ${result.error!}`,
                  result.cause
                )
              );
              dispatch(HeaderActions.updateFlashing(false));
              return;
            }
          }
        }
      }
      const keymaps: IKeymaps[] = await loadKeymap(
        dispatch,
        keyboard,
        entities.device.layerCount,
        entities.keyboardDefinition!.matrix.rows,
        entities.keyboardDefinition!.matrix.cols,
        app.labelLang,
        entities.keyboardDefinition!.customKeycodes
      );
      dispatch(HidActions.updateKeymaps(keymaps));
      const encodersKeymaps: IEncoderKeymaps[] = await loadEncodersKeymap(
        dispatch,
        keyboard,
        entities.device.layerCount,
        app.labelLang,
        entities.keyboardDefinition!.customKeycodes,
        entities.keyboardDefinition!.layouts.keymap,
        entities.device.viaProtocolVersion
      );
      dispatch(HidActions.updateEncodersKeymaps(encodersKeymaps));

      dispatch(AppActions.remapsInit(entities.device.layerCount));
      dispatch(KeydiffActions.clearKeydiff());
      dispatch(KeycodeKeyActions.clear());
      dispatch(KeymapActions.clearSelectedPos());
      dispatch(HeaderActions.updateFlashing(false));
    },

  fetchSwitchMatrixState:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      // eslint-disable-next-line no-unused-vars
      const { app, entities } = getState();
      const keyboard: IKeyboard = entities.keyboard!;

      const result = await keyboard.fetchSwitchMatrixState();
      if (!result.success) {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error!, result.cause));
        return;
      }

      const rows = entities.keyboardDefinition!.matrix.rows;
      const cols = entities.keyboardDefinition!.matrix.cols;
      const state = result.state!;

      let i = 0;
      const pushed: Array<string> = [];
      for (let row = 0; row < rows; row++) {
        let rowState = 0;
        for (let colIdx = 0; colIdx < Math.ceil(cols / 8); colIdx++) {
          rowState = (rowState << 8) | state[i++];
        }

        for (let col = 0; col < cols; col++) {
          if ((rowState & (1 << col)) !== 0) {
            pushed.push(row + ',' + col);
          }
        }

        dispatch(AppActions.updateCurrentTestMatrix(pushed.slice()));
      }
    },

  refreshKeymaps:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { app, entities } = getState();
      const keyboard: IKeyboard = entities.keyboard!;
      const keymaps: IKeymaps[] = await loadKeymap(
        dispatch,
        keyboard,
        entities.device.layerCount,
        entities.keyboardDefinition!.matrix.rows,
        entities.keyboardDefinition!.matrix.cols,
        app.labelLang,
        entities.keyboardDefinition!.customKeycodes
      );
      dispatch(HidActions.updateKeymaps(keymaps));
      const encodersKeymaps: IEncoderKeymaps[] = await loadEncodersKeymap(
        dispatch,
        keyboard,
        entities.device.layerCount,
        app.labelLang,
        entities.keyboardDefinition!.customKeycodes,
        entities.keyboardDefinition!.layouts.keymap,
        entities.device.viaProtocolVersion
      );
      dispatch(HidActions.updateEncodersKeymaps(encodersKeymaps));
    },

  resetKeymap:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { app, entities } = getState();
      const keyboard: IKeyboard = entities.keyboard!;
      const result = await keyboard.resetDynamicKeymap();
      if (!result.success) {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error!, result.cause));
        return;
      }
      const keymaps: IKeymaps[] = await loadKeymap(
        dispatch,
        keyboard,
        entities.device.layerCount,
        entities.keyboardDefinition!.matrix.rows,
        entities.keyboardDefinition!.matrix.cols,
        app.labelLang,
        entities.keyboardDefinition!.customKeycodes
      );
      dispatch(HidActions.updateKeymaps(keymaps));
      const encodersKeymaps: IEncoderKeymaps[] = await loadEncodersKeymap(
        dispatch,
        keyboard,
        entities.device.layerCount,
        app.labelLang,
        entities.keyboardDefinition!.customKeycodes,
        entities.keyboardDefinition!.layouts.keymap,
        entities.device.viaProtocolVersion
      );
      dispatch(HidActions.updateEncodersKeymaps(encodersKeymaps));

      dispatch(AppActions.remapsInit(entities.device.layerCount));
      dispatch(KeydiffActions.clearKeydiff());
      dispatch(KeycodeKeyActions.clear());
      dispatch(KeymapActions.clearSelectedPos());
      dispatch(NotificationActions.addInfo('Resetting keymap succeeded.'));
    },

  restoreLayoutOptions:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { entities } = getState();
      const keyboard = entities.keyboard!;
      const layoutOptionsResult = await keyboard.fetchLayoutOptions();
      if (!layoutOptionsResult.success) {
        console.error(layoutOptionsResult);
        dispatch(
          NotificationActions.addError(
            `Fetching layout options failed: ${layoutOptionsResult.error}`
          )
        );
        return;
      }
      const layoutOptionValue = layoutOptionsResult.value!;
      const layoutLabels = entities.keyboardDefinition!.layouts.labels || [];
      const layoutValueBitLengths = createLayoutValueBitLengths(layoutLabels);
      const layoutOptions = createLayoutOptions(
        layoutOptionValue,
        layoutValueBitLengths
      );
      dispatch(LayoutOptionsActions.restoreLayoutOptions(layoutOptions));
    },

  updateLayoutOptions:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { entities, configure } = getState();
      const keyboard = entities.keyboard!;
      const layoutOptions = configure.layoutOptions.selectedOptions;
      const layoutChoices = layoutOptions
        .slice()
        .sort((a, b) => a.option - b.option)
        .map((layoutOption) => layoutOption.optionChoice);
      const layoutLabels = entities.keyboardDefinition!.layouts.labels || [];
      const layoutValueBitLengths = createLayoutValueBitLengths(layoutLabels);
      let layoutOptionValue = 0;
      let shifted = 0;
      for (let i = layoutValueBitLengths.length - 1; i >= 0; i--) {
        const layoutValueBitLength = layoutValueBitLengths[i];
        const value = layoutChoices[i] << shifted;
        layoutOptionValue = layoutOptionValue | value;
        shifted = shifted + layoutValueBitLength;
      }
      const result = await keyboard.updateLayoutOptions(layoutOptionValue);
      if (!result.success) {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error!));
      }
    },
};

const getAuthorizedKeyboard = async (hid: IHid): Promise<IKeyboard[]> => {
  const keyboards: IKeyboard[] = await hid.detectKeyboards();
  return keyboards;
};

const loadKeymap = async (
  dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
  keyboard: IKeyboard,
  layerCount: number,
  rowCount: number,
  columnCount: number,
  labelLang: KeyboardLabelLang,
  customKeycodes: ICustomKeycode[] | undefined
): Promise<IKeymaps[]> => {
  const keymaps: IKeymaps[] = [];
  for (let i = 0; i < layerCount; i++) {
    const keymapsResult = await keyboard.fetchKeymaps(
      i,
      rowCount,
      columnCount,
      labelLang,
      customKeycodes
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

const loadEncodersKeymap = async (
  dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
  keyboard: IKeyboard,
  layerCount: number,
  labelLang: KeyboardLabelLang,
  customKeycodes: ICustomKeycode[] | undefined,
  keymapDefinition: ((string | KeyOp)[] | { name: string })[],
  viaProtocolVersion: number
): Promise<IEncoderKeymaps[]> => {
  const keymaps: IEncoderKeymaps[] = [];
  const encoderIdList = getEncoderIdList(keymapDefinition);
  for (let i = 0; i < layerCount; i++) {
    if (0x0a <= viaProtocolVersion) {
      const encodersKeymapsResult = await keyboard.fetchEncodersKeymaps(
        i,
        encoderIdList,
        labelLang,
        customKeycodes
      );
      if (!encodersKeymapsResult.success) {
        dispatch(
          NotificationActions.addError(
            encodersKeymapsResult.error!,
            encodersKeymapsResult.cause!
          )
        );
        console.error(encodersKeymapsResult);
        console.error(`layer:${i}, encoderId:[${encoderIdList.join(' ')}]`);
        Promise.reject('something wrong in loading encoders keymaps');
      }
      keymaps.push(encodersKeymapsResult.keymap!);
    } else {
      keymaps.push({});
    }
  }
  return keymaps;
};

const createLayoutValueBitLengths = (
  layoutLabels: (string | string[])[]
): number[] => {
  const result: number[] = [];
  for (let i = 0; i < layoutLabels.length; i++) {
    const layoutLabel = layoutLabels[i];
    if (Array.isArray(layoutLabel)) {
      const layoutLabelCount = layoutLabel.length - 2;
      result.push(layoutLabelCount.toString(2).length);
    } else {
      result.push(1);
    }
  }
  return result;
};

const createLayoutOptions = (
  layoutOptionValue: number,
  bitLengths: number[]
): LayoutOption[] => {
  const result: LayoutOption[] = [];
  let targetValue = layoutOptionValue;
  for (let i = bitLengths.length - 1; i >= 0; i--) {
    const bitLength = bitLengths[i];
    const value = targetValue & maxValueByBitLength(bitLength);
    result.push({
      option: i,
      optionChoice: value,
    });
    targetValue = targetValue >> bitLength;
  }
  return result;
};
