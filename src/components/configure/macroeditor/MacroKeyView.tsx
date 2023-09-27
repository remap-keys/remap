import { KeyDelayPair, TapHoldType } from '../../../services/macro/Macro';
import React, { useState } from 'react';
import HourglassBottom from '@mui/icons-material/HourglassBottom';
import { Button } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

type MacroKeyViewProps = {
  index: number;
  holdIndex?: number; // tap: undefined, hold: [0-n]
  keyDelayPair: KeyDelayPair;
  onDragStart: (draggingIndex: number) => void;
  onDrop: (droppedIndex: number) => void;
  onDelete: (index: number) => void;
  onChangeType?: (index: number, type: TapHoldType) => void;
  onChangeDelay: (index: number, subIndex: number | undefined) => void;
};
export function MacroKeyView(props: MacroKeyViewProps) {
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
            <div
              className="macro-key-label macro-key-top-left"
              onClick={() => {
                props.holdIndex !== undefined
                  ? props.onChangeDelay(props.holdIndex, props.index)
                  : props.onChangeDelay(props.index, undefined);
              }}
            >
              <HourglassBottom sx={{ fontSize: '0.7rem' }} />
              <span>{props.keyDelayPair.delay}</span>
            </div>
            <a
              onClick={() => {
                props.onDelete(props.index);
              }}
            >
              x
            </a>
          </div>
          <div className="macro-key-label macro-key-middle">
            {props.keyDelayPair.key.label}
          </div>
          <div className="macro-key-label macro-key-bottom">
            {!inHold && 'TAP'}
          </div>
        </div>
      </div>

      {!inHold && (
        <div className="macro-key-under">
          {props.keyDelayPair.key.keymap.isAscii ? (
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
