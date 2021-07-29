import React from 'react';
import { OGPActionsType, OGPStateType } from './OGP.container';
import { Helmet } from 'react-helmet-async';

type OGPState = {};

type OwnProps = {};
type OGPPropsType = OwnProps & Partial<OGPActionsType> & Partial<OGPStateType>;

export default class OGP extends React.Component<OGPPropsType, OGPState> {
  constructor(props: OGPPropsType | Readonly<OGPPropsType>) {
    super(props);
  }

  render() {
    return (
      <Helmet
        title={this.props.title}
        meta={[
          { property: 'og:title', content: this.props.og?.title },
          { name: 'description', content: this.props.description },
          { property: 'og:description', content: this.props.og?.description },
          { property: 'og:url', content: this.props.og!.url },
          { property: 'og:image', content: this.props.og!.image },
        ]}
      />
    );
  }
}
