import React from 'react';
import './Header.scss';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { Logo } from '../../common/logo/Logo';
import ProfileIcon from '../../common/auth/ProfileIcon.container';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';
import { Button, TextField } from '@mui/material';

type OwnProps = {};
type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType>;

export default function Header(props: HeaderProps | Readonly<HeaderProps>) {
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
            value={
              props.currentProject === undefined
                ? ''
                : props.currentProject.name
            }
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
