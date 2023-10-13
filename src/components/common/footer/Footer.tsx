import React from 'react';
import { FooterActionsType, FooterStateType } from './Footer.container';
import './Footer.scss';
import moment from 'moment-timezone';
import PaidIcon from '@mui/icons-material/Paid';

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
        <div className="footer-dev-team">
          ©{' '}
          <span className="footer-dev-team-years">
            2020-{moment().format('YYYY')}
          </span>
          <a
            href="https://github.com/remap-keys"
            target={'_blank'}
            rel={'noreferrer'}
          >
            Remap team
          </a>
        </div>
        <div className="footer-contents">
          <div className="footer-content">
            <a href="https://qmk018.remap-keys.app">Remap for QMK 0.18</a>
          </div>
          <div className="footer-content">
            <a href="/docs/terms_of_use">Terms of Use</a>
          </div>
          <div className="footer-content">
            <a href="/docs/review_policy">Review Policy</a>
          </div>
          <div className="footer-content">
            <a href="/docs/faq">FAQ</a>
          </div>
          <div className="footer-content">
            <a
              href="https://discord.gg/uf7v5DruMB"
              target={'_blank'}
              rel={'noreferrer'}
            >
              User Community
            </a>
          </div>
          <div className="footer-content">
            <a
              href="https://github.com/sponsors/yoichiro"
              target={'_blank'}
              rel={'noreferrer'}
            >
              <PaidIcon sx={{ fontSize: '1rem' }} color="success" />
              Donate
            </a>
          </div>
        </div>
        <div className="footer-contents-mobile">
          <span className="footer-content">
            <a href="/docs">Resources</a>
          </span>
          <div className="footer-content">
            <a
              href="https://github.com/sponsors/yoichiro"
              target={'_blank'}
              rel={'noreferrer'}
            >
              <PaidIcon sx={{ fontSize: '1rem' }} color="success" />
              Donate
            </a>
          </div>
        </div>
        <div className="app-version">Build: {this.props.buildNumber}</div>
      </footer>
    );
  }
}
