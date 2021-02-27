import { connect } from 'react-redux';
import KeycodeKey, { AnyKey, KeycodeKeyOwnProps } from './KeycodeKey';
import { RootState } from '../../../store/state';
import {
  AnyKeycodeKeyActions,
  KeycodeKeyActions,
} from '../../../actions/actions';
import { IKeycodeInfo } from '../../../services/hid/Hid';
import { Key } from './KeyGen';

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
    labelLang: state.app.labelLang,
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
