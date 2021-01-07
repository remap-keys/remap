import React from 'react';
import './Keymap.scss';
import Keyboards from '../keyboards/Keyboards.container';
import Keydiff from '../keydiff/Keydiff';

//import kbdConfig from '../../../assets/files/lunakey-mini.json';
import kbdConfig from '../../../assets/files/lunakey-mini-test.json';
//import kbdConfig from '../../../assets/files/iso60.json';

export default class Keymap extends React.Component {
  render() {
    return (
      <React.Fragment>
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
