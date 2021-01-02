import { connect } from 'react-redux';
import Header from './Header';
import { RootState } from '../../../store/state';
import { Device } from '../../../actions/actions';
import { hidActionsThunk } from '../../../actions/hid.action';

export type HeaderStateType = {
  openedDeviceId: number;
  productName: string;
  vendorId: number;
  productId: number;
  devices: { [id: number]: Device };
};
const mapStateToProps = (state: RootState): HeaderStateType => {
  const deviceId: number = state.hid.openedDeviceId;
  const device: Device = state.hid.devices[deviceId];
  return {
    openedDeviceId: state.hid.openedDeviceId,
    productName: device?.productName || '',
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
