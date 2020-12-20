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

interface IKeycodeState {
  categoryIndex: number;
  hoverKey: string | null;
}

export default class Keycodes extends React.Component<{}, IKeycodeState> {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      categoryIndex: 0,
      hoverKey: null,
    };
  }
  onClickKeyCategory = (index: number) => {
    this.setState({ categoryIndex: index });
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
        {this.state.hoverKey ? (
          <div className="keycode-desc">{this.state.hoverKey}: Description</div>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}
