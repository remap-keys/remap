import { connect } from 'react-redux';
import { KeyboardsPhase, RootState } from '../../../store/state';
import DefinitionList from './DefinitionList';
import {
  KeyboardsAppActions,
  KeyboardsCreateDefinitionActions,
} from '../../../actions/keyboards.actions';
import { storageActionsThunk } from '../../../actions/storage.action';

const mapStateToProps = (state: RootState) => {
  return {
    keyboardDefinitionDocuments: state.entities.keyboardDefinitionDocuments,
  };
};
export type KeyboardListStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    createKeyboard: () => {
      _dispatch(KeyboardsCreateDefinitionActions.clear());
      _dispatch(storageActionsThunk.fetchMyOrganizations());
      _dispatch(KeyboardsAppActions.updatePhase(KeyboardsPhase.create));
    },
  };
};
export type KeyboardListActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(DefinitionList);
