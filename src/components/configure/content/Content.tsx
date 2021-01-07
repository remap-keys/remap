import React from 'react';
import './Content.scss';
import Keycodes from '../keycodes/Keycodes.container';
import Keymap from '../keymap/Keymap';
import { ContentActionsType, ContentStateType } from './Content.container';
import NoKeyboard from '../nokeyboard/NoKeyboard';
import KeyboardList from '../keyboardlist/KeyboardList.container';
import { IKeyboard } from '../../../services/hid/hid';
import { CircularProgress } from '@material-ui/core';
import { ISetupPhase, SetupPhase } from '../../../store/state';

type ContentState = {
  selectedLayer: number;
};

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
    this.state = {
      //TODO: redux
      selectedLayer: 1,
    };
  }

  get selectedLayer() {
    return this.state.selectedLayer;
  }

  onClickLayer = (layer: number) => {
    this.setState({ selectedLayer: layer });
  };

  render() {
    return (
      <div className="content">
        <div className="keyboard-wrapper">
          {[
            SetupPhase.connectingKeyboard,
            SetupPhase.fetchingKeyboardDefinition,
            SetupPhase.openingKeyboard,
          ].includes(this.props.setupPhase!) && (
            <div className="in-progress">
              <div className="progress">
                <CircularProgress size={24} />
              </div>
            </div>
          )}

          <div className="keymap">
            <ConnectedKeyboard
              keyboards={this.props.keyboards || []}
              setupPhase={this.props.setupPhase!}
            />
          </div>
        </div>
        <div className="keycode">
          <Keycodes />
          {this.props.setupPhase === SetupPhase.openedKeyboard ? (
            ''
          ) : (
            <div className="disable"></div>
          )}
        </div>
      </div>
    );
  }
}

type ConnectedKeyboardProps = {
  keyboards: IKeyboard[];
  setupPhase: ISetupPhase;
};
function ConnectedKeyboard(props: ConnectedKeyboardProps) {
  switch (props.setupPhase) {
    case SetupPhase.keyboardNotSelected:
    case SetupPhase.connectingKeyboard:
    case SetupPhase.openingKeyboard:
      if (0 < props.keyboards.length) {
        return <KeyboardList />;
      } else {
        return <NoKeyboard />;
      }
    case SetupPhase.fetchingKeyboardDefinition:
    case SetupPhase.waitingKeyboardDefinitionUpload:
      // TODO: Create a form UI component.
      return <div>TODO: Keyboard Definition Upload Form</div>;
    case SetupPhase.openedKeyboard:
      return <Keymap />;
    default:
      throw new Error(
        `Unknown state.app.setupPhase value: ${props.setupPhase}`
      );
  }
}
