import { Key } from '../components/configure/keycodekey/KeyGen';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store/state';
import { NotificationActions } from './actions';
import { BMP_EXTENDED_MIN } from '../services/hid/KeycodeInfoListBmp';

export const BMP_EXTENDED_KEYCODE_EDITOR_ACTIONS = '@BmpExtendedKeyEditor';
export const BMP_EXTENDED_KEYCODE_EDITOR_UPDATE_KEY = `${BMP_EXTENDED_KEYCODE_EDITOR_ACTIONS}/UpdateBmpExtendedKey`;
export const BMP_EXTENDED_KEYCODE_EDITOR_UPDATE_EXTENDED_KEY_CODE = `${BMP_EXTENDED_KEYCODE_EDITOR_ACTIONS}/UpdateBmpExtendedKeycode`;
export const BMP_EXTENDED_KEYCODE_EDITOR_CLEAR_KEY = `${BMP_EXTENDED_KEYCODE_EDITOR_ACTIONS}/UpdateBmpExtendedKey`;

export const BmpExtendedKeycodeEditorActions = {
  updateExtendedKey: (id: number) => {
    return {
      type: BMP_EXTENDED_KEYCODE_EDITOR_UPDATE_KEY,
      value: id,
    };
  },
  updateExtendedKeycode: (extendedKeycode: Uint8Array) => {
    return {
      type: BMP_EXTENDED_KEYCODE_EDITOR_UPDATE_EXTENDED_KEY_CODE,
      value: extendedKeycode,
    };
  },
  clearExtendedKey: () => {
    return {
      type: BMP_EXTENDED_KEYCODE_EDITOR_CLEAR_KEY,
    };
  },
};

type ActionTypes = ReturnType<
  | typeof BmpExtendedKeycodeEditorActions[keyof typeof BmpExtendedKeycodeEditorActions]
  | typeof NotificationActions[keyof typeof NotificationActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;

export const BmpExtendedKeycodeActionsThunk = {
  updateBmpExtendedKey:
    (key: Key): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { entities } = getState();
      const id = key.keymap.code - BMP_EXTENDED_MIN;
      dispatch(
        BmpExtendedKeycodeEditorActions.updateExtendedKeycode(
          entities.device.extendedKeycode[id]
        )
      );
      dispatch(BmpExtendedKeycodeEditorActions.updateExtendedKey(id));
    },
};
