import { connect } from 'react-redux';
import Configure from './Configure';
import { RootState, SetupPhase } from '../../store/state';
import { HidActions, hidActionsThunk } from '../../actions/hid.action';
import {
  AppActions,
  KeymapToolbarActions,
  NotificationActions,
} from '../../actions/actions';
import { IKeyboard } from '../../services/hid/Hid';
import { MetaActions } from '../../actions/meta.action';

const mapStateToProps = (state: RootState) => {
  return {
    remaps: state.app.remaps,
    notifications: state.app.notifications,
    hid: state.hid,
    auth: state.auth.instance,
    storage: state.storage.instance,
    draggingKey: state.configure.keycodeKey.draggingKey,
    testMatrix: state.configure.keymapToolbar.testMatrix,
    keyboard: state.entities.keyboard,
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

    removeNotification: (key: string) => {
      _dispatch(NotificationActions.removeNotification(key));
    },

    onConnectKeyboard: (keyboard: IKeyboard) => {
      _dispatch(HidActions.connectKeyboard(keyboard));
    },

    onDisconnectKeyboard: (keyboard: IKeyboard, managedKeyboard: IKeyboard) => {
      if (keyboard.isOpened()) {
        _dispatch(hidActionsThunk.closeKeyboard(keyboard));
      } else {
        if (keyboard.isSameDevice(managedKeyboard)) {
          /**
           * In case of at KeyboardDefinitionForm page,
           * the keyboard is NOT opened but set on state.entities.keyboard.
           * Switch to Keyboard selection page.
           */
          _dispatch(HidActions.updateKeyboard(null));
          _dispatch(
            AppActions.updateSetupPhase(SetupPhase.keyboardNotSelected)
          );
        }
      }

      _dispatch(HidActions.disconnectKeyboard(keyboard));
      _dispatch(KeymapToolbarActions.updateTestMatrix(false));
    },

    onCloseKeyboard: (keyboard: IKeyboard) => {
      _dispatch(hidActionsThunk.closeKeyboard(keyboard));
    },

    updateSignedIn: (signedIn: boolean) => {
      _dispatch(AppActions.updateSignedIn(signedIn));
    },
    initializeMeta: () => {
      _dispatch(MetaActions.initialize());
    },
    updateTitle: (title: string) => {
      _dispatch(MetaActions.update({ title }));
    },
  };
};

export type ConfigureActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Configure);
