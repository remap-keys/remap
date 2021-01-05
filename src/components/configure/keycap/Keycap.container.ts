import { connect } from 'react-redux';
import Keycap from './Keycap';
import { RootState } from '../../../store/state';
import { KeyboardsActions, KeydiffActions } from '../../../actions/actions';
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
    onDropKeycode: (draggingKey: Key, origModel: KeyModel) => {
      console.log(origModel);
      const dstModel: KeyModel = origModel.clone(draggingKey);
      console.log(dstModel);

      // TODO: set histroy state
      _dispatch(KeydiffActions.updateKeydiff(origModel, dstModel)); // TODO: update keydiff.container.ts
    },
  };
};
export type KeycapActionsType = ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Keycap);
