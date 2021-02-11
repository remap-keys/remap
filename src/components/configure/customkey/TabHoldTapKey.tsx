/* eslint-disable no-undef */
import React from 'react';
import './TabHoldTapKey.scss';
import AutocompleteKeys from './AutocompleteKeys';
import { KeycodeList } from '../../../services/hid/KeycodeList';
import { IKeymap } from '../../../services/hid/Hid';
import {
  KeycodeCompositionFactory,
  LayerTapComposition,
  ModTapComposition,
  SwapHandsComposition,
} from '../../../services/hid/Composition';

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

export default class TabHoldTapKey extends React.Component<OwnProps, OwnState> {
  private holdKeyOptions: IKeymap[];
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);

    this.state = {
      tapKeycodeOptions: [...KeycodeList.basicKeymaps],
    };

    this.holdKeyOptions = [
      ...ModTapComposition.genKeymaps(),
      ...LayerTapComposition.genKeymaps(this.props.layerCount),
      ...SwapHandsComposition.genKeymaps(),
    ];
  }

  static isAvailable(code: number): boolean {
    const f = new KeycodeCompositionFactory(code);
    return (
      f.isModTap() ||
      f.isLayerTap() ||
      (f.isSwapHands() && !SwapHandsComposition.isSwapHandsOptions(code))
    );
  }

  static genHoldTapKeys(code: number): { holdKey: IKeymap; tapKey: IKeymap } {
    const f = new KeycodeCompositionFactory(code);
    let holdKey: IKeymap | null = null;
    let tapKey: IKeymap | null = null;
    if (f.isModTap()) {
      const comp = f.createModTapComposition();
      holdKey = comp.genKeymap();
      tapKey = comp.genTapKey();
    } else if (f.isLayerTap()) {
      const comp = f.createLayerTapComposition();
      holdKey = comp.genKeymap();
      tapKey = comp.genTapKey();
    } else if (
      f.isSwapHands() &&
      !SwapHandsComposition.isSwapHandsOptions(code)
    ) {
      const comp = f.createSwapHandsComposition();
      holdKey = comp.genKeymap();
      tapKey = comp.genTapKey();
    } else {
      throw new Error(`NOT available code(${code}) in Hold/Tap tab`);
    }

    return { holdKey, tapKey };
  }

  get tapKeycodeOptions(): IKeymap[] {
    const holdKey: IKeymap | null = this.props.holdKey;
    if (holdKey == null) {
      return [];
    }
    const kinds = holdKey.kinds;
    if (kinds.includes('layer_tap') || kinds.includes('swap_hands')) {
      return this.state.tapKeycodeOptions.filter((op) => {
        return !op.kinds.includes('layer_mod');
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
    if (this.props.holdKey?.kinds[0] === holdKey.kinds[0]) {
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
          showKinds={false}
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
