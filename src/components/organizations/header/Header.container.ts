import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import { organizationsActionsThunk } from '../../../actions/organizations.actions';
import Header from './Header';

const mapStateToProps = (state: RootState) => {
  return {
    auth: state.auth.instance,
  };
};
export type HeaderStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    logout: () => {
      _dispatch(organizationsActionsThunk.logout());
    },
  };
};
export type HeaderActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
