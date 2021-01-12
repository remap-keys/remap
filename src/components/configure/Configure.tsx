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
import { IKeyboard } from '../../services/hid/Hid';

type OwnProps = {};
type ConfigureProps = OwnProps &
  Partial<ConfigureStateType> &
  Partial<ConfigureActionsType> &
  ProviderContext;
type OwnState = {
  supportedBrowser: boolean;
  signedInForClosedBeta: boolean;
};

class Configure extends React.Component<ConfigureProps, OwnState> {
  private displayedNoficationIds: string[] = [];
  constructor(props: ConfigureProps) {
    super(props);
    this.state = {
      supportedBrowser: true,
      signedInForClosedBeta: true,
    };
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
        autoHideDuration: 5000,
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

  private initKeyboardConnectionEventHandler() {
    this.props.hid!.instance.setConnectionEventHandler({
      connect: (connectedKeyboard: IKeyboard) => {
        this.props.onConnectKeyboard!(connectedKeyboard);
      },
      disconnect: (disconnectedKeyboard: IKeyboard) => {
        this.props.onDisconnectKeyboard!(disconnectedKeyboard);
      },
    });
  }

  componentDidMount() {
    if ((navigator as any).hid === undefined) {
      this.setState({
        supportedBrowser: false,
      });
      return;
    }
    this.props.auth!.subscribeAuthStatus((user) => {
      if (user) {
        this.props.storage!.fetchClosedBetaUsers().then((users) => {
          if (users.includes(user.email!)) {
            this.setState({ signedInForClosedBeta: true });
            const version = appPackage.version;
            const name = appPackage.name;
            this.props.initAppPackage!(name, version);
            this.updateTitle();
            this.updateNotifications();
            this.initKeyboardConnectionEventHandler();
            this.props.updateAuthorizedKeyboardList!();
          } else {
            this.setState({ signedInForClosedBeta: false });
          }
        });
      } else {
        this.props.auth!.signInWithGitHubForClosedBeta().then(() => {
          // N/A
        });
      }
    });
  }

  componentDidUpdate() {
    this.updateTitle();
    this.updateNotifications();
  }

  render() {
    if (!this.state.supportedBrowser) {
      return (
        <React.Fragment>
          <CssBaseline />
          <div className="message-box-wrapper">
            <div className="message-box">
              <h1>Unsupported Web Browser</h1>
              <p>
                <a href="https://remap-keys.app">Remap</a> works on Web Browsers
                which the{' '}
                <a href="https://wicg.github.io/webhid/">WebHID API</a> is
                supported.
                <br />
                For example,{' '}
                <a href="https://www.google.com/chrome">Google Chrome</a>{' '}
                version 86 or later supports the WebHID API.
              </p>
            </div>
          </div>
        </React.Fragment>
      );
    }
    if (!this.state.signedInForClosedBeta) {
      return (
        <React.Fragment>
          <CssBaseline />
          <div className="message-box-wrapper">
            <div className="message-box">
              <p>You are not allow to access to Remap Closed Beta.</p>
            </div>
          </div>
        </React.Fragment>
      );
    }
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
