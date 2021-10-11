import React, { useState } from 'react';
import {
  FirmwareFormActionsType,
  FirmwareFormStateType,
} from './FirmwareForm.container';
import './FirmwareForm.scss';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  TextField,
  Typography,
} from '@material-ui/core';
import { IFirmware } from '../../../../services/storage/Storage';
import moment from 'moment';

type OwnProps = {};
type FirmwareFormProps = OwnProps &
  Partial<FirmwareFormActionsType> &
  Partial<FirmwareFormStateType>;

export default function FirmwareForm(props: FirmwareFormProps) {
  const dropTargetRef = React.createRef<HTMLDivElement>();

  const [dragging, setDragging] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [
    targetFirmwareForDeletion,
    setTargetFirmwareForDeletion,
  ] = useState<IFirmware | null>(null);

  const onDragOverFirmwareFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const onDragLeaveFirmwareFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
  };

  const onDropFirmwareFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    if (files.length !== 1) {
      return;
    }
    const file = files[0];
    props.updateFirmwareFile!(file);
  };

  const onClickUploadButton = () => {
    props.uploadFirmware!();
  };

  const onClickClearButton = () => {
    props.clearFirmwareForm!();
  };

  const validateFirmwareForm = () => {
    if (props.firmwareFile === null) {
      return false;
    }
    if (!props.firmwareName) {
      return false;
    }
    if (!props.firmwareDescription) {
      return false;
    }
    if (!props.firmwareSourceCodeUrl) {
      return false;
    }
    if (!props.firmwareSourceCodeUrl.match(/^http(s)?:\/\/.+/)) {
      return false;
    }
    return true;
  };

  const onClickDownload = (firmware: IFirmware) => {
    props.fetchFirmwareFileBlob!(firmware.filename, (blob: any) => {
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.download = firmware.filename.substring(
        firmware.filename.lastIndexOf('/') + 1
      );
      a.href = downloadUrl;
      a.click();
      a.remove();
    });
  };

  const onClickDelete = (firmware: IFirmware) => {
    setTargetFirmwareForDeletion(firmware);
    setOpenConfirmDialog(true);
  };

  const onClickConfirmDialogYes = () => {
    setOpenConfirmDialog(false);
    const targetFirmware = targetFirmwareForDeletion!;
    setTargetFirmwareForDeletion(null);
    props.deleteFirmware!(targetFirmware);
  };
  const onClickConfirmDialogNo = () => {
    setTargetFirmwareForDeletion(null);
    setOpenConfirmDialog(false);
  };

  const firmwareFileInfo = props.firmwareFile
    ? `${props.firmwareFile!.name} - ${props.firmwareFile!.size} bytes`
    : '';

  const sortedFirmwares = props
    .definitionDocument!.firmwares.slice()
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

  return (
    <React.Fragment>
      <div className="edit-definition-firmware-form-container">
        <div className="edit-definition-firmware-form-panel-left">
          {!props.firmwareFile ? (
            <div className="edit-definition-firmware-form-row">
              <div
                className={
                  dragging
                    ? 'edit-definition-firmware-form-upload-area edit-definition-firmware-form-upload-area-active'
                    : 'edit-definition-firmware-form-upload-area'
                }
                onDragOver={onDragOverFirmwareFile}
                onDrop={onDropFirmwareFile}
                onDragLeave={onDragLeaveFirmwareFile}
              >
                <div
                  className="edit-definition-firmware-form-upload-message"
                  ref={dropTargetRef}
                >
                  Drop Firmware here (.hex .bin and etc.)
                </div>
              </div>
            </div>
          ) : null}
          {props.firmwareFile ? (
            <div className="edit-definition-firmware-form-row">
              <FormControl>
                <TextField
                  label="Firmware File"
                  variant="outlined"
                  value={`${props.firmwareFile ? firmwareFileInfo : ''}`}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </FormControl>
            </div>
          ) : null}
          <div className="edit-definition-firmware-form-row">
            <FormControl>
              <TextField
                label="Firmware Name"
                variant="outlined"
                value={props.firmwareName}
                onChange={(event) => {
                  props.updateFirmwareName!(event.target.value);
                }}
              />
            </FormControl>
          </div>
          <div className="edit-definition-firmware-form-row">
            <FormControl>
              <TextField
                label="Description"
                variant="outlined"
                value={props.firmwareDescription}
                multiline
                rows={4}
                onChange={(event) => {
                  props.updateFirmwareDescription!(event.target.value);
                }}
              />
            </FormControl>
          </div>
          <div className="edit-definition-firmware-form-row">
            <FormControl>
              <TextField
                label="Source Code URL"
                variant="outlined"
                value={props.firmwareSourceCodeUrl}
                onChange={(event) => {
                  props.updateFirmwareSourceCodeUrl!(event.target.value);
                }}
                helperText="Fill in the URL where the source code of this firmware is hosted. This must be started with `http://` or `https://`."
              />
            </FormControl>
          </div>
          <div className="edit-definition-firmware-form-buttons">
            <Button
              color="primary"
              style={{ marginRight: '8px' }}
              onClick={onClickClearButton}
            >
              Clear
            </Button>
            <Button
              color="primary"
              style={{ marginRight: '8px' }}
              variant="contained"
              onClick={onClickUploadButton}
              disabled={!validateFirmwareForm()}
            >
              Upload
            </Button>
          </div>
        </div>
        <div className="edit-definition-firmware-form-panel-right">
          {sortedFirmwares.length > 0 ? (
            <React.Fragment>
              <div className="edit-definition-firmware-form-total-download-count">
                <Typography variant="body2" align="right">
                  Total Firmware Download Count:{' '}
                  {props.definitionDocument!.totalFirmwareDownloadCount}
                </Typography>
              </div>
              {sortedFirmwares.map((firmware, index) => (
                <FirmwareCard
                  key={`firmware-card-${index}`}
                  firmware={firmware}
                  onClickDownload={onClickDownload}
                  onClickDelete={onClickDelete}
                />
              ))}{' '}
            </React.Fragment>
          ) : (
            <div className="edit-definition-firmware-form-nothing">
              <div>There is no firmware file.</div>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={openConfirmDialog}
        onClickYes={onClickConfirmDialogYes}
        onClickNo={onClickConfirmDialogNo}
      />
    </React.Fragment>
  );
}

type IFirmwareCardProps = {
  firmware: IFirmware;
  // eslint-disable-next-line no-unused-vars
  onClickDownload: (firmware: IFirmware) => void;
  // eslint-disable-next-line no-unused-vars
  onClickDelete: (firmware: IFirmware) => void;
};

function FirmwareCard(props: IFirmwareCardProps) {
  return (
    <Card variant="outlined" className="edit-definition-firmware-form-card">
      <CardContent>
        <Typography variant="h5" component="h2">
          {props.firmware.name}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {props.firmware.description}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {moment(props.firmware.created_at).format('MMMM Do YYYY, HH:mm:ss')}{' '}
          <br />
          SHA256: {props.firmware.hash}
        </Typography>
      </CardContent>
      <CardActions className="edit-definition-firmware-form-card-buttons">
        <Button
          size="small"
          color="secondary"
          onClick={() => {
            props.onClickDelete(props.firmware);
          }}
        >
          Delete
        </Button>
        <Button
          size="small"
          href={props.firmware.sourceCodeUrl}
          target="_blank"
          rel="noreferrer"
        >
          Source Code
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            props.onClickDownload(props.firmware);
          }}
        >
          Download
        </Button>
      </CardActions>
    </Card>
  );
}

type IConfirmDialogProps = {
  open: boolean;
  onClickYes: () => void;
  onClickNo: () => void;
};

function ConfirmDialog(props: IConfirmDialogProps) {
  return (
    <Dialog
      open={props.open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Firmware Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" color="secondary">
          Are you sure to delete the firmware file?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          autoFocus
          onClick={() => {
            props.onClickNo();
          }}
        >
          No
        </Button>
        <Button
          color="primary"
          onClick={() => {
            props.onClickYes();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
