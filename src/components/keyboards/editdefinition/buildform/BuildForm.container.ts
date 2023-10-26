import { RootState } from '../../../../store/state';
import { connect } from 'react-redux';
import BuildForm from './BuildForm';
import { storageActionsThunk } from '../../../../actions/storage.action';

const mapStateToProps = (state: RootState) => {
  return {
    keyboardDefinition: state.entities.keyboardDefinitionDocument,
    buildableFirmware: state.entities.buildableFirmware,
    buildableFirmwareKeyboardFiles:
      state.entities.buildableFirmwareKeyboardFiles,
    buildableFirmwareKeymapFiles: state.entities.buildableFirmwareKeymapFiles,
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
  };
};
export type BuildFormActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(BuildForm);
