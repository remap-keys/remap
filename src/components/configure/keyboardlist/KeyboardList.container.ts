import { connect } from 'react-redux';
import KeyboardList from './KeyboardList';
import { RootState } from '../../../store/state';
import { Device, KeycodesActions } from '../../../actions/actions';
import { hidActionsThunk } from '../../../actions/hid.action';

export type KeyboardListStateType = {
  devices: { [id: number]: Device };
};
const mapStateToProps = (state: RootState): KeyboardListStateType => {
  return {
    devices: state.hid.devices || [],
  };
};

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickItem: (id: number) => {
      _dispatch(hidActionsThunk.connectDevice(id));
      _dispatch(KeycodesActions.updateCategoryIndex(0)); // init keycode categroy
    },
  };
};

export type KeyboardListActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardList);
