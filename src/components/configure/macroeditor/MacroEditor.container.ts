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
    notifications: state.app.notifications,
    labelLang: state.app.labelLang,
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
    flashMacro: () => {
      _dispatch(MacroActionsThunk.flashMacro());
    },
  };
};
export type MacroEditorActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(MacroEditor);
