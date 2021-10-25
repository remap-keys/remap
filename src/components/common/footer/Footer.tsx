import React from 'react';
import { FooterActionsType, FooterStateType } from './Footer.container';
import './Footer.scss';
import moment from 'moment-timezone';

type FooterState = {};

type OwnProps = {};
type FooterPropsType = OwnProps &
  Partial<FooterActionsType> &
  Partial<FooterStateType>;

export default class Footer extends React.Component<
  FooterPropsType,
  FooterState
> {
  constructor(props: FooterPropsType | Readonly<FooterPropsType>) {
    super(props);
  }
  render() {
    return (
      <footer className="footer">
        <div className="dev-team">
          ©2020-{moment().format('YYYY')}{' '}
          <a
            href="https://github.com/remap-keys"
            target={'_blank'}
            rel={'noreferrer'}
          >
            Remap team.
          </a>
        </div>
        <div className="footer-contents">
          <span className="footer-content">
            <a href="/docs/terms_of_use">Terms of Use</a>
          </span>
          <span className="footer-content">
            <a href="/docs/review_policy">Review Policy</a>
          </span>
          <span className="footer-content">
            <a
              href="https://discord.gg/uf7v5DruMB"
              target={'_blank'}
              rel={'noreferrer'}
            >
              User Community
            </a>
          </span>
        </div>
        <div className="app-version">Build: {this.props.buildNumber}</div>
      </footer>
    );
  }
}
