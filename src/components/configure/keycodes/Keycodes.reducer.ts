import immer from 'immer';
import { INIT_STATE, StateType } from '../../../states/state';
import { ACTION_KEYCODES_CATEGORY_INDEX } from './Keycodes.action';

const reducer = (state = INIT_STATE, action: { type: any; value: any }) =>
  immer(state, (draft: StateType) => {
    switch (action.type) {
      case ACTION_KEYCODES_CATEGORY_INDEX:
        draft.keycodes = {
          categoryIndex: action.value,
        };
        break;
      default:
        return state;
    }
  });

export default reducer;
