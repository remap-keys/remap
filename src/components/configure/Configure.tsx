/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import './Configure.scss';
import { OptionsObject, ProviderContext, SnackbarKey, withSnackbar } from 'notistack';
import Header from './header/Header.container';
import Content from './content/Content.container';
import {
  ConfigureActionsType,
  ConfigureStateType,
} from './Configure.container';
import { NotificationItem } from '../../actions/actions';
import { IKeyboard } from '../../services/hid/Hid';
import Footer from '../common/footer/Footer.container';
import { Button, CssBaseline } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const APPLICATION_NAME = 'Remap';

type OwnProps = {};
type ConfigureProps = OwnProps &
  Partial<ConfigureStateType> &
  Partial<ConfigureActionsType> &
  ProviderContext;

function Configure(props: ConfigureProps) {
  const [displayedNotificationIds, setDisplayedNotificationIds] = useState<
    string[]
  >([]);
  const [supportedBrowser, setSupportedBrowser] = useState<boolean>(true);

  const storeDisplayedNotification = (key: string) => {
    setDisplayedNotificationIds([...displayedNotificationIds, key]);
  };

  const removeDisplayedNotification = (key: string) => {
    setDisplayedNotificationIds([
      ...displayedNotificationIds.filter((k) => key !== k),
    ]);
  };

  const updateNotifications = () => {
    props.notifications!.forEach((item: NotificationItem) => {
      if (displayedNotificationIds.includes(item.key)) return;

      const snackbarOptions: OptionsObject = {
        key: item.key,
        variant: item.type,
        onExited: (event, key: React.ReactText) => {
          props.removeNotification!(key as string);
          removeDisplayedNotification(key as string);
        },
        // eslint-disable-next-line react/display-name
        action: (key: SnackbarKey) => (
          <Button
            onClick={() => {
              props.closeSnackbar(key);
            }}
          >
            <CloseIcon />
          </Button>
        ),
      };

      if (item.type === 'success' || item.type === 'info') {
        snackbarOptions.autoHideDuration = 3000;
        snackbarOptions.persist = false;
      } else {
        snackbarOptions.persist = true;
      }

      props.enqueueSnackbar(item.message, snackbarOptions);
      storeDisplayedNotification(item.key);
    });
  };

  const updateTitle = () => {
    const hasKeysToFlush = props.remaps!.reduce((has, v) => {
      return 0 < Object.values(v).length || has;
    }, false);
    const title = hasKeysToFlush ? `*${APPLICATION_NAME}` : APPLICATION_NAME;
    props.updateTitle!(title);
  };

  const initKeyboardConnectionEventHandler = () => {
    props.hid!.instance.setConnectionEventHandler({
      connect: (connectedKeyboard: IKeyboard) => {
        props.onConnectKeyboard!(connectedKeyboard);
      },
      disconnect: (disconnectedKeyboard: IKeyboard) => {
        props.onDisconnectKeyboard!(disconnectedKeyboard, props.keyboard!);
      },
      close: (keyboard: IKeyboard) => {
        props.onCloseKeyboard!(keyboard);
      },
    });
  };

  useEffect(() => {
    props.initializeMeta!();
    if ((navigator as any).hid === undefined) {
      setSupportedBrowser(false);
      return;
    }
    props.initAppPackage!(APPLICATION_NAME, String(props.buildNumber!));

    if (props.auth) {
      props.auth.subscribeAuthStatus((user) => {
        props.updateSignedIn!(!!user);
      });
    }

    updateTitle();
    updateNotifications();
    initKeyboardConnectionEventHandler();
    props.updateAuthorizedKeyboardList!();
  }, []);

  useEffect(() => {
    updateTitle();
    updateNotifications();

    if (props.testMatrix) {
      // Ignore all key event when TEST MATRIX MODE
      window.onkeydown = (e: any) => {
        e.preventDefault();
      };
      window.onkeyup = (e: any) => {
        e.preventDefault();
      };
    } else {
      window.onkeydown = null;
      window.onkeyup = null;
    }
  });

  if (!supportedBrowser) {
    return (
      <React.Fragment>
        <CssBaseline />

        <Header />
        <main>
          <UnsupportedBrowser />
        </main>
        <Footer />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <div className="configure-root">
        <CssBaseline />
        <Header />
        <main>
          <Content />
        </main>
        {(props.draggingKey || props.testMatrix) && (
          <div className="dragMask fill-blank"></div>
        )}
        <Footer />
      </div>
    </React.Fragment>
  );
}

export default withSnackbar(Configure);

function UnsupportedBrowser() {
  return (
    <div className="message-box-wrapper">
      <div className="message-box">
        <h1>Unsupported Web Browser</h1>
        <p>
          <a href="https://remap-keys.app">Remap</a> works on Web Browsers which
          the <a href="https://wicg.github.io/webhid/">WebHID API</a> is
          supported.
          <br />
          For example, <a href="https://www.google.com/chrome">
            Google Chrome
          </a>{' '}
          version 89 or later supports the WebHID API.
        </p>
        <p style={{ color: 'red' }}>
          *
          <a
            href="https://developer.chrome.com/origintrials/#/view_trial/1074108511127863297"
            target="_blank"
            rel="noreferrer"
          >
            Trial for WebHID on Google Chrome (ver. 86-88)
          </a>{' '}
          has been completed. Please use the version 89 of Google Chrome stable
          which will be{' '}
          <a
            href="https://www.chromestatus.com/features/schedule"
            target="_blank"
            rel="noreferrer"
          >
            released on March 2nd
          </a>
          , or use the version 89 or higher of
          <a
            href="https://www.google.com/chrome/beta/"
            target="_blank"
            rel="noreferrer"
          >
            Google Chrome beta
          </a>{' '}
          or{' '}
          <a
            href="https://www.google.com/chrome/canary/"
            target="_blank"
            rel="noreferrer"
          >
            Google Chrome Canary
          </a>
          .
        </p>
      </div>
    </div>
  );
}
