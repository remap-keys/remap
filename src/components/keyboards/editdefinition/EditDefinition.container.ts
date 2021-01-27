import { connect } from 'react-redux';
import { KeyboardsPhase, RootState } from '../../../store/state';
import EditDefinition from './EditDefinition';
import {
  KeyboardsAppActions,
  KeyboardsEditDefinitionActions,
} from '../../../actions/keyboards.actions';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { storageActionsThunk } from '../../../actions/storage.action';

const mapStateToProps = (state: RootState) => {
  return {
    jsonFilename: state.keyboards.editdefinition.jsonFilename,
    keyboardDefinition: state.keyboards.editdefinition.keyboardDefinition,
    productName: state.keyboards.editdefinition.productName,
    definitionDocument: state.entities.keyboardDefinitionDocument,
    jsonStr: state.keyboards.editdefinition.jsonString,
  };
};
export type EditKeyboardStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    updateJsonFilename: (jsonFilename: string) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateJsonFilename(jsonFilename)
      );
    },
    updateJsonString: (jsonStr: string) => {
      _dispatch(KeyboardsEditDefinitionActions.updateJsonString(jsonStr));
    },
    updateKeyboardDefinition: (
      keyboardDefinition: KeyboardDefinitionSchema
    ) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateKeyboardDefinition(
          keyboardDefinition
        )
      );
    },
    updateProductName: (productName: string) => {
      _dispatch(KeyboardsEditDefinitionActions.updateProductName(productName));
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

export default connect(mapStateToProps, mapDispatchToProps)(EditDefinition);
