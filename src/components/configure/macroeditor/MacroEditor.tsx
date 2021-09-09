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
import {
  Hold,
  MacroHold,
  MacroTap,
  MacroKeys,
  Tap,
  TapHoldType,
  MacroKey,
} from '../../../services/macro/Macro';

const KEY_DIFF_HEIGHT = 78;

type MacroEditorOwnProps = {};

type MacroEditorOwnState = {
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
      draggingIndex: NaN,
    };
  }

  private addKey(index: number, newKey: Key) {
    let newKeys: MacroKeys = [];
    for (let i = 0; i < this.props.macroKeys!.length; i++) {
      const macroKey = this.props.macroKeys![i];
      if (i === index) {
        newKeys.push({ key: newKey, type: MacroTap });
      }
      newKeys.push(macroKey);
    }

    if (index === this.props.macroKeys!.length) {
      newKeys.push({ key: newKey, type: 'tap' });
    }

    this.props.updateMacroKeys!(newKeys);
  }

  private onClickSave() {
    this.props.saveMacro!();
  }

  private moveKey(fromIndex: number, toIndex: number) {
    const dragKey = this.props.macroKeys![fromIndex];
    let newKeys = [];
    for (let i = 0; i < this.props.macroKeys!.length; i++) {
      const key = this.props.macroKeys![i];
      if (i === toIndex) {
        newKeys.push(dragKey);
      }
      newKeys.push(key);
    }

    if (toIndex === this.props.macroKeys!.length) {
      newKeys.push(dragKey);
    }

    if (toIndex < this.state.draggingIndex) {
      newKeys.splice(this.state.draggingIndex + 1, 1);
    } else {
      newKeys.splice(this.state.draggingIndex, 1);
    }

    this.props.updateMacroKeys!(newKeys);
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
      // TODO: dropした結果、Holdのkeysが空になったらHoldを削除
    }

    this.setState({ draggingIndex: NaN });
  }

  onDelete(index: number) {
    const newKeys = [...this.props.macroKeys!];
    newKeys.splice(index, 1);
    this.props.updateMacroKeys!(newKeys);
  }

  onToggleKeyType(index: number) {
    const macroKey: MacroKey = this.props.macroKeys![index];

    const newKeys: MacroKeys = [];
    this.props.macroKeys!.forEach((macro, i) => {
      if (i === index) {
        if (macroKey.type === MacroTap) {
          newKeys.push({ keys: [macroKey.key], type: MacroHold });
        } else if (macroKey.type === MacroHold) {
          macroKey.keys.map((key) => {
            newKeys.push({ key: key, type: MacroTap });
          });
        }
      } else {
        newKeys.push(macro);
      }
    });
    this.props.updateMacroKeys!(newKeys);
  }

  render() {
    const remainingBytesLength =
      this.props.maxMacroBufferSize! -
      this.props.macroBuffer!.getBytes().length;
    const canSave = 0 < remainingBytesLength;

    return (
      <>
        <div
          className="macro-editor-wrapper"
          style={{ height: this.props.keyboardHeight! + KEY_DIFF_HEIGHT }}
        >
          <div className="macro-editor-content">
            {this.props.draggingKey && <div className="dragMask" />}

            <div className="macro-editor-content-title">
              Edit Macro: {this.props.macroKey!.label}&nbsp;(
              {remainingBytesLength} Bytes remaining)
            </div>
            <div
              className="macro-editor-content-keys"
              style={{ maxHeight: this.props.keyboardHeight! }}
            >
              {this.props.macroKeys!.map((macroKey, index) => {
                if (macroKey.type === MacroTap) {
                  return (
                    <MacroKeyView
                      key={`macro-keys-${index}`}
                      index={index}
                      macroKey={macroKey.key}
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
                        this.onToggleKeyType(index);
                      }}
                    />
                  );
                } else if (macroKey.type === MacroHold) {
                  return (
                    <MacroKeyHold
                      key={`macro-keys-${index}`}
                      index={index}
                      macroKey={macroKey}
                      onDrop={(droppedIndex) => {
                        this.onDrop(droppedIndex);
                      }}
                      onDragStart={(draggingIndex) => {
                        this.onDragStart(draggingIndex);
                      }}
                      onDelete={(index) => {
                        this.onDelete(index);
                      }}
                      onChangeType={(index) => {
                        this.onToggleKeyType(index);
                      }}
                    />
                  );
                }
              })}

              <DropKeyArea
                index={this.props.macroKeys!.length}
                noKeys={this.props.macroKeys!.length === 0}
                onDrop={(droppedIndex) => {
                  this.onDrop(droppedIndex);
                }}
              />
            </div>
            <div className="macro-editor-content-footer">
              <div className="macro-editor-encode-text" />
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
                  disabled={!canSave}
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
  return dragX < divCenter; // isLeft
}

type MacroKeyViewProps = {
  index: number;
  macroKey: Key;
  onDragStart: (draggingIndex: number) => void;
  onDrop: (droppedIndex: number) => void;
  onDelete: (index: number) => void;
  onChangeType: (index: number, type: TapHoldType) => void;
};
function MacroKeyView(props: MacroKeyViewProps) {
  const [onDragOverLeft, setOnDragOverLeft] = useState<boolean>(false);
  const [onDragOverRight, setOnDragOverRight] = useState<boolean>(false);

  return (
    <div className="macro-hold-wrapper">
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
          className={['macro-key', 'macro-key-tap'].join(' ')}
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
            {props.macroKey.label}
          </div>
          <div className="macro-key-label macro-key-bottom">TAP</div>
        </div>
        <div className="macro-key-under">
          {!props.macroKey.keymap.isAscii && (
            <Button
              className="macro-key-toggle-tap-hold-btn"
              size="small"
              color="primary"
              variant="text"
              disableElevation
              onClick={() => {
                props.onChangeType(props.index, 'hold');
              }}
            >
              <SwapHorizIcon />
              HOLD
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

type MacroKeyHoldProps = {
  index: number;
  macroKey: Hold;
  onDragStart: (draggingIndex: number) => void;
  onDrop: (droppedIndex: number) => void;
  onDelete: (index: number) => void;
  onChangeType: (index: number) => void;
};
function MacroKeyHold(props: MacroKeyHoldProps) {
  const [onDragOverLeft, setOnDragOverLeft] = useState<boolean>(false);
  const [onDragOverRight, setOnDragOverRight] = useState<boolean>(false);

  return (
    <div className="macro-hold-wrapper macro-hold">
      {props.macroKey.keys.map((key, index) => {
        return (
          <MacroKeyView
            key={`macro-keys-hold-${index}-${index}`}
            index={index}
            macroKey={key}
            onDrop={(droppedIndex) => {
              //onDrop(droppedIndex);
            }}
            onDragStart={(draggingIndex) => {
              //onDragStart(draggingIndex);
            }}
            onDelete={(index) => {
              //onDelete(index);
            }}
            onChangeType={(index) => {
              //onToggleKeyType(index);
            }}
          />
        );
      })}
      <div className="macro-key-under">
        <Button
          className="macro-key-toggle-tap-hold-btn"
          size="small"
          color="primary"
          variant="text"
          disableElevation
          onClick={() => {
            props.onChangeType(props.index);
          }}
        >
          <SwapHorizIcon />
          HOLD
        </Button>
      </div>
    </div>
  );
}

type DropKeyAreaProps = {
  index: number;
  noKeys: boolean;
  onDrop: (droppedIndex: number) => void;
};
function DropKeyArea(props: DropKeyAreaProps) {
  const [onDragOver, setOnDragOver] = useState<boolean>(false);
  return (
    <div
      className={[
        'macro-drop-key-area',
        props.noKeys && 'macro-drop-key-area-with-message',
        onDragOver && 'drag-over-left',
      ].join(' ')}
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
    >
      {props.noKeys ? 'Please drop a keycode here!' : ''}
    </div>
  );
}
