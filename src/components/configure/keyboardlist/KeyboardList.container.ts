import { connect } from 'react-redux';
import KeyboardList from './KeyboardList';
import { RootState } from '../../../store/state';
import { hidActionsThunk } from '../../../actions/hid.action';
import { IKeyboard } from '../../../services/hid/Hid';

const mapStateToProps = (state: RootState) => {
  return {
    keyboards: state.entities.keyboards || [],
  };
};
export type KeyboardListStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickItem: (keyboard: IKeyboard) => {
      _dispatch(hidActionsThunk.connectKeyboard(keyboard));
    },
    onClickConnectAnotherKeyboard: () => {
      _dispatch(hidActionsThunk.connectAnotherKeyboard());
    },
  };
};
export type KeyboardListActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardList);
