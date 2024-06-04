/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { KeyboardEvent } from 'react';
import './MacroEditor.scss';
import {
  MacroEditorActionsType,
  MacroEditorStateType,
} from './MacroEditor.container';
import { Button } from '@mui/material';
import { genKey, Key } from '../keycodekey/KeyGen';
import {
  Hold,
  MacroHold,
  MacroTap,
  MacroKey,
  isHold,
  isTap,
  Tap,
  KeyDelayPair,
} from '../../../services/macro/Macro';
import FlashButton, { FlashButtonState } from '../../common/flash/FlashButton';
import { KeycodeCompositionFactory } from '../../../services/hid/Composition';
import { MacroDropSpacer } from './MacroDropSpacer';
import { MacroKeyView } from './MacroKeyView';
import { MacroKeyHold } from './MacroKeyHold';
import { DropKeyArea } from './DropKeyArea';

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

  private addKey(
    index: number,
    indexInHold: number,
    newKeyDelayPair: KeyDelayPair
  ) {
    const macroKeys: MacroKey[] = structuredClone(this.props.macroKeys!);
    if (Number.isNaN(indexInHold)) {
      // TODO: Set delay.
      const tap: Tap = {
        keyDelayPair: newKeyDelayPair,
        type: MacroTap,
      };
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

    hold.keyDelayPairs.splice(indexInHold, 0, newKeyDelayPair);
    this.props.updateMacroKeys!(macroKeys);
  }

  private addTapKeys(index: number, newKeyDelayPairs: KeyDelayPair[]) {
    const macroKeys: MacroKey[] = structuredClone(this.props.macroKeys!);
    const taps: Tap[] = newKeyDelayPairs.map((v) => {
      // TODO: Set delay.
      return { keyDelayPair: v, type: MacroTap };
    });
    macroKeys.splice(index, 0, ...taps);
    this.props.updateMacroKeys!(macroKeys);
  }

  private popKey() {
    const macroKeys: MacroKey[] = structuredClone(this.props.macroKeys!);
    this.props.updateMacroKeys!(macroKeys.slice(0, -1));
  }

  private clearDraggingState() {
    this.setState({
      draggingKey: null,
      draggingIndex: NaN,
      draggingHoldIndex: NaN,
    });
  }

  private onClickFlash() {
    this.setState({ flashButtonState: 'flashing' });
    this.props.flashMacro!();

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
    const macroKeys: MacroKey[] = structuredClone(this.props.macroKeys!);
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
          keyDelayPair: holdKey.keyDelayPairs.splice(fromIndexInHold, 1)[0],
          type: MacroTap,
        };

        if (fromIndex === toIndex && fromIndexInHold < toIndexInHold) {
          // move in the same hold
          toIndexInHold = toIndexInHold - 1;
        } else {
          if (holdKey.keyDelayPairs.length === 0) {
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
        dstHoldKey.keyDelayPairs.splice(index, 0, ...macroKey.keyDelayPairs);
      } else {
        dstHoldKey.keyDelayPairs.splice(index, 0, macroKey.keyDelayPair);
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
        this.addKey(droppedIndex, droppedHoldIndex, {
          key: this.props.draggingKey,
          delay: 0,
        });
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
        keyDelayPairs: item.keyDelayPairs.filter((_, i) => i != holdIndex),
        type: MacroHold,
      };

      // also delete this Hold?
      if (newHold.keyDelayPairs.length === 0) {
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
          newKeys.push({
            keyDelayPairs: [macroKey.keyDelayPair],
            type: MacroHold,
          });
        } else if (isHold(macroKey)) {
          macroKey.keyDelayPairs.map((keyDelayPair) => {
            newKeys.push({ keyDelayPair, type: MacroTap });
          });
        }
      } else {
        newKeys.push(macro);
      }
    });
    this.props.updateMacroKeys!(newKeys);
  }

  onChangeDelay(index: number, subIndex: number | undefined) {
    const increaseDelay = (oldDelay: number): number => {
      const newDelay =
        oldDelay + (oldDelay >= 5000 ? 1000 : oldDelay >= 1000 ? 100 : 50);
      return newDelay > 9999 ? 0 : newDelay;
    };

    const macroKey = this.props.macroKeys![index];
    let newDelay: number;
    if (isTap(macroKey)) {
      newDelay = increaseDelay(macroKey.keyDelayPair.delay);
    } else {
      newDelay = increaseDelay(macroKey.keyDelayPairs[subIndex!].delay);
    }

    const newKeys: MacroKey[] = [];
    this.props.macroKeys!.forEach((macro, i) => {
      if (i === index) {
        if (isTap(macroKey)) {
          newKeys.push({
            keyDelayPair: { ...macroKey.keyDelayPair, delay: newDelay },
            type: MacroTap,
          });
        } else if (isHold(macroKey)) {
          newKeys.push({
            keyDelayPairs: macroKey.keyDelayPairs.map((keyDelayPair, j) => {
              if (j === subIndex) {
                return { ...keyDelayPair, delay: newDelay };
              }
              return keyDelayPair;
            }),
            type: MacroHold,
          });
        }
      } else {
        newKeys.push(macro);
      }
    });
    this.props.updateMacroKeys!(newKeys);
  }

  onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const key = e.key;
    if (key.toLowerCase() === 'v' && (e.ctrlKey || e.metaKey)) {
      // ignore paste shortcut
      return;
    } else if (key === 'Backspace') {
      this.popKey();
      return;
    } else if (key.length != 1) {
      return;
    }

    const keycodeCompositionFactory = new KeycodeCompositionFactory(
      key.charCodeAt(0),
      this.props.labelLang!
    );

    if (keycodeCompositionFactory.isAscii()) {
      const asciiComposition =
        keycodeCompositionFactory.createAsciiKeycodeComposition();
      const keymap = asciiComposition.genKeymap()!;
      const key = genKey(keymap, this.props.labelLang);
      this.addKey(this.props.macroKeys?.length ?? 0, NaN, { key, delay: 0 });
    }
  }

  onPaste(text: string) {
    const keys: KeyDelayPair[] = text
      .split('')
      .map((c) => {
        return new KeycodeCompositionFactory(
          c.charCodeAt(0),
          this.props.labelLang!
        );
      })
      .filter((c) => c.isAscii())
      .map((c) => {
        const asciiComposition = c.createAsciiKeycodeComposition();
        const keymap = asciiComposition.genKeymap()!;
        const key = genKey(keymap, this.props.labelLang);
        return { key, delay: 0 };
      });
    this.addTapKeys(this.props.macroKeys?.length ?? 0, keys);
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
        ? Boolean(this.state.draggingKey.keyDelayPair.key.keymap.isAscii)
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
              tabIndex={0}
              onKeyDown={(e) => {
                this.onKeyDown(e);
              }}
              onPaste={(e) => {
                this.onPaste(e.clipboardData.getData('text/plain'));
              }}
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
                        keyDelayPair={macroKey.keyDelayPair}
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
                        onChangeDelay={(index, subIndex) => {
                          this.onChangeDelay(index, subIndex);
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
                        onChangeDelay={(index, subIndex) => {
                          this.onChangeDelay(index, subIndex);
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
                onClick={this.onClickFlash.bind(this)}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}
