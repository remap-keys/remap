import React from 'react';
import './Keymap.scss';
import Keyboards from '../keyboards/Keyboards';
import Keydiff from '../keydiff/Keydiff';

//import kbdConfig from '../../../assets/files/lunakey-mini.json';
import kbdConfig from '../../../assets/files/lunakey-mini-test.json';
import KeyModel from '../../../models/KeyModel';
//import kbdConfig from '../../../assets/files/iso60.json';

export default class Keymap extends React.Component {
  private origKey = new KeyModel(
    'Enter',
    0,
    0,
    1.25,
    2,
    '#cccccc',
    30,
    2,
    3,
    -0.25,
    0,
    1.5,
    1
  );
  private destKey = new KeyModel('Caps Lock', 0, 0, 2, 1, '#cccccc', -15, 3, 4);
  render() {
    return (
      <React.Fragment>
        <div className="keydiff-wrapper">
          <div className="spacer"></div>
          <Keydiff origin={this.origKey} destination={this.destKey} />
          <div className="spacer"></div>
        </div>
        <div className="keyboards-wrapper">
          <div className="spacer"></div>
          <Keyboards config={kbdConfig} />
          <div className="balancer"></div>
          <div className="spacer"></div>
        </div>
      </React.Fragment>
    );
  }
}
