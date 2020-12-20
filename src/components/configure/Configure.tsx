import React from 'react';
import './Configure.scss';
import Header from './header/Header';
import Content from './content/Content';
import CssBaseline from '@material-ui/core/CssBaseline';

export default class Configure extends React.Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Header
          connected={true}
          keyboardName="Lunakey Mini"
          productId={0x0001}
          vendorId={0x5954}
        />
        <main>
          <Content />
        </main>
      </React.Fragment>
    );
  }
}
