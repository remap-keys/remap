import { NotificationItem } from '../actions/actions';
import { Key } from '../components/configure/keycodekey/KeyGen';
import { IHid, IKeyboard, IKeymap } from '../services/hid/Hid';
import { WebHid } from '../services/hid/WebHid';
import { FirebaseProvider } from '../services/provider/Firebase';
import {
  AbstractKeymapData,
  AppliedKeymapData,
  IAdditionalDescription,
  IKeyboardDefinitionDocument,
  IStorage,
  IStore,
  SavedKeymapData,
} from '../services/storage/Storage';
import { IAuth } from '../services/auth/Auth';
import { KeyboardDefinitionSchema } from '../gen/types/KeyboardDefinition';
import { GitHub, IGitHub } from '../services/github/GitHub';
import buildInfo from '../assets/files/build-info.json';
import { KeyboardLabelLang } from '../services/labellang/KeyLabelLangs';
import { LayoutOption } from '../components/configure/keymap/Keymap';
import { IMacro, IMacroBuffer, MacroKey } from '../services/macro/Macro';

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
  | 'catalog'
  | 'firmware'
  | 'signout';
export const KeyboardsPhase: { [p: string]: IKeyboardsPhase } = {
  signing: 'signing',
  init: 'init',
  list: 'list',
  create: 'create',
  processing: 'processing',
  edit: 'edit',
  catalog: 'catalog',
  firmware: 'firmware',
  signout: 'signout',
};

export const ALL_CATALOG_PHASE = [
  'init',
  'processing',
  'list',
  'introduction',
  'keymap',
  'firmware',
] as const;
type catalogPhaseTuple = typeof ALL_CATALOG_PHASE;
export type ICatalogPhase = catalogPhaseTuple[number];

export type IFirmwareCodePlace = 'qmk' | 'forked' | 'other';
export const FirmwareCodePlace: { [p: string]: IFirmwareCodePlace } = {
  qmk: 'qmk',
  forked: 'forked',
  other: 'other',
};

export const ALL_KEY_COUNT_TYPE = [
  'over_100',
  '100',
  '90',
  '80',
  '70',
  '60',
  '50',
  '40',
  '30',
  'macro',
] as const;
type keyCountTuple = typeof ALL_KEY_COUNT_TYPE;
export type IKeyboardKeyCountType = keyCountTuple[number];

export const ALL_SPLIT_TYPE = ['split', 'integrated'] as const;
type splitTuple = typeof ALL_SPLIT_TYPE;
export type IKeyboardSplitType = splitTuple[number];

export const ALL_STAGGERED_TYPE = [
  'column_staggered',
  'row_staggered',
  'ortholinear',
  'symmetrical',
  'alice',
] as const;
type staggeredTuple = typeof ALL_STAGGERED_TYPE;
export type IKeyboardStaggeredType = staggeredTuple[number];

export const ALL_LED_TYPE = ['underglow', 'backlight'] as const;
type ledTuple = typeof ALL_LED_TYPE;
export type IKeyboardLedType = ledTuple[number];

export const ALL_KEY_SWITCH_TYPE = [
  'cherry_mx',
  'kailh_choc',
  'kailh_choc_v2',
  'kailh_mid_height',
  'alps',
  'outemulp',
  'capacitive_sensing_type',
] as const;
type keySwitchTuple = typeof ALL_KEY_SWITCH_TYPE;
export type IKeyboardKeySwitchType = keySwitchTuple[number];

export const ALL_HOTSWAP_TYPE = ['hot_swap'] as const;
type hotswapTuple = typeof ALL_HOTSWAP_TYPE;
export type IKeyboardHotswapType = hotswapTuple[number];

export const ALL_OLED_TYPE = ['oled'] as const;
type oledTuple = typeof ALL_OLED_TYPE;
export type IKeyboardOledType = oledTuple[number];

export const ALL_SPEAKER_TYPE = ['speaker'] as const;
type speakerTuple = typeof ALL_SPEAKER_TYPE;
export type IKeyboardSpeakerType = speakerTuple[number];

export const ALL_WIRELESS_TYPE = ['wireless'] as const;
type wirelessTuple = typeof ALL_WIRELESS_TYPE;
export type IKeyboardWirelessType = wirelessTuple[number];

export type IConditionNotSelected = '---';
export const CONDITION_NOT_SELECTED: IConditionNotSelected = '---';

export type IKeyboardFeatures =
  | IKeyboardKeyCountType
  | IKeyboardSplitType
  | IKeyboardStaggeredType
  | IKeyboardLedType
  | IKeyboardKeySwitchType
  | IKeyboardHotswapType
  | IKeyboardOledType
  | IKeyboardSpeakerType
  | IKeyboardWirelessType;

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
      macro: {
        bufferBytes: Uint8Array;
        maxBufferSize: number;
        maxCount: number;
      };
    };
    keyboards: IKeyboard[]; // authorized keyboard list
    keyboard: IKeyboard | null;
    keyboardDefinition: KeyboardDefinitionSchema | null;
    keyboardDefinitionDocuments: IKeyboardDefinitionDocument[];
    keyboardDefinitionDocument: IKeyboardDefinitionDocument | null;
    savedKeymaps: SavedKeymapData[];
    sharedKeymaps: SavedKeymapData[];
    appliedKeymaps: AppliedKeymapData[];
    searchResultKeyboardDocuments: IKeyboardDefinitionDocument[];
    sameAuthorKeyboardDocuments: IKeyboardDefinitionDocument[];
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
    testedMatrix: string[]; // 'row,col' string list which are pressed keys in TEST MATRIX MODE
    currentTestMatrix: string[]; // 'row,col' string list which are pressed down keys currently in TEST MATRIX MODE
    notifications: NotificationItem[];
    keyboardHeight: number;
    keyboardWidth: number;
    labelLang: KeyboardLabelLang;
    signedIn: boolean;
    meta: {
      title: string;
      description: string;
      og: {
        url: string;
        title: string;
        description: string;
        image: string;
      };
    };
  };
  configure: {
    header: {
      flashing: boolean;
    };
    keymap: {
      selectedPos: string;
      selectedLayer: number;
    };
    keymapToolbar: {
      testMatrix: boolean;
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
    macroEditor: {
      key: Key | null;
      keys: Key[];
      macroBuffer: IMacroBuffer | null;
      macro: IMacro | null;
      macroKeys: MacroKey[];
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
      contactInformation: string;
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
      contactInformation: string;
      features: IKeyboardFeatures[];
      mainImageUploadedRate: number;
      mainImageUploading: boolean;
      subImageUploadedRate: number;
      subImageUploading: boolean;
      description: string;
      stores: IStore[];
      websiteUrl: string;
      additionalDescriptions: IAdditionalDescription[];
      firmwareFile: File | null;
      firmwareName: string;
      firmwareDescription: string;
      firmwareSourceCodeUrl: string;
    };
  };
  catalog: {
    app: {
      phase: ICatalogPhase;
    };
    search: {
      features: IKeyboardFeatures[];
      keyword: string;
    };
    keyboard: {
      keymaps: {
        [pos: string]: IKeymap;
      }[];
      selectedLayer: number;
      langLabel: KeyboardLabelLang;
      selectedKeymapData: AbstractKeymapData | null;
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
      macro: {
        bufferBytes: new Uint8Array(),
        maxBufferSize: 0,
        maxCount: 0,
      },
    },
    keyboards: [],
    keyboard: null, // hid.keyboards[i]
    keyboardDefinition: null,
    keyboardDefinitionDocuments: [],
    keyboardDefinitionDocument: null,
    savedKeymaps: [],
    sharedKeymaps: [],
    appliedKeymaps: [],
    searchResultKeyboardDocuments: [],
    sameAuthorKeyboardDocuments: [],
  },
  app: {
    package: {
      name: '',
      version: '',
    },
    buildNumber: buildInfo.buildNumber,
    setupPhase: SetupPhase.init,
    remaps: [],
    testedMatrix: [],
    currentTestMatrix: [],
    notifications: [],
    keyboardHeight: 0,
    keyboardWidth: 0,
    labelLang: 'en-us',
    signedIn: false,
    meta: {
      title: '',
      description: '',
      og: {
        title: '',
        url: '',
        description: '',
        image: '',
      },
    },
  },
  configure: {
    header: {
      flashing: false,
    },
    keymap: {
      selectedLayer: NaN,
      selectedPos: '',
    },
    keymapToolbar: {
      testMatrix: false,
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
    macroEditor: {
      key: null,
      keys: [],
      macroBuffer: null,
      macro: null,
      macroKeys: [],
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
      contactInformation: '',
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
      contactInformation: '',
      features: [],
      mainImageUploadedRate: 0,
      mainImageUploading: false,
      subImageUploadedRate: 0,
      subImageUploading: false,
      description: '',
      stores: [],
      websiteUrl: '',
      additionalDescriptions: [],
      firmwareFile: null,
      firmwareName: '',
      firmwareDescription: '',
      firmwareSourceCodeUrl: '',
    },
  },
  catalog: {
    app: {
      phase: 'list', // FIXME Should be 'init'
    },
    search: {
      features: [],
      keyword: '',
    },
    keyboard: {
      keymaps: [],
      selectedLayer: 0,
      langLabel: 'en-us',
      selectedKeymapData: null,
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
