import React from 'react';
import { CssBaseline } from '@material-ui/core';
import Header from './header/Header.container';
import Content from './content/Content.container';
import { ProviderContext } from 'notistack';
import { RouteComponentProps } from 'react-router-dom';
import { CatalogActionsType, CatalogStateType } from './Catalog.container';

type ParamsType = {};
type OwnProps = {};
type CatalogProps = OwnProps &
  Partial<CatalogStateType> &
  Partial<CatalogActionsType> &
  ProviderContext &
  RouteComponentProps<ParamsType>;
type OwnState = {};

export default class Catalog extends React.Component<CatalogProps, OwnState> {
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
