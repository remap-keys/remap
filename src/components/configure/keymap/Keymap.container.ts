import { connect } from 'react-redux';
import Keymap from './Keymap';
import { IKeySwitchOperation, RootState } from '../../../store/state';
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
    encodersKeymaps: state.entities.device.encodersKeymaps,
    layerCount: state.entities.device.layerCount,
    selectedKeyboardOptions: state.configure.layoutOptions.selectedOptions,
    selectedLayer: state.configure.keymap.selectedLayer,
    selectedPos: state.configure.keymap.selectedPos,
    selectedEncoderId: state.configure.keymap.selectedEncoderId,
    selectedKeySwitchOperation:
      state.configure.keymap.selectedKeySwitchOperation,
    remaps: state.app.remaps,
    encodersRemaps: state.app.encodersRemaps,
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
      _dispatch(KeymapActions.clearSelectedKeyPosition());
      _dispatch(KeymapActions.updateSelectedLayer(layer));
    },
    onChangeLangLabel: (
      labelLang: KeyboardLabelLang,
      orgKeymap: IKeymap | null,
      dstKeymap: IKeymap | null,
      customKeycodes: ICustomKeycode[] | undefined,
    ) => {
      _dispatch(AppActions.updateLangLabel(labelLang));
      _dispatch(hidActionsThunk.updateKeymaps(labelLang));

      if (orgKeymap && dstKeymap) {
        const newOrgKeymap = KeycodeList.getKeymap(
          orgKeymap.code,
          labelLang,
          customKeycodes,
        );
        const newDstKeymap = KeycodeList.getKeymap(
          dstKeymap.code,
          labelLang,
          customKeycodes,
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
      dstKeymap: IKeymap,
    ) => {
      _dispatch(AppActions.remapsSetKey(selectedLayer, pos, dstKeymap));
      _dispatch(KeydiffActions.updateKeydiff(orgKeymap, dstKeymap));
    },
    updateEncoderKeymap: (
      selectedLayer: number,
      encoderId: number,
      orgKeymap: IKeymap,
      dstKeymap: IKeymap,
      keySwitchOperation: IKeySwitchOperation,
    ) => {
      _dispatch(
        AppActions.encodersRemapsSetKey(
          selectedLayer,
          encoderId,
          dstKeymap,
          keySwitchOperation,
        ),
      );
      _dispatch(KeydiffActions.updateKeydiff(orgKeymap, dstKeymap));
    },
    revertKeymap: (selectedLayer: number, pos: string) => {
      _dispatch(AppActions.remapsRemoveKey(selectedLayer, pos));
      _dispatch(KeydiffActions.clearKeydiff());
    },
    revertEncoderKeymap: (
      selectedLayer: number,
      encoderId: number,
      keySwitchOperation: IKeySwitchOperation,
    ) => {
      _dispatch(
        AppActions.encodersRemapsRemoveKey(
          selectedLayer,
          encoderId,
          keySwitchOperation,
        ),
      );
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
      pos: string,
      encoderId: number | null,
      keySwitchOperation: IKeySwitchOperation,
    ) => {
      if (newKey.keymap.code != oldKeycode) {
        if (keySwitchOperation === 'click') {
          _dispatch(AppActions.remapsSetKey(selectedLayer, pos, newKey.keymap));
        } else {
          _dispatch(
            AppActions.encodersRemapsSetKey(
              selectedLayer,
              encoderId!,
              newKey.keymap,
              keySwitchOperation,
            ),
          );
        }
      }
    },
    onKeyUp: (
      nextPos: string,
      nextEncoderId: number | null,
      nextKeySwitchOperation: IKeySwitchOperation,
    ) => {
      _dispatch(KeydiffActions.clearKeydiff());
      _dispatch(
        KeymapActions.updateSelectedKeyPosition(
          nextPos,
          nextEncoderId,
          nextKeySwitchOperation,
        ),
      );
    },
  };
};

export type KeymapActionsType = ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Keymap);
