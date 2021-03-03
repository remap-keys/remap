/* eslint-disable no-undef */
import React from 'react';
import './Keymap.scss';
import {
  Badge,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Select,
  withStyles,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import Keydiff from '../keydiff/Keydiff.container';
import { KeymapActionsType, KeymapStateType } from './Keymap.container';
import { IKeyboard, IKeymap } from '../../../services/hid/Hid';
import KeyModel from '../../../models/KeyModel';
import KeyboardModel from '../../../models/KeyboardModel';
import Keycap from '../keycap/Keycap.container';
import ConfigurationDialog from '../configuration/ConfigurationDialog.container';
import CustomKey, {
  CUSTOMKEY_POPOVER_HEIGHT,
  CUSTOMKEY_POPOVER_TRIANGLE,
  CUSTOMKEY_POPOVER_WIDTH,
  PopoverPosition,
} from '../customkey/CustomKey';
import { genKey, Key } from '../keycodekey/KeyGen';
import { ModsComposition } from '../../../services/hid/Composition';
import {
  KeyboardLabelLang,
  KeyLabelLangs,
} from '../../../services/labellang/KeyLabelLangs';
import { MoreVert } from '@material-ui/icons';
import { KeymapPdfGenerator } from '../../../services/pdf/KeymapPdfGenerator';
import download from 'downloadjs';
import Lighting from '../configuration/Lighting';

export type LayerOptions = { option: string; optionChoice: string }[];

type OwnProp = {};

type KeymapPropsType = OwnProp &
  Partial<KeymapStateType> &
  Partial<KeymapActionsType>;

type OwnKeymapStateType = {
  configurationDialog: boolean;
  keyboardModel: KeyboardModel;
  selectedPos: string | null; // 0,1
  selectedKey: Key | null;
  customKeyPopoverPosition: PopoverPosition;
  anchorMenuEl: HTMLButtonElement | null;
};

export default class Keymap extends React.Component<
  KeymapPropsType,
  OwnKeymapStateType
> {
  private menuRef: React.RefObject<HTMLDivElement>;
  constructor(props: KeymapPropsType | Readonly<KeymapPropsType>) {
    super(props);
    this.state = {
      configurationDialog: false,
      keyboardModel: new KeyboardModel(this.props.keyboardKeymap!),
      selectedPos: null,
      selectedKey: null,
      customKeyPopoverPosition: { left: 0, top: 0, side: 'above' },
      anchorMenuEl: null,
    };
    this.menuRef = React.createRef<HTMLDivElement>();
  }

  // eslint-disable-next-line no-unused-vars
  shouldComponentUpdate(nextProps: KeymapPropsType) {
    if (this.props.keyboardKeymap != nextProps.keyboardKeymap) {
      const kbd = new KeyboardModel(nextProps.keyboardKeymap!);
      this.setState({ keyboardModel: kbd });
    }
    return true;
  }

  private onCloseCustomKeyPopup() {
    this.setState({
      selectedPos: null,
      selectedKey: null,
      customKeyPopoverPosition: { left: 0, top: 0, side: 'above' },
    });

    if (this.props.keydiff!.destination === null) {
      this.props.clearSelectedPos!();
    }
  }
  private onClickKeycap(
    selectedPos: string,
    selectedKey: Key,
    selectedKeyRef: React.RefObject<HTMLDivElement>
  ) {
    const div: HTMLDivElement = selectedKeyRef.current!;
    const rect = div.getBoundingClientRect();
    const { left, top, right, height, width } = rect;
    const center = left + width / 2;
    const maxTop = top - CUSTOMKEY_POPOVER_HEIGHT;
    const maxBottom =
      top + height + CUSTOMKEY_POPOVER_TRIANGLE + CUSTOMKEY_POPOVER_HEIGHT;
    const isThin = maxTop < 0 && window.innerHeight < maxBottom;
    const isLeftSideKey = center < window.innerWidth / 2;
    let position: PopoverPosition = { left: 0, top: 0, side: 'above' };

    if (left < 200 || (isThin && isLeftSideKey)) {
      // show right
      position.left = left + width + CUSTOMKEY_POPOVER_TRIANGLE / 2;
      position.top =
        top +
        height / 2 +
        CUSTOMKEY_POPOVER_TRIANGLE -
        CUSTOMKEY_POPOVER_HEIGHT / 2;
      position.side = 'right';
    } else if (window.innerWidth - 200 < right || (isThin && !isLeftSideKey)) {
      // show left
      position.left =
        left - CUSTOMKEY_POPOVER_WIDTH - CUSTOMKEY_POPOVER_TRIANGLE / 2;
      position.top =
        top +
        height / 2 +
        CUSTOMKEY_POPOVER_TRIANGLE -
        CUSTOMKEY_POPOVER_HEIGHT / 2;
      position.side = 'left';
    } else if (top < 255) {
      // show below
      position.left = left + width / 2 - CUSTOMKEY_POPOVER_WIDTH / 2;
      position.top = top + height + CUSTOMKEY_POPOVER_TRIANGLE;
      position.side = 'below';
    } else {
      // show above
      position.left = left + width / 2 - CUSTOMKEY_POPOVER_WIDTH / 2;
      position.top = top - CUSTOMKEY_POPOVER_HEIGHT;
      position.side = 'above';
    }

    this.setState({
      selectedPos,
      selectedKey,
      customKeyPopoverPosition: position,
    });
  }

  private onChangeKeymap(dstKey: Key) {
    const orgKm: IKeymap = this.props.keymaps![this.props.selectedLayer!][
      this.state.selectedPos!
    ];
    const dstKm = dstKey.keymap;

    if (
      orgKm.code != dstKm.code ||
      ModsComposition.genBinary(orgKm.modifiers || []) !=
        ModsComposition.genBinary(dstKm.modifiers || []) ||
      orgKm.direction != dstKm.direction ||
      orgKm.option != dstKm.option
    ) {
      this.props.updateKeymap!(
        this.props.selectedLayer!,
        this.state.selectedPos!,
        orgKm,
        dstKey.keymap
      );
    } else {
      // clear diff
      this.props.revertKeymap!(
        this.props.selectedLayer!,
        this.state.selectedPos!
      );
    }
  }

  private onClickMenu(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.setState({ anchorMenuEl: event.currentTarget });
  }

  private onClickGetCheatsheet() {
    const keymaps: { [pos: string]: IKeymap }[] = this.props.keymaps!;
    const keys: { [pos: string]: Key }[] = [];
    for (let i = 0; i < this.props.layerCount!; i++) {
      const keyMap: { [pos: string]: Key } = {};
      const km = keymaps[i];
      Object.keys(km).forEach((pos) => {
        const key: Key = genKey(km[pos], this.props.labelLang!);
        keyMap[pos] = key;
      });
      keys.push(keyMap);
    }
    const layoutOptions = this.buildLayerOptions();
    const { productName } = this.props.keyboard!.getInformation();
    const pdf = new KeymapPdfGenerator(
      this.props.keyboardDefinition!.layouts.keymap,
      keys,
      this.props.layerCount!,
      this.props.labelLang!
    );

    pdf.genPdf(productName, layoutOptions);

    this.closeMenu();
  }

  private onClickSaveKeymap() {
    const keymaps: { [pos: string]: IKeymap }[] = this.props.keymaps!;
    const keycodes: { [pos: string]: number }[] = [];
    for (let i = 0; i < this.props.layerCount!; i++) {
      const keyMap: { [pos: string]: number } = {};
      const km = keymaps[i];
      Object.keys(km).forEach((pos) => {
        keyMap[pos] = km[pos].code;
      });
      keycodes.push(keyMap);
    }
    const { productName } = this.props.keyboard!.getInformation();
    const labelLang: string = this.props.labelLang!;
    const layerOptions = this.buildLayerOptions();
    Lighting.fetchKeyboardLightValues(this.props.keyboard!).then((lighting) => {
      const json = {
        labelLang,
        lighting,
        layerOptions,
        keycodes,
      };

      download(JSON.stringify(json), `hoge.json`, 'application/json');
    });
  }

  private openConfigurationDialog() {
    this.setState({ configurationDialog: true });
  }

  private closeConfigurationDialog() {
    this.setState({ configurationDialog: false });
  }

  private closeMenu() {
    this.setState({ anchorMenuEl: null });
  }

  private buildLayerOptions(): LayerOptions | undefined {
    let layoutOptions: { option: string; optionChoice: string }[] | undefined;
    const hasKeyboardOptions = 0 < this.props.selectedKeyboardOptions!.length;
    if (hasKeyboardOptions) {
      layoutOptions = this.props.keyboardLabels!.map(
        (choices: string | string[], index) => {
          if (typeof choices == 'string') {
            const selected: string | null = this.props.selectedKeyboardOptions![
              index
            ];
            return selected
              ? { option: '' + index, optionChoice: '1' }
              : { option: '' + index, optionChoice: '0' };
          } else {
            const choice: string = this.props.selectedKeyboardOptions![
              index
            ] as string;
            const choiceIndex = choices.indexOf(choice) - 1; // first item of choices is for choice's label
            return { option: '' + index, optionChoice: '' + choiceIndex };
          }
        }
      );
    }
    return layoutOptions;
  }

  render() {
    const {
      vendorId,
      productId,
      productName,
    } = this.props.keyboard!.getInformation();

    const layoutOptions = this.buildLayerOptions();

    return (
      <React.Fragment>
        {this.props.draggingKey && <div className="dragMask"></div>}
        <div className="label-lang">
          <LabelLang
            labelLang={this.props.labelLang!}
            onChangeLangLabel={(labelLang) => {
              this.props.onChangeLangLabel!(
                labelLang,
                this.props.keydiff!.origin,
                this.props.keydiff!.destination
              );
            }}
          />
          <div ref={this.menuRef}>
            <IconButton
              aria-label="menu"
              size="small"
              onClick={(e) => {
                this.onClickMenu(e);
              }}
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={this.state.anchorMenuEl}
              keepMounted
              open={Boolean(this.state.anchorMenuEl)}
              onClose={this.closeMenu.bind(this)}
            >
              <MenuItem onClick={this.onClickGetCheatsheet.bind(this)}>
                Get Cheat Sheet(PDF)
              </MenuItem>
              <MenuItem onClick={this.onClickSaveKeymap.bind(this)}>
                Save Current Keymap
              </MenuItem>
            </Menu>
          </div>
        </div>
        <div className="keydiff-wrapper">
          <div className="spacer"></div>
          <Keydiff />
          <div className="spacer"></div>
        </div>
        <div className="keyboards-wrapper">
          <div className="spacer"></div>
          <Layer
            layerCount={this.props.layerCount!}
            selectedLayer={this.props.selectedLayer!}
            remaps={this.props.remaps!}
            onClickLayer={(layer) => {
              this.props.onClickLayerNumber!(layer);
            }}
            onClickSettingIcon={this.openConfigurationDialog.bind(this)}
          />

          <KeyboardView
            keyboardModel={this.state.keyboardModel}
            layoutOptions={layoutOptions}
            keymaps={this.props.keymaps!}
            selectedLayer={this.props.selectedLayer!}
            remaps={this.props.remaps!}
            setKeyboardSize={this.props.setKeyboardSize!}
            onClickKeycap={(pos, key, ref) => {
              this.onClickKeycap(pos, key, ref);
            }}
          />
          <div className="balancer"></div>
          <div className="spacer"></div>
          <CustomKey
            id="customkey-popover"
            open={Boolean(this.state.selectedKey)}
            position={this.state.customKeyPopoverPosition}
            value={this.state.selectedKey!}
            layerCount={this.props.layerCount!}
            labelLang={this.props.labelLang!}
            onClose={this.onCloseCustomKeyPopup.bind(this)}
            onChange={(key: Key) => {
              this.onChangeKeymap(key);
            }}
          />
        </div>
        <ConfigurationDialog
          open={this.state.configurationDialog}
          onClose={this.closeConfigurationDialog.bind(this)}
          vendorId={vendorId}
          productId={productId}
          productName={productName}
        />
      </React.Fragment>
    );
  }
}

type LayerProps = {
  layerCount: number;
  selectedLayer: number;
  remaps: { [pos: string]: IKeymap }[];
  // eslint-disable-next-line no-unused-vars
  onClickLayer: (layer: number) => void;
  onClickSettingIcon: () => void;
};

function Layer(props: LayerProps) {
  const StyledBadge = withStyles(() => ({
    badge: {
      right: 11,
      top: 9,
      border: `2px solid white`,
    },
  }))(Badge);
  const layers = [...Array(props.layerCount)].map((_, i) => i);
  return (
    <div className="layer-wrapper">
      <div className="layers">
        <div className="layer">
          <span>LAYER</span>
          {layers!.map((layer) => {
            const invisible =
              props.remaps![layer] == undefined ||
              0 == Object.values(props.remaps![layer]).length;
            return (
              <StyledBadge
                key={layer}
                color="primary"
                variant="dot"
                invisible={invisible}
              >
                <Chip
                  key={layer}
                  variant="outlined"
                  size="medium"
                  label={layer}
                  color={props.selectedLayer == layer ? 'primary' : undefined}
                  clickable={props.selectedLayer != layer}
                  onClick={() => {
                    props.onClickLayer(layer);
                  }}
                  className={
                    props.selectedLayer != layer
                      ? 'unselected-layer'
                      : 'selected-layer'
                  }
                />
              </StyledBadge>
            );
          })}
          <SettingsIcon className="option" onClick={props.onClickSettingIcon} />
        </div>
      </div>
    </div>
  );
}

type LabelLangProps = {
  labelLang: KeyboardLabelLang;
  // eslint-disable-next-line no-unused-vars
  onChangeLangLabel: (labelLang: KeyboardLabelLang) => void;
};
function LabelLang(props: LabelLangProps) {
  return (
    <Select
      value={props.labelLang!}
      onChange={(e) => {
        props.onChangeLangLabel!(e.target.value as KeyboardLabelLang);
      }}
    >
      {KeyLabelLangs.KeyLabelLangMenus.map((item, index) => {
        return (
          <MenuItem key={`${item.labelLang}${index}`} value={item.labelLang}>
            {item.menuLabel}
          </MenuItem>
        );
      })}
    </Select>
  );
}

type KeycapData = {
  model: KeyModel;
  keymap: IKeymap;
  remap: IKeymap | null;
};

type KeyboardType = {
  keyboardModel: KeyboardModel;
  layoutOptions?: { option: string; optionChoice: string }[];
  keymaps: { [pos: string]: IKeymap }[];
  selectedLayer: number;
  remaps: { [pos: string]: IKeymap }[];
  onClickKeycap: (
    // eslint-disable-next-line no-unused-vars
    pos: string,
    // eslint-disable-next-line no-unused-vars
    key: Key,
    // eslint-disable-next-line no-unused-vars
    ref: React.RefObject<HTMLDivElement>
  ) => void;
  // eslint-disable-next-line no-unused-vars
  setKeyboardSize: (width: number, height: number) => void;
};

export function KeyboardView(props: KeyboardType) {
  const BORDER_WIDTH = 4;
  const LAYOUT_PADDING = 8;

  const { keymaps, width, height, left } = props.keyboardModel.getKeymap(
    props.layoutOptions
  );
  const moveLeft = left != 0 ? -left : 0;

  props.setKeyboardSize(width, height);

  // TODO: performance tuning
  const deviceKeymaps = props.keymaps![props.selectedLayer!];
  const remaps = props.remaps![props.selectedLayer!];
  const keycaps: KeycapData[] = [];
  keymaps.forEach((model) => {
    const pos = model.pos;
    if (model.pos in deviceKeymaps) {
      const keymap: IKeymap = deviceKeymaps[pos];
      const remap: IKeymap | null = pos in remaps ? remaps[pos] : null;
      keycaps.push({ model, keymap, remap });
    } else {
      console.log(`No keymap on device: ${model.location}`);
    }
  });
  return (
    <div className="keyboards">
      <div
        className="keyboard-root"
        style={{
          width: width + (BORDER_WIDTH + LAYOUT_PADDING) * 2,
          height: height + (BORDER_WIDTH + LAYOUT_PADDING) * 2,
          padding: LAYOUT_PADDING,
        }}
      >
        <div
          className="keyboard-frame"
          style={{ width: width, height: height, left: moveLeft }}
        >
          {keycaps.map((keycap: KeycapData) => {
            const anchorRef = React.createRef<HTMLDivElement>();
            return keycap.model.isDecal ? (
              ''
            ) : (
              <Keycap
                anchorRef={anchorRef}
                key={keycap.model.location}
                {...keycap}
                onClick={(pos: string, key: Key) => {
                  props.onClickKeycap(pos, key, anchorRef);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
