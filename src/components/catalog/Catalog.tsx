import React, { useEffect, useState } from 'react';
import { Button, CssBaseline } from '@mui/material';
import Header from './header/Header.container';
import Content from './content/Content.container';
import { OptionsObject, ProviderContext, withSnackbar } from 'notistack';
import { CatalogActionsType, CatalogStateType } from './Catalog.container';
import { NotificationItem } from '../../actions/actions';
import CloseIcon from '@mui/icons-material/Close';
import * as qs from 'qs';
import { useLocation, useParams } from 'react-router-dom';
import { isError } from '../../services/storage/Storage';
import { isAuthenticatedUserBySocialLogin } from '../../utils/AuthUtils';

type ICatalogDetailMode = 'introduction' | 'keymap' | 'firmware' | 'build';

type ParamsType = {
  definitionId: string;
};
type OwnProps = {
  catalogDetailMode?: ICatalogDetailMode;
};
type CatalogProps = OwnProps &
  Partial<CatalogStateType> &
  Partial<CatalogActionsType> &
  ProviderContext;

function Catalog(props: CatalogProps) {
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

  const params = useParams<ParamsType>();
  const location = useLocation();

  useEffect(() => {
    props.initializeMeta!();

    props.auth!.subscribeAuthStatus(async (user) => {
      // If `user` is null, signed in as an anonymous user.
      // Otherwise, if the user is signed in as an anonymous user,
      // update the signed in status to false. Else, update the signed in status
      // to true, because the user is signed in as a Google user or a GitHub user.
      if (user === null) {
        const result = await props.auth!.signInAsAnonymousUser();
        if (isError(result)) {
          console.error(result.error);
          throw new Error(result.error);
        }
        props.updateSignedIn!(false);
        // Return here because this event handler will be call again
        // according to the user's sign in status.
        return;
      }
      props.updateSignedIn!(isAuthenticatedUserBySocialLogin(user));
    });

    updateNotifications();
    if (props.catalogDetailMode === 'introduction') {
      const definitionId = params.definitionId!;
      props.updateKeyboard!(definitionId, 'introduction');
    } else if (props.catalogDetailMode === 'keymap') {
      const definitionId = params.definitionId!;
      props.updateKeyboard!(definitionId, 'keymap');
      const queryParams = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });
      const keymapId: string = queryParams.id as string;
      if (keymapId) {
        props.applySharedKeymap!(definitionId, keymapId);
      }
    } else if (props.catalogDetailMode === 'firmware') {
      const definitionId = params.definitionId!;
      props.updateKeyboard!(definitionId, 'firmware');
    } else if (props.catalogDetailMode === 'build') {
      const definitionId = params.definitionId!;
      props.updateKeyboard!(definitionId, 'build');
    } else {
      const queryParams = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });
      props.updateSearchCondition!(queryParams);
      props.init!();
    }
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

export default withSnackbar(Catalog);
