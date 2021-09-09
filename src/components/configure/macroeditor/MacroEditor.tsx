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
  TapHoldType,
  MacroKey,
  isHold,
  isTap,
  Tap,
} from '../../../services/macro/Macro';
import lodash from 'lodash';

const KEY_DIFF_HEIGHT = 78;

type MacroEditorOwnProps = {};

type MacroEditorOwnState = {
  draggingKey: MacroKey | null;
  draggingIndex: number; // index of macro key list
  draggingHoldIndex: number; // index of Hold key list
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
      draggingKey: null,
      draggingIndex: NaN,
      draggingHoldIndex: NaN,
    };
  }

  private addKey(index: number, newKey: Key) {
    let newKeys: MacroKey[] = [];
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

  private clearDraggingState() {
    this.setState({
      draggingKey: null,
      draggingIndex: NaN,
      draggingHoldIndex: NaN,
    });
  }

  private onClickSave() {
    this.props.saveMacro!();
  }

  private moveKey(
    fromIndex: number,
    fromHolderIndex: number,
    toIndex: number,
    toHolderIndex: number
  ) {
    console.log(
      `${fromIndex}/${fromHolderIndex} -> ${toIndex}/${toHolderIndex}`
    );
    const macroKeys: MacroKey[] = lodash.cloneDeep(this.props.macroKeys!);
    let dragKey: MacroKey | null = null;
    if (Number.isNaN(fromHolderIndex)) {
      // drag a tap or a hold
      dragKey = macroKeys.splice(fromIndex, 1)[0];
      if (fromIndex < toIndex) {
        toIndex = toIndex - 1;
      }
    } else {
      // drag a tap key in Hold
      const holdKey = macroKeys[fromIndex];
      if (isHold(holdKey)) {
        // convert the dragging Key to a Tap
        dragKey = {
          key: holdKey.keys.splice(fromHolderIndex, 1)[0],
          type: MacroTap,
        };

        if (fromIndex === toIndex && fromHolderIndex < toHolderIndex) {
          // move in the same hold
          toHolderIndex = toHolderIndex - 1;
        } else {
          if (holdKey.keys.length === 0) {
            // delete the empty Hold
            macroKeys.splice(fromIndex, 1);
            if (fromIndex < toIndex) {
              toIndex = toIndex - 1;
            }
          }
        }
      }
    }

    if (dragKey === null) return;

    // copy an dragging key to the macro key list
    if (Number.isNaN(toHolderIndex)) {
      macroKeys.splice(toIndex, 0, dragKey);
      this.props.updateMacroKeys!(macroKeys);
      return;
    }

    // drag into the Hold
    let dstHoldKey: Hold = macroKeys[toIndex] as Hold;

    if (!isHold(dstHoldKey)) {
      throw new Error(
        `The macro key MUST BE a hold / index: ${toIndex}, holdIndex: ${toHolderIndex}`
      );
    }
    console.log(
      `inHold: ${fromIndex}/${fromHolderIndex} -> ${toIndex}/${toHolderIndex}`
    );

    function insertDragKeys(index: number, macroKey: MacroKey) {
      if (isHold(macroKey)) {
        dstHoldKey.keys.splice(index, 0, ...macroKey.keys);
      } else {
        console.log(macroKey.key);
        console.log(dstHoldKey);
        dstHoldKey.keys.splice(index, 0, macroKey.key);
        console.log(dstHoldKey);
      }
    }

    if (fromIndex === toIndex) {
      // move in the same holder
      insertDragKeys(toHolderIndex, dragKey);
    } else {
      console.log('heree');
      insertDragKeys(toHolderIndex, dragKey);
    }
    this.props.updateMacroKeys!(macroKeys);
  }

  onDragStart(
    draggingIndex: number,
    draggingHoldIndex: number,
    draggingKey: MacroKey
  ) {
    this.setState({ draggingIndex, draggingHoldIndex, draggingKey });
  }

  onDrop(droppedIndex: number, droppedHoldIndex: number) {
    if (Number.isNaN(this.state.draggingIndex)) {
      // from Keycodes
      if (this.props.draggingKey) {
        this.addKey(droppedIndex, this.props.draggingKey);
      }
    } else {
      // in MacroEditor
      this.moveKey(
        this.state.draggingIndex,
        this.state.draggingHoldIndex,
        droppedIndex,
        droppedHoldIndex
      );
    }

    this.clearDraggingState();
  }

  onDelete(index: number, holdIndex?: number) {
    const newKeys = [...this.props.macroKeys!];
    if (holdIndex === undefined) {
      newKeys.splice(index, 1);
    } else {
      const item: Hold = newKeys[index] as Hold;
      if (!isHold(item)) return;

      // delete the key in the Hold
      const newHold: Hold = {
        keys: item.keys.filter((_, i) => i != holdIndex),
        type: MacroHold,
      };

      // also delete this Hold?
      if (newHold.keys.length === 0) {
        newKeys.splice(index, 1);
      } else {
        newKeys.splice(index, 1, newHold);
      }
    }
    this.props.updateMacroKeys!(newKeys);
  }

  onToggleKeyType(index: number) {
    const macroKey: MacroKey = this.props.macroKeys![index];

    const newKeys: MacroKey[] = [];
    this.props.macroKeys!.forEach((macro, i) => {
      if (i === index) {
        if (isTap(macroKey)) {
          newKeys.push({ keys: [macroKey.key], type: MacroHold });
        } else if (isHold(macroKey)) {
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
    const isDraggingAscii = this.state.draggingKey
      ? isTap(this.state.draggingKey)
        ? Boolean(this.state.draggingKey.key.keymap.isAscii)
        : false
      : false;

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
                    <div
                      key={`macro-keys-${index}`}
                      className="macro-hold-wrapper"
                    >
                      <MacroKeyView
                        index={index}
                        macroKey={macroKey.key}
                        onDrop={(droppedIndex) => {
                          this.onDrop(droppedIndex, NaN);
                        }}
                        onDragStart={(draggingIndex) => {
                          this.onDragStart(draggingIndex, NaN, macroKey);
                        }}
                        onDelete={(index) => {
                          this.onDelete(index);
                        }}
                        onChangeType={(index, type) => {
                          this.onToggleKeyType(index);
                        }}
                      />
                    </div>
                  );
                } else if (isHold(macroKey)) {
                  return (
                    <MacroKeyHold
                      key={`macro-keys-${index}`}
                      index={index}
                      isDraggingAscii={isDraggingAscii}
                      macroKey={macroKey}
                      onDrop={(droppedIndex, droppedHoldIndex) => {
                        this.onDrop(droppedIndex, droppedHoldIndex);
                      }}
                      onDragStart={(
                        draggingIndex,
                        draggingHoldIndex,
                        macroKey
                      ) => {
                        this.onDragStart(
                          draggingIndex,
                          draggingHoldIndex,
                          macroKey
                        );
                      }}
                      onDelete={(index, holdIndex) => {
                        this.onDelete(index, holdIndex);
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
                  this.onDrop(droppedIndex, NaN);
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
  console.log(event);
  const divCenter = div.offsetLeft + div.offsetWidth / 2;
  console.log(`dragX: ${dragX}, divCenter: ${divCenter}`);
  return dragX < divCenter; // isLeft
}

type MacroKeyViewProps = {
  index: number;
  holdIndex?: number; // tap: undefined, hold: [0-n]
  macroKey: Key;
  onDragStart: (draggingIndex: number) => void;
  onDrop: (droppedIndex: number) => void;
  onDelete: (index: number) => void;
  onChangeType?: (index: number, type: TapHoldType) => void;
};
function MacroKeyView(props: MacroKeyViewProps) {
  const [onDragOverLeft, setOnDragOverLeft] = useState<boolean>(false);
  const [onDragOverRight, setOnDragOverRight] = useState<boolean>(false);

  const inHold: boolean = props.holdIndex != undefined;

  return (
    <>
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
            props.onDrop(Math.max(props.index, 0));
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
            inHold ? 'macro-key-hold' : 'macro-key-tap',
          ].join(' ')}
          draggable={true}
          onDragStart={(event) => {
            event.stopPropagation();
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
          <div className="macro-key-label macro-key-bottom">
            {!inHold && 'TAP'}
          </div>
        </div>
      </div>

      {!inHold && (
        <div className="macro-key-under">
          {props.macroKey.keymap.isAscii ? (
            <div className="macro-key-toggle-tap-hold-btn">ASCII</div>
          ) : (
            <Button
              className="macro-key-toggle-tap-hold-btn"
              size="small"
              color="primary"
              variant="text"
              disableElevation
              onClick={() => {
                if (props.onChangeType) props.onChangeType(props.index, 'hold');
              }}
            >
              <SwapHorizIcon />
              HOLD
            </Button>
          )}
        </div>
      )}
    </>
  );
}

type MacroKeyHoldProps = {
  index: number;
  macroKey: Hold;
  isDraggingAscii: boolean;
  onDragStart: (
    draggingIndex: number,
    draggingHoldIndex: number,
    macroKey: MacroKey
  ) => void;
  onDrop: (droppedIndex: number, holdIndex: number) => void;
  onDelete: (index: number, holdIndex: number) => void;
  onChangeType: (index: number) => void;
};
function MacroKeyHold(props: MacroKeyHoldProps) {
  const [onDragOver, setOnDragOver] = useState<boolean>(false);
  return (
    <div
      className={['macro-hold-wrapper', 'macro-hold'].join(' ')}
      draggable={true}
      onDragStart={(event) => {
        event.stopPropagation();
        props.onDragStart(props.index, NaN, props.macroKey);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setOnDragOver(true);
      }}
      onDragLeave={(event) => {
        setOnDragOver(false);
      }}
      onDrop={(event) => {
        setOnDragOver(false);
      }}
    >
      <div className="macro-hold-keys">
        {props.macroKey.keys.map((key, index) => {
          return (
            <MacroKeyView
              key={`macro-keys-hold-${props.index}-${index}`}
              index={index}
              macroKey={key}
              holdIndex={props.index}
              onDrop={(droppedIndex) => {
                props.onDrop(props.index, droppedIndex);
              }}
              onDragStart={(draggingIndex) => {
                props.onDragStart(props.index, draggingIndex, {
                  key: key,
                  type: MacroTap,
                });
              }}
              onDelete={(index) => {
                props.onDelete(props.index, index);
              }}
            />
          );
        })}
      </div>
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
          TAP
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
      className={['macro-hold-wrapper', 'macro-drop-key-area'].join(' ')}
      onDragOver={(event) => {
        event.preventDefault();
        setOnDragOver(true);
      }}
      onDragLeave={() => {
        setOnDragOver(false);
      }}
      onDrop={() => {
        console.log(`onDrop: ${props.index}`);
        setOnDragOver(false);
        props.onDrop(props.index);
      }}
    >
      <div
        className={[
          'macro-drop-key-content',
          props.noKeys && 'macro-drop-key-area-with-message',
          onDragOver && 'drag-over-left',
        ].join(' ')}
      >
        {props.noKeys ? 'Please drop a keycode here!' : ''}
      </div>
    </div>
  );
}
