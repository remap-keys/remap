import React, { useState } from 'react';
import {
  getGitHubUserDisplayName,
  getGitHubUserName,
  IKeyboardDefinitionDocument,
  IOrganization,
} from '../../../services/storage/Storage';
import {
  Avatar,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { Home, Store } from '@mui/icons-material';
import './CatalogKeyboardHeader.scss';

type CategoryHeaderProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  organization: IOrganization | null;
};

export const CatalogKeyboardHeader = ({
  definitionDocument,
  organization,
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

  const designerName =
    !definitionDocument.authorType ||
    definitionDocument.authorType === 'individual'
      ? getGitHubUserDisplayName(definitionDocument)
      : organization!.name;
  const designerWebsiteUrl =
    !definitionDocument.authorType ||
    definitionDocument.authorType === 'individual'
      ? definitionDocument.githubUrl
      : organization!.website_url;
  const designerIconImageUrl =
    !definitionDocument.authorType ||
    definitionDocument.authorType === 'individual'
      ? `https://avatars.githubusercontent.com/${getGitHubUserName(
          definitionDocument
        )}`
      : organization!.icon_image_url;

  return (
    <header className="catalog-keyboard-header">
      <div className="catalog-keyboard-header-title">
        <Typography variant="h1">{definitionDocument.name}</Typography>
        <Typography variant="subtitle1">
          designed by{' '}
          <a
            href={designerWebsiteUrl}
            target="_blank"
            rel="noreferrer"
            title="Keyboard Owner"
          >
            {designerName}
          </a>
        </Typography>
      </div>
      <div className="catalog-keyboard-header-links">
        <div className="catalog-keyboard-header-links-github">
          <a
            href={designerWebsiteUrl}
            target="_blank"
            rel="noreferrer"
            title="Keyboard Owner"
          >
            <Avatar alt={designerName} src={designerIconImageUrl} />
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
