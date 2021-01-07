import { Key } from '../components/configure/keycodes/Keycodes.container';
import {
  IHid,
  IKeyboard,
  IKeycodeCategory,
  IKeymap,
} from '../services/hid/hid';
import { WebHid } from '../services/hid/web-hid';

export type RootState = {
  entities: {
    device: {
      vendorId: number;
      productId: number;
      name: string | null;
      layerCount: number;
      rowCount: number;
      columnCount: number;
      keymaps: {
        [pos: string]: IKeymap;
      }[];
      macros: {
        [id: number]: string;
      };
    };
    keyboards: IKeyboard[]; // authorized keyboard list
    openedKeyboard: IKeyboard | null;
  };
  app: {
    openingKeyboard: boolean; // loading status of open and init keyboard
  };
  header: {
    flushLoading: boolean;
  };
  hid: {
    instance: IHid;
  };
  keyboards: {
    selectedLayer: number;
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
      rowCount: 8, // TODO: update by config file
      columnCount: 6, // TODO: update by config file
      keymaps: [],
      macros: {},
    },
    keyboards: [],
    openedKeyboard: null, // hid.keyboards[i]
  },
  app: {
    openingKeyboard: false,
  },
  header: {
    flushLoading: false,
  },
  hid: {
    instance: webHid,
  },
  keyboards: {
    selectedLayer: NaN,
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
