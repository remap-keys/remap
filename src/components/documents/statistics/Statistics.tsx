import React from 'react';
import { Typography } from '@mui/material';
import StatisticsImage from '../../../assets/images/documents/statistics.png';

export default function Statistics() {
  return (
    <React.Fragment>
      <Typography variant="h3">The statistics feature is available</Typography>
      <section>
        <Typography variant="body1" gutterBottom={true}>
          All keyboard owners can see the statistics of their keyboards. The
          statistics are displayed on the keyboard management page.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          Current supported statistics are:
          <ul>
            <li>
              The count of opened the keyboard configuration page in the last 90
              days.
            </li>
            <li>The count of flashed the keymap to MCU in the last 90 days.</li>
          </ul>
        </Typography>
        <img
          src={StatisticsImage}
          alt="Statistics on the Keyboard Management Page"
        />
        <Typography variant="body1" gutterBottom={true}>
          Notice that this statistics will be shown after logs are collected by
          enough users because of avoiding a privacy issue.
        </Typography>
      </section>
    </React.Fragment>
  );
}
