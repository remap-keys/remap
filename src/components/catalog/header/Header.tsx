/* eslint-disable no-undef */
import React, { SyntheticEvent } from 'react';
import './Header.scss';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { Logo } from '../../common/logo/Logo.1';
import ProfileIcon from '../../common/auth/ProfileIcon.container';
import { IconButton } from '@mui/material';
import { ArrowBackIos, DeveloperBoard } from '@mui/icons-material';
import { ICatalogPhase } from '../../../store/state';
import { sendEventToGoogleAnalytics } from '../../../utils/GoogleAnalytics';
import FlashFirmwareDialog from '../../common/firmware/FlashFirmwareDialog.container';
import UploadFirmwareDialog from '../../common/firmware/UploadFirmwareDialog.container';

type HeaderState = {};
type OwnProps = {};
type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType>;

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps | Readonly<HeaderProps>) {
    super(props);
  }

  // eslint-disable-next-line no-unused-vars
  onClickBackButton(event: SyntheticEvent) {
    sendEventToGoogleAnalytics('catalog/back_to_search');
    this.props.goToSearch!();
  }

  // eslint-disable-next-line no-unused-vars
  onClickFlashFirmware(event: SyntheticEvent) {
    this.props.openUploadFirmwareDialog!();
  }

  render() {
    return (
      <React.Fragment>
        <header className="catalog-header">
          <div className="catalog-header-logo-nav">
            {(
              ['introduction', 'keymap', 'firmware', 'build'] as ICatalogPhase[]
            ).includes(this.props.phase!) ? (
              <div>
                <IconButton
                  aria-label="back"
                  onClick={this.onClickBackButton.bind(this)}
                >
                  <ArrowBackIos />
                </IconButton>
              </div>
            ) : null}
          </div>
          <div className="catalog-header-logo">
            <a href="/">
              <Logo width={100} />
            </a>
          </div>
          <div className="catalog-header-buttons">
            <IconButton
              title="Flash Firmware"
              onClick={this.onClickFlashFirmware.bind(this)}
            >
              <DeveloperBoard />
            </IconButton>
            <div className="catalog-header-menu-button">
              <ProfileIcon
                logout={() => {
                  this.props.logout!();
                }}
              />
            </div>
          </div>
        </header>
        <FlashFirmwareDialog />
        <UploadFirmwareDialog />
      </React.Fragment>
    );
  }
}

export default Header;
