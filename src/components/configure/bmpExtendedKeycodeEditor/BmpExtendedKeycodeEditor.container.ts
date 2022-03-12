import { connect } from 'react-redux';
import BmpExtendedKeycodeEditor from './BmpExtendedKeycodeEditor';
import { RootState } from '../../../store/state';
import { BmpExtendedKeycodeEditorActions } from '../../../actions/bmpExtendedKeycode.action';
import { IBmpExtendedKeycode } from '../../../services/hid/bmp/BmpExtendedKeycode';
import { HidActions } from '../../../actions/hid.action';

const mapStateToProps = (state: RootState) => {
  return {
    extendedKeyId: state.configure.bmpExtendedKeycodeEditor.id,
    extendedKeycode: state.configure.bmpExtendedKeycodeEditor.extendedKeycode,
    keyboardWidth: state.app.keyboardWidth,
    keyboardHeight: state.app.keyboardHeight,
    labelLang: state.app.labelLang,
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
    updateBmpExtendedKeycode: (
      id: number,
      extendedKeycode: IBmpExtendedKeycode
    ) => {
      _dispatch(
        BmpExtendedKeycodeEditorActions.updateExtendedKeycode(extendedKeycode)
      );
      _dispatch(HidActions.updateBmpExtendedKeycode(id, extendedKeycode));
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
