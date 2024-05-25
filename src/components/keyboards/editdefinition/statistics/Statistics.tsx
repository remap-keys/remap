import React from 'react';
import {
  StatisticsActionsType,
  StatisticsStateType,
} from './Statistics.container';
import './Statistics.scss';
import { Card, CardContent, Typography } from '@mui/material';
import { Chart } from 'react-google-charts';

type OwnProps = {};
type StatisticsProps = OwnProps &
  Partial<StatisticsActionsType> &
  Partial<StatisticsStateType>;

export default function Statistics(props: StatisticsProps) {
  const data = props.statistics;

  return (
    <div className="edit-definition-statistics-container">
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">
            Counts of opening a keyboard per day
          </Typography>
          {data !== undefined && (
            <Chart
              chartType="LineChart"
              data={[
                ['Date', 'Weight'],
                ...data.statistics.counts_of_opening_keyboard.labels.map(
                  (label, index) => [
                    label,
                    data.statistics.counts_of_opening_keyboard.values[index],
                  ],
                ),
              ]}
              width="100%"
              height="300px"
              options={{
                legend: 'none',
              }}
            />
          )}
          <Typography
            variant="caption"
            sx={{ display: 'block', textAlign: 'right', mt: 2 }}
          >
            * This statistics will be shown after logs are collected by enough
            users because of avoiding a privacy issue.
          </Typography>
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6">
            Counts of flashing a keymap to MCU
          </Typography>
          {data !== undefined && (
            <Chart
              chartType="LineChart"
              data={[
                ['Date', 'Weight'],
                ...data.statistics.counts_of_flashing_keymap.labels.map(
                  (label, index) => [
                    label,
                    data.statistics.counts_of_flashing_keymap.values[index],
                  ],
                ),
              ]}
              width="100%"
              height="300px"
              options={{
                legend: 'none',
              }}
            />
          )}
          <Typography
            variant="caption"
            sx={{ display: 'block', textAlign: 'right', mt: 2 }}
          >
            * This statistics will be shown after logs are collected by enough
            users because of avoiding a privacy issue.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
