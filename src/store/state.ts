import { NotificationItem } from '../actions/actions';
import { Key } from '../components/configure/keycodekey/KeycodeKey.container';
import {
  IHid,
  IKeyboard,
  IKeycodeCategory,
  IKeymap,
} from '../services/hid/Hid';
import { WebHid } from '../services/hid/WebHid';
import { FirebaseProvider } from '../services/provider/Firebase';
import {
  IKeyboardDefinitionDocument,
  IStorage,
} from '../services/storage/Storage';
import { IAuth } from '../services/auth/Auth';
import { KeyboardDefinitionSchema } from '../gen/types/KeyboardDefinition';

export type ISetupPhase =
  | 'init'
  | 'keyboardNotSelected'
  | 'connectingKeyboard'
  | 'fetchingKeyboardDefinition'
  | 'waitingKeyboardDefinitionUpload'
  | 'openingKeyboard'
  | 'openedKeyboard';
export const SetupPhase: { [p: string]: ISetupPhase } = {
  init: 'init',
  keyboardNotSelected: 'keyboardNotSelected',
  connectingKeyboard: 'connectingKeyboard',
  fetchingKeyboardDefinition: 'fetchingKeyboardDefinition',
  waitingKeyboardDefinitionUpload: 'waitingKeyboardDefinitionUpload',
  openingKeyboard: 'openingKeyboard',
  openedKeyboard: 'openedKeyboard',
};

export type IKeyboardsPhase = 'init' | 'list' | 'create' | 'edit';
export const KeyboardsPhase: { [p: string]: IKeyboardsPhase } = {
  init: 'init',
  list: 'list',
  create: 'create',
  edit: 'edit',
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
    keyboardDefinition: KeyboardDefinitionSchema | null;
    keyboardDefinitionDocuments: IKeyboardDefinitionDocument[];
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
    keyboardHeight: number;
    keyboardWidth: number;
  };
  configure: {
    header: {
      flashing: boolean;
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
    layoutOptions: {
      selectedOptions: string[];
    };
  };
  keyboards: {
    app: {
      phase: IKeyboardsPhase;
    };
  };
  hid: {
    instance: IHid;
  };
  storage: {
    instance: IStorage;
  };
  auth: {
    instance: IAuth;
  };
};

const firebaseProvider = new FirebaseProvider();

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
    keyboardDefinitionDocuments: [],
  },
  app: {
    package: {
      name: '',
      version: '',
    },
    setupPhase: SetupPhase.init,
    remaps: [],
    notifications: [],
    keyboardHeight: 0,
    keyboardWidth: 0,
  },
  configure: {
    header: {
      flashing: false,
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
    layoutOptions: {
      selectedOptions: [],
    },
  },
  keyboards: {
    app: {
      phase: KeyboardsPhase.init,
    },
  },
  hid: {
    instance: new WebHid(),
  },
  storage: {
    instance: firebaseProvider,
  },
  auth: {
    instance: firebaseProvider,
  },
};
