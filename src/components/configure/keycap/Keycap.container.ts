import { connect } from 'react-redux';
import Keycap from './Keycap';
import { RootState } from '../../../store/state';
import {
  KeyboardsActions,
  KeydiffActions,
  RemapsActions,
} from '../../../actions/actions';
import { Key } from '../keycodes/Keycodes.container';
import KeyModel from '../../../models/KeyModel';

const mapStateToProps = (state: RootState) => {
  return {
    inner: {
      // These props are NOT affect the View, use dispatch process ONLY.
      draggingKey: state.keycodeKey.draggingKey,
      selectedLayer: state.keyboards.selectedLayer,
      selectedPos: state.keyboards.selectedPos,
      keymaps: state.entities.device.keymaps,
      remaps: state.remaps,
    },
  };
};
export type KeycapStateType = ReturnType<typeof mapStateToProps>;
type KeycapInnerStateType = ReturnType<typeof mapStateToProps>['inner'];

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickKeycap: (innerState: KeycapInnerStateType, model: KeyModel) => {
      if (innerState.selectedPos === model.pos) {
        // toggle selected keycap
        _dispatch(KeyboardsActions.clearSelectedPos());
        _dispatch(KeydiffActions.clearKeydiff());
      } else {
        // set new selected Position and show key diff
        const pos = model.pos;
        const keymap = innerState.keymaps[innerState.selectedLayer];
        const originalKeyInfo = keymap[pos].keycodeInfo!;

        // TODO: change the keytop label according to the platform, like JIS keyboard, mac US keyboard
        const originalKey: Key = {
          label: originalKeyInfo.label,
          meta: '',
          keycodeInfo: originalKeyInfo,
        };
        const remap = innerState.remaps[innerState.selectedLayer];
        if (Object.prototype.hasOwnProperty.call(remap, model.pos)) {
          const origModel = model.cloneWithLocalPosition(originalKey);
          const dstModel = model.cloneWithLocalPosition(null);
          _dispatch(KeydiffActions.updateKeydiff(origModel, dstModel));
        }

        _dispatch(KeyboardsActions.updateSelectedPos(model.pos));
      }
    },
    onDropKeycode: (
      innerState: KeycapInnerStateType,
      originalModel: KeyModel
    ) => {
      const origModel = originalModel.cloneWithLocalPosition(null);
      const dstModel = originalModel.cloneWithLocalPosition(
        innerState.draggingKey
      );
      _dispatch(RemapsActions.setKey(innerState.selectedLayer, dstModel));
      _dispatch(KeydiffActions.updateKeydiff(origModel, dstModel));
      _dispatch(KeyboardsActions.updateSelectedPos(origModel.pos));
    },
  };
};

export type KeycapActionsType = ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Keycap);
