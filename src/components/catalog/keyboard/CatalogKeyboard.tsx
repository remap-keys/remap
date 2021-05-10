import './CatalogKeyboard.scss';
import React from 'react';
import {
  CatalogKeyboardActionsType,
  CatalogKeyboardStateType,
} from './CatalogKeyboard.container';

type CatalogKeyboardState = {};
type OwnProps = {};
type CatalogKeyboardProps = OwnProps &
  Partial<CatalogKeyboardActionsType> &
  Partial<CatalogKeyboardStateType>;

class CatalogKeyboard extends React.Component<
  CatalogKeyboardProps,
  CatalogKeyboardState
> {
  constructor(props: CatalogKeyboardProps | Readonly<CatalogKeyboardProps>) {
    super(props);
  }

  render() {
    return (
      <div className="catalog-keyboard-wrapper">
        <div className="catalog-keyboard-container">CatalogKeyboard</div>
      </div>
    );
  }
}

export default CatalogKeyboard;
