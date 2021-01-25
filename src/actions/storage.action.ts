import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { KeyboardsPhase, RootState, SetupPhase } from '../store/state';
import {
  AppActions,
  KeyboardsActions,
  LayoutOptionsActions,
  NotificationActions,
} from './actions';
import { hidActionsThunk } from './hid.action';
import { validateKeyboardDefinitionSchema } from '../services/storage/Validator';
import { KeyboardDefinitionSchema } from '../gen/types/KeyboardDefinition';
import { IKeyboardDefinitionDocument } from '../services/storage/Storage';
import { KeyboardsAppActions } from './keyboards.actions';

export const STORAGE_ACTIONS = '@Storage';
export const STORAGE_UPDATE_KEYBOARD_DEFINITION = `${STORAGE_ACTIONS}/UpdateKeyboardDefinition`;
export const STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENTS = `${STORAGE_ACTIONS}/UpdateKeyboardDefinitionDocuments`;
export const StorageActions = {
  updateKeyboardDefinition: (keyboardDefinition: any) => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION,
      value: keyboardDefinition,
    };
  },
  updateKeyboardDefinitionDocuments: (
    keyboardDefinitionDocuments: IKeyboardDefinitionDocument[]
  ) => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENTS,
      value: keyboardDefinitionDocuments,
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

    let keyboardDefinition: KeyboardDefinitionSchema;
    if (fetchKeyboardDefinitionResult.exists!) {
      const jsonStr: string = fetchKeyboardDefinitionResult.document!.json;
      try {
        keyboardDefinition = JSON.parse(jsonStr);
      } catch (error) {
        dispatch(NotificationActions.addError('JSON parse error'));
        return;
      }
      const validateResult = validateKeyboardDefinitionSchema(
        keyboardDefinition
      );
      if (!validateResult.valid) {
        dispatch(
          NotificationActions.addError(validateResult.errors![0].message)
        );
        dispatch(
          AppActions.updateSetupPhase(
            SetupPhase.waitingKeyboardDefinitionUpload
          )
        );
        return;
      }

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

  fetchMyKeyboardDefinitionDocuments: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage } = getState();
    const fetchMyKeyboardDefinitionsResult = await storage.instance.fetchMyKeyboardDefinitionDocuments();
    if (!fetchMyKeyboardDefinitionsResult.success) {
      console.error(fetchMyKeyboardDefinitionsResult.cause!);
      dispatch(
        NotificationActions.addError(
          fetchMyKeyboardDefinitionsResult.error!,
          fetchMyKeyboardDefinitionsResult.cause
        )
      );
      return;
    }
    dispatch(
      StorageActions.updateKeyboardDefinitionDocuments(
        fetchMyKeyboardDefinitionsResult.documents!
      )
    );
    dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.list));
  },
};
