import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import './AnyKeyEditDialog.scss';
import { AnyKey } from '../KeycodeKey';

type AnyKeyDialogState = {
  label: string;
  code: string;
  disabled: boolean;
};

type AnyKeyDialogOwnProps = {
  open: boolean;
  title: string;
  labelOk: string;
  value: AnyKey | null;
  onClickCancel: () => void;
  // eslint-disable-next-line no-unused-vars
  onClickOk: (key: AnyKey) => void;
};

export default class AnyKeyDialog extends React.Component<
  AnyKeyDialogOwnProps,
  AnyKeyDialogState
> {
  constructor(props: AnyKeyDialogOwnProps | Readonly<AnyKeyDialogOwnProps>) {
    super(props);
    this.state = {
      label: '',
      code: '',
      disabled: true,
    };
  }

  private onInit() {
    const value = this.props.value;
    if (value) {
      const label = value.label;
      const code = value.code.toString(16).toUpperCase();
      this.setState({
        label: label,
        code: code,
        disabled: 0 == label.length || 0 == code.length,
      });
    }
  }

  private onClickCancel() {
    this.props.onClickCancel();
  }

  private onClickOk = () => {
    const anyKey: AnyKey = {
      label: this.state.label,
      code: parseInt(this.state.code, 16),
    };
    this.props.onClickOk(anyKey);
  };

  // eslint-disable-next-line no-undef
  private onChangeLabel(e: React.ChangeEvent<HTMLInputElement>) {
    const label = e.target.value;
    this.setState({ label: label, disabled: label.length == 0 });
  }

  // eslint-disable-next-line no-undef
  private onChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    const code = e.target.value.toUpperCase().replace(/[^0-9,A-F]/g, '');
    this.setState({ code: code, disabled: code.length == 0 });
  }

  // eslint-disable-next-line no-undef
  private onFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.setSelectionRange(0, 100);
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        aria-labelledby="form-dialog-title"
        onEnter={this.onInit.bind(this)}
        className="anykey-dialog"
      >
        <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Label"
            type="text"
            value={this.state.label}
            onChange={this.onChangeLabel.bind(this)}
            onFocus={this.onFocus.bind(this)}
          />
          <div className="hex-code-wrapper">
            <div className="hex-code">0x</div>
            <TextField
              label="Key Code(hex)"
              type="text"
              value={this.state.code}
              onChange={this.onChangeCode.bind(this)}
              onFocus={this.onFocus.bind(this)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClickCancel.bind(this)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={this.onClickOk.bind(this)}
            color="primary"
            disabled={this.state.disabled}
          >
            {this.props.labelOk}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
