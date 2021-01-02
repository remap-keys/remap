import React from 'react';
import './Header.scss';
import logo from '../../../assets/images/logo.png';
import { hexadecimal } from '../../../utils/StringUtils';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown, Link, LinkOff } from '@material-ui/icons';
import ConnectionModal from '../modals/connection/ConnectionModal';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { Device } from '../../../actions/actions';

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
    this.props.onClickDeviceMenu!();
  };

  onClickConnectionMenuItemNewDevice = () => {
    this.onCloseConnectionStateMenu();
  };

  render() {
    return (
      <header className="header">
        <img src={logo} alt="logo" className="logo" />
        <div
          className={[
            'kbd-select',
            Number.isNaN(this.props.openedDeviceId) ? 'hidden' : '',
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
          >
            {Object.keys(this.props.devices!).map((key) => {
              const id = Number(key);
              const device: Device = this.props.devices![id];
              const isOpenedDevice = this.props.openedDeviceId == id;
              const linking = isOpenedDevice ? 'link-on' : 'link-off';
              return (
                <MenuItem
                  key={id}
                  onClick={this.props.onClickDeviceMenuItem!.bind(this, id)}
                >
                  <div className="device-item">
                    {isOpenedDevice ? (
                      <Link fontSize="small" className="link-icon link-on" />
                    ) : (
                      <LinkOff
                        fontSize="small"
                        className="link-icon link-off"
                      />
                    )}
                    <div className={['device-name', linking].join(' ')}>
                      {device.productName}
                      <span className="device-ids">
                        (VID: {hexadecimal(device.vendorId, 4)} / PID:{' '}
                        {hexadecimal(device.productId, 4)})
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
                  onClick={this.props.onClickAnotherDevice?.bind(this)}
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
            Number.isNaN(this.props.openedDeviceId) ? 'hidden' : '',
          ].join(' ')}
        >
          <Button
            size="small"
            color="primary"
            variant="contained"
            className="flush-btn"
          >
            FLUSH
          </Button>
        </div>

        <ConnectionModal open={false} onClose={() => {}} />
      </header>
    );
  }
}
