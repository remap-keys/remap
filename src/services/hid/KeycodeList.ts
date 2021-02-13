import { IKeymap } from './Hid';

import {
  IKeycodeCompositionKind,
  KeycodeCompositionFactory,
  MOD_LEFT,
} from './Composition';

export type KeymapCategory =
  | IKeycodeCompositionKind
  | 'any'
  | 'app'
  | 'backlight'
  | 'bootmagic'
  | 'cadet'
  | 'command'
  | 'device'
  | 'edit'
  | 'f'
  | 'embed_function'
  | 'grave_escape'
  | 'gui'
  | 'int'
  | 'keyboard'
  | 'lang'
  | 'layers'
  | 'letter'
  | 'lighting'
  | 'lock'
  | 'media'
  | 'mods'
  | 'move'
  | 'mouse'
  | 'number'
  | 'numpad'
  | 'punctuation'
  | 'sound'
  | 'spacing'
  | 'special'
  | 'symbol'
  | 'underglow'
  | 'us-symbol';

export class KeycodeList {
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
        direction: MOD_LEFT,
        modifiers: [],
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
}
