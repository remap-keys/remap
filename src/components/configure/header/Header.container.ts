import { connect } from 'react-redux';
import Header from './Header';
import { RootState } from '../../../store/state';
import { Device } from '../../../actions/actions';
import { hidActionsThunk } from '../../../actions/hid.action';

export type HeaderStateType = {
  connected: boolean;
  connectedDeviceId: number;
  keyboardName: string;
  vendorId: number;
  productId: number;
  devices: { [id: number]: Device };
};
const mapStateToProps = (state: RootState): HeaderStateType => {
  const deviceId: number = state.hid.connectedDeviceId;
  const device: Device = state.hid.devices[deviceId];
  return {
    connected: 0 <= deviceId,
    connectedDeviceId: state.hid.connectedDeviceId,
    keyboardName: device?.name || '',
    vendorId: device?.vendorId || NaN,
    productId: device?.productId || NaN,
    devices: state.hid.devices,
  };
};

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickDeviceMenuItem: (id: number) =>
      _dispatch(hidActionsThunk.connectDevice(id)),

    onClickAnotherDevice: () =>
      _dispatch(hidActionsThunk.connectAnotherDevice()),
    onClickDeviceMenu: () =>
      _dispatch(hidActionsThunk.updateAuthorizedDeviceList()),
  };
};

export type HeaderActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
