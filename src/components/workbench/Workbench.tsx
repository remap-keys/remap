import React, { useEffect, useState } from 'react';
import {
  WorkbenchActionsType,
  WorkbenchStateType,
} from './Workbench.container';
import {
  OptionsObject,
  ProviderContext,
  SnackbarKey,
  withSnackbar,
} from 'notistack';
import { NotificationItem } from '../../actions/actions';
import { Button, CssBaseline } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Header from './header/Header';
import Content from './content/Content.container';
import {
  getGitHubProviderData,
  getGoogleProviderData,
} from '../../services/auth/Auth';

type OwnProps = {};
type WorkbenchProps = OwnProps &
  Partial<WorkbenchStateType> &
  Partial<WorkbenchActionsType> &
  ProviderContext;

function Workbench(props: WorkbenchProps) {
  const [displayedNotificationIds, setDisplayedNotificationIds] = useState<
    string[]
  >([]);

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
              // eslint-disable-next-line react/prop-types
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

  useEffect(() => {
    props.initializeMeta!();
    props.auth!.subscribeAuthStatus((user) => {
      console.log(user);
      if (user) {
        if (getGitHubProviderData(user).exists) {
          props.updateSignedIn!(true);
        } else if (getGoogleProviderData(user).exists) {
          props.updateSignedIn!(true);
        } else {
          throw new Error('Unknown provider');
        }
        props.initializeWorkbench!();
      } else {
        // TODO: Handle unsigned in state.
      }
    });
    updateNotifications();

    props.initializeWorkbench!();
  }, []);

  useEffect(() => {
    updateNotifications();
  }, [props.notifications]);

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

export default withSnackbar(Workbench);
