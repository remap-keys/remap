import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import Header from './Header';
import { catalogActionsThunk } from '../../../actions/catalog.action';
import { AppActionsThunk } from '../../../actions/actions';
import { storageActionsThunk } from '../../../actions/storage.action';
import { MetaActions } from '../../../actions/meta.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    auth: state.auth.instance,
    signedIn: state.app.signedIn,
    phase: state.catalog.app.phase,
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
  };
};
export type HeaderActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
