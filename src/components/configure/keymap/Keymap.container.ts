import { connect } from 'react-redux';
import Keymap from './Keymap';
import { RootState } from '../../../store/state';
import {
  AppActions,
  KeydiffActions,
  KeymapActions,
  KeymapToolbarActions,
} from '../../../actions/actions';
import { ICustomKeycode, IKeymap } from '../../../services/hid/Hid';
import { hidActionsThunk } from '../../../actions/hid.action';
import { KeycodeList } from '../../../services/hid/KeycodeList';
import { KeyboardLabelLang } from '../../../services/labellang/KeyLabelLangs';
import { Key } from '../keycodekey/KeyGen';

const mapStateToProps = (state: RootState) => {
  return {
    bleMicroPro: state.entities.device.bleMicroPro,
    draggingKey: state.configure.keycodeKey.draggingKey,
    keyboardKeymap: state.entities.keyboardDefinition?.layouts.keymap,
    keyboardLabels: state.entities.keyboardDefinition?.layouts.labels,
    keydiff: state.configure.keydiff,
    keyboardWidth: state.app.keyboardWidth,
    keyboardHeight: state.app.keyboardHeight,
    keymaps: state.entities.device.keymaps,
    layerCount: state.entities.device.layerCount,
    selectedKeyboardOptions: state.configure.layoutOptions.selectedOptions,
    selectedLayer: state.configure.keymap.selectedLayer,
    selectedPos: state.configure.keymap.selectedPos,
    remaps: state.app.remaps,
    labelLang: state.app.labelLang,
    testMatrix: state.configure.keymapToolbar.testMatrix,
    testedMatrix: state.app.testedMatrix,
    currentTestMatrix: state.app.currentTestMatrix,
    keyboardDefinition: state.entities.keyboardDefinition,
  };
};
export type KeymapStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickLayerNumber: (layer: number) => {
      _dispatch(KeymapActions.clearSelectedPos());
      _dispatch(KeymapActions.updateSelectedLayer(layer));
    },
    onChangeLangLabel: (
      labelLang: KeyboardLabelLang,
      orgKeymap: IKeymap | null,
      dstKeymap: IKeymap | null,
      customKeycodes: ICustomKeycode[] | undefined
    ) => {
      _dispatch(AppActions.updateLangLabel(labelLang));
      _dispatch(hidActionsThunk.updateKeymaps(labelLang));

      if (orgKeymap && dstKeymap) {
        const newOrgKeymap = KeycodeList.getKeymap(
          orgKeymap.code,
          labelLang,
          customKeycodes
        );
        const newDstKeymap = KeycodeList.getKeymap(
          dstKeymap.code,
          labelLang,
          customKeycodes
        );
        _dispatch(KeydiffActions.updateKeydiff(newOrgKeymap, newDstKeymap));
      }
    },
    setKeyboardSize: (width: number, height: number) => {
      _dispatch(AppActions.updateKeyboardSize(width, height));
    },
    updateKeymap: (
      selectedLayer: number,
      pos: string,
      orgKeymap: IKeymap,
      dstKeymap: IKeymap
    ) => {
      _dispatch(AppActions.remapsSetKey(selectedLayer, pos, dstKeymap));
      _dispatch(KeydiffActions.updateKeydiff(orgKeymap, dstKeymap));
    },
    clearSelectedPos: () => {
      _dispatch(KeymapActions.clearSelectedPos());
    },
    revertKeymap: (selectedLayer: number, pos: string) => {
      _dispatch(AppActions.remapsRemoveKey(selectedLayer, pos));
      _dispatch(KeydiffActions.clearKeydiff());
    },
    updateTestMatrixOff: () => {
      _dispatch(AppActions.clearTestedMatrix());
      _dispatch(KeymapToolbarActions.updateTestMatrix(false));
    },
    fetchSwitchMatrixState: () => {
      _dispatch(hidActionsThunk.fetchSwitchMatrixState());
    },
    onKeyDown: (
      newKey: Key,
      oldKeycode: number,
      selectedLayer: number,
      pos: string
    ) => {
      if (newKey.keymap.code != oldKeycode) {
        _dispatch(AppActions.remapsSetKey(selectedLayer, pos, newKey.keymap));
      }
    },
    onKeyUp: (nextPos: string) => {
      _dispatch(KeydiffActions.clearKeydiff());
      _dispatch(KeymapActions.updateSelectedPos(nextPos));
    },
  };
};

export type KeymapActionsType = ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Keymap);
