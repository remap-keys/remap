import { connect } from 'react-redux';
import BmpExtendedKeycodeEditor from './BmpExtendedKeycodeEditor';
import { RootState } from '../../../store/state';
import { BmpExtendedKeycodeEditorActions } from '../../../actions/bmpExtendedKeycode.action';

const mapStateToProps = (state: RootState) => {
  return {
    extendedKey: state.configure.bmpExtendedKeycodeEditor.key,
    keyboardWidth: state.app.keyboardWidth,
    keyboardHeight: state.app.keyboardHeight,
  };
};
export type BmpExtendedKeycodeEditorStateType = ReturnType<
  typeof mapStateToProps
>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    closeBmpExtendedKeycodeEditor: () => {
      _dispatch(BmpExtendedKeycodeEditorActions.clearExtendedKey());
    },
  };
};
export type BmpExtendedKeycodeEditorActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BmpExtendedKeycodeEditor);
