import { connect } from 'react-redux';
import Configure from './Configure';
import { RootState } from '../../store/state';
import { HidActions, hidActionsThunk } from '../../actions/hid.action';
import { AppActions, NotificationActions } from '../../actions/actions';
import { IKeyboard } from '../../services/hid/Hid';

const mapStateToProps = (state: RootState) => {
  return {
    remaps: state.app.remaps,
    notifications: state.app.notifications,
    hid: state.hid,
    auth: state.auth.instance,
    storage: state.storage.instance,
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
    onConnectKeyboard: (keyboard: IKeyboard) => {
      _dispatch(HidActions.connectKeyboard(keyboard));
    },
    onDisconnectKeyboard: (keyboard: IKeyboard) => {
      _dispatch(hidActionsThunk.closeKeyboard(keyboard));
      _dispatch(HidActions.disconnectKeyboard(keyboard));
    },
    onCloseKeyboard: (keyboard: IKeyboard) => {
      _dispatch(hidActionsThunk.closeKeyboard(keyboard));
    },
  };
};

export type ConfigureActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Configure);
