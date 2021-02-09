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
  MOD_LEFT,
  MomentaryComposition,
  OneShotLayerComposition,
  OneShotModComposition,
  SwapHandsComposition,
  ToComposition,
  ToggleLayerComposition,
} from '../../../services/hid/Composition';

import { KeycodeList } from '../../../services/hid/KeycodeList';
import AutocompleteKeys from './AutocompleteKeys';
import Modifiers from './Modifiers';
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
      ...KeycodeList.getLooseKeycodeKeymaps(),
      ...KeycodeList.getToKeymaps(this.props.layerCount),
      ...KeycodeList.getToggleLayerKeymaps(this.props.layerCount),
      ...KeycodeList.getLayerTapToggleKeymaps(this.props.layerCount),
      ...KeycodeList.getMomentaryLayerKeymaps(this.props.layerCount),
      ...KeycodeList.getOneShotLayerKeymaps(this.props.layerCount),
      KeycodeList.getOneShotModKeymap(),
      ...KeycodeList.getDefLayerKeymaps(this.props.layerCount),
      ...KeycodeList.getLayerModKeymaps(this.props.layerCount),
      ...KeycodeList.getSwapHnadsOptionKeymaps(),
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

    const keymap = JSON.parse(JSON.stringify(opt));
    keymap.direction = direction;
    const category = keymap.categories[0];
    if (category === 'Basic') {
      if (mods.length === 0) {
        comp = new BasicComposition(keymap);
      } else if (keymap.categories.includes('Func')) {
        // KC_FN* key is not allowed to add modifier(s)
        keymap.modifiers = [];
        keymap.direction = MOD_LEFT;
        comp = new BasicComposition(keymap);
      } else {
        keymap.modifiers = mods;
        comp = new ModsComposition(direction, mods, keymap);
      }
    } else if (category === 'Modifier') {
      keymap.modifiers = mods;
      comp = new ModsComposition(direction, mods, keymap);
    } else if (category === 'Function') {
      comp = new FunctionComposition(keymap.option!);
    } else if (category === 'To') {
      comp = new ToComposition(keymap.option!);
    } else if (category === 'Momentary-Layer') {
      comp = new MomentaryComposition(keymap.option!);
    } else if (category === 'Def-Layer') {
      comp = new DefLayerComposition(keymap.option!);
    } else if (category === 'Layer-Tap-Toggle') {
      comp = new LayerTapToggleComposition(keymap.option!);
    } else if (category === 'One-Shot-Layer') {
      comp = new OneShotLayerComposition(keymap.option!);
    } else if (category === 'One-Shot-Mod') {
      keymap.modifiers = mods;
      comp = new OneShotModComposition(keymap.direction!, keymap.modifiers!);
    } else if (category === 'Loose-Keycode') {
      comp = new LooseKeycodeComposition(keymap);
    } else if (category === 'Swap-Hands') {
      comp = new SwapHandsComposition(keymap.option as ISwapHandsOption);
    } else if (category === 'Toggle-Layer') {
      comp = new ToggleLayerComposition(keymap.option!);
    } else if (category === 'Layer-Mod') {
      const layer = keymap.option!;
      keymap.modifiers = mods;
      comp = new LayerModComposition(layer, mods);
    } else {
      throw new Error(
        `NOT TO BE HERE. code: ${keymap.code}, categories: ${keymap.categories}, direction: ${keymap.direction}, modifiers: ${keymap.modifiers}`
      );
    }

    const code: number = comp.getCode();
    keymap.code = code;
    this.props.onChangeKey(keymap);
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
