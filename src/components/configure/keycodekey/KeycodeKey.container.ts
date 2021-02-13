import { connect } from 'react-redux';
import KeycodeKey, { AnyKey, KeycodeKeyOwnProps } from './KeycodeKey';
import { RootState } from '../../../store/state';
import {
  AnyKeycodeKeyActions,
  KeycodeKeyActions,
} from '../../../actions/actions';
import { IKeycodeInfo, IKeymap } from '../../../services/hid/Hid';
import { hexadecimal } from '../../../utils/StringUtils';

export type Key = {
  label: string;
  meta: string;
  keymap: IKeymap;
};

export const genKey = (keymap: IKeymap): Key => {
  // TODO: change the keytop label according to the platform, like JIS keyboard, mac US keyboard
  if (keymap.isAny) {
    return {
      label: keymap.keycodeInfo
        ? keymap.keycodeInfo.label
        : `${hexadecimal(keymap.code)}`,
      meta: '',
      keymap,
    };
  } else {
    return { label: keymap.keycodeInfo!.label, meta: '', keymap };
  }
};

export class KeycodeInfo implements IKeycodeInfo {
  readonly code: number;
  readonly name: { long: string; short: string };
  readonly label: string;
  constructor(label: string, code: number) {
    this.code = code;
    this.name = {
      long: label,
      short: label,
    };
    this.label = label;
  }
}

const mapStateToProps = (state: RootState, ownProps: KeycodeKeyOwnProps) => {
  return {
    keymaps: state.entities.device.keymaps,
    selectedLayer: state.configure.keymap.selectedLayer,
    selected: state.configure.keycodeKey.selectedKey == ownProps.value,
  };
};
export type KeycodeKeyStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    selectKey: (key: Key) => {
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
    updateAnyKey: (index: number, anyKey: AnyKey) => {
      _dispatch(AnyKeycodeKeyActions.updateAnyKey(index, anyKey));
    },
  };
};
export type KeycodeKeyActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeycodeKey);
