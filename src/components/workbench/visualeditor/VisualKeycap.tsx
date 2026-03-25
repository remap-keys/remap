import React from 'react';
import { Tooltip } from '@mui/material';
import { t } from 'i18next';
import KeyModel from '../../../models/KeyModel';

const BORDER = 1;
const MARGIN_W = 5;
const MARGIN_H = 5;
const ROOF_TOP = 3;

type VisualKeycapProps = {
  model: KeyModel;
  label: string;
  meta?: string;
  isCustom?: boolean;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
};

export default function VisualKeycap({
  model,
  label,
  meta,
  isCustom,
  isSelected,
  onClick,
}: VisualKeycapProps) {
  const { width, height, top, left } = {
    width: model.width,
    height: model.height,
    top: model.top,
    left: model.left,
  };

  const hasMeta = meta !== undefined && meta.length > 0;

  const wrapperStyle: React.CSSProperties = {
    ...model.styleTransform,
    position: 'absolute',
    top,
    left,
    width,
    height,
  };

  const innerBaseStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    background: model.color,
  };

  const innerRoofBaseStyle: React.CSSProperties = {
    position: 'absolute',
    width: width - (MARGIN_W + BORDER) * 2,
    height: height - (MARGIN_H + BORDER) * 2,
    top: ROOF_TOP,
    left: BORDER + MARGIN_W,
  };

  const innerRoofStyle: React.CSSProperties = {
    position: 'absolute',
    width: width - (MARGIN_W + BORDER * 2) * 2,
    height: height - MARGIN_H * 2 - BORDER * 4,
    top: ROOF_TOP + BORDER,
    left: BORDER + MARGIN_W + BORDER,
    overflow: 'hidden',
  };

  const tooltipTitle = isCustom
    ? t('"{{name}}" is a custom keycode defined in the source code. It cannot be edited in the Visual Editor.', { name: label })
    : '';

  return (
    <Tooltip title={tooltipTitle} arrow disableHoverListener={!isCustom}>
      <div
        className={[
          'visual-keycap-base',
          isSelected && 'visual-keycap-selected',
        ]
          .filter(Boolean)
          .join(' ')}
        style={wrapperStyle}
        onClick={onClick}
      >
        <div className="layout-preview-key" style={innerBaseStyle} />
        <div
          className="layout-preview-key-roof-base"
          style={innerRoofBaseStyle}
        />
        <div className="layout-preview-key-roof" style={innerRoofStyle}>
          <div className="visual-keycap-content">
            {hasMeta && <span className="visual-keycap-meta">{meta}</span>}
            <span
              className={[
                'visual-keycap-label',
                isCustom && 'visual-keycap-custom',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {label}
            </span>
          </div>
        </div>
      </div>
    </Tooltip>
  );
}

