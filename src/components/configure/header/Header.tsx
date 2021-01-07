import React from 'react';
import './Header.scss';
import logo from '../../../assets/images/logo.png';
import { hexadecimal } from '../../../utils/StringUtils';
import { Button, CircularProgress, Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown, Link, LinkOff } from '@material-ui/icons';
import ConnectionModal from '../modals/connection/ConnectionModal';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { IKeycodeInfo } from '../../../services/hid/hid';

type HeaderState = {
  connectionStateEl: any;
};

type OwnProps = {};

type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType>;

export default class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps | Readonly<HeaderProps>) {
    super(props);
    this.state = {
      connectionStateEl: null,
    };
  }

  get openConnectionStateMenu() {
    return Boolean(this.state.connectionStateEl);
  }

  onCloseConnectionStateMenu = () => {
    this.setState({ connectionStateEl: null });
  };

  onClickDevice = (event: React.MouseEvent) => {
    this.setState({ connectionStateEl: event.currentTarget });
  };

  onClickConnectionMenuItemNewDevice = () => {
    this.onCloseConnectionStateMenu();
  };

  render() {
    const hasKeysToFlush = this.props.remaps!.reduce((has, v) => {
      return 0 < Object.values(v).length || has;
    }, false);

    return (
      <header className="header">
        <img src={logo} alt="logo" className="logo" />
        <div
          className={[
            'kbd-select',
            this.props.showKeyboardList ? '' : 'hidden',
          ].join(' ')}
          onClick={this.onClickDevice}
        >
          <div className="kbd-name">
            <h2>{this.props.productName}</h2>
            <div className="ids">
              VID: {hexadecimal(this.props.vendorId!, 4)} / PID:{' '}
              {hexadecimal(this.props.productId!, 4)}
            </div>
          </div>
          <ArrowDropDown />
        </div>
        <div className="status">
          <Menu
            anchorEl={this.state.connectionStateEl}
            keepMounted
            open={this.openConnectionStateMenu}
            onClose={this.onCloseConnectionStateMenu}
            PaperProps={{
              style: {
                maxHeight: 250,
              },
            }}
          >
            {this.props.keyboards!.map((kbd, index) => {
              const info = kbd.getInformation();
              const isOpenedKbd = this.props.openedKeyboard == kbd;
              const linking = isOpenedKbd ? 'link-on' : 'link-off';
              return (
                <MenuItem
                  key={index}
                  onClick={
                    isOpenedKbd
                      ? undefined
                      : this.props.onClickKeyboardMenuItem!.bind(this, kbd)
                  }
                  disabled={isOpenedKbd}
                >
                  <div className="device-item">
                    {isOpenedKbd ? (
                      <Link fontSize="small" className="link-icon link-on" />
                    ) : (
                      <LinkOff
                        fontSize="small"
                        className="link-icon link-off"
                      />
                    )}
                    <div className={['device-name', linking].join(' ')}>
                      {info.productName}
                      <span className="device-ids">
                        (VID: {hexadecimal(info.vendorId, 4)} / PID:{' '}
                        {hexadecimal(info.productId, 4)})
                      </span>
                    </div>
                  </div>
                </MenuItem>
              );
            })}

            <MenuItem
              key="another"
              onClick={this.onClickConnectionMenuItemNewDevice}
            >
              <div className="another-device-wrapper">
                <Button
                  size="small"
                  color="primary"
                  className="another-device"
                  onClick={this.props.onClickAnotherKeyboard?.bind(this)}
                >
                  + Connect another device
                </Button>
              </div>
            </MenuItem>
          </Menu>
        </div>
        <div
          className={[
            'buttons',
            this.props.openedKeyboard ? '' : 'hidden',
          ].join(' ')}
        >
          <Button
            size="small"
            color="primary"
            variant="contained"
            className="flush-btn"
            disabled={this.props.flushLoading || !hasKeysToFlush}
            onClick={this.props.onClickFlushButton}
          >
            FLUSH
          </Button>
          {this.props.flushLoading && (
            <CircularProgress size={24} className="flush-loading" />
          )}
        </div>

        <ConnectionModal open={false} onClose={() => {}} />
      </header>
    );
  }
}
