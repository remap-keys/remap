import React from 'react';
import {
  ProfileIconActionsType,
  ProfileIconStateType,
} from './ProfileIcon.container';
import {
  Avatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { Person, PersonOutline } from '@mui/icons-material';
import AuthProviderDialog from './AuthProviderDialog.container';
import {
  getGitHubProviderData,
  getGoogleProviderData,
} from '../../../services/auth/Auth';
import './ProfileIcon.scss';
import { t } from 'i18next';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

type OwnProps = {
  logout: () => void;
  children?: React.ReactNode;
};
type ProfileIconProps = OwnProps &
  Partial<ProfileIconActionsType> &
  Partial<ProfileIconStateType> & {
    childrenWithOnClose?: (onClose: () => void) => React.ReactNode;
  };

export default function ProfileIcon(
  props: ProfileIconProps | Readonly<ProfileIconProps>
) {
  const [authMenuAnchorEl, setAuthMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [openAuthProviderDialog, setOpenAuthProviderDialog] =
    React.useState(false);

  const handleAuthMenuIconClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAuthMenuAnchorEl(event.currentTarget);
  };

  const handleAuthMenuClose = () => {
    setAuthMenuAnchorEl(null);
  };

  const handleLogoutMenuClick = async () => {
    await props.logout!();
    setAuthMenuAnchorEl(null);
  };

  const handleLinkGoogleAccountMenuClick = async () => {
    setAuthMenuAnchorEl(null);
    props.linkToGoogleAccount!();
  };

  const handleLinkGitHubAccountMenuClick = async () => {
    setAuthMenuAnchorEl(null);
    props.linkToGitHubAccount!();
  };

  const handleCloseAuthProviderDialog = async () => {
    setOpenAuthProviderDialog(false);
  };

  const handleLoginMenuClick = async () => {
    setAuthMenuAnchorEl(null);
    setOpenAuthProviderDialog(true);
  };

  const renderLinkGoogleAccountMenu = () => {
    const user = props.auth!.getCurrentAuthenticatedUserIgnoreNull();
    if (user && !getGoogleProviderData(user).exists) {
      return (
        <MenuItem
          key="auth-menu-link-google-account"
          onClick={() => handleLinkGoogleAccountMenuClick()}
        >
          Link Google Account
        </MenuItem>
      );
    } else {
      return null;
    }
  };

  const renderLinkGitHubAccountMenu = () => {
    const user = props.auth!.getCurrentAuthenticatedUserIgnoreNull();
    if (user && !getGitHubProviderData(user).exists) {
      return (
        <MenuItem
          key="auth-menu-link-github-account"
          onClick={() => handleLinkGitHubAccountMenuClick()}
        >
          Link GitHub Account
        </MenuItem>
      );
    } else {
      return null;
    }
  };

  // Render
  if (props.signedIn) {
    const user = props.auth!.getCurrentAuthenticatedUserIgnoreNull();
    const profileImageUrl = user.photoURL || '';
    const profileDisplayName = user.displayName || '';
    let avatar: React.ReactNode;
    if (profileImageUrl) {
      avatar = (
        <Avatar
          alt={profileDisplayName}
          src={profileImageUrl}
          className="profile-icon-avatar"
        />
      );
    } else {
      avatar = (
        <Avatar className="profile-icon-avatar">
          <Person />
        </Avatar>
      );
    }
    return (
      <React.Fragment>
        <IconButton
          aria-owns={authMenuAnchorEl ? 'profile-icon-auth-menu' : undefined}
          onClick={handleAuthMenuIconClick}
        >
          {avatar}
        </IconButton>
        <Menu
          id="profile-icon-auth-menu"
          anchorEl={authMenuAnchorEl}
          open={Boolean(authMenuAnchorEl)}
          onClose={handleAuthMenuClose}
        >
          {renderLinkGoogleAccountMenu()}
          {renderLinkGitHubAccountMenu()}
          {props.childrenWithOnClose &&
            props.childrenWithOnClose(handleAuthMenuClose)}
          <MenuItem
            key="profile-icon-menu-logout"
            onClick={() => handleLogoutMenuClick()}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>{t('Logout')}</ListItemText>
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <IconButton
          aria-owns={authMenuAnchorEl ? 'profile-icon-auth-menu' : undefined}
          onClick={handleAuthMenuIconClick}
        >
          <Avatar className="profile-icon-avatar">
            <PersonOutline />
          </Avatar>
        </IconButton>
        <Menu
          id="profile-icon-auth-menu"
          anchorEl={authMenuAnchorEl}
          open={Boolean(authMenuAnchorEl)}
          onClose={handleAuthMenuClose}
        >
          <MenuItem
            key="profile-icon-menu-login"
            onClick={() => handleLoginMenuClick()}
          >
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText>{t('Login')}</ListItemText>
          </MenuItem>
          {props.childrenWithOnClose &&
            props.childrenWithOnClose(handleAuthMenuClose)}
        </Menu>
        <AuthProviderDialog
          open={openAuthProviderDialog}
          onClose={handleCloseAuthProviderDialog}
        />
      </React.Fragment>
    );
  }
}
