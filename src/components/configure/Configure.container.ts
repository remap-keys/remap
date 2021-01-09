import { connect } from 'react-redux';
import Configure from './Configure';
import { RootState } from '../../store/state';
import { hidActionsThunk } from '../../actions/hid.action';
import { AppActions, NotificationActions } from '../../actions/actions';

const mapStateToProps = (state: RootState) => {
  return {
    remaps: state.app.remaps,
    notifications: state.app.notifications,
  };
};
export type ConfigureStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    initAppPackage: (name: string, version: string) => {
      _dispatch(AppActions.initAppPackage(name, version));
    },
    updateAuthorizedKeyboardList: () =>
      _dispatch(hidActionsThunk.updateAuthorizedKeyboardList()),
    test: () => _dispatch(NotificationActions.addWarn('hoge')),
    removeNotification: (key: string) => {
      _dispatch(NotificationActions.removeNotification(key));
    },
  };
};

export type ConfigureActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Configure);
