import { IKeyboardsPhase } from '../store/state';

export const KEYBOARDS_APP_ACTIONS = '@KeyboardsApp';
export const KEYBOARDS_APP_UPDATE_PHASE = `${KEYBOARDS_APP_ACTIONS}/UpdatePhase`;
export const KeyboardsAppActions = {
  updatePhase: (phase: IKeyboardsPhase) => {
    return {
      type: KEYBOARDS_APP_UPDATE_PHASE,
      value: phase,
    };
  },
};
