import React from 'react';
import { Key } from '../keycodes/Keycodes.container';
import {
  KeycodeKeyActionsType,
  KeycodeKeyStateType,
} from './KeycodeKey.container';
import './KeycodeKey.scss';

type OwnProps = {
  value: Key;
};

export type KeycodeKeyProps = OwnProps &
  Partial<KeycodeKeyActionsType> &
  Partial<KeycodeKeyStateType>;

export default class KeycodeKey extends React.Component<KeycodeKeyProps, {}> {
  constructor(props: KeycodeKeyProps | Readonly<KeycodeKeyProps>) {
    super(props);
  }
  render() {
    return (
      <div
        className={[
          'keycodekey',
          this.props.selected ? 'selected' : '',
          this.props.clickable ? 'clickable' : '',
        ].join(' ')}
        onMouseEnter={this.props.hoverKey!.bind(this, this.props.value)}
        onMouseLeave={this.props.hoverKey!.bind(this, null)}
        onClick={this.props.clickKey!.bind(this, this.props.value)}
      >
        {this.props.value.meta ? (
          <div className="code-label">{this.props.value.meta}</div>
        ) : (
          ''
        )}
        <div className="code-label">{this.props.value.label}</div>
      </div>
    );
  }
}
