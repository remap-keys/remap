import React from 'react';
import './Configure.scss';
import Header from './header/Header.container';
import Content from './content/Content.container';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  ConfigureActionsType,
  ConfigureStateType,
} from './Configure.container';
import appPackage from '../../package.alias.json';

type OwnProps = {};
type ConfigureProps = OwnProps &
  Partial<ConfigureStateType> &
  Partial<ConfigureActionsType>;
export default class Configure extends React.Component<ConfigureProps, {}> {
  constructor(props: ConfigureProps) {
    super(props);
  }
  componentDidMount() {
    const version = appPackage.version;
    const name = appPackage.name;
    this.props.initAppPackage!(name, version);
    this.props.updateAuthorizedKeyboardList!();
  }
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        <main>
          <Content />
        </main>
      </React.Fragment>
    );
  }
}
