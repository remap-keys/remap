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
import FlashButton, { FlashButtonState } from '../../common/flash/FlashButton';

const KEY_DIFF_HEIGHT = 78;

type MacroEditorOwnProps = {};

type MacroEditorOwnState = {
  draggingKey: MacroKey | null;
  draggingIndex: number; // index of macro key list
  draggingHoldIndex: number; // index of Hold key list
  flashButtonState: FlashButtonState;
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
      flashButtonState: 'enable',
    };
  }

  private addKey(index: number, indexInHold: number, newKey: Key) {
    const macroKeys: MacroKey[] = lodash.cloneDeep(this.props.macroKeys!);
    if (Number.isNaN(indexInHold)) {
      const tap: Tap = { key: newKey, type: MacroTap };
      macroKeys.splice(index, 0, tap);
      this.props.updateMacroKeys!(macroKeys);
      return;
    }

    // drop in a HOLD
    const hold = macroKeys[index];
    if (!isHold(hold)) {
      throw new Error(
        `The macro key MUST BE a hold / index: ${index}, holdIndex: ${indexInHold}`
      );
    }

    hold.keys.splice(indexInHold, 0, newKey);
    this.props.updateMacroKeys!(macroKeys);
  }

  private clearDraggingState() {
    this.setState({
      draggingKey: null,
      draggingIndex: NaN,
      draggingHoldIndex: NaN,
    });
  }

  private onClickSave() {
    this.setState({ flashButtonState: 'flashing' });
    this.props.saveMacro!();

    setTimeout(() => {
      this.setState({ flashButtonState: 'success' });
    }, 1500);

    setTimeout(() => {
      this.setState({ flashButtonState: 'enable' });
    }, 2500);
  }

  private moveKey(
    fromIndex: number,
    fromIndexInHold: number,
    toIndex: number,
    toIndexInHold: number
  ) {
    if (fromIndex === toIndex && fromIndexInHold === toIndexInHold) {
      return;
    }
    const macroKeys: MacroKey[] = lodash.cloneDeep(this.props.macroKeys!);
    const srcMacroKey: MacroKey = macroKeys[fromIndex];
    const dstMacroKey: MacroKey = macroKeys[toIndex];
    if (fromIndex === toIndex && isHold(srcMacroKey)) {
      // drag a hold and drop it to the same hold
      return;
    }
    let dragKey: MacroKey | null = null;
    if (Number.isNaN(fromIndexInHold)) {
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
          key: holdKey.keys.splice(fromIndexInHold, 1)[0],
          type: MacroTap,
        };

        if (fromIndex === toIndex && fromIndexInHold < toIndexInHold) {
          // move in the same hold
          toIndexInHold = toIndexInHold - 1;
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
    if (Number.isNaN(toIndexInHold)) {
      macroKeys.splice(toIndex, 0, dragKey);
      this.props.updateMacroKeys!(macroKeys);
      return;
    }

    // drag into the Hold
    let dstHoldKey: Hold = dstMacroKey as Hold;

    if (!isHold(dstHoldKey)) {
      throw new Error(
        `The macro key MUST BE a hold / index: ${toIndex}, holdIndex: ${toIndexInHold}`
      );
    }

    function insertDragKeys(index: number, macroKey: MacroKey) {
      if (isHold(macroKey)) {
        dstHoldKey.keys.splice(index, 0, ...macroKey.keys);
      } else {
        dstHoldKey.keys.splice(index, 0, macroKey.key);
      }
    }

    if (fromIndex === toIndex) {
      // move in the same holder
      insertDragKeys(toIndexInHold, dragKey);
    } else {
      insertDragKeys(toIndexInHold, dragKey);
    }
    this.props.updateMacroKeys!(macroKeys);
  }

  shouldComponentUpdate(
    _nextProps: MacroEditorProps,
    nextState: MacroEditorOwnState
  ) {
    if (
      nextState.flashButtonState === 'enable' ||
      nextState.flashButtonState === 'disable'
    ) {
      return true;
    }

    // in animation: will be changed 'success'
    if (
      this.state.flashButtonState === 'flashing' &&
      nextState.flashButtonState === 'flashing'
    ) {
      return false;
    }

    // in animation: will be changed 'enable'
    if (
      this.state.flashButtonState === 'success' &&
      nextState.flashButtonState === 'success'
    ) {
      return false;
    }

    return true;
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
        this.addKey(droppedIndex, droppedHoldIndex, this.props.draggingKey);
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
    let flashButtonState: FlashButtonState = this.state.flashButtonState;

    const remainingBytesLength =
      this.props.maxMacroBufferSize! -
      this.props.macroBuffer!.getBytes().length;

    const canSave = 0 < remainingBytesLength;
    if (!canSave) {
      flashButtonState = 'disable';
    }

    if (
      0 < this.props.notifications!.length &&
      flashButtonState === 'success'
    ) {
      // Prevent to show success action because something wrong with flashing the macro
      flashButtonState = 'enable';
      this.setState({ flashButtonState: 'enable' });
    }

    const isDraggingAscii = this.state.draggingKey
      ? isTap(this.state.draggingKey)
        ? Boolean(this.state.draggingKey.key.keymap.isAscii)
        : false
      : false;

    let isLeftHold = false;
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
                  isLeftHold = false;
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
                  const isBetweenHold = isLeftHold;
                  isLeftHold = true;
                  return (
                    <div
                      key={`macro-keys-${index}`}
                      className="macro-hold-with-spacer"
                    >
                      {isBetweenHold && (
                        <MacroDropSpacer
                          index={index}
                          onDrop={(droppedIndex) => {
                            this.onDrop(droppedIndex, NaN);
                          }}
                        />
                      )}
                      <MacroKeyHold
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
                    </div>
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
              <Button
                size="small"
                variant="text"
                color="primary"
                disableElevation
                onClick={this.props.closeMacroEditor!.bind(this)}
              >
                BACK
              </Button>
              <FlashButton
                size="small"
                label="FLASH"
                duration={2500}
                buttonState={flashButtonState}
                onClick={this.onClickSave.bind(this)}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

type MacroDropSpacerProps = {
  index: number;
  onDrop: (droppedIndex: number) => void;
};
function MacroDropSpacer(props: MacroDropSpacerProps) {
  const [onDragOver, setOnDragOver] = useState<boolean>(false);
  return (
    <div
      className={[
        'macro-drop-spacer',
        onDragOver && 'macro-drop-spacer-over',
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
    ></div>
  );
}

function doesDragLeftHalf(event: React.DragEvent<HTMLDivElement>) {
  const cursorX = event.clientX;
  const div = event.target as HTMLDivElement;
  const rect = div.getBoundingClientRect();
  const left = rect.left;
  const center = left + rect.width / 2;
  const diffLeft = cursorX - left;
  return 0 <= diffLeft && cursorX < center; // isLeft
}

function doesDragRightHalf(event: React.DragEvent<HTMLDivElement>) {
  const cursorX = event.clientX;
  const div = event.target as HTMLDivElement;
  const rect = div.getBoundingClientRect();
  const left = rect.left;
  const right = rect.right;
  const center = left + rect.width / 2;
  const diffRight = right - cursorX;
  return center <= cursorX && 0 <= diffRight;
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
        draggable={true}
        onDragStart={(event) => {
          event.stopPropagation();
          props.onDragStart(props.index);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (doesDragLeftHalf(event)) {
            setOnDragOverLeft(true);
            setOnDragOverRight(false);
          } else if (doesDragRightHalf(event)) {
            setOnDragOverLeft(false);
            setOnDragOverRight(true);
          } else {
            setOnDragOverLeft(false);
            setOnDragOverRight(false);
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
            inHold ? 'macro-key-hold' : 'macro-key-tap',
          ].join(' ')}
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
    <div>
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
      {props.isDraggingAscii && onDragOver && (
        <div
          className="prevent-drop-macro"
          style={{ width: 10 + props.macroKey.keys.length * 64 }}
          onDragOver={(event) => {
            event.preventDefault();
            setOnDragOver(true);
          }}
          onDragLeave={() => {
            setOnDragOver(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOnDragOver(false);
          }}
        >
          NO ASCII IN HOLD
        </div>
      )}
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
