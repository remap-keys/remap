import { connect } from 'react-redux';
import Keydiff from './Keydiff';
import { RootState } from '../../../store/state';
import {
  KeydiffActions,
  AppActions,
  KeymapActions,
} from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  return {
    keydiff: state.configure.keydiff,
    selectedLayer: state.configure.keymap.selectedLayer,
    selectedPos: state.configure.keymap.selectedPos,
    labelLang: state.app.labelLang,
  };
};
export type KeydiffStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickCancel: (layer: number, pos: string) => {
      _dispatch(AppActions.remapsRemoveKey(layer, pos));
      _dispatch(KeymapActions.clearSelectedPos());
      _dispatch(KeydiffActions.clearKeydiff());
    },
  };
};
export type KeydiffActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Keydiff);
