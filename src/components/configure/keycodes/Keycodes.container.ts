import { connect } from 'react-redux';
import Keycodes from './Keycodes';
import { RootState } from '../../../store/state';
import { KeycodesActions } from '../../../actions/actions';
import { IKeycodeCategory, IKeycodeInfo } from '../../../services/hid/hid';

export type Key = {
  code: number;
  label: string;
  meta: string;
  keycodeInfo: IKeycodeInfo;
};

export type KeycodesStateType = {
  category: string;
  keys: { [category: string]: Key[] };
  selectedKey: Key | null;
  hoverKey: Key | null;
  macroText: string | null;
};

const mapStateToProps = (state: RootState): KeycodesStateType => {
  const code = state.keycodeKey.selectedKey?.code;
  let macroText: string | null;
  const keys = state.keycodes.keys[IKeycodeCategory.MACRO];
  if (keys) {
    const key = keys.find((key) => key.code === code);
    macroText = key ? state.entities.macros[key.code] : null;
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

const mapDispatchToProps = {
  selectCategory: KeycodesActions.updateCategory,
  setMacro: KeycodesActions.updateMacro,
  loadKeycodeInfoForAllCategories:
    KeycodesActions.loadKeycodeInfoForAllCategories,
};

export type KeycodesActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Keycodes);
