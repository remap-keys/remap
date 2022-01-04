import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import EditOrganization from './EditOrganization';
import {
  organizationsActionsThunk,
  OrganizationsEditOrganizationActions,
} from '../../../actions/organizations.actions';

const mapStateToProps = (state: RootState) => {
  return {
    organization: state.entities.organization,
    organizationMembers:
      state.organizations.editorganization.organizationMembers,
    email: state.organizations.editorganization.email,
  };
};
export type EditOrganizationStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    updateEmail: (email: string) => {
      _dispatch(OrganizationsEditOrganizationActions.updateEmail(email));
    },
    addOrganizationMember: () => {
      _dispatch(organizationsActionsThunk.addOrganizationMember());
    },
    deleteOrganizationMember: (uid: string) => {
      _dispatch(organizationsActionsThunk.deleteOrganizationMember(uid));
    }
  };
};
export type EditOrganizationActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(EditOrganization);
