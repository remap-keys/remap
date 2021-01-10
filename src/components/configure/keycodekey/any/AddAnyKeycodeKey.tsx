import React from 'react';
import { AnyKey } from '../KeycodeKey';
import AnyKeyDialog from './AnyKeyEditDialog';
import {
  KeycodeAddKeyActionsType,
  KeycodeAddKeyStateType,
} from './AddAnyKeycodeKey.container';
import '../KeycodeKey.scss';

type KeycodeAddKeyOwnState = {
  openDialog: boolean;
};

export type KeycodeAddKeyOwnProps = {};

export type KeycodeAddKeyProps = KeycodeAddKeyOwnProps &
  Partial<KeycodeAddKeyActionsType> &
  Partial<KeycodeAddKeyStateType>;

export default class KeycodeAddKey extends React.Component<
  KeycodeAddKeyProps,
  KeycodeAddKeyOwnState
> {
  constructor(props: KeycodeAddKeyProps | Readonly<KeycodeAddKeyProps>) {
    super(props);
    this.state = {
      openDialog: false,
    };
  }

  private closeDialog() {
    console.log('closeDialog');
    this.setState({ openDialog: false });
  }

  private openDialog() {
    this.setState({ openDialog: true });
  }

  render() {
    return (
      <React.Fragment>
        <div
          className={['keycodekey', 'clickable', 'addkey'].join(' ')}
          onClick={this.openDialog.bind(this)}
        >
          <div className="code-label">+</div>
        </div>
        <AnyKeyDialog
          open={this.state.openDialog}
          title="Create a new key"
          labelOk="Create"
          value={{ label: 'Any', code: 0 }}
          onClickCancel={this.closeDialog.bind(this)}
          onClickOk={(key: AnyKey) => {
            console.log(key);
            this.props.addAnyKey!(key);
            this.closeDialog();
          }}
        />
      </React.Fragment>
    );
  }
}
