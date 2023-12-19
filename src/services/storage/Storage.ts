import { LayoutOption } from '../../components/configure/keymap/Keymap';
import { IFirmwareCodePlace, IKeyboardFeatures } from '../../store/state';
import { IDeviceInformation } from '../hid/Hid';
import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';
import { IBootloaderType } from '../firmware/Types';

export type ISuccessResult<V> = {
  readonly type: 'success';
  readonly value: V;
};

export type IErrorResult = {
  readonly type: 'error';
  readonly error: string;
  readonly cause?: any;
};

export type IResult<V> = ISuccessResult<V> | IErrorResult;
export type IEmptyResult = IResult<undefined>;

export const isSuccessful = <V>(
  result: IResult<V>
): result is ISuccessResult<V> => {
  return result.type === 'success';
};

export const isError = <V>(result: IResult<V>): result is IErrorResult => {
  return result.type === 'error';
};

export const successResultOf = <V>(value: V): ISuccessResult<V> => {
  return {
    type: 'success',
    value,
  };
};

export const successResult = (): ISuccessResult<undefined> => {
  return {
    type: 'success',
    value: undefined,
  };
};

export const errorResultOf = (error: string, cause?: any): IErrorResult => {
  return {
    type: 'error',
    error,
    cause,
  };
};

export type IKeyboardDefinitionStatus =
  | 'draft'
  | 'in_review'
  | 'rejected'
  | 'approved';
export const KeyboardDefinitionStatus: {
  [p: string]: IKeyboardDefinitionStatus;
} = {
  draft: 'draft',
  in_review: 'in_review',
  rejected: 'rejected',
  approved: 'approved',
};

export interface IStore {
  name: string;
  url: string;
}

export interface IAdditionalDescription {
  title: string;
  body: string;
}

export interface ISubImage {
  thumbnail_image_url: string;
  image_url: string;
}

export interface IFirmware {
  name: string;
  created_at: Date;
  description: string;
  hash: string;
  filename: string;
  sourceCodeUrl: string;
  flash_support: boolean;
  default_bootloader_type: IBootloaderType;
}

export type IKeyboardDefinitionAuthorType = 'individual' | 'organization';

export interface IKeyboardDefinitionDocument {
  readonly id: string;
  readonly authorUid: string;
  readonly authorType: IKeyboardDefinitionAuthorType;
  readonly organizationId: string | undefined;
  readonly name: string;
  readonly vendorId: number;
  readonly productId: number;
  readonly productName: string;
  readonly status: IKeyboardDefinitionStatus;
  readonly json: string;
  readonly rejectReason: string | undefined;
  readonly githubDisplayName: string;
  readonly githubUrl: string;
  readonly firmwareCodePlace: IFirmwareCodePlace;
  readonly qmkRepositoryFirstPullRequestUrl: string;
  readonly forkedRepositoryUrl: string;
  readonly forkedRepositoryEvidence: string;
  readonly otherPlaceHowToGet: string;
  readonly otherPlaceSourceCodeEvidence: string;
  readonly otherPlacePublisherEvidence: string;
  readonly organizationEvidence: string;
  readonly contactInformation: string;
  readonly features: IKeyboardFeatures[];
  readonly thumbnailImageUrl: string;
  readonly imageUrl: string;
  readonly subImages: ISubImage[];
  readonly description: string;
  readonly additionalDescriptions: IAdditionalDescription[];
  readonly stores: IStore[];
  readonly websiteUrl: string;
  readonly firmwares: IFirmware[];
  readonly totalFirmwareDownloadCount: number;
  readonly totalFirmwareFlashCount: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export function getGitHubUserDisplayName(
  definitionDocument: IKeyboardDefinitionDocument
): string {
  return (
    definitionDocument.githubDisplayName ||
    definitionDocument.githubUrl.substring(
      definitionDocument.githubUrl.lastIndexOf('/') + 1
    )
  );
}

export function getGitHubUserName(
  definitionDocument: IKeyboardDefinitionDocument
): string {
  return definitionDocument.githubUrl.substring(
    definitionDocument.githubUrl.lastIndexOf('/') + 1
  );
}

export function isApprovedKeyboard(
  keyboardDefDocument: IKeyboardDefinitionDocument | null | undefined
) {
  if (keyboardDefDocument) {
    return keyboardDefDocument.status === 'approved';
  } else {
    return false;
  }
}

type SavedKeymapSatus = 'private' | 'shared';

export interface AbstractKeymapData {
  id?: string; // this entity's id
  author_uid: string; //  auth.uid
  author_display_name?: string; // auth.display_name
  vendor_id: number; // Definition.vendorId if registered, otherwise DeviceInformation.vendorId
  product_id: number; // Definition.productId if registered, otherwise DeviceInformation.productId
  product_name: string; // Definition.productName if registered, otherwise DeviceInformation.productName
  title: string;
  desc: string;
  label_lang: KeyboardLabelLang;
  layout_options: LayoutOption[];
  keycodes: { [pos: string]: number }[];
  encoderKeycodes: {
    [id: number]: { clockwise: number; counterclockwise: number };
  }[];
  created_at?: Date;
  updated_at?: Date;
}

export interface SavedKeymapData extends AbstractKeymapData {
  status: SavedKeymapSatus;
}

export interface AppliedKeymapData extends AbstractKeymapData {
  applied_uid: string;
  saved_keymap_id: string;
}

export function isAppliedKeymapDataInstance(
  arg: any
): arg is AppliedKeymapData {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    typeof arg.applied_uid === 'string'
  );
}

export type IExistsResult = IResult<{ exists: boolean }>;

export type IFetchKeyboardDefinitionDocumentResult = IResult<{
  exists: boolean;
  document?: IKeyboardDefinitionDocument;
}>;

export type IFetchMyKeyboardDefinitionDocumentsResult = IResult<{
  documents: IKeyboardDefinitionDocument[];
}>;

export type ICreateKeyboardDefinitionDocumentResult = IResult<{
  definitionId: string;
}>;

export type ISavedKeymapResult = IResult<{ savedKeymaps: SavedKeymapData[] }>;

export type IAppliedKeymapsResult = IResult<{
  appliedKeymaps: AppliedKeymapData[];
}>;

export type IFetchSharedKeymapResult = IResult<{
  sharedKeymap: SavedKeymapData;
}>;

export type IFetchFirmwareFileBlobResult = IResult<{ blob: any }>;

export type IFirmwareCounterType = 'download' | 'flash';

export interface IOrganization {
  id?: string;
  name: string;
  description: string;
  icon_image_url: string;
  website_url: string;
  contact_email_address: string;
  contact_person_name: string;
  contact_tel: string;
  contact_address: string;
  members: string[];
  created_at?: Date;
  updated_at?: Date;
}

export type IFetchOrganizationByIdResult = IResult<{
  organization: IOrganization;
}>;

export type IFetchOrganizationsByIdsResult = IResult<{
  organizationMap: Record<string, IOrganization>;
}>;

export type IFetchMyOrganizationsResult = IResult<{
  organizationMap: Record<string, IOrganization>;
}>;

export type IFetchAllOrganizationsResult = IResult<{
  organizationMap: Record<string, IOrganization>;
}>;

export type IOrganizationMember = {
  uid: string;
  email: string;
  displayName: string;
  me: boolean;
};

export type IFetchOrganizationMembersResult = IResult<{
  members: IOrganizationMember[];
}>;

export const BUILDABLE_FIRMWARE_QMK_FIRMWARE_VERSION = ['0.22.14'] as const;
type buildableFirmwareQmkFirmwareVersionTuple =
  typeof BUILDABLE_FIRMWARE_QMK_FIRMWARE_VERSION;
export type IBuildableFirmwareQmkFirmwareVersion =
  buildableFirmwareQmkFirmwareVersionTuple[number];

export type IBuildableFirmware = {
  keyboardDefinitionId: string;
  uid: string;
  enabled: boolean;
  defaultBootloaderType: IBootloaderType;
  qmkFirmwareVersion: IBuildableFirmwareQmkFirmwareVersion;
  keyboardDirectoryName: string;
  supportCodeEditing: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type IBuildableFirmwareFileType = 'keyboard' | 'keymap';

export type IBuildableFirmwareFile = {
  id: string;
  path: string;
  content: string;
};

export type IFirmwareBuildingTaskStatus =
  | 'waiting'
  | 'building'
  | 'success'
  | 'failure';

export type IFirmwareBuildingTask = {
  id: string;
  firmwareId: string;
  uid: string;
  status: IFirmwareBuildingTaskStatus;
  firmwareFilePath: string;
  stdout: string;
  stderr: string;
  description: string;
  parametersJson: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IOperationLogType = 'configure/flash' | 'configure/open';

export type IKeyboardStatistics = {
  statistics: {
    counts_of_opening_keyboard: {
      labels: string[];
      values: number[];
    };
    counts_of_flashing_keymap: {
      labels: string[];
      values: number[];
    };
  };
};

/* eslint-disable no-unused-vars */
export interface IStorage {
  fetchKeyboardDefinitionDocumentByDeviceInfo(
    vendorId: number,
    productId: number,
    productName: string
  ): Promise<IFetchKeyboardDefinitionDocumentResult>;
  fetchMyKeyboardDefinitionDocuments(): Promise<IFetchMyKeyboardDefinitionDocumentsResult>;
  createKeyboardDefinitionDocument(
    authorUid: string,
    name: string,
    vendorId: number,
    productId: number,
    productName: string,
    jsonStr: string,
    githubUid: string,
    githubDisplayName: string,
    githubEmail: string,
    githubUrl: string,
    firmwareCodePlace: IFirmwareCodePlace,
    qmkRepositoryFirstPullRequestUrl: string,
    forkedRepositoryUrl: string,
    forkedRepositoryEvidence: string,
    otherPlaceHowToGet: string,
    otherPlaceSourceCodeEvidence: string,
    otherPlacePublisherEvidence: string,
    contactInformation: string,
    organizationEvidence: string,
    authorType: IKeyboardDefinitionAuthorType,
    organizationId: string | undefined,
    status: IKeyboardDefinitionStatus
  ): Promise<ICreateKeyboardDefinitionDocumentResult>;
  fetchMyKeyboardDefinitionDocumentById(
    definitionId: string
  ): Promise<IFetchKeyboardDefinitionDocumentResult>;
  updateKeyboardDefinitionDocument(
    definitionId: string,
    name: string,
    vendorId: number,
    productId: number,
    productName: string,
    jsonStr: string,
    firmwareCodePlace: IFirmwareCodePlace,
    qmkRepositoryFirstPullRequestUrl: string,
    forkedRepositoryUrl: string,
    forkedRepositoryEvidence: string,
    otherPlaceHowToGet: string,
    otherPlaceSourceCodeEvidence: string,
    otherPlacePublisherEvidence: string,
    contactInformation: string | undefined,
    organizationEvidence: string,
    authorType: IKeyboardDefinitionAuthorType,
    organizationId: string | undefined,
    status: IKeyboardDefinitionStatus
  ): Promise<IEmptyResult>;
  updateKeyboardDefinitionJson(
    definitionId: string,
    name: string,
    jsonStr: string
  ): Promise<IEmptyResult>;
  deleteKeyboardDefinitionDocument(definitionId: string): Promise<IEmptyResult>;

  fetchMySavedKeymaps(info: IDeviceInformation): Promise<ISavedKeymapResult>;
  createSavedKeymap(keymapData: SavedKeymapData): Promise<IEmptyResult>;
  updateSavedKeymap(keymapData: SavedKeymapData): Promise<IEmptyResult>;
  deleteSavedKeymap(savedKeymapId: string): Promise<IEmptyResult>;
  fetchSharedKeymaps(
    info: IDeviceInformation,
    withoutMine: boolean
  ): Promise<ISavedKeymapResult>;
  createOrUpdateAppliedKeymap(
    keymapData: AbstractKeymapData
  ): Promise<IEmptyResult>;
  fetchMyAppliedKeymaps(
    info: IDeviceInformation
  ): Promise<IAppliedKeymapsResult>;
  fetchSharedKeymap(keymapId: string): Promise<IFetchSharedKeymapResult>;

  searchKeyboards(
    features: IKeyboardFeatures[],
    organizationId: string | undefined
  ): Promise<IFetchMyKeyboardDefinitionDocumentsResult>;
  fetchKeyboardDefinitionDocumentById(
    definitionId: string
  ): Promise<IFetchKeyboardDefinitionDocumentResult>;
  updateKeyboardDefinitionDocumentForCatalog(
    definitionId: string,
    features: IKeyboardFeatures[],
    description: string,
    stores: IStore[],
    websiteUrl: string,
    additionalDescriptions: IAdditionalDescription[]
  ): Promise<IEmptyResult>;
  fetchKeyboardsCreatedBySameAuthor(
    definitionDocument: IKeyboardDefinitionDocument
  ): Promise<IFetchMyKeyboardDefinitionDocumentsResult>;

  uploadKeyboardCatalogMainImage(
    definitionId: string,
    file: File,
    progress: (uploadedRate: number) => void
  ): Promise<IEmptyResult>;
  uploadKeyboardCatalogSubImage(
    definitionId: string,
    file: File,
    progress: (uploadedRate: number) => void
  ): Promise<IEmptyResult>;
  deleteKeyboardCatalogSubImage(
    definitionId: string,
    subImageIndex: number
  ): Promise<IEmptyResult>;

  uploadFirmware(
    definitionId: string,
    firmwareFile: File,
    firmwareName: string,
    firmwareDescription: string,
    firmwareSourceCodeUrl: string,
    flashSupport: boolean,
    defaultBootloaderType: IBootloaderType,
    keyboardName: string
  ): Promise<IEmptyResult>;
  fetchFirmwareFileBlob(
    definitionId: string,
    firmwareFilePath: string,
    firmwareCounterType: IFirmwareCounterType
  ): Promise<IFetchFirmwareFileBlobResult>;
  deleteFirmware(
    definitionId: string,
    firmware: IFirmware
  ): Promise<IEmptyResult>;
  updateFirmware(
    definitionId: string,
    firmware: IFirmware,
    firmwareName: string,
    firmwareDescription: string,
    firmwareSourceCodeUrl: string,
    flashSupport: boolean,
    defaultBootloaderType: IBootloaderType
  ): Promise<IEmptyResult>;

  fetchOrganizationById(
    organizationId: string
  ): Promise<IFetchOrganizationByIdResult>;
  fetchOrganizationsByIds(
    organizationIds: string[]
  ): Promise<IFetchOrganizationsByIdsResult>;
  fetchMyOrganizations(): Promise<IFetchMyOrganizationsResult>;
  fetchOrganizationMembers(
    organizationId: string
  ): Promise<IFetchOrganizationMembersResult>;
  addOrganizationMember(
    organizationId: string,
    email: string
  ): Promise<IEmptyResult>;
  deleteOrganizationMember(
    organizationId: string,
    uid: string
  ): Promise<IEmptyResult>;
  fetchAllOrganizations(): Promise<IFetchAllOrganizationsResult>;

  createAndFetchBuildableFirmware(
    keyboardDefinitionId: string
  ): Promise<IResult<IBuildableFirmware>>;
  fetchBuildableFirmwareFiles(
    keyboardDefinitionId: string,
    fileType: IBuildableFirmwareFileType
  ): Promise<IResult<IBuildableFirmwareFile[]>>;
  updateBuildableFirmware(
    keyboardDefinitionId: string,
    options: {
      enabled?: boolean;
      defaultBootloaderType?: IBootloaderType;
      keyboardDirectoryName?: string;
      qmkFirmwareVersion?: IBuildableFirmwareQmkFirmwareVersion;
      supportCodeEditing?: boolean;
    }
  ): Promise<IResult<IBuildableFirmware>>;
  createBuildableFirmwareFile(
    keyboardDefinitionId: string,
    fileType: IBuildableFirmwareFileType,
    fileName: string
  ): Promise<IEmptyResult>;
  updateBuildableFirmwareFile(
    keyboardDefinitionId: string,
    file: IBuildableFirmwareFile,
    fileType: IBuildableFirmwareFileType
  ): Promise<IEmptyResult>;
  deleteBuildableFirmwareFile(
    keyboardDefinitionId: string,
    file: IBuildableFirmwareFile,
    fileType: IBuildableFirmwareFileType
  ): Promise<IEmptyResult>;
  createFirmwareBuildingTask(
    keyboardDefinitionId: string,
    description: string,
    parametersJson: string
  ): Promise<IEmptyResult>;
  fetchFirmwareBuildingTasks(
    keyboardDefinitionId: string
  ): Promise<IResult<IFirmwareBuildingTask[]>>;
  fetchBuiltFirmwareFileBlob(
    firmwareFilePath: string
  ): Promise<IFetchFirmwareFileBlobResult>;
  fetchBuildableFirmware(
    keyboardDefinitionId: string
  ): Promise<IResult<IBuildableFirmware | null>>;
  deleteFirmwareBuildingTask(
    task: IFirmwareBuildingTask
  ): Promise<IEmptyResult>;
  updateFirmwareBuildingTaskDescription(
    taskId: string,
    description: string
  ): Promise<IEmptyResult>;
  fetchAllBuildableFirmwares(): Promise<IResult<IBuildableFirmware[]>>;

  sendOperationLog(
    uid: string,
    keyboardDefinitionId: string,
    operation: IOperationLogType
  ): Promise<void>;
  fetchKeyboardStatistics(
    keyboardDefinitionId: string
  ): Promise<IResult<IKeyboardStatistics>>;
}
/* eslint-enable no-unused-vars */
