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
} from '../../../../services/storage/Storage';
import { KeyboardsEditDefinitionActions } from '../../../../actions/keyboards.actions';

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
        storageActionsThunk.updateBuildableFirmwareEnabled(
          keyboardDefinitionId,
          enabled
        )
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
