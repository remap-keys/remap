import { NotificationItem } from '../actions/actions';
import { Key } from '../components/configure/keycodekey/KeyGen';
import { IEncoderKeymaps, IHid, IKeyboard, IKeymap } from '../services/hid/Hid';
import { WebHid } from '../services/hid/WebHid';
import { FirebaseProvider } from '../services/provider/Firebase';
import {
  AbstractKeymapData,
  AppliedKeymapData,
  IAdditionalDescription,
  IBuildableFirmware,
  IBuildableFirmwareFile,
  IBuildableFirmwareFileType,
  IFirmware,
  IFirmwareBuildingTask,
  IKeyboardDefinitionAuthorType,
  IKeyboardDefinitionDocument,
  IKeyboardStatistics,
  IOrganization,
  IOrganizationMember,
  IStorage,
  IStore,
  SavedKeymapData,
} from '../services/storage/Storage';
import { IAuth } from '../services/auth/Auth';
import { KeyboardDefinitionSchema } from '../gen/types/KeyboardDefinition';
import { GitHub, IGitHub } from '../services/github/GitHub';
import buildInfo from '../assets/files/build-info.json';
import {
  KeyboardLabelLang,
  KEY_LABEL_LANGS,
} from '../services/labellang/KeyLabelLangs';
import { LayoutOption } from '../components/configure/keymap/Keymap';
import { IMacro, IMacroBuffer, MacroKey } from '../services/macro/Macro';
import { IFirmwareWriter } from '../services/firmware/FirmwareWriter';
import { FirmwareWriterWebApiImpl } from '../services/firmware/FirmwareWriterWebApiImpl';
import { IBootloaderType } from '../services/firmware/Types';
import { getLocalAuthenticationUid } from '../utils/AuthUtils';

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
  | 'build'
  | 'statistics'
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
  build: 'build',
  statistics: 'statistics',
  signout: 'signout',
};

export const ALL_CATALOG_PHASE = [
  'init',
  'processing',
  'list',
  'introduction',
  'keymap',
  'firmware',
  'build',
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
  'gateron_low_profile',
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

export const ALL_FLASH_FIRMWARE_DIALOG_MODE = [
  'instruction',
  'flashing',
] as const;
type flashFirmwareDialogModeTuple = typeof ALL_FLASH_FIRMWARE_DIALOG_MODE;
export type IFlashFirmwareDialogMode = flashFirmwareDialogModeTuple[number];

export const ALL_ORGANIZATIONS_PHASE = [
  'signing',
  'init',
  'processing',
  'list',
  'edit',
  'signout',
] as const;
type organizationsPhaseTuple = typeof ALL_ORGANIZATIONS_PHASE;
export type IOrganizationsPhase = organizationsPhaseTuple[number];

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

export type IFlashFirmwareDialogFlashMode =
  | 'upload_and_flash'
  | 'fetch_and_flash'
  | 'build_and_flash';

const KeySwitchOperations = {
  click: 'click',
  cw: 'cw',
  ccw: 'ccw',
} as const;
export type IKeySwitchOperation =
  (typeof KeySwitchOperations)[keyof typeof KeySwitchOperations];

export type IBuildableFirmwareCodeParameterType =
  | 'select'
  | 'text'
  | 'number'
  | 'toggle';

export type IBuildableFirmwareCodeParameter = {
  name: string;
  type: IBuildableFirmwareCodeParameterType;
  options: string[];
  default: string;
  comment: string | undefined;
  startPosition: number;
  endPosition: number;
};

export type IBuildableFirmwareCodeParameterValue = {
  value: string;
  definition: IBuildableFirmwareCodeParameter;
};

export type IBuildableFirmwareCodeValueType = 'parameters' | 'code';

export type IBuildableFirmwareCodeParameterValueMap = {
  // File ID: Parameter Name : Parameter Value
  [fileId: string]: {
    type: IBuildableFirmwareCodeValueType;
    parameters: {
      [parameterName: string]: IBuildableFirmwareCodeParameterValue;
    };
    code: string;
  };
};

export type IBuildableFirmwareCodeParameterValues = {
  keyboard: IBuildableFirmwareCodeParameterValueMap;
  keymap: IBuildableFirmwareCodeParameterValueMap;
};

export type RootState = {
  entities: {
    device: {
      vendorId: number;
      productId: number;
      name: string | null;
      layerCount: number;
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
      viaProtocolVersion: number;
      encodersKeymaps: IEncoderKeymaps[];
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
    searchResultOrganizationMap: Record<string, IOrganization>;
    sameAuthorKeyboardDocuments: IKeyboardDefinitionDocument[];
    organization: IOrganization | null;
    organizationMap: Record<string, IOrganization>;
    buildableFirmware: IBuildableFirmware | null;
    buildableFirmwareKeyboardFiles: IBuildableFirmwareFile[];
    buildableFirmwareKeymapFiles: IBuildableFirmwareFile[];
    firmwareBuildingTasks: IFirmwareBuildingTask[];
  };
  app: {
    package: {
      name: string;
      version: string;
    };
    buildNumber: number;
    setupPhase: ISetupPhase;
    remaps: {
      // remap candidates and show keydiff for clickable keys
      [pos: string]: IKeymap;
    }[];
    encodersRemaps: {
      // remap candidates and show keydiff for encoders
      [id: number]: {
        clockwise?: IKeymap;
        counterclockwise?: IKeymap;
      };
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
    localAuthenticationInfo: {
      uid: string;
    };
  };
  configure: {
    header: {
      flashing: boolean;
    };
    keymap: {
      selectedPos: string;
      selectedLayer: number;
      selectedEncoderId: number | null;
      selectedKeySwitchOperation: IKeySwitchOperation;
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
      authorType: IKeyboardDefinitionAuthorType;
      organizationId: string | undefined;
      organizationEvidence: string;
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
      flashSupport: boolean;
      defaultBootloaderType: IBootloaderType;
      authorType: IKeyboardDefinitionAuthorType;
      organizationId: string | undefined;
      organizationEvidence: string;
      buildableFirmwareFile: IBuildableFirmwareFile | null;
      buildableFirmwareFileType: IBuildableFirmwareFileType | null;
      buildableFirmwareCodeParameters: IBuildableFirmwareCodeParameter[];
      keyboardStatistics: IKeyboardStatistics | undefined;
    };
  };
  catalog: {
    app: {
      phase: ICatalogPhase;
    };
    search: {
      features: IKeyboardFeatures[];
      keyword: string;
      organizationId: string | undefined;
      buildSupport: boolean;
    };
    keyboard: {
      keymaps: {
        [pos: string]: IKeymap;
      }[];
      encodersKeymaps: IEncoderKeymaps[];
      selectedLayer: number;
      langLabel: KeyboardLabelLang;
      selectedKeymapData: AbstractKeymapData | null;
      buildableFirmwareCodeParameterValues: IBuildableFirmwareCodeParameterValues;
    };
  };
  organizations: {
    app: {
      phase: IOrganizationsPhase;
    };
    editorganization: {
      organizationMembers: IOrganizationMember[];
      email: string;
    };
  };
  common: {
    firmware: {
      flashFirmwareDialog: {
        keyboardName: string;
        firmware: IFirmware | null;
        flashing: boolean;
        progressRate: number;
        logs: string[];
        mode: IFlashFirmwareDialogMode;
        bootloaderType: IBootloaderType;
        flashMode: IFlashFirmwareDialogFlashMode;
        buildingFirmwareTask: IFirmwareBuildingTask | null;
      };
      uploadFirmwareDialog: {
        open: boolean;
        firmwareFileBuffer: ArrayBuffer | undefined;
      };
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
  serial: {
    writer: IFirmwareWriter;
  };
};

let firebaseProvider;
try {
  firebaseProvider = new FirebaseProvider();
} catch (cause) {
  if (import.meta.env.NODE_ENV === 'production') {
    throw cause;
  } else {
    console.warn(
      `To work Remap locally, ignore the situation which Firebase cannot be initialized. ${cause}`,
    );
    firebaseProvider = null;
  }
}

const gitHub = new GitHub();

const firmwareWriter = new FirmwareWriterWebApiImpl();

const localAuthenticationUid = getLocalAuthenticationUid();

export const INIT_STATE: RootState = {
  entities: {
    device: {
      vendorId: NaN,
      productId: NaN,
      name: null,
      layerCount: NaN,
      keymaps: [],
      macros: {},
      bleMicroPro: false,
      macro: {
        bufferBytes: new Uint8Array(),
        maxBufferSize: 0,
        maxCount: 0,
      },
      viaProtocolVersion: NaN,
      encodersKeymaps: [],
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
    searchResultOrganizationMap: {},
    sameAuthorKeyboardDocuments: [],
    organization: null,
    organizationMap: {},
    buildableFirmware: null,
    buildableFirmwareKeyboardFiles: [],
    buildableFirmwareKeymapFiles: [],
    firmwareBuildingTasks: [],
  },
  app: {
    package: {
      name: '',
      version: '',
    },
    buildNumber: buildInfo.buildNumber,
    setupPhase: SetupPhase.init,
    remaps: [],
    encodersRemaps: [],
    testedMatrix: [],
    currentTestMatrix: [],
    notifications: [],
    keyboardHeight: 0,
    keyboardWidth: 0,
    labelLang: (() => {
      const defaultKeyLabel = 'en-us';
      const storageValue = localStorage.getItem('LabelLang');
      if (storageValue === null) {
        return defaultKeyLabel;
      }
      const keyLabelLang = KEY_LABEL_LANGS.find(
        (v) => v.labelLang == storageValue,
      );
      if (keyLabelLang == undefined) {
        return defaultKeyLabel;
      }
      return keyLabelLang.labelLang;
    })(),
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
    localAuthenticationInfo: {
      uid: localAuthenticationUid,
    },
  },
  configure: {
    header: {
      flashing: false,
    },
    keymap: {
      selectedLayer: NaN,
      selectedPos: '',
      selectedEncoderId: null,
      selectedKeySwitchOperation: 'click',
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
      authorType: 'individual',
      organizationId: undefined,
      organizationEvidence: '',
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
      flashSupport: false,
      defaultBootloaderType: 'caterina',
      authorType: 'individual',
      organizationId: undefined,
      organizationEvidence: '',
      buildableFirmwareFile: null,
      buildableFirmwareFileType: null,
      buildableFirmwareCodeParameters: [],
      keyboardStatistics: undefined,
    },
  },
  catalog: {
    app: {
      phase: 'list', // FIXME Should be 'init'
    },
    search: {
      features: [],
      keyword: '',
      organizationId: undefined,
      buildSupport: false,
    },
    keyboard: {
      keymaps: [],
      encodersKeymaps: [],
      selectedLayer: 0,
      langLabel: 'en-us',
      selectedKeymapData: null,
      buildableFirmwareCodeParameterValues: {
        keyboard: {},
        keymap: {},
      },
    },
  },
  organizations: {
    app: {
      phase: 'signing',
    },
    editorganization: {
      organizationMembers: [],
      email: '',
    },
  },
  common: {
    firmware: {
      flashFirmwareDialog: {
        keyboardName: '',
        firmware: null,
        flashing: false,
        progressRate: 0,
        logs: [''],
        mode: 'instruction',
        bootloaderType: 'caterina',
        flashMode: 'fetch_and_flash',
        buildingFirmwareTask: null,
      },
      uploadFirmwareDialog: {
        open: false,
        firmwareFileBuffer: undefined,
      },
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
  serial: {
    writer: firmwareWriter,
  },
};
