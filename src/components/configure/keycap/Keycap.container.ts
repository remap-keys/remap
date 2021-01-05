import { connect } from 'react-redux';
import Keycap from './Keycap';
import { RootState } from '../../../store/state';
import { KeyboardsActions } from '../../../actions/actions';
import { Key } from '../keycodes/Keycodes.container';
import KeyModel from '../../../models/KeyModel';

const mapStateToProps = (state: RootState) => {
  return {
    draggingKey: state.keycodeKey.draggingKey,
  };
};
export type KeycapStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onDropKeycode: (draggingKey: Key, targetKeyModel: KeyModel) => {
      console.log(targetKeyModel);
      const dstModel: KeyModel = targetKeyModel.clone(draggingKey);
      console.log(dstModel);
    },
  };
};
export type KeycapActionsType = ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Keycap);
