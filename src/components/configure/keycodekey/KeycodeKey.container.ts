import { connect } from 'react-redux';
import KeycodeKey, { AnyKey, KeycodeKeyOwnProps } from './KeycodeKey';
import { RootState } from '../../../store/state';
import {
  AnyKeycodeKeyActions,
  AppActions,
  KeycodeKeyActions,
  KeydiffActions,
} from '../../../actions/actions';
import {
  IKeycodeCategory,
  IKeycodeInfo,
  IKeymap,
} from '../../../services/hid/Hid';
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
  const keys = state.configure.keycodes.keys[IKeycodeCategory.MACRO];
  const clickable: boolean = !!(
    keys && keys.find((key) => key.keymap.code === ownProps.value.keymap.code)
  );
  return {
    keymaps: state.entities.device.keymaps,
    selectedLayer: state.configure.keyboards.selectedLayer,
    selected: state.configure.keycodeKey.selectedKey == ownProps.value,
    selectedKeycapPosition: state.configure.keyboards.selectedPos,
    clickable,
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
    remapKey: (layer: number, pos: string, orig: IKeymap, dest: IKeymap) => {
      _dispatch(AppActions.remapsSetKey(layer, pos, dest));
      _dispatch(KeydiffActions.updateKeydiff(orig, dest));
    },
  };
};
export type KeycodeKeyActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeycodeKey);
