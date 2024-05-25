import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import './UploadFirmwareDialog.scss';
import {
  UploadFirmwareDialogActionsType,
  UploadFirmwareDialogStateType,
} from './UploadFirmwareDialog.container';

type OwnProps = {};
type UploadFirmwareDialogProps = OwnProps &
  Partial<UploadFirmwareDialogActionsType> &
  Partial<UploadFirmwareDialogStateType>;

export default function UploadFirmwareDialog(
  props: UploadFirmwareDialogProps | Readonly<UploadFirmwareDialogProps>,
) {
  const dropTargetRef = React.createRef<HTMLDivElement>();

  const [firmwareFileDragging, setFirmwareFileDragging] =
    useState<boolean>(false);

  const isOpen = (): boolean => {
    return props.open!;
  };

  const onClickClose = () => {
    props.close!();
  };

  const onDragOverFirmwareFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setFirmwareFileDragging(true);
  };

  const onDragLeaveFirmwareFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setFirmwareFileDragging(false);
  };

  const onDropFirmwareFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setFirmwareFileDragging(false);
    const files = event.dataTransfer.files;
    if (files.length !== 1) {
      return;
    }
    const file = files[0];
    props.uploadFirmwareFile!(file);
  };

  return (
    <Dialog
      open={isOpen()}
      aria-labelledby="upload-firmware-dialog-title"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle id="upload-firmware-dialog-title">
        Upload Firmware
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Drag and drop your firmware file (hex, bin and so on) into the area
          below. Then, the next page is shown automatically.
        </Typography>
        <div className="upload-firmware-dialog-upload-file-form">
          <div
            className={
              firmwareFileDragging
                ? 'upload-firmware-dialog-upload-file-form-area upload-firmware-dialog-upload-file-form-area-active'
                : 'upload-firmware-dialog-upload-file-form-area'
            }
            onDragOver={onDragOverFirmwareFile}
            onDrop={onDropFirmwareFile}
            onDragLeave={onDragLeaveFirmwareFile}
          >
            <div
              className="upload-firmware-dialog-upload-file-form-message"
              ref={dropTargetRef}
            >
              Drop Firmware File here
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClickClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
