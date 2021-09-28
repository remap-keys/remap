import React, { useState } from 'react';
import {
  FirmwareFormActionsType,
  FirmwareFormStateType,
} from './FirmwareForm.container';
import './FirmwareForm.scss';
import { Button, FormControl, TextField } from '@material-ui/core';

type OwnProps = {};
type FirmwareFormProps = OwnProps &
  Partial<FirmwareFormActionsType> &
  Partial<FirmwareFormStateType>;

export default function FirmwareForm(props: FirmwareFormProps) {
  const dropTargetRef = React.createRef<HTMLDivElement>();

  const [dragging, setDragging] = useState<boolean>(false);

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
    props.uploadFirmwareFile!();
  };

  const onClickClearButton = () => {
    props.clearFirmwareForm!();
  };

  const isFilledInAllFields = () => {
    return (
      props.firmwareFile !== null &&
      props.firmwareName !== '' &&
      props.firmwareDescription !== ''
    );
  };

  const firmwareFileInfo = props.firmwareFile
    ? `${props.firmwareFile!.name} - ${props.firmwareFile!.size} bytes`
    : '';

  return (
    <div className="edit-definition-firmware-form-container">
      <div className="edit-definition-firmware-form-panel">
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
                Drop Firmware here
              </div>
            </div>
          </div>
        ) : null}
        {props.firmwareFile ? (
          <div className="edit-definition-firmware-form-row">
            <FormControl>
              <TextField
                label="Firmware Local File"
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
            disabled={!isFilledInAllFields()}
          >
            Upload
          </Button>
        </div>
      </div>
      <div className="edit-definition-firmware-form-panel">list</div>
    </div>
  );
}
