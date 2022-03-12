export enum ExtendedKind {
  NONE,
  TLT,
  LTE,
  TDH,
  TDD,
}

export interface IBmpExtendedKeycode {
  getKind(): ExtendedKind;
  getBytes(): Uint8Array;
  // eslint-disable-next-line no-unused-vars
  updateBytes(bytes: Uint8Array): void;
  // eslint-disable-next-line no-unused-vars
  changeKind(kind: ExtendedKind): void;
}

export class BmpExtendedKeycode implements IBmpExtendedKeycode {
  private bytes: Uint8Array;
  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
  }

  getKind(): ExtendedKind {
    return this.bytes[0];
  }

  getBytes(): Uint8Array {
    return this.bytes;
  }

  updateBytes(bytes: Uint8Array): void {
    this.bytes = bytes;
  }

  changeKind(kind: ExtendedKind): void {
    this.bytes = Uint8Array.from([kind, 0, 0, 0, 0, 0]);
  }
}
