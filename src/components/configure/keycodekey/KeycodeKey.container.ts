import { connect } from 'react-redux';
import KeycodeKey, { KeycodeKeyOwnProps } from './KeycodeKey';
import { RootState } from '../../../store/state';
import { KeycodeKeyActions } from '../../../actions/actions';
import { IKeycodeCategory } from '../../../services/hid/hid';
import { Key } from '../keycodes/Keycodes.container';

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

const mapDispatchToProps = (_dispatch: any) => {
  return {
    clickKey: (key: Key) => {
      _dispatch(KeycodeKeyActions.updateSelectedKey(key));
    },
    hoverKey: (key: Key | null) => {
      _dispatch(KeycodeKeyActions.updateHoverKey(key));
    },
    startDraggingKeycode: (key: Key) => {
      _dispatch(KeycodeKeyActions.updateDraggingKey(key));
    },
    endDraggingKeycode: () => {
      _dispatch(KeycodeKeyActions.updateDraggingKey(null));
    },
  };
};
export type KeycodeKeyActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeycodeKey);
