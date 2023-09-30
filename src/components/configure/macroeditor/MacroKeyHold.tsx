import { Hold, MacroKey, MacroTap } from '../../../services/macro/Macro';
import React, { useState } from 'react';
import { MacroKeyView } from './MacroKeyView';
import { Button } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

type MacroKeyHoldProps = {
  index: number;
  macroKey: Hold;
  isDraggingAscii: boolean;
  onDragStart: (
    // eslint-disable-next-line no-unused-vars
    draggingIndex: number,
    // eslint-disable-next-line no-unused-vars
    draggingHoldIndex: number,
    // eslint-disable-next-line no-unused-vars
    macroKey: MacroKey
  ) => void;
  // eslint-disable-next-line no-unused-vars
  onDrop: (droppedIndex: number, holdIndex: number) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (index: number, holdIndex: number) => void;
  // eslint-disable-next-line no-unused-vars
  onChangeType: (index: number) => void;
  // eslint-disable-next-line no-unused-vars
  onChangeDelay: (index: number, subIndex: number | undefined) => void;
};
export function MacroKeyHold(props: MacroKeyHoldProps) {
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
          {props.macroKey.keyDelayPairs.map((keyDelayPair, index) => {
            return (
              <MacroKeyView
                key={`macro-keys-hold-${props.index}-${index}`}
                index={index}
                keyDelayPair={keyDelayPair}
                holdIndex={props.index}
                onDrop={(droppedIndex) => {
                  props.onDrop(props.index, droppedIndex);
                }}
                onDragStart={(draggingIndex) => {
                  props.onDragStart(props.index, draggingIndex, {
                    keyDelayPair,
                    type: MacroTap,
                  });
                }}
                onDelete={(index) => {
                  props.onDelete(props.index, index);
                }}
                onChangeDelay={(index, subIndex) => {
                  props.onChangeDelay(index, subIndex);
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
          style={{ width: 10 + props.macroKey.keyDelayPairs.length * 64 }}
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
