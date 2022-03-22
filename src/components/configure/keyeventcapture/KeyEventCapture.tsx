import React from 'react';
import KeyModel from '../../../models/KeyModel';
import { KeycodeCompositionFactory } from '../../../services/hid/Composition';
import { IKeymap } from '../../../services/hid/Hid';
import { keyInfoList } from '../../../services/hid/KeycodeInfoList';
import {
  KeyboardLabelLang,
  KeyLabelLangs,
} from '../../../services/labellang/KeyLabelLangs';
import { genKey, Key } from '../keycodekey/KeyGen';

type OwnProps = {
  labelLang: KeyboardLabelLang;
  selectedLayer: number;
  selectedPos: string;
  onKeyDown: (
    // eslint-disable-next-line no-unused-vars
    newKey: Key,
    // eslint-disable-next-line no-unused-vars
    oldKeycode: number,
    // eslint-disable-next-line no-unused-vars
    selectedLayer: number,
    // eslint-disable-next-line no-unused-vars
    selectedPos: string,
    // eslint-disable-next-line no-unused-vars
    nextPos: string
  ) => void;
  isTestMatrix: boolean;
  keyModels: KeyModel[];
  keymaps: { [pos: string]: IKeymap };
};
type KeyEventCaptureProps = OwnProps;

type OwnState = {};

export default class KeyEventCapture extends React.Component<
  KeyEventCaptureProps,
  OwnState
> {
  constructor(props: KeyEventCaptureProps | Readonly<KeyEventCaptureProps>) {
    super(props);
  }
  private onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.repeat || (e.target as HTMLElement).tagName === 'INPUT') {
      return;
    }

    const newKey = this.keycodeFromKeyboardEvent(e);
    if (!newKey) {
      return;
    }

    const currentIndex = this.props.keyModels.findIndex(
      (k) => k.pos === this.props.selectedPos
    );
    const nextIndex = (currentIndex + 1) % this.props.keyModels.length;
    const nextPos = this.props.keyModels[nextIndex].pos;

    this.props.onKeyDown!(
      newKey,
      this.props.keymaps[this.props.selectedPos].code,
      this.props.selectedLayer,
      this.props.selectedPos,
      nextPos
    );
  }

  keycodeFromKeyboardEvent(e: React.KeyboardEvent<HTMLDivElement>): Key | null {
    let keyString =
      e.location == KeyboardEvent.DOM_KEY_LOCATION_LEFT
        ? `l${e.key}`
        : e.location == KeyboardEvent.DOM_KEY_LOCATION_RIGHT
        ? `r${e.key}`
        : e.location == KeyboardEvent.DOM_KEY_LOCATION_NUMPAD
        ? `kp_${e.key}`
        : e.key === 'Delete'
        ? `Del`
        : e.key === ' '
        ? `Space`
        : e.key;
    const keyLabels = KeyLabelLangs.getKeyLabels(this.props.labelLang!);
    let info = keyLabels.find(
      (k) =>
        k.label === keyString.toLowerCase() ||
        k.keywords?.some((k) => k === keyString.toLowerCase())
    )?.code;

    if (!info) {
      info = keyInfoList.find(
        (k) =>
          k.keycodeInfo.label
            .toLowerCase()
            .split(' ')
            .join('')
            .toLowerCase() === keyString.toLowerCase() ||
          k.keycodeInfo.keywords.some(
            (keyword) => keyword.toLowerCase() === keyString.toLowerCase()
          )
      )?.keycodeInfo.code;

      if (!info) {
        return null;
      }
    }

    const compositionFactory = new KeycodeCompositionFactory(
      info,
      this.props.labelLang!
    );

    if (!compositionFactory.isBasic()) {
      return null;
    }

    const keymap = compositionFactory.createBasicComposition().genKeymap();

    if (!keymap) {
      return null;
    }

    return genKey(keymap, this.props.labelLang);
  }

  render() {
    return (
      <div
        tabIndex={-1}
        onKeyDown={(e) => {
          if (!this.props.isTestMatrix) {
            this.onKeyDown(e);
          }
        }}
        style={{ outline: 'none' }}
      >
        {this.props.children}
      </div>
    );
  }
}
