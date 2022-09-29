/* eslint-disable no-undef */
import React from 'react';
import './KeymapSaveDialog.scss';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  PaperProps,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import Draggable from 'react-draggable';
import CloseIcon from '@mui/icons-material/Close';
import {
  KeymapSaveDialogActionsType,
  KeymapSaveDialogStateType,
} from './KeymapSaveDialog.container';
import { IEncoderKeymaps, IKeymap } from '../../../services/hid/Hid';
import { KeyboardLabelLang } from '../../../services/labellang/KeyLabelLangs';
import {
  isApprovedKeyboard,
  SavedKeymapData,
} from '../../../services/storage/Storage';

const MAX_TITLE_TEXT_COUNT = 52;
const MAX_DESC_TEXT_COUNT = 200;

type OwnProps = {
  open: boolean;
  savedKeymapData: SavedKeymapData | null;
  authorUid: string;
  authorDisplayName: string;
  onClose: () => void;
};

type KeymapSaveDialogProps = OwnProps &
  Partial<KeymapSaveDialogActionsType> &
  Partial<KeymapSaveDialogStateType>;

type OwnState = {
  title: string;
  desc: string;
  shared: boolean;
};
export default class LayoutOptionPopover extends React.Component<
  KeymapSaveDialogProps,
  OwnState
> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      title: this.props.savedKeymapData ? this.props.savedKeymapData.title : '',
      desc: this.props.savedKeymapData ? this.props.savedKeymapData.desc : '',
      shared: this.props.savedKeymapData
        ? this.props.savedKeymapData.status === 'shared'
        : false,
    };
  }

  get isEdit(): boolean {
    return Boolean(this.props.savedKeymapData);
  }

  private onEnter() {
    this.setState({
      title: this.props.savedKeymapData ? this.props.savedKeymapData.title : '',
      desc: this.props.savedKeymapData ? this.props.savedKeymapData.desc : '',
      shared: this.props.savedKeymapData
        ? this.props.savedKeymapData.status === 'shared'
        : false,
    });
  }

  private buildCurrentKeymapKeycodes(): { [pos: string]: number }[] {
    const keymaps: { [pos: string]: IKeymap }[] = this.props.keymaps!;
    const keycodes: { [pos: string]: number }[] = [];
    for (let i = 0; i < this.props.layerCount!; i++) {
      const keyMap: { [pos: string]: number } = {};
      const km = keymaps[i];
      Object.keys(km).forEach((pos) => {
        keyMap[pos] = km[pos].code;
      });
      keycodes.push(keyMap);
    }

    return keycodes;
  }

  private buildCurrentEncodersKeymapKeycodes(): {
    [id: number]: { clockwise: number; counterclockwise: number };
  }[] {
    if (this.props.encodersKeymaps === undefined) {
      return (
        new Array(this.props.layerCount!) as {
          [id: number]: { clockwise: number; counterclockwise: number };
        }[]
      ).fill({});
    }
    const keymaps: IEncoderKeymaps[] = this.props.encodersKeymaps;
    const keycodes: {
      [id: number]: { clockwise: number; counterclockwise: number };
    }[] = [];
    for (let i = 0; i < this.props.layerCount!; i++) {
      const keymap: {
        [id: number]: { clockwise: number; counterclockwise: number };
      } = {};
      const km = keymaps[i];
      Object.keys(km).forEach((id) => {
        keymap[Number(id)] = {
          clockwise: km[Number(id)].clockwise.code,
          counterclockwise: km[Number(id)].counterclockwise.code,
        };
      });
      keycodes.push(keymap);
    }
    return keycodes;
  }

  private onClickDeleteButton() {
    if (!this.props.savedKeymapData) return;

    this.props.deleteSavedKeymap!(this.props.savedKeymapData);
    this.props.onClose();
  }

  private onClickSaveButton() {
    if (this.props.savedKeymapData) {
      const save: SavedKeymapData = {
        ...this.props.savedKeymapData,
        title: this.state.title,
        desc: this.state.desc,
        status: this.state.shared ? 'shared' : 'private',
        author_display_name: this.props.authorDisplayName,
      };
      this.props.updateSavedKeymap!(save);
    } else {
      this.createSavedKeymap();
    }
    this.props.onClose();
  }

  private createSavedKeymap() {
    const labelLang: KeyboardLabelLang = this.props.labelLang!;
    const keycodes: {
      [pos: string]: number;
    }[] = this.buildCurrentKeymapKeycodes();
    const encoderKeycodes: {
      [id: number]: { clockwise: number; counterclockwise: number };
    }[] = this.buildCurrentEncodersKeymapKeycodes();

    let info: { vendorId: number; productId: number; productName: string };
    if (isApprovedKeyboard(this.props.keyboardDefinitionDocument)) {
      /**
       * Only approved keyboard definition is trusted uniquness data(vendor_id/product_id/product_name)
       */
      info = this.props.keyboardDefinitionDocument!;
    } else {
      info = this.props.keyboard!.getInformation();
    }

    const savedKeymap: SavedKeymapData = {
      status: this.state.shared ? 'shared' : 'private',
      vendor_id: info.vendorId,
      product_id: info.productId,
      product_name: info.productName,
      author_uid: this.props.authorUid,
      author_display_name: this.props.authorDisplayName,
      title: this.state.title,
      desc: this.state.desc,
      label_lang: labelLang,
      layout_options: this.props.selectedLayoutOptions!,
      keycodes,
      encoderKeycodes,
    };
    this.props.createSavedKeymap!(savedKeymap);
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        maxWidth={'md'}
        PaperComponent={PaperComponent}
        className="keymap-save-dialog"
        TransitionProps={{
          onEnter: this.onEnter.bind(this),
        }}
      >
        <DialogTitle id="draggable-dialog-title" style={{ cursor: 'move' }}>
          {this.isEdit ? 'Edit saved keymap' : 'Save a new keymap'}
          <div className="close-dialog">
            <CloseIcon onClick={this.props.onClose} />
          </div>
        </DialogTitle>
        <DialogContent dividers className="keymap-save-content">
          <TextField
            required
            autoFocus
            label="Title"
            variant="outlined"
            value={this.state.title}
            onChange={(event) => {
              this.setState({
                title: event.target.value.slice(0, MAX_TITLE_TEXT_COUNT),
              });
            }}
            className="keymap-save-textfield"
          />
          <div className="keymap-save-text-counter">
            {`${this.state.title.length}/${MAX_TITLE_TEXT_COUNT}`}
          </div>
          <TextField
            label="Description"
            variant="outlined"
            value={this.state.desc}
            onChange={(event) => {
              this.setState({
                desc: event.target.value.slice(0, MAX_DESC_TEXT_COUNT),
              });
            }}
            multiline
            rows={2}
            className="keymap-save-textfield"
          />
          <div className="keymap-save-text-counter">
            {`${this.state.desc.length}/${MAX_DESC_TEXT_COUNT}`}
          </div>
          {isApprovedKeyboard(this.props.keyboardDefinitionDocument) ? (
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.shared}
                  color="primary"
                  onChange={(event) => {
                    this.setState({
                      shared: event.target.checked,
                    });
                  }}
                />
              }
              label={
                <React.Fragment>
                  <div>Share this keymap for other users</div>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                  >
                    Your name &quot;
                    {this.props.authorDisplayName}&quot; will be displayed for
                    other users.
                  </Typography>
                </React.Fragment>
              }
            />
          ) : null}
        </DialogContent>
        <DialogActions className="keymap-save-footer">
          {this.isEdit && (
            <Button
              onClick={() => {
                this.onClickDeleteButton();
              }}
              color="secondary"
            >
              Delete
            </Button>
          )}
          <Button
            disabled={this.state.title.replace(/\s/g, '').length === 0}
            onClick={() => {
              this.onClickSaveButton();
            }}
            color="primary"
            variant="contained"
            className="keymap-save-savebtn"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
