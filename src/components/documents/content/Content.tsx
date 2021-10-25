import React from 'react';
import { ContentActionsType, ContentStateType } from './Content.container';
import ReviewPolicy from '../ReviewPolicy/ReviewPolicy';
import TermsOfUse from '../TermsOfUse/TermsOfUse';

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
    const page = this.props.page;
    console.log(page);
    if (page) {
      switch (page) {
        case 'review_policy':
          return <ReviewPolicy />;
        case 'terms_of_use':
          return <TermsOfUse />;
      }
    } else {
      return null;
    }
  }
}
