import React, { useEffect, useState } from 'react';
import { Button, CssBaseline } from '@mui/material';
import Header from './header/Header.container';
import Content from './content/Content.container';
import { ProviderContext, withSnackbar } from 'notistack';
import { CatalogActionsType, CatalogStateType } from './Catalog.container';
import { NotificationItem } from '../../actions/actions';
import CloseIcon from '@mui/icons-material/Close';
import * as qs from 'qs';
import { useLocation, useParams } from 'react-router-dom';

type ICatalogDetailMode = 'introduction' | 'keymap' | 'firmware';

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
  const location = useLocation();

  useEffect(() => {
    props.initializeMeta!();
    if (props.auth) {
      props.auth.subscribeAuthStatus((user) => {
        props.updateSignedIn!(!!user);
      });
    }

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
