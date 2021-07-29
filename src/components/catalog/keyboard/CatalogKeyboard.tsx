import './CatalogKeyboard.scss';
import React from 'react';
import {
  CatalogKeyboardActionsType,
  CatalogKeyboardStateType,
} from './CatalogKeyboard.container';
import CatalogIntroduction from './CatalogIntroduction.container';
import CatalogKeymap from './CatalogKeymap.container';

type CatalogKeyboardState = {};
type OwnProps = {};
type CatalogKeyboardProps = OwnProps &
  Partial<CatalogKeyboardActionsType> &
  Partial<CatalogKeyboardStateType>;

export default class CatalogKeyboard extends React.Component<
  CatalogKeyboardProps,
  CatalogKeyboardState
> {
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
  }

  render() {
    if (this.props.phase === 'introduction') {
      return <CatalogIntroduction />;
    } else if (this.props.phase === 'keymap') {
      return <CatalogKeymap />;
    } else {
      throw new Error(`Invalid phase: ${this.props.phase}`);
    }
  }
}
