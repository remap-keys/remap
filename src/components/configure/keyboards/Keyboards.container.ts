import { connect } from 'react-redux';
import Keyboards from './Keyboards';
import { RootState } from '../../../store/state';
import { AppActions, KeyboardsActions } from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  return {
    layerCount: state.entities.device.layerCount,
    selectedLayer: state.keyboards.selectedLayer,
    selectedKeyboardOptions: state.layoutOptions.selectedOptions,
    remaps: state.app.remaps,
    keyboardKeymap: state.entities.keyboardDefinition?.layouts.keymap,
    keyboardLabels: state.entities.keyboardDefinition?.layouts.labels,
  };
};
export type KeyboardsStateType = ReturnType<typeof mapStateToProps>;

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

export type KeyboardsActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Keyboards);
