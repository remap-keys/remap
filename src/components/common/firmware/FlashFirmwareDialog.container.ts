import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import FlashFirmwareDialog from './FlashFirmwareDialog';
import { IBootloaderType } from '../../../services/firmware/Types';
import {
  firmwareActionsThunk,
  FlashFirmwareDialogActions,
} from '../../../actions/firmware.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    keyboardName: state.common.firmware.flashFirmwareDialog.keyboardName,
    firmware: state.common.firmware.flashFirmwareDialog.firmware,
    flashing: state.common.firmware.flashFirmwareDialog.flashing,
    logs: state.common.firmware.flashFirmwareDialog.logs,
    progressRate: state.common.firmware.flashFirmwareDialog.progressRate,
    mode: state.common.firmware.flashFirmwareDialog.mode,
    bootloaderType: state.common.firmware.flashFirmwareDialog.bootloaderType,
  };
};
export type FlashFirmwareDialogStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    fetchAndFlashFirmware: () => {
      _dispatch(firmwareActionsThunk.flashFirmware());
    },
    updateBootloaderType: (bootloaderType: IBootloaderType) => {
      _dispatch(
        FlashFirmwareDialogActions.updateBootloaderType(bootloaderType),
      );
    },
    close: () => {
      _dispatch(FlashFirmwareDialogActions.updateFirmware(null));
    },
  };
};
export type FlashFirmwareDialogActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FlashFirmwareDialog);
