import { connect } from 'react-redux';
import LayoutOptionsDialog from './LayoutOptionsDialog';
import { RootState } from '../../../store/state';
import { LayoutOptionsActions } from '../../../actions/actions';
import { storageActionsThunk } from '../../../actions/storage.action';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';

const mapStateToProps = (state: RootState) => {
  return {
    selectedKeyboardOptions: state.configure.layoutOptions.selectedOptions,
    keyboardLayoutOptions: state.entities.keyboardDefinition?.layouts.labels,
  };
};
export type LayoutOptionsDialogStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    setLayoutOption: (optionIndex: number, option: string | null) => {
      _dispatch(LayoutOptionsActions.updateSelectedOption(optionIndex, option));
    },
    refreshKeyboardDefinition: (
      keyboardDefinition: KeyboardDefinitionSchema
    ) => {
      _dispatch(
        storageActionsThunk.refreshKeyboardDefinition(keyboardDefinition)
      );
    },
  };
};

export type LayoutOptionsDialogActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutOptionsDialog);
