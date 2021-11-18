import { connect } from 'react-redux';
import { RootState } from '../../../../store/state';
import FlashFirmwareDialog from './FlashFirmwareDialog';
import {
  catalogActionsThunk,
  FlashFirmwareDialogActions,
} from '../../../../actions/catalog.action';
import { IBootloaderType } from '../../../../services/firmware/Types';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    firmware: state.catalog.keyboard.flashFirmwareDialog.firmware,
    definitionDocument: state.entities.keyboardDefinitionDocument,
    flashing: state.catalog.keyboard.flashFirmwareDialog.flashing,
    logs: state.catalog.keyboard.flashFirmwareDialog.logs,
    progressRate: state.catalog.keyboard.flashFirmwareDialog.progressRate,
    mode: state.catalog.keyboard.flashFirmwareDialog.mode,
    bootloaderType: state.catalog.keyboard.flashFirmwareDialog.bootloaderType,
  };
};
export type FlashFirmwareDialogStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    flashFirmware: () => {
      _dispatch(catalogActionsThunk.flashFirmware());
    },
    updateBootloaderType: (bootloaderType: IBootloaderType) => {
      _dispatch(
        FlashFirmwareDialogActions.updateBootloaderType(bootloaderType)
      );
    },
  };
};
export type FlashFirmwareDialogActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlashFirmwareDialog);
