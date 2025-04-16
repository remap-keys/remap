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

type OwnProps = {};
type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType>;

export default function Header(props: HeaderProps | Readonly<HeaderProps>) {
  const [projectName, setProjectName] = useState<string>('');

  useEffect(() => {
    if (props.currentProject === undefined) {
      return;
    }
    setProjectName(props.currentProject.name);
  }, [props.currentProject]);

  const debouncedProjectName = useDebounce(projectName, 500);
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
          <Button variant="text" size="small" startIcon={<AccountTreeIcon />}>
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
    </React.Fragment>
  );
}
