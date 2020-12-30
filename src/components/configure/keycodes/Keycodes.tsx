/* eslint-disable no-undef */
import React from 'react';
import './Keycodes.scss';
import { Button, MenuItem, Select } from '@material-ui/core';
import KeycodeKey from '../keycodekey/KeycodeKey.container';
import KeylayoutBasic from '../../../assets/files/keylayout_jis_basic.json';
import KeylayoutNumber from '../../../assets/files/keylayout_jis_number.json';
import KeylatoutMedia from '../../../assets/files/keylayout_jis_media.json';
import KeylatoutMacro from '../../../assets/files/keylayout_jis_macro.json';
import KeylatoutLayers from '../../../assets/files/keylayout_jis_layers.json';
import KeylatoutSpecial from '../../../assets/files/keylayout_jis_special.json';
import KeylatoutQmkLighting from '../../../assets/files/keylayout_jis_qmklighting.json';
import {
  KeycodesActionsType,
  KeycodesStateType,
  MacroKeycode,
  MacroKeycodeType,
} from './Keycodes.container';

const KeycodeCategories = [
  'Basic',
  'Number',
  'Media',
  'Macro',
  'Layers',
  'Special',
  'QMK Lighting',
] as const;

const Keylayout = [
  KeylayoutBasic,
  KeylayoutNumber,
  KeylatoutMedia,
  KeylatoutMacro,
  KeylatoutLayers,
  KeylatoutSpecial,
  KeylatoutQmkLighting,
];

type OwnProps = {};

type KeycodesProps = OwnProps &
  Partial<KeycodesActionsType> &
  Partial<KeycodesStateType>;

export default class Keycodes extends React.Component<KeycodesProps, {}> {
  constructor(props: KeycodesProps | Readonly<KeycodesProps>) {
    super(props);
  }

  get keylayout() {
    return Keylayout[this.props.categoryIndex || 0];
  }

  onChangeMacroText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const code: MacroKeycodeType = this.props.selectedKey
      ?.code as MacroKeycodeType;
    if (MacroKeycode.indexOf(code) < 0) return;

    this.props.setMacro!(code, event.target.value);
  };

  render() {
    return (
      <React.Fragment>
        <div className="key-categories">
          <div className="blank-category"></div>
          {KeycodeCategories.map((cat, index) => {
            return (
              <div className="key-category" key={index}>
                <Button
                  disabled={this.props.categoryIndex === index}
                  onClick={this.props.selectCategoryIndex!.bind(this, index)}
                >
                  {cat}
                </Button>
              </div>
            );
          })}
          <div className="keylayout-switch">
            <Select id="keylayout-switch" value={'JIS'} onChange={() => {}}>
              <MenuItem value="US">US International</MenuItem>
              <MenuItem value="JIS">JIS</MenuItem>
            </Select>
          </div>
        </div>
        <div className="keycodes">
          {this.keylayout.map((key) => {
            return <KeycodeKey key={key.code} value={key} />;
          })}
        </div>
        {this.props.categoryIndex == KeycodeCategories.indexOf('Macro') ? (
          <div className="macro-wrapper">
            <div className="macro">
              <hr />
              {this.props.selectedKey ? (
                <div>{this.props.selectedKey!.label}</div>
              ) : (
                'Please click above key to input its macro'
              )}

              <textarea
                placeholder={'{KC_A,KC_NO,KC_A,KC_B}'}
                onChange={this.onChangeMacroText}
                disabled={!this.props.selectedKey}
                value={this.props.macroText || ''}
              ></textarea>
              <div>
                Enter text directry, or wrap{' '}
                <a href="https://beta.docs.qmk.fm/using-qmk/simple-keycodes/keycodes_basic">
                  Basic Keycodes
                </a>{' '}
                in {'{}'}.
              </div>
              <div>
                Single tap: {'{KC_XXX}'}, Chord: {'{KC_XXX, KC_YYY, KC_ZZZ}'}.
              </div>
              <div>Type ? to search for keycodes.</div>
            </div>
          </div>
        ) : (
          ''
        )}
        {this.props.hoverKey ? (
          <div className="keycode-desc">
            {this.props.hoverKey.code}: Description
          </div>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}
