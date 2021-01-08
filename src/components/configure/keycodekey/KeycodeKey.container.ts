import { connect } from 'react-redux';
import KeycodeKey, { KeycodeKeyOwnProps } from './KeycodeKey';
import { RootState } from '../../../store/state';
import { KeycodeKeyActions } from '../../../actions/actions';
import { IKeycodeCategory, IKeymap } from '../../../services/hid/hid';
import KeyModel from '../../../models/KeyModel';

export type Key = {
  label: string;
  meta: string;
  keymap: IKeymap;
};

export const genKey = (keymap: IKeymap): Key => {
  // TODO: change the keytop label according to the platform, like JIS keyboard, mac US keyboard
  if (keymap.isAny) {
    return { label: 'Any', meta: '', keymap };
  } else {
    return { label: keymap.keycodeInfo!.label, meta: '', keymap };
  }
};

const mapStateToProps = (state: RootState, ownProps: KeycodeKeyOwnProps) => {
  const keys = state.keycodes.keys[IKeycodeCategory.MACRO];
  const clickable: boolean = !!(
    keys && keys.find((key) => key.keymap.code === ownProps.value.keymap.code)
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
