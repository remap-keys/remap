import React from 'react';
import './TabKey.scss';
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
  MOD_LEFT,
  MomentaryComposition,
  OneShotLayerComposition,
  OneShotModComposition,
  SwapHandsComposition,
  ToComposition,
  ToggleLayerComposition,
} from '../../../services/hid/Composition';

import AutocompleteKeys from './AutocompleteKeys';
import Modifiers from './Modifiers';
import { IKeymap } from '../../../services/hid/Hid';
import { KeyCategory } from '../../../services/hid/KeyCategoryList';

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
export default class TabKey extends React.Component<OwnProps, OwnState> {
  private static basicKeymaps: IKeymap[];
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {};
    if (!TabKey.basicKeymaps) {
      const layerCount = this.props.layerCount;
      TabKey.basicKeymaps = [
        ...KeyCategory.basic(),
        ...KeyCategory.symbol(),
        ...KeyCategory.functions(),
        ...KeyCategory.layer(layerCount),
        ...LayerModComposition.genKeymaps(layerCount),
        ...OneShotModComposition.genKeymaps(),
        ...KeyCategory.special(),
        ...KeyCategory.device(),
        ...KeyCategory.macro(),
      ];
    }
  }

  static isAvailable(code: number): boolean {
    const f = new KeycodeCompositionFactory(code);
    return (
      f.isBasic() ||
      f.isMods() ||
      f.isFunction() ||
      f.isTo() ||
      f.isMomentary() ||
      f.isDefLayer() ||
      f.isLayerTapToggle() ||
      f.isOneShotLayer() ||
      f.isOneShotMod() ||
      f.isLooseKeycode() ||
      (f.isSwapHands() && SwapHandsComposition.isSwapHandsOptions(code)) ||
      f.isToggleLayer() ||
      f.isLayerMod()
    );
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
    if (this.props.value === null) return true;

    const code = parseInt(this.props.hexCode, 16);
    const factory = new KeycodeCompositionFactory(code);
    const flag = !(
      (factory.isBasic() && !factory.isBasicFunc()) ||
      factory.isMods() ||
      factory.isLayerMod() ||
      factory.isOneShotMod() ||
      factory.isModTap() ||
      factory.isLayerTap() ||
      (factory.isSwapHands() && !SwapHandsComposition.isSwapHandsOptions(code))
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

    const keymap: IKeymap = JSON.parse(JSON.stringify(opt));
    keymap.direction = direction;
    const kinds = keymap.kinds;
    if (kinds.includes('basic') || kinds.includes('special')) {
      if (mods.length === 0) {
        keymap.modifiers = [];
        comp = new BasicComposition(keymap);
      } else if (keymap.kinds.includes('embed_function')) {
        // KC_FN* key is not allowed to add modifier(s)
        keymap.modifiers = [];
        keymap.direction = MOD_LEFT;
        comp = new BasicComposition(keymap);
      } else {
        keymap.modifiers = mods;
        comp = new ModsComposition(direction, mods, keymap);
      }
    } else if (kinds.includes('mods')) {
      keymap.modifiers = mods;
      comp = new ModsComposition(direction, mods, keymap);
    } else if (kinds.includes('function')) {
      comp = new FunctionComposition(keymap.option!);
    } else if (kinds.includes('to')) {
      comp = new ToComposition(keymap.option!);
    } else if (kinds.includes('momentary')) {
      comp = new MomentaryComposition(keymap.option!);
    } else if (kinds.includes('def_layer')) {
      comp = new DefLayerComposition(keymap.option!);
    } else if (kinds.includes('layer_tap_toggle')) {
      comp = new LayerTapToggleComposition(keymap.option!);
    } else if (kinds.includes('one_shot_layer')) {
      comp = new OneShotLayerComposition(keymap.option!);
    } else if (kinds.includes('one_shot_mod')) {
      keymap.modifiers = mods;
      comp = new OneShotModComposition(keymap.direction!, keymap.modifiers!);
    } else if (kinds.includes('loose_keycode')) {
      comp = new LooseKeycodeComposition(keymap);
    } else if (kinds.includes('swap_hands')) {
      comp = new SwapHandsComposition(keymap.option as ISwapHandsOption);
    } else if (kinds.includes('toggle_layer')) {
      comp = new ToggleLayerComposition(keymap.option!);
    } else if (kinds.includes('layer_mod')) {
      const layer = keymap.option!;
      keymap.modifiers = mods;
      comp = new LayerModComposition(layer, mods);
    } else {
      throw new Error(
        `NOT TO BE HERE. code: ${keymap.code}, categories: ${keymap.kinds}, direction: ${keymap.direction}, modifiers: ${keymap.modifiers}`
      );
    }

    const code: number = comp.getCode();
    keymap.code = code;
    this.props.onChangeKey(keymap);
  }

  private onChangeKeycode(opt: IKeymap | null) {
    if (opt === null) return;

    const direction = opt.kinds[0] === 'layer_mod' ? MOD_LEFT : this.direction;
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
          keycodeOptions={TabKey.basicKeymaps}
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
