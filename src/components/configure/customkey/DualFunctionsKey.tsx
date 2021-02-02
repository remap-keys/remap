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

type OwnProps = {
  value: Key;
  layerCount: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (composition: IComposition | null) => void;
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
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      holdKey: null,
      tapKey: null,
      selectedLayer: NaN,
    };
  }

  get enableLayerSelect() {
    return this.isLayerMod(this.state.holdKey);
  }

  private genKeymap(tapKey: KeycodeOption): IKeymap {
    const km: IKeymap = {
      code: tapKey.code,
      isAny: false,
      keycodeInfo: tapKey,
    };
    return km;
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
    const fact = new KeycodeCompositionFactory(holdKey.code);
    let comp: IComposition;
    if (fact.isLayerTap()) {
      comp = new LayerTapComposition(
        holdKey.option as number,
        this.genKeymap(tapKey)
      );
    } else if (fact.isModTap()) {
      comp = new ModTapComposition(
        holdKey.direction!,
        holdKey.option! as IMod[],
        this.genKeymap(tapKey)
      );
    }
    return comp;
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
                  console.log(i);
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
            keycodeOptions={keycodeOptions.filter((opt) => {
              return opt.category == 'Basic';
            })}
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

const keycodeOptions: KeycodeOption[] = [
  {
    code: 1,
    name: {
      long: 'KC_TRANSPARENT',
      short: 'KC_TRNS',
    },
    label: '▽',
    category: 'Basic',
    subcategory: '',
  },
  {
    code: 4,
    name: { long: 'KC_A', short: 'KC_A' },
    label: 'A',
    category: 'Basic',
    subcategory: 'Letter',
  },
  {
    code: 5,
    name: { long: 'KC_B', short: 'KC_B' },
    label: 'B',
    category: 'Basic',
    subcategory: 'Letter',
  },
  {
    code: 6,
    name: { long: 'KC_C', short: 'KC_C' },
    label: 'C',
    category: 'Basic',
    subcategory: 'Letter',
  },
  {
    code: 7,
    name: { long: 'KC_D', short: 'KC_D' },
    label: 'D',
    category: 'Basic',
    subcategory: 'Letter',
  },
  {
    code: 8,
    name: { long: 'KC_E', short: 'KC_E' },
    label: 'E',
    category: 'Basic',
    subcategory: 'Letter',
  },
  {
    code: 39,
    name: { long: 'KC_0', short: 'KC_0' },
    label: '0',
    category: 'Basic',
    subcategory: 'Digit',
  },
  {
    code: 225,
    name: { long: 'KC_LSHIFT', short: 'KC_LSFT' },
    label: 'Left Shift',
    category: 'Modifier',
    subcategory: '',
  },
  {
    code: 135,
    name: { long: 'KC_INT1', short: 'KC_RO' },
    label: 'Ro',
    category: 'Special',
    subcategory: 'INT',
  },
  {
    code: 23552,
    name: { long: 'RESET', short: 'RESET' },
    label: 'Reset',
    category: 'Special',
    subcategory: 'Firmware',
    desc: 'Resets the keyboard back to the bootloader, to flash new firmware.',
  },
];

const dualFunctionalKeyOptions: KeycodeOption[] = [
  {
    code: 0b0110_0001_0000,
    name: { long: 'MT(CTRL|kc)', short: 'MT(CTRL|kc)' },
    label: 'MT(Ctrl)',
    category: 'Mod-Tap',
    subcategory: '',
    desc: 'Acts a Ctrl when held, and a regular keycode when tapped.',
    option: [MOD_CTL],
  },
  {
    code: 0b0110_0010,
    name: { long: 'MT(Shift|kc)', short: 'MT(Shift|kc)' },
    label: 'MT(Shift)',
    category: 'Mod-Tap',
    subcategory: '',
    desc: 'Acts a Shift when held, and a regular keycode when tapped.',
    option: [MOD_SFT],
  },
  {
    code: 0b0110_0100,
    name: { long: 'MT(Alt|kc)', short: 'MT(Alt|kc)' },
    label: 'MT(Alt)',
    category: 'Mod-Tap',
    subcategory: '',
    desc: 'Acts a Alt when held, and a regular keycode when tapped.',
    option: [MOD_ALT],
  },
  {
    code: 0b0110_1000,
    name: { long: 'MT(GUI|kc)', short: 'MT(GUI|kc)' },
    label: 'MT(Win/Cmd)',
    category: 'Mod-Tap',
    subcategory: '',
    desc: 'Acts a Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_GUI],
  },
  {
    code: 0b0110_0001_0000,
    name: { long: 'MT(CTRL|kc)', short: 'MT(CTRL|kc)' },
    label: 'MT(Ctrl)',
    category: 'Mod-Tap',
    subcategory: '',
    desc: 'Acts a Ctrl when held, and a regular keycode when tapped.',
    option: [MOD_CTL],
    direction: MOD_RIGHT,
  },
  {
    code: 0b0110_0010,
    name: { long: 'MT(Shift|kc)', short: 'MT(Shift|kc)' },
    label: 'MT(Shift)',
    category: 'Mod-Tap',
    subcategory: '',
    desc: 'Acts a Shift when held, and a regular keycode when tapped.',
    option: [MOD_SFT],
    direction: MOD_RIGHT,
  },
  {
    code: 0b0110_0100,
    name: { long: 'MT(Alt|kc)', short: 'MT(Alt|kc)' },
    label: 'MT(Alt)',
    category: 'Mod-Tap',
    subcategory: '',
    desc: 'Acts a Alt when held, and a regular keycode when tapped.',
    option: [MOD_ALT],
    direction: MOD_RIGHT,
  },
  {
    code: 0b0110_1000,
    name: { long: 'MT(GUI|kc)', short: 'MT(GUI|kc)' },
    label: 'MT(Win/Cmd)',
    category: 'Mod-Tap',
    subcategory: '',
    desc: 'Acts a Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_GUI],
    direction: MOD_RIGHT,
  },
  {
    code: 0b0101_1001_0001_0000,
    name: { long: 'LM(Ctrl)', short: 'LM(Ctrl)' },
    label: 'LM(Ctrl)',
    category: 'Layer Mod',
    subcategory: '',
    desc: 'Momentarily activates layer, but with Ctrl mod active.',
    option: [MOD_CTL],
  },
];
