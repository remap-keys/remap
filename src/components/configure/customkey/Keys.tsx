import React from 'react';
import './Keys.scss';
import {
  BasicComposition,
  DefLayerComposition,
  FunctionComposition,
  IMod,
  IModDirection,
  ISwapHandsOption,
  KeycodeCompositionFactory,
  LayerModComposition,
  LayerTapToggleComposition,
  LooseKeycodeComposition,
  ModsComposition,
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_LEFT,
  MOD_RIGHT,
  MOD_SFT,
  MomentaryComposition,
  OneShotLayerComposition,
  OneShotModComposition,
  OP_SH_OFF,
  OP_SH_OFF_ON,
  OP_SH_ON,
  OP_SH_ONESHOT,
  OP_SH_ON_OFF,
  OP_SH_TAP_TOGGLE,
  OP_SH_TOGGLE,
  SwapHandsComposition,
  ToComposition,
  ToggleLayerComposition,
} from '../../../services/hid/Composition';

import { KeycodeList } from '../../../services/hid/KeycodeList';
import AutocompleteKeys from './AutocompleteKeys';
import Modifiers, { buildModCode } from './Modifiers';
import { IKeymap } from '../../../services/hid/Hid';

type OwnProps = {
  value: IKeymap | null; // Keys
  layerCount: number;
  hexCode: string;
  onChangeKey: (
    // eslint-disable-next-line no-unused-vars
    opt: IKeymap
  ) => void;
};
type OwnState = {};
export default class Keys extends React.Component<OwnProps, OwnState> {
  private basicKeymaps: IKeymap[];
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {};
    this.basicKeymaps = [
      ...KeycodeList.basicKeymaps,
      ...genTos(this.props.layerCount),
      ...genMomentaryLayers(this.props.layerCount),
      ...genDefLayers(this.props.layerCount),
      ...genLayerTapToggles(this.props.layerCount),
      ...genToggleLayers(this.props.layerCount),
      ...genLayerMods(this.props.layerCount),
      ...genOneShotLayers(this.props.layerCount),
      ...genOneShotMods(),
      ...looseKeys,
      ...swapHandsKeys,
    ];
  }
  get direction(): IModDirection {
    if (this.props.value === null) {
      return MOD_LEFT;
    }

    return this.props.value.direction || MOD_LEFT;
  }

  get modifiers(): IMod[] {
    if (this.props.value === null) {
      return [];
    }

    return this.props.value.modifiers || [];
  }

  get disabledModifiers() {
    const factory = new KeycodeCompositionFactory(
      parseInt(this.props.hexCode, 16)
    );
    const flag = !(
      (factory.isBasic() && !factory.isBasicFunc()) ||
      factory.isMods() ||
      factory.isLayerMod() ||
      factory.isOneShotMod()
    );

    return flag;
  }

  get disabledDirection() {
    const factory = new KeycodeCompositionFactory(
      parseInt(this.props.hexCode, 16)
    );
    return factory.isLayerMod();
  }

  private emitOnChange(opt: IKeymap, direction: IModDirection, mods: IMod[]) {
    let comp:
      | BasicComposition
      | DefLayerComposition
      | FunctionComposition
      | ModsComposition
      | LayerModComposition
      | LayerTapToggleComposition
      | LooseKeycodeComposition
      | MomentaryComposition
      | OneShotLayerComposition
      | OneShotModComposition
      | SwapHandsComposition
      | ToComposition
      | ToggleLayerComposition;

    opt.direction = direction;
    const category = opt.categories[0];
    if (category === 'Basic') {
      if (mods.length === 0) {
        comp = new BasicComposition(opt);
      } else if (opt.categories.includes('Func')) {
        // KC_FN* key is not allowed to add modifier(s)
        opt.modifiers = [];
        opt.direction = MOD_LEFT;
        comp = new BasicComposition(opt);
      } else {
        opt.modifiers = mods;
        comp = new ModsComposition(direction, mods, opt);
      }
    } else if (category === 'Modifier') {
      opt.modifiers = mods;
      comp = new ModsComposition(direction, mods, opt);
    } else if (category === 'Function') {
      comp = new FunctionComposition(opt.option!);
    } else if (category === 'To') {
      comp = new ToComposition(opt.option!);
    } else if (category === 'Momentary-Layer') {
      comp = new MomentaryComposition(opt.option!);
    } else if (category === 'Def-Layer') {
      comp = new DefLayerComposition(opt.option!);
    } else if (category === 'Layer-Tap-Toggle') {
      comp = new LayerTapToggleComposition(opt.option!);
    } else if (category === 'One-Shot-Layer') {
      comp = new OneShotLayerComposition(opt.option!);
    } else if (category === 'One-Shot-Mod') {
      opt.modifiers = mods;
      comp = new OneShotModComposition(opt.direction!, opt.modifiers!);
    } else if (category === 'Loose-Keycode') {
      comp = new LooseKeycodeComposition(opt);
    } else if (category === 'Swap-Hands') {
      comp = new SwapHandsComposition(opt.option as ISwapHandsOption);
    } else if (category === 'Toggle-Layer') {
      comp = new ToggleLayerComposition(opt.option!);
    } else if (category === 'Layer-Mod') {
      const layer = opt.option!;
      opt.modifiers = mods;
      comp = new LayerModComposition(layer, mods);
    } else {
      throw new Error(
        `NOT TO BE HERE. code: ${opt.code}, categories: ${opt.categories}, direction: ${opt.direction}, modifiers: ${opt.modifiers}`
      );
    }

    const code: number = comp.getCode();
    opt.code = code;
    this.props.onChangeKey(opt);
  }

  private onChangeKeycode(opt: IKeymap | null) {
    if (opt === null) return;

    const direction =
      opt.categories[0] === 'Layer-Mod' ? MOD_LEFT : this.direction;
    this.emitOnChange(opt, direction, this.modifiers);
  }

  private onChangeModifiers(direction: IModDirection, mods: IMod[]) {
    this.emitOnChange(this.props.value!, direction, mods);
  }

  render() {
    return (
      <React.Fragment>
        <AutocompleteKeys
          label="Keycode"
          keycodeOptions={this.basicKeymaps}
          keycodeInfo={this.props.value}
          onChange={(opt) => {
            this.onChangeKeycode(opt);
          }}
        />
        <div className="customkey-desc">{this.props.value?.desc || ''}</div>
        <Modifiers
          disabled={this.disabledModifiers}
          disableDirection={this.disabledDirection}
          mods={this.modifiers}
          direction={this.direction}
          onChange={(direction, mod) => {
            this.onChangeModifiers(direction, mod);
          }}
        />
      </React.Fragment>
    );
  }
}

const NO_KEYCODE = -1;
const genFunctions = (): IKeymap[] => {
  return Array(32)
    .fill(0)
    .map((_, index) => {
      const label = `Fn${index}`;
      return {
        code: NO_KEYCODE,
        isAny: false,
        keycodeInfo: {
          code: NO_KEYCODE,
          label: label,
          name: { short: '', long: '' },
        },
        categories: ['Function'],
        desc: ``,
        option: index,
      };
    });
};

export const findFunctionKeymap = (functionId: number): IKeymap => {
  const list = genFunctions();
  return list.find((item) => item.option === functionId)!;
};

const genTos = (layerCount: number): IKeymap[] => {
  return Array(layerCount)
    .fill(0)
    .map((_, index) => {
      const label = `TO(${index})`;
      return {
        code: NO_KEYCODE,
        isAny: false,
        keycodeInfo: {
          code: NO_KEYCODE,
          label: label,
          name: { short: '', long: '' },
        },
        categories: ['To'],
        desc: `Activates layer(${index}) and de-activates all other layers (except your default layer).`,
        option: index,
      };
    });
};

export const findToKeymap = (layer: number, layerCount: number): IKeymap => {
  const list = genTos(layerCount);
  return list.find((item) => item.option === layer)!;
};

const genLayerMods = (layerCount: number): IKeymap[] => {
  return Array(layerCount)
    .fill(0)
    .map((_, index) => {
      const label = `LM(${index})`;
      return {
        code: NO_KEYCODE,
        isAny: false,
        keycodeInfo: {
          code: NO_KEYCODE,
          label: label,
          name: { short: '', long: '' },
        },
        categories: ['Layer-Mod'],
        desc: `Momentarily activates Layer(${index}), but with modifier(s) mod active.`,
        option: index,
      };
    });
};

export const findLayerModKeymap = (
  layer: number,
  layerCount: number
): IKeymap => {
  const list = genLayerMods(layerCount);
  return list.find((item) => item.option === layer)!;
};

const genMomentaryLayers = (layerCount: number): IKeymap[] => {
  return Array(layerCount)
    .fill(0)
    .map((_, index) => {
      const label = `MO(${index})`;
      return {
        code: NO_KEYCODE,
        isAny: false,
        keycodeInfo: {
          code: NO_KEYCODE,
          label: label,
          name: { short: '', long: '' },
        },
        categories: ['Momentary-Layer'],
        desc: `Momentarily activates layer(${index}). As soon as you let go of the key, the layer is deactivated.`,
        option: index,
      };
    });
};

export const findMomentaryLayerKeymap = (
  layer: number,
  layerCount: number
): IKeymap => {
  const list = genMomentaryLayers(layerCount);
  return list.find((item) => item.option === layer)!;
};

const genDefLayers = (layerCount: number): IKeymap[] => {
  return Array(layerCount)
    .fill(0)
    .map((_, index) => {
      const label = `DF(${index})`;
      return {
        code: NO_KEYCODE,
        isAny: false,
        keycodeInfo: {
          code: NO_KEYCODE,
          label: label,
          name: { short: '', long: '' },
        },
        categories: ['Def-Layer'],
        desc: `Momentarily activates layer(${index}). As soon as you let go of the key, the layer is deactivated.`,
        option: index,
      };
    });
};

export const findDefLayerKeymap = (
  layer: number,
  layerCount: number
): IKeymap => {
  const list = genDefLayers(layerCount);
  return list.find((item) => item.option === layer)!;
};

const genLayerTapToggles = (layerCount: number): IKeymap[] => {
  return Array(layerCount)
    .fill(0)
    .map((_, index) => {
      const label = `TT(${index})`;
      return {
        code: NO_KEYCODE,
        isAny: false,
        keycodeInfo: {
          code: NO_KEYCODE,
          label: label,
          name: { short: '', long: '' },
        },
        categories: ['Layer-Tap-Toggle'],
        desc: `If you hold the key down, layer(${index}) is activated, and then is de-activated when you let go.`,
        option: index,
      };
    });
};

export const findLayerTapToggleKeymap = (
  layer: number,
  layerCount: number
): IKeymap => {
  const list = genLayerTapToggles(layerCount);
  return list.find((item) => item.option === layer)!;
};

const genToggleLayers = (layerCount: number): IKeymap[] => {
  return Array(layerCount)
    .fill(0)
    .map((_, index) => {
      const label = `TG(${index})`;
      return {
        code: NO_KEYCODE,
        isAny: false,
        keycodeInfo: {
          code: NO_KEYCODE,
          label: label,
          name: { short: '', long: '' },
        },
        categories: ['Toggle-Layer'],
        desc: `Toggles layer(${index}), activating it if it's inactive and vice versa.`,
        option: index,
      };
    });
};

export const findToggleLayerKeymap = (
  layer: number,
  layerCount: number
): IKeymap => {
  const list = genToggleLayers(layerCount);
  return list.find((item) => item.option === layer)!;
};

const genOneShotLayers = (layerCount: number): IKeymap[] => {
  return Array(layerCount)
    .fill(0)
    .map((_, index) => {
      const label = `OSL(${index})`;
      return {
        code: NO_KEYCODE,
        isAny: false,
        keycodeInfo: {
          code: NO_KEYCODE,
          label: label,
          name: { short: '', long: '' },
        },
        categories: ['One-Shot-Layer'],
        desc: `Momentarily activates layer(${index}) until the next key is pressed.`,
        option: index,
      };
    });
};

export const findOneShotLayerKeymap = (
  layer: number,
  layerCount: number
): IKeymap => {
  const list = genOneShotLayers(layerCount);
  return list.find((item) => item.option === layer)!;
};

const genOneShotMods = (): IKeymap[] => {
  const DIRECTION = ['Left', 'Right'];
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

  const gen = (
    hold: string,
    direction: IModDirection,
    mods: IMod[]
  ): IKeymap => {
    return {
      code: NO_KEYCODE,
      isAny: false,
      keycodeInfo: {
        code: NO_KEYCODE,
        label: `(${DIRECTION[direction]}) ${hold}`,
        name: { short: '', long: '' },
      },
      categories: ['One-Shot-Mod'],
      desc: `Momentarily activates ${hold} until the next key is pressed.`,
      modifiers: mods,
      direction: direction,
    };
  };
  const left = Object.keys(holdKeys).map((hold) => {
    const option: IMod[] = holdKeys[hold];
    return gen(hold, MOD_LEFT, option);
  });
  const right = Object.keys(holdKeys).map((hold) => {
    const option: IMod[] = holdKeys[hold];
    return gen(hold, MOD_RIGHT, option);
  });
  return [...left, ...right];
};

export const findOneShotModKeymap = (
  mods: IMod[],
  direction: IModDirection
): IKeymap => {
  const modsCode = buildModCode(mods);
  const list = genOneShotMods();
  return list.find((item) => {
    return (
      item.direction === direction && buildModCode(item.modifiers!) === modsCode
    );
  })!;
};

type LooseType = {
  code: number;
  label: string;
  desc: string;
};
const looseList: LooseType[] = [
  {
    code: 0x5c00,
    label: 'RESET',
    desc: 'Put the keyboard into bootloader mode for flashing.',
  },
  { code: 0x5c01, label: 'DEBUG', desc: 'Toggle debug mode.' },
  {
    code: 0x5c17,
    label: 'GRAVE_ESC',
    desc: 'Share the grave key (` and ~) with Escape.',
  },
  { code: 0x5c02, label: 'CL_SWAP', desc: 'Swap Caps Lock and Left Control.' },
  {
    code: 0x5c0b,
    label: 'CL_NORM',
    desc: 'Unswap Caps Lock and Left Control.',
  },
  { code: 0x5c03, label: 'CL_CTRL', desc: 'Treat Caps Lock as Control.' },
  {
    code: 0x5c0c,
    label: 'CL_CAPS',
    desc: 'Stop treating Caps Lock as Control.',
  },
  { code: 0x5c04, label: 'LAG_SWP', desc: 'Swap Left Alt and GUI.' },
  { code: 0x5c0d, label: 'LAG_NRM', desc: 'Unswap Left Alt and Win/Cmd.' },
  { code: 0x5c05, label: 'RAG_SWP', desc: 'Swap Right Alt and GUI.' },
  { code: 0x5c0e, label: 'RAG_NRM', desc: 'Unswap Right Alt and Win/Cmd.' },
  { code: 0x5c0f, label: 'GUI_ON', desc: 'Enable the Win/Cmd keys.' },
  { code: 0x5c06, label: 'GUI_OFF', desc: 'Disable the GUI keys.' },
  { code: 0x5c07, label: 'GE_SWAP', desc: 'Swap ` and Escape.' },
  { code: 0x5c11, label: 'GE_NORM', desc: 'Unswap ` and Escape.' },
  { code: 0x5c08, label: 'BS_SWAP', desc: 'Swap  and Backspace.' },
  { code: 0x5c12, label: 'BS_NORM', desc: 'Unswap  and Backspace.' },
  { code: 0x5c15, label: 'NK_TOGG', desc: 'Toggle N-key rollover.' },
  { code: 0x5c09, label: 'NK_ON', desc: 'Enable N-key rollover.' },
  { code: 0x5c13, label: 'NK_OFF', desc: 'Disable N-key rollover.' },
  {
    code: 0x5c0a,
    label: 'AG_SWAP',
    desc: 'Swap Alt and Win/Cmd on both sides.',
  },
  { code: 0x5c14, label: 'AG_NORM', desc: 'Unswap Alt and GUI on both sides.' },
  {
    code: 0x5c16,
    label: 'AG_TOGG',
    desc: 'Toggle Alt and Win/Cmd swap on both sides.',
  },
];
const looseKeys: IKeymap[] = looseList.map((item: LooseType) => {
  return {
    code: item.code,
    isAny: false,
    keycodeInfo: {
      code: item.code,
      label: item.label,
      name: { short: '', long: '' },
    },
    categories: ['Loose-Keycode'],
    desc: item.desc,
  };
});

const swapHandsKeys: IKeymap[] = [
  {
    option: OP_SH_TOGGLE,
    label: 'SH_TG',
    desc: 'Toggles swap on and off with every key press.',
  },
  {
    option: OP_SH_TAP_TOGGLE,
    label: 'SH_TT',
    desc: 'Toggles with a tap; momentary when held.',
  },
  {
    option: OP_SH_ON_OFF,
    label: 'SH_MON',
    desc:
      'Swaps hands when pressed, returns to normal when released (momentary).',
  },
  {
    option: OP_SH_OFF_ON,
    label: 'SH_MOFF',
    desc: 'Momentarily turns off swap.',
  },
  {
    option: OP_SH_OFF,
    label: 'SH_OFF',
    desc:
      'Turn off swapping and leaves it off. Good for returning to a known state.',
  },
  {
    option: OP_SH_ON,
    label: 'SH_ON',
    desc: 'Turns on swapping and leaves it on.',
  },
  {
    option: OP_SH_ONESHOT,
    label: 'SH_ON',
    desc: 'One shot swap hands: toggles while pressed or until next key press.',
  },
].map((item) => {
  return {
    code: NO_KEYCODE,
    isAny: false,
    keycodeInfo: {
      code: NO_KEYCODE,
      label: item.label,
      name: { short: '', long: '' },
    },
    categories: ['Swap-Hands'],
    option: item.option,
    desc: item.desc,
  };
});

export const findSwapHandsOptionKeymap = (
  option: ISwapHandsOption
): IKeymap => {
  const list = swapHandsKeys;
  return list.find((item) => {
    return item.option === option;
  })!;
};
