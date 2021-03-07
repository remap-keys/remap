/* eslint-disable no-undef */
import React from 'react';
import './KeymapSaveDialog.scss';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  PaperProps,
  TextField,
} from '@material-ui/core';

import Draggable from 'react-draggable';
import CloseIcon from '@material-ui/icons/Close';
import {
  KeymapSaveDialogActionsType,
  KeymapSaveDialogStateType,
} from './KeymapSaveDialog.container';
import { IKeymap } from '../../../services/hid/Hid';
import Keymap from '../keymap/Keymap';
import { KeyboardLabelLang } from '../../../services/labellang/KeyLabelLangs';

type StoreKeymapData = {
  labelLang: KeyboardLabelLang;
  layoutOptions: { option: string; optionChoice: string }[] | undefined;
  keycodes: { [pos: string]: number }[];
};

type StoreKeymap = {
  id?: string;
  title: string;
  desc: string;
  data: StoreKeymapData;
};

type OwnProps = {
  open: boolean;
  edit: boolean;
  id?: string;
  title?: string;
  desc?: string;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSave: (store: StoreKeymap) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: string) => void;
};

type KeymapSaveDialogProps = OwnProps &
  Partial<KeymapSaveDialogActionsType> &
  Partial<KeymapSaveDialogStateType>;

type OwnState = {
  title: string;
  desc: string;
};
export default class LayoutOptionPopover extends React.Component<
  KeymapSaveDialogProps,
  OwnState
> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      title: this.props.title || '',
      desc: this.props.desc || '',
    };
  }

  private onEnter() {
    this.setState({
      title: this.props.title || '',
      desc: this.props.desc || '',
    });
  }

  private buildCurrentKeymapData(): StoreKeymapData {
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
    const { productName } = this.props.keyboard!.getInformation();
    // eslint-disable-next-line no-unused-vars
    const name = productName.trim().replace(/\s/g, '_').toLocaleLowerCase();
    const labelLang: KeyboardLabelLang = this.props.labelLang!;
    const layoutOptions = Keymap.buildLayerOptions(
      this.props.selectedLayoutOptions!,
      this.props.layoutLabels!
    );

    const json: StoreKeymapData = {
      labelLang,
      layoutOptions,
      keycodes,
    };
    return json;
  }

  private onClickDeleteButton() {
    this.props.onDelete(this.props.id!);
  }

  private onClickSaveButton() {
    const data = this.buildCurrentKeymapData();
    const save: StoreKeymap = {
      id: this.props.id || '',
      title: this.state.title,
      desc: this.state.desc,
      data,
    };
    this.props.onSave(save);
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        maxWidth={'md'}
        PaperComponent={PaperComponent}
        className="keymap-save-dialog"
        onEnter={this.onEnter.bind(this)}
      >
        <DialogTitle id="draggable-dialog-title" style={{ cursor: 'move' }}>
          {this.props.edit ? 'Edit saved keymap' : 'Save a new keymap'}
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
              this.setState({ title: event.target.value });
            }}
            className="keymap-save-textfield"
          />
          <TextField
            label="Description"
            variant="outlined"
            value={this.state.desc}
            onChange={(event) => {
              this.setState({ desc: event.target.value });
            }}
            multiline
            rows={2}
            className="keymap-save-textfield"
          />
        </DialogContent>
        <DialogActions className="keymap-save-footer">
          {this.props.edit && (
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
