import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import Header from './Header';
import { AppActionsThunk, NotificationActions } from '../../../actions/actions';
import {
  IBuildableFirmwareFileType,
  IWorkbenchProject,
  IWorkbenchProjectFile,
} from '../../../services/storage/Storage';
import {
  workbenchActionsThunk,
  WorkbenchAppActions,
} from '../../../actions/workbench.action';
import { IFileGenerationConfig } from '../../../services/workbench/types/FileGenerationTypes';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    auth: state.auth.instance,
    signedIn: state.app.signedIn,
    phase: state.catalog.app.phase,
    currentProject: state.workbench.app.currentProject,
    projects: state.workbench.app.projects,
    userPurchase: state.app.user.purchase,
  };
};
export type HeaderStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch: any) => {
  return {
    logout: () => {
      dispatch(workbenchActionsThunk.logout());
    },
    linkToGoogleAccount: () => {
      dispatch(AppActionsThunk.linkToGoogleAccount());
    },
    linkToGitHubAccount: () => {
      dispatch(AppActionsThunk.linkToGitHubAccount());
    },
    updateWorkbenchProject: (project: IWorkbenchProject) => {
      dispatch(workbenchActionsThunk.updateWorkbenchProject(project));
    },
    createNewWorkbenchProject: () => {
      dispatch(workbenchActionsThunk.createWorkbenchProject());
    },
    switchCurrentWorkbenchProject: (project: IWorkbenchProject) => {
      dispatch(workbenchActionsThunk.switchCurrentProject(project));
    },
    updateSelectedFile: (
      selectedFile:
        | { fileId: string; fileType: IBuildableFirmwareFileType }
        | undefined
    ) => {
      dispatch(WorkbenchAppActions.updateSelectedFile(selectedFile));
    },
    deleteWorkbenchProject: (project: IWorkbenchProject) => {
      dispatch(workbenchActionsThunk.deleteWorkbenchProject(project));
    },
    createFirmwareBuildingTask: (project: IWorkbenchProject) => {
      dispatch(workbenchActionsThunk.createFirmwareBuildingTask(project));
    },
    showMessage: (message: string) => {
      dispatch(NotificationActions.addSuccess(message));
    },
    fetchUserPurchaseHistories: () => {
      dispatch(workbenchActionsThunk.fetchUserPurchaseHistories());
    },
    generateWorkbenchProjectFiles: (
      project: IWorkbenchProject,
      config: IFileGenerationConfig
    ) => {
      dispatch(
        workbenchActionsThunk.generateWorkbenchProjectFiles(project, config)
      );
    },
  };
};
export type HeaderActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
