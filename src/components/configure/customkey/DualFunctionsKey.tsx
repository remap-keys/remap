/* eslint-disable no-undef */
import React from 'react';
import './DualFunctionsKey.scss';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import {
  IComposition,
  IMod,
  KeycodeCompositionFactory,
  LayerModComposition,
  LayerTapComposition,
  ModTapComposition,
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_RIGHT,
  MOD_SFT,
} from '../../../services/hid/Composition';
import { Key } from '../keycodekey/KeycodeKey.container';
import AutocompleteKeys from './AutocompleteKeys';
import { KeycodeOption } from './CustomKey';
import { IKeymap } from '../../../services/hid/Hid';
import { KeycodeList } from '../../../services/hid/KeycodeList';

type OwnProps = {
  value: Key;
  layerCount: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (composition: IComposition) => void;
};

type OwnState = {
  holdKey: KeycodeOption | null;
  tapKey: KeycodeOption | null;
  selectedLayer: number;
};

export default class DualFunctionsKey extends React.Component<
  OwnProps,
  OwnState
> {
  private basicKeycodeOptions: IKeymap[];
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      holdKey: null,
      tapKey: null,
      selectedLayer: NaN,
    };
    this.basicKeycodeOptions = KeycodeList.basicKeymaps;
  }

  get enableLayerSelect() {
    return this.isLayerMod(this.state.holdKey);
  }

  private isLayerMod(holdKey: KeycodeOption | null) {
    if (holdKey == null) {
      return false;
    }
    const code = holdKey.code;
    const factory = new KeycodeCompositionFactory(code);
    return factory.isLayerMod(); // == (factory.isLayerTap() || factory.isModTap() || factory.isSwapHands())
  }

  private emitOnChange(holdKey: KeycodeOption, tapKey: KeycodeOption) {
    let comp: IComposition | null = null;
    console.log('emitOnChange');
    if (holdKey.categories.includes('Layer-Tap')) {
      comp = new LayerTapComposition(holdKey.option as number, tapKey);
    } else if (holdKey.categories.includes('Mod-Tap')) {
      comp = new ModTapComposition(
        holdKey.direction!,
        holdKey.option! as IMod[],
        tapKey
      );
    }

    if (comp) {
      this.props.onChange(comp);
    }
  }

  private onChangeHoldKey(holdKey: KeycodeOption | null) {
    if (holdKey == null) {
      this.setState({ holdKey: null, tapKey: null });
      return;
    }
    if (this.state.holdKey?.code == holdKey.code) {
      return;
    }
    this.setState({ holdKey });

    // if same [Command], the [Command] is used as selected.
    if (this.isLayerMod(this.state.holdKey) == this.isLayerMod(holdKey)) {
      if (this.state.tapKey != null) {
        this.emitOnChange(holdKey, this.state.tapKey);
      }
    }
  }

  private onChangeTapKey(tapKey: KeycodeOption | null) {
    this.setState({ tapKey });
    console.log(tapKey);
    if (tapKey) {
      this.emitOnChange(this.state.holdKey!, tapKey);
    }
  }

  private onChangeLayer(selectedLayer: number) {
    if (this.state.holdKey == null) {
      // NOT TO BE HERE
      return;
    }

    this.setState({ selectedLayer });
    const comp = new LayerModComposition(
      selectedLayer,
      this.state.holdKey.option! as IMod[]
    );
    this.props.onChange(comp);
  }

  render() {
    return (
      <React.Fragment>
        <AutocompleteKeys
          label="Function"
          keycodeOptions={dualFunctionalKeyOptions}
          keycodeInfo={this.state.holdKey}
          onChange={(opt) => {
            this.onChangeHoldKey(opt);
          }}
        />
        <div className="holdkey-desc">{this.state.holdKey?.desc || ''}</div>
        {this.enableLayerSelect ? (
          <FormControl
            variant="outlined"
            size="small"
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="outlined-age-native-simple">Layer</InputLabel>
            <Select
              native
              value={this.state.selectedLayer}
              onChange={(e) => {
                this.onChangeLayer(e.target.value as number);
              }}
              label="Layer"
              inputProps={{
                name: 'label',
                id: 'outlined-age-native-simple',
              }}
            >
              {Array(this.props.layerCount)
                .fill(0)
                .map((_, i) => {
                  return (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  );
                })}
            </Select>
          </FormControl>
        ) : (
          <AutocompleteKeys
            disabled={this.state.holdKey == null}
            label="Keycode"
            keycodeOptions={this.basicKeycodeOptions}
            keycodeInfo={this.state.tapKey}
            onChange={(opt) => {
              this.onChangeTapKey(opt);
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

const dualFunctionalKeyOptions: KeycodeOption[] = [
  {
    code: 0b0110_0001_0000,
    isAny: false,
    keycodeInfo: {
      name: { long: 'MT(CTRL|kc)', short: 'MT(CTRL|kc)' },
      label: 'MT(Ctrl)',
      code: 0b0110_0001_0000,
    },
    categories: ['Mod-Tap'],
    desc: 'Acts a Ctrl when held, and a regular keycode when tapped.',
    option: [MOD_CTL],
  },
  {
    code: 0b0110_0010,
    isAny: false,
    keycodeInfo: {
      name: { long: 'MT(Shift|kc)', short: 'MT(Shift|kc)' },
      label: 'MT(Shift)',
      code: 0b0110_0010,
    },
    categories: ['Mod-Tap'],
    desc: 'Acts a Shift when held, and a regular keycode when tapped.',
    option: [MOD_SFT],
  },
  {
    code: 0b0110_0100,
    isAny: false,
    keycodeInfo: {
      name: { long: 'MT(Alt|kc)', short: 'MT(Alt|kc)' },
      label: 'MT(Alt)',
      code: 0b0110_0100,
    },
    categories: ['Mod-Tap'],
    desc: 'Acts a Alt when held, and a regular keycode when tapped.',
    option: [MOD_ALT],
  },
  {
    code: 0b0110_1000,
    isAny: false,
    keycodeInfo: {
      name: { long: 'MT(GUI|kc)', short: 'MT(GUI|kc)' },
      label: 'MT(Win/Cmd)',
      code: 0b0110_1000,
    },
    categories: ['Mod-Tap'],
    desc: 'Acts a Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_GUI],
  },
  {
    code: 0b0110_0001_0000,
    isAny: false,
    keycodeInfo: {
      name: { long: 'MT(CTRL|kc)', short: 'MT(CTRL|kc)' },
      label: 'MT(Ctrl)',
      code: 0b0110_0001_0000,
    },
    categories: ['Mod-Tap'],
    desc: 'Acts a Ctrl when held, and a regular keycode when tapped.',
    option: [MOD_CTL],
    direction: MOD_RIGHT,
  },
  {
    code: 0b0110_0010,
    isAny: false,
    keycodeInfo: {
      name: { long: 'MT(Shift|kc)', short: 'MT(Shift|kc)' },
      label: 'MT(Shift)',
      code: 0b0110_0010,
    },
    categories: ['Mod-Tap'],
    desc: 'Acts a Shift when held, and a regular keycode when tapped.',
    option: [MOD_SFT],
    direction: MOD_RIGHT,
  },
  {
    code: 0b0110_0100,
    isAny: false,
    keycodeInfo: {
      name: { long: 'MT(Alt|kc)', short: 'MT(Alt|kc)' },
      label: 'MT(Alt)',
      code: 0b0110_0100,
    },
    categories: ['Mod-Tap'],
    desc: 'Acts a Alt when held, and a regular keycode when tapped.',
    option: [MOD_ALT],
    direction: MOD_RIGHT,
  },
  {
    code: 0b0110_1000,
    isAny: false,
    keycodeInfo: {
      name: { long: 'MT(GUI|kc)', short: 'MT(GUI|kc)' },
      label: 'MT(Win/Cmd)',
      code: 0b0110_1000,
    },
    categories: ['Mod-Tap'],
    desc: 'Acts a Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_GUI],
    direction: MOD_RIGHT,
  },
  {
    code: 0b0101_1001_0001_0000,
    isAny: false,
    keycodeInfo: {
      name: { long: 'LM(Ctrl)', short: 'LM(Ctrl)' },
      label: 'LM(Ctrl)',
      code: 0b0101_1001_0001_0000,
    },
    categories: ['Mod-Tap'],
    desc: 'Momentarily activates layer, but with Ctrl mod active.',
    option: [MOD_CTL],
  },
];
