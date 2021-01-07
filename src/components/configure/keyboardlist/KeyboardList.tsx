import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { IKeyboard } from '../../../services/hid/hid';
import { hexadecimal } from '../../../utils/StringUtils';
import {
  KeyboardListActionsType,
  KeyboardListStateType,
} from './KeyboardList.container';
import './KeyboardList.scss';

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
        <div className="message">Please select a keyboard</div>
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
            <h3 className="another">+ ANOTHER KEYBOARD</h3>
            <div className="device-ids">
              Please add a new Web HID access permitted device
            </div>
          </div>
        </div>
        {/* {this.props.openingKeyboard && (
          <div className="opening-keyboard">
            <div className="progress">
              <CircularProgress size={24} />
            </div>
          </div>
        )} */}
      </div>
    );
  }
}
