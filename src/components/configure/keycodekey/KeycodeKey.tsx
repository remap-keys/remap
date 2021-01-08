import React from 'react';
import {
  Key,
  KeycodeKeyActionsType,
  KeycodeKeyStateType,
} from './KeycodeKey.container';
import './KeycodeKey.scss';

type KeycodeKeyOwnState = {
  dragging: boolean;
};

export type KeycodeKeyOwnProps = {
  value: Key;
  draggable: boolean;
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
  private hoverKey = (value: Key | null) => {
    this.props.hoverKey && this.props.hoverKey(value);
  };

  private clickKey = (value: Key) => {
    this.props.clickKey && this.props.clickKey(value);
  };

  private startDraggingKeycode = (value: Key) => {
    this.props.startDraggingKeycode && this.props.startDraggingKeycode(value);
  };

  private endDraggingKeycode = () => {
    this.props.endDraggingKeycode && this.props.endDraggingKeycode();
  };
  render() {
    return (
      <div
        className={[
          'keycodekey',
          this.props.selected && 'selected',
          this.props.clickable && 'clickable',
          this.props.draggable && 'grabbable',
          this.state.dragging && 'dragging',
        ].join(' ')}
        onMouseEnter={this.hoverKey.bind(this, this.props.value)}
        onMouseLeave={this.hoverKey.bind(this, null)}
        onClick={this.clickKey.bind(this, this.props.value)}
        draggable={this.props.draggable}
        onDragStart={() => {
          this.setState({ dragging: true });
          this.startDraggingKeycode(this.props.value);
        }}
        onDragEnd={() => {
          this.setState({ dragging: false });
          this.endDraggingKeycode();
        }}
      >
        {this.props.value.meta && (
          <div className="code-label">{this.props.value.meta}</div>
        )}
        <div className="code-label">{this.props.value.label}</div>
      </div>
    );
  }
}
