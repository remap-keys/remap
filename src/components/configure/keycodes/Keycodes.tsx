import React from 'react';
import './Keycodes.scss';
import { Button } from '@material-ui/core';
import KeycodeKey, { Key } from '../keycodekey/KeycodeKey.container';
import { KeycodesActionsType, KeycodesStateType } from './Keycodes.container';
import { IKeycodeCategory } from '../../../services/hid/Hid';
import KeycodeAddKey from '../keycodekey/any/AddAnyKeycodeKey.container';

const KeycodeCategories = [
  { name: IKeycodeCategory.BASIC, label: 'Basic' },
  { name: IKeycodeCategory.NUMBER, label: 'Number' },
  { name: IKeycodeCategory.MEDIA, label: 'Media' },
  { name: IKeycodeCategory.LAYERS, label: 'Layers' },
  { name: IKeycodeCategory.SPECIAL, label: 'Special' },
  { name: IKeycodeCategory.LIGHTING, label: 'QMK Lighting' },
  { name: IKeycodeCategory.ANY, label: 'Custom' },
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
    this.props.loadKeycodeInfoForAllCategories!(this.props._hidInstance!);
  }

  // eslint-disable-next-line no-undef
  onChangeMacroText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const macroKeys = this.props.keys![IKeycodeCategory.MACRO];
    if (
      macroKeys.find(
        (key) => key.keymap.code === this.props.selectedKey?.keymap.code
      )
    ) {
      this.props.setMacro!(
        this.props.selectedKey?.keymap.code,
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
        <div
          className="keycodes"
          style={{
            minWidth:
              this.props.keyboardWidth! + 144 /* = (PADDING + KeycodeKey)*2 */,
          }}
        >
          {keys.map((key, index) => {
            return (
              <KeycodeKey
                index={index}
                key={`${this.props.category}${index}`}
                value={key}
                draggable={true}
              />
            );
          })}
          {this.props.category == IKeycodeCategory.ANY && (
            <KeycodeAddKey key={'add'} />
          )}
        </div>

        {this.props.category == IKeycodeCategory.MACRO && (
          <Macro
            selectedKey={this.props.selectedKey}
            macroText={this.props.macroText}
            onChangeMacroText={this.onChangeMacroText}
          />
        )}
        {this.props.draggingKey && (
          <div
            className="dragMask"
            style={{ marginLeft: -8, marginTop: -6 }}
          ></div>
        )}
      </React.Fragment>
    );
  }
}

type MacroType = {
  selectedKey?: Key | null;
  macroText?: string | null;

  // eslint-disable-next-line no-undef
  onChangeMacroText: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};
function Macro(props: MacroType) {
  return (
    <div className="macro-wrapper">
      <div className="macro">
        <hr />
        {props.selectedKey ? (
          <div>{props.selectedKey!.label}</div>
        ) : (
          'Please click above key to input its macro'
        )}

        <textarea
          placeholder={'{KC_A,KC_NO,KC_A,KC_B}'}
          onChange={props.onChangeMacroText}
          disabled={!props.selectedKey}
          value={props.macroText || ''}
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
  );
}
