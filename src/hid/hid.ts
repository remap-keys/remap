export interface IResult {
  readonly success: boolean;
  readonly error?: string;
  readonly cause?: any;
}

export interface IConnectParams {
  readonly vendorId: string;
  readonly productId: string;
}

export interface IDeviceInformation {
  readonly vendorId: string;
  readonly productId: string;
  readonly productName: string;
}

export interface IKeyboard {
  getInformation(): IDeviceInformation;
  isOpened(): boolean;
  close(): Promise<void>;
}

export interface ICommand {
  sendReport(device: any): Promise<void>;
  handleInputReport(data: any): Promise<void>;
}

export interface IHid {
  connect(connectParams: IConnectParams): Promise<IResult>;
  isConnected(): boolean;
  isOpened(): boolean;
  getKeyboard(): IKeyboard | undefined;
  close(): Promise<void>;
  execute(command: ICommand): Promise<void>;
}
