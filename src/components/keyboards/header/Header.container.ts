import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import Header from './Header';
import { keyboardsActionsThunk } from '../../../actions/keyboards.actions';

const mapStateToProps = (state: RootState) => {
  return {
    auth: state.auth.instance,
  };
};
export type HeaderStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    logout: () => {
      _dispatch(keyboardsActionsThunk.logout());
    },
  };
};
export type HeaderActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
