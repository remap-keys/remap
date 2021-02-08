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
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_LEFT,
  MOD_RIGHT,
  MOD_SFT,
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

export class KeycodeList {
  private static _basicKeymaps: IKeymap[];
  private static _keycodesLayers: IKeymap[];
  private static _keycodesLighting: IKeymap[];
  private static _keycodesMacro: IKeymap[];
  private static _keycodesMedia: IKeymap[];
  private static _keycodesNumber: IKeymap[];
  private static _keycodesSpecial: IKeymap[];
  private static _keycodesFunction: IKeymap[];
  private static _keycodesTo: IKeymap[];
  private static _keycodesLayerMod: IKeymap[];
  private static _keycodesMomentaryLayer: IKeymap[];
  private static _keycodesDefLayer: IKeymap[];
  private static _keycodesLayerTapToggle: IKeymap[];
  private static _keycodesToggleLayer: IKeymap[];
  private static _keycodesOneShotLayer: IKeymap[];
  private static _keycodesOneShotMod: IKeymap[];

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
    if (KeycodeList._keycodesLayers) return KeycodeList._keycodesLayers;

    KeycodeList._keycodesLayers = keycodesLayers.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesLayers.categories)
    );
    return KeycodeList._keycodesLayers;
  }

  static get lightingKeymaps(): IKeymap[] {
    if (KeycodeList._keycodesLighting) return KeycodeList._keycodesLighting;

    KeycodeList._keycodesLighting = keycodesLighting.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesLighting.categories)
    );
    return KeycodeList._keycodesLighting;
  }

  static get macroKeymaps(): IKeymap[] {
    if (KeycodeList._keycodesMacro) return KeycodeList._keycodesMacro;

    KeycodeList._keycodesMacro = keycodesMacro.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesMacro.categories)
    );

    return KeycodeList._keycodesMacro;
  }

  static get mediaKeymaps(): IKeymap[] {
    if (KeycodeList._keycodesMedia) return KeycodeList._keycodesMedia;

    KeycodeList._keycodesMedia = keycodesMedia.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesMedia.categories)
    );
    return KeycodeList._keycodesMedia;
  }

  static get numberKeymaps(): IKeymap[] {
    if (KeycodeList._keycodesNumber) return KeycodeList._keycodesNumber;

    KeycodeList._keycodesNumber = keycodesNumber.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesNumber.categories)
    );
    return KeycodeList._keycodesNumber;
  }

  static get specialKeymaps(): IKeymap[] {
    if (KeycodeList._keycodesSpecial) return KeycodeList._keycodesSpecial;

    KeycodeList._keycodesSpecial = keycodesSpecial.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesSpecial.categories)
    );
    return KeycodeList._keycodesSpecial;
  }

  static getFunctionKeymaps(): IKeymap[] {
    KeycodeList._keycodesFunction =
      KeycodeList._keycodesFunction ||
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
    return KeycodeList._keycodesFunction;
  }

  static findFunctionKeymap(functionId: number): IKeymap {
    const list = KeycodeList.getFunctionKeymaps();
    return list.find((item) => item.option === functionId)!;
  }

  static getTos(layerCount: number): IKeymap[] {
    KeycodeList._keycodesTo =
      KeycodeList._keycodesTo ||
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

    return KeycodeList._keycodesTo;
  }

  static findToKeymap(layer: number, layerCount: number): IKeymap {
    const list = KeycodeList.getTos(layerCount);
    return list.find((item) => item.option === layer)!;
  }

  static getLayerMods(layerCount: number): IKeymap[] {
    KeycodeList._keycodesLayerMod =
      KeycodeList._keycodesLayerMod ||
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

    return KeycodeList._keycodesLayerMod;
  }

  static findLayerModKeymap(layer: number, layerCount: number): IKeymap {
    const list = KeycodeList.getLayerMods(layerCount);
    return list.find((item) => item.option === layer)!;
  }

  static getMomentaryLayers = (layerCount: number): IKeymap[] => {
    KeycodeList._keycodesMomentaryLayer =
      KeycodeList._keycodesMomentaryLayer ||
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

    return KeycodeList._keycodesMomentaryLayer;
  };

  static findMomentaryLayerKeymap(layer: number, layerCount: number): IKeymap {
    const list = KeycodeList.getMomentaryLayers(layerCount);
    return list.find((item) => item.option === layer)!;
  }

  static getDefLayers(layerCount: number): IKeymap[] {
    KeycodeList._keycodesDefLayer =
      KeycodeList._keycodesDefLayer ||
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
    return KeycodeList._keycodesDefLayer;
  }

  static findDefLayerKeymap = (layer: number, layerCount: number): IKeymap => {
    const list = KeycodeList.getDefLayers(layerCount);
    return list.find((item) => item.option === layer)!;
  };

  static getLayerTapToggles = (layerCount: number): IKeymap[] => {
    KeycodeList._keycodesLayerTapToggle =
      KeycodeList._keycodesLayerTapToggle ||
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

    return KeycodeList._keycodesLayerTapToggle;
  };

  static findLayerTapToggleKeymap = (
    layer: number,
    layerCount: number
  ): IKeymap => {
    const list = KeycodeList.getLayerTapToggles(layerCount);
    return list.find((item) => item.option === layer)!;
  };

  static getToggleLayers(layerCount: number): IKeymap[] {
    KeycodeList._keycodesToggleLayer =
      KeycodeList._keycodesToggleLayer ||
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

    return KeycodeList._keycodesToggleLayer;
  }

  static findToggleLayerKeymap(layer: number, layerCount: number): IKeymap {
    const list = KeycodeList.getToggleLayers(layerCount);
    return list.find((item) => item.option === layer)!;
  }

  static getOneShotLayers(layerCount: number): IKeymap[] {
    KeycodeList._keycodesOneShotLayer =
      KeycodeList._keycodesOneShotLayer ||
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

    return KeycodeList._keycodesOneShotLayer;
  }

  static findOneShotLayerKeymap(layer: number, layerCount: number): IKeymap {
    const list = KeycodeList.getOneShotLayers(layerCount);
    return list.find((item) => item.option === layer)!;
  }

  static getOneShotMods(): IKeymap[] {
    if (KeycodeList._keycodesOneShotMod) return KeycodeList._keycodesOneShotMod;

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
    KeycodeList._keycodesOneShotMod = [...left, ...right];
    return KeycodeList._keycodesOneShotMod;
  }

  static findOneShotModKeymap(mods: IMod[], direction: IModDirection): IKeymap {
    const modsCode = buildModCode(mods);
    const list = KeycodeList.getOneShotMods();
    return list.find((item) => {
      return (
        item.direction === direction &&
        buildModCode(item.modifiers!) === modsCode
      );
    })!;
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
}
