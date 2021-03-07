/* eslint-disable no-undef */
import React from 'react';
import './KeymapListPopover.scss';
import {
  KeymapListPopoverActionsType,
  KeymapListPopoverStateType,
} from './KeymapListPopover.container';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Popover,
} from '@material-ui/core';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import KeymapSaveDialog from './KeymapSaveDialog.container';
import { ISavedKeymapData } from '../../../services/storage/Storage';
import { IKeymap } from '../../../services/hid/Hid';
import { KeycodeList } from '../../../services/hid/KeycodeList';

type PopoverPosition = {
  left: number;
  top: number;
};

type OwnProps = {
  open: boolean;
  position: PopoverPosition | null;
  onClose: () => void;
};

type KeymapListPopoverProps = OwnProps &
  Partial<KeymapListPopoverActionsType> &
  Partial<KeymapListPopoverStateType>;

type OwnState = {
  openKeymapSaveDialog: boolean;
  savedKeymapData: ISavedKeymapData | null;
};

export default class KeymapListPopover extends React.Component<
  KeymapListPopoverProps,
  OwnState
> {
  private popoverRef: React.RefObject<HTMLDivElement>;
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      openKeymapSaveDialog: false,
      savedKeymapData: null,
    };
    this.popoverRef = React.createRef<HTMLDivElement>();
  }

  get position(): { left: number; top: number } {
    if (!this.props.position) {
      return {
        left: 0,
        top: 0,
      };
    }
    const { left, top } = this.props.position;
    const width = 360;
    const height = 400;
    const iconSize = 30;
    const margin = 10;

    if (window.innerWidth < left + width + iconSize + margin) {
      const x = Math.min(left, left - (width - (window.innerWidth - left)));
      const y = top + iconSize + margin; // 10=margin
      return { left: x, top: y };
    } else {
      const x = left + iconSize + margin; // 10=margin
      const y = top - height / 2 + iconSize / 2;
      return { left: x, top: y };
    }
  }

  private onEnter() {}

  private onClickApplySavedKeymapData(savedKeymapData: ISavedKeymapData) {
    const labelLang = savedKeymapData.data.labelLang;
    let keycodes: { [pos: string]: IKeymap }[] = [];
    const savedKeycodes: { [pos: string]: number }[] =
      savedKeymapData.data.keycodes;
    const keymaps: { [pos: string]: IKeymap }[] = this.props.keymaps!;
    for (let i = 0; i < keymaps.length; i++) {
      const keymap = keymaps[i];
      const savedCode = savedKeycodes[i];
      const changes: { [pos: string]: IKeymap } = {};
      Object.keys(keymap).forEach((pos) => {
        if (keymap[pos].code != savedCode[pos]) {
          changes[pos] = KeycodeList.getKeymap(savedCode[pos], labelLang);
        }
      });
      keycodes.push(changes);
    }

    this.props.applySavedKeymapData!(keycodes, labelLang);
  }

  private onClickOpenKeymapSaveDialog(
    savedKeymapData: ISavedKeymapData | null
  ) {
    this.setState({ openKeymapSaveDialog: true, savedKeymapData });
  }

  private onCloseKeymapSaveDialog() {
    this.setState({ openKeymapSaveDialog: false, savedKeymapData: null });
  }

  render() {
    if (!this.props.position) {
      return <></>;
    }

    return (
      <Popover
        open={this.props.open}
        anchorReference="anchorPosition"
        anchorPosition={this.position}
        onEnter={this.onEnter.bind(this)}
        onClose={() => {
          this.props.onClose();
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        className="keymaplist-root"
      >
        <div className="keymaplist-popover" ref={this.popoverRef}>
          <div className="keymaplist keymaplist-header">
            <div>
              <h2>Keymaps</h2>
            </div>
            <div className="keymaplist-header-buttons">
              <Button
                color="primary"
                onClick={() => {
                  this.onClickOpenKeymapSaveDialog(null);
                }}
              >
                SAVE CURRENT KEYMAP
              </Button>
            </div>
          </div>
          <div className="keymaplist keymaplist-content">
            <List dense={true}>
              {this.props.savedKeymaps!.map((item, index) => {
                return (
                  <ListItem
                    key={`keymaplist-keymap${index}`}
                    button
                    onClick={() => {
                      this.onClickApplySavedKeymapData(item);
                    }}
                  >
                    <ListItemText primary={item.title} secondary={item.desc} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => {
                          console.log(item);
                          this.onClickOpenKeymapSaveDialog(item);
                        }}
                      >
                        <EditRoundedIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
            {this.props.savedKeymaps!.length === 0 && (
              <div className="no-saved-keymap">
                You can save the current keymap by clicking the top-right
                button. You can restore your saved keymap everytime.
                <div className="keymaplist-warning">
                  * Please note that the change candidates will discard when you
                  save/restore the kemyap.
                </div>
              </div>
            )}
          </div>
        </div>
        <KeymapSaveDialog
          open={this.state.openKeymapSaveDialog}
          savedKeymapData={this.state.savedKeymapData}
          onClose={() => {
            this.onCloseKeymapSaveDialog();
          }}
        />
      </Popover>
    );
  }
}
