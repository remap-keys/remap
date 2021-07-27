import './CatalogKeymap.scss';
import React from 'react';
import {
  CatalogKeymapActionsType,
  CatalogKeymapStateType,
} from './CatalogKeymap.container';
import KeyboardModel from '../../../models/KeyboardModel';
import KeyModel from '../../../models/KeyModel';
import { IKeymap } from '../../../services/hid/Hid';
import { MOD_LEFT } from '../../../services/hid/Composition';
import Keycap from '../../configure/keycap/Keycap.container';
import { Chip, Grid, Paper, Typography } from '@material-ui/core';
import { AbstractKeymapData } from '../../../services/storage/Storage';
import { KeyLabelLangs } from '../../../services/labellang/KeyLabelLangs';
import { CatalogKeyboardHeader } from './CatalogKeyboardHeader';
import LayoutOptionComponentList from '../../configure/layoutoption/LayoutOptionComponentList.container';
import CatalogKeymapList from './CatalogKeymapList.container';

type CatalogKeymapState = {};
type OwnProps = {};
type CatalogKeymapProps = OwnProps &
  Partial<CatalogKeymapActionsType> &
  Partial<CatalogKeymapStateType>;

type KeycapData = {
  model: KeyModel;
  keymap: IKeymap;
  remap: IKeymap | null;
};

export default class CatalogKeymap extends React.Component<
  CatalogKeymapProps,
  CatalogKeymapState
> {
  constructor(props: CatalogKeymapProps | Readonly<CatalogKeymapProps>) {
    super(props);
  }

  // eslint-disable-next-line no-unused-vars
  onClickBackButton(event: React.MouseEvent<{}>) {
    history.pushState(null, 'Remap', '/catalog');
    this.props.goToSearch!();
  }

  onClickApplySharedKeymapData(savedKeymapData: AbstractKeymapData) {
    this.props.applySharedKeymapData!(savedKeymapData);
    history.pushState(
      null,
      'Remap',
      `/catalog/${this.props.definitionDocument!.id}/keymap?id=${
        savedKeymapData.id
      }`
    );
  }

  render() {
    const kbd = new KeyboardModel(
      this.props.keyboardDefinition!.layouts.keymap
    );
    const { keymaps, width, height, left, top } = kbd.getKeymap(
      this.props.selectedKeyboardOptions
    );

    const marginLeft = left != 0 ? -left : 0;
    const marginTop = -top;
    const keycaps: KeycapData[] = [];
    keymaps.forEach((model: KeyModel) => {
      let keymap: IKeymap;
      if (this.props.keymaps && this.props.keymaps.length > 0) {
        keymap = this.props.keymaps![this.props.selectedLayer!][model.pos];
      } else {
        keymap = {
          isAny: false,
          code: 0,
          kinds: [],
          direction: MOD_LEFT,
          modifiers: [],
          keycodeInfo: {
            label: '',
            code: 0,
            name: { long: '', short: '' },
          },
        };
      }
      const remap = null;
      keycaps.push({ model, keymap, remap });
    });
    return (
      <div className="catalog-keymap-container-wrapper">
        <div className="catalog-keymap-container">
          <CatalogKeyboardHeader
            definitionDocument={this.props.definitionDocument!}
          />
          <div className="catalog-keymap-wrapper">
            {this.props.keymaps!.length > 0 ? (
              <div className="catalog-keymap-option-container">
                <div className="catalog-keymap-option-lang">
                  <Typography variant="subtitle1">
                    {
                      KeyLabelLangs.KeyLabelLangMenus.find(
                        (m) => m.labelLang === this.props.langLabel
                      )!.menuLabel
                    }
                  </Typography>
                </div>
                <Layer
                  layerCount={this.props.keymaps!.length}
                  selectedLayer={this.props.selectedLayer!}
                  onClickLayer={this.props.updateSelectedLayer!}
                />
              </div>
            ) : null}
            <div
              className="catalog-keymap-keyboards"
              style={{ margin: '0 auto' }}
            >
              <div
                className="catalog-keymap-keyboard-root"
                style={{
                  width: width + 40,
                  height: height + 40,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderStyle: 'solid',
                }}
              >
                <div
                  className="catalog-keymap-keyboard-frame"
                  style={{
                    width: width,
                    height: height,
                    left: marginLeft,
                    top: marginTop,
                  }}
                >
                  {keycaps.map((keycap: KeycapData) => {
                    return keycap.model.isDecal ? (
                      ''
                    ) : (
                      <Keycap
                        debug={false}
                        key={keycap.model.pos}
                        {...keycap}
                        focus={false}
                        down={false}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <Paper elevation={0} className="catalog-keymap-content">
            <Grid container>
              <Grid item sm={6} className="catalog-keymap-column">
                <div className="catalog-keymap-section">
                  <h2>Layout Options</h2>
                  <LayoutOptionComponentList hidSupport={false} />
                </div>
              </Grid>
              <Grid item sm={6} className="catalog-keymap-column">
                <div className="catalog-keymap-section">
                  <h2>Shared Keymaps</h2>
                  <CatalogKeymapList
                    onClickApplySharedKeymapData={this.onClickApplySharedKeymapData.bind(
                      this
                    )}
                  />
                </div>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </div>
    );
  }
}

type LayerProps = {
  layerCount: number;
  selectedLayer: number;
  // eslint-disable-next-line no-unused-vars
  onClickLayer: (layer: number) => void;
};

function Layer(props: LayerProps) {
  const layers = [...Array(props.layerCount)].map((_, i) => i);
  return (
    <div className="catalog-keymap-layer-wrapper">
      {layers.map((layer) => {
        return (
          <Chip
            key={layer}
            variant="outlined"
            size="medium"
            label={layer}
            color={props.selectedLayer === layer ? 'primary' : undefined}
            clickable={props.selectedLayer !== layer}
            onClick={() => {
              props.onClickLayer(layer);
            }}
            className={
              props.selectedLayer !== layer
                ? 'catalog-keymap-layer-unselected'
                : 'catalog-keymap-layer-selected'
            }
          />
        );
      })}
    </div>
  );
}
