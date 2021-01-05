import React from 'react';
import { Key } from '../keycodes/Keycodes.container';
import {
  KeycodeKeyActionsType,
  KeycodeKeyStateType,
} from './KeycodeKey.container';
import './KeycodeKey.scss';

type KeycodeKeyOwnState = {
  dragging: boolean;
};

export type KeycodeKeyOwnProps = {
  value: Key;
};

export type KeycodeKeyProps = KeycodeKeyOwnProps &
  Partial<KeycodeKeyActionsType> &
  Partial<KeycodeKeyStateType>;

export default class KeycodeKey extends React.Component<
  KeycodeKeyProps,
  KeycodeKeyOwnState
> {
  constructor(props: KeycodeKeyProps | Readonly<KeycodeKeyProps>) {
    super(props);
    this.state = {
      dragging: false,
    };
  }
  render() {
    return (
      <div
        className={[
          'keycodekey',
          this.props.selected && 'selected',
          this.props.clickable && 'clickable',
          this.state.dragging && 'dragging',
        ].join(' ')}
        onMouseEnter={this.props.hoverKey!.bind(this, this.props.value)}
        onMouseLeave={this.props.hoverKey!.bind(this, null)}
        onClick={this.props.clickKey!.bind(this, this.props.value)}
        draggable="true"
        onDragStart={() => {
          this.setState({ dragging: true });
          this.props.startDraggingKeycode!(this.props.value);
        }}
        onDragEnd={() => {
          this.setState({ dragging: false });
          this.props.endDraggingKeycode!();
        }}
      >
        {this.props.value.meta ? (
          <div className="code-label">{this.props.value.meta}</div>
        ) : (
          ''
        )}
        <div className="code-label">{this.props.value.label}</div>={' '}
      </div>
    );
  }
}
