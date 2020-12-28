import { combineReducers } from 'redux';
import keycodes from '../components/configure/keycodes/Keycodes.reducer';

const reducers = combineReducers({
  keycodes,
});

export default reducers;
