import React from 'react';
import { IKeyboard } from '../../../services/hid/Hid';
import { hexadecimal } from '../../../utils/StringUtils';
import {
  KeyboardListActionsType,
  KeyboardListStateType,
} from './KeyboardList.container';
import './KeyboardList.scss';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import ForwardIcon from '@material-ui/icons/Forward';
import LaptopChromebookIcon from '@material-ui/icons/LaptopChromebook';

type OwnProps = {};
type KeyboardListProps = OwnProps &
  Partial<KeyboardListStateType> &
  Partial<KeyboardListActionsType>;

export default class KeyboardList extends React.Component<
  KeyboardListProps,
  {}
> {
  constructor(props: KeyboardListProps | Readonly<KeyboardListProps>) {
    super(props);
  }

  render() {
    return (
      <div className="keyboardlist-wrapper">
        <div className="message">
          Connect your keyboard supporting the VIA feature to this PC.
          <br />
          <KeyboardIcon fontSize="large" />
          <ForwardIcon fontSize="large" className="arrow-animation" />
          <LaptopChromebookIcon fontSize="large" />
          <br />
          Then, press the &quot;+KEYBOARD&quot; below.
        </div>
        <div className="keyboardlist">
          {this.props.keyboards!.map((kbd: IKeyboard, index: number) => {
            const info = kbd.getInformation();
            return (
              <div
                key={index}
                className="keyboard-item"
                onClick={this.props.onClickItem?.bind(this, kbd)}
              >
                <h3>{info.productName}</h3>
                <div className="device-ids">
                  VID: {hexadecimal(info.vendorId, 4)} / PID:{' '}
                  {hexadecimal(info.productId, 4)}
                </div>
              </div>
            );
          })}
          <div
            key={-1}
            className="keyboard-item"
            onClick={this.props.onClickConnectAnotherKeyboard!.bind(this)}
          >
            <h3 className="another">+ KEYBOARD</h3>
            <div className="device-ids">
              Add a Web HID access permitted device
            </div>
          </div>
        </div>
      </div>
    );
  }
}
