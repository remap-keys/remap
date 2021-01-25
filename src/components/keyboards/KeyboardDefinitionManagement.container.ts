import { connect } from 'react-redux';
import KeyboardDefinitionManagement from './KeyboardDefinitionManagement';
import { RootState } from '../../store/state';
import { NotificationActions } from '../../actions/actions';
import { storageActionsThunk } from '../../actions/storage.action';

const mapStateToProps = (state: RootState) => {
  return {
    notifications: state.app.notifications,
    auth: state.auth.instance,
  };
};
export type KeyboardDefinitionManagementStateType = ReturnType<
  typeof mapStateToProps
>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    removeNotification: (key: string) => {
      _dispatch(NotificationActions.removeNotification(key));
    },
    updateKeyboards: () => {
      _dispatch(storageActionsThunk.fetchMyKeyboardDefinitionDocuments());
    },
  };
};

export type KeyboardDefinitionManagementActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyboardDefinitionManagement);
