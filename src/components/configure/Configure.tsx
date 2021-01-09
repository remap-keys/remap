import React from 'react';
import './Configure.scss';
import { ProviderContext, withSnackbar } from 'notistack';
import Header from './header/Header.container';
import Content from './content/Content.container';
import CssBaseline from '@material-ui/core/CssBaseline';
import CloseIcon from '@material-ui/icons/Close';
import {
  ConfigureActionsType,
  ConfigureStateType,
} from './Configure.container';
import appPackage from '../../package.alias.json';
import { NotificationItem } from '../../actions/actions';
import { Button } from '@material-ui/core';

type OwnProps = {};
type ConfigureProps = OwnProps &
  Partial<ConfigureStateType> &
  Partial<ConfigureActionsType> &
  ProviderContext;

class Configure extends React.Component<ConfigureProps, {}> {
  private displayedNoficationIds: string[] = [];
  constructor(props: ConfigureProps) {
    super(props);
  }

  private storeDisplayedNotification = (key: string) => {
    this.displayedNoficationIds = [...this.displayedNoficationIds, key];
  };

  private removeDisplayedNotification = (key: string) => {
    this.displayedNoficationIds = [
      ...this.displayedNoficationIds.filter((k) => key !== k),
    ];
  };

  private updateNotifications() {
    this.props.notifications!.forEach((item: NotificationItem) => {
      if (this.displayedNoficationIds.includes(item.key)) return;

      this.props.enqueueSnackbar(item.message, {
        key: item.key,
        variant: item.type,
        autoHideDuration: 3000,
        onExited: (event, key: React.ReactText) => {
          this.props.removeNotification!(key as string);
          this.removeDisplayedNotification(key as string);
        },
        action: (key: number) => (
          <Button
            onClick={() => {
              this.props.closeSnackbar(key);
            }}
          >
            <CloseIcon />
          </Button>
        ),
      });
      this.storeDisplayedNotification(item.key);
    });
  }

  private updateTitle() {
    const hasKeysToFlush = this.props.remaps!.reduce((has, v) => {
      return 0 < Object.values(v).length || has;
    }, false);
    const title = hasKeysToFlush ? `*${appPackage.name}` : appPackage.name;
    // eslint-disable-next-line no-undef
    document.title = title;
  }

  componentDidMount() {
    const version = appPackage.version;
    const name = appPackage.name;
    this.props.initAppPackage!(name, version);
    this.props.updateAuthorizedKeyboardList!();
    this.updateTitle();
    this.updateNotifications();
  }

  componentDidUpdate() {
    this.updateTitle();
    this.updateNotifications();
  }
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        <main>
          <Content />
        </main>
      </React.Fragment>
    );
  }
}

export default withSnackbar(Configure);
