import { connect } from 'react-redux';
import {
  IConditionNotSelected,
  IKeyboardFeatures,
  RootState,
} from '../../../store/state';
import CatalogSearchForm from './CatalogSearchForm';
import { CatalogSearchActions } from '../../../actions/catalog.action';
import { storageActionsThunk } from '../../../actions/storage.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    organizations: Object.values(state.entities.organizationMap),
    organizationId: state.catalog.search.organizationId,
  };
};
export type CatalogSearchFormStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    updateFeatures: (
      value: IKeyboardFeatures | IConditionNotSelected,
      targetFeatures: readonly IKeyboardFeatures[],
    ) => {
      _dispatch(CatalogSearchActions.updateFeatures(value, targetFeatures));
    },
    updateKeyword: (keyword: string) => {
      _dispatch(CatalogSearchActions.updateKeyword(keyword));
    },
    search: () => {
      _dispatch(storageActionsThunk.searchKeyboardsForCatalog());
    },
    resetSearchConditions: () => {
      _dispatch(CatalogSearchActions.updateKeyword(''));
      _dispatch(CatalogSearchActions.updateOrganizationId(undefined));
      _dispatch(CatalogSearchActions.clearFeatures());
    },
    updateOrganizationId: (organizationId: string | undefined) => {
      _dispatch(CatalogSearchActions.updateOrganizationId(organizationId));
    },
    updateBuildSupport: (buildSupport: boolean) => {
      _dispatch(CatalogSearchActions.updateBuildSupport(buildSupport));
    },
  };
};
export type CatalogSearchFormActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(mapStateToProps, mapDispatchToProps)(CatalogSearchForm);
