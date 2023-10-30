import { connect } from 'react-redux';
import { RootState } from '../../../../store/state';
import CatalogBuild from './CatalogBuild';
import { catalogActionsThunk } from '../../../../actions/catalog.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    definitionDocument: state.entities.keyboardDefinitionDocument,
    firmwareBuildingTasks: state.entities.firmwareBuildingTasks,
  };
};
export type CatalogBuildStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch: any) => {
  return {
    createFirmwareBuildingTask: (keyboardDefinitionId: string) => {
      dispatch(
        catalogActionsThunk.createFirmwareBuildingTask(keyboardDefinitionId)
      );
    },
  };
};
export type CatalogBuildActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CatalogBuild);
