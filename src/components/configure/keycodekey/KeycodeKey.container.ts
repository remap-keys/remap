import { connect } from 'react-redux';
import KeycodeKey, { KeycodeKeyOwnProps } from './KeycodeKey';
import { RootState } from '../../../store/state';
import { KeycodeKeyActions } from '../../../actions/actions';
import { IKeycodeCategory } from '../../../services/hid/hid';

const mapStateToProps = (state: RootState, ownProps: KeycodeKeyOwnProps) => {
  const keys = state.keycodes.keys[IKeycodeCategory.MACRO];
  const clickable: boolean = !!(
    keys && keys.find((key) => key.code === ownProps.value.code)
  );
  return {
    selected: state.keycodeKey.selectedKey == ownProps.value,
    clickable,
  };
};
export type KeycodeKeyStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {
  clickKey: KeycodeKeyActions.updateSelectedKey,
  hoverKey: KeycodeKeyActions.updateHoverKey,
};
export type KeycodeKeyActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(KeycodeKey);
