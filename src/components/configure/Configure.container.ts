import { connect } from 'react-redux';
import Configure from './Configure';
import { RootState } from '../../store/state';
import { hidActionsThunk } from '../../actions/hid.action';

const mapStateToProps = (state: RootState) => {
  return {};
};
export type ConfigureStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    updateAuthorizedKeyboardList: () =>
      _dispatch(hidActionsThunk.updateAuthorizedKeyboardList()),
  };
};

export type ConfigureActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Configure);
