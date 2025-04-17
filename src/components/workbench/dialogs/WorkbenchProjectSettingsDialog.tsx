import React, { useState } from 'react';
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
} from '@mui/material';

import {
  IBuildableFirmwareQmkFirmwareVersion,
  BUILDABLE_FIRMWARE_QMK_FIRMWARE_VERSION,
} from '../../../services/storage/Storage';

interface WorkbenchProjectSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  qmkFirmwareVersion: IBuildableFirmwareQmkFirmwareVersion | undefined;
  onApply: (qmkFirmwareVersion: IBuildableFirmwareQmkFirmwareVersion) => void;
}

export default function WorkbenchProjectSettingsDialog(
  props: WorkbenchProjectSettingsDialogProps
) {
  const [selectedQmkFirmwareVersion, setSelectedQmkFirmwareVersion] = useState<
    IBuildableFirmwareQmkFirmwareVersion | undefined
  >(props.qmkFirmwareVersion);

  const onChangeQmkFirmwareVersion = (
    event: SelectChangeEvent<IBuildableFirmwareQmkFirmwareVersion>
  ) => {
    setSelectedQmkFirmwareVersion(
      event.target.value as IBuildableFirmwareQmkFirmwareVersion
    );
  };

  return (
    <Dialog open={props.open} maxWidth="xs" fullWidth>
      <DialogTitle>Project Settings</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel id="qmk-firmware-version-label">
            QMK Firmware Version
          </InputLabel>
          <Select
            labelId="qmk-firmware-version-label"
            id="qmk-firmware-version-select"
            value={selectedQmkFirmwareVersion || '0.28.3'}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onApply(selectedQmkFirmwareVersion!)}>
          Apply
        </Button>
        <Button onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
