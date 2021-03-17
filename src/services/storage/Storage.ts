import { LayoutOption } from '../../components/configure/keymap/Keymap';
import { IFirmwareCodePlace } from '../../store/state';
import { IDeviceInformation } from '../hid/Hid';
import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';

export interface IResult {
  readonly success: boolean;
  readonly error?: string;
  readonly cause?: any;
}

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

export type SavedKeymapCollection = 'registereds' | 'unregistereds';

export interface IKeyboardDefinitionDocument {
  readonly id: string;
  readonly authorUid: string;
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
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type SavedKeymapData = {
  id?: string; // this entity's id
  author_uid: string; //  auth.uid
  title: string;
  desc: string;
  label_lang: KeyboardLabelLang;
  layout_options: LayoutOption[];
  keycodes: { [pos: string]: number }[];
  created_at?: Date;
  updated_at?: Date;
};

export type SavedRegisteredKeymapData = {
  definition_id: string; // /keyboards/v2/definitions/{ID}
} & SavedKeymapData;

export type SavedUnregisteredKeymapData = {
  vendor_id: number;
  product_id: number;
  product_name: string;
} & SavedKeymapData;

export function isSavedRegisteredKeymapData(
  arg: any
): arg is SavedRegisteredKeymapData {
  return arg.definition_id != undefined;
}

export interface IExistsResult extends IResult {
  exists?: boolean;
}

export interface IFetchKeyboardDefinitionDocumentResult extends IExistsResult {
  document?: IKeyboardDefinitionDocument;
}

export interface IFetchMyKeyboardDefinitionDocumentsResult extends IResult {
  documents?: IKeyboardDefinitionDocument[];
}

export interface ICreateKeyboardDefinitionDocumentResult extends IResult {
  definitionId?: string;
}

export interface ISavedKeymapResule extends IResult {
  savedKeymaps: SavedRegisteredKeymapData[] | SavedUnregisteredKeymapData[];
}

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
    status: IKeyboardDefinitionStatus
  ): Promise<IResult>;
  updateKeyboardDefinitionJson(
    definitionId: string,
    jsonStr: string
  ): Promise<IResult>;
  deleteKeyboardDefinitionDocument(definitionId: string): Promise<IResult>;

  fetchSavedRegisteredKeymaps(
    definitionId: string
  ): Promise<ISavedKeymapResule>;
  createSavedKeymap(
    keymapData: SavedKeymapData,
    targetCollection: SavedKeymapCollection
  ): Promise<IResult>;
  updateSavedKeymap(
    keymapData: SavedKeymapData,
    targetCollection: SavedKeymapCollection
  ): Promise<IResult>;
  deleteSavedKeymap(
    savedKeymapId: string,
    targetCollection: SavedKeymapCollection
  ): Promise<IResult>;

  fetchUnregisteredKeymaps(
    info: IDeviceInformation
  ): Promise<ISavedKeymapResule>;
}
/* eslint-enable no-unused-vars */
