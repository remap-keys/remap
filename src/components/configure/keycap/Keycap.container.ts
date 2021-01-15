import { connect } from 'react-redux';
import Keycap from './Keycap';
import { RootState } from '../../../store/state';
import {
  KeyboardsActions,
  KeydiffActions,
  AppActions,
} from '../../../actions/actions';
import { Key } from '../keycodekey/KeycodeKey.container';

const mapStateToProps = (state: RootState) => {
  return {
    draggingKey: state.keycodeKey.draggingKey,
    selectedPos: state.keyboards.selectedPos,
    selectedLayer: state.keyboards.selectedLayer,
    keymaps: state.entities.device.keymaps,
    remaps: state.app.remaps,
  };
};
export type KeycapStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickKeycap: (
      pos: string,
      isSelectedKey: boolean,
      orgKey: Key,
      dstKey: Key | null
    ) => {
      if (isSelectedKey) {
        console.log('hoge');
        // toggle selected keycap
        _dispatch(KeydiffActions.clearKeydiff());
        _dispatch(KeyboardsActions.clearSelectedPos());

        return;
      }

      // set new selected Position and show key diff
      if (dstKey) {
        _dispatch(KeydiffActions.updateKeydiff(orgKey.keymap, dstKey.keymap));
      } else {
        _dispatch(KeydiffActions.clearKeydiff());
      }

      _dispatch(KeyboardsActions.updateSelectedPos(pos));
    },
    onDropKeycode: (
      draggingKey: Key,
      selectedLayer: number,
      pos: string,
      orgKey: Key
    ) => {
      if (draggingKey.keymap.code === orgKey.keymap.code) {
        return;
      }
      _dispatch(
        AppActions.remapsSetKey(selectedLayer, pos, draggingKey.keymap)
      );
    },
  };
};

export type KeycapActionsType = ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Keycap);
