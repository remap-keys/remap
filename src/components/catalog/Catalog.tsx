import React from 'react';
import { Button, CssBaseline } from '@material-ui/core';
import Header from './header/Header.container';
import Content from './content/Content.container';
import { ProviderContext, withSnackbar } from 'notistack';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { CatalogActionsType, CatalogStateType } from './Catalog.container';
import { NotificationItem } from '../../actions/actions';
import CloseIcon from '@material-ui/icons/Close';

type ParamsType = {
  definitionId: string;
};
type OwnProps = {};
type CatalogProps = OwnProps &
  Partial<CatalogStateType> &
  Partial<CatalogActionsType> &
  ProviderContext &
  RouteComponentProps<ParamsType>;
type OwnState = {};

class Catalog extends React.Component<CatalogProps, OwnState> {
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
    this.updateNotifications();
    const definitionId = this.props.match.params.definitionId;
    if (definitionId) {
      this.props.updateKeyboard!(definitionId);
    } else {
      this.props.init!();
    }
  }

  componentDidUpdate() {
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

export default withSnackbar(withRouter(Catalog));
