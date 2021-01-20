import React from 'react';
import './Keyboards.scss';
import KeyboardModel from '../../../models/KeyboardModel';
import { Badge, Chip, withStyles } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import KeyModel from '../../../models/KeyModel';
import Keycap from '../keycap/Keycap.container';
import {
  KeyboardsActionsType,
  KeyboardsStateType,
} from './Keyboards.container';
import LayoutOptionsDialog from '../layoutoptions/LayoutOptionsDialog.container';

const BORDER_WIDTH = 4;
const LAYOUT_PADDING = 16;

type OwnProps = {};

type KeyboardsProps = OwnProps &
  Partial<KeyboardsActionsType> &
  Partial<KeyboardsStateType>;

type KeyboardsState = {
  keyboard: KeyboardModel; // TODO: to be redux
  openLayoutOptionDialog: boolean;
};

export default class Keyboards extends React.Component<
  KeyboardsProps,
  KeyboardsState
> {
  constructor(props: KeyboardsProps | Readonly<KeyboardsProps>) {
    super(props);
    const kbd = new KeyboardModel(
      this.props.keyboardDefinition!.layouts.keymap
    );
    this.state = {
      keyboard: kbd,
      openLayoutOptionDialog: false,
    };
  }

  componentDidUpdate() {
    console.log(this.state.keyboard);
    this.props.setKeyboardHeight!(this.state.keyboard.height);
  }

  onClickLayer = (layer: number) => {
    this.props.onClickLayerNumber!(layer);
  };

  private openLayoutOptionDialog() {
    this.setState({ openLayoutOptionDialog: true });
  }

  private closeLayoutOptionDialog() {
    this.setState({ openLayoutOptionDialog: false });
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const StyledBadge = withStyles((_) => ({
      badge: {
        right: 11,
        top: 9,
        border: `2px solid white`,
      },
    }))(Badge);

    let layoutOptions = undefined;
    const hasKeyboardOptions = 0 < this.props.selectedKeyboardOptions!.length;
    if (hasKeyboardOptions) {
      const selectedKeyboardOptions: string[] = this.props
        .selectedKeyboardOptions!;
      const labels: (string | string[])[] = this.props.keyboardDefinition!
        .layouts.labels!;

      layoutOptions = labels.map((choices: string | string[], index) => {
        if (typeof choices == 'string') {
          const selected: string | null = selectedKeyboardOptions[index];
          return selected
            ? { option: '' + index, optionChoice: '1' }
            : { option: '' + index, optionChoice: '0' };
        } else {
          const choice: string = selectedKeyboardOptions[index];
          const choiceIndex = choices.indexOf(choice) - 1; // first item of choices is for choice's label
          return { option: '' + index, optionChoice: '' + choiceIndex };
        }
      });
    }
    return (
      <React.Fragment>
        <div className="layer-wrapper">
          <div className="layers">
            <div className="layer">
              <span>LAYER</span>
              {this.props.layers!.map((layer) => {
                const invisible =
                  this.props.remaps![layer] == undefined ||
                  0 == Object.values(this.props.remaps![layer]).length;
                return (
                  <StyledBadge
                    key={layer}
                    color="primary"
                    variant="dot"
                    invisible={invisible}
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
              {hasKeyboardOptions && (
                <SettingsIcon
                  className="option"
                  onClick={this.openLayoutOptionDialog.bind(this)}
                />
              )}
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
              {this.state.keyboard
                .getKeymap(layoutOptions)
                .map((model: KeyModel) => {
                  return model.isDecal ? (
                    ''
                  ) : (
                    <Keycap key={model.pos} model={model} />
                  );
                })}
            </div>
          </div>
        </div>
        {hasKeyboardOptions && (
          <LayoutOptionsDialog
            open={this.state.openLayoutOptionDialog}
            onClose={this.closeLayoutOptionDialog.bind(this)}
          />
        )}
      </React.Fragment>
    );
  }
}
