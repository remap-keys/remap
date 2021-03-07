/* eslint-disable no-undef */
import React from 'react';
import './KeymapToolbar.scss';
import { IconButton, Tooltip } from '@material-ui/core';
import ClearAllRoundedIcon from '@material-ui/icons/ClearAllRounded';
import FlareRoundedIcon from '@material-ui/icons/FlareRounded';
import PictureAsPdfRoundedIcon from '@material-ui/icons/PictureAsPdfRounded';
import ViewQuiltRoundedIcon from '@material-ui/icons/ViewQuiltRounded';

import {
  KeymapMenuActionsType,
  KeymapMenuStateType,
} from './KeymapToolbar.container';
import { IKeymap } from '../../../services/hid/Hid';
import { genKey, Key } from '../keycodekey/KeyGen';
import { KeymapPdfGenerator } from '../../../services/pdf/KeymapPdfGenerator';
import Keymap from '../keymap/Keymap';
import LightingDialog from '../lighting/LightingDialog';
import LayoutOptionPopover from '../layoutoption/LayoutOptionPopover.container';
import { ImportFileIcon } from '../../common/icons/ImportFileIcon';
import ImportDefDialog from '../importDef/ImportDefDialog.container';
import SwapHorizRoundedIcon from '@material-ui/icons/SwapHorizRounded';
import KeymapListPopover from '../keymaplist/KeymapListPopover.container';

type OwnProp = {};

type KeymapMenuPropsType = OwnProp &
  Partial<KeymapMenuStateType> &
  Partial<KeymapMenuActionsType>;

type OwnKeymapMenuStateType = {
  openLightingDialog: boolean;
  layoutOptionPopoverPosition: { left: number; top: number } | null;
  keymapListPopoverPosition: { left: number; top: number } | null;
  openImportDefDialog: boolean;
};

export default class KeymapMenu extends React.Component<
  KeymapMenuPropsType,
  OwnKeymapMenuStateType
> {
  constructor(props: KeymapMenuPropsType | Readonly<KeymapMenuPropsType>) {
    super(props);
    this.state = {
      openLightingDialog: false,
      layoutOptionPopoverPosition: null,
      keymapListPopoverPosition: null,
      openImportDefDialog: false,
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

  private onClickOpenLayoutOptionPopover(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const { left, top } = event.currentTarget.getBoundingClientRect();
    this.setState({
      layoutOptionPopoverPosition: {
        left,
        top,
      },
    });
  }

  private onCloseLayoutOptionPopover() {
    this.setState({ layoutOptionPopoverPosition: null });
  }

  private onClickOpenImportDefFileDialog() {
    this.setState({ openImportDefDialog: true });
  }

  private onCloseImportDefFileDialog() {
    this.setState({ openImportDefDialog: false });
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

  private onClickOpenKeymapListPopover(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const { left, top } = event.currentTarget.getBoundingClientRect();
    this.setState({
      keymapListPopoverPosition: {
        left,
        top,
      },
    });
  }

  private onCloseKeymapListPopover() {
    this.setState({ keymapListPopoverPosition: null });
  }

  render() {
    const isLightingAvailable = LightingDialog.isLightingAvailable(
      this.props.keyboardDefinition!.lighting
    );
    const hasLayoutOptions = 0 < this.props.selectedKeyboardOptions!.length;
    const {
      vendorId,
      productId,
      productName,
    } = this.props.keyboard!.getInformation();
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

          {isLightingAvailable && (
            <div className="keymap-menu-item">
              <Tooltip arrow={true} placement="top" title="Lighting">
                <IconButton
                  size="small"
                  onClick={() => {
                    this.setState({ openLightingDialog: true });
                  }}
                >
                  <FlareRoundedIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}

          {hasLayoutOptions && (
            <div className="keymap-menu-item">
              <Tooltip arrow={true} placement="top" title="Layout Option">
                <IconButton
                  size="small"
                  onClick={(event) => {
                    this.onClickOpenLayoutOptionPopover(event);
                  }}
                >
                  <ViewQuiltRoundedIcon />
                </IconButton>
              </Tooltip>
              <LayoutOptionPopover
                open={Boolean(this.state.layoutOptionPopoverPosition)}
                onClose={() => {
                  this.onCloseLayoutOptionPopover();
                }}
                position={this.state.layoutOptionPopoverPosition}
              />
            </div>
          )}

          <div className="keymap-menu-item">
            <Tooltip
              arrow={true}
              placement="top"
              title="Save/Import another keymap"
            >
              <IconButton
                size="small"
                onClick={(event) => {
                  this.onClickOpenKeymapListPopover(event);
                }}
              >
                <SwapHorizRoundedIcon />
              </IconButton>
            </Tooltip>
            <KeymapListPopover
              open={Boolean(this.state.keymapListPopoverPosition)}
              onClose={() => {
                this.onCloseKeymapListPopover();
              }}
              position={this.state.keymapListPopoverPosition}
            />
          </div>

          <div className="keymap-menu-item">
            <Tooltip
              arrow={true}
              placement="top"
              title="Import local keyboard definition file(.json)"
            >
              <IconButton
                size="small"
                onClick={this.onClickOpenImportDefFileDialog.bind(this)}
              >
                <ImportFileIcon />
              </IconButton>
            </Tooltip>
            <ImportDefDialog
              open={this.state.openImportDefDialog}
              onClose={this.onCloseImportDefFileDialog.bind(this)}
              vendorId={vendorId}
              productId={productId}
              productName={productName}
            />
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
