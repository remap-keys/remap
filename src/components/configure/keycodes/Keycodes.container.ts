import { connect } from 'react-redux';
import Keycodes from './Keycodes';
import { RootState } from '../../../store/state';
import { KeycodesActions } from '../../../actions/actions';
import { IKeycodeCategory } from '../../../services/hid/hid';

const mapStateToProps = (state: RootState) => {
  const code = state.keycodeKey.selectedKey?.keycodeInfo.code;
  let macroText: string | null;
  const keys = state.keycodes.keys[IKeycodeCategory.MACRO];
  if (keys) {
    const key = keys.find((key) => key.keycodeInfo.code === code);
    macroText = key ? state.entities.device.macros[key.keycodeInfo.code] : null;
  } else {
    macroText = null;
  }

  return {
    category: state.keycodes.category,
    keys: state.keycodes.keys,
    hoverKey: state.keycodeKey.hoverKey,
    selectedKey: state.keycodeKey.selectedKey,
    macroText,
  };
};
export type KeycodesStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {
  selectCategory: KeycodesActions.updateCategory,
  setMacro: KeycodesActions.updateMacro,
  loadKeycodeInfoForAllCategories:
    KeycodesActions.loadKeycodeInfoForAllCategories,
};

export type KeycodesActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Keycodes);
