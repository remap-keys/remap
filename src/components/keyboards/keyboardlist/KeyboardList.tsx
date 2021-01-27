import './KeyboardList.scss';
import React from 'react';
import {
  KeyboardListActionsType,
  KeyboardListStateType,
} from './KeyboardList.container';
import { Button } from '@material-ui/core';
import KeyboardRow from './keyboardrow/KeyboardRow';

type KeyboardListState = {};
type OwnProps = {};
type KeyboardListProps = OwnProps &
  Partial<KeyboardListActionsType> &
  Partial<KeyboardListStateType>;

export default class KeyboardList extends React.Component<
  KeyboardListProps,
  KeyboardListState
> {
  constructor(props: KeyboardListProps | Readonly<KeyboardListProps>) {
    super(props);
  }

  handleCreateButtonClick = () => {
    this.props.createKeyboard!();
  };

  render() {
    return (
      <div className="keyboard-list-wrapper">
        <div className="keyboard-list">
          {this.props.keyboardDefinitionDocuments!.map((doc, index) => (
            <div key={index} className="keyboard">
              <KeyboardRow doc={doc} />
            </div>
          ))}
        </div>
        <div className="keyboard-list-buttons">
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleCreateButtonClick}
          >
            +Keyboard
          </Button>
        </div>
      </div>
    );
  }
}
