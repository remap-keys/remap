import React from 'react';
import './Header.scss';
import logo from '../../../assets/images/logo.png';
import { hexadecimal } from '../../../utils/StringUtils';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown, Link, LinkOff } from '@material-ui/icons';
import ConnectionModal from '../modals/connection/ConnectionModal';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { IKeymap } from '../../../services/hid/Hid';

type HeaderState = {
  connectionStateEl: any;
};

type OwnProps = {};

type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType>;

export default class Header extends React.Component<HeaderProps, HeaderState> {
  private hasKeysToFlash: boolean = false;
  // eslint-disable-next-line no-undef
  flashButtonRef: React.RefObject<HTMLButtonElement>;
  constructor(props: HeaderProps | Readonly<HeaderProps>) {
    super(props);
    this.state = {
      connectionStateEl: null,
    };
    // eslint-disable-next-line no-undef
    this.flashButtonRef = React.createRef<HTMLButtonElement>();
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

  private onClickFlash() {
    if (this.hasKeysToFlash) {
      this.props.onClickFlashButton!();
    }
  }

  render() {
    this.hasKeysToFlash = this.props.remaps!.reduce(
      (has: boolean, v: { [pos: string]: IKeymap }) => {
        return 0 < Object.values(v).length || has;
      },
      false
    );

    let flashBtnState: FlashButtonState = this.hasKeysToFlash
      ? 'enable'
      : 'disable';
    if (this.props.flashing) {
      flashBtnState = 'flashing';
    } else if (
      flashBtnState == 'disable' &&
      this.flashButtonRef.current?.classList.contains('flashing')
    ) {
      flashBtnState = 'success';
      setTimeout(() => {
        this.flashButtonRef.current?.classList.remove('success');
        this.flashButtonRef.current?.classList.add('disable');
      }, 2500);
    }

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
          <button
            ref={this.flashButtonRef}
            disabled={flashBtnState == 'disable'}
            onClick={this.onClickFlash.bind(this)}
            className={['flash-button', flashBtnState].join(' ')}
          >
            flash
          </button>
        </div>
        {this.props.draggingKey && (
          <div className="dragMask" style={{ marginLeft: -8 }}></div>
        )}
        <ConnectionModal open={false} onClose={() => {}} />
      </header>
    );
  }
}

const FlashButtonStates = ['disable', 'enable', 'flashing', 'success'] as const;
type FlashButtonState = typeof FlashButtonStates[number];
