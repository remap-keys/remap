import { connect } from 'react-redux';
import Keycodes from './Keycodes';
import { RootState } from '../../../store/state';
import { KeycodeKeyActions, KeycodesActions } from '../../../actions/actions';
import { IHid, IKeycodeCategory } from '../../../services/hid/Hid';

const mapStateToProps = (state: RootState) => {
  const code = state.keycodeKey.selectedKey?.keymap.code;
  let macroText: string | null;
  const keys = state.keycodes.keys[IKeycodeCategory.MACRO];
  if (keys) {
    const key = keys.find((key) => key.keymap.code === code);
    macroText = key ? state.entities.device.macros[key.keymap.code] : null;
  } else {
    macroText = null;
  }

  return {
    _hidInstance: state.hid.instance,
    category: state.keycodes.category,
    draggingKey: state.keycodeKey.draggingKey,
    keys: state.keycodes.keys,
    keyboardWidth: state.app.keyboardWidth,
    selectedKey: state.keycodeKey.selectedKey,
    macroText,
  };
};
export type KeycodesStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    selectCategory: (value: string) => {
      _dispatch(KeycodesActions.updateCategory(value));
    },
    setMacro: (code: number | undefined, text: string) => {
      _dispatch(KeycodesActions.updateMacro(code, text));
    },
    loadKeycodeInfoForAllCategories: (hid: IHid) => {
      _dispatch(KeycodesActions.loadKeycodeInfoForAllCategories(hid));
    },
    releaseSelectedKey: () => {
      _dispatch(KeycodeKeyActions.updateSelectedKey(null));
    },
  };
};

export type KeycodesActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Keycodes);
