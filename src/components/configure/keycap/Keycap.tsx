import React, { ReactNode } from 'react';
import KeyModel from '../../../models/KeyModel';
import { IKeymap } from '../../../services/hid/hid';
import { Key, genKey } from '../keycodekey/KeycodeKey.container';
import { KeycapActionsType, KeycapStateType } from './Keycap.container';
import './Keycap.scss';

export const KEY_SIZE = 54;
const KEY_CAP_BORDER = 1;
const KEY_CAP_MARGIN_HEIGHT = 5;
const KEY_CAP_MARGIN_WIDTH = 6;

type KeycapOwnState = {
  onDragOver: boolean;
};

// TODO: refactoring properties, unify the model
export type KeycapOwnProps = {
  model: KeyModel;
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

  render(): ReactNode {
    const color = this.props.model.color;
    let roofColor;
    let roofEdgeColor;
    if (color === '#aaaaaa') {
      roofColor = '#C8C8C8';
      roofEdgeColor = '#E0E0E0';
    } else if (color === '#777777') {
      roofColor = '#8D8D8D';
      roofEdgeColor = '#C0C0C0';
    } else {
      roofColor = '#F2F2F2';
      roofEdgeColor = '#FDFDFD';
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
      top: top + KEY_CAP_MARGIN_HEIGHT,
      left: left + KEY_CAP_BORDER + KEY_CAP_MARGIN_WIDTH,
      borderColor: roofEdgeColor,
    };

    const roofStyle2 = {
      ...style2,
      width: width2 - (KEY_CAP_BORDER + KEY_CAP_MARGIN_WIDTH) * 2,
      height: height2 - (KEY_CAP_BORDER + KEY_CAP_MARGIN_HEIGHT) * 2,
      top: top2 + KEY_CAP_MARGIN_HEIGHT,
      left: left2 + KEY_CAP_MARGIN_WIDTH + KEY_CAP_BORDER,
      background: roofColor,
      borderColor: roofEdgeColor,
    };

    const labelsStyle = {
      ...style,
      width: width - (KEY_CAP_MARGIN_WIDTH + KEY_CAP_BORDER * 2) * 2,
      KEY_CAP_BORDER,
      height: height - KEY_CAP_MARGIN_HEIGHT * 2 - KEY_CAP_BORDER * 4,
      top: top + KEY_CAP_MARGIN_HEIGHT + KEY_CAP_BORDER,
      left: left + KEY_CAP_BORDER + KEY_CAP_MARGIN_WIDTH + KEY_CAP_BORDER,
      background: roofColor,
    };

    const selectedLayer = this.props.selectedLayer!;
    const selectedPos = this.props.selectedPos!;
    const pos = this.props.model.pos;
    const isSelectedKey = pos == selectedPos;
    const keymap: IKeymap = this.props.keymaps![selectedLayer][pos];
    const orgKey: Key = genKey(keymap);
    const dstKey: Key | null =
      pos in this.props.remaps![selectedLayer]
        ? genKey(this.props.remaps![selectedLayer][pos])
        : null;

    return (
      <div
        className={[
          'keycap-base',
          this.state.onDragOver && 'drag-over',
          dstKey && 'has-diff',
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
          className={[
            'keycap',
            'keycap-border',
            isSelectedKey && 'keycap-selected',
          ].join(' ')}
          style={style}
          onClick={this.props.onClickKeycap!.bind(
            this,
            pos,
            isSelectedKey,
            orgKey,
            dstKey
          )}
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
              onClick={this.props.onClickKeycap!.bind(
                this,
                pos,
                isSelectedKey,
                orgKey,
                dstKey
              )}
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
              onClick={this.props.onClickKeycap!.bind(
                this,
                pos,
                isSelectedKey,
                orgKey,
                dstKey
              )}
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
              onClick={this.props.onClickKeycap!.bind(
                this,
                pos,
                isSelectedKey,
                orgKey,
                dstKey
              )}
            ></div>
          </React.Fragment>
        )}
        {/* labels */}
        <div
          className={['keyroof'].join(' ')}
          style={labelsStyle}
          onClick={this.props.onClickKeycap?.bind(
            this,
            pos,
            isSelectedKey,
            orgKey,
            dstKey
          )}
        >
          <div className="keylabel">
            <div className="label left top"></div>
            <div className="label center"></div>
            <div className="label right"></div>
          </div>
          <div className="keylabel">
            <div className="label left"></div>
            <div className="label center">
              {dstKey ? dstKey.label : orgKey.label}
            </div>
            <div className="label right"></div>
          </div>
          <div className="keylabel">
            <div className="label left"></div>
            <div className="label center"></div>
            <div className="label right">{pos}</div>
          </div>
        </div>
      </div>
    );
  }
}
