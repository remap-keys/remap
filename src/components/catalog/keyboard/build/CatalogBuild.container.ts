import { connect } from 'react-redux';
import {
  IBuildableFirmwareCodeParameterValues,
  RootState,
} from '../../../../store/state';
import CatalogBuild from './CatalogBuild';
import {
  catalogActionsThunk,
  CatalogKeyboardActions,
} from '../../../../actions/catalog.action';
import { storageActionsThunk } from '../../../../actions/storage.action';
import {
  IBuildableFirmware,
  IFirmwareBuildingTask,
  IKeyboardDefinitionDocument,
} from '../../../../services/storage/Storage';
import { FlashFirmwareDialogActions } from '../../../../actions/firmware.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    definitionDocument: state.entities.keyboardDefinitionDocument,
    firmwareBuildingTasks: state.entities.firmwareBuildingTasks,
    buildableFirmware: state.entities.buildableFirmware,
    buildableFirmwareKeyboardFiles:
      state.entities.buildableFirmwareKeyboardFiles,
    buildableFirmwareKeymapFiles: state.entities.buildableFirmwareKeymapFiles,
    buildableFirmwareCodeParameterValues:
      state.catalog.keyboard.buildableFirmwareCodeParameterValues,
    signedIn: state.app.signedIn,
  };
};
export type CatalogBuildStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch: any) => {
  return {
    createFirmwareBuildingTask: (
      keyboardDefinitionId: string,
      description: string,
      parametersJson: string
    ) => {
      dispatch(
        catalogActionsThunk.createFirmwareBuildingTask(
          keyboardDefinitionId,
          description,
          parametersJson
        )
      );
    },
    fetchBuiltFirmwareFileBlob(
      firmwareFilePath: string,
      // eslint-disable-next-line no-unused-vars
      callback: (blob: any) => void
    ) {
      dispatch(
        storageActionsThunk.fetchBuiltFirmwareFileBlob(
          firmwareFilePath,
          callback
        )
      );
    },
    updateFirmwareBuildingTasks: (keyboardDefinitionId: string) => {
      dispatch(
        catalogActionsThunk.updateFirmwareBuildingTasks(keyboardDefinitionId)
      );
    },
    flashFirmware: (
      keyboardDefinitionDocument: IKeyboardDefinitionDocument,
      buildableFirmware: IBuildableFirmware,
      task: IFirmwareBuildingTask
    ) => {
      dispatch(FlashFirmwareDialogActions.clear());
      dispatch(
        FlashFirmwareDialogActions.updateBootloaderType(
          buildableFirmware.defaultBootloaderType
        )
      );
      const firmwareName = `Built for ${keyboardDefinitionDocument.name}`;
      dispatch(FlashFirmwareDialogActions.updateKeyboardName(''));
      dispatch(FlashFirmwareDialogActions.updateFlashMode('build_and_flash'));
      dispatch(FlashFirmwareDialogActions.updateBuildingFirmwareTask(task));
      dispatch(
        FlashFirmwareDialogActions.updateFirmware({
          name: firmwareName,
          default_bootloader_type: buildableFirmware.defaultBootloaderType,
          flash_support: true,
          filename: firmwareName,
          description: '',
          hash: '',
          sourceCodeUrl: '',
          created_at: new Date(),
        })
      );
    },
    updateBuildableFirmwareCodeParameterValues: (
      values: IBuildableFirmwareCodeParameterValues
    ) => {
      dispatch(
        CatalogKeyboardActions.updateBuildableFirmwareCodeParameterValues(
          values
        )
      );
    },
    deleteFirmwareBuildingTask: (
      keyboardDefinitionId: string,
      task: IFirmwareBuildingTask
    ) => {
      dispatch(
        catalogActionsThunk.deleteFirmwareBuildingTask(
          keyboardDefinitionId,
          task
        )
      );
    },
    updateFirmwareBuildingTaskDescription: (
      taskId: string,
      description: string
    ) => {
      dispatch(
        catalogActionsThunk.updateFirmwareBuildingTaskDescription(
          taskId,
          description
        )
      );
    },
  };
};
export type CatalogBuildActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CatalogBuild);
