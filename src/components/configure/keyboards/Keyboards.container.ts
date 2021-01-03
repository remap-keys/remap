import { connect } from 'react-redux';
import Keyboards from './Keyboards';
import { RootState } from '../../../store/state';

export type KeyboardsStateType = {
  layers: number[];
};
const mapStateToProps = (state: RootState): KeyboardsStateType => {
  const layerCount = state.entities.device.layerCount;
  return {
    layers: [...Array(layerCount)].map((_, i) => i),
  };
};

const mapDispatchToProps = {};

export type KeyboardsActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Keyboards);
