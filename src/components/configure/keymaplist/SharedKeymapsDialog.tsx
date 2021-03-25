/* eslint-disable no-undef */
import React from 'react';
import './SharedKeymapsDialog.scss';
import {
  SharedKeymapsDialogActionsType,
  SharedKeymapsDialogStateType,
} from './SharedKeymapsDialog.container';

type OwnProps = {};

type SharedKeymapsDialogProps = OwnProps &
  Partial<SharedKeymapsDialogActionsType> &
  Partial<SharedKeymapsDialogStateType>;

type OwnState = {};
export default class SharedKeymapsDialog extends React.Component<
  SharedKeymapsDialogProps,
  OwnState
> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {};
  }
}
