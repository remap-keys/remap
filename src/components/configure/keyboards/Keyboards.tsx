import React from 'react';
import './Keyboards.scss';
import KeyboardModel from '../../../models/KeyboardModel';
import { Badge, Chip, withStyles } from '@material-ui/core';
import KeyModel from '../../../models/KeyModel';
import Keycap from '../keycap/Keycap.container';
import {
  KeyboardsActionsType,
  KeyboardsStateType,
} from './Keyboards.container';

const BORDER_WIDTH = 4;
const LAYOUT_PADDING = 16;

type OwnProps = {};

type KeyboardsProps = OwnProps &
  Partial<KeyboardsActionsType> &
  Partial<KeyboardsStateType>;

interface IKeyboardsState {
  keyboard: KeyboardModel; // TODO: to be redux
}

export default class Keyboards extends React.Component<
  KeyboardsProps,
  IKeyboardsState
> {
  constructor(props: KeyboardsProps | Readonly<KeyboardsProps>) {
    super(props);
    this.state = {
      keyboard: new KeyboardModel(
        this.props.keyboardDefinition!.layouts.keymap
      ),
    };
  }

  onClickLayer = (layer: number) => {
    this.props.onClickLayerNumber!(layer);
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const StyledBadge = withStyles((_) => ({
      badge: {
        right: 11,
        top: 9,
        border: `2px solid white`,
      },
    }))(Badge);
    return (
      <React.Fragment>
        <div className="layer-wrapper">
          <div className="layers">
            <div className="layer">
              <span>LAYER</span>
              {this.props.layers!.map((layer) => {
                return (
                  <StyledBadge
                    key={layer}
                    color="primary"
                    variant="dot"
                    invisible={
                      0 == Object.values(this.props.remaps![layer]).length
                    }
                  >
                    <Chip
                      key={layer}
                      variant="outlined"
                      size="medium"
                      label={layer}
                      color={
                        this.props.selectedLayer == layer
                          ? 'primary'
                          : undefined
                      }
                      clickable={this.props.selectedLayer != layer}
                      onClick={this.onClickLayer.bind(this, layer)}
                      className={
                        this.props.selectedLayer != layer
                          ? 'unselected-layer'
                          : 'selected-layer'
                      }
                    />
                  </StyledBadge>
                );
              })}
            </div>
          </div>
        </div>
        <div className="keyboards">
          <div
            className="keyboard-root"
            style={{
              width:
                this.state.keyboard.width + (BORDER_WIDTH + LAYOUT_PADDING) * 2,
              height:
                this.state.keyboard.height +
                (BORDER_WIDTH + LAYOUT_PADDING) * 2,
            }}
          >
            <div
              className="keyboard-frame"
              style={{
                width: this.state.keyboard.width,
                height: this.state.keyboard.height,
              }}
            >
              {this.state.keyboard.keymap.map((model: KeyModel) => {
                return <Keycap key={model.pos} model={model} />;
              })}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
