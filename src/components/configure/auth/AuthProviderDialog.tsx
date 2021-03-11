import {
  AuthProviderDialogActionsType,
  AuthProviderDialogStateType,
} from './AuthProviderDialog.container';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import './AuthProviderDialog.scss';

type OwnState = {};

type OwnProps = {
  open: boolean;
  onClose: () => void;
};

type AuthProviderDialogProps = OwnProps &
  Partial<AuthProviderDialogActionsType> &
  Partial<AuthProviderDialogStateType>;

export default class AuthProviderDialog extends React.Component<
  AuthProviderDialogProps,
  OwnState
> {
  constructor(
    props: AuthProviderDialogProps | Readonly<AuthProviderDialogProps>
  ) {
    super(props);
  }

  onGitHubLoginButtonClick = () => {
    this.props.onClose();
    this.props.loginWithGitHubAccount!();
  };

  onGoogleLoginButtonClick = () => {
    this.props.onClose();
    this.props.loginWithGoogleAccount!();
  };

  render() {
    return (
      <Dialog
        open={this.props.open}
        maxWidth="sm"
        className="auth-provider-dialog"
      >
        <DialogTitle id="auth-provider-dialog-title">
          Login
          <div className="close-dialog">
            <CloseIcon onClick={this.props.onClose} />
          </div>
        </DialogTitle>
        <DialogContent dividers className="auth-provider-dialog-content">
          <Typography variant="subtitle1">
            Which do you want to login with?
          </Typography>
          <Button onClick={this.onGoogleLoginButtonClick}>
            Google Account
          </Button>
          <Button onClick={this.onGitHubLoginButtonClick}>
            GitHub Account
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
}
