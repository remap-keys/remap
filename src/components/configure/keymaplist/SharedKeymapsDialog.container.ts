import { connect } from 'react-redux';
import SharedKeymapsDialog from './SharedKeymapsDialog';
import { RootState } from '../../../store/state';

const mapStateToProps = (state: RootState) => {
  return {
    sharedKeymaps: state.entities.sharedKeymaps,
    appliedKeymaps: state.entities.appliedKeymaps,
  };
};
export type SharedKeymapsDialogStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};

export type SharedKeymapsDialogActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SharedKeymapsDialog);
