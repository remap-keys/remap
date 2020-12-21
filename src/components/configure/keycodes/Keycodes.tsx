/* eslint-disable no-undef */
import React from 'react';
import './Keycodes.scss';
import { Button, MenuItem, Select } from '@material-ui/core';
import KeycodeKey from '../keycodekey/KeycodeKey';
import KeylayoutBasic from '../../../asserts/files/keylayout_jis_basic.json';
import KeylayoutNumber from '../../../asserts/files/keylayout_jis_number.json';
import KeylatoutMedia from '../../../asserts/files/keylayout_jis_media.json';
import KeylatoutMacro from '../../../asserts/files/keylayout_jis_macro.json';
import KeylatoutLayers from '../../../asserts/files/keylayout_jis_layers.json';
import KeylatoutSpecial from '../../../asserts/files/keylayout_jis_special.json';
import KeylatoutQmkLighting from '../../../asserts/files/keylayout_jis_qmklighting.json';

const KeycodeCategories = [
  'Basic',
  'Number',
  'Media',
  'Macro',
  'Layers',
  'Special',
  'QMK Lighting',
] as const;

const MacroKeycode = [
  'M0',
  'M1',
  'M2',
  'M3',
  'M4',
  'M5',
  'M6',
  'M7',
  'M8',
  'M9',
  'M10',
  'M11',
  'M12',
  'M13',
  'M14',
  'M15',
];

const Keylayout = [
  KeylayoutBasic,
  KeylayoutNumber,
  KeylatoutMedia,
  KeylatoutMacro,
  KeylatoutLayers,
  KeylatoutSpecial,
  KeylatoutQmkLighting,
];

export interface Key {
  code: string;
  label: string;
  meta: string;
}

interface MacroText {
  [key: string]: string;
}

interface IKeycodeState {
  categoryIndex: number;
  hoverKey: string | null;
  selectedKey: Key | null; // M0, M1, M2,...
  macroText: string | null;
  macroTexts: MacroText;
}

export default class Keycodes extends React.Component<{}, IKeycodeState> {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      categoryIndex: 0,
      hoverKey: null,
      macroText: null,
      macroTexts: {},
      selectedKey: null,
    };
  }
  get macroText(): string {
    const key = this.state.selectedKey;
    if (!key || MacroKeycode.indexOf(key.code) < 0) {
      return '';
    }

    return this.state.macroTexts[key.code];
  }

  private clearSelectedKey() {
    this.setState({ selectedKey: null });
  }

  private isClickableKey(key: Key): boolean {
    return 0 <= MacroKeycode.indexOf(key.code);
  }

  onChangeMacroText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!this.state.selectedKey) return;

    const macroTexts = Object.assign({}, this.state.macroTexts);
    macroTexts[this.state.selectedKey.code] = event.target.value;
    this.setState({ macroTexts: macroTexts });
  };
  onClickKeyCategory = (index: number) => {
    this.setState({ categoryIndex: index });
    this.clearSelectedKey();
  };
  onClickKeycodeKey = (key: Key) => {
    if (this.state.selectedKey != key) {
      this.setState({ selectedKey: key });
    } else {
      this.clearSelectedKey(); // cancel selected key
    }
  };
  onHoverKey = (code: string) => {
    this.setState({ hoverKey: code });
  };
  offHoverKey = () => {
    this.setState({ hoverKey: null });
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
                  disabled={this.state.categoryIndex === index}
                  onClick={this.onClickKeyCategory.bind(this, index)}
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
          {Keylayout[this.state.categoryIndex].map((key) => {
            return (
              <KeycodeKey
                key={key.code}
                keycode={key}
                onHover={this.onHoverKey}
                offHover={this.offHoverKey}
                onClick={this.onClickKeycodeKey}
                clickable={this.isClickableKey(key)}
                selected={this.state.selectedKey?.code == key.code}
              />
            );
          })}
        </div>
        {this.state.categoryIndex == KeycodeCategories.indexOf('Macro') ? (
          <div className="macro-wrapper">
            <div className="macro">
              <hr />
              {this.state.selectedKey ? (
                <div>{this.state.selectedKey.label}</div>
              ) : (
                'Please click above key to input its macro'
              )}

              <textarea
                placeholder={'{KC_A,KC_NO,KC_A,KC_B}'}
                onChange={this.onChangeMacroText}
                disabled={!this.state.selectedKey}
                value={this.macroText}
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
        {this.state.hoverKey ? (
          <div className="keycode-desc">{this.state.hoverKey}: Description</div>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}
