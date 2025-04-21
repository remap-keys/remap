import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
  IUserInformation,
  IWorkbenchPhase,
  RootState,
  WorkbenchPhase,
} from '../store/state';
import { AppActions, NotificationActions } from './actions';
import { StorageActions } from './storage.action';
import { errorResultOf, IEmptyResult, isError, successResult } from '../types';
import {
  IBuildableFirmwareFileType,
  IFirmwareBuildingTask,
  IStorage,
  IWorkbenchProject,
  IWorkbenchProjectFile,
} from '../services/storage/Storage';
import {
  firmwareActionsThunk,
  FlashFirmwareDialogActions,
} from './firmware.action';
import { IBootloaderType } from '../services/firmware/Types';

export const WORKBENCH_APP_ACTIONS = '@Workbench!App';
export const WORKBENCH_APP_UPDATE_PHASE = `${WORKBENCH_APP_ACTIONS}/UpdatePhase`;
export const WORKBENCH_APP_UPDATE_PROJECTS = `${WORKBENCH_APP_ACTIONS}/UpdateProjects`;
export const WORKBENCH_APP_UPDATE_CURRENT_PROJECT = `${WORKBENCH_APP_ACTIONS}/UpdateCurrentProject`;
export const WORKBENCH_APP_UPDATE_SELECTED_FILE = `${WORKBENCH_APP_ACTIONS}/UpdateSelectedFile`;
export const WORKBENCH_APP_APPEND_FILE_TO_CURRENT_PROJECT = `${WORKBENCH_APP_ACTIONS}/AppendFileToCurrentProject`;
export const WORKBENCH_APP_UPDATE_BUILDING_TASKS = `${WORKBENCH_APP_ACTIONS}/UpdateBuildableTasks`;
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
  updateCurrentProject: (project: IWorkbenchProject | undefined) => {
    return {
      type: WORKBENCH_APP_UPDATE_CURRENT_PROJECT,
      value: project,
    };
  },
  updateSelectedFile: (
    selectedFile:
      | { fileId: string; fileType: IBuildableFirmwareFileType }
      | undefined
  ) => {
    return {
      type: WORKBENCH_APP_UPDATE_SELECTED_FILE,
      value: selectedFile,
    };
  },
  appendFileToCurrentProject: (file: IWorkbenchProjectFile) => {
    return {
      type: WORKBENCH_APP_APPEND_FILE_TO_CURRENT_PROJECT,
      value: file,
    };
  },
  updateBuildingTasks: (tasks: IFirmwareBuildingTask[]) => {
    return {
      type: WORKBENCH_APP_UPDATE_BUILDING_TASKS,
      value: tasks,
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
          await storage.instance!.createWorkbenchProject(
            projectName,
            '0.28.3',
            ''
          );
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

      const updateUserInformationResult = await updateUserInformation(
        storage.instance!,
        {
          ...userInformation,
          currentProjectId,
        }
      );
      if (isError(updateUserInformationResult)) {
        dispatch(
          NotificationActions.addError(
            updateUserInformationResult.error,
            updateUserInformationResult.cause
          )
        );
        return;
      }

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
      const { storage } = getState();
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
      dispatch(
        WorkbenchAppActions.appendFileToCurrentProject(createResult.value)
      );
    },
  updateWorkbenchProjectFile:
    (
      project: IWorkbenchProject,
      file: IWorkbenchProjectFile,
      path: string,
      code: string,
      refreshCurrentProject: boolean
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

      if (refreshCurrentProject) {
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
      }
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
        keyboardDirectoryName: project.keyboardDirectoryName,
      };
      dispatch(WorkbenchAppActions.updateCurrentProject(newCurrentProject));
      const newProjects: IWorkbenchProject[] = workbench.app.projects.map(
        (x) => {
          if (x.id === project.id) {
            return {
              ...x,
              name: project.name,
              qmkFirmwareVersion: project.qmkFirmwareVersion,
              keyboardDirectoryName: project.keyboardDirectoryName,
            };
          }
          return x;
        }
      );
      dispatch(WorkbenchAppActions.updateProjects(newProjects));
    },
  createWorkbenchProject:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { app, storage, workbench } = getState();
      const projects = workbench.app.projects;
      const projectName = createDefaultProjectName(projects);
      const createResult = await storage.instance!.createWorkbenchProject(
        projectName,
        '0.28.3',
        ''
      );
      if (isError(createResult)) {
        dispatch(
          NotificationActions.addError(createResult.error, createResult.cause)
        );
        return;
      }
      const newProject = createResult.value;
      const newProjects = [...projects, newProject];
      dispatch(WorkbenchAppActions.updateProjects(newProjects));
      dispatch(WorkbenchAppActions.updateCurrentProject(newProject));
      dispatch(WorkbenchAppActions.updateSelectedFile(undefined));

      const updateUserInformationResult = await updateUserInformation(
        storage.instance!,
        {
          ...app.user.information!,
          currentProjectId: newProject.id,
        }
      );
      if (isError(updateUserInformationResult)) {
        dispatch(
          NotificationActions.addError(
            updateUserInformationResult.error,
            updateUserInformationResult.cause
          )
        );
      }
    },
  switchCurrentProject:
    (project: IWorkbenchProject): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { app, storage } = getState();
      const fetchResult =
        await storage.instance!.fetchWorkbenchProjectWithFiles(project.id);
      if (isError(fetchResult)) {
        dispatch(
          NotificationActions.addError(fetchResult.error, fetchResult.cause)
        );
        return;
      }
      const currentProject = fetchResult.value;
      if (currentProject === undefined) {
        throw new Error('Current project is not available.');
      }
      dispatch(WorkbenchAppActions.updateCurrentProject(currentProject));

      const updateUserInformationResult = await updateUserInformation(
        storage.instance!,
        {
          ...app.user.information!,
          currentProjectId: currentProject.id,
        }
      );
      if (isError(updateUserInformationResult)) {
        dispatch(
          NotificationActions.addError(
            updateUserInformationResult.error,
            updateUserInformationResult.cause
          )
        );
      }
    },
  deleteWorkbenchProject:
    (project: IWorkbenchProject): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { app, storage, workbench } = getState();

      // Delete the project.
      const deleteResult =
        await storage.instance!.deleteWorkbenchProject(project);
      if (isError(deleteResult)) {
        dispatch(
          NotificationActions.addError(deleteResult.error, deleteResult.cause)
        );
        return;
      }

      // If there are no projects, create a default project.
      const projects = workbench.app.projects.filter(
        (x) => x.id !== project.id
      );
      if (projects.length === 0) {
        const projectName = createDefaultProjectName(projects);
        const createWorkbenchProjectResult =
          await storage.instance!.createWorkbenchProject(
            projectName,
            '0.28.3',
            ''
          );
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
        dispatch(
          NotificationActions.addInfo(
            'A new project was created automatically, because there are no projects.'
          )
        );
      }

      // Update projects.
      dispatch(WorkbenchAppActions.updateProjects(projects));

      // If the deleted project was the current project, switch to the first project.
      const currentProject = workbench.app.currentProject;
      if (currentProject === undefined) {
        throw new Error('Current project is not available.');
      }
      if (currentProject.id === project.id) {
        const newCurrentProject = projects[0];
        const fetchResult =
          await storage.instance!.fetchWorkbenchProjectWithFiles(
            newCurrentProject.id
          );
        if (isError(fetchResult)) {
          dispatch(
            NotificationActions.addError(fetchResult.error, fetchResult.cause)
          );
          return;
        }
        const newCurrentProjectWithFiles = fetchResult.value;
        if (newCurrentProjectWithFiles === undefined) {
          throw new Error('Current project is not available.');
        }
        dispatch(
          WorkbenchAppActions.updateCurrentProject(newCurrentProjectWithFiles)
        );
        dispatch(WorkbenchAppActions.updateSelectedFile(undefined));

        const updateUserInformationResult = await updateUserInformation(
          storage.instance!,
          {
            ...app.user.information!,
            currentProjectId: newCurrentProjectWithFiles.id,
          }
        );
        if (isError(updateUserInformationResult)) {
          dispatch(
            NotificationActions.addError(
              updateUserInformationResult.error,
              updateUserInformationResult.cause
            )
          );
        }
      }
    },
  openWorkbenchProjectFile:
    (
      project: IWorkbenchProject,
      fileId: string,
      fileType: IBuildableFirmwareFileType
    ) =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage, workbench } = getState();
      const fetchResult = await storage.instance!.fetchWorkbenchProjectFile(
        project,
        fileId,
        fileType
      );
      if (isError(fetchResult)) {
        dispatch(
          NotificationActions.addError(fetchResult.error, fetchResult.cause)
        );
        return;
      }
      const file = fetchResult.value;
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
        targetFiles[index] = file;
      }
      dispatch(WorkbenchAppActions.updateCurrentProject(newCurrentProject));
      dispatch(
        WorkbenchAppActions.updateSelectedFile({
          fileId: file.id,
          fileType: file.fileType,
        })
      );
    },
  createFirmwareBuildingTask: (
    project: IWorkbenchProject
  ): ThunkPromiseAction<void> => {
    return async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const result =
        await storage.instance!.createWorkbenchProjectBuildingTask(project);
      if (isError(result)) {
        dispatch(NotificationActions.addError(result.error!, result.cause));
        return;
      }
      dispatch(
        NotificationActions.addSuccess(
          'The firmware building task has been registered.'
        )
      );
    };
  },
  flashFirmware:
    (task: IFirmwareBuildingTask) =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      _getState: () => RootState
    ) => {
      const defaultBootloaderType = determineBootloaderType(task);
      dispatch(FlashFirmwareDialogActions.clear());
      dispatch(
        FlashFirmwareDialogActions.updateBootloaderType(defaultBootloaderType)
      );
      const firmwareName = `Built for Task ID: ${task.id}`;
      dispatch(FlashFirmwareDialogActions.updateKeyboardName(''));
      dispatch(FlashFirmwareDialogActions.updateFlashMode('build_and_flash'));
      dispatch(FlashFirmwareDialogActions.updateBuildingFirmwareTask(task));
      dispatch(
        FlashFirmwareDialogActions.updateFirmware({
          name: firmwareName,
          default_bootloader_type: defaultBootloaderType,
          flash_support: true,
          filename: firmwareName,
          description: '',
          hash: '',
          sourceCodeUrl: '',
          created_at: new Date(),
        })
      );
      dispatch(firmwareActionsThunk.loadFirmwareBlob());
    },
  logout:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      getState: () => RootState
    ) => {
      const { auth } = getState();
      dispatch(AppActions.updateSignedIn(false));
      dispatch(AppActions.updateUserInformation(undefined));
      dispatch(WorkbenchAppActions.updateCurrentProject(undefined));
      dispatch(WorkbenchAppActions.updateProjects([]));
      dispatch(WorkbenchAppActions.updateSelectedFile(undefined));
      dispatch(WorkbenchAppActions.updatePhase(WorkbenchPhase.processing));
      await auth.instance!.signOut();
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

const determineBootloaderType = (
  task: IFirmwareBuildingTask
): IBootloaderType => {
  if (task.firmwareFilePath.endsWith('hex')) {
    return 'caterina';
  } else {
    return 'copy';
  }
};

const updateUserInformation = async (
  storage: IStorage,
  userInformation: IUserInformation
): Promise<IEmptyResult> => {
  const updateUserInformationResult =
    await storage.updateUserInformation(userInformation);
  if (isError(updateUserInformationResult)) {
    return errorResultOf(
      updateUserInformationResult.error,
      updateUserInformationResult.cause
    );
  }
  return successResult();
};
