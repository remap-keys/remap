/* eslint-disable no-undef */
import React from 'react';
import './Keycodes.scss';
import { Button } from '@material-ui/core';
import KeycodeKey from '../keycodekey/KeycodeKey.container';
import { KeycodesActionsType, KeycodesStateType } from './Keycodes.container';
import { IKeycodeCategory } from '../../../services/hid/Hid';
import KeycodeAddKey from '../keycodekey/any/AddAnyKeycodeKey.container';
import { KeyCategory } from '../../../services/hid/KeyCategoryList';
import { genKeys, Key } from '../keycodekey/KeyGen';
import { CATEGORY_LABEL_BMP } from '../../../services/hid/KeycodeInfoListBmp';

type OwnProps = {};

type KeycodesProps = OwnProps &
  Partial<KeycodesActionsType> &
  Partial<KeycodesStateType>;

type OwnState = {
  category: string;
  categoryKeys: { [category: string]: Key[] };
};

export default class Keycodes extends React.Component<KeycodesProps, OwnState> {
  constructor(props: KeycodesProps | Readonly<KeycodesProps>) {
    super(props);
    this.state = {
      category: 'Basic',
      categoryKeys: {
        Basic: genKeys(
          KeyCategory.basic(this.props.labelLang!),
          this.props.labelLang!
        ),
        Symbol: genKeys(
          KeyCategory.symbol(this.props.labelLang!),
          this.props.labelLang!
        ),
        Functions: genKeys(
          KeyCategory.functions(this.props.labelLang!),
          this.props.labelLang!
        ),
        Layer: genKeys(
          KeyCategory.layer(this.props.layerCount!),
          this.props.labelLang!
        ),
        Device: genKeys(
          KeyCategory.device(this.props.labelLang!),
          this.props.labelLang!
        ),
        // Macro: genKeys(KeyCategory.macro()),
        Special: genKeys(
          KeyCategory.special(this.props.labelLang!),
          this.props.labelLang!
        ),
        Midi: genKeys(KeyCategory.midi(), this.props.labelLang!),
      },
    };
  }

  private addBmpCategory() {
    const bmpLabel: string = CATEGORY_LABEL_BMP;
    const categoryKeys = this.state.categoryKeys;
    if (!Object.prototype.hasOwnProperty.call(categoryKeys, bmpLabel)) {
      categoryKeys[bmpLabel] = genKeys(
        KeyCategory.bmp(),
        this.props.labelLang!
      );
      this.setState({ categoryKeys: categoryKeys });
    }
  }
  private removeBmpCategory() {
    const bmpLabel: string = CATEGORY_LABEL_BMP;
    const categoryKeys = this.state.categoryKeys;
    if (Object.prototype.hasOwnProperty.call(categoryKeys, bmpLabel)) {
      delete categoryKeys[bmpLabel];
      this.setState({ categoryKeys: categoryKeys });
    }
  }

  // eslint-disable-next-line no-unused-vars
  shouldComponentUpdate(nextProps: KeycodesProps, _nextState: OwnState) {
    if (this.props.layerCount != nextProps.layerCount) {
      const keys: Key[] = genKeys(
        KeyCategory.layer(nextProps.layerCount!),
        this.props.labelLang!
      );
      const categoryKeys = this.state.categoryKeys;
      categoryKeys['Layer'] = keys;
      this.setState({ categoryKeys: categoryKeys });
    }
    return true;
  }

  componentDidMount() {
    if (this.props.bleMicroPro) {
      this.addBmpCategory();
    } else {
      this.removeBmpCategory();
    }
  }

  selectCategory = (category: string) => {
    this.setState({ category });
  };

  render() {
    let keys: Key[];
    if (this.state.category) {
      keys = this.state.categoryKeys[this.state.category] || [];
    } else {
      keys = [];
    }
    return (
      <React.Fragment>
        <div className="key-categories">
          {Object.keys(this.state.categoryKeys).map((cat, index) => {
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

        {(this.props.draggingKey || this.props.testMatrix) && (
          <div className="dragMask"></div>
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
