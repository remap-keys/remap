import immer from 'immer';
import { WritableDraft } from 'immer/dist/internal';
import {
  ANYKEYCODEKEY_ACTIONS,
  ANYKEYCODEKEY_ADD_ANYKEY,
  ANYKEYCODEKEY_UPDATE_ANYKEY,
  APP_ACTIONS,
  APP_PACKAGE_INIT,
  APP_REMAPS_CLEAR,
  APP_REMAPS_INIT,
  APP_REMAPS_REMOVE_KEY,
  APP_REMAPS_SET_KEY,
  APP_REMAPS_SET_KEYS,
  APP_TEST_MATRIX_UPDATE,
  APP_TESTED_MATRIX_CLEAR,
  APP_UPDATE_KEYBOARD_SIZE,
  APP_UPDATE_LANG_LABEL,
  APP_UPDATE_SETUP_PHASE,
  APP_UPDATE_SIGNED_IN,
  HEADER_ACTIONS,
  HEADER_UPDATE_FLASHING,
  KEYCODEKEY_ACTIONS,
  KEYCODEKEY_CLEAR,
  KEYCODEKEY_UPDATE_DRAGGING_KEY,
  KEYCODEKEY_UPDATE_HOVER_KEY,
  KEYCODEKEY_UPDATE_SELECTED_KEY,
  KEYCODES_ACTIONS,
  KEYCODES_UPDATE_MACRO,
  KEYDIFF_ACTIONS,
  KEYDIFF_CLEAR_KEYDIFF,
  KEYDIFF_UPDATE_KEYDIFF,
  KEYMAP_ACTIONS,
  KEYMAP_TOOLBAR_ACTIONS,
  KEYMAP_TOOLBAR_TEST_MATRIX_MODE,
  APP_ENCODERS_REMAPS_INIT,
  APP_ENCODERS_REMAPS_SET_KEY,
  APP_ENCODERS_REMAPS_SET_KEYS,
  APP_ENCODERS_REMAPS_REMOVE_KEY,
  APP_ENCODERS_REMAPS_CLEAR,
  KEYMAP_UPDATE_SELECTED_LAYER,
  LAYOUT_OPTIONS_ACTIONS,
  LAYOUT_OPTIONS_INIT_SELECTED_OPTION,
  LAYOUT_OPTIONS_RESTORE_SELECTED_OPTIONS,
  LAYOUT_OPTIONS_UPDATE_SELECTED_OPTION,
  NOTIFICATION_ACTIONS,
  NOTIFICATION_ADD_ERROR,
  NOTIFICATION_ADD_INFO,
  NOTIFICATION_ADD_SUCCESS,
  NOTIFICATION_ADD_WARN,
  NOTIFICATION_REMOVE,
  KEYMAP_CLEAR_SELECTED_KEY_POSITION,
  KEYMAP_UPDATE_SELECTED_KEY_POSITION,
  APP_UPDATE_USER_INFORMATION,
  APP_UPDATE_USER_PURCHASE,
  KEYMAP_TOOLBAR_TYPING_PRACTICE_MODE,
  PRACTICE_ACTIONS,
  PRACTICE_START,
  PRACTICE_UPDATE_INPUT,
  PRACTICE_RESET,
  PRACTICE_FINISH,
  PRACTICE_UPDATE_TEXT,
  PRACTICE_UPDATE_CATEGORY,
  PRACTICE_NEXT_SENTENCE,
  PRACTICE_UPDATE_SENTENCES,
  PRACTICE_UPDATE_STATS,
  PRACTICE_RESET_STATISTICS,
} from '../actions/actions';
import {
  HID_ACTIONS,
  HID_CONNECT_KEYBOARD,
  HID_DISCONNECT_KEYBOARD,
  HID_UPDATE_BLE_MICRO_PRO,
  HID_UPDATE_ENCODERS_KEYMAPS,
  HID_UPDATE_KEYBOARD,
  HID_UPDATE_KEYBOARD_LAYER_COUNT,
  HID_UPDATE_KEYBOARD_LIST,
  HID_UPDATE_KEYMAPS,
  HID_UPDATE_MACRO_BUFFER_BYTES,
  HID_UPDATE_MACRO_MAX_BUFFER_SIZE,
  HID_UPDATE_MACRO_MAX_COUNT,
  HID_UPDATE_VIA_PROTOCOL_VERSION,
} from '../actions/hid.action';
import {
  STORAGE_ACTIONS,
  STORAGE_UPDATE_APPLIED_KEYMAPS,
  STORAGE_UPDATE_APPROVED_KEYBOARD_DEFINITION_DOCUMENTS,
  STORAGE_UPDATE_BUILDABLE_FIRMWARE,
  STORAGE_UPDATE_BUILDABLE_FIRMWARE_KEYBOARD_FILES,
  STORAGE_UPDATE_BUILDABLE_FIRMWARE_KEYMAP_FILES,
  STORAGE_UPDATE_FIRMWARE_BUILDING_TASKS,
  STORAGE_UPDATE_KEYBOARD_DEFINITION,
  STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENT,
  STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENTS,
  STORAGE_UPDATE_ORGANIZATION,
  STORAGE_UPDATE_ORGANIZATION_MAP,
  STORAGE_UPDATE_SAME_AUTHOR_KEYBOARD_DEFINITION_DOCUMENTS,
  STORAGE_UPDATE_SAVED_KEYMAPS,
  STORAGE_UPDATE_SEARCH_RESULT_KEYBOARD_DEFINITION_DOCUMENT,
  STORAGE_UPDATE_SEARCH_RESULT_ORGANIZATION_MAP,
  STORAGE_UPDATE_SHARED_KEYMAPS,
} from '../actions/storage.action';
import { AnyKey } from '../components/configure/keycodekey/KeycodeKey';
import { KeycodeInfo } from '../components/configure/keycodekey/KeycodeKey.container';
import { Key } from '../components/configure/keycodekey/KeyGen';
import { IKeyboard, IKeycodeCategory } from '../services/hid/Hid';
import {
  CONDITION_NOT_SELECTED,
  FirmwareCodePlace,
  IKeyboardFeatures,
  INIT_STATE,
  RootState,
} from './state';
import {
  KEYBOARDS_APP_ACTIONS,
  KEYBOARDS_APP_UPDATE_PHASE,
  KEYBOARDS_CREATE_DEFINITION_ACTIONS,
  KEYBOARDS_CREATE_DEFINITION_CLEAR,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_AGREEMENT,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_AUTHOR_TYPE,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_CONTACT_INFORMATION,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_FIRMWARE_CODE_PLACE,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_FORKED_REPOSITORY_EVIDENCE,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_FORKED_REPOSITORY_URL,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_JSON_FILENAME,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_JSON_STRING,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_KEYBOARD_DEFINITION,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_ORGANIZATION_EVIDENCE,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_ORGANIZATION_ID,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_OTHER_PLACE_HOW_TO_GET,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_OTHER_PLACE_PUBLISHER_EVIDENCE,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_OTHER_PLACE_SOURCE_CODE_EVIDENCE,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_PRODUCT_NAME,
  KEYBOARDS_CREATE_DEFINITION_UPDATE_QMK_REPOSITORY_FIRST_PULL_REQUEST_URL,
  KEYBOARDS_EDIT_DEFINITION_ACTIONS,
  KEYBOARDS_EDIT_DEFINITION_ADD_ADDITIONAL_DESCRIPTIONS,
  KEYBOARDS_EDIT_DEFINITION_CLEAR,
  KEYBOARDS_EDIT_DEFINITION_CLEAR_FIRMWARE_FORM,
  KEYBOARDS_EDIT_DEFINITION_DELETE_ADDITIONAL_DESCRIPTIONS,
  KEYBOARDS_EDIT_DEFINITION_INIT,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_ADDITIONAL_DESCRIPTIONS,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_AGREEMENT,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_AUTHOR_TYPE,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_BUILDABLE_FIRMWARE_CODE_PARAMETERS,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_BUILDABLE_FIRMWARE_FILE,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_CONTACT_INFORMATION,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_DEFAULT_BOOTLOADER_TYPE,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_DESCRIPTION,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_FEATURE,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_FEATURES,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_FIRMWARE_CODE_PLACE,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_FIRMWARE_DESCRIPTION,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_FIRMWARE_FILE,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_FIRMWARE_NAME,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_FIRMWARE_SOURCE_CODE_URL,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_FLASH_SUPPORT,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_FORKED_REPOSITORY_EVIDENCE,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_FORKED_REPOSITORY_URL,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_JSON_FILENAME,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_JSON_STRING,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_KEYBOARD_DEFINITION,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_KEYBOARD_STATISTICS,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_MAIN_IMAGE_UPLOADED_RATE,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_MAIN_IMAGE_UPLOADING,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_ORGANIZATION_EVIDENCE,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_ORGANIZATION_ID,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_OTHER_PLACE_HOW_TO_GET,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_OTHER_PLACE_PUBLISHER_EVIDENCE,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_OTHER_PLACE_SOURCE_CODE_EVIDENCE,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_PRODUCT_NAME,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_QMK_REPOSITORY_FIRST_PULL_REQUEST_URL,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_STORES,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_SUB_IMAGE_UPLOADED_RATE,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_SUB_IMAGE_UPLOADING,
  KEYBOARDS_EDIT_DEFINITION_UPDATE_WEBSITE_URL,
} from '../actions/keyboards.actions';
import { LayoutOption } from '../components/configure/keymap/Keymap';
import {
  CATALOG_APP_ACTIONS,
  CATALOG_APP_UPDATE_PHASE,
  CATALOG_KEYBOARD_ACTIONS,
  CATALOG_KEYBOARD_CLEAR_KEYMAP,
  CATALOG_KEYBOARD_UPDATE_ENCODERS_KEYMAPS,
  CATALOG_KEYBOARD_UPDATE_KEYMAPS,
  CATALOG_KEYBOARD_UPDATE_LANG_LABEL,
  CATALOG_KEYBOARD_UPDATE_SELECTED_KEYMAP_DATA,
  CATALOG_KEYBOARD_UPDATE_SELECTED_LAYER,
  CATALOG_KEYBOARRD_UPDATE_BUILDABLE_FIRMWARE_CODE_PARAMETER_VALUES,
  CATALOG_SEARCH_ACTIONS,
  CATALOG_SEARCH_CLEAR_FEATURES,
  CATALOG_SEARCH_RESET_FEATURES,
  CATALOG_SEARCH_UPDATE_BUILD_SUPPORT,
  CATALOG_SEARCH_UPDATE_FEATURES,
  CATALOG_SEARCH_UPDATE_KEYWORD,
  CATALOG_SEARCH_UPDATE_ORGANIZATION,
} from '../actions/catalog.action';
import { META_ACTIONS, META_UPDATE } from '../actions/meta.action';
import {
  MACRO_EDITOR_ACTIONS,
  MACRO_EDITOR_CLEAR_KEY,
  MACRO_EDITOR_UPDATE_KEY,
  MACRO_EDITOR_UPDATE_MACRO,
  MACRO_EDITOR_UPDATE_MACRO_BUFFER,
  MACRO_EDITOR_UPDATE_MACRO_KEYS,
} from '../actions/macro.action';
import {
  ORGANIZATIONS_APP_ACTIONS,
  ORGANIZATIONS_APP_UPDATE_PHASE,
  ORGANIZATIONS_EDIT_ORGANIZATION_ACTIONS,
  ORGANIZATIONS_EDIT_ORGANIZATION_UPDATE_EMAIL,
  ORGANIZATIONS_EDIT_ORGANIZATION_UPDATE_ORGANIZATION_MEMBERS,
} from '../actions/organizations.actions';
import {
  FLASH_FIRMWARE_DIALOG_ACTIONS,
  FLASH_FIRMWARE_DIALOG_APPEND_LOG,
  FLASH_FIRMWARE_DIALOG_CLEAR,
  FLASH_FIRMWARE_DIALOG_UPDATE_BOOTLOADER_TYPE,
  FLASH_FIRMWARE_DIALOG_UPDATE_BUILDING_FIRMWARE_TASK,
  FLASH_FIRMWARE_DIALOG_UPDATE_FIRMWARE,
  FLASH_FIRMWARE_DIALOG_UPDATE_FIRMWARE_BLOB,
  FLASH_FIRMWARE_DIALOG_UPDATE_FLASH_MODE,
  FLASH_FIRMWARE_DIALOG_UPDATE_FLASHING,
  FLASH_FIRMWARE_DIALOG_UPDATE_KEYBOARD_NAME,
  FLASH_FIRMWARE_DIALOG_UPDATE_LOGS,
  FLASH_FIRMWARE_DIALOG_UPDATE_MODE,
  FLASH_FIRMWARE_DIALOG_UPDATE_PROGRESS_RATE,
  UPLOAD_FIRMWARE_DIALOG_ACTIONS,
  UPLOAD_FIRMWARE_DIALOG_UPDATE_FIRMWARE_FILE_BUFFER,
  UPLOAD_FIRMWARE_DIALOG_UPDATE_OPEN,
} from '../actions/firmware.action';
import { MOD_LEFT } from '../services/hid/Constraints';
import {
  WORKBENCH_APP_ACTIONS,
  WORKBENCH_APP_APPEND_FILE_TO_CURRENT_PROJECT,
  WORKBENCH_APP_UPDATE_BUILDING_TASKS,
  WORKBENCH_APP_UPDATE_CURRENT_PROJECT,
  WORKBENCH_APP_UPDATE_PHASE,
  WORKBENCH_APP_UPDATE_PROJECTS,
  WORKBENCH_APP_UPDATE_SELECTED_FILE,
  WORKBENCH_APP_UPDATE_USER_PURCHASE_HISTORIES,
} from '../actions/workbench.action';

export type Action = { type: string; value: any };

const reducers = (state: RootState = INIT_STATE, action: Action) =>
  immer(state, (draft) => {
    if (action.type.startsWith(HID_ACTIONS)) {
      hidReducer(action, draft);
    } else if (action.type.startsWith(HEADER_ACTIONS)) {
      headerReducer(action, draft);
    } else if (action.type.startsWith(KEYCODES_ACTIONS)) {
      keycodesReducer(action, draft);
    } else if (action.type.startsWith(ANYKEYCODEKEY_ACTIONS)) {
      keycodeAddKeyReducer(action, draft);
    } else if (action.type.startsWith(KEYCODEKEY_ACTIONS)) {
      keycodekeyReducer(action, draft);
    } else if (action.type.startsWith(KEYDIFF_ACTIONS)) {
      keydiffReducer(action, draft);
    } else if (action.type.startsWith(KEYMAP_TOOLBAR_ACTIONS)) {
      keymapToolbarReducer(action, draft);
    } else if (action.type.startsWith(PRACTICE_ACTIONS)) {
      practiceReducer(action, draft);
    } else if (action.type.startsWith(KEYMAP_ACTIONS)) {
      keymapReducer(action, draft);
    } else if (action.type.startsWith(LAYOUT_OPTIONS_ACTIONS)) {
      layoutOptionsReducer(action, draft);
    } else if (action.type.startsWith(MACRO_EDITOR_ACTIONS)) {
      macroEditorReducer(action, draft);
    } else if (action.type.startsWith(NOTIFICATION_ACTIONS)) {
      notificationReducer(action, draft);
    } else if (action.type.startsWith(APP_ACTIONS)) {
      appReducer(action, draft);
    } else if (action.type.startsWith(STORAGE_ACTIONS)) {
      storageReducer(action, draft);
    } else if (action.type.startsWith(KEYBOARDS_APP_ACTIONS)) {
      keyboardsAppReducer(action, draft);
    } else if (action.type.startsWith(KEYBOARDS_CREATE_DEFINITION_ACTIONS)) {
      keyboardsCreateKeyboardReducer(action, draft);
    } else if (action.type.startsWith(KEYBOARDS_EDIT_DEFINITION_ACTIONS)) {
      keyboardsEditKeyboardReducer(action, draft);
    } else if (action.type.startsWith(CATALOG_SEARCH_ACTIONS)) {
      catalogSearchReducer(action, draft);
    } else if (action.type.startsWith(CATALOG_APP_ACTIONS)) {
      catalogAppReducer(action, draft);
    } else if (action.type.startsWith(CATALOG_KEYBOARD_ACTIONS)) {
      catalogKeyboardReducer(action, draft);
    } else if (action.type.startsWith(FLASH_FIRMWARE_DIALOG_ACTIONS)) {
      flashFirmwareDialogReducer(action, draft);
    } else if (action.type.startsWith(UPLOAD_FIRMWARE_DIALOG_ACTIONS)) {
      uploadFirmwareDialogReducer(action, draft);
    } else if (action.type.startsWith(META_ACTIONS)) {
      metaReducer(action, draft);
    } else if (action.type.startsWith(ORGANIZATIONS_APP_ACTIONS)) {
      organizationsAppReducer(action, draft);
    } else if (
      action.type.startsWith(ORGANIZATIONS_EDIT_ORGANIZATION_ACTIONS)
    ) {
      organizationsEditOrganizationReducer(action, draft);
    } else if (action.type.startsWith(WORKBENCH_APP_ACTIONS)) {
      workbenchAppReducer(action, draft);
    }
  });

const keyboardsEditKeyboardReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case KEYBOARDS_EDIT_DEFINITION_CLEAR:
      draft.keyboards.editdefinition.keyboardDefinition = null;
      draft.keyboards.editdefinition.productName = '';
      draft.keyboards.editdefinition.jsonFilename = '';
      draft.keyboards.editdefinition.jsonString = '';
      draft.keyboards.editdefinition.firmwareCodePlace = FirmwareCodePlace.qmk;
      draft.keyboards.editdefinition.qmkRepositoryFirstPullRequestUrl = '';
      draft.keyboards.editdefinition.forkedRepositoryUrl = '';
      draft.keyboards.editdefinition.forkedRepositoryEvidence = '';
      draft.keyboards.editdefinition.otherPlaceHowToGet = '';
      draft.keyboards.editdefinition.otherPlaceSourceCodeEvidence = '';
      draft.keyboards.editdefinition.otherPlacePublisherEvidence = '';
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_JSON_FILENAME:
      draft.keyboards.editdefinition.jsonFilename = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_JSON_STRING:
      draft.keyboards.editdefinition.jsonString = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_KEYBOARD_DEFINITION:
      draft.keyboards.editdefinition.keyboardDefinition = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_PRODUCT_NAME:
      draft.keyboards.editdefinition.productName = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_INIT:
      draft.keyboards.editdefinition.keyboardDefinition = JSON.parse(
        action.value.json
      );
      draft.keyboards.editdefinition.productName = action.value.productName;
      draft.keyboards.editdefinition.jsonFilename = '';
      draft.keyboards.editdefinition.jsonString = action.value.json;
      draft.keyboards.editdefinition.firmwareCodePlace =
        action.value.firmwareCodePlace;
      draft.keyboards.editdefinition.qmkRepositoryFirstPullRequestUrl =
        action.value.qmkRepositoryFirstPullRequestUrl;
      draft.keyboards.editdefinition.forkedRepositoryUrl =
        action.value.forkedRepositoryUrl;
      draft.keyboards.editdefinition.forkedRepositoryEvidence =
        action.value.forkedRepositoryEvidence;
      draft.keyboards.editdefinition.otherPlaceHowToGet =
        action.value.otherPlaceHowToGet;
      draft.keyboards.editdefinition.otherPlaceSourceCodeEvidence =
        action.value.otherPlaceSourceCodeEvidence;
      draft.keyboards.editdefinition.otherPlacePublisherEvidence =
        action.value.otherPlacePublisherEvidence;
      draft.keyboards.editdefinition.contactInformation =
        action.value.contactInformation;
      draft.keyboards.editdefinition.organizationEvidence =
        action.value.organizationEvidence;
      draft.keyboards.editdefinition.organizationId =
        action.value.organizationId;
      draft.keyboards.editdefinition.authorType = action.value.authorType;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_AGREEMENT:
      draft.keyboards.editdefinition.agreement = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_FIRMWARE_CODE_PLACE:
      draft.keyboards.editdefinition.firmwareCodePlace = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_FORKED_REPOSITORY_URL:
      draft.keyboards.editdefinition.forkedRepositoryUrl = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_FORKED_REPOSITORY_EVIDENCE:
      draft.keyboards.editdefinition.forkedRepositoryEvidence = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_OTHER_PLACE_HOW_TO_GET:
      draft.keyboards.editdefinition.otherPlaceHowToGet = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_OTHER_PLACE_SOURCE_CODE_EVIDENCE:
      draft.keyboards.editdefinition.otherPlaceSourceCodeEvidence =
        action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_OTHER_PLACE_PUBLISHER_EVIDENCE:
      draft.keyboards.editdefinition.otherPlacePublisherEvidence = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_QMK_REPOSITORY_FIRST_PULL_REQUEST_URL:
      draft.keyboards.editdefinition.qmkRepositoryFirstPullRequestUrl =
        action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_FEATURES:
      draft.keyboards.editdefinition.features = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_FEATURE: {
      const newFeatures = [...draft.keyboards.editdefinition.features];
      const targetFeatures = action.value.targetFeatures;
      const value = action.value.value;
      targetFeatures.forEach((x: IKeyboardFeatures) => {
        const index = newFeatures.indexOf(x);
        if (index !== -1) {
          newFeatures.splice(index, 1);
        }
      });
      if (value !== CONDITION_NOT_SELECTED) {
        newFeatures.push(value);
      }
      draft.keyboards.editdefinition.features = newFeatures;
      break;
    }
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_MAIN_IMAGE_UPLOADED_RATE:
      draft.keyboards.editdefinition.mainImageUploadedRate = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_MAIN_IMAGE_UPLOADING:
      draft.keyboards.editdefinition.mainImageUploading = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_SUB_IMAGE_UPLOADED_RATE:
      draft.keyboards.editdefinition.subImageUploadedRate = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_SUB_IMAGE_UPLOADING:
      draft.keyboards.editdefinition.subImageUploading = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_DESCRIPTION:
      draft.keyboards.editdefinition.description = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_STORES:
      draft.keyboards.editdefinition.stores = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_WEBSITE_URL:
      draft.keyboards.editdefinition.websiteUrl = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_ADDITIONAL_DESCRIPTIONS:
      draft.keyboards.editdefinition.additionalDescriptions = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_ADD_ADDITIONAL_DESCRIPTIONS:
      draft.keyboards.editdefinition.additionalDescriptions = [
        ...draft.keyboards.editdefinition.additionalDescriptions,
        action.value,
      ];
      break;
    case KEYBOARDS_EDIT_DEFINITION_DELETE_ADDITIONAL_DESCRIPTIONS:
      draft.keyboards.editdefinition.additionalDescriptions =
        draft.keyboards.editdefinition.additionalDescriptions.filter(
          (_, index) => index !== action.value
        );
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_CONTACT_INFORMATION:
      draft.keyboards.editdefinition.contactInformation = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_FIRMWARE_NAME:
      draft.keyboards.editdefinition.firmwareName = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_FIRMWARE_FILE:
      draft.keyboards.editdefinition.firmwareFile = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_FIRMWARE_DESCRIPTION:
      draft.keyboards.editdefinition.firmwareDescription = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_FIRMWARE_SOURCE_CODE_URL:
      draft.keyboards.editdefinition.firmwareSourceCodeUrl = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_CLEAR_FIRMWARE_FORM:
      draft.keyboards.editdefinition.firmwareFile = null;
      draft.keyboards.editdefinition.firmwareName = '';
      draft.keyboards.editdefinition.firmwareDescription = '';
      draft.keyboards.editdefinition.firmwareSourceCodeUrl = '';
      draft.keyboards.editdefinition.flashSupport = false;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_FLASH_SUPPORT:
      draft.keyboards.editdefinition.flashSupport = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_DEFAULT_BOOTLOADER_TYPE:
      draft.keyboards.editdefinition.defaultBootloaderType = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_ORGANIZATION_EVIDENCE:
      draft.keyboards.editdefinition.organizationEvidence = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_ORGANIZATION_ID:
      draft.keyboards.editdefinition.organizationId = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_AUTHOR_TYPE:
      draft.keyboards.editdefinition.authorType = action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_BUILDABLE_FIRMWARE_FILE:
      draft.keyboards.editdefinition.buildableFirmwareFile = action.value.file;
      draft.keyboards.editdefinition.buildableFirmwareFileType =
        action.value.type;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_BUILDABLE_FIRMWARE_CODE_PARAMETERS:
      draft.keyboards.editdefinition.buildableFirmwareCodeParameters =
        action.value;
      break;
    case KEYBOARDS_EDIT_DEFINITION_UPDATE_KEYBOARD_STATISTICS:
      draft.keyboards.editdefinition.keyboardStatistics = action.value;
      break;
  }
};

const keyboardsCreateKeyboardReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case KEYBOARDS_CREATE_DEFINITION_CLEAR:
      draft.keyboards.createdefinition.keyboardDefinition = null;
      draft.keyboards.createdefinition.productName = '';
      draft.keyboards.createdefinition.jsonFilename = '';
      draft.keyboards.createdefinition.jsonString = '';
      draft.keyboards.createdefinition.firmwareCodePlace =
        FirmwareCodePlace.qmk;
      draft.keyboards.createdefinition.qmkRepositoryFirstPullRequestUrl = '';
      draft.keyboards.createdefinition.forkedRepositoryUrl = '';
      draft.keyboards.createdefinition.forkedRepositoryEvidence = '';
      draft.keyboards.createdefinition.otherPlaceHowToGet = '';
      draft.keyboards.createdefinition.otherPlaceSourceCodeEvidence = '';
      draft.keyboards.createdefinition.otherPlacePublisherEvidence = '';
      draft.keyboards.createdefinition.authorType = 'individual';
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_JSON_FILENAME:
      draft.keyboards.createdefinition.jsonFilename = action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_JSON_STRING:
      draft.keyboards.createdefinition.jsonString = action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_KEYBOARD_DEFINITION:
      draft.keyboards.createdefinition.keyboardDefinition = action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_PRODUCT_NAME:
      draft.keyboards.createdefinition.productName = action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_AGREEMENT:
      draft.keyboards.createdefinition.agreement = action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_FIRMWARE_CODE_PLACE:
      draft.keyboards.createdefinition.firmwareCodePlace = action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_FORKED_REPOSITORY_URL:
      draft.keyboards.createdefinition.forkedRepositoryUrl = action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_FORKED_REPOSITORY_EVIDENCE:
      draft.keyboards.createdefinition.forkedRepositoryEvidence = action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_OTHER_PLACE_HOW_TO_GET:
      draft.keyboards.createdefinition.otherPlaceHowToGet = action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_OTHER_PLACE_SOURCE_CODE_EVIDENCE:
      draft.keyboards.createdefinition.otherPlaceSourceCodeEvidence =
        action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_OTHER_PLACE_PUBLISHER_EVIDENCE:
      draft.keyboards.createdefinition.otherPlacePublisherEvidence =
        action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_QMK_REPOSITORY_FIRST_PULL_REQUEST_URL:
      draft.keyboards.createdefinition.qmkRepositoryFirstPullRequestUrl =
        action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_CONTACT_INFORMATION:
      draft.keyboards.createdefinition.contactInformation = action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_AUTHOR_TYPE:
      draft.keyboards.createdefinition.authorType = action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_ORGANIZATION_ID:
      draft.keyboards.createdefinition.organizationId = action.value;
      break;
    case KEYBOARDS_CREATE_DEFINITION_UPDATE_ORGANIZATION_EVIDENCE:
      draft.keyboards.createdefinition.organizationEvidence = action.value;
      break;
  }
};

const keyboardsAppReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case KEYBOARDS_APP_UPDATE_PHASE: {
      draft.keyboards.app.phase = action.value;
      break;
    }
  }
};

const storageReducer = (action: Action, draft: WritableDraft<RootState>) => {
  switch (action.type) {
    case STORAGE_UPDATE_KEYBOARD_DEFINITION: {
      draft.entities.keyboardDefinition = action.value;
      break;
    }
    case STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENTS: {
      draft.entities.keyboardDefinitionDocuments = action.value;
      break;
    }
    case STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENT: {
      draft.entities.keyboardDefinitionDocument = action.value;
      break;
    }
    case STORAGE_UPDATE_SAVED_KEYMAPS: {
      draft.entities.savedKeymaps = action.value;
      break;
    }
    case STORAGE_UPDATE_SHARED_KEYMAPS: {
      draft.entities.sharedKeymaps = action.value;
      break;
    }
    case STORAGE_UPDATE_APPLIED_KEYMAPS: {
      draft.entities.appliedKeymaps = action.value;
      break;
    }
    case STORAGE_UPDATE_SEARCH_RESULT_KEYBOARD_DEFINITION_DOCUMENT: {
      draft.entities.searchResultKeyboardDocuments = action.value;
      break;
    }
    case STORAGE_UPDATE_SAME_AUTHOR_KEYBOARD_DEFINITION_DOCUMENTS: {
      draft.entities.sameAuthorKeyboardDocuments = action.value;
      break;
    }
    case STORAGE_UPDATE_SEARCH_RESULT_ORGANIZATION_MAP: {
      draft.entities.searchResultOrganizationMap = action.value;
      break;
    }
    case STORAGE_UPDATE_ORGANIZATION: {
      draft.entities.organization = action.value;
      break;
    }
    case STORAGE_UPDATE_ORGANIZATION_MAP: {
      draft.entities.organizationMap = action.value;
      break;
    }
    case STORAGE_UPDATE_BUILDABLE_FIRMWARE: {
      draft.entities.buildableFirmware = action.value;
      break;
    }
    case STORAGE_UPDATE_BUILDABLE_FIRMWARE_KEYBOARD_FILES: {
      draft.entities.buildableFirmwareKeyboardFiles = action.value;
      break;
    }
    case STORAGE_UPDATE_BUILDABLE_FIRMWARE_KEYMAP_FILES: {
      draft.entities.buildableFirmwareKeymapFiles = action.value;
      break;
    }
    case STORAGE_UPDATE_FIRMWARE_BUILDING_TASKS: {
      draft.entities.firmwareBuildingTasks = action.value;
      break;
    }
    case STORAGE_UPDATE_APPROVED_KEYBOARD_DEFINITION_DOCUMENTS: {
      draft.entities.approvedKeyboardDefinitionDocuments = action.value;
      break;
    }
  }
};

const appReducer = (action: Action, draft: WritableDraft<RootState>) => {
  switch (action.type) {
    case APP_UPDATE_SETUP_PHASE: {
      draft.app.setupPhase = action.value;
      break;
    }
    case APP_REMAPS_INIT: {
      draft.app.remaps = action.value;
      break;
    }
    case APP_REMAPS_SET_KEY: {
      const layer = action.value.layer;
      draft.app.remaps[layer][action.value.pos] = action.value.keymap;
      break;
    }
    case APP_REMAPS_SET_KEYS: {
      draft.app.remaps = action.value;
      break;
    }
    case APP_REMAPS_REMOVE_KEY: {
      const layer = action.value.layer;
      const pos = action.value.pos;
      delete draft.app.remaps[layer][pos];
      break;
    }
    case APP_REMAPS_CLEAR: {
      draft.app.remaps = [];
      break;
    }
    case APP_ENCODERS_REMAPS_INIT: {
      draft.app.encodersRemaps = action.value;
      break;
    }
    case APP_ENCODERS_REMAPS_SET_KEY: {
      const layer = action.value.layer;
      const encoderId = action.value.id;
      if (draft.app.encodersRemaps[layer][encoderId] === undefined) {
        draft.app.encodersRemaps[layer][encoderId] = {};
      }
      action.value.keySwitchOperation === 'cw'
        ? (draft.app.encodersRemaps[layer][encoderId].clockwise =
            action.value.keymap)
        : (draft.app.encodersRemaps[layer][encoderId].counterclockwise =
            action.value.keymap);
      break;
    }
    case APP_ENCODERS_REMAPS_SET_KEYS: {
      draft.app.encodersRemaps = action.value;
      break;
    }
    case APP_ENCODERS_REMAPS_REMOVE_KEY: {
      const layer = action.value.layer;
      const encoderId = action.value.id;
      action.value.keySwitchOperation === 'cw'
        ? (draft.app.encodersRemaps[layer][encoderId].clockwise = undefined)
        : (draft.app.encodersRemaps[layer][encoderId].counterclockwise =
            undefined);
      if (
        !draft.app.encodersRemaps[layer][encoderId].clockwise &&
        !draft.app.encodersRemaps[layer][encoderId].counterclockwise
      ) {
        delete draft.app.encodersRemaps[layer][encoderId];
      }
      break;
    }
    case APP_ENCODERS_REMAPS_CLEAR: {
      draft.app.encodersRemaps = [];
      break;
    }
    case APP_PACKAGE_INIT: {
      draft.app.package.name = action.value.name;
      draft.app.package.version = action.value.version;
      break;
    }
    case APP_UPDATE_KEYBOARD_SIZE: {
      draft.app.keyboardHeight = action.value.height;
      draft.app.keyboardWidth = action.value.width;
      break;
    }
    case APP_UPDATE_LANG_LABEL: {
      draft.app.labelLang = action.value;
      // Save the value to storage
      localStorage.setItem('LabelLang', action.value);
      break;
    }
    case APP_UPDATE_SIGNED_IN: {
      draft.app.signedIn = action.value;
      break;
    }
    case APP_TESTED_MATRIX_CLEAR: {
      draft.app.testedMatrix = [];
      break;
    }
    case APP_TEST_MATRIX_UPDATE: {
      draft.app.currentTestMatrix = action.value;

      const testedMatrix = draft.app.testedMatrix;
      for (let key of action.value) {
        if (testedMatrix.indexOf(key) < 0) {
          draft.app.testedMatrix = [...testedMatrix, key];
        }
      }
      break;
    }
    case APP_UPDATE_USER_INFORMATION: {
      draft.app.user.information = action.value;
      break;
    }
    case APP_UPDATE_USER_PURCHASE: {
      draft.app.user.purchase = action.value;
      break;
    }
  }
};

const hidReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case HID_CONNECT_KEYBOARD: {
      const keyboard: IKeyboard = action.value.keyboard;
      draft.entities.keyboards.push(keyboard);
      break;
    }
    case HID_DISCONNECT_KEYBOARD: {
      const keyboard: IKeyboard = action.value.keyboard;
      draft.entities.keyboards = draft.entities.keyboards.filter((item) => {
        return !item.isSameDevice(keyboard);
      });
      break;
    }
    case HID_UPDATE_KEYBOARD: {
      const keyboard: IKeyboard = action.value.keyboard;
      draft.entities.keyboard = keyboard;
      break;
    }
    case HID_UPDATE_KEYBOARD_LAYER_COUNT: {
      const layerCount = action.value.layerCount;
      draft.entities.device.layerCount = layerCount;
      break;
    }
    case HID_UPDATE_KEYBOARD_LIST: {
      const keyboards: IKeyboard[] = action.value.keyboards;
      draft.entities.keyboards = keyboards;
      break;
    }
    case HID_UPDATE_KEYMAPS: {
      draft.entities.device.keymaps = action.value.keymaps;
      break;
    }
    case HID_UPDATE_BLE_MICRO_PRO: {
      draft.entities.device.bleMicroPro = action.value;
      break;
    }
    case HID_UPDATE_MACRO_BUFFER_BYTES: {
      draft.entities.device.macro.bufferBytes = action.value;
      break;
    }
    case HID_UPDATE_MACRO_MAX_BUFFER_SIZE: {
      draft.entities.device.macro.maxBufferSize = action.value;
      break;
    }
    case HID_UPDATE_MACRO_MAX_COUNT: {
      draft.entities.device.macro.maxCount = action.value;
      break;
    }
    case HID_UPDATE_VIA_PROTOCOL_VERSION: {
      draft.entities.device.viaProtocolVersion = action.value;
      break;
    }
    case HID_UPDATE_ENCODERS_KEYMAPS: {
      draft.entities.device.encodersKeymaps = action.value;
      break;
    }
  }
};

const keymapReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYMAP_CLEAR_SELECTED_KEY_POSITION: {
      draft.configure.keymap.selectedPos = '';
      draft.configure.keymap.selectedEncoderId = null;
      draft.configure.keymap.selectedKeySwitchOperation = 'click';
      break;
    }
    case KEYMAP_UPDATE_SELECTED_LAYER: {
      draft.configure.keymap.selectedLayer = action.value;
      break;
    }
    case KEYMAP_UPDATE_SELECTED_KEY_POSITION: {
      draft.configure.keymap.selectedPos = action.value.pos;
      draft.configure.keymap.selectedEncoderId = action.value.encoderId;
      draft.configure.keymap.selectedKeySwitchOperation =
        action.value.keySwitchOperation;
      break;
    }
  }
};

const keymapToolbarReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYMAP_TOOLBAR_TEST_MATRIX_MODE: {
      draft.configure.keymapToolbar.testMatrix = action.value;
      break;
    }
    case KEYMAP_TOOLBAR_TYPING_PRACTICE_MODE: {
      draft.configure.keymapToolbar.typingPractice = action.value;
      break;
    }
  }
};

const practiceReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case PRACTICE_START: {
      const sentences = draft.configure.practice.sentences;
      draft.configure.practice.currentText =
        sentences.length > 0 ? sentences[0] : '';
      draft.configure.practice.status = 'running';
      draft.configure.practice.stats.startTime = Date.now();
      draft.configure.practice.userInput = '';
      draft.configure.practice.currentIndex = 0;
      draft.configure.practice.errors = [];
      draft.configure.practice.accumulatedCorrectChars = 0;
      draft.configure.practice.accumulatedIncorrectChars = 0;
      break;
    }
    case PRACTICE_UPDATE_INPUT: {
      const input = action.value;
      const text = draft.configure.practice.currentText;
      draft.configure.practice.userInput = input;

      // Calculate current sentence's correct/incorrect chars
      let currentCorrectChars = 0;
      let currentIncorrectChars = 0;
      const errors = [];

      for (let i = 0; i < input.length; i++) {
        if (i < text.length) {
          if (input[i] === text[i]) {
            currentCorrectChars++;
          } else {
            currentIncorrectChars++;
            errors.push({
              index: i,
              expected: text[i],
              actual: input[i],
            });
          }
        }
      }

      // Calculate total stats (accumulated + current sentence)
      const totalCorrectChars =
        draft.configure.practice.accumulatedCorrectChars + currentCorrectChars;
      const totalIncorrectChars =
        draft.configure.practice.accumulatedIncorrectChars +
        currentIncorrectChars;

      draft.configure.practice.currentIndex = input.length;
      draft.configure.practice.errors = errors;
      draft.configure.practice.stats.correctChars = totalCorrectChars;
      draft.configure.practice.stats.incorrectChars = totalIncorrectChars;
      draft.configure.practice.stats.totalChars =
        totalCorrectChars + totalIncorrectChars;

      // Calculate CPS (characters per second) and accuracy
      if (draft.configure.practice.stats.startTime) {
        const elapsedSeconds =
          (Date.now() - draft.configure.practice.stats.startTime) / 1000;
        draft.configure.practice.stats.cps =
          elapsedSeconds > 0
            ? Math.round((totalCorrectChars / elapsedSeconds) * 10) / 10
            : 0;
      }

      const totalTyped = totalCorrectChars + totalIncorrectChars;
      draft.configure.practice.stats.accuracy =
        totalTyped > 0
          ? Math.round((totalCorrectChars / totalTyped) * 100)
          : 100;

      // Check if finished
      if (
        input.length >= text.length &&
        draft.configure.practice.status === 'running'
      ) {
        draft.configure.practice.status = 'finished';
        draft.configure.practice.stats.endTime = Date.now();
      }
      break;
    }
    case PRACTICE_RESET: {
      draft.configure.practice.status = 'idle';
      draft.configure.practice.currentSentenceIndex = 0;
      draft.configure.practice.currentText = '';
      draft.configure.practice.userInput = '';
      draft.configure.practice.currentIndex = 0;
      draft.configure.practice.errors = [];
      draft.configure.practice.stats = {
        correctChars: 0,
        incorrectChars: 0,
        totalChars: 0,
        startTime: null,
        endTime: null,
        cps: 0,
        accuracy: 100,
      };
      draft.configure.practice.accumulatedCorrectChars = 0;
      draft.configure.practice.accumulatedIncorrectChars = 0;
      break;
    }
    case PRACTICE_FINISH: {
      draft.configure.practice.status = 'finished';
      draft.configure.practice.stats.endTime = Date.now();
      break;
    }
    case PRACTICE_UPDATE_TEXT: {
      draft.configure.practice.currentText = action.value;
      draft.configure.practice.userInput = '';
      draft.configure.practice.currentIndex = 0;
      draft.configure.practice.errors = [];
      draft.configure.practice.status = 'idle';
      draft.configure.practice.stats = {
        correctChars: 0,
        incorrectChars: 0,
        totalChars: 0,
        startTime: null,
        endTime: null,
        cps: 0,
        accuracy: 100,
      };
      draft.configure.practice.accumulatedCorrectChars = 0;
      draft.configure.practice.accumulatedIncorrectChars = 0;
      break;
    }
    case PRACTICE_UPDATE_CATEGORY: {
      draft.configure.practice.currentCategory = action.value;
      break;
    }
    case PRACTICE_NEXT_SENTENCE: {
      const currentIndex = draft.configure.practice.currentSentenceIndex;
      const sentences = draft.configure.practice.sentences;
      if (currentIndex < sentences.length - 1) {
        // Accumulate current sentence stats before moving to next
        draft.configure.practice.accumulatedCorrectChars =
          draft.configure.practice.stats.correctChars;
        draft.configure.practice.accumulatedIncorrectChars =
          draft.configure.practice.stats.incorrectChars;

        draft.configure.practice.currentSentenceIndex = currentIndex + 1;
        draft.configure.practice.currentText = sentences[currentIndex + 1];
        draft.configure.practice.userInput = '';
        draft.configure.practice.currentIndex = 0;
        draft.configure.practice.errors = [];
        draft.configure.practice.status = 'running';
        // Keep startTime and stats intact for cumulative tracking
      }
      break;
    }
    case PRACTICE_UPDATE_SENTENCES: {
      draft.configure.practice.sentences = action.value;
      draft.configure.practice.currentSentenceIndex = 0;
      draft.configure.practice.userInput = '';
      draft.configure.practice.currentIndex = 0;
      draft.configure.practice.errors = [];
      draft.configure.practice.status = 'idle';
      draft.configure.practice.stats = {
        correctChars: 0,
        incorrectChars: 0,
        totalChars: 0,
        startTime: null,
        endTime: null,
        cps: 0,
        accuracy: 100,
      };
      draft.configure.practice.accumulatedCorrectChars = 0;
      draft.configure.practice.accumulatedIncorrectChars = 0;
      break;
    }
    case PRACTICE_UPDATE_STATS: {
      const { keyboardId, char, isCorrect } = action.value;
      if (!draft.configure.typingStats[keyboardId]) {
        draft.configure.typingStats[keyboardId] = {};
      }
      if (!draft.configure.typingStats[keyboardId][char]) {
        draft.configure.typingStats[keyboardId][char] = {
          correct: 0,
          incorrect: 0,
        };
      }
      if (isCorrect) {
        draft.configure.typingStats[keyboardId][char].correct++;
      } else {
        draft.configure.typingStats[keyboardId][char].incorrect++;
      }
      break;
    }
    case PRACTICE_RESET_STATISTICS: {
      const keyboardId = action.value;
      if (draft.configure.typingStats[keyboardId]) {
        draft.configure.typingStats[keyboardId] = {};
      }
      break;
    }
  }
};

const keycodesReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYCODES_UPDATE_MACRO: {
      const code = action.value.code;
      draft.entities.device.macros[code] = action.value.text;
      break;
    }
  }
};

const keydiffReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYDIFF_UPDATE_KEYDIFF: {
      draft.configure.keydiff.origin = action.value.origin;
      draft.configure.keydiff.destination = action.value.destination;
      break;
    }
    case KEYDIFF_CLEAR_KEYDIFF: {
      draft.configure.keydiff.origin = null;
      draft.configure.keydiff.destination = null;
      break;
    }
  }
};

const keycodeAddKeyReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  // TODO: type-safe
  switch (action.type) {
    case ANYKEYCODEKEY_ADD_ANYKEY: {
      const anyKey: AnyKey = action.value;
      const key: Key = {
        label: anyKey.label,
        meta: '',
        keymap: {
          isAny: true,
          code: anyKey.code,
          kinds: [],
          direction: MOD_LEFT,
          modifiers: [],
          keycodeInfo: new KeycodeInfo(anyKey.label, anyKey.code),
        },
      };
      draft.configure.keycodes.keys[IKeycodeCategory.ANY] = [
        ...draft.configure.keycodes.keys[IKeycodeCategory.ANY],
        key,
      ];
      break;
    }
    case ANYKEYCODEKEY_UPDATE_ANYKEY: {
      const { index, anyKey } = action.value;
      const key: Key = {
        label: anyKey.label,
        meta: '',
        keymap: {
          isAny: true,
          code: anyKey.code,
          kinds: [],
          direction: MOD_LEFT,
          modifiers: [],
          keycodeInfo: new KeycodeInfo(anyKey.label, anyKey.code),
        },
      };
      console.log(draft.configure.keycodes.keys[IKeycodeCategory.ANY]);
      draft.configure.keycodes.keys[IKeycodeCategory.ANY] =
        draft.configure.keycodes.keys[IKeycodeCategory.ANY].map((k, i) => {
          return i == index ? key : k;
        });
      console.log(draft.configure.keycodes.keys[IKeycodeCategory.ANY]);

      break;
    }
  }
};

const keycodekeyReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case KEYCODEKEY_UPDATE_DRAGGING_KEY: {
      draft.configure.keycodeKey.draggingKey = action.value;
      break;
    }
    case KEYCODEKEY_UPDATE_SELECTED_KEY: {
      draft.configure.keycodeKey.selectedKey = action.value;
      break;
    }
    case KEYCODEKEY_UPDATE_HOVER_KEY: {
      draft.configure.keycodeKey.hoverKey = action.value;
      break;
    }
    case KEYCODEKEY_CLEAR: {
      draft.configure.keycodeKey.draggingKey = null;
      draft.configure.keycodeKey.selectedKey = null;
      draft.configure.keycodeKey.hoverKey = null;
      break;
    }
  }
};

const layoutOptionsReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case LAYOUT_OPTIONS_RESTORE_SELECTED_OPTIONS: {
      draft.configure.layoutOptions.selectedOptions = action.value;
      break;
    }
    case LAYOUT_OPTIONS_UPDATE_SELECTED_OPTION: {
      const { option, optionChoice } = action.value;
      draft.configure.layoutOptions.selectedOptions =
        draft.configure.layoutOptions.selectedOptions.map(
          (value: LayoutOption) => {
            return value.option == option ? { option, optionChoice } : value;
          }
        );
      break;
    }
    case LAYOUT_OPTIONS_INIT_SELECTED_OPTION: {
      draft.configure.layoutOptions.selectedOptions = action.value;
      break;
    }
  }
};

const macroEditorReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case MACRO_EDITOR_UPDATE_KEY: {
      draft.configure.macroEditor.key = action.value;
      break;
    }
    case MACRO_EDITOR_CLEAR_KEY: {
      draft.configure.macroEditor.macroBuffer = null;
      draft.configure.macroEditor.macro = null;
      draft.configure.macroEditor.macroKeys = [];
      draft.configure.macroEditor.key = null;
      break;
    }
    case MACRO_EDITOR_UPDATE_MACRO_BUFFER: {
      draft.configure.macroEditor.macroBuffer = action.value;
      break;
    }
    case MACRO_EDITOR_UPDATE_MACRO: {
      draft.configure.macroEditor.macro = action.value;
      break;
    }
    case MACRO_EDITOR_UPDATE_MACRO_KEYS: {
      draft.configure.macroEditor.macroKeys = action.value;
      break;
    }
  }
};

const notificationReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  // TODO: type-safe
  switch (action.type) {
    case NOTIFICATION_ADD_ERROR: {
      draft.app.notifications = [
        ...draft.app.notifications,
        {
          key: Date.now().toString(),
          type: 'error',
          message: action.value.message,
        },
      ];
      break;
    }
    case NOTIFICATION_ADD_WARN: {
      draft.app.notifications = [
        ...draft.app.notifications,
        {
          key: Date.now().toString(),
          type: 'warning',
          message: action.value.message,
        },
      ];
      break;
    }
    case NOTIFICATION_ADD_INFO: {
      draft.app.notifications = [
        ...draft.app.notifications,
        {
          key: Date.now().toString(),
          type: 'info',
          message: action.value,
        },
      ];
      break;
    }
    case NOTIFICATION_ADD_SUCCESS: {
      draft.app.notifications = [
        ...draft.app.notifications,
        {
          key: Date.now().toString(),
          type: 'success',
          message: action.value,
        },
      ];
      break;
    }
    case NOTIFICATION_REMOVE: {
      const key = action.value;
      draft.app.notifications = draft.app.notifications.filter(
        (item) => item.key != key
      );
      break;
    }
  }
};

const headerReducer = (action: Action, draft: WritableDraft<RootState>) => {
  // TODO: type-safe
  switch (action.type) {
    case HEADER_UPDATE_FLASHING: {
      draft.configure.header.flashing = action.value;
      break;
    }
  }
};

const catalogSearchReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case CATALOG_SEARCH_UPDATE_FEATURES: {
      const newFeatures = [...draft.catalog.search.features];
      const targetFeatures = action.value.targetFeatures;
      const value = action.value.value;
      targetFeatures.forEach((x: IKeyboardFeatures) => {
        const index = newFeatures.indexOf(x);
        if (index !== -1) {
          newFeatures.splice(index, 1);
        }
      });
      if (value !== CONDITION_NOT_SELECTED) {
        newFeatures.push(value);
      }
      draft.catalog.search.features = newFeatures;
      break;
    }
    case CATALOG_SEARCH_UPDATE_KEYWORD: {
      draft.catalog.search.keyword = action.value;
      break;
    }
    case CATALOG_SEARCH_CLEAR_FEATURES: {
      draft.catalog.search.features = [];
      break;
    }
    case CATALOG_SEARCH_RESET_FEATURES: {
      const newFeatures = [...action.value];
      draft.catalog.search.features = newFeatures;
      break;
    }
    case CATALOG_SEARCH_UPDATE_ORGANIZATION: {
      draft.catalog.search.organizationId = action.value;
      break;
    }
    case CATALOG_SEARCH_UPDATE_BUILD_SUPPORT: {
      draft.catalog.search.buildSupport = action.value;
      break;
    }
  }
};

const catalogAppReducer = (action: Action, draft: WritableDraft<RootState>) => {
  switch (action.type) {
    case CATALOG_APP_UPDATE_PHASE:
      draft.catalog.app.phase = action.value;
      break;
  }
};

const catalogKeyboardReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case CATALOG_KEYBOARD_UPDATE_KEYMAPS:
      draft.catalog.keyboard.keymaps = action.value;
      break;
    case CATALOG_KEYBOARD_UPDATE_ENCODERS_KEYMAPS:
      draft.catalog.keyboard.encodersKeymaps = action.value;
      break;
    case CATALOG_KEYBOARD_UPDATE_SELECTED_LAYER:
      draft.catalog.keyboard.selectedLayer = action.value;
      break;
    case CATALOG_KEYBOARD_UPDATE_LANG_LABEL:
      draft.catalog.keyboard.langLabel = action.value;
      break;
    case CATALOG_KEYBOARD_CLEAR_KEYMAP:
      draft.catalog.keyboard.keymaps = [];
      draft.catalog.keyboard.selectedLayer = 0;
      draft.catalog.keyboard.langLabel = 'en-us';
      draft.catalog.keyboard.selectedKeymapData = null;
      break;
    case CATALOG_KEYBOARD_UPDATE_SELECTED_KEYMAP_DATA:
      draft.catalog.keyboard.selectedKeymapData = action.value;
      break;
    case CATALOG_KEYBOARRD_UPDATE_BUILDABLE_FIRMWARE_CODE_PARAMETER_VALUES:
      draft.catalog.keyboard.buildableFirmwareCodeParameterValues =
        action.value;
      break;
  }
};

const metaReducer = (action: Action, draft: WritableDraft<RootState>) => {
  switch (action.type) {
    case META_UPDATE:
      draft.app.meta.title = action.value.title;
      draft.app.meta.description = action.value.description;
      draft.app.meta.og.title = action.value.title;
      draft.app.meta.og.description = action.value.description;
      draft.app.meta.og.url = action.value.url;
      draft.app.meta.og.image = action.value.image;
      break;
  }
};

const uploadFirmwareDialogReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case UPLOAD_FIRMWARE_DIALOG_UPDATE_OPEN:
      draft.common.firmware.uploadFirmwareDialog.open = action.value;
      break;
    case UPLOAD_FIRMWARE_DIALOG_UPDATE_FIRMWARE_FILE_BUFFER:
      draft.common.firmware.uploadFirmwareDialog.firmwareFileBuffer =
        action.value;
      break;
  }
};

const flashFirmwareDialogReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case FLASH_FIRMWARE_DIALOG_UPDATE_FIRMWARE:
      draft.common.firmware.flashFirmwareDialog.firmware = action.value;
      break;
    case FLASH_FIRMWARE_DIALOG_UPDATE_FLASHING:
      draft.common.firmware.flashFirmwareDialog.flashing = action.value;
      break;
    case FLASH_FIRMWARE_DIALOG_UPDATE_PROGRESS_RATE:
      draft.common.firmware.flashFirmwareDialog.progressRate = action.value;
      break;
    case FLASH_FIRMWARE_DIALOG_APPEND_LOG: {
      const prevLogs: string[] = draft.common.firmware.flashFirmwareDialog.logs;
      const message: string = action.value.message;
      const lineBreak: boolean = action.value.lineBreak;
      if (lineBreak) {
        draft.common.firmware.flashFirmwareDialog.logs = [...prevLogs, message];
      } else {
        draft.common.firmware.flashFirmwareDialog.logs = [
          ...prevLogs.slice(0, prevLogs.length - 1),
          `${prevLogs[prevLogs.length - 1]}${message}`,
        ];
      }
      break;
    }
    case FLASH_FIRMWARE_DIALOG_UPDATE_MODE:
      draft.common.firmware.flashFirmwareDialog.mode = action.value;
      break;
    case FLASH_FIRMWARE_DIALOG_CLEAR:
      draft.common.firmware.flashFirmwareDialog.flashing = false;
      draft.common.firmware.flashFirmwareDialog.progressRate = 0;
      draft.common.firmware.flashFirmwareDialog.logs = [''];
      draft.common.firmware.flashFirmwareDialog.firmware = null;
      draft.common.firmware.flashFirmwareDialog.mode = 'loading';
      break;
    case FLASH_FIRMWARE_DIALOG_UPDATE_LOGS:
      draft.common.firmware.flashFirmwareDialog.logs = [''];
      break;
    case FLASH_FIRMWARE_DIALOG_UPDATE_BOOTLOADER_TYPE:
      draft.common.firmware.flashFirmwareDialog.bootloaderType = action.value;
      break;
    case FLASH_FIRMWARE_DIALOG_UPDATE_KEYBOARD_NAME:
      draft.common.firmware.flashFirmwareDialog.keyboardName = action.value;
      break;
    case FLASH_FIRMWARE_DIALOG_UPDATE_FLASH_MODE:
      draft.common.firmware.flashFirmwareDialog.flashMode = action.value;
      break;
    case FLASH_FIRMWARE_DIALOG_UPDATE_BUILDING_FIRMWARE_TASK:
      draft.common.firmware.flashFirmwareDialog.buildingFirmwareTask =
        action.value;
      break;
    case FLASH_FIRMWARE_DIALOG_UPDATE_FIRMWARE_BLOB:
      draft.common.firmware.flashFirmwareDialog.firmwareBlob = action.value;
      break;
  }
};

const organizationsAppReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case ORGANIZATIONS_APP_UPDATE_PHASE:
      draft.organizations.app.phase = action.value;
      break;
  }
};

const organizationsEditOrganizationReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case ORGANIZATIONS_EDIT_ORGANIZATION_UPDATE_ORGANIZATION_MEMBERS:
      draft.organizations.editorganization.organizationMembers = action.value;
      break;
    case ORGANIZATIONS_EDIT_ORGANIZATION_UPDATE_EMAIL:
      draft.organizations.editorganization.email = action.value;
      break;
  }
};

const workbenchAppReducer = (
  action: Action,
  draft: WritableDraft<RootState>
) => {
  switch (action.type) {
    case WORKBENCH_APP_UPDATE_PHASE: {
      draft.workbench.app.phase = action.value;
      break;
    }
    case WORKBENCH_APP_UPDATE_PROJECTS: {
      draft.workbench.app.projects = action.value;
      break;
    }
    case WORKBENCH_APP_UPDATE_CURRENT_PROJECT: {
      draft.workbench.app.currentProject = action.value;
      break;
    }
    case WORKBENCH_APP_UPDATE_SELECTED_FILE: {
      draft.workbench.app.selectedFile = action.value;
      break;
    }
    case WORKBENCH_APP_APPEND_FILE_TO_CURRENT_PROJECT: {
      const currentProject = draft.workbench.app.currentProject;
      if (currentProject === undefined) {
        return;
      }
      const file = action.value;
      const targetFiles =
        file.fileType === 'keyboard'
          ? currentProject.keyboardFiles
          : currentProject.keymapFiles;
      targetFiles.push(file);
      break;
    }
    case WORKBENCH_APP_UPDATE_BUILDING_TASKS: {
      draft.workbench.app.buildingTasks = action.value;
      break;
    }
    case WORKBENCH_APP_UPDATE_USER_PURCHASE_HISTORIES: {
      draft.workbench.app.userPurchaseHistories = action.value;
      break;
    }
  }
};

export default reducers;
