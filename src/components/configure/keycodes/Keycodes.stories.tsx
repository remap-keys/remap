/* eslint-disable no-undef */
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Keycodes from './Keycodes';
import { Key } from '../keycodekey/KeyGen';
import { Provider } from 'react-redux';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from '../../../store/reducers';
import { errorReportingLogger } from '../../../utils/ErrorReportingLogger';

import './Keycodes.stories.scss';
import { KeymapCategory } from '../../../services/hid/KeycodeList';
import KeycodeKey from '../keycodekey/KeycodeKey.container';
import SearchIcon from '@material-ui/icons/Search';
import { Button, TextField, InputAdornment } from '@material-ui/core';

const store = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(thunk),
    applyMiddleware(errorReportingLogger)
  )
);

export default {
  title: 'Keycodes',
  component: Keycodes,
  decorators: [
    (Story: any) => (
      <React.Fragment>
        <Provider store={store}>
          <CssBaseline />
          <Story />
        </Provider>
      </React.Fragment>
    ),
  ],
};

class KeycodesLeftSub extends Keycodes {
  constructor(props: any) {
    super(props);
  }

  render() {
    let keys: Key[];
    if (this.state.searchText) {
      keys = this.filterKeys(this.state.searchText);
    } else if (this.state.category) {
      keys = this.state.categoryKeys[this.state.category] || [];
    } else {
      keys = [];
    }
    const macrEditMode = this.props.macroKey != null;
    let categoryKeys: { [name: string]: JSX.Element[] } = {};
    keys.forEach((key, index) => {
      const isMacro = key.keymap.kinds.includes('macro');
      const subCategoryName: KeymapCategory =
        key.keymap.kinds[key.keymap.kinds.length - 1];
      if (
        !Object.prototype.hasOwnProperty.call(categoryKeys, subCategoryName)
      ) {
        categoryKeys[subCategoryName] = [];
      }

      categoryKeys[subCategoryName].push(
        <KeycodeKey
          index={index}
          key={`${this.state.category}${index}`}
          value={key}
          draggable={true}
          clickable={isMacro && !macrEditMode}
        />
      );
    });

    const keycodekeys: JSX.Element[] = Object.keys(categoryKeys).map(
      (sub, index) => {
        return (
          <div className="sub-category-group" key={index}>
            <div className="sub-category">
              <span>{sub.split('_').join(' ').toUpperCase()}</span>
            </div>
            <div className="sub-category-keys">{categoryKeys[sub]}</div>
          </div>
        );
      }
    );
    return (
      <>
        <div className="key-categories">
          {Object.keys(this.state.categoryKeys).map((cat, index) => {
            const len = this.state.categoryKeys[cat].length;
            return (
              <div
                className={[
                  'key-category',
                  len === 0 && 'key-category-empty-keys',
                ].join(' ')}
                key={index}
              >
                <Button
                  disabled={this.state.category === cat || len === 0}
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
              onChange={() => {}}
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
          {keycodekeys}
        </div>
      </>
    );
  }
}

export const Keycodes_Subcategory = () => {
  return (
    <Keycodes
      layerCount={4}
      labelLang="en-us"
      macroKey={null}
      macroMaxCount={15}
      macroMaxBufferSize={512}
      macroBufferBytes={new Uint8Array(512)}
    />
  );
};

export const Keycodes_DoubleWidth = () => {
  return (
    <div className="keycodes-2width">
      <Keycodes
        layerCount={4}
        labelLang="en-us"
        macroKey={null}
        macroMaxCount={15}
        macroMaxBufferSize={512}
        macroBufferBytes={new Uint8Array(512)}
      />
    </div>
  );
};

export const Keycodes_LeftSubcategory = () => {
  return (
    <div className="keycodes-left-subcategory">
      <KeycodesLeftSub
        layerCount={4}
        labelLang="en-us"
        macroKey={null}
        macroMaxCount={15}
        macroMaxBufferSize={512}
        macroBufferBytes={new Uint8Array(512)}
      />
    </div>
  );
};
