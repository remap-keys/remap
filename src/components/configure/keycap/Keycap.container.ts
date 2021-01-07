import { connect } from 'react-redux';
import Keycap from './Keycap';
import { RootState } from '../../../store/state';
import {
  KeyboardsActions,
  KeydiffActions,
  AppActions,
} from '../../../actions/actions';
import { Key } from '../keycodekey/KeycodeKey.container';
import KeyModel from '../../../models/KeyModel';

const mapStateToProps = (state: RootState) => {
  return {
    draggingKey: state.keycodeKey.draggingKey,
    selectedPos: state.keyboards.selectedPos,
    selectedLayer: state.keyboards.selectedLayer,
    remaps: state.app.remaps,
  };
};
export type KeycapStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickKeycap: (
      selectedPos: string,
      model: KeyModel,
      dstKey: Key | null
    ) => {
      if (selectedPos == model.pos) {
        console.log('hoge');
        // toggle selected keycap
        _dispatch(KeydiffActions.clearKeydiff());
        _dispatch(KeyboardsActions.clearSelectedPos());

        return;
      }

      // set new selected Position and show key diff
      if (dstKey) {
        _dispatch(
          KeydiffActions.updateKeydiff(model.keycode, dstKey.keycodeInfo)
        );
      } else {
        _dispatch(KeydiffActions.clearKeydiff());
      }

      _dispatch(KeyboardsActions.updateSelectedPos(model.pos));
    },
    onDropKeycode: (
      draggingKey: Key,
      selectedLayer: number,
      originalModel: KeyModel
    ) => {
      const pos = originalModel.pos;

      _dispatch(
        AppActions.remapsSetKey(selectedLayer, pos, draggingKey.keycodeInfo)
      );
      _dispatch(
        KeydiffActions.updateKeydiff(
          originalModel.keycode,
          draggingKey?.keycodeInfo
        )
      );
      _dispatch(KeyboardsActions.updateSelectedPos(originalModel.pos));
    },
  };
};

export type KeycapActionsType = ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Keycap);
