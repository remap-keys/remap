import { connect } from 'react-redux';
import Configure from './Configure';
import { RootState, SetupPhase } from '../../store/state';
import { HidActions, hidActionsThunk } from '../../actions/hid.action';
import {
  AppActions,
  AppActionsThunk,
  KeymapToolbarActions,
  NotificationActions,
} from '../../actions/actions';
import { IKeyboard } from '../../services/hid/Hid';
import { MetaActions } from '../../actions/meta.action';
import { MacroEditorActions } from '../../actions/macro.action';

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
    buildNumber: state.app.buildNumber,
  };
};
export type ConfigureStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (dispatch: any) => {
  return {
    initAppPackage: (name: string, version: string) => {
      dispatch(AppActions.initAppPackage(name, version));
    },

    updateAuthorizedKeyboardList: () =>
      dispatch(hidActionsThunk.updateAuthorizedKeyboardList()),

    removeNotification: (key: string) => {
      dispatch(NotificationActions.removeNotification(key));
    },

    onConnectKeyboard: (keyboard: IKeyboard) => {
      dispatch(HidActions.connectKeyboard(keyboard));
    },

    onDisconnectKeyboard: (keyboard: IKeyboard, managedKeyboard: IKeyboard) => {
      if (keyboard.isOpened()) {
        dispatch(hidActionsThunk.closeKeyboard(keyboard));
      } else {
        if (keyboard.isSameDevice(managedKeyboard)) {
          /**
           * In case of at KeyboardDefinitionForm page,
           * the keyboard is NOT opened but set on state.entities.keyboard.
           * Switch to Keyboard selection page.
           */
          dispatch(HidActions.updateKeyboard(null));
          dispatch(
            AppActions.updateSetupPhase(SetupPhase.keyboardNotSelected)
          );
        }
      }

      dispatch(HidActions.disconnectKeyboard(keyboard));
      dispatch(MacroEditorActions.clearMacroKey());
      dispatch(KeymapToolbarActions.updateTestMatrix(false));
    },

    onCloseKeyboard: (keyboard: IKeyboard) => {
      dispatch(hidActionsThunk.closeKeyboard(keyboard));
    },

    updateSignedIn: (signedIn: boolean) => {
      dispatch(AppActions.updateSignedIn(signedIn));
      dispatch(AppActionsThunk.updateUserInformation());
    },
    initializeMeta: () => {
      dispatch(MetaActions.initialize());
    },
    updateTitle: (title: string) => {
      dispatch(MetaActions.update({ title }));
    },
  };
};

export type ConfigureActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Configure);
