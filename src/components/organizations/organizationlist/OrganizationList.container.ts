import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import OrganizationList from './OrganizationList';

const mapStateToProps = (state: RootState) => {
  return {
    organizations: Object.values(state.entities.organizationMap),
  };
};
export type OrganizationListStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type OrganizationListActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationList);
