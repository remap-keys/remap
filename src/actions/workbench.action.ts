import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { IWorkbenchPhase, RootState } from '../store/state';
import { NotificationActions } from './actions';
import { StorageActions } from './storage.action';

export const WORKBENCH_APP_ACTIONS = '@Workbench!App';
export const WORKBENCH_APP_UPDATE_PHASE = `${WORKBENCH_APP_ACTIONS}/UpdatePhase`;
export const WorkbenchAppActions = {
  updatePhase: (phase: IWorkbenchPhase) => {
    return {
      type: WORKBENCH_APP_UPDATE_PHASE,
      value: phase,
    };
  },
};

type ActionTypes = ReturnType<
  | (typeof WorkbenchAppActions)[keyof typeof WorkbenchAppActions]
  | (typeof NotificationActions)[keyof typeof NotificationActions]
  | (typeof StorageActions)[keyof typeof StorageActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const workbenchActionsThunk = {
  initializeWorkbench:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      _getState: () => RootState
    ) => {
      // TODO Write necessary logics.
      console.log('Initialize workbench');
      dispatch(WorkbenchAppActions.updatePhase('editing'));
    },
};
