import { connect } from 'react-redux';
import { IKeyboardsPhase, RootState } from '../../../store/state';
import KeyboardList from './KeyboardList';
import { KeyboardsAppActions } from '../../../actions/keyboards.actions';

const mapStateToProps = (state: RootState) => {
  return {
    keyboardDefinitionDocuments: state.entities.keyboardDefinitionDocuments,
  };
};
export type KeyboardListStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    updatePhase: (phase: IKeyboardsPhase) => {
      _dispatch(KeyboardsAppActions.updatePhase(phase));
    },
  };
};
export type KeyboardListActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardList);
