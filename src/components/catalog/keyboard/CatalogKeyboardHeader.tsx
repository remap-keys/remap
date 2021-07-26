import React from 'react';
import {
  getGitHubUserDisplayName,
  getGitHubUserName,
  IKeyboardDefinitionDocument,
} from '../../../services/storage/Storage';
import { Avatar, Typography } from '@material-ui/core';
import { Home } from '@material-ui/icons';
import './CatalogKeyboardHeader.scss';

type CategoryHeaderProps = {
  definitionDocument: IKeyboardDefinitionDocument;
};

export const CatalogKeyboardHeader = ({
  definitionDocument,
}: CategoryHeaderProps) => {
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
