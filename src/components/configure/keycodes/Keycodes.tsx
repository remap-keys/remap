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

const Keylayout = [
  KeylayoutBasic,
  KeylayoutNumber,
  KeylatoutMedia,
  KeylatoutMacro,
  KeylatoutLayers,
  KeylatoutSpecial,
  KeylatoutQmkLighting,
];

type CodeType = {
  key: string;
  label: string;
  meta: string;
};

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
  macroTexts: MacroText;
}

export default class Keycodes extends React.Component<{}, IKeycodeState> {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      categoryIndex: 0,
      hoverKey: null,
      macroTexts: { M0: '', M1: '', M2: '' },
      selectedKey: null,
    };
  }
  onChangeMacroText = (event: any) => {
    console.log(event);
  };
  onClickKeyCategory = (index: number) => {
    this.setState({ categoryIndex: index });
    this.setState({ selectedKey: null });
  };
  onClickKeycodeKey = (key: Key) => {
    this.setState({ selectedKey: key });
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
                code={key.code}
                label={key.label}
                meta={key.meta}
                onHover={this.onHoverKey}
                offHover={this.offHoverKey}
              />
            );
          })}
        </div>
        {this.state.categoryIndex == KeycodeCategories.indexOf('Macro') ? (
          <div className="macro-wrapper">
            <div className="macro">
              <hr />
              <textarea
                placeholder={'{KC_A,KC_NO,KC_A,KC_B}'}
                onChange={this.onChangeMacroText}
              >
                {this.state.selectedKey
                  ? this.state.macroTexts[this.state.selectedKey.code]
                  : ''}
              </textarea>
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
