import React, { useEffect, useState } from 'react';
import './Header.scss';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { Logo } from '../../common/logo/Logo';
import ProfileIcon from '../../common/auth/ProfileIcon.container';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';
import { Button, TextField } from '@mui/material';
import { useDebounce } from '../../common/hooks/DebounceHook';
import { IWorkbenchProject } from '../../../services/storage/Storage';
import WorkbenchProjectsDialog from '../dialogs/WorkbenchProjectsDialog';

type OwnProps = {};
type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType>;

export default function Header(props: HeaderProps | Readonly<HeaderProps>) {
  const [projectName, setProjectName] = useState<string>('');
  const [openProjectsDialog, setOpenProjectsDialog] = useState<boolean>(false);

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
          <Button variant="text" size="small" startIcon={<SettingsIcon />}>
            Settings
          </Button>
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
        onDeleteProject={(project: IWorkbenchProject) => {}}
      />
    </React.Fragment>
  );
}
