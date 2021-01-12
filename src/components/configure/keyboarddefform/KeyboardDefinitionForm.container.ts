import { connect } from 'react-redux';
import { KeyboardDefinitionFormActions } from '../../../actions/actions';
import { RootState } from '../../../store/state';
import KeyboardDefinitionForm from './KeyboardDefinitionForm';
import { storageActionsThunk } from '../../../actions/storage.action';

const mapStateToProps = (state: RootState) => {
  const kbd = state.entities.keyboard;
  const info = kbd?.getInformation();

  return {
    dragging: state.keyboardDefinitionForm.dragging,
    productName: info?.productName,
  };
};
export type KeyboardDefinitionFormStateType = ReturnType<
  typeof mapStateToProps
>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onDragOverFile: () => {
      _dispatch(KeyboardDefinitionFormActions.updateDragging(true));
    },
    // eslint-disable-next-line no-undef
    onDropFile: (file: File) => {
      _dispatch(KeyboardDefinitionFormActions.updateDragging(false));
      _dispatch(storageActionsThunk.uploadKeyboardDefinition(file));
    },
    onDragLeaveFile: () => {
      _dispatch(KeyboardDefinitionFormActions.updateDragging(false));
    },
  };
};
export type KeyboardDefinitionFormActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyboardDefinitionForm);
