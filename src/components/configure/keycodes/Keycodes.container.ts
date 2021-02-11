import { connect } from 'react-redux';
import Keycodes from './Keycodes';
import { RootState } from '../../../store/state';
import { KeycodeKeyActions, KeycodesActions } from '../../../actions/actions';
import { IHid, IKeycodeCategory } from '../../../services/hid/Hid';

const mapStateToProps = (state: RootState) => {
  const code = state.configure.keycodeKey.selectedKey?.keymap.code;
  let macroText: string | null;
  const keys = state.configure.keycodes.keys[IKeycodeCategory.MACRO];
  if (keys) {
    const key = keys.find((key) => key.keymap.code === code);
    macroText = key ? state.entities.device.macros[key.keymap.code] : null;
  } else {
    macroText = null;
  }

  return {
    _hidInstance: state.hid.instance,
    draggingKey: state.configure.keycodeKey.draggingKey,
    keys: state.configure.keycodes.keys,
    keyboardWidth: state.app.keyboardWidth,
    selectedKey: state.configure.keycodeKey.selectedKey,
    layerCount: state.entities.device.layerCount,
    macroText,
  };
};
export type KeycodesStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    setMacro: (code: number | undefined, text: string) => {
      _dispatch(KeycodesActions.updateMacro(code, text));
    },
    loadKeycodeInfoForAllCategories: (hid: IHid, layerCount: number) => {
      _dispatch(
        KeycodesActions.loadKeycodeInfoForAllCategories(hid, layerCount)
      );
    },
    releaseSelectedKey: () => {
      _dispatch(KeycodeKeyActions.updateSelectedKey(null));
    },
  };
};

export type KeycodesActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Keycodes);
