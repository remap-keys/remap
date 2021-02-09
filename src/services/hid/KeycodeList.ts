import { IKeycodeCategoryInfo, IKeymap } from './Hid';
import {
  keycodesBasic,
  keycodesBasicF,
  keycodesBasicLetter,
  keycodesBasicLock,
  keycodesBasicModifier,
  keycodesBasicNumber,
  keycodesBasicPunctuation,
  keycodesBasicSpacing,
  keycodesBasicAll,
  keycodesBasicFunc,
} from './assets/KeycodesBasic';
import { keycodesLayers } from './assets/KeycodesLayers';
import { keycodesLighting } from './assets/KeycodesLighting';
import { keycodesMacro } from './assets/KeycodesMacro';
import { keycodesMedia } from './assets/KeycodesMedia';
import { keycodesNumber } from './assets/KeycodesNumber';
import { keycodesSpecial } from './assets/KeycodesSpecial';
import { keycodeInfoList } from './KeycodeInfoList';
import {
  IMod,
  IModDirection,
  ISwapHandsOption,
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_LEFT,
  MOD_RIGHT,
  MOD_SFT,
  OP_SH_OFF,
  OP_SH_OFF_ON,
  OP_SH_ON,
  OP_SH_ONESHOT,
  OP_SH_ON_OFF,
  OP_SH_TAP_TOGGLE,
  OP_SH_TOGGLE,
} from './Composition';
import { buildModCode } from '../../components/configure/customkey/Modifiers';
export type KeymapCategory =
  | 'Basic'
  | 'Def-Layer'
  | 'F'
  | 'Func'
  | 'Function'
  | 'Layers'
  | 'Hold-Layer'
  | 'Layer-Mod'
  | 'Layer-Tap-Toggle'
  | 'Letter'
  | 'Lighting'
  | 'Loose-Keycode'
  | 'Lock'
  | 'Macro'
  | 'Media'
  | 'Mod-Tap'
  | 'Modifier'
  | 'Momentary-Layer'
  | 'Number'
  | 'One-Shot-Layer'
  | 'One-Shot-Mod'
  | 'Punctuation'
  | 'Spacing'
  | 'Special'
  | 'Swap-Hands'
  | 'To'
  | 'Toggle-Layer';

const NO_KEYCODE = -1;

const DIRECTION_LABELS = ['Left', 'Right'];

export class KeycodeList {
  private static _basicKeymaps: IKeymap[];
  private static _layerKeymaps: IKeymap[];
  private static _lightingKeymaps: IKeymap[];
  private static _macroKeymaps: IKeymap[];
  private static _mediaKeymaps: IKeymap[];
  private static _numberKeymaps: IKeymap[];
  private static _specialKeymaps: IKeymap[];
  private static _functionKeymaps: IKeymap[];
  private static _toKeymaps: IKeymap[];
  private static _layerModKeymaps: IKeymap[];
  private static _momentaryLayerKeymaps: IKeymap[];
  private static _defLayerKeymaps: IKeymap[];
  private static _layerTapToggleKeymaps: IKeymap[];
  private static _toggleLayerKeymaps: IKeymap[];
  private static _oneShotLayerKeymaps: IKeymap[];
  private static _oneShotModKeymaps: IKeymap;
  private static _looseKeycodeKeymaps: IKeymap[];
  private static _swapHandsOptionKeymaps: IKeymap[];
  private static _modTapKeymaps: IKeymap[];
  private static _holdLayerKeymaps: IKeymap[];
  private static _swapHandsKeyOptionKeymap: IKeymap;

  private static createKeymap(
    code: number,
    categories: KeymapCategory[]
  ): IKeymap {
    return {
      code,
      isAny: false,
      categories: categories,
      keycodeInfo: keycodeInfoList.find((keycode) => keycode.code === code)!,
    };
  }

  static getKeymap(code: number): IKeymap {
    const keycodeInfo = keycodeInfoList.find(
      (keycodeInfo) => keycodeInfo.code === code
    );

    const findCategories = (code: number) => {
      const list: IKeycodeCategoryInfo[] = [
        keycodesBasicF,
        keycodesBasicLetter,
        keycodesBasicLock,
        keycodesBasicModifier,
        keycodesBasicNumber,
        keycodesBasicPunctuation,
        keycodesBasicSpacing,
        keycodesLayers,
        keycodesLighting,
        keycodesMacro,
        keycodesMedia,
        keycodesNumber,
        keycodesSpecial,
      ];
      return list.find((info) => {
        return info.codes.includes(code);
      });
    };

    if (keycodeInfo) {
      const category: IKeycodeCategoryInfo | undefined = findCategories(
        keycodeInfo?.code
      );
      const categories: KeymapCategory[] = category ? category.categories : [];

      return {
        code,
        isAny: false,
        categories,
        keycodeInfo,
      };
    } else {
      return {
        code,
        isAny: true,
        categories: [],
      };
    }
  }

  // DEPRECATED
  static get basicAllKeymaps(): IKeymap[] {
    return keycodesBasicAll.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesBasicAll.categories)
    );
  }

  static get basicKeymaps(): IKeymap[] {
    if (KeycodeList._basicKeymaps) return KeycodeList._basicKeymaps;

    const list: IKeycodeCategoryInfo[] = [
      keycodesBasic,
      keycodesBasicLetter,
      keycodesBasicNumber,
      keycodesBasicPunctuation,
      keycodesBasicModifier,
      keycodesBasicLock,
      keycodesBasicF,
      keycodesBasicFunc,
    ];
    KeycodeList._basicKeymaps = [];
    list.forEach((info) => {
      const categories = info.categories;
      info.codes.forEach((code) => {
        KeycodeList._basicKeymaps.push(
          KeycodeList.createKeymap(code, categories)
        );
      });
    });

    return KeycodeList._basicKeymaps;
  }

  static get layersKeymaps(): IKeymap[] {
    if (KeycodeList._layerKeymaps) return KeycodeList._layerKeymaps;

    KeycodeList._layerKeymaps = keycodesLayers.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesLayers.categories)
    );
    return KeycodeList._layerKeymaps;
  }

  static get lightingKeymaps(): IKeymap[] {
    if (KeycodeList._lightingKeymaps) return KeycodeList._lightingKeymaps;

    KeycodeList._lightingKeymaps = keycodesLighting.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesLighting.categories)
    );
    return KeycodeList._lightingKeymaps;
  }

  static get macroKeymaps(): IKeymap[] {
    if (KeycodeList._macroKeymaps) return KeycodeList._macroKeymaps;

    KeycodeList._macroKeymaps = keycodesMacro.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesMacro.categories)
    );

    return KeycodeList._macroKeymaps;
  }

  static get mediaKeymaps(): IKeymap[] {
    if (KeycodeList._mediaKeymaps) return KeycodeList._mediaKeymaps;

    KeycodeList._mediaKeymaps = keycodesMedia.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesMedia.categories)
    );
    return KeycodeList._mediaKeymaps;
  }

  static get numberKeymaps(): IKeymap[] {
    if (KeycodeList._numberKeymaps) return KeycodeList._numberKeymaps;

    KeycodeList._numberKeymaps = keycodesNumber.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesNumber.categories)
    );
    return KeycodeList._numberKeymaps;
  }

  static get specialKeymaps(): IKeymap[] {
    if (KeycodeList._specialKeymaps) return KeycodeList._specialKeymaps;

    KeycodeList._specialKeymaps = keycodesSpecial.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesSpecial.categories)
    );
    return KeycodeList._specialKeymaps;
  }

  static getFunctionKeymaps(): IKeymap[] {
    KeycodeList._functionKeymaps =
      KeycodeList._functionKeymaps ||
      Array(32)
        .fill(0)
        .map((_, index) => {
          const label = `Func${index}`;
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
    return KeycodeList._functionKeymaps;
  }

  static findFunctionKeymap(functionId: number): IKeymap {
    const list = KeycodeList.getFunctionKeymaps();
    return list.find((item) => item.option === functionId)!;
  }

  static getToKeymaps(layerCount: number): IKeymap[] {
    KeycodeList._toKeymaps =
      KeycodeList._toKeymaps ||
      Array(layerCount)
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

    return KeycodeList._toKeymaps;
  }

  static findToKeymap(layer: number, layerCount: number): IKeymap {
    const list = KeycodeList.getToKeymaps(layerCount);
    return list.find((item) => item.option === layer)!;
  }

  static getLayerModKeymaps(layerCount: number): IKeymap[] {
    KeycodeList._layerModKeymaps =
      KeycodeList._layerModKeymaps ||
      Array(layerCount)
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

    return KeycodeList._layerModKeymaps;
  }

  static findLayerModKeymap(layer: number, layerCount: number): IKeymap {
    const list = KeycodeList.getLayerModKeymaps(layerCount);
    return list.find((item) => item.option === layer)!;
  }

  static getMomentaryLayerKeymaps = (layerCount: number): IKeymap[] => {
    KeycodeList._momentaryLayerKeymaps =
      KeycodeList._momentaryLayerKeymaps ||
      Array(layerCount)
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

    return KeycodeList._momentaryLayerKeymaps;
  };

  static findMomentaryLayerKeymap(layer: number, layerCount: number): IKeymap {
    const list = KeycodeList.getMomentaryLayerKeymaps(layerCount);
    return list.find((item) => item.option === layer)!;
  }

  static getDefLayerKeymaps(layerCount: number): IKeymap[] {
    KeycodeList._defLayerKeymaps =
      KeycodeList._defLayerKeymaps ||
      Array(layerCount)
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
    return KeycodeList._defLayerKeymaps;
  }

  static findDefLayerKeymap = (layer: number, layerCount: number): IKeymap => {
    const list = KeycodeList.getDefLayerKeymaps(layerCount);
    return list.find((item) => item.option === layer)!;
  };

  static getLayerTapToggleKeymaps = (layerCount: number): IKeymap[] => {
    KeycodeList._layerTapToggleKeymaps =
      KeycodeList._layerTapToggleKeymaps ||
      Array(layerCount)
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

    return KeycodeList._layerTapToggleKeymaps;
  };

  static findLayerTapToggleKeymap = (
    layer: number,
    layerCount: number
  ): IKeymap => {
    const list = KeycodeList.getLayerTapToggleKeymaps(layerCount);
    return list.find((item) => item.option === layer)!;
  };

  static getToggleLayerKeymaps(layerCount: number): IKeymap[] {
    KeycodeList._toggleLayerKeymaps =
      KeycodeList._toggleLayerKeymaps ||
      Array(layerCount)
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

    return KeycodeList._toggleLayerKeymaps;
  }

  static findToggleLayerKeymap(layer: number, layerCount: number): IKeymap {
    const list = KeycodeList.getToggleLayerKeymaps(layerCount);
    return list.find((item) => item.option === layer)!;
  }

  static getOneShotLayerKeymaps(layerCount: number): IKeymap[] {
    KeycodeList._oneShotLayerKeymaps =
      KeycodeList._oneShotLayerKeymaps ||
      Array(layerCount)
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

    return KeycodeList._oneShotLayerKeymaps;
  }

  static findOneShotLayerKeymap(layer: number, layerCount: number): IKeymap {
    const list = KeycodeList.getOneShotLayerKeymaps(layerCount);
    return list.find((item) => item.option === layer)!;
  }

  static getOneShotModKeymap(): IKeymap {
    KeycodeList._oneShotModKeymaps = KeycodeList._oneShotModKeymaps || {
      code: NO_KEYCODE,
      isAny: false,
      keycodeInfo: {
        code: NO_KEYCODE,
        label: `OSM`,
        name: { short: '', long: '' },
      },
      categories: ['One-Shot-Mod'],
      desc: `Momentarily activates modifier(s) until the next key is pressed.`,
    };

    return KeycodeList._oneShotModKeymaps;
  }

  static findOneShotModKeymap(mods: IMod[], direction: IModDirection): IKeymap {
    const osm = KeycodeList.getOneShotModKeymap();
    osm.modifiers = mods;
    osm.direction = direction;
    return osm;
  }

  static getLooseKeycodeKeymaps(): IKeymap[] {
    if (KeycodeList._looseKeycodeKeymaps)
      return KeycodeList._looseKeycodeKeymaps;
    const looseList = [
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
      {
        code: 0x5c02,
        label: 'CL_SWAP',
        desc: 'Swap Caps Lock and Left Control.',
      },
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
      {
        code: 0x5c14,
        label: 'AG_NORM',
        desc: 'Unswap Alt and GUI on both sides.',
      },
      {
        code: 0x5c16,
        label: 'AG_TOGG',
        desc: 'Toggle Alt and Win/Cmd swap on both sides.',
      },
    ];
    KeycodeList._looseKeycodeKeymaps = looseList.map((item) => {
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
    return KeycodeList._looseKeycodeKeymaps;
  }

  static getSwapHnadsOptionKeymaps(): IKeymap[] {
    KeycodeList._swapHandsOptionKeymaps =
      KeycodeList._swapHandsOptionKeymaps ||
      [
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
          desc:
            'One shot swap hands: toggles while pressed or until next key press.',
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
    return KeycodeList._swapHandsOptionKeymaps;
  }

  static findSwapHandsOptionKeymap(option: ISwapHandsOption): IKeymap {
    const list = KeycodeList.getSwapHnadsOptionKeymaps();
    return list.find((item) => {
      return item.option === option;
    })!;
  }

  static getModTapKeymaps() {
    if (KeycodeList._modTapKeymaps) return KeycodeList._modTapKeymaps;

    function modtap(
      hold: string,
      mods: IMod[],
      direction: IModDirection
    ): IKeymap {
      return {
        code: NO_KEYCODE,
        isAny: false,
        keycodeInfo: {
          code: NO_KEYCODE,
          label: `(${DIRECTION_LABELS[direction]}) ${hold}`,
          name: { short: '', long: '' },
        },
        categories: ['Mod-Tap'],
        desc: '',
        modifiers: mods,
        direction: direction,
      };
    }

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

    const holdLeftModKeys: IKeymap[] = Object.keys(holdKeys).map((hold) =>
      modtap(hold, holdKeys[hold], MOD_LEFT)
    );

    const holdRightModKeys: IKeymap[] = Object.keys(holdKeys).map((hold) =>
      modtap(hold, holdKeys[hold], MOD_RIGHT)
    );

    KeycodeList._modTapKeymaps = [...holdLeftModKeys, ...holdRightModKeys];
    return KeycodeList._modTapKeymaps;
  }

  static findModTapKeymap(mods: IMod[], direction: IModDirection): IKeymap {
    return KeycodeList._modTapKeymaps.find((item) => {
      const modCode = buildModCode(mods);
      return (
        item.direction === direction &&
        buildModCode(item.modifiers!) === modCode
      );
    })!;
  }

  static getHoldLayerKeymaps(layerCount: number): IKeymap[] {
    KeycodeList._holdLayerKeymaps = KeycodeList._holdLayerKeymaps = Array(
      layerCount
    )
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

    return KeycodeList._holdLayerKeymaps;
  }

  static findHoldLayerKeymap = (layer: number, layerCount: number): IKeymap => {
    const list = KeycodeList.getHoldLayerKeymaps(layerCount);
    return list.find((item) => item.option === layer)!;
  };

  static getSwapHandsKeyOptionKeymap(): IKeymap {
    if (KeycodeList._swapHandsKeyOptionKeymap)
      return KeycodeList._swapHandsKeyOptionKeymap;

    KeycodeList._swapHandsKeyOptionKeymap = {
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
    return KeycodeList._swapHandsKeyOptionKeymap;
  }
}
