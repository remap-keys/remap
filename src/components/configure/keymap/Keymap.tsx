/* eslint-disable no-undef */
import React from 'react';
import './Keymap.scss';
import { IconButton, MenuItem, Select } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Keydiff from '../keydiff/Keydiff.container';
import { KeymapActionsType, KeymapStateType } from './Keymap.container';
import { IKeymap } from '../../../services/hid/Hid';
import KeyModel from '../../../models/KeyModel';
import KeyboardModel, {
  KeyboardViewContent,
} from '../../../models/KeyboardModel';
import Keycap from '../keycap/Keycap.container';
import CustomKey, {
  CUSTOMKEY_POPOVER_HEIGHT,
  CUSTOMKEY_POPOVER_TRIANGLE,
  CUSTOMKEY_POPOVER_WIDTH,
  PopoverPosition,
} from '../customkey/CustomKey';
import { Key } from '../keycodekey/KeyGen';
import { ModsComposition } from '../../../services/hid/Composition';
import {
  KeyboardLabelLang,
  KeyLabelLangs,
} from '../../../services/labellang/KeyLabelLangs';
import KeymapToolbar from '../keymapToolbar/KeymapToolbar.container';
import LayerPagination from '../../common/layer/LayerPagination';
import KeyEventCapture from '../keyeventcapture/KeyEventCapture';

export type LayoutOption = {
  option: number;
  optionChoice: number;
};

const BORDER_WIDTH = 4;

type OwnProp = {};

type KeymapPropsType = OwnProp &
  Partial<KeymapStateType> &
  Partial<KeymapActionsType>;

type OwnKeymapStateType = {
  keyboardModel: KeyboardModel;
  selectedPos: string | null; // 0,1
  selectedKey: Key | null;
  customKeyPopoverPosition: PopoverPosition;
  interval: any | null;
};

export default class Keymap extends React.Component<
  KeymapPropsType,
  OwnKeymapStateType
> {
  constructor(props: KeymapPropsType | Readonly<KeymapPropsType>) {
    super(props);
    const keyboardModel = new KeyboardModel(this.props.keyboardKeymap!);
    this.state = {
      keyboardModel: keyboardModel,
      selectedPos: null,
      selectedKey: null,
      customKeyPopoverPosition: { left: 0, top: 0, side: 'above' },
      interval: null,
    };
  }

  // eslint-disable-next-line no-unused-vars
  shouldComponentUpdate(nextProps: KeymapPropsType) {
    if (this.props.keyboardKeymap != nextProps.keyboardKeymap) {
      const kbd = new KeyboardModel(nextProps.keyboardKeymap!);
      this.setState({
        keyboardModel: kbd,
      });
    }
    return true;
  }

  private onCloseCustomKeyPopup() {
    this.setState({
      selectedPos: null,
      selectedKey: null,
      customKeyPopoverPosition: { left: 0, top: 0, side: 'above' },
    });
  }

  private onClickKeycapForTestMatrix(pos: string) {
    console.log(pos);
  }

  private onClickKeycapForKeyCustom(
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
    const orgKm: IKeymap =
      this.props.keymaps![this.props.selectedLayer!][this.state.selectedPos!];
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

  componentDidUpdate(
    prevProps: KeymapPropsType,
    // eslint-disable-next-line no-unused-vars
    prevState: OwnKeymapStateType
  ) {
    if (prevProps.testMatrix !== this.props.testMatrix) {
      clearInterval(this.state.interval);
      if (this.props.testMatrix) {
        this.setState({
          interval: setInterval(() => {
            this.props.fetchSwitchMatrixState!();
          }, 100),
        });
      }
    }

    const keyboardViewContent = this.state.keyboardModel.getKeymap(
      this.props.selectedKeyboardOptions!
    );
    const keyboardWidth =
      keyboardViewContent.width + (BORDER_WIDTH + KEYBOARD_LAYOUT_PADDING) * 2;
    const keyboardHeight =
      keyboardViewContent.height + (BORDER_WIDTH + KEYBOARD_LAYOUT_PADDING) * 2;

    if (
      this.props.keyboardWidth != keyboardWidth ||
      this.props.keyboardHeight != keyboardHeight
    ) {
      this.props.setKeyboardSize!(keyboardWidth, keyboardHeight);
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  render() {
    const selectedLayer = this.props.selectedLayer!;
    const deviceKeymaps = this.props.keymaps![selectedLayer];
    const remaps = this.props.remaps![selectedLayer];
    const keyboardViewContent = this.state.keyboardModel.getKeymap(
      this.props.selectedKeyboardOptions!
    );

    return (
      <KeyEventCapture
        labelLang={this.props.labelLang!}
        selectedLayer={this.props.selectedLayer!}
        selectedPos={this.props.selectedPos!}
        onKeyDown={this.props.onKeyDown!}
        onKeyUp={this.props.onKeyUp!}
        isTestMatrix={this.props.testMatrix!}
        keyModels={keyboardViewContent.keymaps}
        keymaps={deviceKeymaps}
      >
        {(this.props.draggingKey || this.props.testMatrix) && (
          <div className="dragMask"></div>
        )}

        <div className="keydiff-wrapper">
          <div className="spacer"></div>
          <div className="balancer"></div>
          <div className="diff" style={{ width: this.props.keyboardWidth! }}>
            <Keydiff />
            {this.props.testMatrix && (
              <>
                <div className="test-matrix-message">
                  <h3>Test Matrix</h3>

                  {`You can confirm that your keyboard's key switches work fine.`}
                </div>
                <div className="close-test-matrix">
                  <IconButton
                    aria-label="close"
                    onClick={this.props.updateTestMatrixOff!}
                  >
                    <CloseRoundedIcon fontSize="large" />
                  </IconButton>
                </div>
              </>
            )}
          </div>
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
          </div>
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
          />

          <KeyboardView
            keyboardViewContent={keyboardViewContent}
            layoutOptions={this.props.selectedKeyboardOptions!}
            deviceKeymaps={deviceKeymaps}
            selectedPos={this.props.testMatrix ? '' : this.props.selectedPos!}
            remaps={remaps}
            keyboardWidth={this.props.keyboardWidth!}
            keyboardHeight={this.props.keyboardHeight!}
            testedMatrix={this.props.testedMatrix!}
            currentTestMatrix={this.props.currentTestMatrix!}
            setKeyboardSize={(width, height) => {
              this.props.setKeyboardSize!(width, height);
            }}
            isCustomKeyOpen={Boolean(this.state.selectedPos)}
            onClickKeycap={(pos, key, ref) => {
              if (this.props.testMatrix) {
                this.onClickKeycapForTestMatrix(pos);
              } else {
                this.onClickKeycapForKeyCustom(pos, key, ref);
              }
            }}
          />
          <KeymapToolbar />
          <div className="spacer"></div>
          <CustomKey
            id="customkey-popover"
            open={Boolean(this.state.selectedKey)}
            position={this.state.customKeyPopoverPosition}
            value={this.state.selectedKey!}
            layerCount={this.props.layerCount!}
            labelLang={this.props.labelLang!}
            bleMicroPro={this.props.bleMicroPro!}
            onClose={this.onCloseCustomKeyPopup.bind(this)}
            onChange={(key: Key) => {
              this.onChangeKeymap(key);
            }}
          />
        </div>
      </KeyEventCapture>
    );
  }
}

type LayerProps = {
  layerCount: number;
  selectedLayer: number;
  remaps: { [pos: string]: IKeymap }[];
  // eslint-disable-next-line no-unused-vars
  onClickLayer: (layer: number) => void;
};

function Layer(props: LayerProps) {
  const layers = [...Array(props.layerCount)].map((_, i) => i);
  const invisiblePages = layers.map((layer) => {
    return (
      props.remaps![layer] == undefined ||
      0 == Object.values(props.remaps![layer]).length
    );
  });
  return (
    <div className="layer-wrapper">
      <LayerPagination
        orientation="vertical"
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

type LabelLangProps = {
  labelLang: KeyboardLabelLang;
  // eslint-disable-next-line no-unused-vars
  onChangeLangLabel: (labelLang: KeyboardLabelLang) => void;
};
function LabelLang(props: LabelLangProps) {
  return (
    <Select
      variant="standard"
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
  focus: boolean;
  down: boolean;
};

type KeyboardViewType = {
  keyboardViewContent: KeyboardViewContent;
  layoutOptions?: LayoutOption[];
  deviceKeymaps: { [pos: string]: IKeymap };
  selectedPos: string;
  remaps: { [pos: string]: IKeymap };
  keyboardWidth: number;
  keyboardHeight: number;
  testedMatrix: string[];
  currentTestMatrix: string[];
  isCustomKeyOpen: boolean;
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

export const KEYBOARD_LAYOUT_PADDING = 8;
export function KeyboardView(props: KeyboardViewType) {
  const { keymaps, width, height, left, top } = props.keyboardViewContent;
  const moveLeft = left != 0 ? -left : 0;
  const moveTop = -top;

  // TODO: performance tuning
  const keycaps: KeycapData[] = [];
  keymaps.forEach((model) => {
    const pos = model.pos;
    if (pos in props.deviceKeymaps) {
      const keymap: IKeymap = props.deviceKeymaps[pos];
      const remap: IKeymap | null =
        pos in props.remaps ? props.remaps[pos] : null;
      const focus: boolean =
        0 <= props.testedMatrix.indexOf(pos) || props.selectedPos === pos;
      const down: boolean = 0 <= props.currentTestMatrix.indexOf(pos);
      keycaps.push({ model, keymap, remap, focus, down });
    } else {
      console.log(`No keymap on device: ${model.location}`);
    }
  });
  return (
    <div className="keyboards">
      <div
        className="keyboard-root"
        style={{
          width: props.keyboardWidth,
          height: props.keyboardHeight,
          padding: KEYBOARD_LAYOUT_PADDING,
        }}
      >
        <div
          className="keyboard-frame"
          style={{ width: width, height: height, left: moveLeft, top: moveTop }}
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
                focus={keycap.focus}
                down={keycap.down}
                isCustomKeyOpen={props.isCustomKeyOpen}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
