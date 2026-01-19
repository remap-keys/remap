/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import './Configure.scss';
import {
  OptionsObject,
  ProviderContext,
  SnackbarKey,
  withSnackbar,
} from 'notistack';
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
import { UnsupportedBrowser } from '../common/unsupportedbrowser/UnsupportedBrowser';

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

  useEffect(() => {
    if (props.keyboard && props.autoTypingPracticeAfterConnection) {
      props.updateTypingPractice!(true);
      props.updateAutoTypingPracticeAfterConnection!(false);
    }
  }, [props.keyboard]);

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
