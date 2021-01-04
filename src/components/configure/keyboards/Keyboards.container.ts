import { connect } from 'react-redux';
import Keyboards from './Keyboards';
import { RootState } from '../../../store/state';
import { KeyboardsActions } from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  const layerCount = state.entities.device.layerCount;
  return {
    layers: [...Array(layerCount)].map((_, i) => i),
    selectedLayer: state.keyboards.selectedLayer,
    keymaps: state.entities.device.keymaps,
  };
};
export type KeyboardsStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {
  onClickLayerNumber: KeyboardsActions.updateSelectedLayer,
};
export type KeyboardsActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Keyboards);
