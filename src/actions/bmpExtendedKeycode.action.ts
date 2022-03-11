import { Key } from '../components/configure/keycodekey/KeyGen';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store/state';
import { NotificationActions } from './actions';

export const BMP_EXTENDED_KEYCODE_EDITOR_ACTIONS = '@BmpExtendedKeyEditor';
export const BMP_EXTENDED_KEYCODE_EDITOR_UPDATE_KEY = `${BMP_EXTENDED_KEYCODE_EDITOR_ACTIONS}/UpdateBmpExtendedKey`;
export const BMP_EXTENDED_KEYCODE_EDITOR_CLEAR_KEY = `${BMP_EXTENDED_KEYCODE_EDITOR_ACTIONS}/UpdateBmpExtendedKey`;

export const BmpExtendedKeycodeEditorActions = {
  updateExtendedKey: (key: Key) => {
    return {
      type: BMP_EXTENDED_KEYCODE_EDITOR_UPDATE_KEY,
      value: key,
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
      dispatch(BmpExtendedKeycodeEditorActions.updateExtendedKey(key));
    },
};
