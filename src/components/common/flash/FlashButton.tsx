/* eslint-disable no-undef */
import React from 'react';
import './FlashButton.scss';

type FlashState = {};

type FlashProps = {
  buttonState: FlashButtonState;
  duration: number;
  label: string;
  size: 'small' | 'medium' | 'large' | undefined;
  onClick: () => void;
};

export default class FlashButton extends React.Component<
  FlashProps,
  FlashState
> {
  constructor(props: FlashProps | Readonly<FlashProps>) {
    super(props);
    this.state = {};
  }

  private onClick() {
    this.props.onClick!();
  }

  render() {
    return (
      <div className="flash-button-wrapper">
        <button
          onClick={this.onClick.bind(this)}
          className={['flash-button', this.props.buttonState].join(' ')}
          disabled={this.props.buttonState != 'enable'}
        >
          {this.props.label}
        </button>
      </div>
    );
  }
}

const FlashButtonStates = ['disable', 'enable', 'flashing', 'success'] as const;
export type FlashButtonState = typeof FlashButtonStates[number];
