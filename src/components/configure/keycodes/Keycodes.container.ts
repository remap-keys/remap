import { connect } from 'react-redux';
import Keycodes from './Keycodes';
import { StateType } from '../../../store/state';

export const KEYCODES_ACTIONS = '@Keycodes';
export const KEYCODES_UPDATE_CATEGORY_INDEX = `${KEYCODES_ACTIONS}/UpdateCategoryIndex`;

export const KEYCODES_UPDATE_MACRO = `${KEYCODES_ACTIONS}/UpdateMacro`;

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

export type KeycodesActionsType = typeof KeycodesActions;

const KeycodesActions = {
  selectCategoryIndex(value: number) {
    return {
      type: KEYCODES_UPDATE_CATEGORY_INDEX,
      value: value,
    };
  },

  setMacro(code: MacroKeycodeType, text: string) {
    return {
      type: KEYCODES_UPDATE_MACRO,
      value: { code: code, text: text },
    };
  },
};

export type KeycodesStateType = {
  categoryIndex: number;
  selectedKey: Key | null;
  hoverKey: Key | null;
  macroText: string | null;
};

const mapStateToProps = (state: StateType): KeycodesStateType => {
  const code: MacroKeycodeType = state.keycodekey.selectedKey
    ?.code as MacroKeycodeType;
  const macroText =
    0 <= MacroKeycode.indexOf(code) ? state.entities.macros[code] : null;

  return {
    categoryIndex: state.keycodes.categoryIndex,
    hoverKey: state.keycodekey.hoverKey,
    selectedKey: state.keycodekey.selectedKey,
    macroText: macroText,
  };
};

const mapDispatchToProps = KeycodesActions;

export default connect(mapStateToProps, mapDispatchToProps)(Keycodes);
