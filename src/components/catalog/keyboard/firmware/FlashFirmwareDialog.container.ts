import { connect } from 'react-redux';
import { RootState } from '../../../../store/state';
import FlashFirmwareDialog from './FlashFirmwareDialog';
import { catalogActionsThunk } from '../../../../actions/catalog.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    firmware: state.catalog.keyboard.flashFirmwareDialog.firmware,
    definitionDocument: state.entities.keyboardDefinitionDocument,
    flashing: state.catalog.keyboard.flashFirmwareDialog.flashing,
    logs: state.catalog.keyboard.flashFirmwareDialog.logs,
    progressRate: state.catalog.keyboard.flashFirmwareDialog.progressRate,
    mode: state.catalog.keyboard.flashFirmwareDialog.mode,
  };
};
export type FlashFirmwareDialogStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    flashFirmware: () => {
      _dispatch(catalogActionsThunk.flashFirmware());
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
