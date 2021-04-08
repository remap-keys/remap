import React from 'react';
import {
  CatalogSearchActionsType,
  CatalogSearchStateType,
} from './CatalogSearch.container';
import './CatalogSearch.scss';

type CatalogSearchState = {};
type OwnProps = {};
type CatalogSearchProps = OwnProps &
  Partial<CatalogSearchActionsType> &
  Partial<CatalogSearchStateType>;

export default class CatalogSearch extends React.Component<
  CatalogSearchProps,
  CatalogSearchState
> {
  render() {
    return (
      <div className="catalog-search-wrapper">
        <div className="catalog-search-container">
          <div>Catalog Search</div>
        </div>
      </div>
    );
  }
}
