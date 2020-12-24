import React from 'react';
import './Keydiff.scss';
import { Button } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

import Keycap from '../keycap/Keycap';
import KeyModel from '../../../models/KeyModel';

interface IKeydiffProps {
  origin: KeyModel | null;
  destination: KeyModel | null;
}

interface IKeydiffState {
  maxKeyWidth: number;
}

export default class Keydiff extends React.Component<
  IKeydiffProps,
  IKeydiffState
> {
  constructor(props: IKeydiffProps | Readonly<IKeydiffProps>) {
    super(props);
    if (this.props.origin && this.props.destination) {
      const origWidth = Number(this.props.origin.style.width) || 0;
      const destWidth = Number(this.props.destination.style.width) || 0;
      this.state = {
        maxKeyWidth: Math.max(origWidth, destWidth + 93.469),
      };
    }
  }
  render() {
    if (this.props.origin && this.props.destination) {
      return (
        <div className="diff">
          <div className="diff-blank"></div>
          <div className="diff-frame">
            <div className="key-orig" style={{ width: this.state.maxKeyWidth }}>
              <Keycap
                index={0}
                labels={[
                  ['', '', ''],
                  ['', this.props.origin.label, ''],
                  ['', '', ''],
                ]}
                size="1u"
                style={this.props.origin.style}
              />
            </div>
            <div className="arrow">&gt;</div>
            <div className="key-dest" style={{ width: this.state.maxKeyWidth }}>
              <Keycap
                index={1}
                labels={[
                  ['', '', ''],
                  ['', this.props.destination.label, ''],
                  ['', '', ''],
                ]}
                size="1u"
                style={this.props.destination.style}
              />
              <div className="cancel-button">
                <Button size="small" color="secondary" startIcon={<Clear />}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div className="diff"></div>;
    }
  }
}
