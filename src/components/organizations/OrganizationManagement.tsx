import {
  OrganizationManagementActionsType,
  OrganizationManagementStateType,
} from './OrganizationManagement.container';
import { ProviderContext, withSnackbar } from 'notistack';
import { NotificationItem } from '../../actions/actions';
import React, { useEffect, useState } from 'react';
import { Button, CssBaseline } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getGitHubProviderData } from '../../services/auth/Auth';
import Header from './header/Header.container';
import Content from './content/Content.container';
import { useParams } from 'react-router-dom';

type ParamsType = {
  organizationId: string;
};
type OwnProps = {};
type OrganizationManagementProps = OwnProps &
  Partial<OrganizationManagementStateType> &
  Partial<OrganizationManagementActionsType> &
  ProviderContext;

function OrganizationManagement(props: OrganizationManagementProps) {
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

      props.enqueueSnackbar(item.message, {
        key: item.key,
        variant: item.type,
        // autoHideDuration: 5000,
        persist: true,
        onExited: (event, key: React.ReactText) => {
          props.removeNotification!(key as string);
          removeDisplayedNotification(key as string);
        },
        // eslint-disable-next-line react/display-name
        action: (key: number) => (
          <Button
            onClick={() => {
              // eslint-disable-next-line react/prop-types
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
          const organizationId = params.organizationId;
          if (organizationId) {
            props.updateOrganization!(organizationId);
          } else {
            props.updateOrganizations!();
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
  }, []);

  useEffect(() => {
    updateNotifications();
  }, [props.notifications]);

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

export default withSnackbar(OrganizationManagement);
