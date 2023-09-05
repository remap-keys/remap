import { ICustomKeycode, IKeymap } from './Hid';
import {
  anyKeymap,
  IKeycodeCompositionKind,
  KeycodeCompositionFactory,
} from './Composition';
import { KeyboardLabelLang } from '../labellang/KeyLabelLangs';
export type KeymapCategory =
  | IKeycodeCompositionKind
  | 'any'
  | 'app'
  | 'ascii'
  | 'backlight'
  | 'bootmagic'
  | 'cadet'
  | 'command'
  | 'device'
  | 'edit'
  | 'f'
  | 'func'
  | 'function'
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
  | 'us-symbol'
  | 'extends'
  | 'bmp'
  | 'combo'
  | 'midi'
  | 'notes'
  | 'octave'
  | 'transpose'
  | 'velocity'
  | 'channel'
  | 'tri_layer'
  | 'misc';

function isDefinedKey(ret: {
  value: IKeymap | null | undefined;
  holdKey: IKeymap | null | undefined;
  tapKey: IKeymap | null | undefined;
}) {
  const v = Boolean(ret.value);
  const h = Boolean(ret.holdKey);
  const t = Boolean(ret.tapKey);
  if (v) {
    return true;
  }

  if (h && t) {
    return true;
  }

  return false;
}

export class KeycodeList {
  static getKeymaps(
    hex: number,
    langLabel: KeyboardLabelLang,
    customKeycodes: ICustomKeycode[] | undefined
  ): {
    value: IKeymap | null;
    holdKey: IKeymap | null;
    tapKey: IKeymap | null;
  } {
    const factory = new KeycodeCompositionFactory(hex, langLabel);
    let ret: {
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
      ret.value = opt || null;
    } else if (factory.isMods()) {
      const comp = factory.createModsComposition();
      ret.value = comp.genKeymap() || null;
    } else if (factory.isTo()) {
      const comp = factory.createToComposition();
      ret.value = comp.genKeymap() || null;
    } else if (factory.isMomentary()) {
      const comp = factory.createMomentaryComposition();
      ret.value = comp.genKeymap();
    } else if (factory.isDefLayer()) {
      const comp = factory.createDefLayerComposition();
      ret.value = comp.genKeymap() || null;
    } else if (factory.isLayerTapToggle()) {
      const comp = factory.createLayerTapToggleComposition();
      ret.value = comp.genKeymap() || null;
    } else if (factory.isToggleLayer()) {
      const comp = factory.createToggleLayerComposition();
      ret.value = comp.genKeymap() || null;
    } else if (factory.isLayerMod()) {
      const comp = factory.createLayerModComposition();
      ret.value = comp.genKeymap() || null;
    } else if (factory.isOneShotLayer()) {
      const comp = factory.createOneShotLayerComposition();
      ret.value = comp.genKeymap() || null;
    } else if (factory.isOneShotMod()) {
      const comp = factory.createOneShotModComposition();
      ret.value = comp.genKeymap() || null;
    } else if (factory.isLooseKeycode()) {
      const comp = factory.createLooseKeycodeComposition();
      const opt = comp.genKeymap();
      ret.value = opt || null;
    } else if (factory.isSwapHands()) {
      const comp = factory.createSwapHandsComposition();
      if (comp.isSwapHandsOption()) {
        ret.value = comp.genKeymap() || null;
      } else {
        ret.holdKey = comp.genKeymap() || null;
        ret.tapKey = comp.genTapKey() || null;
      }
    } else if (factory.isModTap()) {
      const comp = factory.createModTapComposition();
      ret.holdKey = comp.genKeymap() || null;
      ret.tapKey = comp.genTapKey() || null;
    } else if (factory.isLayerTap()) {
      const comp = factory.createLayerTapComposition();
      ret.holdKey = comp.genKeymap() || null;
      ret.tapKey = comp.genTapKey() || null;
    } else if (factory.isViaUserKey()) {
      const comp = factory.createViaUserKeyComposition(customKeycodes);
      ret.value = comp.genKeymap() || null;
    }

    if (!isDefinedKey(ret)) {
      ret = { value: anyKeymap(hex), holdKey: null, tapKey: null };
    }

    return ret;
  }

  static getKeymap(
    code: number,
    labelLang: KeyboardLabelLang,
    customKeycodes: ICustomKeycode[] | undefined
  ): IKeymap {
    const { value, holdKey, tapKey } = KeycodeList.getKeymaps(
      code,
      labelLang,
      customKeycodes
    );
    if (value) {
      return value;
    }
    const holdKeymap = JSON.parse(JSON.stringify(holdKey));
    const tapKeymap = JSON.parse(JSON.stringify(tapKey));
    holdKeymap.keycodeInfo = tapKeymap.keycodeInfo;
    return holdKeymap;
  }
}
