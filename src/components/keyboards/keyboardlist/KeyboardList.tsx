import './KeyboardList.scss';
import React from 'react';
import {
  KeyboardListActionsType,
  KeyboardListStateType,
} from './KeyboardList.container';
import { IKeyboardDefinitionDocument } from '../../../services/storage/Storage';
import { Card, CardContent, Chip, Typography } from '@material-ui/core';

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

  render() {
    return (
      <div className="keyboard-list-wrapper">
        <div className="keyboard-list">
          {this.props.keyboardDefinitionDocuments!.map((doc, index) => (
            <Keyboard key={index} doc={doc} />
          ))}
        </div>
      </div>
    );
  }
}

type KeyboardProps = {
  doc: IKeyboardDefinitionDocument;
};

function Keyboard(props: KeyboardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{props.doc.name}</Typography>
        <Chip label={props.doc.status} size="small" />
      </CardContent>
    </Card>
  );
}
