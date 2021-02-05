/* eslint-disable no-undef */
import React from 'react';
import './DualFunctionsKey.scss';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import {
  IComposition,
  IMod,
  IModDirection,
  KeycodeCompositionFactory,
  LayerModComposition,
  LayerTapComposition,
  ModTapComposition,
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_LEFT,
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
  tapLabel: 'Keycode' | 'Layer';
  selectedLayer: number;
};

export default class DualFunctionsKey extends React.Component<
  OwnProps,
  OwnState
> {
  private basicKeycodeOptions: IKeymap[];
  private dualFunctionalKeyOptions: KeycodeOption[];
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      holdKey: null,
      tapKey: null,
      tapLabel: 'Keycode',
      selectedLayer: NaN,
    };
    this.basicKeycodeOptions = KeycodeList.basicKeymaps;
    this.dualFunctionalKeyOptions = [
      ...Object.keys(holdKeys).map((hold) =>
        genHoldMod(hold, holdKeys[hold], MOD_LEFT)
      ),
      ...Object.keys(holdKeys).map((hold) =>
        genHoldMod(hold, holdKeys[hold], MOD_RIGHT)
      ),
      ...genHoldLayers(this.props.layerCount),
      swapHandsKeyOption,
    ];
  }

  get enableLayerSelect(): boolean {
    return this.state.holdKey?.categories[0] == 'Hold-Layer';
  }

  private emitOnChange(holdKey: KeycodeOption, tapKey: KeycodeOption) {
    let comp: IComposition | null = null;
    console.log('emitOnChange');
    if (holdKey.categories.includes('Hold-Layer')) {
      comp = new LayerTapComposition(holdKey.option as number, tapKey);
    } else if (holdKey.categories.includes('Hold-Mod')) {
      comp = new ModTapComposition(
        holdKey.direction!,
        holdKey.option! as IMod[],
        tapKey
      );
    } else if (holdKey.categories.includes('Swap-Hands')) {
      // TODO
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
    // if same type of the HOLD, use its keycode/layer
    if (this.state.holdKey?.categories[0] == holdKey.categories[0]) {
      if (this.state.tapKey != null) {
        this.emitOnChange(holdKey, this.state.tapKey);
      }
    } else {
      this.setState({ tapKey: null });
    }
    this.setState({ holdKey });
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
          label="Hold"
          showCategory={false}
          keycodeOptions={this.dualFunctionalKeyOptions}
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
              label="Tap(Layer)"
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
            label="Tap(Keycode)"
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

const DIRECTION = ['Left', 'Right'];
const genHoldMod = (
  hold: string,
  option: IMod[],
  direction: IModDirection
): KeycodeOption => {
  return {
    code: 0,
    isAny: false,
    keycodeInfo: {
      code: 0,
      label: `(${DIRECTION[direction]}) ${hold}`,
      name: { short: '', long: '' },
    },
    categories: ['Hold-Mod'],
    desc: '',
    option: option,
    direction: direction,
  };
};

const genHoldLayers = (layer: number): KeycodeOption[] => {
  return Array(layer)
    .fill(0)
    .map((_, index) => {
      return {
        code: 0,
        isAny: false,
        keycodeInfo: {
          code: 0,
          label: `Layer(${index})`,
          name: { short: '', long: '' },
        },
        categories: ['Hold-Layer'],
        desc: '',
        option: -1,
      };
    });
};

const holdKeys: { [key: string]: IMod[] } = {
  Ctrl: [MOD_CTL],
  Shift: [MOD_SFT],
  Alt: [MOD_ALT],
  'Win/Cmd': [MOD_GUI],
  'Ctrl+Shift': [MOD_CTL, MOD_SFT],
  'Ctrl+Alt': [MOD_CTL, MOD_ALT],
  'Ctrl+Win/Cmd': [MOD_CTL, MOD_GUI],
  'Shift+Alt': [MOD_SFT, MOD_ALT],
  'Shift+Win/Cmd': [MOD_SFT, MOD_GUI],
  'Alt+Win/Cmd': [MOD_ALT, MOD_GUI],
  'Ctrl+Shift+Alt': [MOD_CTL, MOD_SFT, MOD_ALT],
  'Ctrl+Shift+Win/Cmd': [MOD_CTL, MOD_SFT, MOD_GUI],
  'Ctrl+Alt+Win/Cmd': [MOD_CTL, MOD_ALT, MOD_GUI],
  'Shift+Alt+Win/Cmd': [MOD_SFT, MOD_ALT, MOD_GUI],
  'Ctrl+Shift+Alt+Win/Cmd': [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
};

const swapHandsKeyOption: KeycodeOption = {
  code: 0,
  isAny: false,
  keycodeInfo: {
    code: 0,
    label: `Swap-Hands`,
    name: { short: '', long: '' },
  },
  categories: ['Swap-Hands'],
  desc: '',
  option: -1,
};
