import { KeyboardLabelLang } from '../../labellang/KeyLabelLangs';
import { IKeymap } from '../Hid';
import { KeycodeList } from '../KeycodeList';

/* eslint-disable no-unused-vars */
export enum ExtendedKind {
  NONE,
  LAYER_TAP_EXTENDED,
  TRI_LAYER_TAP,
  TAP_DANCE_DOUBLE,
  TAP_DANCE_HOLD,
}
/* eslint-enable no-unused-vars */

export interface IBmpExtendedKeycode {
  getKind(): ExtendedKind;
  getBytes(): Uint8Array;
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

  changeKind(kind: ExtendedKind): void {
    this.bytes = Uint8Array.from([kind, 0, 0, 0, 0, 0]);
  }
}

export class BmpExtendedKeycodeLte {
  private extendedKey: IBmpExtendedKeycode;
  constructor(extendedKey: IBmpExtendedKeycode) {
    this.extendedKey = extendedKey;
  }

  getLayer(): number {
    return this.extendedKey.getBytes()[1];
  }

  getKey(labelLange: KeyboardLabelLang): IKeymap {
    const bytes = this.extendedKey.getBytes();
    return KeycodeList.getKeymap(bytes[2] + (bytes[3] << 8), labelLange);
  }

  setLayer(layer: number) {
    const bytes = this.extendedKey.getBytes();
    bytes[1] = layer & 0x1f;
  }

  setKey(code: number) {
    const bytes = this.extendedKey.getBytes();
    bytes[2] = code & 0xff;
    bytes[3] = (code >> 8) & 0xff;
  }
}

export class BmpExtendedKeycodeTlt {
  private extendedKey: IBmpExtendedKeycode;
  constructor(extendedKey: IBmpExtendedKeycode) {
    this.extendedKey = extendedKey;
  }

  getLayer1(): number {
    return this.extendedKey.getBytes()[1];
  }
  getLayer2(): number {
    return this.extendedKey.getBytes()[2];
  }

  getLayer3(): number {
    return this.extendedKey.getBytes()[3];
  }
  getKey(labelLange: KeyboardLabelLang): IKeymap {
    const bytes = this.extendedKey.getBytes();
    return KeycodeList.getKeymap(bytes[4] + (bytes[5] << 8), labelLange);
  }

  setLayer1(layer: number) {
    const bytes = this.extendedKey.getBytes();
    bytes[1] = layer & 0x1f;
  }

  setLayer2(layer: number) {
    const bytes = this.extendedKey.getBytes();
    bytes[2] = layer & 0x1f;
  }

  setLayer3(layer: number) {
    const bytes = this.extendedKey.getBytes();
    bytes[3] = layer & 0x1f;
  }

  setKey(code: number) {
    const bytes = this.extendedKey.getBytes();
    bytes[4] = code & 0xff;
    bytes[5] = (code >> 8) & 0xff;
  }
}

export class BmpExtendedKeycodeTdd {
  private extendedKey: IBmpExtendedKeycode;
  constructor(extendedKey: IBmpExtendedKeycode) {
    this.extendedKey = extendedKey;
  }

  getKey1(labelLange: KeyboardLabelLang): IKeymap {
    const bytes = this.extendedKey.getBytes();
    return KeycodeList.getKeymap(bytes[1] + (bytes[2] << 8), labelLange);
  }
  getKey2(labelLange: KeyboardLabelLang): IKeymap {
    const bytes = this.extendedKey.getBytes();
    return KeycodeList.getKeymap(bytes[3] + (bytes[4] << 8), labelLange);
  }

  setKey1(code: number) {
    const bytes = this.extendedKey.getBytes();
    bytes[1] = code & 0xff;
    bytes[2] = (code >> 8) & 0xff;
  }

  setKey2(code: number) {
    const bytes = this.extendedKey.getBytes();
    bytes[3] = code & 0xff;
    bytes[4] = (code >> 8) & 0xff;
  }
}

export class BmpExtendedKeycodeTdh {
  private extendedKey: IBmpExtendedKeycode;
  constructor(extendedKey: IBmpExtendedKeycode) {
    this.extendedKey = extendedKey;
  }

  getKey1(labelLange: KeyboardLabelLang): IKeymap {
    const bytes = this.extendedKey.getBytes();
    return KeycodeList.getKeymap(bytes[1] + (bytes[2] << 8), labelLange);
  }
  getKey2(labelLange: KeyboardLabelLang): IKeymap {
    const bytes = this.extendedKey.getBytes();
    return KeycodeList.getKeymap(bytes[3] + (bytes[4] << 8), labelLange);
  }

  setKey1(code: number) {
    const bytes = this.extendedKey.getBytes();
    bytes[1] = code & 0xff;
    bytes[2] = (code >> 8) & 0xff;
  }

  setKey2(code: number) {
    const bytes = this.extendedKey.getBytes();
    bytes[3] = code & 0xff;
    bytes[4] = (code >> 8) & 0xff;
  }
}
