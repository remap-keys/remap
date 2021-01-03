import { Key } from '../components/configure/keycodes/Keycodes.container';
import { IHid, IKeyboard, IKeycodeCategory } from '../services/hid/hid';
import { WebHid } from '../services/hid/web-hid';

export type RootState = {
  entities: {
    device: {
      vendorId: number;
      productId: number;
      name: string | null;
      layerCount: number;
    };
    macros: {
      [id: number]: string;
    };
  };
  hid: {
    instance: IHid;
    keyboards: IKeyboard[]; // authorized keyboard list
    openedKeyboard: IKeyboard | null;
  };
  keyboards: {
    layerCount: number;
  };
  keycodes: {
    category: string;
    keys: { [category: string]: Key[] };
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
      layerCount: NaN,
    },
    macros: {},
  },
  hid: {
    instance: webHid,
    keyboards: [],
    openedKeyboard: null, // hid.keyboards[i]
  },
  keyboards: {
    layerCount: NaN,
  },
  keycodes: {
    category: IKeycodeCategory.BASIC,
    keys: {},
  },
  keycodeKey: {
    selectedKey: null,
    hoverKey: null,
  },
};
