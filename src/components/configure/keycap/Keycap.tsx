import React from 'react';
import './Keycap.scss';

export const KEY_SIZE = 54;

const keysizes = ['0.5u', '1u', '1.5u', '2u', '4u'] as const;
type KeySize = typeof keysizes[number];

const keyStyle: { [key: string]: string } = {
  '0.5u': 'key-05u',
  '1u': 'key-1u',
  '1.5u': 'key-15u',
  '2u': 'key-2u',
  '4u': 'key-4u',
};

type OnClickKeycap = (index: number) => void;

interface IKeycapProps {
  index: number;
  labels: string[][];
  size: KeySize;
  selected?: boolean;
  style?: React.CSSProperties;
  onClick?: OnClickKeycap;
}

export default class Keycap extends React.Component<IKeycapProps, {}> {
  constructor(props: IKeycapProps | Readonly<IKeycapProps>) {
    super(props);
  }

  render() {
    return (
      <div
        className={[
          'keycap',
          keyStyle[this.props.size],
          this.props.selected ? 'keycap-selected' : '',
        ].join(' ')}
        style={this.props.style}
        onClick={this.props.onClick?.bind(this, this.props.index)}
      >
        <div className="keybase">
          <div className="keyroof">
            <div className="keylabel">
              <div className="label left top">{this.props.labels[0][0]}</div>
              <div className="label center">{this.props.labels[0][1]}</div>
              <div className="label right">{this.props.labels[0][2]}</div>
            </div>
            <div className="keylabel">
              <div className="label left">{this.props.labels[1][0]}</div>
              <div className="label center">{this.props.labels[1][1]}</div>
              <div className="label right">{this.props.labels[1][2]}</div>
            </div>
            <div className="keylabel">
              <div className="label left">{this.props.labels[2][0]}</div>
              <div className="label center">{this.props.labels[2][1]}</div>
              <div className="label right">{this.props.labels[2][2]}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
