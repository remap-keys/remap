import React from 'react';
import { ContentActionsType } from '../../configure/content/Content.container';
import Footer from '../../footer/Footer';
import { ContentStateType } from './Content.container';
import './Content.scss';
import { IKeyboardsPhase, KeyboardsPhase } from '../../../store/state';
import { CircularProgress } from '@material-ui/core';
import KeyboardList from '../keyboardlist/KeyboardList.container';

type ContentState = {};
type OwnProps = {};
type ContentProps = OwnProps &
  Partial<ContentActionsType> &
  Partial<ContentStateType>;

export default class Content extends React.Component<
  ContentProps,
  ContentState
> {
  constructor(props: ContentProps | Readonly<ContentProps>) {
    super(props);
  }

  render() {
    return (
      <div className="content">
        <Contents phase={this.props.phase!} />
        <Footer />
      </div>
    );
  }
}

type ContentsProps = {
  phase: IKeyboardsPhase;
};
function Contents(props: ContentsProps) {
  switch (props.phase) {
    case KeyboardsPhase.init:
      return <PhaseProcessing phase={props.phase} />;
    case KeyboardsPhase.list:
      return <KeyboardList />;
    default:
      throw new Error(
        `Unknown state.keyboards.app.phase value: ${props.phase}`
      );
  }
}

type PhaseProps = {
  phase: IKeyboardsPhase;
};
function PhaseProcessing(props: PhaseProps) {
  let label = 'Processing...';
  // switch (props.phase) {
  //   case SetupPhase.fetchingKeyboardDefinition:
  //     label = 'Fetching keyboard definition';
  //     break;
  // }

  return (
    <div className="phase-processing-wrapper">
      <div>
        <CircularProgress size={24} />
      </div>
      <div>{label}</div>
    </div>
  );
}
