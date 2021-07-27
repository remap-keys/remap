import React, { useState } from 'react';
import {
  getGitHubUserDisplayName,
  getGitHubUserName,
  IKeyboardDefinitionDocument,
} from '../../../services/storage/Storage';
import {
  Avatar,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { Home, Store } from '@material-ui/icons';
import './CatalogKeyboardHeader.scss';

type CategoryHeaderProps = {
  definitionDocument: IKeyboardDefinitionDocument;
};

export const CatalogKeyboardHeader = ({
  definitionDocument,
}: CategoryHeaderProps) => {
  const [
    storesMenuAnchorEl,
    setStoresMenuAnchorEl,
  ] = useState<HTMLElement | null>(null);

  const onClickStoresMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setStoresMenuAnchorEl(event.currentTarget);
  };

  const onCloseStoresMenu = () => {
    setStoresMenuAnchorEl(null);
  };

  return (
    <header className="catalog-keyboard-header">
      <div className="catalog-keyboard-header-title">
        <Typography variant="h1">{definitionDocument.name}</Typography>
        <Typography variant="subtitle1">
          designed by{' '}
          <a
            href={definitionDocument.githubUrl}
            target="_blank"
            rel="noreferrer"
            title="Keyboard Owner GitHub Account"
          >
            {getGitHubUserDisplayName(definitionDocument)}
          </a>
        </Typography>
      </div>
      <div className="catalog-keyboard-header-links">
        <div className="catalog-keyboard-header-links-github">
          <a
            href={definitionDocument.githubUrl}
            target="_blank"
            rel="noreferrer"
            title="Keyboard Owner GitHub Account"
          >
            <Avatar
              alt={getGitHubUserDisplayName(definitionDocument)}
              src={`https://avatars.githubusercontent.com/${getGitHubUserName(
                definitionDocument
              )}`}
            />
          </a>
        </div>
        {definitionDocument.stores.length > 0 ? (
          <div className="catalog-keyboard-header-links-stores">
            <IconButton
              aria-controls="stores-menu"
              aria-haspopup={true}
              title="Stores"
              onClick={onClickStoresMenu}
            >
              <Store htmlColor="white" fontSize="large" />
            </IconButton>
            <Menu
              id="stores-menu"
              anchorEl={storesMenuAnchorEl}
              keepMounted
              open={Boolean(storesMenuAnchorEl)}
              onClose={onCloseStoresMenu}
            >
              {definitionDocument.stores.map((store, index) => {
                return (
                  <MenuItem key={index}>
                    <Link href={store.url} target="_blank" rel="noreferrer">
                      {store.name}
                    </Link>
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
        ) : null}
        {definitionDocument.websiteUrl ? (
          <div className="catalog-keyboard-header-links-home">
            <a
              href={definitionDocument.websiteUrl}
              target="_blank"
              rel="noreferrer"
              title="Keyboard Website"
            >
              <Home htmlColor="white" fontSize="large" />
            </a>
          </div>
        ) : null}
      </div>
    </header>
  );
};
