import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { KeyboardsPhase, RootState, SetupPhase } from '../store/state';
import {
  AppActions,
  KeymapActions,
  KeycodeKeyActions,
  KeydiffActions,
  LayoutOptionsActions,
  NotificationActions,
} from './actions';
import { HidActions, hidActionsThunk } from './hid.action';
import { validateKeyboardDefinitionSchema } from '../services/storage/Validator';
import { KeyboardDefinitionSchema } from '../gen/types/KeyboardDefinition';
import {
  IKeyboardDefinitionDocument,
  KeyboardDefinitionStatus,
} from '../services/storage/Storage';
import { KeyboardsAppActions } from './keyboards.actions';

export const STORAGE_ACTIONS = '@Storage';
export const STORAGE_UPDATE_KEYBOARD_DEFINITION = `${STORAGE_ACTIONS}/UpdateKeyboardDefinition`;
export const STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENTS = `${STORAGE_ACTIONS}/UpdateKeyboardDefinitionDocuments`;
export const STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENT = `${STORAGE_ACTIONS}/UpdateKeyboardDefinitionDocument`;
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
  updateKeyboardDefinitionDocument: (
    keyboardDefinitionDocument: IKeyboardDefinitionDocument
  ) => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENT,
      value: keyboardDefinitionDocument,
    };
  },
};

type ActionTypes = ReturnType<
  | typeof AppActions[keyof typeof AppActions]
  | typeof KeymapActions[keyof typeof KeymapActions]
  | typeof KeycodeKeyActions[keyof typeof KeycodeKeyActions]
  | typeof KeydiffActions[keyof typeof KeydiffActions]
  | typeof HidActions[keyof typeof HidActions]
  | typeof NotificationActions[keyof typeof NotificationActions]
  | typeof StorageActions[keyof typeof StorageActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const storageActionsThunk = {
  // eslint-disable-next-line no-undef
  refreshKeyboardDefinition: (
    keyboardDefinition: KeyboardDefinitionSchema
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    // eslint-disable-next-line no-unused-vars
    getState: () => RootState
  ) => {
    const { entities } = getState();
    dispatch(
      LayoutOptionsActions.initSelectedOptions(
        keyboardDefinition.layouts.labels
          ? keyboardDefinition.layouts.labels
          : []
      )
    );
    dispatch(StorageActions.updateKeyboardDefinition(keyboardDefinition));
    dispatch(AppActions.remapsInit(entities.device.layerCount));
    dispatch(KeydiffActions.clearKeydiff());
    dispatch(KeycodeKeyActions.clear());
    dispatch(KeymapActions.clearSelectedPos());
  },

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
    dispatch(hidActionsThunk.openKeyboard());
  },

  fetchKeyboardDefinitionById: (
    definitionId: string
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage, auth } = getState();
    const fetchKeyboardDefinitionResult = await storage.instance.fetchMyKeyboardDefinitionDocumentById(
      definitionId
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
      dispatch(
        StorageActions.updateKeyboardDefinitionDocument(
          fetchKeyboardDefinitionResult.document!
        )
      );
      dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.edit));
    } else {
      dispatch(NotificationActions.addWarn('No such keyboard.'));
      dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.list));
    }
  },

  fetchKeyboardDefinitionByDeviceInfo: (
    vendorId: number,
    productId: number,
    productName: string
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage } = getState();
    const fetchKeyboardDefinitionResult = await storage.instance.fetchKeyboardDefinitionDocumentByDeviceInfo(
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

  createKeyboardDefinitionAsDraft: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage, auth, keyboards } = getState();
    const keyboardDefinition = keyboards.createKeyboard.keyboardDefinition!;
    const productName = keyboards.createKeyboard.productName;
    const user = auth.instance.getCurrentAuthenticatedUser();
    const github = user.providerData[0]!;
    const jsonStr = keyboards.createKeyboard.jsonString;
    const result = await storage.instance.createKeyboardDefinitionDocument(
      user.uid,
      keyboardDefinition.name,
      parseInt(keyboardDefinition.vendorId, 16),
      parseInt(keyboardDefinition.productId, 16),
      productName,
      jsonStr,
      github.uid,
      github.displayName || '',
      github.email || '',
      KeyboardDefinitionStatus.draft
    );
    if (result.success) {
      dispatch(await storageActionsThunk.fetchMyKeyboardDefinitionDocuments());
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },

  createAndSubmitKeyboardDefinition: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage, auth, keyboards } = getState();
    const keyboardDefinition = keyboards.createKeyboard.keyboardDefinition!;
    const productName = keyboards.createKeyboard.productName;

    const existsResult = await storage.instance.isExistKeyboardDefinitionDocument(
      parseInt(keyboardDefinition.vendorId, 16),
      parseInt(keyboardDefinition.productId, 16),
      productName
    );
    if (!existsResult.success) {
      console.error(existsResult.cause!);
      dispatch(
        NotificationActions.addError(existsResult.error!, existsResult.cause)
      );
      return;
    }

    if (existsResult.exists!) {
      dispatch(
        NotificationActions.addWarn('The same keyboard already exists.')
      );
      dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.create));
      return;
    }

    const user = auth.instance.getCurrentAuthenticatedUser();
    const github = user.providerData[0]!;
    const jsonStr = keyboards.createKeyboard.jsonString;
    const result = await storage.instance.createKeyboardDefinitionDocument(
      user.uid,
      keyboardDefinition.name,
      parseInt(keyboardDefinition.vendorId, 16),
      parseInt(keyboardDefinition.productId, 16),
      productName,
      jsonStr,
      github.uid,
      github.displayName || '',
      github.email || '',
      KeyboardDefinitionStatus.in_review
    );
    if (result.success) {
      dispatch(await storageActionsThunk.fetchMyKeyboardDefinitionDocuments());
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },
};
