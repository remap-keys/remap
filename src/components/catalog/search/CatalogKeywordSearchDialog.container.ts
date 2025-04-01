import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import CatalogKeywordSearchDialog from './CatalogKeywordSearchDialog';
import { storageActionsThunk } from '../../../actions/storage.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    approvedKeyboardDefinitionDocuments:
      state.entities.approvedKeyboardDefinitionDocuments,
    organizationMap: state.entities.searchResultOrganizationMap,
  };
};
export type CatalogKeywordSearchDialogStateType = ReturnType<
  typeof mapStateToProps
>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch: any) => {
  return {
    search: () => {
      dispatch(storageActionsThunk.fetchApprovedKeyboardDefinitions());
    },
  };
};
export type CatalogKeywordSearchDialogActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogKeywordSearchDialog);
