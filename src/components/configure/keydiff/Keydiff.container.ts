import { connect } from 'react-redux';
import Keydiff from './Keydiff';
import { RootState } from '../../../store/state';
import {
  KeydiffActions,
  AppActions,
  KeyboardsActions,
} from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  return {
    keydiff: state.keydiff,
    selectedLayer: state.keyboards.selectedLayer,
    selectedPos: state.keyboards.selectedPos,
  };
};
export type KeydiffStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickCancel: (layer: number, pos: string) => {
      _dispatch(AppActions.remapsRemoveKey(layer, pos));
      _dispatch(KeyboardsActions.clearSelectedPos());
      _dispatch(KeydiffActions.clearKeydiff());
    },
  };
};
export type KeydiffActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Keydiff);
