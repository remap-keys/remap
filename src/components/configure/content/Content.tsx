import React from 'react';
import './Content.scss';
import { ContentActionsType, ContentStateType } from './Content.container';
import KeyboardList from '../keyboardlist/KeyboardList.container';
import { ISetupPhase, SetupPhase } from '../../../store/state';
import KeyboardDefinitionForm from '../keyboarddefform/KeyboardDefinitionForm.container';
import Remap from '../remap/Remap.container';
import { CircularProgress } from '@material-ui/core';
import Footer from '../../footer/Footer.container';

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
        <Contents setupPhase={this.props.setupPhase!} />
        <Footer />
      </div>
    );
  }
}

type ContentsProps = {
  setupPhase: ISetupPhase;
};
function Contents(props: ContentsProps) {
  switch (props.setupPhase) {
    case SetupPhase.keyboardNotSelected:
      return <KeyboardList />;
    case SetupPhase.init:
    case SetupPhase.connectingKeyboard:
    case SetupPhase.openingKeyboard:
    case SetupPhase.fetchingKeyboardDefinition:
      return <PhaseProcessing setupPhase={props.setupPhase} />;
    case SetupPhase.waitingKeyboardDefinitionUpload:
      return <KeyboardDefinitionForm />;
    case SetupPhase.openedKeyboard:
      return <Remap />;
    default:
      throw new Error(
        `Unknown state.app.setupPhase value: ${props.setupPhase}`
      );
  }
}

type PhasePropsType = {
  setupPhase: ISetupPhase;
};
function PhaseProcessing(props: PhasePropsType) {
  let label = 'Processing...';
  switch (props.setupPhase) {
    case SetupPhase.connectingKeyboard:
      label = 'Connecting';
      break;
    case SetupPhase.openingKeyboard:
      label = 'Opening keyboard';
      break;
    case SetupPhase.fetchingKeyboardDefinition:
      label = 'Fetching keyboard definition';
      break;
  }

  return (
    <div className="phase-processing-wrapper">
      <div>
        <CircularProgress size={24}></CircularProgress>
      </div>
      <div>{label}</div>
    </div>
  );
}
