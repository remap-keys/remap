import { connect } from 'react-redux';
import MacroEditor from './MacroEditor';
import { RootState } from '../../../store/state';
import {
  MacroActionsThunk,
  MacroEditorActions,
} from '../../../actions/macro.action';
import { MacroKey } from '../../../services/macro/Macro';

const mapStateToProps = (state: RootState) => {
  return {
    draggingKey: state.configure.keycodeKey.draggingKey,
    keyboardWidth: state.app.keyboardWidth,
    keyboardHeight: state.app.keyboardHeight,
    macroKey: state.configure.macroEditor.key,
    macroKeys: state.configure.macroEditor.macroKeys,
    maxMacroBufferSize: state.entities.device.macro.maxBufferSize,
    macroBuffer: state.configure.macroEditor.macroBuffer,
  };
};
export type MacroEditorStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    closeMacroEditor: () => {
      _dispatch(MacroEditorActions.clearMacroKey());
    },
    updateMacroKeys: (macroKeys: MacroKey[]) => {
      _dispatch(MacroActionsThunk.updateMacroKeys(macroKeys));
    },
    saveMacro: () => {
      _dispatch(MacroActionsThunk.saveMacro());
    },
  };
};
export type MacroEditorActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(MacroEditor);
