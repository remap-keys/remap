import { connect } from 'react-redux';
import {
  IConditionNotSelected,
  IKeyboardFeatures,
  RootState,
} from '../../../store/state';
import CatalogSearch from './CatalogSearch';
import { CatalogSearchActions } from '../../../actions/catalog.action';
import { storageActionsThunk } from '../../../actions/storage.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    features: state.catalog.search.features,
    searchResult: state.entities.searchResultKeyboardDocuments,
  };
};
export type CatalogSearchStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    updateFeatures: (
      value: IKeyboardFeatures | IConditionNotSelected,
      targetFeatures: readonly IKeyboardFeatures[]
    ) => {
      _dispatch(CatalogSearchActions.updateFeatures(value, targetFeatures));
      _dispatch(storageActionsThunk.searchKeyboardsByFeatures());
    },
  };
};
export type CatalogSearchActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CatalogSearch);
