import { connect } from 'react-redux';
import Keydiff from './Keydiff';
import { RootState } from '../../../store/state';
import { KeydiffActions, RemapsActions } from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  return {
    origin: state.keydiff.origin,
    destination: state.keydiff.destination,
    selectedLayer: state.keyboards.selectedLayer,
  };
};
export type KeydiffStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickCancel: (layer: number, pos: string) => {
      _dispatch(RemapsActions.removeKey(layer, pos));
      _dispatch(KeydiffActions.clearKeydiff());
    },
  };
};
export type KeydiffActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Keydiff);
