/* eslint-disable no-undef */
import React from 'react';
import './HoldTapKey.scss';
import AutocompleteKeys from './AutocompleteKeys';
import { KeycodeList } from '../../../services/hid/KeycodeList';
import { IKeymap } from '../../../services/hid/Hid';

type OwnProps = {
  holdKey: IKeymap | null;
  tapKey: IKeymap | null;
  layerCount: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (hold: IKeymap | null, tap: IKeymap | null) => void;
};

type OwnState = {
  tapKeycodeOptions: IKeymap[];
};

export default class HoldTapKey extends React.Component<OwnProps, OwnState> {
  private holdKeyOptions: IKeymap[];
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);

    this.state = {
      tapKeycodeOptions: [...KeycodeList.basicKeymaps],
    };

    this.holdKeyOptions = [
      ...KeycodeList.getModTapKeymaps(),
      ...KeycodeList.getHoldLayerKeymaps(this.props.layerCount),
      KeycodeList.getSwapHandsKeyOptionKeymap(),
    ];
  }

  get tapKeycodeOptions(): IKeymap[] {
    const holdKey: IKeymap | null = this.props.holdKey;
    if (holdKey == null) {
      return [];
    }
    const category = holdKey.categories[0];
    if (category === 'Hold-Layer' || category === 'Swap-Hands') {
      return this.state.tapKeycodeOptions.filter((op) => {
        return op.categories[0] != 'Layer-Mod';
      });
    }

    return this.state.tapKeycodeOptions;
  }

  private emitOnChange(holdKey: IKeymap | null, tapKey: IKeymap | null) {
    if (holdKey === null) {
      this.props.onChange(null, null);
      return;
    }
    const holdKeymap = JSON.parse(JSON.stringify(holdKey));
    const tapKeymap = JSON.parse(JSON.stringify(tapKey));
    this.props.onChange(holdKeymap, tapKeymap);
  }

  private onChangeHoldKey(holdKey: IKeymap | null) {
    if (holdKey === null) {
      this.emitOnChange(null, null);
      return;
    }
    // if same type of the HOLD, use its keycode/layer
    if (this.props.holdKey?.categories[0] === holdKey.categories[0]) {
      this.emitOnChange(holdKey, this.props.tapKey);
    } else {
      this.emitOnChange(holdKey, null);
    }
  }

  private onChangeTapKey(tapKey: IKeymap | null) {
    if (tapKey) {
      this.emitOnChange(this.props.holdKey!, tapKey);
    }
  }

  render() {
    return (
      <React.Fragment>
        <AutocompleteKeys
          label="Hold"
          showCategory={false}
          keycodeOptions={this.holdKeyOptions}
          keycodeInfo={this.props.holdKey}
          onChange={(opt) => {
            this.onChangeHoldKey(opt);
          }}
        />
        <div className="holdkey-desc">{this.props.holdKey?.desc || ''}</div>

        <AutocompleteKeys
          disabled={this.props.holdKey === null}
          label="Tap"
          keycodeOptions={this.tapKeycodeOptions}
          keycodeInfo={this.props.tapKey}
          onChange={(opt) => {
            this.onChangeTapKey(opt);
          }}
        />
      </React.Fragment>
    );
  }
}
