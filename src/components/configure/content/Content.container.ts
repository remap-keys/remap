import { connect } from 'react-redux';
import Content from './Content';
import { RootState } from '../../../store/state';
import { storageActionsThunk } from '../../../actions/storage.action';

const mapStateToProps = (state: RootState) => {
  return {
    setupPhase: state.app.setupPhase,
    keyboardDefDocument: state.entities.keyboardDefinitionDocument,
  };
};
export type ContentStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    fetchSavedKeymaps: (definitionId: string) => {
      _dispatch(storageActionsThunk.fetchSavedKeymapDataList(definitionId));
    },
  };
};
export type ContentActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Content);
