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
import {
  IKeycodeData,
  ISavedKeymapData,
} from '../../../services/storage/Storage';

type OwnProps = {
  open: boolean;
  savedKeymapData: ISavedKeymapData | null;
  onClose: () => void;
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
      title: this.props.savedKeymapData ? this.props.savedKeymapData.title : '',
      desc: this.props.savedKeymapData ? this.props.savedKeymapData.desc : '',
    };
  }

  get id(): string {
    return this.props.savedKeymapData ? this.props.savedKeymapData.id : '';
  }

  get isEdit(): boolean {
    return Boolean(this.props.savedKeymapData);
  }

  private onEnter() {
    this.setState({
      title: this.props.savedKeymapData ? this.props.savedKeymapData.title : '',
      desc: this.props.savedKeymapData ? this.props.savedKeymapData.desc : '',
    });
  }

  private buildCurrentKeymapData(): IKeycodeData {
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

    const json: IKeycodeData = {
      labelLang,
      layoutOptions,
      keycodes,
    };
    return json;
  }

  private onClickDeleteButton() {
    this.props.deleteSavedKeymapData!(this.id);
    this.props.onClose();
  }

  private onClickSaveButton() {
    if (this.props.savedKeymapData) {
      this.props.updateSavedKeymapData!({
        ...this.props.savedKeymapData,
        title: this.state.title,
        desc: this.state.desc,
      });
    } else {
      const data = this.buildCurrentKeymapData();
      const save: ISavedKeymapData = {
        id: this.id,
        title: this.state.title,
        desc: this.state.desc,
        data,
      };
      this.props.createSavedKeymapData!(save);
    }
    this.props.onClose();
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
