import React from 'react';
import { Device } from '../../../actions/actions';
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
          {Object.keys(this.props.devices!).map((key) => {
            const id = Number(key);
            const device: Device = this.props.devices![id];
            return (
              <div
                key={id}
                className="keyboard-item"
                onClick={this.props.onClickItem!.bind(this, id)}
              >
                <h3>{device.productName}</h3>
                <div className="device-ids">
                  VID: {hexadecimal(device.vendorId, 4)} / PID:{' '}
                  {hexadecimal(device.productId, 4)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
