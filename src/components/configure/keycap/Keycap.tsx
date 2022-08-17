import React, { ReactNode } from 'react';
import KeyModel from '../../../models/KeyModel';
import { IKeymap } from '../../../services/hid/Hid';
import { KeycapActionsType, KeycapStateType } from './Keycap.container';
import { Badge } from '@mui/material';
import { withStyles } from '@mui/styles';
import './Keycap.scss';
import { buildModLabel } from '../customkey/Modifiers';
import { buildHoldKeyLabel } from '../customkey/TabHoldTapKey';
import { genKey, Key } from '../keycodekey/KeyGen';

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
  debug?: boolean;
  down: boolean;
  focus: boolean;
  model: KeyModel;
  keymap: IKeymap;
  remap: IKeymap | null;
  // eslint-disable-next-line no-undef
  anchorRef?: React.RefObject<HTMLDivElement>;
  isCustomKeyOpen: boolean;
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
    if (this.props.testMatrix) return;

    this.props.onClickKeycap!(pos, isSelectedKey, orgKey, dstKey);
    if (!this.props.isCustomKeyOpen && this.props.onClick) {
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
    const isFocusedKey = this.props.focus;
    const keymap: IKeymap = this.props.keymap;
    const orgKey: Key = genKey(keymap, this.props.labelLang!);
    const dstKey: Key | null = this.props.remap
      ? genKey(this.props.remap, this.props.labelLang!)
      : null;

    // TODO: refactor the label position should be organized in genKey()
    const km: IKeymap = dstKey ? dstKey.keymap : orgKey.keymap;
    const holdLabel = buildHoldKeyLabel(km, km.isAny);
    let modifierLabel =
      holdLabel === ''
        ? buildModLabel(km.modifiers || null, km.direction!)
        : '';
    const modifierRightLabel = dstKey ? dstKey.metaRight : orgKey.metaRight;
    const meta = dstKey ? dstKey.meta : orgKey.meta;
    modifierLabel = meta ? meta : modifierLabel;

    return (
      <div
        className={[
          'keycap-base',
          this.state.onDragOver && 'drag-over',
          dstKey && 'has-diff',
          isFocusedKey && 'keycap-selected',
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
          className={[
            'keycap',
            'keycap-border',
            this.props.testMatrix && 'keycap-test-matrix',
            this.props.testMatrix &&
              this.props.down &&
              'keycap-test-matrix-down',
          ].join(' ')}
          style={style}
          onClick={() => {
            this.onClick(pos, isFocusedKey, orgKey, dstKey);
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
                isFocusedKey && 'keycap-selected',
              ].join(' ')}
              style={baseStyle2}
              onClick={() => {
                this.onClick(pos, isFocusedKey, orgKey, dstKey);
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
                isFocusedKey && 'keycap-selected',
              ].join(' ')}
              style={coverStyle}
              onClick={() => {
                this.onClick(pos, isFocusedKey, orgKey, dstKey);
              }}
            ></div>
          </React.Fragment>
        )}

        {/* roof1 */}
        <div
          className={[
            'keyroof-base',
            this.props.testMatrix && 'test-matrix',
            this.props.testMatrix && this.props.down && 'test-matrix-down',
          ].join(' ')}
          style={roofStyle}
          onClick={this.onClick.bind(this, pos, isFocusedKey, orgKey, dstKey)}
        ></div>
        {this.isOddly && (
          <React.Fragment>
            {/* roof2 */}
            <div
              className={[
                'keyroof-base',
                'pointer-pass-through',
                this.props.testMatrix && 'test-matrix',
              ].join(' ')}
              style={roofStyle2}
              onClick={() => {
                this.onClick(pos, isFocusedKey, orgKey, dstKey);
              }}
            ></div>
          </React.Fragment>
        )}
        {/* labels */}
        {!this.props.testMatrix && (
          <div
            className={['keyroof'].join(' ')}
            style={labelsStyle}
            onClick={() => {
              this.onClick(pos, isFocusedKey, orgKey, dstKey);
            }}
          >
            <KeyLabel
              label={dstKey ? dstKey.label : orgKey.label}
              meta={dstKey ? dstKey.meta : orgKey.meta}
              modifierLabel={modifierLabel}
              modifierRightLabel={modifierRightLabel}
              holdLabel={holdLabel}
              pos={pos}
              hasDiff={dstKey != null}
              optionChoiceLabel={optionLabel}
              debug={this.props.debug}
            />
          </div>
        )}
      </div>
    );
  }
}

type KeyLabelType = {
  label: string;
  meta?: string;
  modifierLabel?: string;
  modifierRightLabel?: string;
  holdLabel?: string;
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
          <div className="label left top debug">{props.pos}</div>
          <div className="label center modifier"></div>
          <div className="label right"></div>
        </div>
        <div className="keylabel">
          <div className="label left"></div>
          <div className="label center keycode"></div>
          <div className="label right"></div>
        </div>
        <div className="keylabel vbottom">
          <div className="label left"></div>
          <div className="label center modifier"></div>
          <div className="label right debug">{props.optionChoiceLabel}</div>
        </div>
      </React.Fragment>
    );
  }

  const points = props.label.match(/[\s\\/]/g);
  const breakPoints = points ? points.length : 0;
  const labelSize = breakPoints == 1 ? '_m' : breakPoints == 2 ? '_s' : '';
  if (props.modifierRightLabel) {
    return (
      <TopRightKeyLabel
        label={props.label}
        labelSize={labelSize}
        hasDiff={props.hasDiff}
        modifierLabel={props.modifierLabel || ''}
        modifierRightLabel={props.modifierRightLabel || ''}
      />
    );
  } else if (props.meta) {
    return (
      <MetaKeyLabel
        label={props.label}
        meta={props.meta}
        labelSize={labelSize}
        hasDiff={props.hasDiff}
      />
    );
  } else if (props.modifierLabel || props.holdLabel) {
    return (
      <ModHoldKeyLabel
        label={props.label}
        labelSize={labelSize}
        hasDiff={props.hasDiff}
        modifierLabel={props.modifierLabel || ''}
        holdLabel={props.holdLabel || ''}
      />
    );
  } else {
    return (
      <NormalKeyLabel
        label={props.label}
        labelSize={labelSize}
        hasDiff={props.hasDiff}
      />
    );
  }
}

type NormalKeyLabelType = {
  label: string;
  labelSize: '' | '_s' | '_m';
  hasDiff: boolean;
};

function NormalKeyLabel(props: NormalKeyLabelType) {
  return (
    <React.Fragment>
      <div className="keylabel vcenter">
        <div className={`label center keycode-label ${props.labelSize}`}>
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
}

type MetaKeyLabelType = {
  label: string;
  meta: string;
  labelSize: '' | '_s' | '_m';
  hasDiff: boolean;
};

function MetaKeyLabel(props: MetaKeyLabelType) {
  return (
    <React.Fragment>
      <div className="keylabel vcenter">
        <div className="label center modifier">{props.meta}</div>
      </div>
      <div className="keylabel">
        <div className={`label center keycode-label ${props.labelSize}`}>
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
}

type ModHoldKeyLabelType = {
  label: string;
  labelSize: '' | '_s' | '_m';
  modifierLabel: string;
  holdLabel: string;
  hasDiff: boolean;
};
function ModHoldKeyLabel(props: ModHoldKeyLabelType) {
  return (
    <React.Fragment>
      <div className="keylabel">
        <div className={`label center modifier`}>{props.modifierLabel}</div>
      </div>
      <div className="keylabel">
        <div className={`label center keycode-label ${props.labelSize}`}>
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

type TopRightKeyLabelType = {
  label: string;
  labelSize: '' | '_s' | '_m';
  modifierLabel: string;
  modifierRightLabel: string;
  hasDiff: boolean;
};
function TopRightKeyLabel(props: TopRightKeyLabelType) {
  return (
    <React.Fragment>
      <div className="keylabel">
        <div className={`label center modifier`}>{props.modifierLabel}</div>
      </div>
      <div className="keylabel">
        <div className={`label keycode-label left ${props.labelSize}`}></div>
        <div className={`label keycode-label center ${props.labelSize}`}>
          {props.label}
        </div>
        <div className={`label keycode-label right ${props.labelSize}`}>
          {props.modifierRightLabel}
        </div>
      </div>
      <div className="keylabel">
        <div className={`label center modifier`}></div>
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
