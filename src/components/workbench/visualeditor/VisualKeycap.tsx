import React from 'react';
import KeyModel from '../../../models/KeyModel';
import { KEY_SIZE } from '../../configure/keycap/Keycap';

const BORDER = 1;
const MARGIN_W = 5;
const MARGIN_H = 5;
const ROOF_TOP = 3;

type VisualKeycapProps = {
  model: KeyModel;
  label: string;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
};

export default function VisualKeycap({
  model,
  label,
  isSelected,
  onClick,
}: VisualKeycapProps) {
  const width = model.width;
  const height = model.height;
  const top = model.top;
  const left = model.left;

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    top,
    left,
    width,
    height,
    background: model.color,
  };

  const roofBaseStyle: React.CSSProperties = {
    position: 'absolute',
    width: width - (MARGIN_W + BORDER) * 2,
    height: height - (MARGIN_H + BORDER) * 2,
    top: top + ROOF_TOP,
    left: left + BORDER + MARGIN_W,
  };

  const roofStyle: React.CSSProperties = {
    position: 'absolute',
    width: width - (MARGIN_W + BORDER * 2) * 2,
    height: height - MARGIN_H * 2 - BORDER * 4,
    top: top + ROOF_TOP + BORDER,
    left: left + BORDER + MARGIN_W + BORDER,
  };

  // Truncate label to fit within keycap
  const maxChars = Math.max(3, Math.floor((width - 12) / 6));
  const displayLabel =
    label.length > maxChars ? label.substring(0, maxChars) + '…' : label;

  // Adjust font size based on label length
  const fontSize = displayLabel.length > 6 ? 8 : displayLabel.length > 4 ? 9 : 10;

  return (
    <div
      className={[
        'visual-keycap-base',
        isSelected && 'visual-keycap-selected',
      ]
        .filter(Boolean)
        .join(' ')}
      style={model.styleTransform}
      onClick={onClick}
    >
      <div className="layout-preview-key" style={baseStyle} />
      <div className="layout-preview-key-roof-base" style={roofBaseStyle} />
      <div className="layout-preview-key-roof" style={roofStyle}>
        <span
          className="visual-keycap-label"
          style={{ fontSize: `${fontSize}px` }}
        >
          {displayLabel}
        </span>
      </div>
    </div>
  );
}

export { KEY_SIZE };
