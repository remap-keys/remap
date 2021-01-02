import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { IDeviceInformation, IHid, IKeyboard } from '../services/hid/hid';
import { RootState } from '../store/state';
import { Device } from './actions';

export const HID_ACTIONS = '@Hid';
export const HID_OPEN_DEVICE = `${HID_ACTIONS}/OpenDevice`;
export const HID_UPDATE_DEVICE_LIST = `${HID_ACTIONS}/UpdateDeviceList`;
const hidActions = {
  connectDevice: (id: number) => {
    return {
      type: HID_OPEN_DEVICE,
      value: { id: id },
    };
  },

  updateDeviceList: (devices: Device[]) => {
    return {
      type: HID_UPDATE_DEVICE_LIST,
      value: { devices: devices },
    };
  },
};

type ActionTypes = ReturnType<typeof hidActions[keyof typeof hidActions]>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const hidActionsThunk = {
  updateAuthorizedDeviceList: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { hid } = getState();
    const devices: Device[] = await getAuthorizedDevices(hid.instance);
    dispatch(hidActions.updateDeviceList(devices));
  },
  connectDevice: (targetDeviceId: number): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    dispatch(hidActions.connectDevice(targetDeviceId));
    //TODO: close current connected keyboard if exist
    //TODO: open the connected keyboard
    //TODO: update state of connected keyboard
  },
  connectAnotherDevice: (): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { hid } = getState();
    const result = await hid.instance.connect();
    console.log(result);
    //TODO: close current connected keyboard if exist
    //TODO: open the connected keyboard
    //TODO: update state of connected keyboard
  },
};

const getAuthorizedDevices = async (hid: IHid): Promise<Device[]> => {
  //TODO: this method should be called in app init
  const keyboards: IKeyboard[] = await hid.detectKeyboards();

  const devices: Device[] = keyboards.map((kbd) => {
    const info: IDeviceInformation = kbd.getInformation();
    const device: Device = info;
    return device;
  });
  return devices;
};
