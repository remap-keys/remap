import { connect } from 'react-redux';
import { RootState } from '../../store/state';
import Documents from './Documents';
import { MetaActions } from '../../actions/meta.action';
import { AppActions, AppActionsThunk } from '../../actions/actions';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return { auth: state.auth.instance };
};
export type DocumentsStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (dispatch: any) => {
  return {
    initializeMeta: () => {
      dispatch(MetaActions.initialize());
    },
    updateSignedIn: (signedIn: boolean) => {
      dispatch(AppActions.updateSignedIn(signedIn));
      dispatch(AppActionsThunk.fetchUserInformation());
      dispatch(AppActionsThunk.fetchUserPurchase());
    },
  };
};
export type DocumentsActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Documents);
