import { LayoutTextOptions } from 'pdf-lib';
import { LightingValues } from '../../components/configure/configuration/Lighting';
import { LayerOptions } from '../../components/configure/keymap/Keymap';
import { IFirmwareCodePlace } from '../../store/state';
import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';

export interface IResult {
  readonly success: boolean;
  readonly error?: string;
  readonly cause?: any;
}

export interface IKeyboardSettings {
  labelLang: KeyboardLabelLang;
  lighting: LightingValues;
  layerOptions: LayerOptions;
  keycodes: { [pos: string]: number };
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

export interface IKeyboardSettingsResult extends IResult {
  settingsId: string;
  settings?: IKeyboardSettings;
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
  createKeymaps(
    vendorId: number,
    productId: number,
    productName: string,
    keyboardSettings: IKeyboardSettings
  ): Promise<IKeyboardSettingsResult>;

  updateKeymaps(
    settingsId: string,
    keyboardSettings: IKeyboardSettings
  ): Promise<IKeyboardSettingsResult>;

  fetchKeymaps(settingsId: string): Promise<IKeyboardSettingsResult>;
  deleteKeymaps(settingsId: string): Promise<IKeyboardSettingsResult>;
}
/* eslint-enable no-unused-vars */
