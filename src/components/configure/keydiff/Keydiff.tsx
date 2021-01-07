import React from 'react';
import './Keydiff.scss';
import { Button } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

import Keycap from '../keycap/Keycap.container';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { KeydiffActionsType, KeydiffStateType } from './Keydiff.container';

const CANCEL_BTN_WIDTH = 93.469;

type KeydiffOwnProps = {};

type KeydiffProps = KeydiffOwnProps &
  Partial<KeydiffStateType> &
  Partial<KeydiffActionsType>;

export default class Keydiff extends React.Component<KeydiffProps, {}> {
  constructor(props: KeydiffProps | Readonly<KeydiffProps>) {
    super(props);
  }
  render() {
    if (!this.props.origin || !this.props.destination) {
      return <div className="diff"></div>;
    }

    const origHeight = Number(this.props.origin.style.height) || 0;
    const destHeight = Number(this.props.destination.style.height) || 0;

    const width = Math.max(
      this.props.origin.maxWidth,
      this.props.destination.maxWidth
    );
    const height = Math.max(
      this.props.origin.maxHeight,
      this.props.destination.maxHeight
    );

    const origTop = (height - origHeight) / 2;
    const destTop = (height - destHeight) / 2;
    const origKeyBaseStyle: CSSProperties = {
      width: width + CANCEL_BTN_WIDTH,
      height: height,
    };
    const destKeyBaseStyle: CSSProperties = { width: width, height: height };
    const origKeyPostionStyle: CSSProperties = {
      position: 'absolute',
      left: width + CANCEL_BTN_WIDTH - width,
      top: origTop,
    };
    const destKeyPostionStyle: CSSProperties = {
      position: 'absolute',
      top: destTop,
    };
    const maxHeight: number = height;

    return (
      <div className="diff" style={{ height: maxHeight }}>
        <div className="diff-frame">
          <div className="key-orig" style={origKeyBaseStyle}>
            <div style={origKeyPostionStyle}>
              <Keycap
                index={0}
                labels={[
                  [this.props.origin.label, '', ''],
                  ['', '', ''],
                  ['', '', ''],
                ]}
                model={this.props.origin}
                style={this.props.origin.styleAbsolute}
                style2={
                  this.props.origin.isOddly
                    ? this.props.origin.styleAbsolute2
                    : undefined
                }
              />
            </div>
          </div>
          <div className="arrow">&gt;</div>
          <div className="key-dest" style={destKeyBaseStyle}>
            <div style={destKeyPostionStyle}>
              <Keycap
                index={1}
                labels={[
                  [this.props.destination.label, '', ''],
                  ['', '', ''],
                  ['', '', ''],
                ]}
                model={this.props.destination}
                style={this.props.destination.styleAbsolute}
                style2={
                  this.props.destination.isOddly
                    ? this.props.destination.styleAbsolute2
                    : undefined
                }
              />
            </div>
          </div>
          <div className="cancel-button">
            <Button
              size="small"
              color="secondary"
              startIcon={<Clear />}
              onClick={this.props.onClickCancel?.bind(
                this,
                this.props.selectedLayer!,
                this.props.destination!.pos
              )}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
