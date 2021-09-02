import { connect } from 'react-redux';
import MacroEditor from './MacroEditor';
import { RootState } from '../../../store/state';
import { MacroEditorActions } from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  return {
    draggingKey: state.configure.keycodeKey.draggingKey,
    keyboardWidth: state.app.keyboardWidth,
    keyboardHeight: state.app.keyboardHeight,
    macroKey: state.configure.macroEditor.key,
    macroKeys: state.configure.macroEditor.keys,
  };
};
export type MacroEditorStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    closeMacroEditor: () => {
      _dispatch(MacroEditorActions.updateMacroKey(null));
    },
  };
};
export type MacroEditorActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(MacroEditor);
