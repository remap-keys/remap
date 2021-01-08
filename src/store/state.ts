import { Key } from '../components/configure/keycodekey/KeycodeKey.container';
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
    package: {
      name: string;
      version: string;
    };
    openingKeyboard: boolean; // loading status of open and init keyboard
    remaps: {
      // remap candidates and show keydiff
      [pos: string]: IKeymap;
    }[];
  };
  header: {
    flushLoading: boolean;
  };
  hid: {
    instance: IHid;
  };
  keyboards: {
    selectedPos: string;
    selectedLayer: number;
  };
  keycodes: {
    category: string;
    keys: { [category: string]: Key[] };
  };
  keycodeKey: {
    selectedKey: Key | null;
    hoverKey: Key | null;
    draggingKey: Key | null;
  };
  keydiff: {
    origin: IKeymap | null;
    destination: IKeymap | null;
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
    package: {
      name: '',
      version: '',
    },
    openingKeyboard: false,
    remaps: [],
  },
  header: {
    flushLoading: false,
  },
  hid: {
    instance: webHid,
  },
  keyboards: {
    selectedLayer: NaN,
    selectedPos: '',
  },
  keycodes: {
    category: IKeycodeCategory.BASIC,
    keys: {},
  },
  keycodeKey: {
    selectedKey: null,
    hoverKey: null,
    draggingKey: null,
  },
  keydiff: {
    origin: null,
    destination: null,
  },
};
