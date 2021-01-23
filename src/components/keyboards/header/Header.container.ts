import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import Header from './Header';

const mapStateToProps = (state: RootState) => {
  return {};
};
export type HeaderStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type HeaderActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
