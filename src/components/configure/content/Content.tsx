import React from 'react';
import './Content.scss';
import Keycodes from '../keycodes/Keycodes.container';
import Keymap from '../keymap/Keymap';
import { ContentActionsType, ContentStateType } from './Content.container';
import NoKeyboard from '../nokeyboard/NoKeyboard';
import KeyboardList from '../keyboardlist/KeyboardList.container';
import { IKeyboard, IKeymap } from '../../../services/hid/hid';
import { CircularProgress } from '@material-ui/core';
import { ISetupPhase, SetupPhase } from '../../../store/state';
import KeyboardDefinitionForm from '../keyboarddefform/KeyboardDefinitionForm.container';
import KEY_DESCRIPTIONS from '../../../assets/files/key_descriptions';
import { hexadecimal } from '../../../utils/StringUtils';

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
        {this.props.hoverKey && <Desc keymap={this.props.hoverKey.keymap} />}
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
      return <KeyboardList />;
    case SetupPhase.fetchingKeyboardDefinition:
    case SetupPhase.waitingKeyboardDefinitionUpload:
      return <KeyboardDefinitionForm />;
    case SetupPhase.openedKeyboard:
      return <Keymap />;
    default:
      throw new Error(
        `Unknown state.app.setupPhase value: ${props.setupPhase}`
      );
  }
}

type DescType = {
  keymap: IKeymap;
};
function Desc(props: DescType) {
  if (props.keymap.keycodeInfo) {
    const info = props.keymap.keycodeInfo!;
    const long = info.name.long;
    const desc =
      long in KEY_DESCRIPTIONS
        ? KEY_DESCRIPTIONS[long]
        : hexadecimal(info.code);
    return (
      <div className="keycode-desc">
        {long}: {desc}
      </div>
    );
  } else {
    return <div className="keycode-desc">Any</div>;
  }
}
