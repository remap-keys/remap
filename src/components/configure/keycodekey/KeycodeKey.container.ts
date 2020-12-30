import { connect } from 'react-redux';
import KeycodeKey, { KeycodeKeyProps } from './KeycodeKey';
import { StateType } from '../../../store/state';
import {
  Key,
  MacroKeycode,
  MacroKeycodeType,
} from '../keycodes/Keycodes.container';

export const KEYCODEKEY_ACTIONS = '@KeycodeKey';
export const KEYCODEKEY_UPDATE_SELECTED_KEY = `${KEYCODEKEY_ACTIONS}/UpdateSelectedKey`;
export const KEYCODEKEY_UPDATE_HOVER_KEY = `${KEYCODEKEY_ACTIONS}/UpdateHoverKey`;

export type KeycodeKeyActionsType = typeof KeycodeKeyActions;

const KeycodeKeyActions = {
  clickKey(key: Key) {
    return {
      type: KEYCODEKEY_UPDATE_SELECTED_KEY,
      value: key,
    };
  },
  hoverKey(key: Key | null) {
    return {
      type: KEYCODEKEY_UPDATE_HOVER_KEY,
      value: key,
    };
  },
};

export type KeycodeKeyStateType = {
  selected: boolean;
  clickable: boolean;
};

const mapStateToProps = (
  state: StateType,
  ownProps: KeycodeKeyProps
): KeycodeKeyStateType => {
  return {
    selected: state.keycodekey.selectedKey == ownProps.value,
    clickable:
      0 <= MacroKeycode.indexOf(ownProps.value.code as MacroKeycodeType),
  };
};

const mapDispatchToProps = KeycodeKeyActions;

export default connect(mapStateToProps, mapDispatchToProps)(KeycodeKey);
