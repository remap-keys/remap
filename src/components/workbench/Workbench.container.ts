import { connect } from 'react-redux';
import { RootState } from '../../store/state';
import Workbench from './Workbench';
import {
  AppActions,
  AppActionsThunk,
  NotificationActions,
} from '../../actions/actions';
import { MetaActions } from '../../actions/meta.action';
import { workbenchActionsThunk } from '../../actions/workbench.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    notifications: state.app.notifications,
    auth: state.auth.instance,
    signedIn: state.app.signedIn,
    userInformation: state.app.user.information,
  };
};
export type WorkbenchStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (dispatch: any) => {
  return {
    removeNotification: (key: string) => {
      dispatch(NotificationActions.removeNotification(key));
    },
    initializeMeta: () => {
      dispatch(MetaActions.initialize());
    },
    updateSignedIn: (signedIn: boolean) => {
      dispatch(AppActions.updateSignedIn(signedIn));
      dispatch(AppActionsThunk.updateUserInformation());
    },
    initializeWorkbench: () => {
      dispatch(workbenchActionsThunk.initializeWorkbench());
    },
  };
};
export type WorkbenchActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Workbench);
