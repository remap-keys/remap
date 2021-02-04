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
  MOD_RIGHT,
  MOD_SFT,
} from '../../../services/hid/Composition';
import { Key } from '../keycodekey/KeycodeKey.container';
import AutocompleteKeys from './AutocompleteKeys';
import { KeycodeOption } from './CustomKey';
import { IKeymap } from '../../../services/hid/Hid';
import { KeycodeList, KeymapCategory } from '../../../services/hid/KeycodeList';

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
    this.dualFunctionalKeyOptions = dualFunctionalKeys.map((dkey) =>
      genDualFunctionalKeyOptions(dkey)
    );
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
          label="Hold"
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

type DualFunctionalKey = {
  label: string;
  categories: KeymapCategory[];
  desc: string;
  option: IMod[] | number;
  direction?: IModDirection;
};

const genDualFunctionalKeyOptions = (
  dkey: DualFunctionalKey
): KeycodeOption => {
  return {
    code: 0,
    isAny: false,
    keycodeInfo: { code: 0, label: dkey.label, name: { short: '', long: '' } },
    categories: dkey.categories,
    desc: dkey.desc,
    option: dkey.option,
    direction: dkey.direction,
  };
};

const dualFunctionalKeys: DualFunctionalKey[] = [
  {
    label: '(Left) Ctrl',
    categories: ['Mod-Tap'],
    desc: 'Acts a left Ctrl when held, and a regular keycode when tapped.',
    option: [MOD_CTL],
  },
  {
    label: '(Left) Shift',
    categories: ['Mod-Tap'],
    desc: 'Acts a left Shift when held, and a regular keycode when tapped.',
    option: [MOD_SFT],
  },
  {
    label: '(Left) Alt',
    categories: ['Mod-Tap'],
    desc: 'Acts a left Alt when held, and a regular keycode when tapped.',
    option: [MOD_ALT],
  },
  {
    label: '(Left) Win/Cmd',
    categories: ['Mod-Tap'],
    desc: 'Acts a left Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_GUI],
  },
  {
    label: '(Left) Ctrl+Shift',
    categories: ['Mod-Tap'],
    desc:
      'Acts a left Ctrl+Shift when held, and a regular keycode when tapped.',
    option: [MOD_CTL, MOD_SFT],
  },
  {
    label: '(Left) Ctrl+Alt',
    categories: ['Mod-Tap'],
    desc: 'Acts a left Ctrl+Alt when held, and a regular keycode when tapped.',
    option: [MOD_CTL, MOD_ALT],
  },
  {
    label: '(Left) Ctrl+Win/Cmd',
    categories: ['Mod-Tap'],
    desc:
      'Acts a left Ctrl+Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_CTL, MOD_GUI],
  },
  {
    label: '(Left) Shift+Alt',
    categories: ['Mod-Tap'],
    desc: 'Acts a left Shift+Alt when held, and a regular keycode when tapped.',
    option: [MOD_SFT, MOD_ALT],
  },
  {
    label: '(Left) Shift+Win/Cmd',
    categories: ['Mod-Tap'],
    desc:
      'Acts a left Shift+Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_SFT, MOD_GUI],
  },
  {
    label: '(Left) Alt+Win/Cmd',
    categories: ['Mod-Tap'],
    desc:
      'Acts a left Alt+Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_ALT, MOD_GUI],
  },
  {
    label: '(Left) Ctrl+Shift+Alt',
    categories: ['Mod-Tap'],
    desc:
      'Acts a left Ctrl+Shift+Alt when held, and a regular keycode when tapped.',
    option: [MOD_CTL, MOD_SFT, MOD_ALT],
  },
  {
    label: '(Left) Ctrl+Shift+Win/Cmd',
    categories: ['Mod-Tap'],
    desc:
      'Acts a left Ctrl+Shift+Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_CTL, MOD_SFT, MOD_GUI],
  },
  {
    label: '(Left) Ctrl+Alt+Win/Cmd',
    categories: ['Mod-Tap'],
    desc:
      'Acts a left Ctrl+Alt+Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_CTL, MOD_ALT, MOD_GUI],
  },
  {
    label: '(Left) Shift+Alt+Win/Cmd',
    categories: ['Mod-Tap'],
    desc:
      'Acts a left Shift+Alt+Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_SFT, MOD_ALT, MOD_GUI],
  },
  {
    label: '(Left) Ctrl+Shift+Alt+Win/Cmd',
    categories: ['Mod-Tap'],
    desc:
      'Acts a left Ctrl+Shift+Alt+Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
  },

  {
    label: '(Right) Ctrl',
    categories: ['Mod-Tap'],
    desc: 'Acts a right Ctrl when held, and a regular keycode when tapped.',
    option: [MOD_CTL],
    direction: MOD_RIGHT,
  },
  {
    label: '(Right) Shift',
    categories: ['Mod-Tap'],
    desc: 'Acts a right Shift when held, and a regular keycode when tapped.',
    option: [MOD_SFT],
    direction: MOD_RIGHT,
  },
  {
    label: '(Right) Alt',
    categories: ['Mod-Tap'],
    desc: 'Acts a right Alt when held, and a regular keycode when tapped.',
    option: [MOD_ALT],
    direction: MOD_RIGHT,
  },
  {
    label: '(Right) Win/Cmd',
    categories: ['Mod-Tap'],
    desc: 'Acts a right Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_GUI],
    direction: MOD_RIGHT,
  },
  {
    label: '(Right) Ctrl+Shift',
    categories: ['Mod-Tap'],
    desc:
      'Acts a right Ctrl+Shift when held, and a regular keycode when tapped.',
    option: [MOD_CTL, MOD_SFT],
    direction: MOD_RIGHT,
  },
  {
    label: '(Right) Ctrl+Alt',
    categories: ['Mod-Tap'],
    desc: 'Acts a right Ctrl+Alt when held, and a regular keycode when tapped.',
    option: [MOD_CTL, MOD_ALT],
    direction: MOD_RIGHT,
  },
  {
    label: '(Right) Ctrl+Win/Cmd',
    categories: ['Mod-Tap'],
    desc:
      'Acts a right Ctrl+Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_CTL, MOD_GUI],
    direction: MOD_RIGHT,
  },
  {
    label: '(Right) Shift+Alt',
    categories: ['Mod-Tap'],
    desc:
      'Acts a right Shift+Alt when held, and a regular keycode when tapped.',
    option: [MOD_SFT, MOD_ALT],
    direction: MOD_RIGHT,
  },
  {
    label: '(Right) Shift+Win/Cmd',
    categories: ['Mod-Tap'],
    desc:
      'Acts a right Shift+Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_SFT, MOD_GUI],
    direction: MOD_RIGHT,
  },
  {
    label: '(Right) Alt+Win/Cmd',
    categories: ['Mod-Tap'],
    desc:
      'Acts a right Alt+Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_ALT, MOD_GUI],
    direction: MOD_RIGHT,
  },
  {
    label: '(Right) Ctrl+Shift+Alt',
    categories: ['Mod-Tap'],
    desc:
      'Acts a right Ctrl+Shift+Alt when held, and a regular keycode when tapped.',
    option: [MOD_CTL, MOD_SFT, MOD_ALT],
    direction: MOD_RIGHT,
  },
  {
    label: '(Right) Ctrl+Shift+Win/Cmd',
    categories: ['Mod-Tap'],
    desc:
      'Acts a right Ctrl+Shift+Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_CTL, MOD_SFT, MOD_GUI],
    direction: MOD_RIGHT,
  },
  {
    label: '(Right) Ctrl+Alt+Win/Cmd',
    categories: ['Mod-Tap'],
    desc:
      'Acts a right Ctrl+Alt+Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_CTL, MOD_ALT, MOD_GUI],
    direction: MOD_RIGHT,
  },
  {
    label: '(Right) Shift+Alt+Win/Cmd',
    categories: ['Mod-Tap'],
    desc:
      'Acts a right Shift+Alt+Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_SFT, MOD_ALT, MOD_GUI],
    direction: MOD_RIGHT,
  },
  {
    label: '(Right) Ctrl+Shift+Alt+Win/Cmd',
    categories: ['Mod-Tap'],
    desc:
      'Acts a right Ctrl+Shift+Alt+Win/Cmd when held, and a regular keycode when tapped.',
    option: [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
    direction: MOD_RIGHT,
  },

  {
    label: 'LM Ctrl',
    categories: ['Mod-Tap'],
    desc: 'Momentarily activates layer, but with Ctrl mod active.',
    option: [MOD_CTL],
    direction: MOD_RIGHT,
  },
];
