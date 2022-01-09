import './CatalogKeyboard.scss';
import React, { useEffect } from 'react';
import {
  CatalogKeyboardActionsType,
  CatalogKeyboardStateType,
} from './CatalogKeyboard.container';
import CatalogIntroduction from './introduction/CatalogIntroduction.container';
import CatalogKeymap from './keymap/CatalogKeymap.container';
import { matchPath } from 'react-router-dom';
import * as qs from 'qs';
import CatalogFirmware from './firmware/CatalogFirmware.container';

type CatalogKeyboardState = {};
type OwnProps = {};
type CatalogKeyboardProps = OwnProps &
  Partial<CatalogKeyboardActionsType> &
  Partial<CatalogKeyboardStateType>;

export default function CatalogKeyboard(props: CatalogKeyboardProps) {
  useEffect(() => {
    if (props.definitionDocument) {
      const originalDescription = props.definitionDocument.description || '';
      let shortDescription = originalDescription.slice(0, 120);
      if (originalDescription.length !== shortDescription.length) {
        shortDescription = `${shortDescription}...`;
      }
      props.updateMeta!({
        title: `${props.definitionDocument.name} - Remap`,
        description: shortDescription,
        url: `https://remap-keys.app/catalog/${props.definitionDocument.id}`,
        image: props.definitionDocument.imageUrl,
      });
    } else {
      props.initializeMeta!();
    }
    unregisterHistoryCallback = props.history!.listen((location, action) => {
      if (action === 'POP') {
        const introductionMatch = matchPath(location.pathname, {
          path: '/catalog/:definitionId',
          exact: true,
          strict: true,
        });
        if (introductionMatch) {
          props.goToIntroduction!();
          return;
        }
        const keymapMatch = matchPath<{ definitionId: string }>(
          location.pathname,
          {
            path: '/catalog/:definitionId/keymap',
            exact: true,
            strict: true,
          }
        );
        if (keymapMatch) {
          props.goToKeymap!();
          if (location.search) {
            const queryParams = qs.parse(location.search, {
              ignoreQueryPrefix: true,
            });
            if (queryParams.id) {
              props.applySharedKeymap!(
                keymapMatch.params.definitionId,
                queryParams.id as string
              );
            }
          }
          return;
        }
        const firmwareMatch = matchPath<{ definitionId: string }>(
          location.pathname,
          {
            path: '/catalog/:definitionId/firmware',
            exact: true,
            strict: true,
          }
        );
        if (firmwareMatch) {
          props.goToFirmware!();
          return;
        }
      }
    });
  });
}

export default class CatalogKeyboard extends React.Component<
  CatalogKeyboardProps,
  CatalogKeyboardState
> {
  private unregisterHistoryCallback: any;

  constructor(props: CatalogKeyboardProps | Readonly<CatalogKeyboardProps>) {
    super(props);
  }

  componentDidMount() {}

  componentWillUnmount() {
    unregisterHistoryCallback && unregisterHistoryCallback();
  }

  render() {
    if (props.phase === 'introduction') {
      return <CatalogIntroduction />;
    } else if (props.phase === 'keymap') {
      return <CatalogKeymap />;
    } else if (props.phase === 'firmware') {
      return <CatalogFirmware />;
    } else {
      throw new Error(`Invalid phase: ${props.phase}`);
    }
  }
}
