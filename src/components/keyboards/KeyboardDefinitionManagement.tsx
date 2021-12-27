import React from 'react';
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
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { getGitHubProviderData } from '../../services/auth/Auth';

type ParamsType = {
  definitionId: string;
};
type OwnProps = {};
type KeyboardDefinitionManagementProps = OwnProps &
  Partial<KeyboardDefinitionManagementStateType> &
  Partial<KeyboardDefinitionManagementActionsType> &
  ProviderContext &
  RouteComponentProps<ParamsType>;
type OwnState = {};

class KeyboardDefinitionManagement extends React.Component<
  KeyboardDefinitionManagementProps,
  OwnState
> {
  private displayedNotificationIds: string[] = [];

  private storeDisplayedNotification = (key: string) => {
    this.displayedNotificationIds = [...this.displayedNotificationIds, key];
  };

  private removeDisplayedNotification = (key: string) => {
    this.displayedNotificationIds = [
      ...this.displayedNotificationIds.filter((k) => key !== k),
    ];
  };

  private updateNotifications() {
    this.props.notifications!.forEach((item: NotificationItem) => {
      if (this.displayedNotificationIds.includes(item.key)) return;

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

  componentDidMount() {
    this.props.initializeMeta!();
    this.props.auth!.subscribeAuthStatus((user) => {
      if (user) {
        if (getGitHubProviderData(user).exists) {
          this.props.startInitializing!();
          this.updateNotifications();
          const definitionId = this.props.match.params.definitionId;
          if (definitionId) {
            this.props.updateKeyboard!(definitionId);
          } else {
            this.props.updateKeyboards!();
          }
        } else {
          this.props.auth!.linkToGitHub().then(() => {
            // N/A
          });
        }
      } else {
        if (this.props.phase !== 'signout') {
          this.props.auth!.signInWithGitHub().then(() => {
            // N/A
          });
        }
      }
    });
  }

  componentDidUpdate() {
    this.updateNotifications();
  }

  render() {
    if (this.props.phase !== 'signing') {
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
}

export default withSnackbar(withRouter(KeyboardDefinitionManagement));
