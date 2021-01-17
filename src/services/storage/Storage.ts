export interface IResult {
  readonly success: boolean;
  readonly error?: string;
  readonly cause?: any;
}

export interface IKeyboardDefinitionDocument {
  readonly id: string;
  readonly name: string;
  readonly vendorId: number;
  readonly productId: number;
  readonly json: string;
}

export interface IFetchKeyboardDefinitionResult extends IResult {
  exists?: boolean;
  document?: IKeyboardDefinitionDocument;
}

export interface IStorage {
  fetchKeyboardDefinition(
    vendorId: number,
    productId: number,
    productName: string,
  ): Promise<IFetchKeyboardDefinitionResult>;
  fetchClosedBetaUsers(): Promise<string[]>;
}
