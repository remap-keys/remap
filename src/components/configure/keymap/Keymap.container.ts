import { connect } from 'react-redux';
import Keymap from './Keymap';
import { RootState } from '../../../store/state';

const mapStateToProps = (state: RootState) => {
  return {
    draggingKey: state.keycodeKey.draggingKey,
  };
};
export type KeymapStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {};
};

export type KeymapActionsType = ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Keymap);
