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
    keyboards: IKeyboard[]; // authorized keyboard list
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

const webHid: IHid = new WebHid();
webHid.setConnectionEventHandler({
  connect: (connectedKeyboard: IKeyboard) => {},

  disconnect: (disconnectedKeyboard: IKeyboard) => {},
});

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
    instance: webHid,
    keyboards: [],
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
