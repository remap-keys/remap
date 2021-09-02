/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from 'react';
import './MacroEditor.scss';
import {
  MacroEditorActionsType,
  MacroEditorStateType,
} from './MacroEditor.container';
import { Button } from '@material-ui/core';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { Key } from '../keycodekey/KeyGen';
import ByteStream from 'pdf-lib/cjs/core/parser/ByteStream';

const KEY_DIFF_HEIGHT = 78;
const BYTE_NULL = 0; // null(=0) is the termination in the macro buffer.
const SS_TAP_CODE = 1;
const SS_DOWN_CODE = 2;
const SS_UP_CODE = 3;

type MacroEncodeType = 'tap' | 'down' | 'up' | 'ascii';
type MacroEncode = { label: string; code: number; type: MacroEncodeType };

type MacroEditorOwnProps = {};

type TapHold = 'tap' | 'hold';
type MacroKey = { key: Key; type: TapHold };

type MacroEditorOwnState = {
  keys: MacroKey[];
  draggingIndex: number;
};

type MacroEditorProps = MacroEditorOwnProps &
  Partial<MacroEditorStateType> &
  Partial<MacroEditorActionsType>;

export default class MacroEditor extends React.Component<
  MacroEditorProps,
  MacroEditorOwnState
> {
  constructor(props: MacroEditorProps | Readonly<MacroEditorProps>) {
    super(props);
    this.state = {
      keys: [],
      draggingIndex: NaN,
    };
  }

  componentDidUpdate(prevProps: MacroEditorProps) {
    if (this.props.macroKeys != prevProps.macroKeys) {
      this.setState({
        keys: this.props.macroKeys
          ? this.props.macroKeys.map((key) => {
              return { key: key, type: 'tap' };
            })
          : [],
      });
    }
  }

  private addKey(index: number, newKey: Key) {
    let newKeys: MacroKey[] = [];
    for (let i = 0; i < this.state.keys.length; i++) {
      const key = this.state.keys[i];
      if (i === index) {
        newKeys.push({ key: newKey, type: 'tap' });
      }
      newKeys.push(key);
    }

    if (index === this.state.keys.length) {
      newKeys.push({ key: newKey, type: 'tap' });
    }

    this.setState({ keys: newKeys });
  }

  private buildMacroByteArray(macros: MacroEncode[]): number[] {
    let bytes: number[] = [];
    macros.forEach((m) => {
      if (m.type === 'tap') {
        bytes.push(SS_TAP_CODE);
      } else if (m.type === 'down') {
        bytes.push(SS_DOWN_CODE);
      } else if (m.type === 'up') {
        bytes.push(SS_UP_CODE);
      }
      bytes.push(m.code);
    });
    bytes.push(BYTE_NULL);
    return bytes;
  }

  private calcMacroByte(macros: MacroEncode[]): number {
    let size = 0;

    macros.forEach((m) => {
      if (m.type === 'ascii') {
        size += 1;
      } else {
        size += 2;
      }
    });
    size = size + 1; // null terminal byte
    return size;
  }

  private encodeMacro(): MacroEncode[] {
    const encode: MacroEncode[] = [];
    const holdBackStack: {
      label: string;
      code: number;
      type: MacroEncodeType;
    }[] = [];

    this.state.keys.forEach((macroKey) => {
      if (macroKey.type === 'tap') {
        while (0 < holdBackStack.length) {
          const pop = holdBackStack.pop();
          encode.push(pop!);
        }
        let text = macroKey.key.label;
        let type: MacroEncodeType = 'tap';
        let code = macroKey.key.keymap.code;
        if (macroKey.key.keymap.isAscii) {
          // The code MUST BE ascii if the keymap type is ascii.
          type = 'ascii';
        } else if (macroKey.key.keymap.keycodeInfo.ascii) {
          // Swap the code from QMK to ASCII if possible
          type = 'ascii';
          code = macroKey.key.keymap.keycodeInfo.ascii;
        } else {
          text = macroKey.key.keymap.keycodeInfo.name.short;
        }
        encode.push({ label: text, code: code, type: type });
      } else {
        let text = macroKey.key.keymap.keycodeInfo.name.short;
        const code = macroKey.key.keymap.code;
        encode.push({
          label: text,
          code: code,
          type: 'down',
        });
        holdBackStack.push({ label: text, code: code, type: 'up' });
      }
    });

    while (0 < holdBackStack.length) {
      const pop = holdBackStack.pop();
      encode.push(pop!);
    }

    return encode;
  }

  private onClickSave() {
    const encodedMacro = this.encodeMacro();
    const bytes = this.buildMacroByteArray(encodedMacro);
    console.log(bytes);
    this.props.closeMacroEditor!();
  }

  private moveKey(fromIndex: number, toIndex: number) {
    const dragKey = this.state.keys[fromIndex];
    let newKeys = [];
    for (let i = 0; i < this.state.keys.length; i++) {
      const key = this.state.keys[i];
      if (i === toIndex) {
        newKeys.push(dragKey);
      }
      newKeys.push(key);
    }

    if (toIndex === this.state.keys.length) {
      newKeys.push(dragKey);
    }

    if (toIndex < this.state.draggingIndex) {
      newKeys.splice(this.state.draggingIndex + 1, 1);
    } else {
      newKeys.splice(this.state.draggingIndex, 1);
    }

    this.setState({ keys: newKeys });
  }

  onChangeTapHoldType(index: number, type: TapHold) {
    const newKeys: MacroKey[] = this.state.keys.map((item, i) => {
      if (index === i) {
        return { key: item.key, type: type };
      } else {
        return item;
      }
    });
    this.setState({ keys: newKeys });
  }

  onDragStart(draggingIndex: number) {
    this.setState({ draggingIndex: draggingIndex });
  }

  onDrop(droppedIndex: number) {
    if (Number.isNaN(this.state.draggingIndex)) {
      if (this.props.draggingKey) {
        this.addKey(droppedIndex, this.props.draggingKey);
      }
    } else {
      this.moveKey(this.state.draggingIndex, droppedIndex);
    }

    this.setState({ draggingIndex: NaN });
  }

  onDelete(index: number) {
    const newKeys = [...this.state.keys];
    newKeys.splice(index, 1);
    this.setState({ keys: newKeys });
  }

  render() {
    const encodedMacro = this.encodeMacro();
    const byte = this.calcMacroByte(encodedMacro);

    return (
      <>
        <div
          className="macro-editor-wrapper"
          style={{ height: this.props.keyboardHeight! + KEY_DIFF_HEIGHT }}
        >
          <div className="macro-editor-content">
            {this.props.draggingKey && <div className="dragMask"></div>}

            <div className="macro-editor-content-title">
              Edit Macro: {this.props.macroKey!.label}&nbsp;({byte} Byte)
            </div>
            <div
              className="macro-editor-content-keys"
              style={{ maxHeight: this.props.keyboardHeight! }}
            >
              {this.state.keys.map((key, index) => {
                return (
                  <MacroKeyView
                    key={`macro-keys-${index}`}
                    index={index}
                    macroKey={key}
                    onDrop={(droppedIndex) => {
                      this.onDrop(droppedIndex);
                    }}
                    onDragStart={(draggingIndex) => {
                      this.onDragStart(draggingIndex);
                    }}
                    onDelete={(index) => {
                      this.onDelete(index);
                    }}
                    onChangeType={(index, type) => {
                      this.onChangeTapHoldType(index, type);
                    }}
                  />
                );
              })}

              <DropKeyArea
                index={this.state.keys.length}
                onDrop={(droppedIndex) => {
                  this.onDrop(droppedIndex);
                }}
              />
            </div>
            <div className="macro-editor-content-footer">
              <div className="macro-editor-encode-text"></div>
              <div className="macro-editor-buttons">
                <Button
                  size="small"
                  variant="text"
                  color="primary"
                  disableElevation
                  onClick={this.props.closeMacroEditor!.bind(this)}
                >
                  CANCEL
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={this.onClickSave.bind(this)}
                >
                  SAVE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function doesDragLeftHalf(event: React.DragEvent<HTMLDivElement>) {
  const dragX = event.clientX;
  const div = event.target as HTMLDivElement;
  const divCenter = div.offsetLeft + div.offsetWidth / 2;
  const isLeft = dragX < divCenter;
  return isLeft;
}

type MacroKeyViewProps = {
  index: number;
  macroKey: MacroKey;
  onDragStart: (draggingIndex: number) => void;
  onDrop: (droppedIndex: number) => void;
  onDelete: (index: number) => void;
  onChangeType: (index: number, type: TapHold) => void;
};
function MacroKeyView(props: MacroKeyViewProps) {
  const [onDragOverLeft, setOnDragOverLeft] = useState<boolean>(false);
  const [onDragOverRight, setOnDragOverRight] = useState<boolean>(false);

  return (
    <div
      className={[
        'macro-key-wrapper',
        onDragOverLeft && 'drag-over-left',
        onDragOverRight && 'drag-over-right',
      ].join(' ')}
      onDragOver={(event) => {
        event.preventDefault();
        //console.log(event);
        if (doesDragLeftHalf(event)) {
          setOnDragOverLeft(true);
          setOnDragOverRight(false);
        } else {
          setOnDragOverLeft(false);
          setOnDragOverRight(true);
        }
      }}
      onDragLeave={() => {
        setOnDragOverLeft(false);
        setOnDragOverRight(false);
      }}
      onDrop={() => {
        if (onDragOverLeft) {
          props.onDrop(props.index);
        } else if (onDragOverRight) {
          props.onDrop(props.index + 1);
        }
        setOnDragOverLeft(false);
        setOnDragOverRight(false);
      }}
    >
      <div
        className={[
          'macro-key',
          props.macroKey.type == 'tap' ? 'macro-key-tap' : 'macro-key-hold',
        ].join(' ')}
        draggable={true}
        onDragStart={() => {
          props.onDragStart(props.index);
        }}
      >
        <div className="macro-key-label macro-key-top">
          <a
            onClick={() => {
              props.onDelete(props.index);
            }}
          >
            x
          </a>
        </div>
        <div className="macro-key-label macro-key-middle">
          {props.macroKey.key.label}
        </div>
        <div className="macro-key-label macro-key-bottom">
          {props.macroKey.type.toUpperCase()}
        </div>
      </div>
      <div className="macro-key-under">
        {!props.macroKey.key.keymap.isAscii && (
          <Button
            className="macro-key-toggle-tap-hold-btn"
            size="small"
            color="primary"
            variant="text"
            disableElevation
            onClick={() => {
              if (props.macroKey.type === 'tap') {
                props.onChangeType(props.index, 'hold');
              } else {
                props.onChangeType(props.index, 'tap');
              }
            }}
          >
            <SwapHorizIcon />
            {props.macroKey.type === 'tap' ? 'HOLD' : 'TAP'}
          </Button>
        )}
      </div>
    </div>
  );
}

type DropKeyAreaProps = {
  index: number;
  onDrop: (droppedIndex: number) => void;
};
function DropKeyArea(props: DropKeyAreaProps) {
  const [onDragOver, setOnDragOver] = useState<boolean>(false);
  return (
    <div
      className={['macro-drop-key-area', onDragOver && 'drag-over-left'].join(
        ' '
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setOnDragOver(true);
      }}
      onDragLeave={() => {
        setOnDragOver(false);
      }}
      onDrop={() => {
        setOnDragOver(false);
        props.onDrop(props.index);
      }}
    ></div>
  );
}
