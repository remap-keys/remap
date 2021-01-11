import React from 'react';
import './Keydiff.scss';
import { Button } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { KeydiffActionsType, KeydiffStateType } from './Keydiff.container';
import { IKeymap } from '../../../services/hid/hid';
import KeycodeKey, { genKey } from '../keycodekey/KeycodeKey.container';

type KeydiffOwnProps = {};

type KeydiffProps = KeydiffOwnProps &
  Partial<KeydiffStateType> &
  Partial<KeydiffActionsType>;

export default class Keydiff extends React.Component<KeydiffProps, {}> {
  constructor(props: KeydiffProps | Readonly<KeydiffProps>) {
    super(props);
  }
  render() {
    const origin: IKeymap | null = this.props.keydiff!.origin;
    const destination: IKeymap | null = this.props.keydiff!.destination;
    if (!origin || !destination) {
      return <div className="diff"></div>;
    }
    const origKey = genKey(origin);
    const dstKey = genKey(destination);

    return (
      <div className="diff">
        <div className="diff-frame">
          <div className="spacer"></div>
          <div className="key-orig">
            <KeycodeKey value={origKey!} draggable={false} />
          </div>
          <div className="arrow">&gt;</div>
          <div className="key-dest">
            <KeycodeKey value={dstKey!} draggable={false} />
          </div>
          <div className="cancel-button">
            <Button
              size="small"
              color="secondary"
              startIcon={<Clear />}
              onClick={this.props.onClickCancel?.bind(
                this,
                this.props.selectedLayer!,
                this.props.selectedPos!
              )}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
