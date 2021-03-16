import { connect } from 'react-redux';
import Remap from './Remap';
import { RootState } from '../../../store/state';

const mapStateToProps = (state: RootState) => {
  return {
    hoverKey: state.configure.keycodeKey.hoverKey,
    keyboardHeight: state.app.keyboardHeight, // DO NOT REMOVE!! This component should be updated when the keyboardHeight is set
    keyboardWidth: state.app.keyboardWidth, // DO NOT REMOVE!! This component should be updated when the keyboardWidth is set
  };
};
export type RemapStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {};
export type RemapActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Remap);
