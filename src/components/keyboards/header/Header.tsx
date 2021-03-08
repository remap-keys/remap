import React from 'react';
import './Header.scss';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { Logo } from '../../common/logo/Logo';
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import { getGitHubProviderData } from '../../../services/auth/Auth';

type HeaderState = {
  menuAnchorEl: any;
};
type OwnProps = {};
type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType>;

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps | Readonly<HeaderProps>) {
    super(props);
    this.state = {
      menuAnchorEl: null,
    };
  }

  handleMenuIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      menuAnchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      menuAnchorEl: null,
    });
  };

  async handleLogoutMenuClick() {
    await this.props.logout!();
    location.href = '/';
  }

  renderAvatarIcon() {
    const user = this.props.auth!.getCurrentAuthenticatedUser();
    if (user) {
      const { menuAnchorEl } = this.state;

      const githubProviderDataResutl = getGitHubProviderData(user);
      if (!githubProviderDataResutl.exists) {
        throw new Error('The user does not have a GitHub Provider data.');
      }
      const githubProviderData = githubProviderDataResutl.userInfo!;

      const profileImageUrl = githubProviderData.photoURL || '';
      const profileDisplayName = githubProviderData.displayName || '';
      if (profileImageUrl) {
        return (
          <React.Fragment>
            <IconButton
              aria-owns={menuAnchorEl ? 'keyboards-header-menu' : undefined}
              onClick={this.handleMenuIconClick}
            >
              <Avatar alt={profileDisplayName} src={profileImageUrl} />
            </IconButton>
            <Menu
              id="keyboards-header-menu"
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={this.handleMenuClose}
            >
              <MenuItem
                key="1"
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
          <Avatar>
            <Person />
          </Avatar>
        );
      }
    } else {
      return null;
    }
  }

  render() {
    return (
      <header className="keyboards-header">
        <a href="/" className="keyboards-header-logo">
          <Logo width={100} />
        </a>
        <div className="keyboards-header-menu-button">
          {this.renderAvatarIcon()}
        </div>
      </header>
    );
  }
}

export default Header;
