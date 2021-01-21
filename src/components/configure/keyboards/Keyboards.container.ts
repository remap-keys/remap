import { connect } from 'react-redux';
import Keyboards from './Keyboards';
import { RootState } from '../../../store/state';
import { AppActions, KeyboardsActions } from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  const layerCount = state.entities.device.layerCount;
  return {
    appName: state.app.package.name,
    appVersion: state.app.package.version,
    layers: [...Array(layerCount)].map((_, i) => i),
    selectedLayer: state.keyboards.selectedLayer,
    selectedKeyboardOptions: state.layoutOptions.selectedOptions,
    keymaps: state.entities.device.keymaps,
    remaps: state.app.remaps,
    keyboardDefinition: state.entities.keyboardDefinition,
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
