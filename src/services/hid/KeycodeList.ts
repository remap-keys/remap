import { IKeycodeCategoryInfo, IKeymap } from './Hid';
import { keycodeInfoList } from './KeycodeInfoList';
import {
  IKeycodeCompositionKind,
  KeycodeCompositionFactory,
  LayerTapToggleComposition,
  LooseKeycodeComposition,
  MomentaryComposition,
  OneShotLayerComposition,
  ToComposition,
  ToggleLayerComposition,
} from './Composition';

import {
  keycodesBasic,
  keycodesBasicApp,
  keycodesBasicF,
  keycodesBasicInt,
  keycodesBasicLang,
  keycodesBasicLetter,
  keycodesBasicCommand,
  keycodesBasicMedia,
  keycodesBasicMouse,
  keycodesBasicNumber,
  keycodesBasicNumpad,
  keycodesBasicPunctuation,
  keycodesBasicSpacing,
  keycodesBasicFunc,
  keycodesBasicModifier,
} from './assets/KeycodesBasic';
import { keycodesLighting } from './assets/KeycodesLighting';

export type KeymapCategory =
  | IKeycodeCompositionKind
  | 'any'
  | 'app'
  | 'command'
  | 'f'
  | 'func'
  | 'int'
  | 'lang'
  | 'layers'
  | 'letter'
  | 'lighting'
  | 'media'
  | 'mods'
  | 'mouse'
  | 'number'
  | 'numpad'
  | 'punctuation'
  | 'spacing'
  | 'special'
  | 'us-symbol';

export class KeycodeList {
  private static _basicKeymaps: IKeymap[];
  private static _layerKeymaps: IKeymap[];
  private static _lightingKeymaps: IKeymap[];
  private static _mediaKeymaps: IKeymap[];

  private static createKeymap(code: number, kinds: KeymapCategory[]): IKeymap {
    return {
      code,
      isAny: false,
      kinds: kinds,
      keycodeInfo: keycodeInfoList.find((keycode) => keycode.code === code)!,
    };
  }
  static getBasicKeymap(code: number): IKeymap {
    const basic = KeycodeList.basicKeymaps.find((km) => km.code === code);
    if (basic) {
      return basic;
    } else {
      throw new Error(`No such basic keycode: ${code}`);
    }
  }

  static getKeymaps(
    hex: number
  ): {
    value: IKeymap | null;
    holdKey: IKeymap | null;
    tapKey: IKeymap | null;
  } {
    const factory = new KeycodeCompositionFactory(hex);
    var ret: {
      value: IKeymap | null;
      holdKey: IKeymap | null;
      tapKey: IKeymap | null;
    } = {
      value: null,
      holdKey: null,
      tapKey: null,
    };
    if (factory.isBasic()) {
      const comp = factory.createBasicComposition();
      const opt = comp.genKeymap();
      ret.value = opt;
    } else if (factory.isMods()) {
      const comp = factory.createModsComposition();
      ret.value = comp.genKeymap();
    } else if (factory.isFunction()) {
      const comp = factory.createFunctionComposition();
      ret.value = comp.genKeymap();
    } else if (factory.isTo()) {
      const comp = factory.createToComposition();
      ret.value = comp.genKeymap();
    } else if (factory.isMomentary()) {
      const comp = factory.createMomentaryComposition();
      ret.value = comp.genKeymap();
    } else if (factory.isDefLayer()) {
      const comp = factory.createDefLayerComposition();
      ret.value = comp.genKeymap();
    } else if (factory.isLayerTapToggle()) {
      const comp = factory.createLayerTapToggleComposition();
      ret.value = comp.genKeymap();
    } else if (factory.isToggleLayer()) {
      const comp = factory.createToggleLayerComposition();
      ret.value = comp.genKeymap();
    } else if (factory.isLayerMod()) {
      const comp = factory.createLayerModComposition();
      ret.value = comp.genKeymap();
    } else if (factory.isOneShotLayer()) {
      const comp = factory.createOneShotLayerComposition();
      ret.value = comp.genKeymap();
    } else if (factory.isOneShotMod()) {
      const comp = factory.createOneShotModComposition();
      ret.value = comp.genKeymap();
    } else if (factory.isLooseKeycode()) {
      const comp = factory.createLooseKeycodeComposition();
      const opt = comp.genKeymap();
      ret.value = opt;
    } else if (factory.isSwapHands()) {
      const comp = factory.createSwapHandsComposition();
      if (comp.isSwapHandsOption()) {
        ret.value = comp.genKeymap();
      } else {
        ret.holdKey = comp.genKeymap();
        ret.tapKey = comp.genTapKey();
      }
    } else if (factory.isModTap()) {
      const comp = factory.createModTapComposition();
      ret.holdKey = comp.genKeymap();
      ret.tapKey = comp.genTapKey();
    } else if (factory.isLayerTap()) {
      const comp = factory.createLayerTapComposition();
      ret.holdKey = comp.genKeymap();
      ret.tapKey = comp.genTapKey();
    } else {
      ret.value = {
        code: hex,
        isAny: true,
        kinds: ['any'],
        keycodeInfo: {
          code: hex,
          label: 'Any',
          name: {
            short: 'any',
            long: 'any',
          },
        },
      };
    }

    return ret;
  }

  static getKeymap(code: number): IKeymap {
    const { value, holdKey, tapKey } = KeycodeList.getKeymaps(code);
    if (value) {
      return value;
    }
    const holdKeymap = JSON.parse(JSON.stringify(holdKey));
    const tapKeymap = JSON.parse(JSON.stringify(tapKey));
    holdKeymap.keycodeInfo = tapKeymap.keycodeInfo;
    return holdKeymap;
  }

  static get basicKeymaps(): IKeymap[] {
    if (KeycodeList._basicKeymaps) return KeycodeList._basicKeymaps;

    const list: IKeycodeCategoryInfo[] = [
      keycodesBasic,
      keycodesBasicLetter,
      keycodesBasicPunctuation,
      keycodesBasicNumber,
      keycodesBasicModifier,
      keycodesBasicSpacing,
      keycodesBasicCommand,
      keycodesBasicF,
      keycodesBasicFunc,
      keycodesBasicNumpad,
      keycodesBasicMedia,
      keycodesBasicApp,
      keycodesBasicMouse,
      keycodesBasicInt,
      keycodesBasicLang,
    ];

    KeycodeList._basicKeymaps = [];
    list.forEach((info) => {
      const kinds = info.kinds;
      info.codes.forEach((code) => {
        KeycodeList._basicKeymaps.push(KeycodeList.createKeymap(code, kinds));
      });
    });

    return KeycodeList._basicKeymaps;
  }

  static getLayersKeymaps(layerCount: number): IKeymap[] {
    if (KeycodeList._layerKeymaps) return KeycodeList._layerKeymaps;

    KeycodeList._layerKeymaps = [
      ...MomentaryComposition.genKeymaps(layerCount),
      ...ToggleLayerComposition.genKeymaps(layerCount),
      ...LayerTapToggleComposition.genKeymaps(layerCount),
      ...OneShotLayerComposition.genKeymaps(layerCount),
      ...ToComposition.genKeymaps(layerCount),
    ];
    return KeycodeList._layerKeymaps;
  }

  static get lightingKeymaps(): IKeymap[] {
    if (KeycodeList._lightingKeymaps) return KeycodeList._lightingKeymaps;

    KeycodeList._lightingKeymaps = keycodesLighting.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesLighting.kinds)
    );
    return KeycodeList._lightingKeymaps;
  }

  static get mediaKeymaps(): IKeymap[] {
    if (KeycodeList._mediaKeymaps) return KeycodeList._mediaKeymaps;

    KeycodeList._mediaKeymaps = keycodesBasicMedia.codes.map((code) =>
      KeycodeList.createKeymap(code, keycodesBasicMedia.kinds)
    );
    return KeycodeList._mediaKeymaps;
  }

  static get specialKeymaps(): IKeymap[] {
    return LooseKeycodeComposition.genKeymaps();
  }
}
