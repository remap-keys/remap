import { connect } from 'react-redux';
import KeyboardDefinitionManagement from './KeyboardDefinitionManagement';
import { RootState } from '../../store/state';
import { NotificationActions } from '../../actions/actions';

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
  };
};

export type KeyboardDefinitionManagementActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyboardDefinitionManagement);
