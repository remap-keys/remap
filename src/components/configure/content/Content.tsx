import React from 'react';
import './Content.scss';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import kbdConfig from '../../../asserts/files/lunakey-mini.json';
//import kbdConfig from '../../../asserts/files/lunakey-mini-test.json';
import Keydiff from '../keydiff/Keydiff';
import Keycodes from '../keycodes/Keycodes';
import Keyboards from '../keyboards/Keyboards';
import KeyModel from '../../../models/KeyModel';

interface IContentState {
  selectedLayer: number;
}

export default class Content extends React.Component<{}, IContentState> {
  private origKey = new KeyModel('@', 0, 0, 1, 1.5, '#cccccc', 30, 2, 3);
  private destKey = new KeyModel('Caps Lock', 0, 0, 2, 1, '#cccccc', -15, 3, 4);
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      selectedLayer: 1,
    };
  }

  get selectedLayer() {
    return this.state.selectedLayer;
  }

  onClickLayer = (layer: number) => {
    this.setState({ selectedLayer: layer });
  };

  render() {
    return (
      <div className="content">
        <div className="controller">
          <div className="switch">
            <Select
              id="keyboard-layout-switch"
              value={'Choc'}
              onChange={() => {}}
            >
              <MenuItem value="MX">MX</MenuItem>
              <MenuItem value="Choc">Choc</MenuItem>
            </Select>
          </div>
        </div>
        <div className="keymap">
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
        </div>
        <div className="keycode">
          <Keycodes />
        </div>
      </div>
    );
  }
}
