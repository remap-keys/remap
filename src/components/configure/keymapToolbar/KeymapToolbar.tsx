/* eslint-disable no-undef */
import React from 'react';
import './KeymapToolbar.scss';
import { IconButton, Tooltip } from '@material-ui/core';
import PictureAsPdfRoundedIcon from '@material-ui/icons/PictureAsPdfRounded';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import {
  KeymapMenuActionsType,
  KeymapMenuStateType,
} from './KeymapToolbar.container';
import { IKeymap } from '../../../services/hid/Hid';
import { genKey, Key } from '../keycodekey/KeyGen';
import { KeymapPdfGenerator } from '../../../services/pdf/KeymapPdfGenerator';
import Keymap from '../keymap/Keymap';

type OwnProp = {};

type KeymapMenuPropsType = OwnProp &
  Partial<KeymapMenuStateType> &
  Partial<KeymapMenuActionsType>;

type OwnKeymapMenuStateType = {};

export default class KeymapMenu extends React.Component<
  KeymapMenuPropsType,
  OwnKeymapMenuStateType
> {
  private menuRef: React.RefObject<HTMLDivElement>;
  constructor(props: KeymapMenuPropsType | Readonly<KeymapMenuPropsType>) {
    super(props);
    this.state = {};
    this.menuRef = React.createRef<HTMLDivElement>();
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

  private onClickClearAllRemaps() {
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
    return (
      <React.Fragment>
        <div className="keymap-menu">
          <div className="keymap-menu-item">
            <Tooltip arrow={true} placement="top" title="Clear all changes">
              <span>
                <IconButton
                  disabled={!this.hasChanges}
                  size="small"
                  onClick={this.onClickClearAllRemaps.bind(this)}
                >
                  <ClearAllIcon
                    color={this.hasChanges ? undefined : 'disabled'}
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
      </React.Fragment>
    );
  }
}
