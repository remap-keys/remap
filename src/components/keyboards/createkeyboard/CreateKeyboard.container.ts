import { connect } from 'react-redux';
import { KeyboardsPhase, RootState } from '../../../store/state';
import CreateKeyboard from './CreateKeyboard';
import {
  KeyboardsAppActions,
  KeyboardsCreateKeyboardActions,
} from '../../../actions/keyboards.actions';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { storageActionsThunk } from '../../../actions/storage.action';

const mapStateToProps = (state: RootState) => {
  return {
    jsonFilename: state.keyboards.createKeyboard.jsonFilename,
    keyboardDefinition: state.keyboards.createKeyboard.keyboardDefinition,
    productName: state.keyboards.createKeyboard.productName,
  };
};
export type CreateKeyboardStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    updateJsonFilename: (jsonFilename: string) => {
      _dispatch(
        KeyboardsCreateKeyboardActions.updateJsonFilename(jsonFilename)
      );
    },
    updateJsonString: (jsonStr: string) => {
      _dispatch(KeyboardsCreateKeyboardActions.updateJsonString(jsonStr));
    },
    updateKeyboardDefinition: (
      keyboardDefinition: KeyboardDefinitionSchema
    ) => {
      _dispatch(
        KeyboardsCreateKeyboardActions.updateKeyboardDefinition(
          keyboardDefinition
        )
      );
    },
    updateProductName: (productName: string) => {
      _dispatch(KeyboardsCreateKeyboardActions.updateProductName(productName));
    },
    saveAsDraft: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.processing));
      _dispatch(storageActionsThunk.createKeyboardDefinitionAsDraft());
    },
    submitForReview: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.processing));
      _dispatch(storageActionsThunk.createAndSubmitKeyboardDefinition());
    },
    backToList: () => {
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.list));
    },
  };
};
export type CreateKeyboardActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CreateKeyboard);
