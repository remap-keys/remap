import React from 'react';
import './Keydiff.scss';
import { Button } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

import Keycap from '../keycap/Keycap';

export default class Keydiff extends React.Component {
  render() {
    return (
      <div className="diff">
        <div className="diff-blank"></div>
        <div className="diff-frame">
          <Keycap
            index={0}
            labels={[
              ['', '', ''],
              ['', '', ''],
              ['caps lock', '', ''],
            ]}
            size="2u"
          />
          <div className="arrow">&gt;</div>
          <Keycap
            index={1}
            labels={[
              ['', '', ''],
              ['', 'Esc', ''],
              ['', '', ''],
            ]}
            size="1u"
          />
          <div className="cancel-button">
            <Button size="small" color="secondary" startIcon={<Clear />}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
