/* eslint-disable no-undef */
import React from 'react';
import './KeymapToolbar.scss';
import { IconButton, Tooltip } from '@material-ui/core';
import ClearAllRoundedIcon from '@material-ui/icons/ClearAllRounded';
import FlareRoundedIcon from '@material-ui/icons/FlareRounded';
import PictureAsPdfRoundedIcon from '@material-ui/icons/PictureAsPdfRounded';

import {
  KeymapMenuActionsType,
  KeymapMenuStateType,
} from './KeymapToolbar.container';
import { IKeymap } from '../../../services/hid/Hid';
import { genKey, Key } from '../keycodekey/KeyGen';
import { KeymapPdfGenerator } from '../../../services/pdf/KeymapPdfGenerator';
import Keymap from '../keymap/Keymap';
import LightingDialog from '../../lighting/LightingDialog';

type OwnProp = {};

type KeymapMenuPropsType = OwnProp &
  Partial<KeymapMenuStateType> &
  Partial<KeymapMenuActionsType>;

type OwnKeymapMenuStateType = {
  openLightingDialog: boolean;
};

export default class KeymapMenu extends React.Component<
  KeymapMenuPropsType,
  OwnKeymapMenuStateType
> {
  constructor(props: KeymapMenuPropsType | Readonly<KeymapMenuPropsType>) {
    super(props);
    this.state = {
      openLightingDialog: false,
    };
  }

  get hasChanges(): boolean {
    for (let i = 0; i < this.props.remaps!.length; i++) {
      const remap: { [pos: string]: IKeymap } = this.props.remaps![i];
      const item = Object.values(remap).find(
        (value) => typeof value === 'object' && typeof value.code === 'number'
      );
      if (item != undefined) return true;
    }

    return false;
  }

  private onClickClearAllChanges() {
    this.props.clearAllRemaps!(this.props.layerCount!);
  }

  private onClickGetCheatsheet() {
    const keymaps: { [pos: string]: IKeymap }[] = this.props.keymaps!;
    const keys: { [pos: string]: Key }[] = [];
    for (let i = 0; i < this.props.layerCount!; i++) {
      const keyMap: { [pos: string]: Key } = {};
      const km = keymaps[i];
      Object.keys(km).forEach((pos) => {
        const key: Key = genKey(km[pos], this.props.labelLang!);
        keyMap[pos] = key;
      });
      keys.push(keyMap);
    }
    const layoutOptions = Keymap.buildLayerOptions(
      this.props.selectedKeyboardOptions!,
      this.props.keyboardDefinition!.layouts.labels!
    );
    const { productName } = this.props.keyboard!.getInformation();
    const pdf = new KeymapPdfGenerator(
      this.props.keyboardDefinition!.layouts.keymap,
      keys,
      this.props.layerCount!,
      this.props.labelLang!
    );

    pdf.genPdf(productName, layoutOptions);
  }

  render() {
    const isLightingAvailable = LightingDialog.isLightingAvailable(
      this.props.keyboardDefinition!.lighting
    );
    return (
      <React.Fragment>
        <div className="keymap-menu">
          <div className="keymap-menu-item">
            <Tooltip arrow={true} placement="top" title="Clear all changes">
              <span>
                <IconButton
                  disabled={!this.hasChanges}
                  size="small"
                  onClick={this.onClickClearAllChanges.bind(this)}
                >
                  <ClearAllRoundedIcon
                    color={this.hasChanges ? undefined : 'disabled'}
                  />
                </IconButton>
              </span>
            </Tooltip>
          </div>

          <div className="keymap-menu-item">
            <Tooltip arrow={true} placement="top" title="Lighting">
              <span>
                <IconButton
                  disabled={!isLightingAvailable}
                  size="small"
                  onClick={() => {
                    this.setState({ openLightingDialog: true });
                  }}
                >
                  <FlareRoundedIcon
                    color={isLightingAvailable ? undefined : 'disabled'}
                  />
                </IconButton>
              </span>
            </Tooltip>
          </div>

          <div className="keymap-menu-item">
            <Tooltip
              arrow={true}
              placement="top"
              title="Get keymap cheat sheet (PDF)"
            >
              <IconButton
                size="small"
                onClick={this.onClickGetCheatsheet.bind(this)}
              >
                <PictureAsPdfRoundedIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <LightingDialog
          open={this.state.openLightingDialog}
          keyboard={this.props.keyboard!}
          lightingDef={this.props.keyboardDefinition!.lighting}
          onClose={() => {
            this.setState({ openLightingDialog: false });
          }}
        />
      </React.Fragment>
    );
  }
}
