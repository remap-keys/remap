import { connect } from 'react-redux';
import Content from './Content';
import { RootState } from '../../../store/state';
import { Device } from '../../../actions/actions';

export type ContentStateType = {
  openedDeviceId: number;
  devices: { [id: number]: Device };
};
const mapStateToProps = (state: RootState): ContentStateType => {
  return {
    openedDeviceId: state.hid.openedDeviceId,
    devices: state.hid.devices,
  };
};

const mapDispatchToProps = {};

export type ContentActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Content);
