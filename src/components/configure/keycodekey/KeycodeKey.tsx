import React from 'react';
import './KeycodeKey.scss';

type OnHoverCallback = (code: string) => void;
type OffHoverCallback = () => void;

interface ICodeProps {
  code: string;
  label: string;
  meta: string;
  onHover: OnHoverCallback;
  offHover: OffHoverCallback;
}

export default class KeycodeKey extends React.Component<ICodeProps, {}> {
  constructor(props: ICodeProps | Readonly<ICodeProps>) {
    super(props);
  }
  render() {
    return (
      <div
        className="keycodekey"
        onMouseEnter={this.props.onHover.bind(this, this.props.code)}
        onMouseLeave={this.props.offHover}
      >
        {this.props.meta ? (
          <div className="code-label">{this.props.meta}</div>
        ) : (
          ''
        )}
        <div className="code-label">{this.props.label}</div>
      </div>
    );
  }
}
