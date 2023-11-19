import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
  ICatalogPhase,
  IKeyboardsPhase,
  KeyboardsPhase,
  RootState,
  SetupPhase,
} from '../store/state';
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
  AbstractKeymapData,
  AppliedKeymapData,
  IBuildableFirmware,
  IBuildableFirmwareFile,
  IBuildableFirmwareFileType,
  IBuildableFirmwareQmkFirmwareVersion,
  IFirmware,
  IFirmwareBuildingTask,
  IKeyboardDefinitionDocument,
  IOrganization,
  isError,
  isSuccessful,
  KeyboardDefinitionStatus,
  SavedKeymapData,
} from '../services/storage/Storage';
import {
  KeyboardsAppActions,
  KeyboardsEditDefinitionActions,
} from './keyboards.actions';
import { getGitHubProviderData } from '../services/auth/Auth';
import { IDeviceInformation } from '../services/hid/Hid';
import { sendEventToGoogleAnalytics } from '../utils/GoogleAnalytics';
import { CatalogAppActions } from './catalog.action';
import * as qs from 'qs';
import { IBootloaderType } from '../services/firmware/Types';

export const STORAGE_ACTIONS = '@Storage';
export const STORAGE_UPDATE_KEYBOARD_DEFINITION = `${STORAGE_ACTIONS}/UpdateKeyboardDefinition`;
export const STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENTS = `${STORAGE_ACTIONS}/UpdateKeyboardDefinitionDocuments`;
export const STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENT = `${STORAGE_ACTIONS}/UpdateKeyboardDefinitionDocument`;
export const STORAGE_UPDATE_SAVED_KEYMAPS = `${STORAGE_ACTIONS}/UpdateSavedKeymaps`;
export const STORAGE_UPDATE_SHARED_KEYMAPS = `${STORAGE_ACTIONS}/UpdateSharedKeymaps`;
export const STORAGE_UPDATE_APPLIED_KEYMAPS = `${STORAGE_ACTIONS}/UpdateAppliedKeymaps`;
export const STORAGE_UPDATE_SEARCH_RESULT_KEYBOARD_DEFINITION_DOCUMENT = `${STORAGE_ACTIONS}/UpdateSearchResultKeyboardDefinitionDocument`;
export const STORAGE_UPDATE_SAME_AUTHOR_KEYBOARD_DEFINITION_DOCUMENTS = `${STORAGE_ACTIONS}/UpdateSameAuthorKeyboardDefinitionDocuments`;
export const STORAGE_UPDATE_SEARCH_RESULT_ORGANIZATION_MAP = `${STORAGE_ACTIONS}/UpdateSearchResultOrganizationMap`;
export const STORAGE_UPDATE_ORGANIZATION = `${STORAGE_ACTIONS}/UpdateOrganization`;
export const STORAGE_UPDATE_ORGANIZATION_MAP = `${STORAGE_ACTIONS}/UpdateOrganizationMap`;
export const STORAGE_UPDATE_BUILDABLE_FIRMWARE = `${STORAGE_ACTIONS}/UpdateBuildableFirmware`;
export const STORAGE_UPDATE_BUILDABLE_FIRMWARE_KEYBOARD_FILES = `${STORAGE_ACTIONS}/UpdateBuildableFirmwareKeyboardFiles`;
export const STORAGE_UPDATE_BUILDABLE_FIRMWARE_KEYMAP_FILES = `${STORAGE_ACTIONS}/UpdateBuildableFirmwareKeymapFiles`;
export const STORAGE_UPDATE_FIRMWARE_BUILDING_TASKS = `${STORAGE_ACTIONS}/UpdateFirmwareBuildingTasks`;
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
  clearKeyboardDefinitionDocument: () => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENT,
      value: null,
    };
  },
  updateSavedKeymaps: (keymaps: SavedKeymapData[]) => {
    return {
      type: STORAGE_UPDATE_SAVED_KEYMAPS,
      value: keymaps,
    };
  },
  updateSharedKeymaps: (keymaps: SavedKeymapData[]) => {
    return {
      type: STORAGE_UPDATE_SHARED_KEYMAPS,
      value: keymaps,
    };
  },
  updateAppliedKeymaps: (keymaps: AppliedKeymapData[]) => {
    return {
      type: STORAGE_UPDATE_APPLIED_KEYMAPS,
      value: keymaps,
    };
  },
  updateSearchResultKeyboardDefinitionDocument: (
    definitions: IKeyboardDefinitionDocument[]
  ) => {
    return {
      type: STORAGE_UPDATE_SEARCH_RESULT_KEYBOARD_DEFINITION_DOCUMENT,
      value: definitions,
    };
  },
  updateSameAuthorKeyboardDefinitionDocuments: (
    definitions: IKeyboardDefinitionDocument[]
  ) => {
    return {
      type: STORAGE_UPDATE_SAME_AUTHOR_KEYBOARD_DEFINITION_DOCUMENTS,
      value: definitions,
    };
  },
  updateSearchResultOrganizationMap: (
    organizationMap: Record<string, IOrganization>
  ) => {
    return {
      type: STORAGE_UPDATE_SEARCH_RESULT_ORGANIZATION_MAP,
      value: organizationMap,
    };
  },
  updateOrganization: (organization: IOrganization) => {
    return {
      type: STORAGE_UPDATE_ORGANIZATION,
      value: organization,
    };
  },
  updateOrganizationMap: (organizationMap: Record<string, IOrganization>) => {
    return {
      type: STORAGE_UPDATE_ORGANIZATION_MAP,
      value: organizationMap,
    };
  },
  updateBuildableFirmware: (buildableFirmware: IBuildableFirmware | null) => {
    return {
      type: STORAGE_UPDATE_BUILDABLE_FIRMWARE,
      value: buildableFirmware,
    };
  },
  updateBuildableFirmwareKeyboardFiles: (
    buildableFirmwareKeyboardFiles: IBuildableFirmwareFile[]
  ) => {
    return {
      type: STORAGE_UPDATE_BUILDABLE_FIRMWARE_KEYBOARD_FILES,
      value: buildableFirmwareKeyboardFiles,
    };
  },
  updateBuildableFirmwareKeymapFiles: (
    buildableFirmwareKeymapFiles: IBuildableFirmwareFile[]
  ) => {
    return {
      type: STORAGE_UPDATE_BUILDABLE_FIRMWARE_KEYMAP_FILES,
      value: buildableFirmwareKeymapFiles,
    };
  },
  updateFirmwareBuildingTasks: (tasks: IFirmwareBuildingTask[]) => {
    return {
      type: STORAGE_UPDATE_FIRMWARE_BUILDING_TASKS,
      value: tasks,
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
  refreshKeyboardDefinition:
    (keyboardDefinition: KeyboardDefinitionSchema): ThunkPromiseAction<void> =>
    async (
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
      await dispatch(hidActionsThunk.refreshKeymaps());
      dispatch(AppActions.remapsInit(entities.device.layerCount));
      dispatch(AppActions.encodersRemapsInit(entities.device.layerCount));
      dispatch(KeydiffActions.clearKeydiff());
      dispatch(KeycodeKeyActions.clear());
      dispatch(KeymapActions.clearSelectedKeyPosition());
    },

  // eslint-disable-next-line no-undef
  uploadKeyboardDefinition:
    (keyboardDefinition: KeyboardDefinitionSchema): ThunkPromiseAction<void> =>
    async (
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

  fetchKeyboardDefinitionById:
    (
      definitionId: string,
      nextPhase: IKeyboardsPhase
    ): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const fetchKeyboardDefinitionResult =
        await storage.instance!.fetchMyKeyboardDefinitionDocumentById(
          definitionId
        );
      if (isError(fetchKeyboardDefinitionResult)) {
        console.error(fetchKeyboardDefinitionResult.cause);
        dispatch(
          NotificationActions.addError(
            fetchKeyboardDefinitionResult.error,
            fetchKeyboardDefinitionResult.cause
          )
        );
        return;
      }
      if (fetchKeyboardDefinitionResult.value.exists) {
        const definitionDocument =
          fetchKeyboardDefinitionResult.value.document!;
        if (definitionDocument.authorType === 'organization') {
          const fetchOrganizationByIdResult =
            await storage.instance!.fetchOrganizationById(
              definitionDocument.organizationId!
            );
          if (isError(fetchOrganizationByIdResult)) {
            console.error(fetchOrganizationByIdResult.cause);
            dispatch(
              NotificationActions.addError(
                fetchOrganizationByIdResult.error,
                fetchOrganizationByIdResult.cause
              )
            );
            return;
          }
          dispatch(
            StorageActions.updateOrganization(
              fetchOrganizationByIdResult.value.organization
            )
          );
        }
        const fetchMyOrganizationsResult =
          await storage.instance!.fetchMyOrganizations();
        if (isError(fetchMyOrganizationsResult)) {
          console.error(fetchMyOrganizationsResult.cause);
          dispatch(
            NotificationActions.addError(
              fetchMyOrganizationsResult.error,
              fetchMyOrganizationsResult.cause
            )
          );
          return;
        }
        const fetchBuildableFirmwareResult =
          await storage.instance!.createAndFetchBuildableFirmware(definitionId);
        if (isError(fetchBuildableFirmwareResult)) {
          console.error(fetchBuildableFirmwareResult.cause);
          dispatch(
            NotificationActions.addError(
              fetchBuildableFirmwareResult.error,
              fetchBuildableFirmwareResult.cause
            )
          );
          return;
        }
        const fetchBuildableFirmwareKeyboardFilesResult =
          await storage.instance!.fetchBuildableFirmwareFiles(
            definitionId,
            'keyboard'
          );
        if (isError(fetchBuildableFirmwareKeyboardFilesResult)) {
          console.error(fetchBuildableFirmwareKeyboardFilesResult.cause);
          dispatch(
            NotificationActions.addError(
              fetchBuildableFirmwareKeyboardFilesResult.error,
              fetchBuildableFirmwareKeyboardFilesResult.cause
            )
          );
          return;
        }
        const fetchBuildableFirmwareKeymapFilesResult =
          await storage.instance!.fetchBuildableFirmwareFiles(
            definitionId,
            'keymap'
          );
        if (isError(fetchBuildableFirmwareKeymapFilesResult)) {
          console.error(fetchBuildableFirmwareKeymapFilesResult.cause);
          dispatch(
            NotificationActions.addError(
              fetchBuildableFirmwareKeymapFilesResult.error,
              fetchBuildableFirmwareKeymapFilesResult.cause
            )
          );
          return;
        }
        dispatch(
          StorageActions.updateBuildableFirmware(
            fetchBuildableFirmwareResult.value
          )
        );
        dispatch(
          StorageActions.updateBuildableFirmwareKeyboardFiles(
            fetchBuildableFirmwareKeyboardFilesResult.value
          )
        );
        dispatch(
          StorageActions.updateBuildableFirmwareKeymapFiles(
            fetchBuildableFirmwareKeymapFilesResult.value
          )
        );
        dispatch(
          StorageActions.updateOrganizationMap(
            fetchMyOrganizationsResult.value.organizationMap
          )
        );
        dispatch(
          StorageActions.updateKeyboardDefinitionDocument(definitionDocument)
        );
        dispatch(KeyboardsEditDefinitionActions.clear());
        dispatch(KeyboardsEditDefinitionActions.init(definitionDocument));
        dispatch(
          KeyboardsEditDefinitionActions.updateFeatures(
            definitionDocument.features
          )
        );
        dispatch(
          KeyboardsEditDefinitionActions.updateDescription(
            definitionDocument.description
          )
        );
        dispatch(
          KeyboardsEditDefinitionActions.updateStores(
            definitionDocument.stores || []
          )
        );
        dispatch(
          KeyboardsEditDefinitionActions.updateWebsiteUrl(
            definitionDocument.websiteUrl
          )
        );
        dispatch(
          KeyboardsEditDefinitionActions.updateAdditionalDescriptions(
            definitionDocument.additionalDescriptions
          )
        );
        dispatch(KeyboardsAppActions.updatePhase(nextPhase));
      } else {
        dispatch(NotificationActions.addWarn('No such keyboard.'));
        dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.list));
      }
    },

  fetchKeyboardDefinitionByDeviceInfo:
    (
      vendorId: number,
      productId: number,
      productName: string
    ): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, app } = getState();

      if (storage.instance === null) {
        console.warn(
          'To work Remap locally, skip accessing to Firebase and move to the uploading phase.'
        );
        dispatch(
          AppActions.updateSetupPhase(
            SetupPhase.waitingKeyboardDefinitionUpload
          )
        );
        return;
      }

      let keyboardDefinitionDocument: IKeyboardDefinitionDocument | undefined;

      const fetchKeyboardDefinitionResult =
        await storage.instance!.fetchKeyboardDefinitionDocumentByDeviceInfo(
          vendorId,
          productId,
          productName
        );
      if (isError(fetchKeyboardDefinitionResult)) {
        console.error(fetchKeyboardDefinitionResult.cause);
        dispatch(
          NotificationActions.addError(
            fetchKeyboardDefinitionResult.error,
            fetchKeyboardDefinitionResult.cause
          )
        );
        return;
      }
      if (fetchKeyboardDefinitionResult.value.exists) {
        keyboardDefinitionDocument =
          fetchKeyboardDefinitionResult.value.document;
      } else {
        if (!app.signedIn) {
          dispatch(
            AppActions.updateSetupPhase(
              SetupPhase.waitingKeyboardDefinitionUpload
            )
          );
          return;
        }
        const myKeyboardDefinitionDocumentsResult =
          await storage.instance!.fetchMyKeyboardDefinitionDocuments();
        if (isError(myKeyboardDefinitionDocumentsResult)) {
          console.error(myKeyboardDefinitionDocumentsResult.cause);
          dispatch(
            NotificationActions.addError(
              myKeyboardDefinitionDocumentsResult.error,
              myKeyboardDefinitionDocumentsResult.cause
            )
          );
          return;
        }
        keyboardDefinitionDocument =
          myKeyboardDefinitionDocumentsResult.value.documents.find(
            (doc) =>
              doc.vendorId === vendorId &&
              doc.productId === productId &&
              productName.endsWith(doc.productName)
          );
      }

      if (!keyboardDefinitionDocument) {
        dispatch(
          AppActions.updateSetupPhase(
            SetupPhase.waitingKeyboardDefinitionUpload
          )
        );
        return;
      }

      let keyboardDefinition: KeyboardDefinitionSchema;
      const jsonStr: string = keyboardDefinitionDocument.json;
      try {
        keyboardDefinition = JSON.parse(jsonStr);
      } catch (error) {
        dispatch(NotificationActions.addError('JSON parse error'));
        return;
      }
      const validateResult =
        validateKeyboardDefinitionSchema(keyboardDefinition);
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

      if (keyboardDefinitionDocument.authorType === 'organization') {
        const fetchOrganizationByIdResult =
          await storage.instance!.fetchOrganizationById(
            keyboardDefinitionDocument.organizationId!
          );
        if (isError(fetchOrganizationByIdResult)) {
          console.error(fetchOrganizationByIdResult.cause);
          dispatch(
            NotificationActions.addError(
              fetchOrganizationByIdResult.error,
              fetchOrganizationByIdResult.cause
            )
          );
          return;
        }
        dispatch(
          StorageActions.updateOrganization(
            fetchOrganizationByIdResult.value.organization
          )
        );
      }

      dispatch(
        StorageActions.updateKeyboardDefinitionDocument(
          keyboardDefinitionDocument
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
    },

  fetchMyKeyboardDefinitionDocuments:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const fetchMyKeyboardDefinitionsResult =
        await storage.instance!.fetchMyKeyboardDefinitionDocuments();
      if (isError(fetchMyKeyboardDefinitionsResult)) {
        console.error(fetchMyKeyboardDefinitionsResult.cause);
        dispatch(
          NotificationActions.addError(
            fetchMyKeyboardDefinitionsResult.error,
            fetchMyKeyboardDefinitionsResult.cause
          )
        );
        return;
      }
      const organizationIds: string[] =
        fetchMyKeyboardDefinitionsResult.value.documents
          .filter((doc) => doc.authorType === 'organization')
          .map((doc) => doc.organizationId)
          .reduce((result, id) => {
            if (id !== undefined && !result.includes(id)) {
              result.push(id);
            }
            return result;
          }, [] as string[]);
      if (organizationIds.length !== 0) {
        const fetchOrganizationsByIdsResult =
          await storage.instance!.fetchOrganizationsByIds(organizationIds);
        if (isError(fetchOrganizationsByIdsResult)) {
          console.error(fetchOrganizationsByIdsResult.cause);
          dispatch(
            NotificationActions.addError(
              fetchOrganizationsByIdsResult.error,
              fetchOrganizationsByIdsResult.cause
            )
          );
          return;
        }
        dispatch(
          StorageActions.updateOrganizationMap(
            fetchOrganizationsByIdsResult.value.organizationMap
          )
        );
      }
      dispatch(
        StorageActions.updateKeyboardDefinitionDocuments(
          fetchMyKeyboardDefinitionsResult.value.documents
        )
      );
      dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.list));
    },

  createKeyboardDefinitionAsDraft:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, auth, keyboards, github } = getState();
      const keyboardDefinition = keyboards.createdefinition.keyboardDefinition!;
      const user = auth.instance!.getCurrentAuthenticatedUser();
      const githubProviderDataResult = getGitHubProviderData(user);
      if (!githubProviderDataResult.exists) {
        console.error('The user does not have a GitHub Provider data.');
        dispatch(
          NotificationActions.addError(
            'The user does not have a GitHub Provider data.'
          )
        );
        return;
      }
      const githubProviderData = githubProviderDataResult.userInfo!;

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
        keyboards.createdefinition.productName,
        jsonStr,
        githubProviderData.uid,
        githubProviderData.displayName || '',
        githubProviderData.email || '',
        githubAccountInfo.html_url,
        keyboards.createdefinition.firmwareCodePlace,
        keyboards.createdefinition.qmkRepositoryFirstPullRequestUrl,
        keyboards.createdefinition.forkedRepositoryUrl,
        keyboards.createdefinition.forkedRepositoryEvidence,
        keyboards.createdefinition.otherPlaceHowToGet,
        keyboards.createdefinition.otherPlaceSourceCodeEvidence,
        keyboards.createdefinition.otherPlacePublisherEvidence,
        keyboards.createdefinition.contactInformation,
        keyboards.createdefinition.organizationEvidence,
        keyboards.createdefinition.authorType,
        keyboards.createdefinition.organizationId,
        KeyboardDefinitionStatus.draft
      );
      if (isSuccessful(result)) {
        dispatch(
          await storageActionsThunk.fetchMyKeyboardDefinitionDocuments()
        );
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    },

  createAndSubmitKeyboardDefinition:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, auth, keyboards, github } = getState();
      const keyboardDefinition = keyboards.createdefinition.keyboardDefinition!;

      const user = auth.instance!.getCurrentAuthenticatedUser();
      const githubProviderDataResutl = getGitHubProviderData(user);
      if (!githubProviderDataResutl.exists) {
        console.error('The user does not have a GitHub Provider data.');
        dispatch(
          NotificationActions.addError(
            'The user does not have a GitHub Provider data.'
          )
        );
        return;
      }
      const githubProviderData = githubProviderDataResutl.userInfo!;

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
        keyboards.createdefinition.productName,
        jsonStr,
        githubProviderData.uid,
        githubProviderData.displayName || '',
        githubProviderData.email || '',
        githubAccountInfo.html_url,
        keyboards.createdefinition.firmwareCodePlace,
        keyboards.createdefinition.qmkRepositoryFirstPullRequestUrl,
        keyboards.createdefinition.forkedRepositoryUrl,
        keyboards.createdefinition.forkedRepositoryEvidence,
        keyboards.createdefinition.otherPlaceHowToGet,
        keyboards.createdefinition.otherPlaceSourceCodeEvidence,
        keyboards.createdefinition.otherPlacePublisherEvidence,
        keyboards.createdefinition.contactInformation,
        keyboards.createdefinition.organizationEvidence,
        keyboards.createdefinition.authorType,
        keyboards.createdefinition.organizationId,
        KeyboardDefinitionStatus.in_review
      );
      if (isSuccessful(result)) {
        dispatch(
          await storageActionsThunk.fetchKeyboardDefinitionById(
            result.value.definitionId,
            'edit'
          )
        );
      } else {
        console.error(result.cause!);
        dispatch(NotificationActions.addError(result.error!, result.cause));
      }
    },

  updateKeyboardDefinitionAsDraft:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, keyboards, entities } = getState();
      const definitionDoc = entities.keyboardDefinitionDocument;
      const keyboardDefinition = keyboards.editdefinition.keyboardDefinition!;
      const jsonStr = keyboards.editdefinition.jsonString;
      const result = await storage.instance!.updateKeyboardDefinitionDocument(
        definitionDoc!.id,
        keyboardDefinition.name,
        parseInt(keyboardDefinition.vendorId, 16),
        parseInt(keyboardDefinition.productId, 16),
        keyboards.editdefinition.productName,
        jsonStr,
        keyboards.editdefinition.firmwareCodePlace || 'other',
        keyboards.editdefinition.qmkRepositoryFirstPullRequestUrl,
        keyboards.editdefinition.forkedRepositoryUrl,
        keyboards.editdefinition.forkedRepositoryEvidence,
        keyboards.editdefinition.otherPlaceHowToGet,
        keyboards.editdefinition.otherPlaceSourceCodeEvidence,
        keyboards.editdefinition.otherPlacePublisherEvidence,
        keyboards.editdefinition.contactInformation,
        keyboards.editdefinition.organizationEvidence,
        keyboards.editdefinition.authorType,
        keyboards.editdefinition.organizationId,
        KeyboardDefinitionStatus.draft
      );
      if (isSuccessful(result)) {
        dispatch(
          await storageActionsThunk.fetchKeyboardDefinitionById(
            definitionDoc!.id,
            'edit'
          )
        );
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    },

  updateAndSubmitKeyboardDefinition:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, keyboards, entities } = getState();
      const keyboardDefinition = keyboards.editdefinition.keyboardDefinition!;

      const definitionDoc = entities.keyboardDefinitionDocument;
      const jsonStr = keyboards.editdefinition.jsonString;
      const result = await storage.instance!.updateKeyboardDefinitionDocument(
        definitionDoc!.id,
        keyboardDefinition.name,
        parseInt(keyboardDefinition.vendorId, 16),
        parseInt(keyboardDefinition.productId, 16),
        keyboards.editdefinition.productName,
        jsonStr,
        keyboards.editdefinition.firmwareCodePlace || 'other',
        keyboards.editdefinition.qmkRepositoryFirstPullRequestUrl,
        keyboards.editdefinition.forkedRepositoryUrl,
        keyboards.editdefinition.forkedRepositoryEvidence,
        keyboards.editdefinition.otherPlaceHowToGet,
        keyboards.editdefinition.otherPlaceSourceCodeEvidence,
        keyboards.editdefinition.otherPlacePublisherEvidence,
        keyboards.editdefinition.contactInformation,
        keyboards.editdefinition.organizationEvidence,
        keyboards.editdefinition.authorType,
        keyboards.editdefinition.organizationId,
        KeyboardDefinitionStatus.in_review
      );
      if (isSuccessful(result)) {
        dispatch(
          await storageActionsThunk.fetchKeyboardDefinitionById(
            definitionDoc!.id,
            'edit'
          )
        );
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    },

  updateKeyboardDefinitionJsonFile:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, keyboards, entities } = getState();
      const definitionDoc = entities.keyboardDefinitionDocument;
      // This `keyboardDefinition` value has already been updated by a new
      // JSON file the user uploaded from local.
      const keyboardDefinition = keyboards.editdefinition.keyboardDefinition;
      const jsonStr = keyboards.editdefinition.jsonString;
      const result = await storage.instance!.updateKeyboardDefinitionJson(
        definitionDoc!.id,
        keyboardDefinition!.name,
        jsonStr
      );
      if (isSuccessful(result)) {
        dispatch(
          await storageActionsThunk.fetchKeyboardDefinitionById(
            definitionDoc!.id,
            'edit'
          )
        );
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    },

  deleteKeyboardDefinition:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, entities } = getState();
      const definitionDoc = entities.keyboardDefinitionDocument;
      const result = await storage.instance!.deleteKeyboardDefinitionDocument(
        definitionDoc!.id
      );
      if (isSuccessful(result)) {
        dispatch(
          await storageActionsThunk.fetchMyKeyboardDefinitionDocuments()
        );
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    },

  fetchMySavedKeymaps:
    (info: IDeviceInformation): ThunkPromiseAction<void> =>
    async (
      // eslint-disable-next-line no-unused-vars
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const resultList = await storage.instance!.fetchMySavedKeymaps(info);

      if (isSuccessful(resultList)) {
        dispatch(
          StorageActions.updateSavedKeymaps(resultList.value.savedKeymaps)
        );
      } else {
        console.error(resultList.cause);
        dispatch(
          NotificationActions.addError(resultList.error, resultList.cause)
        );
      }
    },

  fetchSharedKeymaps:
    (
      info: IDeviceInformation,
      withoutMine: boolean
    ): ThunkPromiseAction<void> =>
    async (
      // eslint-disable-next-line no-unused-vars
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const resultList = await storage.instance!.fetchSharedKeymaps(
        info,
        withoutMine
      );

      if (isSuccessful(resultList)) {
        dispatch(
          StorageActions.updateSharedKeymaps(resultList.value.savedKeymaps)
        );
      } else {
        console.error(resultList.cause);
        dispatch(
          NotificationActions.addError(resultList.error, resultList.cause)
        );
      }
    },

  createSavedKeymap:
    (keymapData: SavedKeymapData): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();

      sendEventToGoogleAnalytics('configure/save_keymap', {
        vendor_id: keymapData.vendor_id,
        product_id: keymapData.product_id,
        product_name: keymapData.product_name,
      });

      const result = await storage.instance!.createSavedKeymap(keymapData);
      if (isError(result)) {
        console.error(result.cause);
        dispatch(
          NotificationActions.addError(
            `Couldn't save the keymap: ${result.error}`,
            result.cause
          )
        );
        return;
      }
      const info: IDeviceInformation = {
        vendorId: keymapData.vendor_id,
        productId: keymapData.product_id,
        productName: keymapData.product_name,
      };
      dispatch(storageActionsThunk.fetchMySavedKeymaps(info));
    },

  updateSavedKeymap:
    (keymapData: SavedKeymapData): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const result = await storage.instance!.updateSavedKeymap(keymapData);
      if (isError(result)) {
        console.error(result.cause);
        dispatch(
          NotificationActions.addError(
            `Couldn't update the keymap: ${result.error}`,
            result.cause
          )
        );
        return;
      }

      const info: IDeviceInformation = {
        vendorId: keymapData.vendor_id,
        productId: keymapData.product_id,
        productName: keymapData.product_name,
      };
      dispatch(storageActionsThunk.fetchMySavedKeymaps(info));
    },

  deleteSavedKeymap:
    (keymapData: SavedKeymapData): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const result = await storage.instance!.deleteSavedKeymap(keymapData.id!);
      if (isError(result)) {
        console.error(result.cause);
        dispatch(
          NotificationActions.addError(
            `Couldn't delete the keymap: ${result.error}`,
            result.cause
          )
        );
        return;
      }

      const info: IDeviceInformation = {
        vendorId: keymapData.vendor_id,
        productId: keymapData.product_id,
        productName: keymapData.product_name,
      };
      dispatch(storageActionsThunk.fetchMySavedKeymaps(info));
    },

  createOrUpdateAppliedKeymap:
    (keymapData: AbstractKeymapData): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const result = await storage.instance!.createOrUpdateAppliedKeymap(
        keymapData
      );
      if (isError(result)) {
        console.error(result.cause);
        dispatch(
          NotificationActions.addError(
            `Creating or updating the applied keymap failed: ${result.error}`,
            result.cause
          )
        );
        return;
      }
      const info: IDeviceInformation = {
        vendorId: keymapData.vendor_id,
        productId: keymapData.product_id,
        productName: keymapData.product_name,
      };
      dispatch(await storageActionsThunk.fetchMyAppliedKeymaps(info));
    },

  fetchMyAppliedKeymaps:
    (info: IDeviceInformation): ThunkPromiseAction<void> =>
    async (
      // eslint-disable-next-line no-unused-vars
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const resultList = await storage.instance!.fetchMyAppliedKeymaps(info);

      if (isSuccessful(resultList)) {
        dispatch(
          StorageActions.updateAppliedKeymaps(resultList.value.appliedKeymaps)
        );
      } else {
        console.error(resultList.cause);
        dispatch(
          NotificationActions.addError(resultList.error, resultList.cause)
        );
      }
    },

  searchKeyboardsForCatalog:
    (): ThunkPromiseAction<void> =>
    async (
      // eslint-disable-next-line no-unused-vars
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      sendEventToGoogleAnalytics('catalog/search');
      dispatch(CatalogAppActions.updatePhase('processing'));
      const { catalog, storage } = getState();
      const features = catalog.search.features;
      const keyword = catalog.search.keyword;
      const organizationId = catalog.search.organizationId;
      let searchKeyboardsByFeaturesResult =
        await storage.instance!.searchKeyboards(features, organizationId);
      if (isSuccessful(searchKeyboardsByFeaturesResult)) {
        const definitionDocs =
          searchKeyboardsByFeaturesResult.value.documents.filter((doc) =>
            doc.name.toLowerCase().includes(keyword.toLowerCase())
          );
        const filteredDocs = definitionDocs.filter((doc) => {
          if (features.length === 0) return true;

          let allMatch = true;
          features.forEach((feat) => {
            allMatch = allMatch && doc.features.includes(feat);
          });

          return allMatch;
        });

        filteredDocs.sort((a, b) => {
          const countA = a.imageUrl ? 1 : 0; // sort higher with a image
          const countB = b.imageUrl ? 1 : 0; // sort higher with a image

          if (countA === countB) {
            return Math.random() - 0.5;
          } else {
            return countB - countA;
          }
        });

        const organizationIds: string[] = filteredDocs
          .filter((doc) => doc.authorType === 'organization')
          .map((doc) => doc.organizationId)
          .reduce((result, id) => {
            if (id !== undefined && !result.includes(id)) {
              result.push(id);
            }
            return result;
          }, [] as string[]);
        if (organizationIds.length > 0) {
          const fetchOrganizationsByIdsResult =
            await storage.instance!.fetchOrganizationsByIds(organizationIds);
          if (isSuccessful(fetchOrganizationsByIdsResult)) {
            dispatch(
              StorageActions.updateSearchResultOrganizationMap(
                fetchOrganizationsByIdsResult.value.organizationMap
              )
            );
          } else {
            console.error(fetchOrganizationsByIdsResult.cause);
            dispatch(
              NotificationActions.addError(
                fetchOrganizationsByIdsResult.error,
                fetchOrganizationsByIdsResult.cause
              )
            );
          }
        }
        dispatch(
          StorageActions.updateSearchResultKeyboardDefinitionDocument(
            filteredDocs
          )
        );
      } else {
        console.error(searchKeyboardsByFeaturesResult.cause);
        dispatch(
          NotificationActions.addError(
            searchKeyboardsByFeaturesResult.error,
            searchKeyboardsByFeaturesResult.cause
          )
        );
      }
      const query: { [p: string]: string | string[] } = {};
      if (keyword) {
        query.keyword = keyword;
      }
      if (features && features.length > 0) {
        query.features = features.join(',');
      }
      if (organizationId) {
        query.organizationId = organizationId;
      }
      history.replaceState(null, 'Remap', `/catalog?${qs.stringify(query)}`);
      dispatch(CatalogAppActions.updatePhase('list'));
    },

  fetchKeyboardDefinitionForCatalogById:
    (
      definitionId: string,
      nextPhase: ICatalogPhase
    ): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const fetchKeyboardDefinitionResult =
        await storage.instance!.fetchKeyboardDefinitionDocumentById(
          definitionId
        );
      if (isError(fetchKeyboardDefinitionResult)) {
        console.error(fetchKeyboardDefinitionResult.cause);
        dispatch(
          NotificationActions.addError(
            fetchKeyboardDefinitionResult.error,
            fetchKeyboardDefinitionResult.cause
          )
        );
        dispatch(CatalogAppActions.updatePhase('init'));
        dispatch(await storageActionsThunk.searchKeyboardsForCatalog());
        return;
      }
      if (fetchKeyboardDefinitionResult.value.exists) {
        const keyboardDefinitionDocument =
          fetchKeyboardDefinitionResult.value.document!;
        dispatch(
          StorageActions.updateKeyboardDefinitionDocument(
            keyboardDefinitionDocument
          )
        );

        if (keyboardDefinitionDocument.authorType === 'organization') {
          const fetchOrganizationByIdResult =
            await storage.instance!.fetchOrganizationById(
              keyboardDefinitionDocument.organizationId!
            );
          if (isError(fetchOrganizationByIdResult)) {
            console.error(fetchOrganizationByIdResult.cause);
            dispatch(
              NotificationActions.addError(
                fetchOrganizationByIdResult.error,
                fetchOrganizationByIdResult.cause
              )
            );
            dispatch(CatalogAppActions.updatePhase('init'));
            await dispatch(storageActionsThunk.searchKeyboardsForCatalog());
            return;
          }
          dispatch(
            StorageActions.updateOrganization(
              fetchOrganizationByIdResult.value.organization
            )
          );
        }

        let keyboardDefinition: KeyboardDefinitionSchema;
        const jsonStr: string = keyboardDefinitionDocument.json;
        try {
          keyboardDefinition = JSON.parse(jsonStr);
        } catch (error) {
          dispatch(NotificationActions.addError('JSON parse error'));
          return;
        }
        const validateResult =
          validateKeyboardDefinitionSchema(keyboardDefinition);
        if (!validateResult.valid) {
          dispatch(
            NotificationActions.addError(validateResult.errors![0].message)
          );
          return;
        }
        dispatch(StorageActions.updateKeyboardDefinition(keyboardDefinition));

        const fetchBuildableFirmwareResult =
          await storage.instance!.fetchBuildableFirmware(definitionId);
        if (isError(fetchBuildableFirmwareResult)) {
          console.error(fetchBuildableFirmwareResult.cause);
          dispatch(
            NotificationActions.addError(
              fetchBuildableFirmwareResult.error,
              fetchBuildableFirmwareResult.cause
            )
          );
          dispatch(CatalogAppActions.updatePhase('init'));
          await dispatch(storageActionsThunk.searchKeyboardsForCatalog());
          return;
        }
        dispatch(
          StorageActions.updateBuildableFirmware(
            fetchBuildableFirmwareResult.value
          )
        );

        const fetchBuildableFirmwareKeyboardFilesResult =
          await storage.instance!.fetchBuildableFirmwareFiles(
            definitionId,
            'keyboard'
          );
        if (isError(fetchBuildableFirmwareKeyboardFilesResult)) {
          console.error(fetchBuildableFirmwareKeyboardFilesResult.cause);
          dispatch(
            NotificationActions.addError(
              fetchBuildableFirmwareKeyboardFilesResult.error,
              fetchBuildableFirmwareKeyboardFilesResult.cause
            )
          );
          dispatch(CatalogAppActions.updatePhase('init'));
          await dispatch(storageActionsThunk.searchKeyboardsForCatalog());
          return;
        }
        dispatch(
          StorageActions.updateBuildableFirmwareKeyboardFiles(
            fetchBuildableFirmwareKeyboardFilesResult.value
          )
        );

        const fetchBuildableFirmwareKeymapFilesResult =
          await storage.instance!.fetchBuildableFirmwareFiles(
            definitionId,
            'keymap'
          );
        if (isError(fetchBuildableFirmwareKeymapFilesResult)) {
          console.error(fetchBuildableFirmwareKeymapFilesResult.cause);
          dispatch(
            NotificationActions.addError(
              fetchBuildableFirmwareKeymapFilesResult.error,
              fetchBuildableFirmwareKeymapFilesResult.cause
            )
          );
          dispatch(CatalogAppActions.updatePhase('init'));
          await dispatch(storageActionsThunk.searchKeyboardsForCatalog());
          return;
        }
        dispatch(
          StorageActions.updateBuildableFirmwareKeymapFiles(
            fetchBuildableFirmwareKeymapFilesResult.value
          )
        );

        const fetchFirmwareBuildingTasksResult =
          await storage.instance!.fetchFirmwareBuildingTasks(definitionId);
        if (isError(fetchFirmwareBuildingTasksResult)) {
          console.error(fetchFirmwareBuildingTasksResult.cause);
          dispatch(
            NotificationActions.addError(
              fetchFirmwareBuildingTasksResult.error,
              fetchFirmwareBuildingTasksResult.cause
            )
          );
          dispatch(CatalogAppActions.updatePhase('init'));
          await dispatch(storageActionsThunk.searchKeyboardsForCatalog());
          return;
        }
        dispatch(
          StorageActions.updateFirmwareBuildingTasks(
            fetchFirmwareBuildingTasksResult.value
          )
        );

        dispatch(
          LayoutOptionsActions.initSelectedOptions(
            keyboardDefinition.layouts.labels
              ? keyboardDefinition.layouts.labels
              : []
          )
        );
        await dispatch(
          storageActionsThunk.fetchSharedKeymaps(
            keyboardDefinitionDocument,
            false
          )
        );
        const fetchKeyboardsCreatedBySameAuthorResult =
          await storage.instance!.fetchKeyboardsCreatedBySameAuthor(
            keyboardDefinitionDocument
          );
        if (isError(fetchKeyboardsCreatedBySameAuthorResult)) {
          dispatch(
            NotificationActions.addError(
              fetchKeyboardsCreatedBySameAuthorResult.error,
              fetchKeyboardsCreatedBySameAuthorResult.cause
            )
          );
          dispatch(CatalogAppActions.updatePhase('init'));
          await dispatch(storageActionsThunk.searchKeyboardsForCatalog());
          return;
        }
        dispatch(
          StorageActions.updateSameAuthorKeyboardDefinitionDocuments(
            fetchKeyboardsCreatedBySameAuthorResult.value.documents
          )
        );

        dispatch(CatalogAppActions.updatePhase(nextPhase));
      } else {
        dispatch(NotificationActions.addWarn('No such keyboard.'));
        dispatch(CatalogAppActions.updatePhase('init'));
      }
    },

  updateKeyboardDefinitionForCatalog:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      dispatch(KeyboardsAppActions.updatePhase('processing'));
      const { storage, keyboards, entities } = getState();
      const definitionDoc = entities.keyboardDefinitionDocument;
      const features = keyboards.editdefinition.features;
      const description = keyboards.editdefinition.description;
      const stores = keyboards.editdefinition.stores;
      const websiteUrl = keyboards.editdefinition.websiteUrl;
      const additionalDescriptions =
        keyboards.editdefinition.additionalDescriptions;
      const result =
        await storage.instance!.updateKeyboardDefinitionDocumentForCatalog(
          definitionDoc!.id,
          features,
          description,
          stores,
          websiteUrl,
          additionalDescriptions
        );
      if (isSuccessful(result)) {
        dispatch(
          NotificationActions.addSuccess(
            'Updating the keyboard definition succeeded.'
          )
        );
        dispatch(
          await storageActionsThunk.fetchKeyboardDefinitionById(
            definitionDoc!.id,
            'catalog'
          )
        );
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    },

  uploadKeyboardCatalogImage:
    (definitionId: string, file: File): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      dispatch(KeyboardsEditDefinitionActions.updateMainImageUploading(true));
      dispatch(KeyboardsEditDefinitionActions.updateMainImageUploadedRate(0));
      const { storage } = getState();
      const result = await storage.instance!.uploadKeyboardCatalogMainImage(
        definitionId,
        file,
        (uploadedRate) =>
          dispatch(
            KeyboardsEditDefinitionActions.updateMainImageUploadedRate(
              uploadedRate
            )
          )
      );
      if (isSuccessful(result)) {
        dispatch(KeyboardsAppActions.updatePhase('processing'));
        setTimeout(async () => {
          dispatch(
            KeyboardsEditDefinitionActions.updateMainImageUploadedRate(0)
          );
          dispatch(
            KeyboardsEditDefinitionActions.updateMainImageUploading(false)
          );
          dispatch(
            await storageActionsThunk.fetchKeyboardDefinitionById(
              definitionId,
              'catalog'
            )
          );
        }, 3000);
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    },

  uploadFirmware:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      dispatch(KeyboardsAppActions.updatePhase('processing'));
      const { storage, keyboards, entities } = getState();
      const firmwareFile = keyboards.editdefinition.firmwareFile!;
      const firmwareName = keyboards.editdefinition.firmwareName;
      const firmwareDescription = keyboards.editdefinition.firmwareDescription;
      const firmwareSourceCodeUrl =
        keyboards.editdefinition.firmwareSourceCodeUrl;
      const flashSupport = keyboards.editdefinition.flashSupport;
      const defaultBootloaderType =
        keyboards.editdefinition.defaultBootloaderType;
      const definitionDocument = entities.keyboardDefinitionDocument!;
      const keyboardName = definitionDocument.name;
      const result = await storage.instance!.uploadFirmware(
        definitionDocument.id,
        firmwareFile,
        firmwareName,
        firmwareDescription,
        firmwareSourceCodeUrl,
        flashSupport,
        defaultBootloaderType,
        keyboardName
      );
      if (isSuccessful(result)) {
        dispatch(KeyboardsEditDefinitionActions.clearFirmwareForm());
        await dispatch(
          storageActionsThunk.fetchKeyboardDefinitionById(
            definitionDocument.id,
            'firmware'
          )
        );
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    },

  fetchFirmwareFileBlob:
    (
      firmwareFilePath: string,
      // eslint-disable-next-line no-unused-vars
      callback: (blob: any) => void
    ): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, entities } = getState();
      const definitionDocument = entities.keyboardDefinitionDocument!;
      const result = await storage.instance!.fetchFirmwareFileBlob(
        definitionDocument.id,
        firmwareFilePath,
        'download'
      );
      if (isSuccessful(result)) {
        callback(result.value.blob);
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    },

  deleteFirmware:
    (firmware: IFirmware): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      dispatch(KeyboardsAppActions.updatePhase('processing'));
      const { entities, storage } = getState();
      const definitionDocument = entities.keyboardDefinitionDocument!;
      const result = await storage.instance!.deleteFirmware(
        definitionDocument.id,
        firmware
      );
      if (isSuccessful(result)) {
        await dispatch(
          storageActionsThunk.fetchKeyboardDefinitionById(
            definitionDocument.id,
            'firmware'
          )
        );
      } else {
        console.error(result.error);
        dispatch(NotificationActions.addError(result.error));
      }
    },

  updateFirmware:
    (
      firmware: IFirmware,
      name: string,
      description: string,
      sourceCodeUrl: string,
      flashSupport: boolean,
      defaultBootloaderType: IBootloaderType
    ): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      dispatch(KeyboardsAppActions.updatePhase('processing'));
      const { entities, storage } = getState();
      const definitionDocument = entities.keyboardDefinitionDocument!;
      const result = await storage.instance!.updateFirmware(
        definitionDocument.id,
        firmware,
        name,
        description,
        sourceCodeUrl,
        flashSupport,
        defaultBootloaderType
      );
      if (isSuccessful(result)) {
        await dispatch(
          storageActionsThunk.fetchKeyboardDefinitionById(
            definitionDocument.id,
            'firmware'
          )
        );
      } else {
        console.error(result.error);
        dispatch(NotificationActions.addError(result.error));
      }
    },

  uploadKeyboardCatalogSubImage:
    (definitionId: string, file: File): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, entities } = getState();
      if (entities.keyboardDefinitionDocument!.subImages.length === 3) {
        dispatch(
          NotificationActions.addWarn('The number of Sub Images are until 3.')
        );
        return;
      }
      dispatch(KeyboardsEditDefinitionActions.updateSubImageUploading(true));
      dispatch(KeyboardsEditDefinitionActions.updateSubImageUploadedRate(0));
      const result = await storage.instance!.uploadKeyboardCatalogSubImage(
        definitionId,
        file,
        (uploadedRate) =>
          dispatch(
            KeyboardsEditDefinitionActions.updateSubImageUploadedRate(
              uploadedRate
            )
          )
      );
      if (isSuccessful(result)) {
        dispatch(KeyboardsAppActions.updatePhase('processing'));
        dispatch(KeyboardsEditDefinitionActions.updateSubImageUploadedRate(0));
        dispatch(KeyboardsEditDefinitionActions.updateSubImageUploading(false));
        dispatch(
          await storageActionsThunk.fetchKeyboardDefinitionById(
            definitionId,
            'catalog'
          )
        );
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    },

  deleteKeyboardCatalogSubImage:
    (definitionId: string, subImageIndex: number): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      dispatch(KeyboardsAppActions.updatePhase('processing'));
      const { storage } = getState();
      const result = await storage.instance!.deleteKeyboardCatalogSubImage(
        definitionId,
        subImageIndex
      );
      if (isSuccessful(result)) {
        dispatch(
          await storageActionsThunk.fetchKeyboardDefinitionById(
            definitionId,
            'catalog'
          )
        );
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    },

  fetchMyOrganizations:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const result = await storage.instance!.fetchMyOrganizations();
      if (isSuccessful(result)) {
        dispatch(
          StorageActions.updateOrganizationMap(result.value.organizationMap)
        );
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    },

  fetchAllOrganizations:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const result = await storage.instance!.fetchAllOrganizations();
      if (isSuccessful(result)) {
        dispatch(
          StorageActions.updateOrganizationMap(result.value.organizationMap)
        );
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    },

  updateBuildableFirmware:
    (
      definitionId: string,
      options: {
        enabled?: boolean;
        defaultBootloaderType?: IBootloaderType;
        qmkFirmwareVersion?: IBuildableFirmwareQmkFirmwareVersion;
        keyboardDirectoryName?: string;
      }
    ): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();

      // Validation
      if (
        options.keyboardDirectoryName &&
        !options.keyboardDirectoryName.match(/^[a-zA-Z0-9-_]+$/)
      ) {
        dispatch(
          NotificationActions.addError('Invalid keyboard directory name.')
        );
        return;
      }

      const result = await storage.instance!.updateBuildableFirmware(
        definitionId,
        options
      );
      if (isError(result)) {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
        return;
      }
      dispatch(StorageActions.updateBuildableFirmware(result.value));
      dispatch(
        KeyboardsEditDefinitionActions.updateBuildableFirmwareFile(null, null)
      );
      dispatch(NotificationActions.addSuccess('Updated successfully.'));
    },

  updateBuildableFirmwareFile:
    (
      definitionId: string,
      file: IBuildableFirmwareFile,
      type: IBuildableFirmwareFileType
    ): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();

      const result = await storage.instance!.updateBuildableFirmwareFile(
        definitionId,
        file,
        type
      );

      if (isError(result)) {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
        return;
      }

      const fetchBuildableFirmwareFilesResult =
        await storage.instance!.fetchBuildableFirmwareFiles(definitionId, type);
      if (isError(fetchBuildableFirmwareFilesResult)) {
        console.error(fetchBuildableFirmwareFilesResult.cause);
        dispatch(
          NotificationActions.addError(
            fetchBuildableFirmwareFilesResult.error,
            fetchBuildableFirmwareFilesResult.cause
          )
        );
        return;
      }

      dispatch(NotificationActions.addSuccess('Updated successfully.'));

      switch (type) {
        case 'keyboard':
          dispatch(
            StorageActions.updateBuildableFirmwareKeyboardFiles(
              fetchBuildableFirmwareFilesResult.value
            )
          );
          break;
        case 'keymap':
          dispatch(
            StorageActions.updateBuildableFirmwareKeymapFiles(
              fetchBuildableFirmwareFilesResult.value
            )
          );
          break;
      }
    },

  createNewFirmwareKeyboardFile:
    (definitionId: string, fileName: string): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();

      const result = await storage.instance!.createBuildableFirmwareFile(
        definitionId,
        'keyboard',
        fileName
      );
      if (isError(result)) {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
        return;
      }

      const fetchBuildableFirmwareKeyboardFilesResult =
        await storage.instance!.fetchBuildableFirmwareFiles(
          definitionId,
          'keyboard'
        );
      if (isError(fetchBuildableFirmwareKeyboardFilesResult)) {
        console.error(fetchBuildableFirmwareKeyboardFilesResult.cause);
        dispatch(
          NotificationActions.addError(
            fetchBuildableFirmwareKeyboardFilesResult.error,
            fetchBuildableFirmwareKeyboardFilesResult.cause
          )
        );
        return;
      }

      dispatch(
        StorageActions.updateBuildableFirmwareKeyboardFiles(
          fetchBuildableFirmwareKeyboardFilesResult.value
        )
      );
    },

  createNewFirmwareKeymapFile:
    (definitionId: string, fileName: string): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();

      const result = await storage.instance!.createBuildableFirmwareFile(
        definitionId,
        'keymap',
        fileName
      );
      if (isError(result)) {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
        return;
      }

      const fetchBuildableFirmwareKeymapFilesResult =
        await storage.instance!.fetchBuildableFirmwareFiles(
          definitionId,
          'keymap'
        );
      if (isError(fetchBuildableFirmwareKeymapFilesResult)) {
        console.error(fetchBuildableFirmwareKeymapFilesResult.cause);
        dispatch(
          NotificationActions.addError(
            fetchBuildableFirmwareKeymapFilesResult.error,
            fetchBuildableFirmwareKeymapFilesResult.cause
          )
        );
        return;
      }

      dispatch(
        StorageActions.updateBuildableFirmwareKeymapFiles(
          fetchBuildableFirmwareKeymapFilesResult.value
        )
      );
    },

  deleteBuildableFirmwareFile:
    (
      definitionId: string,
      file: IBuildableFirmwareFile,
      type: IBuildableFirmwareFileType
    ): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();

      const result = await storage.instance!.deleteBuildableFirmwareFile(
        definitionId,
        file,
        type
      );

      if (isError(result)) {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
        return;
      }

      const fetchBuildableFirmwareFilesResult =
        await storage.instance!.fetchBuildableFirmwareFiles(definitionId, type);
      if (isError(fetchBuildableFirmwareFilesResult)) {
        console.error(fetchBuildableFirmwareFilesResult.cause);
        dispatch(
          NotificationActions.addError(
            fetchBuildableFirmwareFilesResult.error,
            fetchBuildableFirmwareFilesResult.cause
          )
        );
        return;
      }

      dispatch(NotificationActions.addSuccess('Deleted successfully.'));

      switch (type) {
        case 'keyboard':
          dispatch(
            StorageActions.updateBuildableFirmwareKeyboardFiles(
              fetchBuildableFirmwareFilesResult.value
            )
          );
          break;
        case 'keymap':
          dispatch(
            StorageActions.updateBuildableFirmwareKeymapFiles(
              fetchBuildableFirmwareFilesResult.value
            )
          );
          break;
      }

      dispatch(
        KeyboardsEditDefinitionActions.updateBuildableFirmwareFile(null, null)
      );
    },

  fetchBuiltFirmwareFileBlob:
    (
      firmwareFilePath: string,
      // eslint-disable-next-line no-unused-vars
      callback: (blob: any) => void
    ): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const result = await storage.instance!.fetchBuiltFirmwareFileBlob(
        firmwareFilePath
      );
      if (isSuccessful(result)) {
        callback(result.value.blob);
      } else {
        console.error(result.cause);
        dispatch(NotificationActions.addError(result.error, result.cause));
      }
    },
};
