import React from 'react';
import './Keymap.scss';
import Keyboards from '../keyboards/Keyboards.container';
import Keydiff from '../keydiff/Keydiff.container';

export default class Keymap extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="keydiff-wrapper">
          <div className="spacer"></div>
          <Keydiff />
          <div className="spacer"></div>
        </div>
        <div className="keyboards-wrapper">
          <div className="spacer"></div>
          <Keyboards />
          <div className="balancer"></div>
          <div className="spacer"></div>
        </div>
      </React.Fragment>
    );
  }
}
