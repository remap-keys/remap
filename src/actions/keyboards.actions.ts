import { IKeyboardsPhase } from '../store/state';
import { KeyboardDefinitionSchema } from '../gen/types/KeyboardDefinition';
import { IKeyboardDefinitionDocument } from '../services/storage/Storage';

export const KEYBOARDS_APP_ACTIONS = '@FIXME!App'; // FIXME!
export const KEYBOARDS_APP_UPDATE_PHASE = `${KEYBOARDS_APP_ACTIONS}/UpdatePhase`;
export const KeyboardsAppActions = {
  updatePhase: (phase: IKeyboardsPhase) => {
    return {
      type: KEYBOARDS_APP_UPDATE_PHASE,
      value: phase,
    };
  },
};

export const KEYBOARDS_CREATE_DEFINITION_ACTIONS = '@FIXME!CreateDefinition'; // FIXME!
export const KEYBOARDS_CREATE_DEFINITION_CLEAR = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/Clear`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_JSON_FILENAME = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/UpdateJsonFilename`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_JSON_STRING = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/UpdateJsonString`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_KEYBOARD_DEFINITION = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/UpdateKeyboardDefinition`;
export const KEYBOARDS_CREATE_DEFINITION_UPDATE_PRODUCT_NAME = `${KEYBOARDS_CREATE_DEFINITION_ACTIONS}/UpdateProductName`;
export const KeyboardsCreateDefinitionActions = {
  clear: () => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_CLEAR,
    };
  },
  updateJsonFilename: (jsonFilename: string) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_JSON_FILENAME,
      value: jsonFilename,
    };
  },
  updateJsonString: (jsonStr: string) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_JSON_STRING,
      value: jsonStr,
    };
  },
  updateKeyboardDefinition: (keyboardDefinition: KeyboardDefinitionSchema) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_KEYBOARD_DEFINITION,
      value: keyboardDefinition,
    };
  },
  updateProductName: (productName: string) => {
    return {
      type: KEYBOARDS_CREATE_DEFINITION_UPDATE_PRODUCT_NAME,
      value: productName,
    };
  },
};

export const KEYBOARDS_EDIT_DEFINITION_ACTIONS = '@FIXME!EditDefinition'; // FIXME!
export const KEYBOARDS_EDIT_DEFINITION_CLEAR = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/Clear`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_JSON_FILENAME = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateJsonFilename`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_JSON_STRING = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateJsonString`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_KEYBOARD_DEFINITION = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateKeyboardDefinition`;
export const KEYBOARDS_EDIT_DEFINITION_UPDATE_PRODUCT_NAME = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/UpdateProductName`;
export const KEYBOARDS_EDIT_DEFINITION_INIT = `${KEYBOARDS_EDIT_DEFINITION_ACTIONS}/Init`;
export const KeyboardsEditDefinitionActions = {
  clear: () => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_CLEAR,
    };
  },
  init: (keyboardDefinitionDocument: IKeyboardDefinitionDocument) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_INIT,
      value: keyboardDefinitionDocument,
    };
  },
  updateJsonFilename: (jsonFilename: string) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_JSON_FILENAME,
      value: jsonFilename,
    };
  },
  updateJsonString: (jsonStr: string) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_JSON_STRING,
      value: jsonStr,
    };
  },
  updateKeyboardDefinition: (keyboardDefinition: KeyboardDefinitionSchema) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_KEYBOARD_DEFINITION,
      value: keyboardDefinition,
    };
  },
  updateProductName: (productName: string) => {
    return {
      type: KEYBOARDS_EDIT_DEFINITION_UPDATE_PRODUCT_NAME,
      value: productName,
    };
  },
};
