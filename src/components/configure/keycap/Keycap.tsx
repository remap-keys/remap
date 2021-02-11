import React, { ReactNode } from 'react';
import KeyModel from '../../../models/KeyModel';
import { IKeymap } from '../../../services/hid/Hid';
import { Key, genKey } from '../keycodekey/KeycodeKey.container';
import { KeycapActionsType, KeycapStateType } from './Keycap.container';
import { Badge, withStyles } from '@material-ui/core';
import './Keycap.scss';
import { buildModLabel } from '../customkey/Modifiers';
import { hexadecimal } from '../../../utils/StringUtils';

export const KEY_SIZE = 56;
const KEY_CAP_BORDER = 1;
const KEY_CAP_MARGIN_HEIGHT = 5;
const KEY_CAP_MARGIN_WIDTH = 5;
const KEY_CAP_ROOF_TOP_MARGIN = 3;

type KeycapOwnState = {
  onDragOver: boolean;
};

// TODO: refactoring properties, unify the model
export type KeycapOwnProps = {
  model: KeyModel;
  keymap: IKeymap;
  remap: IKeymap | null;
  // eslint-disable-next-line no-undef
  anchorRef?: React.RefObject<HTMLDivElement>;
  // eslint-disable-next-line no-unused-vars
  onClick?: (pos: string, key: Key) => void;
};

type KeycapProps = KeycapOwnProps &
  Partial<KeycapStateType> &
  Partial<KeycapActionsType>;

export default class Keycap extends React.Component<
  KeycapProps,
  KeycapOwnState
> {
  constructor(props: KeycapProps | Readonly<KeycapProps>) {
    super(props);
    this.state = {
      onDragOver: false,
    };
  }

  get isOddly(): boolean {
    return this.props.model.isOddly;
  }

  private onClick(
    pos: string,
    isSelectedKey: boolean,
    orgKey: Key,
    dstKey: Key | null
  ) {
    this.props.onClickKeycap!(pos, isSelectedKey, orgKey, dstKey);
    if (!isSelectedKey && this.props.onClick) {
      this.props.onClick(pos, dstKey ? dstKey : orgKey);
    }
  }

  render(): ReactNode {
    const color = this.props.model.color;
    let roofColor;
    let roofEdgeColor;
    if (color === '#aaaaaa') {
      roofColor = '#C8C8C8';
      roofEdgeColor = '#D0D0D0';
    } else if (color === '#777777') {
      roofColor = '#8D8D8D';
      roofEdgeColor = '#939393';
    } else {
      roofColor = '#F2F2F2';
      roofEdgeColor = '#F8F8F8';
    }

    const style = this.props.model.styleAbsolute;
    const style2 = this.props.model.isOddly
      ? this.props.model.styleAbsolute2
      : undefined;
    const styleTransform = this.props.model.styleTransform;

    const width = Number(style.width) || KEY_SIZE;
    const height = Number(style.height) || KEY_SIZE;
    const top = Number(style.top) || 0;
    const left = Number(style.left) || 0;

    const width2 = Number(style2?.width) || KEY_SIZE;
    const height2 = Number(style2?.height) || KEY_SIZE;
    const top2 = Number(style2?.top) || 0;
    const left2 = Number(style2?.left) || 0;

    const baseStyle2 = {
      ...style2,
      width: left2 < 0 ? width2 - KEY_CAP_MARGIN_WIDTH * 2 : width2,
    };
    const coverStyle = {
      ...style,
      width:
        left2 < 0 ? width - KEY_CAP_MARGIN_WIDTH : width - KEY_CAP_BORDER * 2,
      height: height - KEY_CAP_BORDER * 2,
      top: top + KEY_CAP_BORDER,
      left: left + KEY_CAP_BORDER,
    };
    const roofStyle = {
      ...style,
      width: width - (KEY_CAP_MARGIN_WIDTH + KEY_CAP_BORDER) * 2,
      height: height - (KEY_CAP_MARGIN_HEIGHT + KEY_CAP_BORDER) * 2,
      top: top + KEY_CAP_ROOF_TOP_MARGIN,
      left: left + KEY_CAP_BORDER + KEY_CAP_MARGIN_WIDTH,
      borderColor: roofEdgeColor,
    };

    const roofStyle2 = {
      ...style2,
      width: width2 - (KEY_CAP_BORDER + KEY_CAP_MARGIN_WIDTH) * 2,
      height: height2 - (KEY_CAP_BORDER + KEY_CAP_MARGIN_HEIGHT) * 2,
      top: top2 + KEY_CAP_ROOF_TOP_MARGIN,
      left: left2 + KEY_CAP_MARGIN_WIDTH + KEY_CAP_BORDER,
      background: roofColor,
      borderColor: roofEdgeColor,
    };

    const labelsStyle = {
      ...style,
      width: width - (KEY_CAP_MARGIN_WIDTH + KEY_CAP_BORDER * 2) * 2,
      KEY_CAP_BORDER,
      height: height - KEY_CAP_MARGIN_HEIGHT * 2 - KEY_CAP_BORDER * 4,
      top: top + KEY_CAP_ROOF_TOP_MARGIN + KEY_CAP_BORDER,
      left: left + KEY_CAP_BORDER + KEY_CAP_MARGIN_WIDTH + KEY_CAP_BORDER,
      background: roofColor,
    };

    const pos = this.props.model.pos;
    const optionLabel = this.props.model.optionLabel;
    const isSelectedKey = pos == this.props.selectedPos!;
    const keymap: IKeymap = this.props.keymap;
    const orgKey: Key = genKey(keymap);
    const dstKey: Key | null = this.props.remap
      ? genKey(this.props.remap)
      : null;

    const km: IKeymap = dstKey ? dstKey.keymap : orgKey.keymap;
    let modifierLabel = '';
    let holdLabel = '';
    if (km.kinds.includes('mod_tap')) {
      holdLabel = buildModLabel(km.modifiers || null);
    } else if (km.kinds.includes('layer_tap')) {
      holdLabel = km.option === undefined ? '' : `Layer(${km.option})`;
    } else if (km.kinds.includes('swap_hands')) {
      holdLabel = 'SWAP';
    } else if (km.isAny) {
      holdLabel = hexadecimal(km.code, 4);
    } else {
      modifierLabel = buildModLabel(km.modifiers || null);
    }
    return (
      <div
        className={[
          'keycap-base',
          this.state.onDragOver && 'drag-over',
          dstKey && 'has-diff',
          isSelectedKey && 'keycap-selected',
        ].join(' ')}
        style={styleTransform}
        onDragOver={(event) => {
          event.preventDefault();
          if (!this.state.onDragOver) {
            this.setState({ onDragOver: true });
          }
        }}
        onDragLeave={() => {
          this.setState({ onDragOver: false });
        }}
        onDrop={() => {
          this.setState({ onDragOver: false });
          this.props.onDropKeycode!(
            this.props.draggingKey!,
            this.props.selectedLayer!,
            pos,
            orgKey
          );
        }}
      >
        {/* base1 */}
        <div
          ref={this.props.anchorRef}
          className={['keycap', 'keycap-border'].join(' ')}
          style={style}
          onClick={() => {
            this.onClick(pos, isSelectedKey, orgKey, dstKey);
          }}
        ></div>
        {this.isOddly && (
          <React.Fragment>
            {/* base2 */}
            <div
              className={[
                'keycap',
                'keycap-border',
                'keycap2',
                isSelectedKey && 'keycap-selected',
              ].join(' ')}
              style={baseStyle2}
              onClick={() => {
                this.onClick(pos, isSelectedKey, orgKey, dstKey);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (!this.state.onDragOver) {
                  this.setState({ onDragOver: true });
                }
              }}
            ></div>

            {/* cover1 */}
            <div
              className={[
                'keycap',
                'pointer-pass-through',
                isSelectedKey && 'keycap-selected',
              ].join(' ')}
              style={coverStyle}
              onClick={() => {
                this.onClick(pos, isSelectedKey, orgKey, dstKey);
              }}
            ></div>
          </React.Fragment>
        )}
        {/* roof1 */}
        <div
          className={['keyroof-base'].join(' ')}
          style={roofStyle}
          onClick={this.props.onClickKeycap?.bind(
            this,
            pos,
            isSelectedKey,
            orgKey,
            dstKey
          )}
        ></div>
        {this.isOddly && (
          <React.Fragment>
            {/* roof2 */}
            <div
              className={['keyroof-base', 'pointer-pass-through'].join(' ')}
              style={roofStyle2}
              onClick={() => {
                this.onClick(pos, isSelectedKey, orgKey, dstKey);
              }}
            ></div>
          </React.Fragment>
        )}
        {/* labels */}
        <div
          className={['keyroof'].join(' ')}
          style={labelsStyle}
          onClick={() => {
            this.onClick(pos, isSelectedKey, orgKey, dstKey);
          }}
        >
          <KeyLabel
            label={dstKey ? dstKey.label : orgKey.label}
            modifierLabel={modifierLabel}
            holdLabel={holdLabel}
            pos={pos}
            hasDiff={dstKey != null}
            optionChoiceLabel={optionLabel}
            debug={false}
          />
        </div>
      </div>
    );
  }
}

type KeyLabelType = {
  label: string;
  modifierLabel: string;
  holdLabel: string;
  hasDiff: boolean;
  pos?: string;
  optionChoiceLabel?: string;
  debug?: boolean;
};
function KeyLabel(props: KeyLabelType) {
  if (props.debug) {
    return (
      <React.Fragment>
        <div className="keylabel">
          <div className="label left top">{props.pos}</div>
          <div className={`label center modifier`}>{props.modifierLabel}</div>
          <div className="label right"></div>
        </div>
        <div className="keylabel">
          <div className="label left"></div>
          <div className="label center keycode">{props.label}</div>
          <div className="label right"></div>
        </div>
        <div className="keylabel vbottom">
          <div className="label left"></div>
          <div className={`label center modifier`}>{props.holdLabel}</div>
          <div className="label right">{props.optionChoiceLabel}</div>
        </div>
      </React.Fragment>
    );
  } else {
    const length = props.label.split(' ').length;
    const labelSize = length == 2 ? '_m' : length == 3 ? '_s' : '';
    if (props.modifierLabel.length === 0 && props.holdLabel.length === 0) {
      return (
        <React.Fragment>
          <div className="keylabel vcenter">
            <div className={`label center keycode-label ${labelSize}`}>
              {props.label}
            </div>
          </div>
          <StyledBadge
            color="primary"
            variant="dot"
            invisible={!props.hasDiff}
            className="diff-dot"
          ></StyledBadge>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className="keylabel">
            <div className={`label center modifier`}>{props.modifierLabel}</div>
          </div>
          <div className="keylabel">
            <div className={`label center keycode-label ${labelSize}`}>
              {props.label}
            </div>
          </div>
          <div className="keylabel">
            <div className={`label center modifier`}>{props.holdLabel}</div>
          </div>
          <StyledBadge
            color="primary"
            variant="dot"
            invisible={!props.hasDiff}
            className="diff-dot"
          ></StyledBadge>
        </React.Fragment>
      );
    }
  }
}

// eslint-disable-next-line no-unused-vars
const StyledBadge = withStyles((_) => ({
  badge: {
    right: -2,
    top: -2,
    height: 4,
    padding: 0,
    minWidth: 4,
    borderRadius: 2,
  },
}))(Badge);
