import { connect } from 'react-redux';
import {
  IBuildableFirmwareCodeParameterValues,
  RootState,
} from '../../../../store/state';
import BuildParametersDialog from './BuildParametersDialog';
import { CatalogKeyboardActions } from '../../../../actions/catalog.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    buildableFirmwareKeyboardFiles:
      state.entities.buildableFirmwareKeyboardFiles,
    buildableFirmwareKeymapFiles: state.entities.buildableFirmwareKeymapFiles,
    buildableFirmwareCodeParameterValues:
      state.catalog.keyboard.buildableFirmwareCodeParameterValues,
    buildableFirmware: state.entities.buildableFirmware,
  };
};
export type BuildParametersDialogStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch: any) => {
  return {
    updateBuildableFirmwareCodeParameterValues: (
      values: IBuildableFirmwareCodeParameterValues
    ) => {
      dispatch(
        CatalogKeyboardActions.updateBuildableFirmwareCodeParameterValues(
          values
        )
      );
    },
  };
};
export type BuildParametersDialogActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuildParametersDialog);
