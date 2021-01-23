import React from 'react';
import './Header.scss';
import logo from '../../../assets/images/logo.png';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { RouteComponentProps, withRouter } from 'react-router-dom';

type HeaderState = {};
type OwnProps = {};
type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType> &
  RouteComponentProps;

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps | Readonly<HeaderProps>) {
    super(props);
  }

  render() {
    return (
      <header className="header">
        <img
          src={logo}
          alt="logo"
          className="logo"
          onClick={() => this.props.history.push('/')}
        />
      </header>
    );
  }
}

export default withRouter(Header);
