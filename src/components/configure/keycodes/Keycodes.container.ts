import { connect } from 'react-redux';
import Keycodes from './Keycodes';
import { RootState } from '../../../store/state';
import { KeycodeKeyActions, KeycodesActions } from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  return {
    _hidInstance: state.hid.instance,
    draggingKey: state.configure.keycodeKey.draggingKey,
    keyboardWidth: state.app.keyboardWidth,
    selectedKey: state.configure.keycodeKey.selectedKey,
    layerCount: state.entities.device.layerCount,
    labelLang: state.app.labelLang,
    bleMicroPro: state.entities.device.bleMicroPro,
    testMatrix: state.configure.keymapToolbar.testMatrix,
  };
};
export type KeycodesStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    setMacro: (code: number | undefined, text: string) => {
      _dispatch(KeycodesActions.updateMacro(code, text));
    },
    releaseSelectedKey: () => {
      _dispatch(KeycodeKeyActions.updateSelectedKey(null));
    },
  };
};

export type KeycodesActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Keycodes);
