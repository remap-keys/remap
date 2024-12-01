import './CatalogKeyboard.scss';
import React, { useEffect } from 'react';
import {
  CatalogKeyboardActionsType,
  CatalogKeyboardStateType,
} from './CatalogKeyboard.container';
import CatalogIntroduction from './introduction/CatalogIntroduction.container';
import CatalogKeymap from './keymap/CatalogKeymap.container';
import CatalogFirmware from './firmware/CatalogFirmware.container';
import useLocationChange from '../../common/hooks/LocationChange';
import { matchPath, useNavigationType } from 'react-router';
import qs from 'qs';
import CatalogBuild from './build/CatalogBuild.container';

type OwnProps = {};
type CatalogKeyboardProps = OwnProps &
  Partial<CatalogKeyboardActionsType> &
  Partial<CatalogKeyboardStateType>;

export default function CatalogKeyboard(props: CatalogKeyboardProps) {
  const navigationType = useNavigationType();

  useLocationChange((location) => {
    if (navigationType === 'POP') {
      const introductionMatch = matchPath(
        { path: '/catalog/:definitionId' },
        location.pathname
      );
      if (introductionMatch) {
        props.goToIntroduction!();
        return;
      }
      const keymapMatch = matchPath(
        { path: '/catalog/:definitionId/keymap' },
        location.pathname
      );
      if (keymapMatch) {
        props.goToKeymap!();
        if (location.search) {
          const queryParams = qs.parse(location.search, {
            ignoreQueryPrefix: true,
          });
          if (queryParams.id) {
            props.applySharedKeymap!(
              keymapMatch.params.definitionId!,
              queryParams.id as string
            );
          }
        }
        return;
      }
      const firmwareMatch = matchPath(
        { path: '/catalog/:definitionId/firmware' },
        location.pathname
      );
      if (firmwareMatch) {
        props.goToFirmware!();
        return;
      }
      const buildMatch = matchPath(
        { path: '/catalog/:definitionId/build' },
        location.pathname
      );
      if (buildMatch) {
        props.goToBuild!();
        return;
      }
    }
  });

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
  }, []);

  if (props.phase === 'introduction') {
    return <CatalogIntroduction />;
  } else if (props.phase === 'keymap') {
    return <CatalogKeymap />;
  } else if (props.phase === 'firmware') {
    return <CatalogFirmware />;
  } else if (props.phase === 'build') {
    return <CatalogBuild />;
  } else {
    throw new Error(`Invalid phase: ${props.phase}`);
  }
}
