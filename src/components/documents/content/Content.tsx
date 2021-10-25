import React from 'react';
import { ContentActionsType, ContentStateType } from './Content.container';
import ReviewPolicy from '../ReviewPolicy/ReviewPolicy';
import TermsOfUse from '../TermsOfUse/TermsOfUse';

type ContentState = {};
type OwnProps = { page: string | null };
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
    switch (this.props.page) {
      case 'review_policy':
        return <ReviewPolicy />;
      case 'terms_of_use':
        return <TermsOfUse />;
      default:
        location.href = '/';
        return null;
    }
  }
}
