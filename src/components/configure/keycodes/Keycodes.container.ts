import { connect } from 'react-redux';
import Keycodes from './Keycodes';
import { RootState } from '../../../store/state';
import { KeycodeKeyActions } from '../../../actions/actions';

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
    macroBufferBytes: state.entities.device.macro.bufferBytes,
    macroMaxBufferSize: state.entities.device.macro.maxBufferSize,
    macroMaxCount: state.entities.device.macro.maxCount,
    macroKey: state.configure.macroEditor.key,
    keyboardDefinition: state.entities.keyboardDefinition,
  };
};
export type KeycodesStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    releaseSelectedKey: () => {
      _dispatch(KeycodeKeyActions.updateSelectedKey(null));
    },
  };
};

export type KeycodesActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Keycodes);
