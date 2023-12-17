import React from 'react';
import {
  StatisticsActionsType,
  StatisticsStateType,
} from './Statistics.container';
import './Statistics.scss';
import { Card } from '@mui/material';

type OwnProps = {};
type StatisticsProps = OwnProps &
  Partial<StatisticsActionsType> &
  Partial<StatisticsStateType>;

export default function Statistics(props: StatisticsProps) {
  return (
    <div className="edit-definition-statistics-container">
      <Card variant="outlined"></Card>
      <Card variant="outlined"></Card>
    </div>
  );
}
