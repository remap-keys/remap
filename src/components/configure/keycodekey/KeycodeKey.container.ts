import { connect } from 'react-redux';
import KeycodeKey, { KeycodeKeyProps } from './KeycodeKey';
import { RootState } from '../../../store/state';
import { MacroKeycode, MacroKeycodeType } from '../keycodes/Keycodes.container';
import { KeycodeKeyActions } from '../../../actions/actions';

export type KeycodeKeyStateType = {
  selected: boolean;
  clickable: boolean;
};

const mapStateToProps = (
  state: RootState,
  ownProps: KeycodeKeyProps
): KeycodeKeyStateType => {
  return {
    selected: state.keycodeKey.selectedKey == ownProps.value,
    clickable:
      0 <= MacroKeycode.indexOf(ownProps.value.code as MacroKeycodeType),
  };
};

const mapDispatchToProps = {
  clickKey: KeycodeKeyActions.updateSelectedKey,
  hoverKey: KeycodeKeyActions.updateHoverKey,
};
export type KeycodeKeyActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(KeycodeKey);
