/* eslint-disable no-undef */
import React, { SyntheticEvent } from 'react';
import './Header.scss';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { Logo } from '../../common/logo/Logo';
import ProfileIcon from '../../common/auth/ProfileIcon.container';
import { IconButton, Tab, Tabs } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { ICatalogPhase } from '../../../store/state';
import { IKeyboardDefinitionDocument } from '../../../services/storage/Storage';
import { sendEventToGoogleAnalytics } from '../../../utils/GoogleAnalytics';

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

  render() {
    return (
      <header className="catalog-header">
        <div className="catalog-header-logo-nav">
          {(['introduction', 'keymap'] as ICatalogPhase[]).includes(
            this.props.phase!
          ) ? (
            <div>
              <IconButton
                aria-label="back"
                onClick={this.onClickBackButton.bind(this)}
              >
                <ArrowBackIos />
              </IconButton>
            </div>
          ) : null}
          <div className="catalog-header-logo">
            <a href="/">
              <Logo width={100} />
            </a>
          </div>
        </div>
        <div className="catalog-header-nav">
          <CategoryKeyboardNav
            phase={this.props.phase!}
            definitionDocument={this.props.definitionDocument!}
            goToIntroduction={this.props.goToIntroduction!}
            goToKeymap={this.props.goToKeymap!}
          />
        </div>
        <div className="catalog-header-menu-button">
          <ProfileIcon
            logout={() => {
              this.props.logout!();
            }}
          />
        </div>
      </header>
    );
  }
}

export default Header;

type CategoryKeyboardNavProps = {
  phase: ICatalogPhase;
  definitionDocument: IKeyboardDefinitionDocument;
  goToIntroduction: () => void;
  goToKeymap: () => void;
};

const CategoryKeyboardNav: React.FC<CategoryKeyboardNavProps> = ({
  phase,
  definitionDocument,
  goToIntroduction,
  goToKeymap,
}) => {
  const onChangeTab = (event: React.ChangeEvent<{}>, value: number) => {
    if (value === 0) {
      sendEventToGoogleAnalytics('catalog/introduction');
      history.pushState(null, 'Remap', `/catalog/${definitionDocument.id}`);
      goToIntroduction();
    } else if (value === 1) {
      sendEventToGoogleAnalytics('catalog/keymap');
      history.pushState(
        null,
        'Remap',
        `/catalog/${definitionDocument.id}/keymap`
      );
      goToKeymap();
    }
  };
  if ((['introduction', 'keymap'] as ICatalogPhase[]).includes(phase)) {
    const value = phase === 'keymap' ? 1 : 0;
    return (
      <Tabs value={value} indicatorColor="primary" onChange={onChangeTab}>
        <Tab label={definitionDocument.name} />
        <Tab label="Keymap" />
      </Tabs>
    );
  } else {
    return null;
  }
};
