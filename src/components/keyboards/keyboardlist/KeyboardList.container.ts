import { connect } from 'react-redux';
import { KeyboardsPhase, RootState } from '../../../store/state';
import KeyboardList from './KeyboardList';
import {
  KeyboardsAppActions,
  KeyboardsCreateKeyboardActions,
} from '../../../actions/keyboards.actions';

const mapStateToProps = (state: RootState) => {
  return {
    keyboardDefinitionDocuments: state.entities.keyboardDefinitionDocuments,
  };
};
export type KeyboardListStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    createKeyboard: () => {
      _dispatch(KeyboardsCreateKeyboardActions.clear());
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.create));
    },
  };
};
export type KeyboardListActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardList);
