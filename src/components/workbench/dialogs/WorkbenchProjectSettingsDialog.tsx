import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  TextField,
  Stack,
} from '@mui/material';

import {
  IBuildableFirmwareQmkFirmwareVersion,
  BUILDABLE_FIRMWARE_QMK_FIRMWARE_VERSION,
  IWorkbenchProject,
} from '../../../services/storage/Storage';

interface WorkbenchProjectSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  workbenchProject: IWorkbenchProject | undefined;
  onApply: (
    qmkFirmwareVersion: IBuildableFirmwareQmkFirmwareVersion,
    keyboardDirectoryName: string
  ) => void;
}

export default function WorkbenchProjectSettingsDialog(
  props: WorkbenchProjectSettingsDialogProps
) {
  const [selectedQmkFirmwareVersion, setSelectedQmkFirmwareVersion] =
    useState<IBuildableFirmwareQmkFirmwareVersion>('0.28.3');
  const [filledInKeyboardDirectoryName, setFilledInKeyboardDirectoryName] =
    useState<string>('');

  const onChangeQmkFirmwareVersion = (
    event: SelectChangeEvent<IBuildableFirmwareQmkFirmwareVersion>
  ) => {
    setSelectedQmkFirmwareVersion(
      event.target.value as IBuildableFirmwareQmkFirmwareVersion
    );
  };

  const onChangeKeyboardDirectoryName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilledInKeyboardDirectoryName(event.target.value);
  };

  useEffect(() => {
    if (props.workbenchProject === undefined) {
      setSelectedQmkFirmwareVersion('0.28.3');
      setFilledInKeyboardDirectoryName('');
    } else {
      setSelectedQmkFirmwareVersion(props.workbenchProject.qmkFirmwareVersion);
      setFilledInKeyboardDirectoryName(
        props.workbenchProject.keyboardDirectoryName || ''
      );
    }
  }, [props.workbenchProject]);

  return (
    <Dialog open={props.open} maxWidth="xs" fullWidth>
      <DialogTitle>Project Settings</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="qmk-firmware-version-label">
              QMK Firmware Version
            </InputLabel>
            <Select
              labelId="qmk-firmware-version-label"
              id="qmk-firmware-version-select"
              value={selectedQmkFirmwareVersion}
              label="QMK Firmware Version"
              onChange={onChangeQmkFirmwareVersion}
            >
              {BUILDABLE_FIRMWARE_QMK_FIRMWARE_VERSION.map((version) => (
                <MenuItem key={version} value={version}>
                  {version}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label="Keyboard Directory Name"
              value={filledInKeyboardDirectoryName}
              onChange={onChangeKeyboardDirectoryName}
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() =>
            props.onApply(
              selectedQmkFirmwareVersion!,
              filledInKeyboardDirectoryName!.trim()
            )
          }
        >
          Apply
        </Button>
        <Button onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
