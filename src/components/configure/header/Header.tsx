/* eslint-disable no-undef */
import React from 'react';
import './Header.scss';
import { hexadecimal } from '../../../utils/StringUtils';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown, Link } from '@material-ui/icons';
import ConnectionModal from '../modals/connection/ConnectionModal';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { IKeyboard, IKeymap } from '../../../services/hid/Hid';
import { Logo } from '../../common/logo/Logo';

type HeaderState = {
  connectionStateEl: any;
  logoAnimation: boolean;
};

type OwnProps = {};

type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType>;

export default class Header extends React.Component<HeaderProps, HeaderState> {
  private hasKeysToFlash: boolean = false;
  flashButtonRef: React.RefObject<HTMLButtonElement>;
  deviceMenuRef: React.RefObject<HTMLDivElement>;
  constructor(props: HeaderProps | Readonly<HeaderProps>) {
    super(props);
    this.state = {
      connectionStateEl: null,
      logoAnimation: false,
    };
    this.flashButtonRef = React.createRef<HTMLButtonElement>();
    this.deviceMenuRef = React.createRef<HTMLDivElement>();
  }

  shouldComponentUpdate(nextProps: HeaderProps) {
    if (
      this.props.showKeyboardList &&
      this.props.keyboards!.length < nextProps.keyboards!.length
    ) {
      this.onClickDevice();
    }
    return true;
  }

  get openConnectionStateMenu() {
    return Boolean(this.state.connectionStateEl);
  }

  private onCloseConnectionStateMenu() {
    this.setState({ connectionStateEl: null });
  }

  private onClickDevice() {
    this.setState({ connectionStateEl: this.deviceMenuRef.current });
  }

  private onClickConnectionMenuItemNewDevice() {
    this.onCloseConnectionStateMenu();
    this.props.onClickAnotherKeyboard!();
  }

  private onClickFlash() {
    if (this.hasKeysToFlash) {
      this.props.onClickFlashButton!();
    }
  }

  private onClickKeyboardMenuItem(kbd: IKeyboard) {
    this.onCloseConnectionStateMenu();
    this.props.onClickKeyboardMenuItem!(kbd);
  }

  private endLogoAnim() {
    this.setState({ logoAnimation: false });
  }

  private startLogoAnim() {
    this.setState({ logoAnimation: true });
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
        <div
          ref={this.deviceMenuRef}
          className={[
            'kbd-select',
            this.props.showKeyboardList ? '' : 'hidden',
          ].join(' ')}
        >
          <div className="kbd-name" onClick={this.onClickDevice.bind(this)}>
            <h2>{this.props.productName}</h2>
            <div className="ids">
              VID: {hexadecimal(this.props.vendorId!, 4)} / PID:{' '}
              {hexadecimal(this.props.productId!, 4)}
            </div>
          </div>
          <ArrowDropDown onClick={this.onClickDevice.bind(this)} />
          <div className="device-list">
            <Menu
              anchorEl={this.state.connectionStateEl}
              keepMounted
              open={this.openConnectionStateMenu}
              onClose={this.onCloseConnectionStateMenu.bind(this)}
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
                        : this.onClickKeyboardMenuItem.bind(this, kbd)
                    }
                    disabled={isOpenedKbd}
                  >
                    <div className="device-item">
                      {isOpenedKbd && (
                        <Link fontSize="small" className="link-icon link-on" />
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
                onClick={this.onClickConnectionMenuItemNewDevice.bind(this)}
              >
                <div className="another-device-wrapper">
                  <Button
                    size="small"
                    color="primary"
                    className="another-device"
                  >
                    + KEYBOARD
                  </Button>
                </div>
              </MenuItem>
            </Menu>
          </div>
        </div>

        <div className="header-logo">
          <a
            href="/"
            onMouseEnter={this.startLogoAnim.bind(this)}
            onMouseLeave={this.endLogoAnim.bind(this)}
          >
            <Logo width={100} animation={this.state.logoAnimation} />
          </a>
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
