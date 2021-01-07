/* eslint-disable no-undef */
import React from 'react';
import './Keycodes.scss';
import { Button, MenuItem, Select } from '@material-ui/core';
import KeycodeKey from '../keycodekey/KeycodeKey.container';
import {
  KeycodesActionsType,
  KeycodesStateType,
  Key,
} from './Keycodes.container';
import { IKeycodeCategory } from '../../../services/hid/hid';

const KeycodeCategories = [
  { name: IKeycodeCategory.BASIC, label: 'Basic' },
  { name: IKeycodeCategory.NUMBER, label: 'Number' },
  { name: IKeycodeCategory.MEDIA, label: 'Media' },
  { name: IKeycodeCategory.LAYERS, label: 'Layers' },
  { name: IKeycodeCategory.SPECIAL, label: 'Special' },
  { name: IKeycodeCategory.LIGHTING, label: 'QMK Lighting' },
] as const;

type OwnProps = {};

type KeycodesProps = OwnProps &
  Partial<KeycodesActionsType> &
  Partial<KeycodesStateType>;

export default class Keycodes extends React.Component<KeycodesProps, {}> {
  constructor(props: KeycodesProps | Readonly<KeycodesProps>) {
    super(props);
  }

  componentDidMount() {
    this.props.loadKeycodeInfoForAllCategories!();
  }

  onChangeMacroText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const macroKeys = this.props.keys![IKeycodeCategory.MACRO];
    if (
      macroKeys.find(
        (key) =>
          key.keycodeInfo.code === this.props.selectedKey?.keycodeInfo.code
      )
    ) {
      this.props.setMacro!(
        this.props.selectedKey?.keycodeInfo.code,
        event.target.value
      );
    }
  };

  render() {
    let keys: Key[];
    if (this.props.category && this.props.keys) {
      keys = this.props.keys[this.props.category] || [];
    } else {
      keys = [];
    }
    return (
      <React.Fragment>
        <div className="key-categories">
          <div className="blank-category"></div>
          {KeycodeCategories.map((cat, index) => {
            return (
              <div className="key-category" key={index}>
                <Button
                  disabled={this.props.category === cat.name}
                  onClick={this.props.selectCategory!.bind(this, cat.name)}
                >
                  {cat.label}
                </Button>
              </div>
            );
          })}
        </div>
        <div className="keycodes">
          {keys.map((key) => {
            return <KeycodeKey key={key.keycodeInfo.code} value={key} />;
          })}
        </div>
        {this.props.category == IKeycodeCategory.MACRO ? (
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
            {this.props.hoverKey.keycodeInfo.code}: Description
          </div>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}
