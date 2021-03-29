import { NotificationItem } from '../actions/actions';
import { Key } from '../components/configure/keycodekey/KeyGen';
import { IHid, IKeyboard, IKeymap } from '../services/hid/Hid';
import { WebHid } from '../services/hid/WebHid';
import { FirebaseProvider } from '../services/provider/Firebase';
import {
  AppliedKeymapData,
  IKeyboardDefinitionDocument,
  IStorage,
  SavedKeymapData,
} from '../services/storage/Storage';
import { IAuth } from '../services/auth/Auth';
import { KeyboardDefinitionSchema } from '../gen/types/KeyboardDefinition';
import { GitHub, IGitHub } from '../services/github/GitHub';
import buildInfo from '../assets/files/build-info.json';
import { KeyboardLabelLang } from '../services/labellang/KeyLabelLangs';
import { LayoutOption } from '../components/configure/keymap/Keymap';

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

export type IKeyboardsPhase =
  | 'signing'
  | 'init'
  | 'list'
  | 'create'
  | 'processing'
  | 'edit'
  | 'signout';
export const KeyboardsPhase: { [p: string]: IKeyboardsPhase } = {
  signing: 'signing',
  init: 'init',
  list: 'list',
  create: 'create',
  processing: 'processing',
  edit: 'edit',
  signout: 'signout',
};

export type IFirmwareCodePlace = 'qmk' | 'forked' | 'other';
export const FirmwareCodePlace: { [p: string]: IFirmwareCodePlace } = {
  qmk: 'qmk',
  forked: 'forked',
  other: 'other',
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
      bleMicroPro: boolean;
    };
    keyboards: IKeyboard[]; // authorized keyboard list
    keyboard: IKeyboard | null;
    keyboardDefinition: KeyboardDefinitionSchema | null;
    keyboardDefinitionDocuments: IKeyboardDefinitionDocument[];
    keyboardDefinitionDocument: IKeyboardDefinitionDocument | null;
    savedKeymaps: SavedKeymapData[];
    sharedKeymaps: SavedKeymapData[];
    appliedKeymaps: AppliedKeymapData[];
  };
  app: {
    package: {
      name: string;
      version: string;
    };
    buildNumber: number;
    setupPhase: ISetupPhase;
    remaps: {
      // remap candidates and show keydiff
      [pos: string]: IKeymap;
    }[];
    notifications: NotificationItem[];
    keyboardHeight: number;
    keyboardWidth: number;
    labelLang: KeyboardLabelLang;
    signedIn: boolean;
  };
  configure: {
    header: {
      flashing: boolean;
    };
    keymap: {
      selectedPos: string;
      selectedLayer: number;
    };
    keycodes: {
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
      selectedOptions: LayoutOption[];
    };
  };
  keyboards: {
    app: {
      phase: IKeyboardsPhase;
    };
    createdefinition: {
      jsonFilename: string;
      keyboardDefinition: KeyboardDefinitionSchema | null;
      productName: string;
      jsonString: string;
      agreement: boolean;
      firmwareCodePlace: IFirmwareCodePlace;
      qmkRepositoryFirstPullRequestUrl: string;
      forkedRepositoryUrl: string;
      forkedRepositoryEvidence: string;
      otherPlaceHowToGet: string;
      otherPlaceSourceCodeEvidence: string;
      otherPlacePublisherEvidence: string;
    };
    editdefinition: {
      jsonFilename: string;
      keyboardDefinition: KeyboardDefinitionSchema | null;
      productName: string;
      jsonString: string;
      agreement: boolean;
      firmwareCodePlace: IFirmwareCodePlace | undefined;
      qmkRepositoryFirstPullRequestUrl: string;
      forkedRepositoryUrl: string;
      forkedRepositoryEvidence: string;
      otherPlaceHowToGet: string;
      otherPlaceSourceCodeEvidence: string;
      otherPlacePublisherEvidence: string;
    };
  };
  hid: {
    instance: IHid;
  };
  storage: {
    instance: IStorage | null;
  };
  auth: {
    instance: IAuth | null;
  };
  github: {
    instance: IGitHub;
  };
};

let firebaseProvider;
try {
  firebaseProvider = new FirebaseProvider();
} catch (cause) {
  if (process.env.NODE_ENV === 'production') {
    throw cause;
  } else {
    console.warn(
      `To work Remap locally, ignore the situation which Firebase cannot be initialized. ${cause}`
    );
    firebaseProvider = null;
  }
}

const gitHub = new GitHub();

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
      bleMicroPro: false,
    },
    keyboards: [],
    keyboard: null, // hid.keyboards[i]
    keyboardDefinition: null,
    keyboardDefinitionDocuments: [],
    keyboardDefinitionDocument: null,
    savedKeymaps: [],
    sharedKeymaps: [],
    appliedKeymaps: [],
  },
  app: {
    package: {
      name: '',
      version: '',
    },
    buildNumber: buildInfo.buildNumber,
    setupPhase: SetupPhase.init,
    remaps: [],
    notifications: [],
    keyboardHeight: 0,
    keyboardWidth: 0,
    labelLang: 'en-us',
    signedIn: false,
  },
  configure: {
    header: {
      flashing: false,
    },
    keymap: {
      selectedLayer: NaN,
      selectedPos: '',
    },
    keycodes: {
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
      phase: KeyboardsPhase.signing,
    },
    createdefinition: {
      jsonFilename: '',
      keyboardDefinition: null,
      productName: '',
      jsonString: '',
      agreement: false,
      firmwareCodePlace: 'qmk',
      qmkRepositoryFirstPullRequestUrl: '',
      forkedRepositoryUrl: '',
      forkedRepositoryEvidence: '',
      otherPlaceHowToGet: '',
      otherPlaceSourceCodeEvidence: '',
      otherPlacePublisherEvidence: '',
    },
    editdefinition: {
      jsonFilename: '',
      keyboardDefinition: null,
      productName: '',
      jsonString: '',
      agreement: false,
      firmwareCodePlace: 'qmk',
      qmkRepositoryFirstPullRequestUrl: '',
      forkedRepositoryUrl: '',
      forkedRepositoryEvidence: '',
      otherPlaceHowToGet: '',
      otherPlaceSourceCodeEvidence: '',
      otherPlacePublisherEvidence: '',
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
  github: {
    instance: gitHub,
  },
};
