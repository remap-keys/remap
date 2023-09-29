import React, { useState } from 'react';

type MacroDropSpacerProps = {
  index: number;
  // eslint-disable-next-line no-unused-vars
  onDrop: (droppedIndex: number) => void;
};
export function MacroDropSpacer(props: MacroDropSpacerProps) {
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
