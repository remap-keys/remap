import React from 'react';
import './Keydiff.scss';
import { Button } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { KeydiffActionsType, KeydiffStateType } from './Keydiff.container';
import { IKeymap } from '../../../services/hid/Hid';
import KeycodeKey from '../keycodekey/KeycodeKey.container';
import { genKey, Key } from '../keycodekey/KeyGen';
import KeyModel from '../../../models/KeyModel';
import { t } from 'i18next';

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
      return <></>;
    }
    const labelLang = this.props.labelLang!;
    const origKey: Key = genKey(origin, labelLang);
    const dstKey: Key = genKey(destination, labelLang);

    const isEncoder = KeyModel.isEncoder(this.props.selectedEncoderId!);

    return (
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
            onClick={
              isEncoder
                ? this.props.onClickCancelForEncoder!.bind(
                    this,
                    this.props.selectedLayer!,
                    this.props.selectedEncoderId!,
                    this.props.selectedKeySwitchOperation!
                  )
                : this.props.onClickCancel!.bind(
                    this,
                    this.props.selectedLayer!,
                    this.props.selectedPos!
                  )
            }
          >
            {t('Cancel')}
          </Button>
        </div>
      </div>
    );
  }
}
