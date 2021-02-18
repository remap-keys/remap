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
import {
  KeyboardsAppActions,
  KeyboardsEditDefinitionActions,
} from './keyboards.actions';

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
    const { storage } = getState();
    const fetchKeyboardDefinitionResult = await storage.instance!.fetchMyKeyboardDefinitionDocumentById(
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
      dispatch(KeyboardsEditDefinitionActions.clear());
      dispatch(
        KeyboardsEditDefinitionActions.init(
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

    if (storage.instance === null) {
      console.warn(
        'To work Remap locally, skip accessing to Firebase and move to the uploading phase.'
      );
      dispatch(
        AppActions.updateSetupPhase(SetupPhase.waitingKeyboardDefinitionUpload)
      );
      return;
    }

    const fetchKeyboardDefinitionResult = await storage.instance!.fetchKeyboardDefinitionDocumentByDeviceInfo(
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

      dispatch(
        StorageActions.updateKeyboardDefinitionDocument(
          fetchKeyboardDefinitionResult.document!
        )
      );
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
    const fetchMyKeyboardDefinitionsResult = await storage.instance!.fetchMyKeyboardDefinitionDocuments();
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
    const { storage, auth, keyboards, github } = getState();
    const keyboardDefinition = keyboards.createdefinition.keyboardDefinition!;
    const productName = keyboards.createdefinition.productName;
    const user = auth.instance!.getCurrentAuthenticatedUser();
    const githubProviderData = user.providerData[0]!;

    const fetchAccountInfoResult = await github.instance.fetchAccountInfo(
      githubProviderData.uid
    );
    if (!fetchAccountInfoResult.success) {
      console.error(fetchAccountInfoResult.cause!);
      dispatch(
        NotificationActions.addError(
          fetchAccountInfoResult.error!,
          fetchAccountInfoResult.cause
        )
      );
      return;
    }
    const githubAccountInfo = fetchAccountInfoResult.info!;

    const jsonStr = keyboards.createdefinition.jsonString;
    const result = await storage.instance!.createKeyboardDefinitionDocument(
      user.uid,
      keyboardDefinition.name,
      parseInt(keyboardDefinition.vendorId, 16),
      parseInt(keyboardDefinition.productId, 16),
      productName,
      jsonStr,
      githubProviderData.uid,
      githubProviderData.displayName || '',
      githubProviderData.email || '',
      githubAccountInfo.html_url,
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
    const { storage, auth, keyboards, github } = getState();
    const keyboardDefinition = keyboards.createdefinition.keyboardDefinition!;
    const productName = keyboards.createdefinition.productName;

    const user = auth.instance!.getCurrentAuthenticatedUser();
    const githubProviderData = user.providerData[0]!;

    const fetchAccountInfoResult = await github.instance.fetchAccountInfo(
      githubProviderData.uid
    );
    if (!fetchAccountInfoResult.success) {
      console.error(fetchAccountInfoResult.cause!);
      dispatch(
        NotificationActions.addError(
          fetchAccountInfoResult.error!,
          fetchAccountInfoResult.cause
        )
      );
      return;
    }
    const githubAccountInfo = fetchAccountInfoResult.info!;

    const jsonStr = keyboards.createdefinition.jsonString;
    const result = await storage.instance!.createKeyboardDefinitionDocument(
      user.uid,
      keyboardDefinition.name,
      parseInt(keyboardDefinition.vendorId, 16),
      parseInt(keyboardDefinition.productId, 16),
      productName,
      jsonStr,
      githubProviderData.uid,
      githubProviderData.displayName || '',
      githubProviderData.email || '',
      githubAccountInfo.html_url,
      KeyboardDefinitionStatus.in_review
    );
    if (result.success) {
      dispatch(
        await storageActionsThunk.fetchKeyboardDefinitionById(
          result.definitionId!
        )
      );
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },

  updateKeyboardDefinitionAsDraft: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage, keyboards, entities } = getState();
    const definitionDoc = entities.keyboardDefinitionDocument;
    const keyboardDefinition = keyboards.editdefinition.keyboardDefinition!;
    const productName = keyboards.editdefinition.productName;
    const jsonStr = keyboards.editdefinition.jsonString;
    const result = await storage.instance!.updateKeyboardDefinitionDocument(
      definitionDoc!.id,
      keyboardDefinition.name,
      parseInt(keyboardDefinition.vendorId, 16),
      parseInt(keyboardDefinition.productId, 16),
      productName,
      jsonStr,
      KeyboardDefinitionStatus.draft
    );
    if (result.success) {
      dispatch(
        await storageActionsThunk.fetchKeyboardDefinitionById(definitionDoc!.id)
      );
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },

  updateAndSubmitKeyboardDefinition: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage, keyboards, entities } = getState();
    const keyboardDefinition = keyboards.editdefinition.keyboardDefinition!;
    const productName = keyboards.editdefinition.productName;

    const definitionDoc = entities.keyboardDefinitionDocument;
    const jsonStr = keyboards.editdefinition.jsonString;
    const result = await storage.instance!.updateKeyboardDefinitionDocument(
      definitionDoc!.id,
      keyboardDefinition.name,
      parseInt(keyboardDefinition.vendorId, 16),
      parseInt(keyboardDefinition.productId, 16),
      productName,
      jsonStr,
      KeyboardDefinitionStatus.in_review
    );
    if (result.success) {
      dispatch(
        await storageActionsThunk.fetchKeyboardDefinitionById(definitionDoc!.id)
      );
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },

  updateKeyboardDefinitionJsonFile: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage, keyboards, entities } = getState();
    const definitionDoc = entities.keyboardDefinitionDocument;
    const jsonStr = keyboards.editdefinition.jsonString;
    const result = await storage.instance!.updateKeyboardDefinitionJson(
      definitionDoc!.id,
      jsonStr
    );
    if (result.success) {
      dispatch(
        await storageActionsThunk.fetchKeyboardDefinitionById(definitionDoc!.id)
      );
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },

  deleteKeyboardDefinition: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { storage, entities } = getState();
    const definitionDoc = entities.keyboardDefinitionDocument;
    const result = await storage.instance!.deleteKeyboardDefinitionDocument(
      definitionDoc!.id
    );
    if (result.success) {
      dispatch(await storageActionsThunk.fetchMyKeyboardDefinitionDocuments());
    } else {
      console.error(result.cause!);
      dispatch(NotificationActions.addError(result.error!, result.cause));
    }
  },
};
