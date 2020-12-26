import React from 'react';
import './Header.scss';
import logo from '../../../asserts/images/logo.png';
import { hexadecimal } from '../../../utils/StringUtils';
import { Button, Chip, IconButton, Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown, Link, LinkOff, MoreVert } from '@material-ui/icons';
import ConnectionModal from '../modals/connection/ConnectionModal';

const langs = ['JA', 'EN'] as const;
type Lang = typeof langs[number];

interface IHeaderState {
  lang: Lang;
  langEl: any;
  menuEl: any;
  connectionStateEl: any;
  openConnectionModal: boolean;
}

interface IHeaderProps {
  connected: boolean;
  keyboardName: string;
  vendorId: number;
  productId: number;
}

export default class Header extends React.Component<
  IHeaderProps,
  IHeaderState
> {
  constructor(props: IHeaderProps | Readonly<IHeaderProps>) {
    super(props);
    this.state = {
      lang: 'EN',
      langEl: null,
      menuEl: null,
      connectionStateEl: null,
      openConnectionModal: false,
    };
  }

  get openLang() {
    return Boolean(this.state.langEl);
  }

  get openConnectionStateMenu() {
    return Boolean(this.state.connectionStateEl);
  }

  get openMenu() {
    return Boolean(this.state.menuEl);
  }

  handleSelectLang = (lang: Lang) => {
    this.setState({ lang: lang });
    this.handleCloseLang();
  };

  handleClickLang = (event: React.MouseEvent) => {
    this.setState({ langEl: event.currentTarget });
  };

  handleClickMenu = (event: React.MouseEvent) => {
    this.setState({ menuEl: event.currentTarget });
  };

  onCloseConnectionStateMenu = () => {
    this.setState({ connectionStateEl: null });
  };

  handleCloseLang = () => {
    this.setState({ langEl: null });
  };

  handleCloseMenu = () => {
    this.setState({ menuEl: null });
  };

  handleClickMenuRestore = () => {
    this.handleCloseMenu();
  };

  handleClickMenuBackup = () => {
    this.handleCloseMenu();
  };

  onClickStatus = (event: React.MouseEvent) => {
    // TODO: change global connection status
    this.setState({ connectionStateEl: event.currentTarget });
  };
  onClickConnectionMenuItem = (vid: number) => {
    console.log(vid);
    this.onCloseConnectionStateMenu();
  };

  onClickConnectionMenuItemNewDevice = () => {
    this.onCloseConnectionStateMenu();
  };

  onCloseConnectionModal = () => {
    this.setState({ openConnectionModal: false });
  };

  openConnectionModal = () => {
    this.setState({ openConnectionModal: true });
  };

  render() {
    return (
      <header className="header">
        <img src={logo} alt="logo" className="logo" />
        <div className="kbd-select" onClick={this.onClickStatus}>
          <div className="kbd-name">
            <h2>{this.props.keyboardName}</h2>
            <div className="ids">
              VID: {hexadecimal(this.props.vendorId, 4)} / PID:{' '}
              {hexadecimal(this.props.productId, 4)}
            </div>
          </div>
          <ArrowDropDown />
        </div>
        <div className="status">
          <Chip
            variant="outlined"
            size="small"
            label={this.props.connected ? 'Connected' : 'Disconnected'}
            color={this.props.connected ? 'primary' : 'secondary'}
            className="connection"
          />
          <Menu
            anchorEl={this.state.connectionStateEl}
            keepMounted
            open={this.openConnectionStateMenu}
            onClose={this.onCloseConnectionStateMenu}
          >
            <MenuItem
              key="1"
              onClick={this.onClickConnectionMenuItem.bind(this, 0x5954)}
            >
              <div className="device-item">
                <LinkOff fontSize="small" className="link-icon link-off" />
                <div className="device-name link-off">
                  Lunakey Pro
                  <span className="device-ids">
                    (VID: 0x9999 / PID: 0x0001)
                  </span>
                </div>
              </div>
            </MenuItem>
            <MenuItem
              key="2"
              onClick={this.onClickConnectionMenuItem.bind(this, 0x5954)}
              disabled
              className="connected-device"
            >
              <div className="device-item">
                <Link fontSize="small" className="link-icon link-on" />
                <div className="device-name link-on">
                  Lunakey Mini
                  <span className="device-ids">
                    (VID: 0x5954 / PID: 0x0001)
                  </span>
                </div>
              </div>
            </MenuItem>
            <MenuItem key="3" onClick={this.onClickConnectionMenuItemNewDevice}>
              <div className="another-device-wrapper">
                <Button size="small" color="primary" className="another-device">
                  + Connect another device
                </Button>
              </div>
            </MenuItem>
          </Menu>
        </div>
        <div className="buttons">
          <Button
            size="small"
            color="primary"
            variant="contained"
            className="flush-btn"
          >
            FLUSH
          </Button>
        </div>
        <div className="lang">
          <Button size="small" color="primary" onClick={this.handleClickLang}>
            {this.state.lang}
          </Button>
          <Menu
            anchorEl={this.state.langEl}
            keepMounted
            open={this.openLang}
            onClose={this.handleCloseLang}
          >
            {langs.map((lang) => {
              return (
                <MenuItem
                  key={lang}
                  onClick={this.handleSelectLang.bind(this, lang)}
                >
                  {lang}
                </MenuItem>
              );
            })}
          </Menu>
        </div>
        <div className="menu">
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={this.handleClickMenu}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={this.state.menuEl}
            keepMounted
            open={this.openMenu}
            onClose={this.handleCloseMenu}
          >
            <MenuItem key="restore" onClick={this.handleClickMenuRestore}>
              Restore
            </MenuItem>
            <MenuItem key="backup" onClick={this.handleClickMenuBackup}>
              Backup
            </MenuItem>
          </Menu>
        </div>
        <ConnectionModal
          open={this.state.openConnectionModal}
          onClose={this.onCloseConnectionModal}
        />
      </header>
    );
  }
}
