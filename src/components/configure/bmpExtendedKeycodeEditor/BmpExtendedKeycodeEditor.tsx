/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from 'react';
import './BmpExtendedKeycodeEditor.scss';
import { Button, Select, MenuItem } from '@mui/material';
import {
  BmpExtendedKeycodeEditorActionsType,
  BmpExtendedKeycodeEditorStateType,
} from './BmpExtendedKeycodeEditor.container';
import {
  ExtendedKind,
  IBmpExtendedKeycode,
} from '../../../services/hid/bmp/BmpExtendedKeycode';
import lodash from 'lodash';

const KEY_DIFF_HEIGHT = 78;

type BmpExtendedKeycodeEditorOwnProps = {};
type BmpExtendedKeycodeEditorOwnState = {};

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
    this.state = {};
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
              extendedKeycode={this.props.extendedKeycode!}
              onChange={(value) => {
                this.props.updateBmpExtendedKeycode!(value);
              }}
            ></ExtendedKindSelect>
            <ExtendedKey
              extendedKeycode={this.props.extendedKeycode!}
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
  extendedKeycode: IBmpExtendedKeycode;
  onChange: (value: IBmpExtendedKeycode) => void;
}) {
  return (
    <Select
      variant="standard"
      value={props.extendedKeycode.getKind()}
      onChange={(e) => {
        const extendedKeycode = lodash.cloneDeep(props.extendedKeycode);
        extendedKeycode.changeKind(e.target.value as ExtendedKind);
        props.onChange(extendedKeycode);
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

function ExtendedKey(props: { extendedKeycode: IBmpExtendedKeycode }) {
  switch (props.extendedKeycode.getKind()) {
    case ExtendedKind.TLT:
      return <TltExtend extendedKeycode={props.extendedKeycode}></TltExtend>;
    case ExtendedKind.LTE:
      return <LteExtend extendedKeycode={props.extendedKeycode}></LteExtend>;
    case ExtendedKind.TDH:
      return <TdhExtend extendedKeycode={props.extendedKeycode}></TdhExtend>;
    case ExtendedKind.TDD:
      return <TddExtend extendedKeycode={props.extendedKeycode}></TddExtend>;
    default:
      return <div>None</div>;
  }
}

function TltExtend(props: { extendedKeycode: IBmpExtendedKeycode }) {
  return <div>TLT</div>;
}

function LteExtend(props: { extendedKeycode: IBmpExtendedKeycode }) {
  return <div>LTE</div>;
}

function TddExtend(props: { extendedKeycode: IBmpExtendedKeycode }) {
  return <div>TDD</div>;
}

function TdhExtend(props: { extendedKeycode: IBmpExtendedKeycode }) {
  return <div>TDH</div>;
}
