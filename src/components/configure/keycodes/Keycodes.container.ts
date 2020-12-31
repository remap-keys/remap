import { connect } from 'react-redux';
import Keycodes from './Keycodes';
import { RootState } from '../../../store/state';
import { KeycodesActions } from '../../../actions/actions';

export const MacroKeycode = [
  'M0',
  'M1',
  'M2',
  'M3',
  'M4',
  'M5',
  'M6',
  'M7',
  'M8',
  'M9',
  'M10',
  'M11',
  'M12',
  'M13',
  'M14',
  'M15',
] as const;
export type MacroKeycodeType = typeof MacroKeycode[number];

export type Key = {
  code: string;
  label: string;
  meta: string;
};

export type KeycodesStateType = {
  categoryIndex: number;
  selectedKey: Key | null;
  hoverKey: Key | null;
  macroText: string | null;
};

const mapStateToProps = (state: RootState): KeycodesStateType => {
  const code: MacroKeycodeType = state.keycodeKey.selectedKey
    ?.code as MacroKeycodeType;
  const macroText =
    0 <= MacroKeycode.indexOf(code) ? state.entities.macros[code] : null;

  return {
    categoryIndex: state.keycodes.categoryIndex,
    hoverKey: state.keycodeKey.hoverKey,
    selectedKey: state.keycodeKey.selectedKey,
    macroText: macroText,
  };
};

const mapDispatchToProps = {
  selectCategoryIndex: KeycodesActions.updateCategoryIndex,
  setMacro: KeycodesActions.updateMacro,
};

export type KeycodesActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Keycodes);
