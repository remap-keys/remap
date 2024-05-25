import { RootState } from '../../store/state';
import { connect } from 'react-redux';
import { NotificationActions } from '../../actions/actions';
import OrganizationManagement from './OrganizationManagement';
import { MetaActions } from '../../actions/meta.action';
import {
  OrganizationsAppActions,
  organizationsActionsThunk,
} from '../../actions/organizations.actions';

const mapStateToProps = (state: RootState) => {
  return {
    notifications: state.app.notifications,
    auth: state.auth.instance,
    phase: state.organizations.app.phase,
  };
};
export type OrganizationManagementStateType = ReturnType<
  typeof mapStateToProps
>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    removeNotification: (key: string) => {
      _dispatch(NotificationActions.removeNotification(key));
    },
    startInitializing: () => {
      _dispatch(OrganizationsAppActions.updatePhase('init'));
    },
    initializeMeta: () => {
      _dispatch(MetaActions.initialize());
    },
    updateOrganizations: () => {
      _dispatch(organizationsActionsThunk.fetchMyOrganizations());
    },
    updateOrganization: (organizationId: string) => {
      _dispatch(organizationsActionsThunk.fetchOrganization(organizationId));
    },
  };
};
export type OrganizationManagementActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrganizationManagement);
