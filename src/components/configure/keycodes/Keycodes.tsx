/* eslint-disable no-undef */
import React from 'react';
import './Keycodes.scss';
import { Button, TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import KeycodeKey from '../keycodekey/KeycodeKey.container';
import { KeycodesActionsType, KeycodesStateType } from './Keycodes.container';
import { IKeycodeCategory } from '../../../services/hid/Hid';
import KeycodeAddKey from '../keycodekey/any/AddAnyKeycodeKey.container';
import { KeyCategory } from '../../../services/hid/KeyCategoryList';
import { genKeys, Key } from '../keycodekey/KeyGen';
import { CATEGORY_LABEL_BMP } from '../../../services/hid/KeycodeInfoListBmp';
import { KeyboardLabelLang } from '../../../services/labellang/KeyLabelLangs';

type OwnProps = {};

type KeycodesProps = OwnProps &
  Partial<KeycodesActionsType> &
  Partial<KeycodesStateType>;

type OwnState = {
  category: string;
  categoryKeys: { [category: string]: Key[] };
  searchText: string;
};

export default class Keycodes extends React.Component<KeycodesProps, OwnState> {
  constructor(props: KeycodesProps | Readonly<KeycodesProps>) {
    super(props);
    this.state = {
      category: 'Basic',
      categoryKeys: {},
      searchText: '',
    };
  }

  private addBmpCategory(categoryKeys: { [category: string]: Key[] }) {
    const bmpLabel: string = CATEGORY_LABEL_BMP;
    if (!Object.prototype.hasOwnProperty.call(categoryKeys, bmpLabel)) {
      categoryKeys[bmpLabel] = genKeys(
        KeyCategory.bmp(),
        this.props.labelLang!
      );
    }
  }

  /**
   * Filter keys matching with the label and meta case-insensitive.
   * Sort them with prefix matching.
   * @param searchKey
   * @returns
   */
  private filterKeys(searchKey: string): Key[] {
    const search = searchKey.toLowerCase();
    let allKeys: Key[] = Object.values(this.state.categoryKeys).flat();

    // match with label & meta
    const filteredKeys = allKeys.filter(
      (key) =>
        0 <= key.label.toLowerCase().indexOf(search) ||
        0 <= key.meta.toLowerCase().indexOf(search)
    );

    // prioritize
    const sortedKeys = filteredKeys.sort((k0, k1) => {
      const indexLabel0 = k0.label.toLowerCase().indexOf(search);
      const indexMeta0 = k0.meta.toLowerCase().indexOf(search) + 100; //deprioritize meta text
      const indexLabel1 = k1.label.toLowerCase().indexOf(search);
      const indexMeta1 = k1.meta.toLowerCase().indexOf(search) + 100; // deprioritize meta text
      const index0 = Math.max(indexLabel0, indexMeta0);
      const index1 = Math.max(indexLabel1, indexMeta1);
      return index0 - index1;
    });

    return sortedKeys;
  }

  private removeBmpCategory(categoryKeys: { [category: string]: Key[] }) {
    const bmpLabel: string = CATEGORY_LABEL_BMP;
    if (Object.prototype.hasOwnProperty.call(categoryKeys, bmpLabel)) {
      delete categoryKeys[bmpLabel];
    }
  }

  private onChangeSearchText(event: any) {
    const searchText = event.target.value;
    this.setState({ searchText });
  }

  private refreshCategoryKeys(labelLang: KeyboardLabelLang) {
    const categoryKeys: { [category: string]: Key[] } = {
      Basic: genKeys(KeyCategory.basic(labelLang), this.props.labelLang!),
      Symbol: genKeys(KeyCategory.symbol(labelLang), this.props.labelLang!),
      Functions: genKeys(
        KeyCategory.functions(labelLang),
        this.props.labelLang!
      ),
      Layer: genKeys(
        KeyCategory.layer(this.props.layerCount!),
        this.props.labelLang!
      ),
      Device: genKeys(KeyCategory.device(labelLang), this.props.labelLang!),
      // Macro: genKeys(KeyCategory.macro()),
      Special: genKeys(KeyCategory.special(labelLang), this.props.labelLang!),
      Midi: genKeys(KeyCategory.midi(), this.props.labelLang!),
    };
    if (this.props.bleMicroPro) {
      this.addBmpCategory(categoryKeys);
    } else {
      this.removeBmpCategory(categoryKeys);
    }
    this.setState({ categoryKeys });
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
    this.refreshCategoryKeys(this.props.labelLang!);
  }

  componentDidUpdate(prevProps: KeycodesProps) {
    if (this.props.labelLang != prevProps.labelLang) {
      this.refreshCategoryKeys(prevProps.labelLang || 'en-us');
    }
  }

  selectCategory = (category: string) => {
    // clear the search text
    const searchText = '';
    this.setState({ category, searchText });
  };

  render() {
    let keys: Key[];
    if (this.state.searchText) {
      keys = this.filterKeys(this.state.searchText);
    } else if (this.state.category) {
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
          <div className="key-category">
            <TextField
              className="keycodes-search"
              size="small"
              type="search"
              value={this.state.searchText}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={this.onChangeSearchText.bind(this)}
            />
          </div>
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
