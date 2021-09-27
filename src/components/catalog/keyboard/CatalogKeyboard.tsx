import './CatalogKeyboard.scss';
import React from 'react';
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

export default class CatalogKeyboard extends React.Component<
  CatalogKeyboardProps,
  CatalogKeyboardState
> {
  private unregisterHistoryCallback: any;

  constructor(props: CatalogKeyboardProps | Readonly<CatalogKeyboardProps>) {
    super(props);
  }

  componentDidMount() {
    if (this.props.definitionDocument) {
      const originalDescription =
        this.props.definitionDocument.description || '';
      let shortDescription = originalDescription.slice(0, 120);
      if (originalDescription.length !== shortDescription.length) {
        shortDescription = `${shortDescription}...`;
      }
      this.props.updateMeta!({
        title: `${this.props.definitionDocument.name} - Remap`,
        description: shortDescription,
        url: `https://remap-keys.app/catalog/${this.props.definitionDocument.id}`,
        image: this.props.definitionDocument.imageUrl,
      });
    } else {
      this.props.initializeMeta!();
    }
    this.unregisterHistoryCallback = this.props.history!.listen(
      (location, action) => {
        if (action === 'POP') {
          const introductionMatch = matchPath(location.pathname, {
            path: '/catalog/:definitionId',
            exact: true,
            strict: true,
          });
          if (introductionMatch) {
            this.props.goToIntroduction!();
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
            this.props.goToKeymap!();
            if (location.search) {
              const queryParams = qs.parse(location.search, {
                ignoreQueryPrefix: true,
              });
              if (queryParams.id) {
                this.props.applySharedKeymap!(
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
            this.props.goToFirmware!();
            return;
          }
        }
      }
    );
  }

  componentWillUnmount() {
    this.unregisterHistoryCallback && this.unregisterHistoryCallback();
  }

  render() {
    if (this.props.phase === 'introduction') {
      return <CatalogIntroduction />;
    } else if (this.props.phase === 'keymap') {
      return <CatalogKeymap />;
    } else if (this.props.phase === 'firmware') {
      return <CatalogFirmware />;
    } else {
      throw new Error(`Invalid phase: ${this.props.phase}`);
    }
  }
}
