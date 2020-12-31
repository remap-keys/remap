import React from 'react';
import './Configure.scss';
import Header from './header/Header.container';
import Content from './content/Content';
import CssBaseline from '@material-ui/core/CssBaseline';

export default class Configure extends React.Component {
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
