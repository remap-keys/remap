import KeyModel from '../../../models/KeyModel';
import { IEncoderKeymaps, IKeymap } from '../../../services/hid/Hid';
import { KeyboardViewContent } from '../../../models/KeyboardModel';
import { IKeySwitchOperation } from '../../../store/state';
import { Key } from '../keycodekey/KeyGen';
import React from 'react';
import Keycap from '../keycap/Keycap.container';
import { LayoutOption } from './Keymap';

type KeycapData = {
  model: KeyModel;
  keymap: IKeymap | null;
  remap: IKeymap | null;
  cwKeymap: IKeymap | null;
  cwRemap: IKeymap | null;
  ccwKeymap: IKeymap | null;
  ccwRemap: IKeymap | null;
  focus: boolean;
  down: boolean;
};

type KeyboardViewType = {
  keyboardViewContent: KeyboardViewContent;
  layoutOptions?: LayoutOption[];
  deviceKeymaps: { [pos: string]: IKeymap };
  deviceEncodersKeymaps: IEncoderKeymaps;
  selectedPos: string;
  selectedEncoderId: number | null;
  selectedKeySwitchOperation: IKeySwitchOperation;
  remaps: { [pos: string]: IKeymap };
  encodersRemaps: {
    [id: number]: { clockwise?: IKeymap; counterclockwise?: IKeymap };
  };
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
    keySwitchEventType: IKeySwitchOperation,
    // eslint-disable-next-line no-unused-vars
    encoderId: number | null,
    // eslint-disable-next-line no-unused-vars
    ref: React.RefObject<HTMLDivElement>,
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
    let keymap: IKeymap | null = null;
    let remap: IKeymap | null = null;
    let cwKeymap: IKeymap | null = null;
    let cwRemap: IKeymap | null = null;
    let ccwKeymap: IKeymap | null = null;
    let ccwRemap: IKeymap | null = null;
    let focus: boolean;
    let down: boolean = false;
    const pos = model.pos;
    if (pos) {
      if (pos in props.deviceKeymaps) {
        keymap = props.deviceKeymaps[pos];
        remap = pos in props.remaps ? props.remaps[pos] : null;
      } else {
        console.log(`No keymap on device: ${model.location}`);
      }
      focus = 0 <= props.testedMatrix.indexOf(pos) || props.selectedPos === pos;
      down = 0 <= props.currentTestMatrix.indexOf(pos);
    } else {
      focus = props.selectedEncoderId === model.encoderId;
    }
    if (model.isEncoder) {
      const encoderId = model.encoderId!;
      if (encoderId in props.deviceEncodersKeymaps) {
        const encodersKeymap = props.deviceEncodersKeymaps[encoderId];
        cwKeymap = encodersKeymap.clockwise;
        cwRemap =
          encoderId in props.encodersRemaps
            ? props.encodersRemaps[encoderId].clockwise || null
            : null;
        ccwKeymap = encodersKeymap.counterclockwise;
        ccwRemap =
          encoderId in props.encodersRemaps
            ? props.encodersRemaps[encoderId].counterclockwise || null
            : null;
      } else {
        console.log(`No encoder keymap on device: ${model.location}`);
      }
    }
    keycaps.push({
      model,
      keymap,
      remap,
      cwKeymap,
      cwRemap,
      ccwKeymap,
      ccwRemap,
      focus,
      down,
    });
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
                onClick={(
                  pos: string,
                  key: Key,
                  keySwitchEventType: IKeySwitchOperation,
                  encoderId: number | null,
                ) => {
                  props.onClickKeycap(
                    pos,
                    key,
                    keySwitchEventType,
                    encoderId,
                    anchorRef,
                  );
                }}
                focus={keycap.focus}
                down={keycap.down}
                isCustomKeyOpen={props.isCustomKeyOpen}
                keySwitchOperationVisible={true}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
