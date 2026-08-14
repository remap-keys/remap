import React, { useMemo } from 'react';
import { parseAnsi } from '../../../utils/AnsiParser';

type AnsiTextProps = {
  text: string;
};

export default function AnsiText({ text }: AnsiTextProps) {
  const segments = useMemo(() => parseAnsi(text), [text]);
  return (
    <>
      {segments.map((seg, i) => (
        <span key={i} style={seg.style}>
          {seg.text}
        </span>
      ))}
    </>
  );
}
