import { connect } from 'react-redux';
import LayoutOptionPopover from './LayoutOptionPopover';
import { RootState } from '../../../store/state';
import { LayoutOptionsActions } from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  return {
    keyboardLayoutOptions: state.entities.keyboardDefinition?.layouts.labels,
    selectedLayoutOptions: state.configure.layoutOptions.selectedOptions,
  };
};
export type LayoutOptionPopoverStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    setLayoutOption: (optionIndex: number, option: string | null) => {
      _dispatch(LayoutOptionsActions.updateSelectedOption(optionIndex, option));
    },
  };
};

export type LayoutOptionPopoverActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutOptionPopover);
