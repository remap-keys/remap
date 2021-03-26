/* eslint-disable no-undef */
import React from 'react';
import './SharedKeymapsDialog.scss';
import {
  SharedKeymapsDialogActionsType,
  SharedKeymapsDialogStateType,
} from './SharedKeymapsDialog.container';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  PaperProps,
} from '@material-ui/core';
import Draggable from 'react-draggable';
import CloseIcon from '@material-ui/icons/Close';

type OwnProps = {
  open: boolean;
  onClose: () => void;
};

type SharedKeymapsDialogProps = OwnProps &
  Partial<SharedKeymapsDialogActionsType> &
  Partial<SharedKeymapsDialogStateType>;

type OwnState = {};
export default class SharedKeymapsDialog extends React.Component<
  SharedKeymapsDialogProps,
  OwnState
> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {};
  }

  private onEnter() {
    this.setState({});
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        maxWidth={'md'}
        PaperComponent={PaperComponent}
        className="shared-keymaps-dialog"
        onEnter={this.onEnter.bind(this)}
      >
        <DialogTitle>
          Shared Keymaps
          <div className="close-dialog">
            <CloseIcon onClick={this.props.onClose} />
          </div>
        </DialogTitle>
        <DialogContent dividers className="shared-keymaps-dialog-content">
          xxx
        </DialogContent>
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
