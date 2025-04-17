import React, { useEffect, useState } from 'react';
import './Header.scss';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { Logo } from '../../common/logo/Logo';
import ProfileIcon from '../../common/auth/ProfileIcon.container';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BuildIcon from '@mui/icons-material/Build';
import TuneIcon from '@mui/icons-material/Tune';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { useDebounce } from '../../common/hooks/DebounceHook';
import {
  IBuildableFirmwareQmkFirmwareVersion,
  IWorkbenchProject,
} from '../../../services/storage/Storage';
import WorkbenchProjectsDialog from '../dialogs/WorkbenchProjectsDialog';
import ConfirmDialog from '../../common/confirm/ConfirmDialog';
import WorkbenchProjectSettingsDialog from '../dialogs/WorkbenchProjectSettingsDialog';

type OwnProps = {};
type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType>;

export default function Header(props: HeaderProps | Readonly<HeaderProps>) {
  const [projectName, setProjectName] = useState<string>('');
  const [openProjectsDialog, setOpenProjectsDialog] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [targetDeleteProject, setTargetDeleteProject] = useState<
    IWorkbenchProject | undefined
  >(undefined);
  const [openProjectSettingsDialog, setOpenProjectSettingsDialog] =
    useState<boolean>(false);

  useEffect(() => {
    if (props.currentProject === undefined) {
      return;
    }
    setProjectName(props.currentProject.name);
  }, [props.currentProject]);

  const debouncedProjectName = useDebounce(projectName, 1000);
  useEffect(() => {
    if (props.currentProject === undefined) {
      return;
    }
    if (debouncedProjectName === '') {
      return;
    }
    const currentProject = props.currentProject;
    const currentProjectName = currentProject.name;
    if (currentProjectName === debouncedProjectName) {
      return;
    }
    const newCurrentProject: IWorkbenchProject = {
      ...currentProject,
      name: debouncedProjectName,
    };
    props.updateWorkbenchProject!(newCurrentProject);
  }, [debouncedProjectName]);

  const onChangeProjectName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.currentProject === null) {
      return;
    }
    const name = event.target.value;
    setProjectName(name);
  };

  const onClickProjects = () => {
    if (props.currentProject === undefined) {
      return;
    }
    setOpenProjectsDialog(true);
  };

  const onClickCreateNewProject = () => {
    props.createNewWorkbenchProject!();
    setOpenProjectsDialog(false);
  };

  const onClickOpenProject = (project: IWorkbenchProject) => {
    props.switchCurrentWorkbenchProject!(project);
    props.updateSelectedFile!(undefined);
    setOpenProjectsDialog(false);
  };

  const onClickDeleteProject = (project: IWorkbenchProject) => {
    setOpenProjectsDialog(false);
    setTargetDeleteProject(project);
    setOpenConfirmDialog(true);
  };

  const onClickYesDeleteProject = () => {
    if (targetDeleteProject === undefined) {
      return;
    }
    props.deleteWorkbenchProject!(targetDeleteProject);
    setOpenConfirmDialog(false);
    setTargetDeleteProject(undefined);
  };

  const onClickProjectSettings = () => {
    setOpenProjectSettingsDialog(true);
  };

  const onApplyProjectSettings = (
    qmkFirmwareVersion: IBuildableFirmwareQmkFirmwareVersion
  ) => {
    if (props.currentProject === undefined) {
      return;
    }
    const currentProject = props.currentProject;
    const newCurrentProject: IWorkbenchProject = {
      ...currentProject,
      qmkFirmwareVersion: qmkFirmwareVersion,
    };
    props.updateWorkbenchProject!(newCurrentProject);
    setOpenProjectSettingsDialog(false);
  };

  return (
    <React.Fragment>
      <header className="workbench-header">
        <div className="workbench-header-logo">
          <a href="/">
            <Logo width={100} />
          </a>
        </div>
        <div className="workbench-header-right">
          <TextField
            size="small"
            value={projectName}
            onChange={onChangeProjectName}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={onClickProjectSettings}>
                    <TuneIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: '300px' }}
          />
          <Button
            variant="text"
            size="small"
            startIcon={<AccountTreeIcon />}
            onClick={onClickProjects}
          >
            Projects
          </Button>
          <Button variant="text" size="small" startIcon={<BuildIcon />}>
            Build
          </Button>
          {/* <Button variant="text" size="small" startIcon={<SettingsIcon />}>
            Settings
          </Button> */}
          <div className="workbench-header-menu-button">
            <ProfileIcon
              logout={() => {
                props.logout!();
              }}
            />
          </div>
        </div>
      </header>
      <WorkbenchProjectsDialog
        open={openProjectsDialog}
        projects={props.projects}
        currentProject={props.currentProject}
        onClose={() => {
          setOpenProjectsDialog(false);
        }}
        onCreateNewProject={onClickCreateNewProject}
        onOpenProject={onClickOpenProject}
        onDeleteProject={onClickDeleteProject}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        title="Confirm"
        message={`Are you sure you want to delete the "${targetDeleteProject?.name}" project?`}
        onClickYes={onClickYesDeleteProject}
        onClickNo={() => {
          setOpenConfirmDialog(false);
        }}
      />
      <WorkbenchProjectSettingsDialog
        open={openProjectSettingsDialog}
        onClose={() => {
          setOpenProjectSettingsDialog(false);
        }}
        qmkFirmwareVersion={props.currentProject?.qmkFirmwareVersion}
        onApply={onApplyProjectSettings}
      />
    </React.Fragment>
  );
}
