import React, { useEffect, useState } from 'react';
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
  DialogTitle,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { IFirmware } from '../../../../services/storage/Storage';
import { IBootloaderType } from '../../../../services/firmware/Types';
import ConfirmDialog from '../../../common/confirm/ConfirmDialog';
import { format } from 'date-fns';

type OwnProps = {};
type FirmwareFormProps = OwnProps &
  Partial<FirmwareFormActionsType> &
  Partial<FirmwareFormStateType>;

export default function FirmwareForm(props: FirmwareFormProps) {
  const dropTargetRef = React.createRef<HTMLDivElement>();

  const [dragging, setDragging] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [targetFirmwareForDeletion, setTargetFirmwareForDeletion] =
    useState<IFirmware | null>(null);

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
      props.updateKeyboard!(props.definitionDocument!.id);
    });
  };

  const onClickDelete = (firmware: IFirmware) => {
    setTargetFirmwareForDeletion(firmware);
    setOpenConfirmDialog(true);
  };

  const onClickEditDialogUpdate = (
    firmware: IFirmware,
    name: string,
    description: string,
    sourceCodeUrl: string,
    flashSupport: boolean,
    defaultBootloaderType: IBootloaderType
  ) => {
    props.updateFirmware!(
      firmware,
      name,
      description,
      sourceCodeUrl,
      flashSupport,
      defaultBootloaderType
    );
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
          <div className="edit-definition-firmware-form-row">
            <FormControl>
              <FormLabel component="legend">Flash Firmware Support</FormLabel>
              <Select
                value={props.flashSupport ? 'yes' : 'no'}
                onChange={(event) => {
                  props.updateFlashSupport!(event.target.value === 'yes');
                }}
              >
                <MenuItem value="no">No</MenuItem>
                <MenuItem value="yes">Yes</MenuItem>
              </Select>
            </FormControl>
          </div>
          {props.flashSupport ? (
            <div className="edit-definition-firmware-form-row">
              <FormControl>
                <FormLabel component="legend">
                  Default Bootloader Type
                </FormLabel>
                <Select
                  value={props.defaultBootloaderType}
                  onChange={(event) => {
                    props.updateDefaultBootloaderType!(
                      event.target.value as IBootloaderType
                    );
                  }}
                >
                  <MenuItem value="caterina">caterina</MenuItem>
                  <MenuItem value="dfu">dfu</MenuItem>
                  <MenuItem value="copy">copy</MenuItem>
                </Select>
              </FormControl>
            </div>
          ) : (
            ''
          )}
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
                  Total Download Count:{' '}
                  {props.definitionDocument!.totalFirmwareDownloadCount}
                  {' / '}
                  Total Flash Count:{' '}
                  {props.definitionDocument!.totalFirmwareFlashCount}
                </Typography>
              </div>
              {sortedFirmwares.map((firmware, index) => (
                <FirmwareCard
                  key={`firmware-card-${index}`}
                  firmware={firmware}
                  onClickDownload={onClickDownload}
                  onClickDelete={onClickDelete}
                  onClickEditDialogUpdate={onClickEditDialogUpdate}
                />
              ))}
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
        title="Firmware Deletion"
        message="Are you sure to delete the firmware file?"
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
  // eslint-disable-next-line no-unused-vars
  onClickEditDialogUpdate: (
    // eslint-disable-next-line no-unused-vars
    firmware: IFirmware,
    // eslint-disable-next-line no-unused-vars
    name: string,
    // eslint-disable-next-line no-unused-vars
    description: string,
    // eslint-disable-next-line no-unused-vars
    sourceCodeUrl: string,
    // eslint-disable-next-line no-unused-vars
    flashSupport: boolean,
    // eslint-disable-next-line no-unused-vars
    defaultBootloaderType: IBootloaderType
  ) => void;
};

function FirmwareCard(props: IFirmwareCardProps) {
  const [open, setOpen] = useState<boolean>(false);

  const onClickEdit = () => {
    setOpen(true);
  };

  const onClickEditDialogCancel = () => {
    setOpen(false);
  };

  const onClickEditDialogUpdate = (
    firmware: IFirmware,
    name: string,
    description: string,
    sourceCodeUrl: string,
    flashSupport: boolean,
    defaultBootloaderType: IBootloaderType
  ) => {
    setOpen(false);
    props.onClickEditDialogUpdate(
      firmware,
      name,
      description,
      sourceCodeUrl,
      flashSupport,
      defaultBootloaderType
    );
  };

  return (
    <React.Fragment>
      <Card variant="outlined" className="edit-definition-firmware-form-card">
        <CardContent>
          <Typography variant="h5" component="h2">
            {props.firmware.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {props.firmware.description}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {format(props.firmware.created_at, 'MMMM do yyyy, HH:mm:ss')} <br />
            SHA256: {props.firmware.hash}
            <br />
            Flash Support: {props.firmware.flash_support ? 'Yes' : 'No'}
            {props.firmware.flash_support ? (
              <React.Fragment>
                <br />
                Default Bootloader Type:{' '}
                {props.firmware.default_bootloader_type}
              </React.Fragment>
            ) : (
              ''
            )}
          </Typography>
        </CardContent>
        <CardActions className="edit-definition-firmware-form-card-buttons">
          <Button size="small" onClick={() => onClickEdit()}>
            Edit
          </Button>
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
      <EditDialog
        open={open}
        firmware={props.firmware}
        onClickCancel={onClickEditDialogCancel}
        onClickUpdate={onClickEditDialogUpdate}
      />
    </React.Fragment>
  );
}

type IEditDialogProps = {
  open: boolean;
  firmware: IFirmware;
  onClickCancel: () => void;
  onClickUpdate: (
    // eslint-disable-next-line no-unused-vars
    firmware: IFirmware,
    // eslint-disable-next-line no-unused-vars
    name: string,
    // eslint-disable-next-line no-unused-vars
    description: string,
    // eslint-disable-next-line no-unused-vars
    sourceCodeUrl: string,
    // eslint-disable-next-line no-unused-vars
    flashSupport: boolean,
    // eslint-disable-next-line no-unused-vars
    defaultBootloaderType: IBootloaderType
  ) => void;
};

function EditDialog(props: IEditDialogProps) {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [sourceCodeUrl, setSourceCodeUrl] = useState<string>('');
  const [flashSupport, setFlashSupport] = useState<boolean>(false);
  const [defaultBootloaderType, setDefaultBootloaderType] =
    useState<IBootloaderType>('caterina');

  useEffect(() => {
    if (props.open) {
      setName(props.firmware.name);
      setDescription(props.firmware.description);
      setSourceCodeUrl(props.firmware.sourceCodeUrl);
      setFlashSupport(props.firmware.flash_support);
      setDefaultBootloaderType(props.firmware.default_bootloader_type);
    }
  }, [props.open]);

  const validateFirmwareForm = (): boolean => {
    if (!name) {
      return false;
    }
    if (!description) {
      return false;
    }
    if (!sourceCodeUrl) {
      return false;
    }
    if (!sourceCodeUrl.match(/^http(s)?:\/\/.+/)) {
      return false;
    }
    return true;
  };

  return (
    <Dialog
      open={props.open}
      aria-labelledby="edit-firmware-dialog-title"
      aria-describedby="edit-firmware-dialog-description"
    >
      <DialogTitle id="edit-firmware-dialog-title">Edit Firmware</DialogTitle>
      <DialogContent className="edit-firmware-dialog-content">
        <FormControl className="edit-firmware-dialog-item">
          <TextField
            autoFocus
            label="Firmware Name"
            fullWidth
            margin="dense"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </FormControl>
        <FormControl className="edit-firmware-dialog-item">
          <TextField
            autoFocus
            label="Firmware Description"
            fullWidth
            multiline
            rows={4}
            margin="dense"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
        </FormControl>
        <FormControl className="edit-firmware-dialog-item">
          <TextField
            autoFocus
            label="Source Code URL"
            fullWidth
            margin="dense"
            value={sourceCodeUrl}
            onChange={(event) => {
              setSourceCodeUrl(event.target.value);
            }}
          />
        </FormControl>
        <FormControl className="edit-firmware-dialog-item">
          <FormLabel component="legend">Flash Firmware Support</FormLabel>
          <Select
            value={flashSupport ? 'yes' : 'no'}
            onChange={(event) => {
              setFlashSupport(event.target.value === 'yes');
            }}
          >
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="yes">Yes</MenuItem>
          </Select>
        </FormControl>
        {flashSupport ? (
          <FormControl className="edit-firmware-dialog-item">
            <FormLabel component="legend">Default Bootloader Type</FormLabel>
            <Select
              value={defaultBootloaderType}
              onChange={(event) => {
                setDefaultBootloaderType(event.target.value as IBootloaderType);
              }}
            >
              <MenuItem value="caterina">caterina</MenuItem>
              <MenuItem value="dfu">dfu</MenuItem>
              <MenuItem value="copy">copy</MenuItem>
            </Select>
          </FormControl>
        ) : (
          ''
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClickCancel()}>Cancel</Button>
        <Button
          color="primary"
          onClick={() =>
            props.onClickUpdate(
              props.firmware,
              name,
              description,
              sourceCodeUrl,
              flashSupport,
              defaultBootloaderType
            )
          }
          disabled={!validateFirmwareForm()}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
