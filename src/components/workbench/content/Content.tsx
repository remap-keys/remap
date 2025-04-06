import React from 'react';
import { ContentActionsType, ContentStateType } from './Content.container';
import './Content.scss';
import { CircularProgress } from '@mui/material';
import Breadboard from '../breadboard/Breadboard.container';

type OwnProps = {};
type ContentProps = OwnProps &
  Partial<ContentActionsType> &
  Partial<ContentStateType>;

export default function Content(props: ContentProps | Readonly<ContentProps>) {
  const phase = props.phase!;
  switch (phase) {
    case 'init':
    case 'processing':
      return <PhaseProcessing />;
    case 'editing':
      return <Breadboard />;
    default:
      throw new Error(`Unknown state.workbench.app.phase value: ${phase}`);
  }
}
function PhaseProcessing() {
  return (
    <div className="workbench-processing-wrapper">
      <div>
        <CircularProgress size={24} />
      </div>
      <div>Processing...</div>
    </div>
  );
}
