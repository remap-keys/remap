import { connect } from 'react-redux';
import { KeyboardsPhase, RootState } from '../../../store/state';
import EditKeyboard from './EditKeyboard';
import {
  KeyboardsAppActions,
  KeyboardsEditKeyboardActions,
} from '../../../actions/keyboards.actions';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { storageActionsThunk } from '../../../actions/storage.action';

const mapStateToProps = (state: RootState) => {
  return {
    jsonFilename: state.keyboards.editKeyboard.jsonFilename,
    keyboardDefinition: state.keyboards.editKeyboard.keyboardDefinition,
    productName: state.keyboards.editKeyboard.productName,
    definitionDocument: state.entities.keyboardDefinitionDocument,
    jsonStr: state.keyboards.editKeyboard.jsonString,
  };
};
export type EditKeyboardStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    updateJsonFilename: (jsonFilename: string) => {
      _dispatch(KeyboardsEditKeyboardActions.updateJsonFilename(jsonFilename));
    },
    updateJsonString: (jsonStr: string) => {
      _dispatch(KeyboardsEditKeyboardActions.updateJsonString(jsonStr));
    },
    updateKeyboardDefinition: (
      keyboardDefinition: KeyboardDefinitionSchema
    ) => {
      _dispatch(
        KeyboardsEditKeyboardActions.updateKeyboardDefinition(
          keyboardDefinition
        )
      );
    },
    updateProductName: (productName: string) => {
      _dispatch(KeyboardsEditKeyboardActions.updateProductName(productName));
    },
    saveAsDraft: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.processing));
      _dispatch(storageActionsThunk.updateKeyboardDefinitionAsDraft());
    },
    submitForReview: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.processing));
      _dispatch(storageActionsThunk.updateAndSubmitKeyboardDefinition());
    },
    updateJsonFile: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.processing));
      _dispatch(storageActionsThunk.updateKeyboardDefinitionJsonFile());
    },
    backToList: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.list));
    },
  };
};
export type EditKeyboardActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(EditKeyboard);
