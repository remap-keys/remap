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

export type SavedKeymapData = {
  id?: string; // this entity's id
  status: SavedKeymapSatus;
  authorUid: string; //  auth.uid
  vendorId: number; // Definition.vendorId if registered, otherwise DeviceInformation.vendorId
  productId: number; // Definition.productId if registered, otherwise DeviceInformation.productId
  productName: string; // Definition.productName if registered, otherwise DeviceInformation.productName
  title: string;
  desc: string;
  labelLang: KeyboardLabelLang;
  layoutOptions: LayoutOption[];
  keycodes: { [pos: string]: number }[];
  createdAt?: Date;
  updatedAt?: Date;
};

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

export interface ISavedKeymapResult extends IResult {
  savedKeymaps: SavedKeymapData[];
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

  fetchMySavedKeymaps(info: IDeviceInformation): Promise<ISavedKeymapResult>;
  createSavedKeymap(keymapData: SavedKeymapData): Promise<IResult>;
  updateSavedKeymap(keymapData: SavedKeymapData): Promise<IResult>;
  deleteSavedKeymap(savedKeymapId: string): Promise<IResult>;
}
/* eslint-enable no-unused-vars */
