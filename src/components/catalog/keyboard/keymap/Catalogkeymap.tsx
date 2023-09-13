import './CatalogKeymap.scss';
import React, { useEffect, useState } from 'react';
import {
  CatalogKeymapActionsType,
  CatalogKeymapStateType,
} from './CatalogKeymap.container';
import KeyboardModel from '../../../../models/KeyboardModel';
import KeyModel from '../../../../models/KeyModel';
import { IKeymap } from '../../../../services/hid/Hid';
import Keycap from '../../../configure/keycap/Keycap.container';
import { Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { AbstractKeymapData } from '../../../../services/storage/Storage';
import { KeyLabelLangs } from '../../../../services/labellang/KeyLabelLangs';
import LayoutOptionComponentList from '../../../configure/layoutoption/LayoutOptionComponentList.container';
import CatalogKeymapList from './CatalogKeymapList.container';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import { genKey, Key } from '../../../configure/keycodekey/KeyGen';
import { KeymapPdfGenerator } from '../../../../services/pdf/KeymapPdfGenerator';
import { sendEventToGoogleAnalytics } from '../../../../utils/GoogleAnalytics';
import LayerPagination from '../../../common/layer/LayerPagination';
import { useNavigate } from 'react-router-dom';
import { MOD_LEFT } from '../../../../services/hid/Constraints';

type OwnProps = {};
type CatalogKeymapProps = OwnProps &
  Partial<CatalogKeymapActionsType> &
  Partial<CatalogKeymapStateType>;

type KeycapData = {
  model: KeyModel;
  keymap: IKeymap | null;
  remap: IKeymap | null;
  cwKeymap: IKeymap | null;
  cwRemap: IKeymap | null;
  ccwKeymap: IKeymap | null;
  ccwRemap: IKeymap | null;
};

export default function CatalogKeymap(props: CatalogKeymapProps) {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const onClickBackButton = (event: React.MouseEvent<{}>) => {
    // eslint-disable-next-line no-undef
    navigate('/catalog');
    props.goToSearch!();
  };

  const onClickApplySharedKeymapData = (
    savedKeymapData: AbstractKeymapData
  ) => {
    sendEventToGoogleAnalytics('catalog/apply_keymap');
    props.applySharedKeymapData!(savedKeymapData);
    // eslint-disable-next-line no-undef
    navigate(
      `/catalog/${props.definitionDocument!.id}/keymap?id=${savedKeymapData.id}`
    );
  };

  const onClickGetCheatsheet = () => {
    const keymaps: { [pos: string]: IKeymap }[] = props.keymaps!;
    const keys: { [pos: string]: Key }[] = [];
    for (let i = 0; i < props.keymaps!.length; i++) {
      const keyMap: { [pos: string]: Key } = {};
      const km = keymaps[i];
      Object.keys(km).forEach((pos) => {
        const key: Key = genKey(km[pos], props.langLabel!);
        keyMap[pos] = key;
      });
      keys.push(keyMap);
    }

    const productName = props.definitionDocument!.name;
    const pdf = new KeymapPdfGenerator(
      props.keyboardDefinition!.layouts.keymap,
      keys,
      props.keymaps!.length,
      props.langLabel!
    );

    sendEventToGoogleAnalytics('catalog/cheat_sheet');

    pdf.genPdf(productName, props.selectedKeyboardOptions!).catch((e) => {
      console.error(e);
      const msg = `Couldn't generate the PDF. Please check your keyboard and definition file(.json).`;
      props.error!(msg);
    });
  };

  const onResize = () => {
    // eslint-disable-next-line no-undef
    const newWidth = window.innerWidth;
    if (windowWidth != newWidth) {
      setWindowWidth(newWidth);
    }
  };

  const kbd = new KeyboardModel(props.keyboardDefinition!.layouts.keymap);
  const { keymaps, width, height, left, top } = kbd.getKeymap(
    props.selectedKeyboardOptions
  );

  const marginLeft = left != 0 ? -left : 0;
  const marginTop = -top;
  const keycaps: KeycapData[] = [];
  keymaps.forEach((model: KeyModel) => {
    let keymap: IKeymap;
    if (props.keymaps && props.keymaps.length > 0) {
      keymap = props.keymaps![props.selectedLayer!][model.pos];
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
    // FIXME: Set keymaps for encoder!
    keycaps.push({
      model,
      keymap,
      remap,
      cwKeymap: null,
      cwRemap: null,
      ccwKeymap: null,
      ccwRemap: null,
    });
  });

  const CONTENT_MAX_WIDTH = 960;
  const contentWidth = Math.min(
    // eslint-disable-next-line no-undef
    windowWidth || window.innerWidth,
    CONTENT_MAX_WIDTH
  );
  const keyboardRootWidth = width + 40;
  const keyboardRootHeight = height + 40;
  const scale =
    contentWidth < keyboardRootWidth
      ? (contentWidth - 20) / keyboardRootWidth
      : 1; // considering the padding: 20px
  const marginScaledHeight =
    scale < 1 ? (keyboardRootHeight * (1 - scale)) / 2 : 0;
  return (
    <div className="catalog-keymap-container-wrapper">
      <div className="catalog-keymap-container">
        <div className="catalog-keymap-wrapper">
          {props.keymaps!.length > 0 && (
            <div className="catalog-keymap-option-menu">
              <div className="catalog-keymap-option-pdf">
                <Tooltip
                  arrow={true}
                  placement="top"
                  title="Get keymap cheat sheet (PDF)"
                >
                  <IconButton size="small" onClick={onClickGetCheatsheet}>
                    <PictureAsPdfRoundedIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <div className="catalog-keymap-option-lang">
                <Typography variant="subtitle1">
                  {
                    KeyLabelLangs.KeyLabelLangMenus.find(
                      (m) => m.labelLang === props.langLabel
                    )!.menuLabel
                  }
                </Typography>
              </div>
            </div>
          )}
          <div
            className="catalog-keymap-keyboards"
            style={{ margin: '0 auto', maxWidth: contentWidth }}
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
                      isCustomKeyOpen={false}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div
            className="catalog-keymap-option-container"
            style={{ marginTop: -marginScaledHeight, maxWidth: contentWidth }}
          >
            {props.keymaps!.length > 0 ? (
              <Layer
                layerCount={props.keymaps!.length}
                selectedLayer={props.selectedLayer!}
                onClickLayer={props.updateSelectedLayer!}
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
                  onClickApplySharedKeymapData={onClickApplySharedKeymapData}
                />
              </div>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </div>
  );
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
