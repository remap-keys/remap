import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState, SetupPhase } from '../store/state';
import { AppActions, NotificationActions } from './actions';
import { hidActionsThunk } from './hid.action';

export const STORAGE_ACTIONS = '@Storage';
export const STORAGE_UPDATE_KEYBOARD_DEFINITION = `${STORAGE_ACTIONS}/UpdateKeyboardDefinition`;
const storageActions = {
  updateKeyboardDefinition: (json: string) => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION,
      value: JSON.parse(json),
    };
  },
};

type ActionTypes = ReturnType<
  | typeof storageActions[keyof typeof storageActions]
  | typeof NotificationActions[keyof typeof NotificationActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const storageActionsThunk = {
  fetchKeyboardDefinition: (
    vendorId: number,
    productId: number
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { entities, storage } = getState();
    const keyboard = entities.keyboard!;
    const keyboardInfo = keyboard.getInformation();
    const vendorId = keyboardInfo.vendorId;
    const productId = keyboardInfo.productId;
    const fetchKeyboardDefinitionResult = await storage.instance.fetchKeyboardDefinition(
      vendorId,
      productId
    );
    if (!fetchKeyboardDefinitionResult.success) {
      console.error(fetchKeyboardDefinitionResult.cause!);
      dispatch(
        NotificationActions.addError(fetchKeyboardDefinitionResult.error!)
      );
      return;
    }
    if (fetchKeyboardDefinitionResult.exists!) {
      dispatch(
        storageActions.updateKeyboardDefinition(
          fetchKeyboardDefinitionResult.document!.json
        )
      );
      dispatch(AppActions.updateSetupPhase(SetupPhase.openingKeyboard));
      dispatch(hidActionsThunk.openKeyboard());
    } else {
      dispatch(
        AppActions.updateSetupPhase(SetupPhase.waitingKeyboardDefinitionUpload)
      );
    }
  },
};
