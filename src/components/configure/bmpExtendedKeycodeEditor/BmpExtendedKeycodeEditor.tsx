/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from 'react';
import './BmpExtendedKeycodeEditor.scss';
import { Button, Select, MenuItem } from '@mui/material';
import {
  BmpExtendedKeycodeEditorActionsType,
  BmpExtendedKeycodeEditorStateType,
} from './BmpExtendedKeycodeEditor.container';

const KEY_DIFF_HEIGHT = 78;

enum ExtendedKind {
  NONE,
  TLT,
  LTE,
  TDH,
  TDD,
}

type BmpExtendedKeycodeEditorOwnProps = {};
type BmpExtendedKeycodeEditorOwnState = {
  extendedKind: ExtendedKind;
};

type BmpExtendedKeycodeEditorProps = BmpExtendedKeycodeEditorOwnProps &
  Partial<BmpExtendedKeycodeEditorStateType> &
  Partial<BmpExtendedKeycodeEditorActionsType>;

export default class BmpExtendedKeycodeEditor extends React.Component<
  BmpExtendedKeycodeEditorProps,
  BmpExtendedKeycodeEditorOwnState
> {
  constructor(
    props:
      | BmpExtendedKeycodeEditorProps
      | Readonly<BmpExtendedKeycodeEditorProps>
  ) {
    super(props);
    this.state = { extendedKind: props.extendedKeycode![0] };
  }

  render() {
    return (
      <div
        className="bmp-extended-keycode-editor-wrapper"
        style={{ height: this.props.keyboardHeight! + KEY_DIFF_HEIGHT }}
      >
        <div className="bmp-extended-keycode-editor-content">
          <div className="bmp-extended-keycode-editor-content-title">
            Bmp Extended Keycode Editor (ID:{this.props.extendedKeyId})
          </div>
          <div>
            <ExtendedKindSelect
              kind={this.state.extendedKind}
              onChangeKind={(kind) => {
                this.setState({ extendedKind: kind });
              }}
            ></ExtendedKindSelect>
            <ExtendedKey
              kind={this.state.extendedKind}
              onUpdate={(extendedKeycode) => {}}
            ></ExtendedKey>
          </div>
          <div className="bmp-extended-keycode-editor-content-footer">
            <Button
              size="small"
              variant="text"
              color="primary"
              disableElevation
              onClick={this.props.closeBmpExtendedKeycodeEditor!.bind(this)}
            >
              BACK
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

function ExtendedKindSelect(props: {
  kind: ExtendedKind;
  onChangeKind: (kind: ExtendedKind) => void;
}) {
  return (
    <Select
      variant="standard"
      value={props.kind}
      onChange={(e) => {
        props.onChangeKind(e.target.value as ExtendedKind);
      }}
    >
      {Object.keys(ExtendedKind)
        .filter((v) => isNaN(Number(v)))
        .map((key) => {
          return (
            <MenuItem
              key={`${key}`}
              value={ExtendedKind[key as keyof typeof ExtendedKind]}
            >
              {key}
            </MenuItem>
          );
        })}
    </Select>
  );
}

function ExtendedKey(props: {
  kind: ExtendedKind;
  onUpdate: (extendedKeycode: Uint8Array) => void;
}) {
  switch (props.kind) {
    case ExtendedKind.TLT:
      return <TltExtend onUpdate={props.onUpdate}></TltExtend>;
    case ExtendedKind.LTE:
      return <LteExtend onUpdate={props.onUpdate}></LteExtend>;
    case ExtendedKind.TDH:
      return <TdhExtend onUpdate={props.onUpdate}></TdhExtend>;
    case ExtendedKind.TDD:
      return <TddExtend onUpdate={props.onUpdate}></TddExtend>;
    default:
      return <div>None</div>;
  }
}

function TltExtend(props: { onUpdate: (extendedKeycode: Uint8Array) => void }) {
  return <div>TLT</div>;
}

function LteExtend(props: { onUpdate: (extendedKeycode: Uint8Array) => void }) {
  return <div>LTE</div>;
}

function TddExtend(props: { onUpdate: (extendedKeycode: Uint8Array) => void }) {
  return <div>TDD</div>;
}

function TdhExtend(props: { onUpdate: (extendedKeycode: Uint8Array) => void }) {
  return <div>TDH</div>;
}
