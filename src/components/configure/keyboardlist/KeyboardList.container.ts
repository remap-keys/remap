import { connect } from 'react-redux';
import KeyboardList from './KeyboardList';
import { RootState, SetupPhase } from '../../../store/state';
import { AppActions, KeycodesActions } from '../../../actions/actions';
import { hidActionsThunk } from '../../../actions/hid.action';
import { IKeyboard, IKeycodeCategory } from '../../../services/hid/Hid';

const mapStateToProps = (state: RootState) => {
  return {
    keyboards: state.entities.keyboards || [],
  };
};
export type KeyboardListStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickItem: (keyboard: IKeyboard) => {
      _dispatch(AppActions.updateSetupPhase(SetupPhase.connectingKeyboard));
      _dispatch(hidActionsThunk.connectKeyboard(keyboard));
      _dispatch(KeycodesActions.updateCategory(IKeycodeCategory.BASIC)); // init keycode category
    },
    onClickConnectAnotherKeyboard: () => {
      _dispatch(AppActions.updateSetupPhase(SetupPhase.connectingKeyboard));
      _dispatch(hidActionsThunk.connectAnotherKeyboard());
      _dispatch(KeycodesActions.updateCategory(IKeycodeCategory.BASIC)); // init keycode category
    },
  };
};
export type KeyboardListActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardList);
