import { connect } from 'react-redux';
import LayoutOptionPopover from './LayoutOptionPopover';
import { RootState } from '../../../store/state';

const mapStateToProps = (state: RootState) => {
  return {
    selectedLayoutOptions: state.configure.layoutOptions.selectedOptions,
  };
};
export type LayoutOptionPopoverStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};

export type LayoutOptionPopoverActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutOptionPopover);
