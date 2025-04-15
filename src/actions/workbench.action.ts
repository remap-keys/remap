import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { IWorkbenchPhase, RootState, WorkbenchPhase } from '../store/state';
import { AppActions, NotificationActions } from './actions';
import { StorageActions } from './storage.action';
import { isError } from '../types';
import {
  IBuildableFirmwareFileType,
  IWorkbenchProject,
  IWorkbenchProjectFile,
} from '../services/storage/Storage';

export const WORKBENCH_APP_ACTIONS = '@Workbench!App';
export const WORKBENCH_APP_UPDATE_PHASE = `${WORKBENCH_APP_ACTIONS}/UpdatePhase`;
export const WORKBENCH_APP_UPDATE_PROJECTS = `${WORKBENCH_APP_ACTIONS}/UpdateProjects`;
export const WORKBENCH_APP_UPDATE_CURRENT_PROJECT = `${WORKBENCH_APP_ACTIONS}/UpdateCurrentProject`;
export const WorkbenchAppActions = {
  updatePhase: (phase: IWorkbenchPhase) => {
    return {
      type: WORKBENCH_APP_UPDATE_PHASE,
      value: phase,
    };
  },
  updateProjects: (projects: IWorkbenchProject[]) => {
    return {
      type: WORKBENCH_APP_UPDATE_PROJECTS,
      value: projects,
    };
  },
  updateCurrentProject: (project: IWorkbenchProject) => {
    return {
      type: WORKBENCH_APP_UPDATE_CURRENT_PROJECT,
      value: project,
    };
  },
};

type ActionTypes = ReturnType<
  | (typeof WorkbenchAppActions)[keyof typeof WorkbenchAppActions]
  | (typeof NotificationActions)[keyof typeof NotificationActions]
  | (typeof StorageActions)[keyof typeof StorageActions]
  | (typeof AppActions)[keyof typeof AppActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const workbenchActionsThunk = {
  initializeWorkbench:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      dispatch(WorkbenchAppActions.updatePhase(WorkbenchPhase.processing));

      const { storage, app } = getState();

      // Fetch all my workbench projects.
      const fetchMyWorkbenchProjectsResult =
        await storage.instance!.fetchMyWorkbenchProjects();
      if (isError(fetchMyWorkbenchProjectsResult)) {
        dispatch(
          NotificationActions.addError(
            fetchMyWorkbenchProjectsResult.error,
            fetchMyWorkbenchProjectsResult.cause
          )
        );
        return;
      }
      const projects = fetchMyWorkbenchProjectsResult.value;

      // If there are no projects, create a default project.
      if (projects.length === 0) {
        const projectName = createDefaultProjectName(projects);
        const createWorkbenchProjectResult =
          await storage.instance!.createWorkbenchProject(projectName, '0.28.3');
        if (isError(createWorkbenchProjectResult)) {
          dispatch(
            NotificationActions.addError(
              createWorkbenchProjectResult.error,
              createWorkbenchProjectResult.cause
            )
          );
          return;
        }
        const newProject = createWorkbenchProjectResult.value;
        projects.push(newProject);
      }

      // Determine the current project.
      const userInformation = app.user.information;
      if (userInformation === undefined) {
        throw new Error('User information is not available.');
      }
      let currentProjectId = userInformation.currentProjectId;
      if (currentProjectId === undefined) {
        currentProjectId = projects[0].id;
      } else {
        const currentProject = projects.find(
          (project) => project.id === currentProjectId
        );
        if (currentProject === undefined) {
          currentProjectId = projects[0].id;
        }
      }
      const currentProject = projects.find(
        (project) => project.id === currentProjectId
      );
      if (currentProject === undefined) {
        throw new Error('Current project is not available.');
      }

      // Fetch the current project with files.
      const fetchWorkbenchProjectResult =
        await storage.instance!.fetchWorkbenchProjectWithFiles(
          currentProject.id
        );
      if (isError(fetchWorkbenchProjectResult)) {
        dispatch(
          NotificationActions.addError(
            fetchWorkbenchProjectResult.error,
            fetchWorkbenchProjectResult.cause
          )
        );
        return;
      }
      const currentProjectWithFiles = fetchWorkbenchProjectResult.value;
      if (currentProjectWithFiles === undefined) {
        throw new Error('Current project is not available.');
      }

      dispatch(WorkbenchAppActions.updateProjects(projects));
      dispatch(
        WorkbenchAppActions.updateCurrentProject(currentProjectWithFiles)
      );

      dispatch(WorkbenchAppActions.updatePhase(WorkbenchPhase.editing));
    },
  createWorkbenchProjectFile:
    (
      project: IWorkbenchProject,
      path: string,
      fileType: IBuildableFirmwareFileType
    ): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, workbench } = getState();
      const createResult = await storage.instance!.createWorkbenchProjectFile(
        project.id,
        fileType,
        path
      );
      if (isError(createResult)) {
        dispatch(
          NotificationActions.addError(createResult.error, createResult.cause)
        );
        return;
      }
      // Refresh current project.
      const currentProject = workbench.app.currentProject;
      if (currentProject === undefined) {
        throw new Error('Current project is not available.');
      }
      const newCurrentProject: IWorkbenchProject = {
        ...currentProject,
        keyboardFiles: new Array(...currentProject.keyboardFiles),
        keymapFiles: new Array(...currentProject.keymapFiles),
      };
      switch (fileType) {
        case 'keyboard':
          newCurrentProject.keyboardFiles.push(createResult.value);
          break;
        case 'keymap':
          newCurrentProject.keymapFiles.push(createResult.value);
          break;
      }
      dispatch(WorkbenchAppActions.updateCurrentProject(newCurrentProject));
    },
  updateWorkbenchProjectFile:
    (
      project: IWorkbenchProject,
      file: IWorkbenchProjectFile,
      path: string,
      code: string
    ): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, workbench } = getState();
      const updateResult = await storage.instance!.updateWorkbenchProjectFile(
        project.id,
        {
          ...file,
          path,
          code,
        }
      );
      if (isError(updateResult)) {
        dispatch(
          NotificationActions.addError(updateResult.error, updateResult.cause)
        );
        return;
      }
      const currentProject = workbench.app.currentProject;
      if (currentProject === undefined) {
        throw new Error('Current project is not available.');
      }
      const newCurrentProject: IWorkbenchProject = {
        ...currentProject,
        keyboardFiles: new Array(...currentProject.keyboardFiles),
        keymapFiles: new Array(...currentProject.keymapFiles),
      };
      const targetFiles: IWorkbenchProjectFile[] =
        file.fileType === 'keyboard'
          ? newCurrentProject.keyboardFiles
          : newCurrentProject.keymapFiles;
      const index = targetFiles.findIndex((x) => x.id === file.id);
      if (index !== -1) {
        targetFiles[index] = {
          ...targetFiles[index],
          path,
          code,
        };
      }
      dispatch(WorkbenchAppActions.updateCurrentProject(newCurrentProject));
    },
  deleteWorkbenchProjectFile:
    (
      project: IWorkbenchProject,
      file: IWorkbenchProjectFile,
      fileType: IBuildableFirmwareFileType
    ): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, workbench } = getState();
      const deleteResult = await storage.instance!.deleteWorkbenchProjectFile(
        project.id,
        file
      );
      if (isError(deleteResult)) {
        dispatch(
          NotificationActions.addError(deleteResult.error, deleteResult.cause)
        );
        return;
      }
      const currentProject = workbench.app.currentProject;
      if (currentProject === undefined) {
        throw new Error('Current project is not available.');
      }
      const newCurrentProject: IWorkbenchProject = {
        ...currentProject,
        keyboardFiles: new Array(...currentProject.keyboardFiles),
        keymapFiles: new Array(...currentProject.keymapFiles),
      };
      const targetFiles: IWorkbenchProjectFile[] =
        fileType === 'keyboard'
          ? newCurrentProject.keyboardFiles
          : newCurrentProject.keymapFiles;
      const index = targetFiles.findIndex((x) => x.id === file.id);
      if (index !== -1) {
        targetFiles.splice(index, 1);
      }
      dispatch(WorkbenchAppActions.updateCurrentProject(newCurrentProject));
    },
  updateWorkbenchProject:
    (project: IWorkbenchProject): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, workbench } = getState();
      const updateResult =
        await storage.instance!.updateWorkbenchProject(project);
      if (isError(updateResult)) {
        dispatch(
          NotificationActions.addError(updateResult.error, updateResult.cause)
        );
        return;
      }
      const currentProject = workbench.app.currentProject;
      if (currentProject === undefined) {
        throw new Error('Current project is not available.');
      }
      const newCurrentProject: IWorkbenchProject = {
        ...currentProject,
        name: project.name,
        qmkFirmwareVersion: project.qmkFirmwareVersion,
      };
      dispatch(WorkbenchAppActions.updateCurrentProject(newCurrentProject));
      const newProjects: IWorkbenchProject[] = workbench.app.projects.map(
        (x) => {
          if (x.id === project.id) {
            return {
              ...x,
              name: project.name,
              qmkFirmwareVersion: project.qmkFirmwareVersion,
            };
          }
          return x;
        }
      );
      dispatch(WorkbenchAppActions.updateProjects(newProjects));
    },
};

const createDefaultProjectName = (projects: IWorkbenchProject[]): string => {
  const label = 'New Project';
  const numbers = projects.reduce<Set<number>>((result, project) => {
    const regexp = new RegExp(`^${label} ([0-9]+)$`, 'i');
    const m = project.name.trim().match(regexp);
    if (m) {
      result.add(Number(m[1]));
    }
    return result;
  }, new Set<number>());
  if (numbers.size === 0) {
    return `${label} 1`;
  }
  let max = 0;
  for (const x of numbers.values()) {
    max = Math.max(max, x);
  }
  return `${label} ${max + 1}`;
};
