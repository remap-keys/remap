import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import RemainingBuildPurchaseHistoryDialog from './RemainingBuildPurchaseHistoryDialog';
import { clear } from 'console';
import { WorkbenchAppActions } from '../../../actions/workbench.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    histories: state.workbench.app.userPurchaseHistories,
  };
};
export type RemainingBuildPurchaseHistoryDialogStateType = ReturnType<
  typeof mapStateToProps
>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch: any) => {
  return {
    clearPurchaseHistories: () => {
      dispatch(WorkbenchAppActions.updateUserPurchaseHistories(undefined));
    },
  };
};
export type RemainingBuildPurchaseHistoryDialogActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemainingBuildPurchaseHistoryDialog);
