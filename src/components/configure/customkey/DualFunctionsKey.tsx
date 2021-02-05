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
    this.dualFunctionalKeyOptions = [...genModTapKeyOptions()];
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

const genDualFunctionalKeyOption = (dkey: DualFunctionalKey): KeycodeOption => {
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

const holdCombinations: { [key: string]: IMod[] } = {
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
  'Ctrl+Shift+Win/Cmd': [MOD_CTL, MOD_SFT, MOD_ALT],
  'Ctrl+Alt+Win/Cmd': [MOD_CTL, MOD_SFT, MOD_ALT],
  'Shift+Alt+Win/Cmd': [MOD_SFT, MOD_ALT, MOD_GUI],
  'Ctrl+Shift+Alt+Win/Cmd': [MOD_CTL, MOD_SFT, MOD_ALT, MOD_GUI],
};

const _genDualFunctionalKeyOption = (
  direction: IModDirection,
  holdKey: string,
  option: IMod[] | number,
  categories: KeymapCategory[],
  desc: string
): KeycodeOption => {
  return genDualFunctionalKeyOption({
    option: option,
    label: `(${direction}) ${holdKey}`,
    categories: categories,
    desc: desc,
    direction: direction,
  });
};

const genModTapKeyOptions = (): KeycodeOption[] => {
  const desc = (holdKey: string): string =>
    `Acts a left ${holdKey} when held, and a regular keycode when tapped.`;
  const categories: KeymapCategory[] = ['Mod-Tap'];
  return [MOD_LEFT, MOD_RIGHT]
    .map((d) => {
      return Object.entries(holdCombinations).map((item) =>
        _genDualFunctionalKeyOption(d, ...item, categories, desc(item[0]))
      );
    })
    .flat();
};

const genLayerModKeyOptions = (): KeycodeOption[] => {
  const desc = (holdKey: string): string =>
    `Momentarily activates layer, but with ${holdKey} mod active.`;
  const categories: KeymapCategory[] = ['Layer-Mod'];
  return [MOD_LEFT, MOD_RIGHT]
    .map((d) => {
      return Object.entries(holdCombinations).map((item) =>
        _genDualFunctionalKeyOption(d, ...item, categories, desc(item[0]))
      );
    })
    .flat();
};
