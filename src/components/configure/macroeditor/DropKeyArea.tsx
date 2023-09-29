import React, { useState } from 'react';

type DropKeyAreaProps = {
  index: number;
  noKeys: boolean;
  // eslint-disable-next-line no-unused-vars
  onDrop: (droppedIndex: number) => void;
};
export function DropKeyArea(props: DropKeyAreaProps) {
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
        {props.noKeys ? 'Please drop a keycode or enter text here!' : ''}
      </div>
    </div>
  );
}
