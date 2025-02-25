import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import './FlashFirmwareDialog.scss';
import {
  FlashFirmwareDialogActionsType,
  FlashFirmwareDialogStateType,
} from './FlashFirmwareDialog.container';
import instructionImage1 from '../../../assets/images/catalog/flash-firmware-dialog-1.png';
import instructionImage2 from '../../../assets/images/catalog/flash-firmware-dialog-2.png';
import instructionImage3 from '../../../assets/images/catalog/flash-firmware-dialog-3.png';
import CircularProgressWithLabel from '../circularprogress/CircularProgressWithLabel';
import {
  ALL_BOOTLOADER_TYPE,
  IBootloaderType,
} from '../../../services/firmware/Types';
import { t } from 'i18next';

type OwnProps = {};
type FlashFirmwareDialogProps = OwnProps &
  Partial<FlashFirmwareDialogActionsType> &
  Partial<FlashFirmwareDialogStateType>;

export default function FlashFirmwareDialog(
  props: FlashFirmwareDialogProps | Readonly<FlashFirmwareDialogProps>
) {
  let logsRef: any = null;

  useEffect(() => {
    if (logsRef) {
      logsRef.scrollTop = logsRef.scrollHeight;
    }
  });

  const isOpen = (): boolean => {
    return props.firmware !== null;
  };

  const onClickFlash = () => {
    props.fetchAndFlashFirmware!();
  };

  const onClickClose = () => {
    props.close!();
  };

  const onChangeBootloaderType = (event: SelectChangeEvent) => {
    props.updateBootloaderType!(event.target.value as IBootloaderType);
  };

  return (
    <Dialog
      open={isOpen()}
      aria-labelledby="flash-firmware-dialog-title"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle id="flash-firmware-dialog-title">
        {t('Flash Firmware')}
      </DialogTitle>
      <DialogContent>
        <div className="flash-firmware-dialog-info">
          <div className="flash-firmware-dialog-info-item">
            <div className="flash-firmware-dialog-info-item-title">
              {t('Firmware')}:
            </div>
            <div className="flash-firmware-dialog-info-item-body">
              {props.firmware?.name}
              {props.keyboardName ? <span> for {props.keyboardName}</span> : ''}
            </div>
          </div>
          <div className="flash-firmware-dialog-info-item">
            <div className="flash-firmware-dialog-info-item-title">
              {t('Bootloader')}:
            </div>
            <div className="flash-firmware-dialog-info-item-body">
              <Select
                value={props.bootloaderType}
                onChange={onChangeBootloaderType}
                size="small"
              >
                {ALL_BOOTLOADER_TYPE.map((bootloaderType, index) => (
                  <MenuItem
                    key={`bootloaderType-${index}`}
                    value={bootloaderType}
                  >
                    {bootloaderType}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
        {props.mode === 'flashing' ? (
          <div className="flash-firmware-dialog-progress">
            <div className="flash-firmware-dialog-progress-circular">
              <CircularProgressWithLabel value={props.progressRate!} />
            </div>
            <TextField
              inputRef={(input) => (logsRef = input)}
              className="flash-firmware-dialog-progress-logs"
              multiline
              rows={6}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
              size="small"
              value={props.logs!.join('\n')}
            />
          </div>
        ) : props.mode === 'instruction' ? (
          <React.Fragment>
            <div className="flash-firmware-dialog-instruction">
              <Typography variant="body1">
                {t('Three Steps to Flash')}
              </Typography>
              <div className="flash-firmware-dialog-instruction-items">
                <div className="flash-firmware-dialog-instruction-item">
                  <img src={instructionImage1} alt="instructionImage1" />
                  <Typography variant="body2">
                    {t(
                      '1. Push the FLASH button and the dialog to list the serial ports up.'
                    )}
                  </Typography>
                </div>
                <div className="flash-firmware-dialog-instruction-item">
                  <img src={instructionImage2} alt="instructionImage2" />
                  <Typography variant="body2">
                    {t(
                      '2. Put the MCU into boot loader mode. For example, press the reset button.'
                    )}
                  </Typography>
                </div>
                <div className="flash-firmware-dialog-instruction-item">
                  <img src={instructionImage3} alt="instructionImage3" />
                  <Typography variant="body2">
                    {t(
                      '3. The serial port of your MCU is displayed in the list. Select it and click the Connect button.'
                    )}
                  </Typography>
                </div>
              </div>
            </div>
            <Typography variant="caption">
              {t(
                '* If pushing the FLASH button, you agree to write the firmware to your MCU by your own risk.'
              )}
              <br />
              {t('* Please read:')}{' '}
              <Link
                href="/docs/faq#faq-firmware-writing-feature"
                target="_blank"
                rel="noreferrer"
              >
                {t('Frequently Asked Questions')}
              </Link>
              .
            </Typography>
          </React.Fragment>
        ) : (
          <Typography variant="body1">
            {t('Now loading the firmware...')}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onClickFlash}
          disabled={props.mode === 'loading' || props.flashing}
        >
          {t('Flash')}
        </Button>
        <Button
          autoFocus
          onClick={onClickClose}
          disabled={props.mode === 'loading' || props.flashing}
        >
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
