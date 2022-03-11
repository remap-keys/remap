/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from 'react';
import './BmpExtendedKeycodeEditor.scss';
import { Button } from '@mui/material';
import {
  BmpExtendedKeycodeEditorActionsType,
  BmpExtendedKeycodeEditorStateType,
} from './BmpExtendedKeycodeEditor.container';

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
            Bmp Extended Keycode Editor
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
