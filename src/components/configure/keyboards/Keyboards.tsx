import React from 'react';
import './Keyboards.scss';
import KeyboardModel from '../../../models/KeyboardModel';
import { Button, Chip } from '@material-ui/core';
import KeyModel from '../../../models/KeyModel';
import Keycap from '../keycap/Keycap';

const layers = [1, 2, 3, 4] as const;
const BORDER_WIDTH = 4;
const LAYOUT_PADDING = 16;

interface IKeyboardsProps {
  config: any; // Keyboard Configuration File (.json)
}

interface IKeyboardsState {
  clickedKeyIndex: number;
  keyboard: KeyboardModel;
  selectedLayer: number;
}

export default class Keyboards extends React.Component<
  IKeyboardsProps,
  IKeyboardsState
> {
  constructor(props: IKeyboardsProps | Readonly<IKeyboardsProps>) {
    super(props);
    this.state = {
      keyboard: new KeyboardModel(this.props.config.layouts.keymap),
      selectedLayer: 1,
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
    this.setState({ selectedLayer: layer });
    this.clearClickedKeyIndex();
  };

  render() {
    return (
      <React.Fragment>
        <div className="layer-wrapper">
          <div className="layers">
            <div className="layer">
              <span>LAYER</span>
              {layers.map((layer) => {
                return (
                  <Chip
                    key={layer}
                    variant="outlined"
                    size="medium"
                    label={layer}
                    color={
                      this.state.selectedLayer == layer ? 'primary' : undefined
                    }
                    clickable={this.state.selectedLayer != layer}
                    onClick={this.onClickLayer.bind(this, layer)}
                    className={
                      this.state.selectedLayer != layer
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
                (key: KeyModel, index: number) => {
                  return (
                    <Keycap
                      key={index}
                      index={index}
                      labels={[
                        [key.label, '', ''],
                        ['', '', ''],
                        ['', '', ''],
                      ]}
                      size="1u"
                      style={key.styleAbstruct}
                      styleTransform={key.styleTransform}
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
