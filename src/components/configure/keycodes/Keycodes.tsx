/* eslint-disable no-undef */
import React from 'react';
import './Keycodes.scss';
import { Button } from '@material-ui/core';
import KeycodeKey, { genKey, Key } from '../keycodekey/KeycodeKey.container';
import { KeycodesActionsType, KeycodesStateType } from './Keycodes.container';
import { IKeycodeCategory, IKeymap } from '../../../services/hid/Hid';
import KeycodeAddKey from '../keycodekey/any/AddAnyKeycodeKey.container';
import { KeyCategory } from '../../../services/hid/KeyCategoryList';

const genKeys = (keymaps: IKeymap[]): Key[] => {
  return keymaps.map<Key>((keymap) => genKey(keymap));
};

type OwnProps = {};

type KeycodesProps = OwnProps &
  Partial<KeycodesActionsType> &
  Partial<KeycodesStateType>;

type OwnState = {
  category: string;
};

export default class Keycodes extends React.Component<KeycodesProps, OwnState> {
  private categoryKeys: { [category: string]: Key[] } = {};
  constructor(props: KeycodesProps | Readonly<KeycodesProps>) {
    super(props);
    this.state = {
      category: 'Basic',
    };
    this.categoryKeys = {
      Basic: genKeys(KeyCategory.basic()),
      Symbol: genKeys(KeyCategory.symbol()),
      Functions: genKeys(KeyCategory.functions()),
      Layer: genKeys(KeyCategory.layer(this.props.layerCount!)),
      Device: genKeys(KeyCategory.device()),
      Macro: genKeys(KeyCategory.macro()),
      Special: genKeys(KeyCategory.special()),
    };
  }

  // eslint-disable-next-line no-unused-vars
  shouldComponentUpdate(nextProps: KeycodesProps, _nextState: OwnState) {
    if (this.props.layerCount != nextProps.layerCount) {
      const keys: Key[] = genKeys(KeyCategory.layer(nextProps.layerCount!));
      this.categoryKeys['Layer'] = keys;
    }
    return true;
  }

  selectCategory = (category: string) => {
    this.setState({ category });
  };

  render() {
    let keys: Key[];
    if (this.state.category) {
      keys = this.categoryKeys[this.state.category] || [];
    } else {
      keys = [];
    }
    return (
      <React.Fragment>
        <div className="key-categories">
          {Object.keys(this.categoryKeys).map((cat, index) => {
            return (
              <div className="key-category" key={index}>
                <Button
                  disabled={this.state.category === cat}
                  onClick={this.selectCategory.bind(this, cat)}
                >
                  {cat}
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
                key={`${this.state.category}${index}`}
                value={key}
                draggable={true}
              />
            );
          })}
          {this.state.category == IKeycodeCategory.ANY && (
            <KeycodeAddKey key={'add'} />
          )}
        </div>

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

  // eslint-disable-next-line no-unused-vars
  onChangeMacroText: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

// eslint-disable-next-line no-unused-vars
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
