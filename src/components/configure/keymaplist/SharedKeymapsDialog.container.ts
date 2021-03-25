import { connect } from 'react-redux';
import SharedKeymapsDialog from './SharedKeymapsDialog';
import { RootState } from '../../../store/state';

const mapStateToProps = (state: RootState) => {
  return {};
};
export type SharedKeymapsDialogStateType = ReturnType<typeof mapStateToProps>;

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
