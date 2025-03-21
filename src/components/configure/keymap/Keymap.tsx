/* eslint-disable no-undef */
import React from 'react';
import './Keymap.scss';
import { IconButton } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Keydiff from '../keydiff/Keydiff.container';
import { KeymapActionsType, KeymapStateType } from './Keymap.container';
import { IKeymap } from '../../../services/hid/Hid';
import KeyModel from '../../../models/KeyModel';
import KeyboardModel from '../../../models/KeyboardModel';
import CustomKey, {
  CUSTOMKEY_POPOVER_HEIGHT,
  CUSTOMKEY_POPOVER_TRIANGLE,
  CUSTOMKEY_POPOVER_WIDTH,
  PopoverPosition,
} from '../customkey/CustomKey';
import { Key } from '../keycodekey/KeyGen';
import KeymapToolbar from '../keymapToolbar/KeymapToolbar.container';
import KeyEventCapture from '../keyeventcapture/KeyEventCapture.container';
import { ModsComposition } from '../../../services/hid/compositions/ModsComposition';
import { IKeySwitchOperation } from '../../../store/state';
import { KEYBOARD_LAYOUT_PADDING, KeyboardView } from './KeyboardView';
import { Layer } from './Layer';
import { LabelLang } from './LabelLang';
import { t } from 'i18next';

export type LayoutOption = {
  option: number;
  optionChoice: number;
};

const BORDER_WIDTH = 4;

type OwnProp = {};

type KeymapPropsType = OwnProp &
  Partial<KeymapStateType> &
  Partial<KeymapActionsType>;

// `selectedPos`, `selectedKey`, `selectedKeySwitchOperation`,
// `selectedEncoderId` and `customKeyPopoverPosition` are set
// when the key cap is clicked, and they are cleared when the
// custom key popup is closed.
type OwnKeymapStateType = {
  selectedPos: string | null; // 0,1
  selectedEncoderId: number | null;
  selectedKeySwitchOperation: IKeySwitchOperation;
  selectedKey: Key | null;
  customKeyPopoverPosition: PopoverPosition;
  keyboardModel: KeyboardModel;
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
      selectedEncoderId: null,
      selectedKeySwitchOperation: 'click',
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

  // This method is called when the custom key popup is closed.
  private onCloseCustomKeyPopup() {
    this.setState({
      selectedPos: null,
      selectedEncoderId: null,
      selectedKeySwitchOperation: 'click',
      selectedKey: null,
      customKeyPopoverPosition: { left: 0, top: 0, side: 'above' },
    });
  }

  private onClickKeycapForTestMatrix(pos: string) {
    console.log(pos);
  }

  // This method is called when the keycap is clicked.
  private onClickKeycapForKeyCustom(
    selectedPos: string,
    selectedKey: Key,
    selectedKeySwitchOperation: IKeySwitchOperation,
    selectedEncoderId: number | null,
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
      selectedKeySwitchOperation: selectedKeySwitchOperation,
      selectedEncoderId,
      customKeyPopoverPosition: position,
    });
  }

  private onChangeKeymap(dstKey: Key) {
    const forEncoder =
      KeyModel.isEncoder(this.state.selectedEncoderId) &&
      this.state.selectedKeySwitchOperation !== 'click';

    let orgKm: IKeymap;
    if (forEncoder) {
      if (this.state.selectedKeySwitchOperation === 'cw') {
        orgKm =
          this.props.encodersKeymaps![this.props.selectedLayer!][
            this.state.selectedEncoderId!
          ].clockwise;
      } else {
        orgKm =
          this.props.encodersKeymaps![this.props.selectedLayer!][
            this.state.selectedEncoderId!
          ].counterclockwise;
      }
    } else {
      orgKm =
        this.props.keymaps![this.props.selectedLayer!][this.state.selectedPos!];
    }

    const dstKm = dstKey.keymap;

    if (
      orgKm.code != dstKm.code ||
      ModsComposition.genBinary(orgKm.modifiers || []) !=
        ModsComposition.genBinary(dstKm.modifiers || []) ||
      orgKm.direction != dstKm.direction ||
      orgKm.option != dstKm.option
    ) {
      if (forEncoder) {
        this.props.updateEncoderKeymap!(
          this.props.selectedLayer!,
          this.state.selectedEncoderId!,
          orgKm,
          dstKey.keymap,
          this.state.selectedKeySwitchOperation
        );
      } else {
        this.props.updateKeymap!(
          this.props.selectedLayer!,
          this.state.selectedPos!,
          orgKm,
          dstKey.keymap
        );
      }
    } else {
      // clear diff
      if (forEncoder) {
        this.props.revertEncoderKeymap!(
          this.props.selectedLayer!,
          this.state.selectedEncoderId!,
          this.state.selectedKeySwitchOperation
        );
      } else {
        this.props.revertKeymap!(
          this.props.selectedLayer!,
          this.state.selectedPos!
        );
      }
    }
  }

  componentDidUpdate(
    prevProps: KeymapPropsType,
    _prevState: OwnKeymapStateType
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
    const deviceEncodersKeymaps = this.props.encodersKeymaps![selectedLayer];
    const remaps = this.props.remaps![selectedLayer];
    const encodersRemap = this.props.encodersRemaps![selectedLayer];
    const keyboardViewContent = this.state.keyboardModel.getKeymap(
      this.props.selectedKeyboardOptions!
    );

    return (
      <React.Fragment>
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
                  <h3>{t('Test Matrix')}</h3>

                  {t(
                    "You can confirm that your keyboard's key switches work fine."
                  )}
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
                  this.props.keydiff!.destination,
                  this.props.keyboardDefinition!.customKeycodes
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

          <KeyEventCapture
            onKeyDown={this.props.onKeyDown!}
            onKeyUp={this.props.onKeyUp!}
            keyModels={keyboardViewContent.keymaps}
            keymaps={deviceKeymaps}
            encodersKeymaps={deviceEncodersKeymaps}
          >
            <KeyboardView
              keyboardViewContent={keyboardViewContent}
              layoutOptions={this.props.selectedKeyboardOptions!}
              deviceKeymaps={deviceKeymaps}
              deviceEncodersKeymaps={deviceEncodersKeymaps}
              selectedPos={this.props.testMatrix ? '' : this.props.selectedPos!}
              selectedEncoderId={this.props.selectedEncoderId!}
              selectedKeySwitchOperation={
                this.props.selectedKeySwitchOperation!
              }
              remaps={remaps}
              encodersRemaps={encodersRemap}
              keyboardWidth={this.props.keyboardWidth!}
              keyboardHeight={this.props.keyboardHeight!}
              testedMatrix={this.props.testedMatrix!}
              currentTestMatrix={this.props.currentTestMatrix!}
              setKeyboardSize={(width, height) => {
                this.props.setKeyboardSize!(width, height);
              }}
              isCustomKeyOpen={Boolean(this.state.selectedPos)}
              onClickKeycap={(pos, key, keySwitchEventType, encoderId, ref) => {
                if (this.props.testMatrix) {
                  this.onClickKeycapForTestMatrix(pos);
                } else {
                  this.onClickKeycapForKeyCustom(
                    pos,
                    key,
                    keySwitchEventType,
                    encoderId,
                    ref
                  );
                }
              }}
            />
          </KeyEventCapture>
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
            customKeycodes={this.props.keyboardDefinition!.customKeycodes}
          />
        </div>
      </React.Fragment>
    );
  }
}
