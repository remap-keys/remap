import { connect } from 'react-redux';
import { RootState } from '../../../../store/state';
import FlashFirmwareDialog from './FlashFirmwareDialog';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    firmware: state.catalog.keyboard.flashFirmwareDialog.firmware,
    definitionDocument: state.entities.keyboardDefinitionDocument,
    flashing: state.catalog.keyboard.flashFirmwareDialog.flashing,
  };
};
export type FlashFirmwareDialogStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type FlashFirmwareDialogActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlashFirmwareDialog);
