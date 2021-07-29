import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import Header from './Header';
import {
  catalogActionsThunk,
  CatalogAppActions,
  CatalogKeyboardActions,
} from '../../../actions/catalog.action';
import { AppActionsThunk } from '../../../actions/actions';
import { storageActionsThunk } from '../../../actions/storage.action';
import { MetaActions } from '../../../actions/meta.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    auth: state.auth.instance,
    signedIn: state.app.signedIn,
    phase: state.catalog.app.phase,
    definitionDocument: state.entities.keyboardDefinitionDocument,
  };
};
export type HeaderStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    logout: () => {
      _dispatch(catalogActionsThunk.logout());
    },
    linkToGoogleAccount: () => {
      _dispatch(AppActionsThunk.linkToGoogleAccount());
    },
    linkToGitHubAccount: () => {
      _dispatch(AppActionsThunk.linkToGitHubAccount());
    },
    goToSearch: () => {
      _dispatch(storageActionsThunk.searchKeyboardsForCatalog());
      _dispatch(MetaActions.initialize());
    },
    goToKeymap: () => {
      _dispatch(CatalogKeyboardActions.clearKeymap());
      _dispatch(CatalogAppActions.updatePhase('keymap'));
    },
    goToIntroduction: () => {
      _dispatch(CatalogAppActions.updatePhase('introduction'));
    },
  };
};
export type HeaderActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
