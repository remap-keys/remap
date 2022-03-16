import { KeyboardLabelLang } from '../../labellang/KeyLabelLangs';
import { IKeymap } from '../Hid';
import { KeycodeList } from '../KeycodeList';
import { buildHoldKeyLabel } from '../../../components/configure/customkey/TabHoldTapKey';
import { buildModLabel } from '../../../components/configure/customkey/Modifiers';
import { genKey } from '../../../components/configure/keycodekey/KeyGen';

/* eslint-disable no-unused-vars */
export enum ExtendedKind {
  NONE,
  LAYER_TAP_EXTENDED,
  TRI_LAYER_TAP,
  TAP_DANCE_DOUBLE,
  TAP_DANCE_HOLD,
  COMBO,
}
/* eslint-enable no-unused-vars */

export interface IBmpExtendedKeycode {
  getKind(): ExtendedKind;
  getBytes(): Uint8Array;
  // eslint-disable-next-line no-unused-vars
  changeKind(kind: ExtendedKind): void;
  // eslint-disable-next-line no-unused-vars
  getDescription(labelLang: KeyboardLabelLang): string;
}

export abstract class BmpExtendedKeycode implements IBmpExtendedKeycode {
  private bytes: Uint8Array;
  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
  }

  static createExtendedKeycode(bytes: Uint8Array): IBmpExtendedKeycode {
    switch (bytes[0] as ExtendedKind) {
      case ExtendedKind.LAYER_TAP_EXTENDED:
        return new BmpExtendedKeycodeLte(bytes);
      case ExtendedKind.TRI_LAYER_TAP:
        return new BmpExtendedKeycodeTlt(bytes);
      case ExtendedKind.TAP_DANCE_DOUBLE:
        return new BmpExtendedKeycodeTwoKeyCombination(bytes);
      case ExtendedKind.TAP_DANCE_HOLD:
        return new BmpExtendedKeycodeTwoKeyCombination(bytes);
      case ExtendedKind.COMBO:
        return new BmpExtendedKeycodeCombo(bytes);
      default:
        return new BmpExtendedKeycodeNone(bytes);
    }
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

  // eslint-disable-next-line no-unused-vars
  abstract getDescription(labelLang: KeyboardLabelLang): string;
}

function keyDescription(keymap: IKeymap): string {
  const key = genKey(keymap);
  const label = key.label;
  const holdLabel = buildHoldKeyLabel(key.keymap, key.keymap.isAny);
  let modifierLabel = key.meta;
  if (holdLabel === '' && modifierLabel === '') {
    modifierLabel = buildModLabel(
      key.keymap.modifiers || null,
      key.keymap.direction!
    );
  }

  const metaRight = key.metaRight ? key.metaRight : '';

  let description = '';

  if (modifierLabel !== '') {
    description = `(${modifierLabel})${label}`;
  } else if (metaRight !== '') {
    description = `(${metaRight})${label}`;
  } else {
    description = label;
  }

  return holdLabel === '' ? description : `[${description}, ${holdLabel}]`;
}

export class BmpExtendedKeycodeNone extends BmpExtendedKeycode {
  constructor(bytes: Uint8Array) {
    super(bytes);
  }

  // eslint-disable-next-line no-unused-vars
  getDescription(_labelLang: KeyboardLabelLang): string {
    return ExtendedKind[this.getKind()];
  }
}
export class BmpExtendedKeycodeLte extends BmpExtendedKeycode {
  constructor(bytes: Uint8Array) {
    super(bytes);
  }

  getDescription(labelLang: KeyboardLabelLang): string {
    const l1 = this.getLayer();
    const key = keyDescription(this.getKey(labelLang));
    return `${ExtendedKind[this.getKind()]}(${l1}, ${key})`;
  }

  getLayer(): number {
    return this.getBytes()[1];
  }

  getKey(labelLang: KeyboardLabelLang): IKeymap {
    const bytes = this.getBytes();
    return KeycodeList.getKeymap(bytes[2] + (bytes[3] << 8), labelLang);
  }

  setLayer(layer: number) {
    const bytes = this.getBytes();
    bytes[1] = layer & 0x1f;
  }

  setKey(code: number) {
    const bytes = this.getBytes();
    bytes[2] = code & 0xff;
    bytes[3] = (code >> 8) & 0xff;
  }
}

export class BmpExtendedKeycodeTlt extends BmpExtendedKeycode {
  constructor(bytes: Uint8Array) {
    super(bytes);
  }

  getDescription(labelLang: KeyboardLabelLang): string {
    const l1 = this.getLayer1();
    const l2 = this.getLayer2();
    const l3 = this.getLayer3();
    const key = keyDescription(this.getKey(labelLang));
    return `${ExtendedKind[this.getKind()]}(${l1}, ${l2}, ${l3}, ${key})`;
  }

  getLayer1(): number {
    return this.getBytes()[1];
  }
  getLayer2(): number {
    return this.getBytes()[2];
  }

  getLayer3(): number {
    return this.getBytes()[3];
  }

  getKey(labelLange: KeyboardLabelLang): IKeymap {
    const bytes = this.getBytes();
    return KeycodeList.getKeymap(bytes[4] + (bytes[5] << 8), labelLange);
  }

  setLayer1(layer: number) {
    const bytes = this.getBytes();
    bytes[1] = layer & 0x1f;
  }

  setLayer2(layer: number) {
    const bytes = this.getBytes();
    bytes[2] = layer & 0x1f;
  }

  setLayer3(layer: number) {
    const bytes = this.getBytes();
    bytes[3] = layer & 0x1f;
  }

  setKey(code: number) {
    const bytes = this.getBytes();
    bytes[4] = code & 0xff;
    bytes[5] = (code >> 8) & 0xff;
  }
}

export class BmpExtendedKeycodeTwoKeyCombination extends BmpExtendedKeycode {
  constructor(bytes: Uint8Array) {
    super(bytes);
  }

  getDescription(labelLang: KeyboardLabelLang): string {
    const key1 = keyDescription(this.getKey1(labelLang));
    const key2 = keyDescription(this.getKey2(labelLang));
    return `${ExtendedKind[this.getKind()]}(${key1}, ${key2})`;
  }

  getKey1(labelLange: KeyboardLabelLang): IKeymap {
    const bytes = this.getBytes();
    return KeycodeList.getKeymap(bytes[1] + (bytes[2] << 8), labelLange);
  }
  getKey2(labelLange: KeyboardLabelLang): IKeymap {
    const bytes = this.getBytes();
    return KeycodeList.getKeymap(bytes[3] + (bytes[4] << 8), labelLange);
  }

  setKey1(code: number) {
    const bytes = this.getBytes();
    bytes[1] = code & 0xff;
    bytes[2] = (code >> 8) & 0xff;
  }

  setKey2(code: number) {
    const bytes = this.getBytes();
    bytes[3] = code & 0xff;
    bytes[4] = (code >> 8) & 0xff;
  }
}

export class BmpExtendedKeycodeCombo extends BmpExtendedKeycode {
  constructor(bytes: Uint8Array) {
    super(bytes);
  }

  getDescription(labelLang: KeyboardLabelLang): string {
    const key1 = keyDescription(this.getKey1(labelLang));
    const key2 = keyDescription(this.getKey2(labelLang));
    const key3 = keyDescription(this.getKey3(labelLang));
    return `${ExtendedKind[this.getKind()]}(${key1}, ${key2}, ${key3})`;
  }

  getKey1(labelLange: KeyboardLabelLang): IKeymap {
    const bytes = this.getBytes();
    return KeycodeList.getKeymap(bytes[1] + (bytes[2] << 8), labelLange);
  }
  getKey2(labelLange: KeyboardLabelLang): IKeymap {
    const bytes = this.getBytes();
    return KeycodeList.getKeymap(bytes[3], labelLange);
  }
  getKey3(labelLange: KeyboardLabelLang): IKeymap {
    const bytes = this.getBytes();
    return KeycodeList.getKeymap(bytes[4] + (bytes[5] << 8), labelLange);
  }

  setKey1(code: number) {
    const bytes = this.getBytes();
    bytes[1] = code & 0xff;
    bytes[2] = (code >> 8) & 0xff;
  }
  setKey2(code: number) {
    const bytes = this.getBytes();
    bytes[3] = code & 0xff;
  }
  setKey3(code: number) {
    const bytes = this.getBytes();
    bytes[4] = code & 0xff;
    bytes[5] = (code >> 8) & 0xff;
  }
}
