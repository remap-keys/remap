import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';
import { t } from 'i18next';

export type IConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onClickYes: () => void;
  onClickNo: () => void;
};

export default function ConfirmDialog(props: IConfirmDialogProps) {
  return (
    <Dialog
      open={props.open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" color="secondary">
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            props.onClickYes();
          }}
        >
          {t('Yes')}
        </Button>
        <Button
          color="primary"
          autoFocus
          onClick={() => {
            props.onClickNo();
          }}
        >
          {t('No')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
