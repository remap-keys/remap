import { connect } from 'react-redux';
import KeyboardList from './KeyboardList';
import { RootState } from '../../../store/state';
import { KeycodesActions } from '../../../actions/actions';
import { hidActionsThunk } from '../../../actions/hid.action';
import { IKeyboard, IKeycodeCategory } from '../../../services/hid/hid';

const mapStateToProps = (state: RootState) => {
  return {
    keyboards: state.hid.keyboards || [],
  };
};
export type KeyboardListStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickItem: (keyboard: IKeyboard) => {
      _dispatch(hidActionsThunk.openKeyboard(keyboard));
      _dispatch(KeycodesActions.updateCategory(IKeycodeCategory.BASIC)); // init keycode categroy
    },
    onClickConnectAnotherKeyboard: () => {
      _dispatch(hidActionsThunk.connectAnotherKeyboard());
    },
  };
};
export type KeyboardListActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardList);
