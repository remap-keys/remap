import { KeyboardDefinitionSchema } from '../../gen/types/KeyboardDefinition';

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
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface IExistsResult extends IResult {
  exists?: boolean;
}

export interface IFetchKeyboardDefinitionResult extends IExistsResult {
  document?: IKeyboardDefinitionDocument;
}

export interface IFetchMyKeyboardDefinitionDocumentsResult extends IResult {
  documents?: IKeyboardDefinitionDocument[];
}

export interface IStorage {
  fetchKeyboardDefinition(
    vendorId: number,
    productId: number,
    productName: string
  ): Promise<IFetchKeyboardDefinitionResult>;
  fetchClosedBetaUsers(): Promise<string[]>;
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
    status: IKeyboardDefinitionStatus
  ): Promise<IResult>;
  isExistKeyboardDefinitionDocument(
    vendorId: number,
    productId: number,
    productName: string
  ): Promise<IExistsResult>;
}
