import React from 'react';
import './Keyboards.scss';
import KeyboardModel from '../../../models/KeyboardModel';
import { Button, Chip } from '@material-ui/core';
import KeyModel from '../../../models/KeyModel';
import Keycap from '../keycap/Keycap.container';
import {
  KeyboardsActionsType,
  KeyboardsStateType,
} from './Keyboards.container';

const BORDER_WIDTH = 4;
const LAYOUT_PADDING = 16;

type OwnProps = {
  config: any; // Keyboard Configuration File (.json)
};

type KeyboardsProps = OwnProps &
  Partial<KeyboardsActionsType> &
  Partial<KeyboardsStateType>;

interface IKeyboardsState {
  clickedKeyIndex: number;
  keyboard: KeyboardModel;
}

export default class Keyboards extends React.Component<
  KeyboardsProps,
  IKeyboardsState
> {
  constructor(props: KeyboardsProps | Readonly<KeyboardsProps>) {
    super(props);
    this.state = {
      keyboard: new KeyboardModel(this.props.config.layouts.keymap),
      clickedKeyIndex: NaN,
    };
  }

  private clearClickedKeyIndex() {
    this.setState({ clickedKeyIndex: NaN });
  }

  onClickKeycap = (index: number) => {
    if (this.state.clickedKeyIndex != index) {
      this.setState({ clickedKeyIndex: index });
    } else {
      this.clearClickedKeyIndex(); // cancel clicked keycap
    }
  };

  onClickLayer = (layer: number) => {
    this.props.onClickLayerNumber!(layer);
    this.clearClickedKeyIndex();
  };

  render() {
    return (
      <React.Fragment>
        <div className="layer-wrapper">
          <div className="layers">
            <div className="layer">
              <span>LAYER</span>
              {this.props.layers!.map((layer) => {
                return (
                  <Chip
                    key={layer}
                    variant="outlined"
                    size="medium"
                    label={layer}
                    color={
                      this.props.selectedLayer == layer ? 'primary' : undefined
                    }
                    clickable={this.props.selectedLayer != layer}
                    onClick={this.onClickLayer.bind(this, layer)}
                    className={
                      this.props.selectedLayer != layer
                        ? 'unselected-layer'
                        : 'selected-layer'
                    }
                  />
                );
              })}
            </div>
            <div className="lighting">
              <Button size="small" color="primary">
                Lighting
              </Button>
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
              {this.state.keyboard.keymap.map(
                (model: KeyModel, index: number) => {
                  const layer = this.props.selectedLayer!;
                  const pos = model.pos;
                  const keymap = this.props.keymaps![layer][pos];
                  let label;
                  if (keymap.isAny) {
                    label = 'Any';
                  } else {
                    const info = this.props.keymaps![layer][pos].keycodeInfo!;
                    label = info.label;

                    // TODO: change the keytop label according to the platform, like JIS keyboard, mac US keyboard
                    model.setKeycode(info.label, '', info);
                  }
                  return (
                    <Keycap
                      key={index}
                      index={index}
                      labels={[
                        [label, '', ''],
                        ['', '', ''],
                        ['', '', pos],
                      ]}
                      model={model}
                      size="1u"
                      style={model.styleAbsolute}
                      style2={model.isOddly ? model.styleAbsolute2 : undefined}
                      styleTransform={model.styleTransform}
                      selected={this.state.clickedKeyIndex == index}
                      onClick={this.onClickKeycap}
                    />
                  );
                }
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
