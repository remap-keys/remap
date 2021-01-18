import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState, SetupPhase } from '../store/state';
import {
  AppActions,
  LayoutOptionsActions,
  NotificationActions,
} from './actions';
import { hidActionsThunk } from './hid.action';
import { validateKeyboardDefinition } from '../services/storage/Validator';
import { KeyboardDefinitionSchema } from '../gen/types/KeyboardDefinition';

export const STORAGE_ACTIONS = '@Storage';
export const STORAGE_UPDATE_KEYBOARD_DEFINITION = `${STORAGE_ACTIONS}/UpdateKeyboardDefinition`;
export const StorageActions = {
  updateKeyboardDefinition: (keyboardDefinition: any) => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION,
      value: keyboardDefinition,
    };
  },
};

type ActionTypes = ReturnType<
  | typeof StorageActions[keyof typeof StorageActions]
  | typeof NotificationActions[keyof typeof NotificationActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const storageActionsThunk = {
  // eslint-disable-next-line no-undef
  uploadKeyboardDefinition: (
    keyboardDefinition: KeyboardDefinitionSchema
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    // eslint-disable-next-line no-unused-vars
    getState: () => RootState
  ) => {
    dispatch(StorageActions.updateKeyboardDefinition(keyboardDefinition));
    dispatch(
      LayoutOptionsActions.initSelectedOptions(
        keyboardDefinition.layouts.labels
          ? keyboardDefinition.layouts.labels
          : []
      )
    );
    await dispatch(hidActionsThunk.openKeyboard());
  },

  fetchKeyboardDefinition: (
    vendorId: number,
    productId: number,
    productName: string
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage } = getState();
    const fetchKeyboardDefinitionResult = await storage.instance.fetchKeyboardDefinition(
      vendorId,
      productId,
      productName
    );
    if (!fetchKeyboardDefinitionResult.success) {
      console.error(fetchKeyboardDefinitionResult.cause!);
      dispatch(
        NotificationActions.addError(
          fetchKeyboardDefinitionResult.error!,
          fetchKeyboardDefinitionResult.cause
        )
      );
      return;
    }
    if (fetchKeyboardDefinitionResult.exists!) {
      const json = fetchKeyboardDefinitionResult.document!.json;
      const validateResult = validateKeyboardDefinition(json);
      if (!validateResult.valid) {
        dispatch(NotificationActions.addError(validateResult.errorMessage!));
        dispatch(
          AppActions.updateSetupPhase(
            SetupPhase.waitingKeyboardDefinitionUpload
          )
        );
        return;
      }

      const keyboardDefinition: KeyboardDefinitionSchema = JSON.parse(json);
      dispatch(StorageActions.updateKeyboardDefinition(keyboardDefinition));
      dispatch(
        LayoutOptionsActions.initSelectedOptions(
          keyboardDefinition.layouts.labels
            ? keyboardDefinition.layouts.labels
            : []
        )
      );
      dispatch(AppActions.updateSetupPhase(SetupPhase.openingKeyboard));
      await dispatch(hidActionsThunk.openKeyboard());
    } else {
      dispatch(
        AppActions.updateSetupPhase(SetupPhase.waitingKeyboardDefinitionUpload)
      );
    }
  },
};
