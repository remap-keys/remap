import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import Breadboard from './Breadboard';
import {
  IBuildableFirmwareFileType,
  IWorkbenchProject,
  IWorkbenchProjectFile,
} from '../../../services/storage/Storage';
import {
  workbenchActionsThunk,
  WorkbenchAppActions,
} from '../../../actions/workbench.action';

const mapStateToProps = (state: RootState) => {
  return {
    projects: state.workbench.app.projects,
    currentProject: state.workbench.app.currentProject,
    selectedFile: state.workbench.app.selectedFile,
  };
};
export type BreadboardStateType = ReturnType<typeof mapStateToProps>;

/* eslint-disable-next-line no-unused-vars */
const mapDispatchToProps = (dispatch: any) => {
  return {
    createNewWorkbenchProjectFile: (
      project: IWorkbenchProject,
      path: string,
      fileType: IBuildableFirmwareFileType
    ) => {
      dispatch(
        workbenchActionsThunk.createWorkbenchProjectFile(
          project,
          path,
          fileType
        )
      );
    },
    updateWorkbenchProjectFile: (
      project: IWorkbenchProject,
      file: IWorkbenchProjectFile,
      path: string,
      code: string
    ) => {
      dispatch(
        workbenchActionsThunk.updateWorkbenchProjectFile(
          project,
          file,
          path,
          code
        )
      );
    },
    deleteWorkbenchProjectFile: (
      project: IWorkbenchProject,
      file: IWorkbenchProjectFile,
      fileType: IBuildableFirmwareFileType
    ) => {
      dispatch(
        workbenchActionsThunk.deleteWorkbenchProjectFile(
          project,
          file,
          fileType
        )
      );
    },
    updateSelectedFile: (
      selectedFile:
        | { fileId: string; fileType: IBuildableFirmwareFileType }
        | undefined
    ) => {
      dispatch(WorkbenchAppActions.updateSelectedFile(selectedFile));
    },
  };
};
export type BreadboardActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Breadboard);
