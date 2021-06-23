import {
  IConditionNotSelected,
  IKeyboardFeatures,
  RootState,
} from '../../../store/state';
import { connect } from 'react-redux';
import CatalogForm from './CatalogForm';
import { KeyboardsEditDefinitionActions } from '../../../actions/keyboards.actions';
import { storageActionsThunk } from '../../../actions/storage.action';

const mapStateToProps = (state: RootState) => {
  return {
    definitionDocument: state.entities.keyboardDefinitionDocument,
    features: state.keyboards.editdefinition.features,
  };
};
export type CatalogFormStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    updateFeature: (
      value: IKeyboardFeatures | IConditionNotSelected,
      targetFeatures: readonly IKeyboardFeatures[]
    ) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateFeature(value, targetFeatures)
      );
    },
    save: () => {
      _dispatch(storageActionsThunk.updateKeyboardDefinitionForCatalog());
    },
  };
};
export type CatalogFormActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CatalogForm);
