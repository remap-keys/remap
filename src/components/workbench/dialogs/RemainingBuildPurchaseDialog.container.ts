import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import { RemainingBuildPurchaseDialog } from './RemainingBuildPurchaseDialog';
import { NotificationActions } from '../../../actions/actions';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    storage: state.storage.instance,
  };
};
export type RemainingBuildPurchaseDialogStateType = ReturnType<
  typeof mapStateToProps
>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch: any) => {
  return {
    showErrorMessage: (message: string) => {
      dispatch(NotificationActions.addError(message));
    },
  };
};
export type RemainingBuildPurchaseDialogActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemainingBuildPurchaseDialog);
