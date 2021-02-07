/* eslint-disable no-undef */
import React from 'react';
import './HoldTapKey.scss';
import {
  IComposition,
  IMod,
  IModDirection,
  LayerModComposition,
  LayerTapComposition,
  ModTapComposition,
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_LEFT,
  MOD_RIGHT,
  MOD_SFT,
  SwapHandsComposition,
} from '../../../services/hid/Composition';
import { Key } from '../keycodekey/KeycodeKey.container';
import AutocompleteKeys from './AutocompleteKeys';
import { KeycodeOption } from './CustomKey';
import { KeycodeList } from '../../../services/hid/KeycodeList';

type OwnProps = {
  value: Key;
  layerCount: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (opt: KeycodeOption) => void;
};

type OwnState = {
  holdKey: KeycodeOption | null;
  tapKey: KeycodeOption | null;
  selectedLayer: number;
  tapKeycodeOptions: KeycodeOption[];
};

export default class HoldTapKey extends React.Component<OwnProps, OwnState> {
  private holdKeyOptions: KeycodeOption[];
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);

    this.state = {
      holdKey: null,
      tapKey: null,
      selectedLayer: NaN,
      tapKeycodeOptions: [
        ...KeycodeList.basicKeymaps,
        ...genLayerNumberOptions(this.props.layerCount),
      ],
    };

    this.holdKeyOptions = [
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

  get tapKeycodeOptions(): KeycodeOption[] {
    const holdKey: KeycodeOption | null = this.state.holdKey;
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

  private emitOnChange(holdKey: KeycodeOption, tapKey: KeycodeOption) {
    let comp:
      | ModTapComposition
      | LayerModComposition
      | LayerTapComposition
      | SwapHandsComposition
      | null = null;
    const category = holdKey.categories[0];
    let opt: KeycodeOption;
    if (category === 'Hold-Layer') {
      comp = new LayerTapComposition(holdKey.option as number, tapKey);
      opt = comp.getKey();
    } else if (category === 'Hold-Mod') {
      if (tapKey.categories[0] === 'Layer-Mod') {
        comp = new LayerModComposition(
          tapKey.option as number,
          holdKey.option as IMod[]
        );
        opt = { ...holdKey, code: comp.getCode(), option: comp.getLayer() };
      } else {
        comp = new ModTapComposition(
          holdKey.direction!,
          holdKey.option! as IMod[],
          tapKey
        );
        opt = comp.getKey();
      }
    } else if (category === 'Swap-Hands') {
      comp = new SwapHandsComposition(tapKey);
      opt = comp.getKey();
    } else {
      throw new Error(
        `NOT TO BE HERE. holdKey.category:${category}, tapKey.category: ${tapKey.categories}`
      );
    }

    this.props.onChange(opt);
  }

  private onChangeHoldKey(holdKey: KeycodeOption | null) {
    if (holdKey === null) {
      this.setState({ holdKey: null, tapKey: null });
      return;
    }
    // if same type of the HOLD, use its keycode/layer
    if (this.state.holdKey?.categories[0] === holdKey.categories[0]) {
      if (this.state.tapKey != null) {
        this.emitOnChange(holdKey, this.state.tapKey);
      }
    } else {
      this.setState({ tapKey: null });
    }
    console.log(holdKey);
    this.setState({ holdKey });
  }

  private onChangeTapKey(tapKey: KeycodeOption | null) {
    this.setState({ tapKey });
    console.log(tapKey);
    if (tapKey) {
      this.emitOnChange(this.state.holdKey!, tapKey);
    }
  }

  render() {
    return (
      <React.Fragment>
        <AutocompleteKeys
          label="Hold"
          showCategory={false}
          keycodeOptions={this.holdKeyOptions}
          keycodeInfo={this.state.holdKey}
          onChange={(opt) => {
            this.onChangeHoldKey(opt);
          }}
        />
        <div className="holdkey-desc">{this.state.holdKey?.desc || ''}</div>

        <AutocompleteKeys
          disabled={this.state.holdKey == null}
          label="Tap"
          keycodeOptions={this.tapKeycodeOptions}
          keycodeInfo={this.state.tapKey}
          onChange={(opt) => {
            this.onChangeTapKey(opt);
          }}
        />
      </React.Fragment>
    );
  }
}

const NO_KEYCODE = -1;
const DIRECTION = ['Left', 'Right'];
const genHoldMod = (
  hold: string,
  option: IMod[],
  direction: IModDirection
): KeycodeOption => {
  return {
    code: NO_KEYCODE,
    isAny: false,
    keycodeInfo: {
      code: NO_KEYCODE,
      label: `(${DIRECTION[direction]}) ${hold}`,
      name: { short: '', long: '' },
    },
    categories: ['Hold-Mod'],
    desc: '',
    option: option,
    direction: direction,
  };
};

const genHoldLayers = (layerCount: number): KeycodeOption[] => {
  return Array(layerCount)
    .fill(0)
    .map((_, index) => {
      const label = `Layer(${index})`;
      return {
        code: NO_KEYCODE,
        isAny: false,
        keycodeInfo: {
          code: NO_KEYCODE,
          label: label,
          name: { short: '', long: '' },
        },
        categories: ['Hold-Layer'],
        desc: `Momentarily activates Layer(${index}) when held, and sends keycode when tapped.`,
        option: index,
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
  code: NO_KEYCODE,
  isAny: false,
  keycodeInfo: {
    code: NO_KEYCODE,
    label: `Swap-Hands`,
    name: { short: '', long: '' },
  },
  categories: ['Swap-Hands'],
  desc:
    'Sends key with a tap; momentary swap when held. Depends on your keyboard whether this function is available.',
  option: -1,
};

const genLayerNumberOptions = (layerCount: number): KeycodeOption[] => {
  return Array(layerCount)
    .fill(0)
    .map((_, index) => {
      return {
        code: NO_KEYCODE,
        isAny: false,
        keycodeInfo: {
          code: NO_KEYCODE,
          label: `Layer(${index})`,
          name: { short: '', long: '' },
        },
        categories: ['Layer-Mod'],
        desc: '',
        option: index,
      };
    });
};
