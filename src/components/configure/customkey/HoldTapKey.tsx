/* eslint-disable no-undef */
import React from 'react';
import './HoldTapKey.scss';
import {
  IMod,
  IModDirection,
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_LEFT,
  MOD_RIGHT,
  MOD_SFT,
} from '../../../services/hid/Composition';
import AutocompleteKeys from './AutocompleteKeys';
import { KeycodeOption } from './CustomKey';
import { KeycodeList } from '../../../services/hid/KeycodeList';
import { buildModCode } from './Modifiers';

type OwnProps = {
  holdKey: KeycodeOption | null;
  tapKey: KeycodeOption | null;
  layerCount: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (hold: KeycodeOption | null, tap: KeycodeOption | null) => void;
};

type OwnState = {
  tapKeycodeOptions: KeycodeOption[];
};

export default class HoldTapKey extends React.Component<OwnProps, OwnState> {
  private holdKeyOptions: KeycodeOption[];
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);

    this.state = {
      tapKeycodeOptions: [...KeycodeList.basicKeymaps],
    };

    this.holdKeyOptions = [
      ...modTapKeys,
      ...genHoldLayers(this.props.layerCount),
      swapHandsKeyOption,
    ];
  }

  get tapKeycodeOptions(): KeycodeOption[] {
    const holdKey: KeycodeOption | null = this.props.holdKey;
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

  private emitOnChange(
    holdKey: KeycodeOption | null,
    tapKey: KeycodeOption | null
  ) {
    if (holdKey === null) {
      this.props.onChange(null, null);
      return;
    }

    this.props.onChange(holdKey, tapKey);
  }

  private onChangeHoldKey(holdKey: KeycodeOption | null) {
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

  private onChangeTapKey(tapKey: KeycodeOption | null) {
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

const NO_KEYCODE = -1;
const DIRECTION = ['Left', 'Right'];
const genModTap = (
  hold: string,
  mods: IMod[],
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
    categories: ['Mod-Tap'],
    desc: '',
    modifiers: mods,
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
          name: { short: `LT(${index})`, long: `LT(${index})` },
        },
        categories: ['Hold-Layer'],
        desc: `Momentarily activates Layer(${index}) when held, and sends keycode when tapped.`,
        option: index,
      };
    });
};

export const findHoldLayer = (
  layer: number,
  layerCount: number
): KeycodeOption => {
  const list = genHoldLayers(layerCount);
  return list.find((item) => item.option === layer)!;
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

const holdLeftModKeys: KeycodeOption[] = Object.keys(holdKeys).map((hold) =>
  genModTap(hold, holdKeys[hold], MOD_LEFT)
);

const holdRightModKeys: KeycodeOption[] = Object.keys(holdKeys).map((hold) =>
  genModTap(hold, holdKeys[hold], MOD_RIGHT)
);

const modTapKeys: KeycodeOption[] = [...holdLeftModKeys, ...holdRightModKeys];

export const findModTapKey = (
  mods: IMod[],
  direction: IModDirection
): KeycodeOption => {
  return modTapKeys.find((item) => {
    const modCode = buildModCode(mods);
    return (
      item.direction === direction && buildModCode(item.modifiers!) === modCode
    );
  })!;
};

export const swapHandsKeyOption: KeycodeOption = {
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
