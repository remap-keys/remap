import React from 'react';
import { Key } from '../keycodes/Keycodes';
import './KeycodeKey.scss';

type OnHoverCallback = (code: string) => void;
type OffHoverCallback = () => void;
type OnClick = (key: Key) => void;

interface ICodeProps {
  keycode: Key;
  clickable: boolean;
  selected: boolean;
  onHover: OnHoverCallback;
  offHover: OffHoverCallback;
  onClick: OnClick;
}

export default class KeycodeKey extends React.Component<ICodeProps, {}> {
  constructor(props: ICodeProps | Readonly<ICodeProps>) {
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
        onMouseEnter={this.props.onHover.bind(this, this.props.keycode.code)}
        onMouseLeave={this.props.offHover}
        onClick={this.props.onClick.bind(this, this.props.keycode)}
      >
        {this.props.keycode.meta ? (
          <div className="code-label">{this.props.keycode.meta}</div>
        ) : (
          ''
        )}
        <div className="code-label">{this.props.keycode.label}</div>
      </div>
    );
  }
}
