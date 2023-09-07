import { Key } from '../components/configure/keycodekey/KeyGen';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store/state';
import {
  IMacro,
  IMacroBuffer,
  MacroBuffer,
  MacroKey,
} from '../services/macro/Macro';
import { NotificationActions } from './actions';
import { HidActions } from './hid.action';
import { sendEventToGoogleAnalytics } from '../utils/GoogleAnalytics';
import { QK_MACRO_MIN } from '../services/hid/compositions/MacroComposition';

export const MACRO_EDITOR_ACTIONS = '@MacroEditor';
export const MACRO_EDITOR_UPDATE_KEY = `${MACRO_EDITOR_ACTIONS}/UpdateMacroKey`;
export const MACRO_EDITOR_CLEAR_KEY = `${MACRO_EDITOR_ACTIONS}/ClearMacroKey`;
export const MACRO_EDITOR_UPDATE_MACRO_BUFFER = `${MACRO_EDITOR_ACTIONS}/UpdateMacroBuffer`;
export const MACRO_EDITOR_UPDATE_MACRO = `${MACRO_EDITOR_ACTIONS}/UpdateMacro`;
export const MACRO_EDITOR_UPDATE_MACRO_KEYS = `${MACRO_EDITOR_ACTIONS}/UpdateMacroKeys`;

export const MacroEditorActions = {
  updateMacroKey: (key: Key) => {
    return {
      type: MACRO_EDITOR_UPDATE_KEY,
      value: key,
    };
  },
  clearMacroKey: () => {
    return {
      type: MACRO_EDITOR_CLEAR_KEY,
    };
  },
  updateMacroBuffer: (macroBuffer: IMacroBuffer) => {
    return {
      type: MACRO_EDITOR_UPDATE_MACRO_BUFFER,
      value: macroBuffer,
    };
  },
  updateMacro: (macro: IMacro) => {
    return {
      type: MACRO_EDITOR_UPDATE_MACRO,
      value: macro,
    };
  },
  updateMacroKeys: (macroKeys: MacroKey[]) => {
    return {
      type: MACRO_EDITOR_UPDATE_MACRO_KEYS,
      value: macroKeys,
    };
  },
};

const M0_KEY_CODE = QK_MACRO_MIN;

type ActionTypes = ReturnType<
  | typeof MacroEditorActions[keyof typeof MacroEditorActions]
  | typeof NotificationActions[keyof typeof NotificationActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const MacroActionsThunk = {
  updateMacroKey:
    (key: Key): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { entities, app } = getState();
      const macroBufferBytes = entities.device.macro.bufferBytes;
      const macroMaxBufferSize = entities.device.macro.maxBufferSize;
      const macroMaxCount = entities.device.macro.maxCount;
      const labelLang = app.labelLang;
      const macroBuffer: IMacroBuffer = new MacroBuffer(
        macroBufferBytes,
        macroMaxCount,
        macroMaxBufferSize
      ); // state
      const macros = macroBuffer.generateMacros();

      // FIXME Should define the macro index in the Key object?
      const macroIndex = key.keymap.code - M0_KEY_CODE;

      const macro = macros[macroIndex]; // state
      const macroKeysResult = macro.generateMacroKeys(labelLang);
      if (!macroKeysResult.success) {
        console.error(macroKeysResult.error!);
        dispatch(NotificationActions.addError(macroKeysResult.error!));
        return;
      }
      const macroKeys = macroKeysResult.macroKeys!;

      // Update macro buffer bytes to get correct remaining bytes length
      macro.updateMacroKeys(macroKeys);

      dispatch(MacroEditorActions.updateMacroBuffer(macroBuffer));
      dispatch(MacroEditorActions.updateMacro(macro));
      dispatch(MacroEditorActions.updateMacroKeys(macroKeys));
      dispatch(MacroEditorActions.updateMacroKey(key));
    },

  updateMacroKeys:
    (macroKeys: MacroKey[]): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { configure } = getState();
      const macro = configure.macroEditor.macro;
      macro!.updateMacroKeys(macroKeys);
      dispatch(MacroEditorActions.updateMacroKeys(macroKeys));
    },

  flashMacro:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { configure, entities } = getState();
      const keyboard = entities.keyboard!;
      sendEventToGoogleAnalytics('configure/flash_macro', {
        vendor_id: keyboard.getInformation().vendorId,
        product_id: keyboard.getInformation().productId,
        product_name: keyboard.getInformation().productName,
      });

      const macroBuffer = configure.macroEditor.macroBuffer;
      const bytes = macroBuffer!.getBytes();
      const maxMacroBufferSize = entities.device.macro.maxBufferSize;
      const newBufferBytes = new Uint8Array(maxMacroBufferSize);
      newBufferBytes.set(bytes, 0);
      const result = await entities.keyboard!.updateMacroBuffer(
        0,
        newBufferBytes
      );
      if (!result.success) {
        console.error(result.error!);
        dispatch(NotificationActions.addError(result.error!, result.cause));
        return;
      }
      dispatch(HidActions.updateMacroBufferBytes(newBufferBytes));

      //dispatch(MacroEditorActions.clearMacroKey());
      const key: Key = configure.macroEditor.key!;
      dispatch(MacroActionsThunk.updateMacroKey(key));
    },
};
