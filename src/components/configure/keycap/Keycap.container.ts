import { connect } from 'react-redux';
import Keycap from './Keycap';

import {
  KeymapActions,
  KeydiffActions,
  AppActions,
} from '../../../actions/actions';
import { Key } from '../keycodekey/KeyGen';
import { IKeySwitchOperation, RootState } from '../../../store/state';

const mapStateToProps = (state: RootState) => {
  return {
    draggingKey: state.configure.keycodeKey.draggingKey,
    selectedLayer: state.configure.keymap.selectedLayer,
    testMatrix: state.configure.keymapToolbar.testMatrix,
    labelLang: state.app.labelLang,
  };
};
export type KeycapStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickEncoderToggle: (
      pos: string,
      encoderId: number | null,
      keySwitchOperation: IKeySwitchOperation,
      isSelectedKey: boolean,
      orgKey: Key,
      dstKey: Key | null
    ) => {
      if (isSelectedKey) {
        if (dstKey) {
          // show key diff
          _dispatch(KeydiffActions.updateKeydiff(orgKey.keymap, dstKey.keymap));
        } else {
          // clear diff display
          _dispatch(KeydiffActions.clearKeydiff());
        }
        _dispatch(
          KeymapActions.updateSelectedKeyPosition(
            pos,
            encoderId,
            keySwitchOperation
          )
        );
      }
    },
    onClickKeycap: (
      pos: string,
      encoderId: number | null,
      keySwitchOperation: IKeySwitchOperation,
      isSelectedKey: boolean,
      orgKey: Key,
      dstKey: Key | null
    ) => {
      if (dstKey) {
        // show key diff
        _dispatch(KeydiffActions.updateKeydiff(orgKey.keymap, dstKey.keymap));
      } else if (!isSelectedKey) {
        // clear diff display
        _dispatch(KeydiffActions.clearKeydiff());
      }
      // set new selected Position and
      _dispatch(
        KeymapActions.updateSelectedKeyPosition(
          pos,
          encoderId,
          keySwitchOperation
        )
      );
    },
    onDropKeycode: (
      draggingKey: Key,
      selectedLayer: number,
      pos: string,
      isSelectedKey: boolean,
      orgKey: Key
    ) => {
      if (draggingKey.keymap.code === orgKey.keymap.code) {
        if (isSelectedKey) {
          // clear diff display
          _dispatch(KeydiffActions.clearKeydiff());
        }
        _dispatch(AppActions.remapsRemoveKey(selectedLayer, pos));
      } else {
        if (isSelectedKey) {
          // show key diff
          _dispatch(
            KeydiffActions.updateKeydiff(orgKey.keymap, draggingKey.keymap)
          );
        }
        _dispatch(
          AppActions.remapsSetKey(selectedLayer, pos, draggingKey.keymap)
        );
      }
    },
    onDropKeycodeToEncoder: (
      draggingKey: Key,
      selectedLayer: number,
      encoderId: number,
      keySwitchOperation: IKeySwitchOperation,
      isSelectedKey: boolean,
      orgKey: Key
    ) => {
      if (orgKey.keymap.unavailable) {
        return;
      }
      if (draggingKey.keymap.code === orgKey.keymap.code) {
        if (isSelectedKey) {
          // clear diff display
          _dispatch(KeydiffActions.clearKeydiff());
        }
        _dispatch(
          AppActions.encodersRemapsRemoveKey(
            selectedLayer,
            encoderId,
            keySwitchOperation
          )
        );
      } else {
        if (isSelectedKey) {
          // show key diff
          _dispatch(
            KeydiffActions.updateKeydiff(orgKey.keymap, draggingKey.keymap)
          );
        }
        _dispatch(
          AppActions.encodersRemapsSetKey(
            selectedLayer,
            encoderId,
            draggingKey.keymap,
            keySwitchOperation
          )
        );
      }
    },
  };
};

export type KeycapActionsType = ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Keycap);
