import React from 'react';
import './Content.scss';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Keycodes from '../keycodes/Keycodes.container';
import Keymap from '../keymap/Keymap';
import { ContentActionsType, ContentStateType } from './Content.container';
import { Device } from '../../../actions/actions';
import NoKeyboard from '../nokeyboard/NoKeyboard';
import KeyboardList from '../keyboardlist/KeyboardList.container';

type ContentState = {
  selectedLayer: number;
};

type OwnProps = {};

type ContentProps = OwnProps &
  Partial<ContentActionsType> &
  Partial<ContentStateType>;

export default class Content extends React.Component<
  ContentProps,
  ContentState
> {
  constructor(props: ContentProps | Readonly<ContentProps>) {
    super(props);
    this.state = {
      //TODO: redux
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
        {Number.isNaN(this.props.openedDeviceId) ? (
          ''
        ) : (
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
        )}
        <div className="keymap">
          <ConnectedKeyboard
            openedDeviceId={this.props.openedDeviceId!}
            devices={this.props.devices || {}}
          />
        </div>
        <div className="keycode">
          <Keycodes />
          {Number.isNaN(this.props.openedDeviceId) ? (
            <div className="disable"></div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

type ConnectedKeyboardProps = {
  openedDeviceId: number;
  devices: { [id: number]: Device };
};
function ConnectedKeyboard(props: ConnectedKeyboardProps) {
  if (Number.isNaN(props.openedDeviceId)) {
    if (0 < Object.entries(props.devices).length) {
      return <KeyboardList />;
    } else {
      return <NoKeyboard />;
    }
  } else {
    return <Keymap />;
  }
}
