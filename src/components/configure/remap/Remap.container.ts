import { connect } from 'react-redux';
import Remap from './Remap';
import { RootState } from '../../../store/state';

const mapStateToProps = (state: RootState) => {
  return {
    hoverKey: state.keycodeKey.hoverKey,
    keyboard: state.entities.keyboard,
    keyboardHeight: state.app.keyboardHeight,
    package: state.app.package,
  };
};
export type RemapStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {};
export type RemapActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Remap);
