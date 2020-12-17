export interface IResult {
  readonly success: boolean;
  readonly error?: string;
  readonly cause?: any;
}

export interface IConnectParams {
  readonly vendorId: number;
  readonly productId: number;
}

export interface IDeviceInformation {
  readonly vendorId: string;
  readonly productId: string;
  readonly productName: string;
}

export interface IConnectionEventHandler {
  connect: (keyboard: IKeyboard) => void;
  disconnect: (keyboard: IKeyboard) => void;
}

export interface IKeyboard {
  getInformation(): IDeviceInformation;
  open(): Promise<IResult>;
  isOpened(): boolean;
  enqueue(command: ICommand): Promise<IResult>;
  close(): Promise<void>;
  equals(keyboard: IKeyboard): boolean;
}

export interface ICommand {
  sendReport(device: any): Promise<void>;
  handleInputReport(data: any): Promise<void>;
}

export interface IConnectResult extends IResult {
  keyboard?: IKeyboard;
}

export interface IHid {
  detectKeyboards(): Promise<IKeyboard[]>;
  setConnectionEventHandler(handler: IConnectionEventHandler): void;
  connect(connectParams?: IConnectParams): Promise<IConnectResult>;
}
