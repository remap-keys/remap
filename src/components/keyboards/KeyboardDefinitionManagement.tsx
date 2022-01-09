import React, { useEffect } from 'react';
import {
  KeyboardDefinitionManagementActionsType,
  KeyboardDefinitionManagementStateType,
} from './KeyboardDefinitionManagement.container';
import { ProviderContext, withSnackbar } from 'notistack';
import { NotificationItem } from '../../actions/actions';
import { Button, CssBaseline } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Header from './header/Header.container';
import Content from './content/Content.container';
import { getGitHubProviderData } from '../../services/auth/Auth';
import { useParams } from 'react-router-dom';

type ParamsType = {
  definitionId: string;
};
type OwnProps = {};
type KeyboardDefinitionManagementProps = OwnProps &
  Partial<KeyboardDefinitionManagementStateType> &
  Partial<KeyboardDefinitionManagementActionsType> &
  ProviderContext;
type OwnState = {};

let displayedNotificationIds: string[] = [];

function KeyboardDefinitionManagement(
  props: KeyboardDefinitionManagementProps
) {
  const storeDisplayedNotification = (key: string) => {
    displayedNotificationIds = [...displayedNotificationIds, key];
  };

  const removeDisplayedNotification = (key: string) => {
    displayedNotificationIds = [
      ...displayedNotificationIds.filter((k) => key !== k),
    ];
  };

  const updateNotifications = () => {
    props.notifications!.forEach((item: NotificationItem) => {
      if (displayedNotificationIds.includes(item.key)) return;

      props.enqueueSnackbar(item.message, {
        key: item.key,
        variant: item.type,
        autoHideDuration: 5000,
        onExited: (event, key: React.ReactText) => {
          props.removeNotification!(key as string);
          removeDisplayedNotification(key as string);
        },
        action: (key: number) => (
          <Button
            onClick={() => {
              props.closeSnackbar(key);
            }}
          >
            <CloseIcon />
          </Button>
        ),
      });
      storeDisplayedNotification(item.key);
    });
  };

  const params = useParams<ParamsType>();

  useEffect(() => {
    props.initializeMeta!();
    props.auth!.subscribeAuthStatus((user) => {
      if (user) {
        if (getGitHubProviderData(user).exists) {
          props.startInitializing!();
          updateNotifications();
          const definitionId = params.definitionId;
          if (definitionId) {
            props.updateKeyboard!(definitionId);
          } else {
            props.updateKeyboards!();
          }
        } else {
          props.auth!.linkToGitHub().then(() => {
            // N/A
          });
        }
      } else {
        if (props.phase !== 'signout') {
          props.auth!.signInWithGitHub().then(() => {
            // N/A
          });
        }
      }
    });
  });

  if (props.phase !== 'signing') {
    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        <main>
          <Content />
        </main>
      </React.Fragment>
    );
  } else {
    return null;
  }
}

export default withSnackbar(KeyboardDefinitionManagement);
