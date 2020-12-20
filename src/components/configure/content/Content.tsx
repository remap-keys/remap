import React from 'react';
import './Content.scss';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import lunakey from '../../../asserts/files/lunakey-mini.json';
import KeyboardModel from '../../../models/KeyboardModel';
import Keydiff from '../keydiff/Keydiff';
import Keycodes from '../keycodes/Keycodes';
import Keyboards from '../keyboards/Keyboards';

interface IContentState {
  selectedLayer: number;
  keyboard: KeyboardModel;
}

export default class Content extends React.Component<{}, IContentState> {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      selectedLayer: 1,
      keyboard: new KeyboardModel(lunakey.layouts.keymap),
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
            <Keydiff />
            <div className="spacer"></div>
          </div>
          <div className="keyboards-wrapper">
            <div className="spacer"></div>
            <Keyboards config={lunakey} />
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
