import { connect } from 'react-redux';
import Keymap from './Keymap';
import { RootState } from '../../../store/state';
import { AppActions, KeyboardsActions } from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  return {
    draggingKey: state.configure.keycodeKey.draggingKey,
    keyboard: state.entities.keyboard,
    keyboardKeymap: state.entities.keyboardDefinition?.layouts.keymap,
    keyboardLabels: state.entities.keyboardDefinition?.layouts.labels,
    keymaps: state.entities.device.keymaps,
    layerCount: state.entities.device.layerCount,
    selectedKeyboardOptions: state.configure.layoutOptions.selectedOptions,
    selectedLayer: state.configure.keyboards.selectedLayer,
    remaps: state.app.remaps,
  };
};
export type KeymapStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickLayerNumber: (layer: number) => {
      _dispatch(KeyboardsActions.clearSelectedPos());
      _dispatch(KeyboardsActions.updateSelectedLayer(layer));
    },
    setKeyboardSize: (width: number, height: number) => {
      _dispatch(AppActions.updateKeyboardSize(width, height));
    },
  };
};

export type KeymapActionsType = ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Keymap);
