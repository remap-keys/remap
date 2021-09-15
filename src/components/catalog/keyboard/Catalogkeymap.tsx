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
import {
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { AbstractKeymapData } from '../../../services/storage/Storage';
import { KeyLabelLangs } from '../../../services/labellang/KeyLabelLangs';
import LayoutOptionComponentList from '../../configure/layoutoption/LayoutOptionComponentList.container';
import CatalogKeymapList from './CatalogKeymapList.container';
import PictureAsPdfRoundedIcon from '@material-ui/icons/PictureAsPdfRounded';
import { genKey, Key } from '../../configure/keycodekey/KeyGen';
import { KeymapPdfGenerator } from '../../../services/pdf/KeymapPdfGenerator';
import { sendEventToGoogleAnalytics } from '../../../utils/GoogleAnalytics';
import LayerPagination from '../../common/layer/LayerPagination';

type CatalogKeymapState = {
  windowWidth: number;
};
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
    this.state = { windowWidth: 0 };
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    window.addEventListener('resize', this.onResize.bind(this));
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-undef
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  // eslint-disable-next-line no-unused-vars
  onClickBackButton(event: React.MouseEvent<{}>) {
    // eslint-disable-next-line no-undef
    history.pushState(null, 'Remap', '/catalog');
    this.props.goToSearch!();
  }

  onClickApplySharedKeymapData(savedKeymapData: AbstractKeymapData) {
    sendEventToGoogleAnalytics('catalog/apply_keymap');
    this.props.applySharedKeymapData!(savedKeymapData);
    // eslint-disable-next-line no-undef
    history.pushState(
      null,
      'Remap',
      `/catalog/${this.props.definitionDocument!.id}/keymap?id=${
        savedKeymapData.id
      }`
    );
  }

  onClickGetCheatsheet() {
    const keymaps: { [pos: string]: IKeymap }[] = this.props.keymaps!;
    const keys: { [pos: string]: Key }[] = [];
    for (let i = 0; i < this.props.keymaps!.length; i++) {
      const keyMap: { [pos: string]: Key } = {};
      const km = keymaps[i];
      Object.keys(km).forEach((pos) => {
        const key: Key = genKey(km[pos], this.props.langLabel!);
        keyMap[pos] = key;
      });
      keys.push(keyMap);
    }

    const productName = this.props.definitionDocument!.name;
    const pdf = new KeymapPdfGenerator(
      this.props.keyboardDefinition!.layouts.keymap,
      keys,
      this.props.keymaps!.length,
      this.props.langLabel!
    );

    sendEventToGoogleAnalytics('catalog/cheat_sheet');

    pdf.genPdf(productName, this.props.selectedKeyboardOptions!).catch((e) => {
      console.error(e);
      const msg = `Couldn't generate the PDF. Please check your keyboard and definition file(.json).`;
      this.props.error!(msg);
    });
  }

  onResize() {
    // eslint-disable-next-line no-undef
    const newWidth = window.innerWidth;
    if (this.state.windowWidth != newWidth) {
      this.setState({ windowWidth: newWidth });
    }
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
            keywords: [],
          },
        };
      }
      const remap = null;
      keycaps.push({ model, keymap, remap });
    });

    // eslint-disable-next-line no-undef
    const windowWidth = this.state.windowWidth || window.innerWidth;
    const keyboardRootWidth = width + 40;
    const keyboardRootHeight = height + 40;
    const scale =
      windowWidth < keyboardRootWidth
        ? (windowWidth - 20) / keyboardRootWidth
        : 1; // considering the padding: 20px
    const marginScaledHeight =
      scale < 1 ? (keyboardRootHeight * (1 - scale)) / 2 : 0;
    return (
      <div className="catalog-keymap-container-wrapper">
        <div className="catalog-keymap-container">
          <div className="catalog-keymap-wrapper">
            {this.props.keymaps!.length > 0 && (
              <div className="catalog-keymap-option-menu">
                <div className="catalog-keymap-option-pdf">
                  <Tooltip
                    arrow={true}
                    placement="top"
                    title="Get keymap cheat sheet (PDF)"
                  >
                    <IconButton
                      size="small"
                      onClick={this.onClickGetCheatsheet.bind(this)}
                    >
                      <PictureAsPdfRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </div>
                <div className="catalog-keymap-option-lang">
                  <Typography variant="subtitle1">
                    {
                      KeyLabelLangs.KeyLabelLangMenus.find(
                        (m) => m.labelLang === this.props.langLabel
                      )!.menuLabel
                    }
                  </Typography>
                </div>
              </div>
            )}
            <div
              className="catalog-keymap-keyboards"
              style={{ margin: '0 auto', maxWidth: windowWidth }}
            >
              <div
                className="catalog-keymap-keyboard-root"
                style={{
                  width: keyboardRootWidth,
                  height: keyboardRootHeight,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderStyle: 'solid',
                  transform: `scale(${scale})`,
                  marginTop: -(marginScaledHeight - 8),
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
            <div
              className="catalog-keymap-option-container"
              style={{ marginTop: -marginScaledHeight, maxWidth: windowWidth }}
            >
              {this.props.keymaps!.length > 0 ? (
                <Layer
                  layerCount={this.props.keymaps!.length}
                  selectedLayer={this.props.selectedLayer!}
                  onClickLayer={this.props.updateSelectedLayer!}
                />
              ) : null}
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
  // eslint-disable-next-line no-unused-vars
  const invisiblePages = layers.map((layer) => true);
  return (
    <div className="catalog-keymap-layer-wrapper">
      <LayerPagination
        orientation="horizontal"
        count={props.layerCount}
        page={props.selectedLayer + 1}
        invisiblePages={invisiblePages}
        onClickPage={(page) => {
          props.onClickLayer(page - 1);
        }}
      />
    </div>
  );
}
