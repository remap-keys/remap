import { connect } from 'react-redux';
import { ICatalogPhase, RootState } from '../../../../store/state';
import CatalogFirmware from './CatalogFirmware';
import { storageActionsThunk } from '../../../../actions/storage.action';
import {
  CatalogAppActions,
  FlashFirmwareDialogActions,
} from '../../../../actions/catalog.action';
import { IFirmware } from '../../../../services/storage/Storage';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    definitionDocument: state.entities.keyboardDefinitionDocument,
  };
};
export type CatalogFirmwareStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    fetchFirmwareFileBlob(
      firmwareFilePath: string,
      // eslint-disable-next-line no-unused-vars
      callback: (blob: any) => void
    ) {
      _dispatch(
        storageActionsThunk.fetchFirmwareFileBlob(firmwareFilePath, callback)
      );
    },
    updateKeyboard: (definitionId: string, nextPhase: ICatalogPhase) => {
      _dispatch(CatalogAppActions.updatePhase('processing'));
      _dispatch(
        storageActionsThunk.fetchKeyboardDefinitionForCatalogById(
          definitionId,
          nextPhase
        )
      );
    },
    flashFirmwareDialog: {
      open: (firmware: IFirmware) => {
        _dispatch(FlashFirmwareDialogActions.clear());
        _dispatch(FlashFirmwareDialogActions.updateFirmware(firmware));
      },
      close: () => {
        _dispatch(FlashFirmwareDialogActions.updateFirmware(null));
      },
    },
  };
};
export type CatalogFirmwareActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CatalogFirmware);
