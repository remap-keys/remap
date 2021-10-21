import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import './FlashFirmwareDialog.scss';
import {
  FlashFirmwareDialogActionsType,
  FlashFirmwareDialogStateType,
} from './FlashFirmwareDialog.container';
import instructionImage1 from '../../../../assets/images/catalog/flash-firmware-dialog-1.png';
import instructionImage2 from '../../../../assets/images/catalog/flash-firmware-dialog-2.png';
import instructionImage3 from '../../../../assets/images/catalog/flash-firmware-dialog-3.png';
import CircularProgressWithLabel from '../../../common/circularprogress/CircularProgressWithLabel';

type OwnProps = {
  onClose: () => void;
};
type FlashFirmwareDialogProps = OwnProps &
  Partial<FlashFirmwareDialogActionsType> &
  Partial<FlashFirmwareDialogStateType>;

export default function FlashFirmwareDialog(
  props: FlashFirmwareDialogProps | Readonly<FlashFirmwareDialogProps>
) {
  const isOpen = (): boolean => {
    return props.firmware !== null;
  };

  const onClickFlash = () => {};

  const onClickClose = () => {
    props.onClose();
  };

  return (
    <Dialog open={isOpen()} aria-labelledby="flash-firmware-dialog-title">
      <DialogTitle id="flash-firmware-dialog-title">Flash Firmware</DialogTitle>
      <DialogContent>
        <div className="flash-firmware-dialog-info">
          <div className="flash-firmware-dialog-info-item">
            <div className="flash-firmware-dialog-info-item-title">
              Firmware:
            </div>
            <div className="flash-firmware-dialog-info-item-body">
              {props.firmware?.name} for {props.definitionDocument!.name}
            </div>
          </div>
          <div className="flash-firmware-dialog-info-item">
            <div className="flash-firmware-dialog-info-item-title">
              MCU Type:
            </div>
            <div className="flash-firmware-dialog-info-item-body">
              atmega32u4
            </div>
          </div>
          <div className="flash-firmware-dialog-info-item">
            <div className="flash-firmware-dialog-info-item-title">
              Bootloader:
            </div>
            <div className="flash-firmware-dialog-info-item-body">catarina</div>
          </div>
        </div>
        {props.flashing ? (
          <div className="flash-firmware-dialog-progress">
            <div className="flash-firmware-dialog-progress-circular">
              <CircularProgressWithLabel value={40} />
            </div>
            <TextField
              className="flash-firmware-dialog-progress-logs"
              multiline
              rows={6}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        ) : (
          <React.Fragment>
            <div className="flash-firmware-dialog-instruction">
              <div className="flash-firmware-dialog-instruction-item">
                <img src={instructionImage1} alt="instructionImage1" />
                <Typography variant="body2">
                  1. Push the [FLASH] button to start writing this firmware.
                  Then, the dialog to list the serial ports up.
                </Typography>
              </div>
              <div className="flash-firmware-dialog-instruction-item">
                <img src={instructionImage2} alt="instructionImage2" />
                <Typography variant="body2">
                  2. Enter the boot loader mode on your MCU. For example, push
                  the reset button.
                </Typography>
              </div>
              <div className="flash-firmware-dialog-instruction-item">
                <img src={instructionImage3} alt="instructionImage3" />
                <Typography variant="body2">
                  3. The serial port of your MCU is displayed in the list.
                  Select it and click the [Connect] button.
                </Typography>
              </div>
            </div>
            <Typography variant="caption">
              * If pushing the [FLASH] button, you agree to write the firmware
              to your MCU by your own risk.
            </Typography>
          </React.Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClickFlash}>
          Flash
        </Button>
        <Button autoFocus onClick={onClickClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
