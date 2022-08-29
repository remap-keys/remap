import { connect } from 'react-redux';
import { ICatalogPhase, RootState } from '../../../../store/state';
import CatalogFirmware from './CatalogFirmware';
import { storageActionsThunk } from '../../../../actions/storage.action';
import { CatalogAppActions } from '../../../../actions/catalog.action';
import {
  IFirmware,
  IKeyboardDefinitionDocument,
} from '../../../../services/storage/Storage';
import { FlashFirmwareDialogActions } from '../../../../actions/firmware.action';

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
      open: (
        definitionDocument: IKeyboardDefinitionDocument,
        firmware: IFirmware
      ) => {
        _dispatch(FlashFirmwareDialogActions.clear());
        _dispatch(
          FlashFirmwareDialogActions.updateBootloaderType(
            firmware.default_bootloader_type
          )
        );
        _dispatch(
          FlashFirmwareDialogActions.updateKeyboardName(definitionDocument.name)
        );
        _dispatch(
          FlashFirmwareDialogActions.updateFlashMode('fetch_and_flash')
        );
        _dispatch(FlashFirmwareDialogActions.updateFirmware(firmware));
      },
    },
  };
};
export type CatalogFirmwareActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CatalogFirmware);
