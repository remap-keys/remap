import React from 'react';
import { ContentActionsType } from '../../configure/content/Content.container';
import Footer from '../../footer/Footer';
import { ContentStateType } from './Content.container';
import './Content.scss';

type ContentState = {};
type OwnProps = {};
type ContentProps = OwnProps &
  Partial<ContentActionsType> &
  Partial<ContentStateType>;

export default class Content extends React.Component<
  ContentProps,
  ContentState
> {
  constructor(props: ContentProps | Readonly<ContentProps>) {
    super(props);
  }

  render() {
    return (
      <div className="content">
        <div>Content</div>
        <Footer />
      </div>
    );
  }
}
