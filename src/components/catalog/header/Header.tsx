/* eslint-disable no-undef */
import React from 'react';
import './Header.scss';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { Logo } from '../../common/logo/Logo';
import {
  getGitHubProviderData,
  getGoogleProviderData,
} from '../../../services/auth/Auth';
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core';
import { Person, PersonOutline } from '@material-ui/icons';
import AuthProviderDialog from '../../configure/auth/AuthProviderDialog.container';

type HeaderState = {
  authMenuAnchorEl: any;
  openAuthProviderDialog: boolean;
};
type OwnProps = {};
type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType>;

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps | Readonly<HeaderProps>) {
    super(props);
    this.state = {
      authMenuAnchorEl: null,
      openAuthProviderDialog: false,
    };
  }

  handleMenuIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      authMenuAnchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      authMenuAnchorEl: null,
    });
  };

  async handleLogoutMenuClick() {
    await this.props.logout!();
    this.setState({
      authMenuAnchorEl: null,
    });
  }

  handleAuthMenuIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      authMenuAnchorEl: event.currentTarget,
    });
  };

  async handleLoginMenuClick() {
    this.setState({ authMenuAnchorEl: null, openAuthProviderDialog: true });
  }

  private onCloseAuthProviderDialog() {
    this.setState({ openAuthProviderDialog: false });
  }

  handleAuthMenuClose = () => {
    this.setState({
      authMenuAnchorEl: null,
    });
  };

  async handleLinkGoogleAccountMenuClick() {
    this.setState({ authMenuAnchorEl: null });
    this.props.linkToGoogleAccount!();
  }

  async handleLinkGitHubAccountMenuClick() {
    this.setState({ authMenuAnchorEl: null });
    this.props.linkToGitHubAccount!();
  }

  renderLinkGoogleAccountMenu() {
    const user = this.props.auth!.getCurrentAuthenticatedUser();
    if (user && !getGoogleProviderData(user).exists) {
      return (
        <MenuItem
          key="auth-menu-link-google-account"
          button={true}
          onClick={() => this.handleLinkGoogleAccountMenuClick()}
        >
          Link Google Account
        </MenuItem>
      );
    } else {
      return null;
    }
  }

  renderLinkGitHubAccountMenu() {
    const user = this.props.auth!.getCurrentAuthenticatedUser();
    if (user && !getGitHubProviderData(user).exists) {
      return (
        <MenuItem
          key="auth-menu-link-github-account"
          button={true}
          onClick={() => this.handleLinkGitHubAccountMenuClick()}
        >
          Link GitHub Account
        </MenuItem>
      );
    } else {
      return null;
    }
  }

  renderAvatarIcon() {
    const { authMenuAnchorEl } = this.state;
    if (this.props.signedIn) {
      const user = this.props.auth!.getCurrentAuthenticatedUser();
      const profileImageUrl = user.photoURL || '';
      const profileDisplayName = user.displayName || '';
      let avatar: React.ReactNode;
      if (profileImageUrl) {
        avatar = (
          <Avatar
            alt={profileDisplayName}
            src={profileImageUrl}
            className="catalog-header-avatar"
          />
        );
      } else {
        avatar = (
          <Avatar className="header-avatar">
            <Person />
          </Avatar>
        );
      }
      return (
        <React.Fragment>
          <IconButton
            aria-owns={
              authMenuAnchorEl ? 'catalog-header-auth-menu' : undefined
            }
            onClick={this.handleAuthMenuIconClick}
          >
            {avatar}
          </IconButton>
          <Menu
            id="catalog-header-auth-menu"
            anchorEl={authMenuAnchorEl}
            open={Boolean(authMenuAnchorEl)}
            onClose={this.handleAuthMenuClose}
          >
            {this.renderLinkGoogleAccountMenu()}
            {this.renderLinkGitHubAccountMenu()}
            <MenuItem
              key="catalog-auth-menu-logout"
              button={true}
              onClick={() => this.handleLogoutMenuClick()}
            >
              Logout
            </MenuItem>
          </Menu>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <IconButton
            aria-owns={
              authMenuAnchorEl ? 'catalog-header-auth-menu' : undefined
            }
            onClick={this.handleAuthMenuIconClick}
          >
            <Avatar className="catalog-header-avatar">
              <PersonOutline />
            </Avatar>
          </IconButton>
          <Menu
            id="catalog-header-auth-menu"
            anchorEl={authMenuAnchorEl}
            open={Boolean(authMenuAnchorEl)}
            onClose={this.handleAuthMenuClose}
          >
            <MenuItem
              key="catalog-auth-menu-login"
              button={true}
              onClick={() => this.handleLoginMenuClick()}
            >
              Login
            </MenuItem>
          </Menu>
          <AuthProviderDialog
            open={this.state.openAuthProviderDialog}
            onClose={this.onCloseAuthProviderDialog.bind(this)}
          />
        </React.Fragment>
      );
    }
  }

  render() {
    return (
      <header className="catalog-header">
        <a href="/" className="catalog-header-logo">
          <Logo width={100} />
        </a>
        <div className="catalog-header-menu-button">
          {this.renderAvatarIcon()}
        </div>
      </header>
    );
  }
}

export default Header;
