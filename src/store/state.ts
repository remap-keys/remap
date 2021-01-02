import { Device } from '../actions/actions';
import {
  Key,
  MacroKeycodeType,
} from '../components/configure/keycodes/Keycodes.container';
import { IHid, IKeyboard } from '../services/hid/hid';
import { WebHid } from '../services/hid/web-hid';

export type RootState = {
  entities: {
    device: {
      vendorId: number;
      productId: number;
      name: string | null;
    };
    macros: {
      [id in MacroKeycodeType]: string;
    };
  };
  hid: {
    instance: IHid;
    devices: { [id: number]: Device }; // DEPRECTAED: use keyboards
    keyboards: IKeyboard[]; // authorized keyboard list
    openedDeviceId: number; // DEPRECATED: use openedKeyboard
    openedKeyboard: IKeyboard | null;
  };
  keycodes: {
    categoryIndex: number;
  };
  keycodeKey: {
    selectedKey: Key | null;
    hoverKey: Key | null;
  };
};

export const INIT_STATE: RootState = {
  entities: {
    device: {
      vendorId: NaN,
      productId: NaN,
      name: null,
    },
    macros: {
      M0: '',
      M1: '',
      M2: '',
      M3: '',
      M4: '',
      M5: '',
      M6: '',
      M7: '',
      M8: '',
      M9: '',
      M10: '',
      M11: '',
      M12: '',
      M13: '',
      M14: '',
      M15: '',
    },
  },
  hid: {
    instance: new WebHid(),
    devices: {
      // TODO: get initial devices
      0: { productName: 'Lunakey Pro', vendorId: 39321, productId: 1 },
      1: { productName: 'Lunakey Mini', vendorId: 22868, productId: 1 },
    },
    keyboards: [],
    openedDeviceId: NaN, // id of hid.devices
    openedKeyboard: null, // hid.keyboards[i]
  },
  keycodes: {
    categoryIndex: NaN,
  },
  keycodeKey: {
    selectedKey: null,
    hoverKey: null,
  },
};
