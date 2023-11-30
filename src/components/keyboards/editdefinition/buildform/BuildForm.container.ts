import {
  IBuildableFirmwareCodeParameter,
  RootState,
} from '../../../../store/state';
import { connect } from 'react-redux';
import BuildForm from './BuildForm';
import { storageActionsThunk } from '../../../../actions/storage.action';
import {
  IBuildableFirmwareFile,
  IBuildableFirmwareFileType,
  IBuildableFirmwareQmkFirmwareVersion,
} from '../../../../services/storage/Storage';
import { KeyboardsEditDefinitionActions } from '../../../../actions/keyboards.actions';
import { IBootloaderType } from '../../../../services/firmware/Types';

const mapStateToProps = (state: RootState) => {
  return {
    keyboardDefinition: state.entities.keyboardDefinitionDocument,
    buildableFirmware: state.entities.buildableFirmware,
    buildableFirmwareKeyboardFiles:
      state.entities.buildableFirmwareKeyboardFiles,
    buildableFirmwareKeymapFiles: state.entities.buildableFirmwareKeymapFiles,
    targetBuildableFirmwareFile:
      state.keyboards.editdefinition.buildableFirmwareFile,
    targetBuildableFirmwareFileType:
      state.keyboards.editdefinition.buildableFirmwareFileType,
    targetBuildableFirmwareCodeParameters:
      state.keyboards.editdefinition.buildableFirmwareCodeParameters,
  };
};
export type BuildFormStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateBuildableFirmwareEnabled: (
      keyboardDefinitionId: string,
      enabled: boolean
    ) => {
      dispatch(
        storageActionsThunk.updateBuildableFirmware(keyboardDefinitionId, {
          enabled,
        })
      );
    },
    updateBuildableFirmwareDefaultBootloaderType: (
      keyboardDefinitionId: string,
      defaultBootloaderType: IBootloaderType
    ) => {
      dispatch(
        storageActionsThunk.updateBuildableFirmware(keyboardDefinitionId, {
          defaultBootloaderType,
        })
      );
    },
    updateBuildableFirmwareQmkFirmwareVersion: (
      keyboardDefinitionId: string,
      qmkFirmwareVersion: IBuildableFirmwareQmkFirmwareVersion
    ) => {
      dispatch(
        storageActionsThunk.updateBuildableFirmware(keyboardDefinitionId, {
          qmkFirmwareVersion,
        })
      );
    },
    updateBuildableFirmwareSupportCodeEditing: (
      keyboardDefinitionId: string,
      supportCodeEditing: boolean
    ) => {
      dispatch(
        storageActionsThunk.updateBuildableFirmware(keyboardDefinitionId, {
          supportCodeEditing,
        })
      );
    },
    updateBuildableFirmwareKeyboardDirectoryName: (
      keyboardDefinitionId: string,
      keyboardDirectoryName: string
    ) => {
      dispatch(
        storageActionsThunk.updateBuildableFirmware(keyboardDefinitionId, {
          keyboardDirectoryName,
        })
      );
    },
    createNewFirmwareKeyboardFile: (
      keyboardDefinitionId: string,
      fileName: string
    ) => {
      dispatch(
        storageActionsThunk.createNewFirmwareKeyboardFile(
          keyboardDefinitionId,
          fileName
        )
      );
    },
    createNewFirmwareKeymapFile: (
      keyboardDefinitionId: string,
      fileName: string
    ) => {
      dispatch(
        storageActionsThunk.createNewFirmwareKeymapFile(
          keyboardDefinitionId,
          fileName
        )
      );
    },
    updateTargetBuildableFirmwareFile: (
      file: IBuildableFirmwareFile,
      type: IBuildableFirmwareFileType
    ) => {
      dispatch(
        KeyboardsEditDefinitionActions.updateBuildableFirmwareFile(file, type)
      );
    },
    updateBuildableFirmwareFile: (
      keyboardDefinitionId: string,
      file: IBuildableFirmwareFile,
      type: IBuildableFirmwareFileType
    ) => {
      dispatch(
        storageActionsThunk.updateBuildableFirmwareFile(
          keyboardDefinitionId,
          file,
          type
        )
      );
    },
    deleteBuildableFirmwareFile: (
      keyboardDefinitionId: string,
      file: IBuildableFirmwareFile,
      type: IBuildableFirmwareFileType
    ) => {
      dispatch(
        storageActionsThunk.deleteBuildableFirmwareFile(
          keyboardDefinitionId,
          file,
          type
        )
      );
    },
    updateBuildableFirmwareCodeParameters: (
      parameters: IBuildableFirmwareCodeParameter[]
    ) => {
      dispatch(
        KeyboardsEditDefinitionActions.updateBuildableFirmwareCodeParameters(
          parameters
        )
      );
    },
  };
};
export type BuildFormActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(BuildForm);
