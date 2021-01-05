import React from 'react';
import './Keydiff.scss';
import { Button } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

import Keycap from '../keycap/Keycap.container';
import KeyModel from '../../../models/KeyModel';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

const CANCEL_BTN_WIDTH = 93.469;

interface IKeydiffProps {
  origin: KeyModel | null;
  destination: KeyModel | null;
}

export default class Keydiff extends React.Component<IKeydiffProps, {}> {
  private origKeyBaseStyle: CSSProperties;
  private destKeyBaseStyle: CSSProperties;
  private origKeyPostionStyle: CSSProperties;
  private destKeyPostionStyle: CSSProperties;
  private maxHeight: number;

  constructor(props: IKeydiffProps | Readonly<IKeydiffProps>) {
    super(props);
    if (this.props.origin && this.props.destination) {
      const origWidth = Number(this.props.origin.style.width) || 0;
      const destWidth = Number(this.props.destination.style.width) || 0;
      const origHeight = Number(this.props.origin.style.height) || 0;
      const destHeight = Number(this.props.destination.style.height) || 0;

      const width = Math.max(origWidth, destWidth);
      const height = Math.max(origHeight, destHeight);
      const origTop = (height - origHeight) / 2;
      const destTop = (height - destHeight) / 2;
      this.origKeyBaseStyle = {
        width: width + CANCEL_BTN_WIDTH,
        height: height,
      };
      this.destKeyBaseStyle = { width: width, height: height };
      this.origKeyPostionStyle = {
        position: 'absolute',
        left: width + CANCEL_BTN_WIDTH - origWidth,
        top: origTop,
      };
      this.destKeyPostionStyle = { position: 'absolute', top: destTop };
      this.maxHeight = height;
    } else {
      this.origKeyBaseStyle = {};
      this.destKeyBaseStyle = {};
      this.origKeyPostionStyle = {};
      this.destKeyPostionStyle = {};
      this.maxHeight = 0;
    }
  }
  render() {
    if (this.props.origin && this.props.destination) {
      return (
        <div className="diff" style={{ height: this.maxHeight }}>
          <div className="diff-frame">
            <div className="key-orig" style={this.origKeyBaseStyle}>
              <div style={this.origKeyPostionStyle}>
                <Keycap
                  index={0}
                  labels={[
                    ['', '', ''],
                    ['', this.props.origin.pos, ''],
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
            <div className="key-dest" style={this.destKeyBaseStyle}>
              <div style={this.destKeyPostionStyle}>
                <Keycap
                  index={1}
                  labels={[
                    ['', '', ''],
                    ['', this.props.destination.pos, ''],
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
              <Button size="small" color="secondary" startIcon={<Clear />}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      );
    } else {
      return <div className="diff"></div>;
    }
  }
}
