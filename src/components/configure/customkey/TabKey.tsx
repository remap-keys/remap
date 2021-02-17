import React from 'react';
import './TabKey.scss';
import {
  IMod,
  IModDirection,
  KeycodeCompositionFactory,
  LayerModComposition,
  ModsComposition,
  MOD_LEFT,
  OneShotModComposition,
  SwapHandsComposition,
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
        // ...KeyCategory.macro(),
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

    function isAvailableModifiers(code: number) {
      const factory = new KeycodeCompositionFactory(code);
      const flag =
        (factory.isBasic() && !factory.isBasicFunc()) ||
        factory.isMods() ||
        factory.isLayerMod() ||
        factory.isOneShotMod();
      return flag;
    }

    const code = parseInt(this.props.hexCode, 16);
    return !isAvailableModifiers(code);
  }

  get disabledDirection() {
    const factory = new KeycodeCompositionFactory(
      parseInt(this.props.hexCode, 16)
    );
    return factory.isLayerMod();
  }

  private emitOnChange(opt: IKeymap, direction: IModDirection, mods: IMod[]) {
    const keymap: IKeymap = JSON.parse(JSON.stringify(opt));
    keymap.modifiers = mods;
    keymap.direction = direction;

    /**
     * If it is available for using modifiers(basic(w/o embed-func), modifier, one_shot_mod, layer_mod),
     * the key's code should be calculated.
     */
    const kinds = keymap.kinds;
    if (kinds.includes('one_shot_mod')) {
      keymap.code = new OneShotModComposition(direction, mods).getCode();
    } else if (kinds.includes('layer_mod')) {
      const layer = keymap.option!;
      keymap.direction = MOD_LEFT;
      keymap.code = new LayerModComposition(layer, mods).getCode();
    } else {
      const f = new KeycodeCompositionFactory(opt.code);
      if (f.isBasic() || f.isMods()) {
        keymap.code = new ModsComposition(direction, mods, opt).getCode();
      } else {
        keymap.modifiers = [];
        keymap.direction = MOD_LEFT;
      }
    }

    this.props.onChangeKey(keymap);
  }

  private onChangeKeycode(opt: IKeymap | null) {
    if (opt === null) return;

    this.emitOnChange(opt, this.direction, this.modifiers);
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
