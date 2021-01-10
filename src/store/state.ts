import { NotificationItem } from '../actions/actions';
import { AnyKey } from '../components/configure/keycodekey/KeycodeKey';
import { Key } from '../components/configure/keycodekey/KeycodeKey.container';
import {
  IHid,
  IKeyboard,
  IKeycodeCategory,
  IKeymap,
} from '../services/hid/hid';
import { WebHid } from '../services/hid/web-hid';
import { FirestoreStorage } from '../services/storage/firebase';
import { IStorage } from '../services/storage/storage';

export type ISetupPhase =
  | 'keyboardNotSelected'
  | 'connectingKeyboard'
  | 'fetchingKeyboardDefinition'
  | 'waitingKeyboardDefinitionUpload'
  | 'openingKeyboard'
  | 'openedKeyboard';
export const SetupPhase: { [p: string]: ISetupPhase } = {
  keyboardNotSelected: 'keyboardNotSelected',
  connectingKeyboard: 'connectingKeyboard',
  fetchingKeyboardDefinition: 'fetchingKeyboardDefinition',
  waitingKeyboardDefinitionUpload: 'waitingKeyboardDefinitionUpload',
  openingKeyboard: 'openingKeyboard',
  openedKeyboard: 'openedKeyboard',
};

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
    keyboard: IKeyboard | null;
    keyboardDefinition: any;
  };
  app: {
    package: {
      name: string;
      version: string;
    };
    setupPhase: ISetupPhase;
    remaps: {
      // remap candidates and show keydiff
      [pos: string]: IKeymap;
    }[];
    notifications: NotificationItem[];
  };
  header: {
    flushLoading: boolean;
  };
  hid: {
    instance: IHid;
  };
  storage: {
    instance: IStorage;
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
  keyboardDefinitionForm: {
    dragging: boolean;
  };
};

export const INIT_STATE: RootState = {
  entities: {
    device: {
      vendorId: NaN,
      productId: NaN,
      name: null,
      layerCount: NaN,
      rowCount: NaN,
      columnCount: NaN,
      keymaps: [],
      macros: {},
    },
    keyboards: [],
    keyboard: null, // hid.keyboards[i]
    keyboardDefinition: null,
  },
  app: {
    package: {
      name: '',
      version: '',
    },
    setupPhase: SetupPhase.keyboardNotSelected,
    remaps: [],
    notifications: [],
  },
  header: {
    flushLoading: false,
  },
  hid: {
    instance: new WebHid(),
  },
  storage: {
    instance: new FirestoreStorage(),
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
  keyboardDefinitionForm: {
    dragging: false,
  },
};
