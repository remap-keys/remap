import { RootState } from '../../../../store/state';
import { connect } from 'react-redux';
import FirmwareForm from './FirmwareForm';
import { KeyboardsEditDefinitionActions } from '../../../../actions/keyboards.actions';
import { storageActionsThunk } from '../../../../actions/storage.action';
import { IFirmware } from '../../../../services/storage/Storage';
import { IBootloaderType } from '../../../../services/firmware/Types';

const mapStateToProps = (state: RootState) => {
  return {
    definitionDocument: state.entities.keyboardDefinitionDocument,
    firmwareFile: state.keyboards.editdefinition.firmwareFile,
    firmwareName: state.keyboards.editdefinition.firmwareName,
    firmwareDescription: state.keyboards.editdefinition.firmwareDescription,
    firmwareSourceCodeUrl: state.keyboards.editdefinition.firmwareSourceCodeUrl,
    flashSupport: state.keyboards.editdefinition.flashSupport,
    defaultBootloaderType: state.keyboards.editdefinition.defaultBootloaderType,
  };
};
export type FirmwareFormStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    updateFirmwareFile: (firmwareFile: File | null) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateFirmwareFile(firmwareFile),
      );
    },
    updateFirmwareName: (firmwareName: string) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateFirmwareName(firmwareName),
      );
    },
    updateFirmwareDescription: (firmwareDescription: string) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateFirmwareDescription(
          firmwareDescription,
        ),
      );
    },
    updateFirmwareSourceCodeUrl: (firmwareSourceCodeUrl: string) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateFirmwareSourceCodeUrl(
          firmwareSourceCodeUrl,
        ),
      );
    },
    updateFlashSupport: (flashSupport: boolean) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateFlashSupport(flashSupport),
      );
    },
    updateDefaultBootloaderType: (defaultBootloaderType: IBootloaderType) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateDefaultBootloaderType(
          defaultBootloaderType,
        ),
      );
    },
    clearFirmwareForm: () => {
      _dispatch(KeyboardsEditDefinitionActions.clearFirmwareForm());
    },
    uploadFirmware: () => {
      _dispatch(storageActionsThunk.uploadFirmware());
    },
    fetchFirmwareFileBlob: (
      firmwareFilePath: string,
      // eslint-disable-next-line no-unused-vars
      callback: (blob: any) => void,
    ) => {
      _dispatch(
        storageActionsThunk.fetchFirmwareFileBlob(firmwareFilePath, callback),
      );
    },
    // eslint-disable-next-line no-unused-vars
    deleteFirmware: (firmware: IFirmware) => {
      _dispatch(storageActionsThunk.deleteFirmware(firmware));
    },
    updateFirmware: (
      firmware: IFirmware,
      name: string,
      description: string,
      sourceCodeUrl: string,
      flashSupport: boolean,
      defaultBootloaderType: IBootloaderType,
    ) => {
      _dispatch(
        storageActionsThunk.updateFirmware(
          firmware,
          name,
          description,
          sourceCodeUrl,
          flashSupport,
          defaultBootloaderType,
        ),
      );
    },
    updateKeyboard: (definitionId: string) => {
      _dispatch(
        storageActionsThunk.fetchKeyboardDefinitionById(
          definitionId,
          'firmware',
        ),
      );
    },
  };
};
export type FirmwareFormActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(FirmwareForm);
