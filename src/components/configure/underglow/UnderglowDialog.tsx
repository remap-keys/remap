/* eslint-disable no-undef */
import React from 'react';
import './UnderglowDialog.scss';
import '../../../../node_modules/reinvented-color-wheel/css/reinvented-color-wheel.min.css';
import Draggable from 'react-draggable';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  PaperProps,
  Select,
  Slider,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ReinventedColorWheel from 'reinvented-color-wheel';

type Props = {
  open: boolean;
  underglowColor: { h: number; s: number; v: number };
  onClose: () => void;
};
type State = {
  underglowType: string;
  underglowSpeed: number;
  underglowBrightness: number;
  underglowColor: { hex: string; h: number; s: number; v: number };
};

const UnderglowEffects: {
  label: string;
  symbol: string;
  values?: number[];
}[] = [
  { label: 'All Off', symbol: 'all-off' },
  { label: 'Solid Color', symbol: 'RGBLIGHT_MODE_STATIC_LIGHT' },
  {
    label: 'Solid Breathing',
    symbol: 'RGBLIGHT_MODE_BREATHING',
    values: [0, 1, 2, 3],
  },
  {
    label: 'Cycling Rainbow',
    symbol: 'RGBLIGHT_MODE_RAINBOW_MOOD',
    values: [0, 1, 2],
  },
  {
    label: 'Swirling Rainbow',
    symbol: 'RGBLIGHT_MODE_RAINBOW_SWIRL',
    values: [0, 1, 2, 3, 4, 5],
  },
  {
    label: 'Snake',
    symbol: 'RGBLIGHT_MODE_SNAKE',
    values: [0, 1, 2, 3, 4, 5],
  },
  {
    label: 'Knight',
    symbol: 'RGBLIGHT_MODE_KNIGHT',
    values: [0, 1, 2],
  },
  {
    label: 'Christmas',
    symbol: 'RGBLIGHT_MODE_CHRISTMAS',
  },
  {
    label: 'Gradient',
    symbol: 'RGBLIGHT_MODE_STATIC_GRADIENT',
    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    label: 'Twinkle',
    symbol: 'RGBLIGHT_MODE_TWINKLE',
    values: [0, 1, 2, 3, 4, 5],
  },
  {
    label: 'RGB Test',
    symbol: 'RGBLIGHT_MODE_RGB_TEST',
  },
  {
    label: 'Alternating',
    symbol: 'RGBLIGHT_MODE_ALTERNATING',
  },
];

export default class UnderglowDialog extends React.Component<Props, State> {
  private colorPickerRef: React.RefObject<HTMLDivElement>;
  private colorWheelRef: React.RefObject<HTMLDivElement>;
  private colorWheel: ReinventedColorWheel | null = null;
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
      underglowType: '',
      underglowSpeed: 10,
      underglowBrightness: 10,
      underglowColor: { hex: '#FFFFFF', h: 0, s: 0, v: 0 },
    };
    this.colorPickerRef = React.createRef<HTMLDivElement>();
    this.colorWheelRef = React.createRef<HTMLDivElement>();
    this.buildColorWheel();
  }

  onEnter() {
    console.log('onEnter');
    this.buildColorWheel();
  }

  private buildColorWheel() {
    if (this.colorWheelRef.current === null) {
      console.log('here');
      this.colorWheel = null;
      return;
    }
    console.log('there');
    console.log(this.colorWheelRef.current);
    this.colorWheel = new ReinventedColorWheel({
      // appendTo is the only required property. specify the parent element of the color wheel.
      appendTo: this.colorWheelRef.current!,

      // followings are optional properties and their default values.

      // initial color (can be specified in hsv / hsl / rgb / hex)
      hsv: [
        this.props.underglowColor.h,
        this.props.underglowColor.s,
        this.props.underglowColor.v,
      ],
      // hsl: [0, 100, 50],
      // rgb: [255, 0, 0],
      // hex: "#ff0000",

      // appearance
      wheelDiameter: 180,
      wheelThickness: 20,
      handleDiameter: 16,
      wheelReflectsSaturation: true,

      // handler
      onChange: (color) => {
        this.onChangeColorWheel(color);
      },
    });
    const hex = this.colorWheel.hex;
    this.setState({ underglowColor: { hex, ...this.props.underglowColor } });
    //this.colorWheel.redraw();
  }

  private onChangeColorWheel(color: ReinventedColorWheel) {
    this.setState({
      underglowColor: {
        hex: color.hex,
        h: color.hsv[0],
        s: color.hsv[1],
        v: color.hsv[2],
      },
    });
  }

  private onChangeUnderglowType(name: string) {
    console.log(name);
  }

  private onChangeUnderglowSpeed(speed: number) {
    this.setState({ underglowSpeed: speed });
  }

  private onChangeUnderglowBrightness(brightness: number) {
    this.setState({ underglowBrightness: brightness });
  }

  private onChangeColorInput(v: any) {
    console.log(v);
  }

  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={() => {}}
          onEnter={() => {
            this.onEnter();
          }}
          PaperComponent={PaperComponent}
          className="underglow-dialog"
        >
          <DialogTitle id="draggable-dialog-title" style={{ cursor: 'move' }}>
            Light Settings
            <div className="close-dialog">
              <CloseIcon onClick={this.props.onClose} />
            </div>
          </DialogTitle>
          <DialogContent dividers className="underglow-settings">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Grid
                  container
                  justify="center"
                  alignItems="center"
                  spacing={1}
                >
                  <Grid
                    item
                    xs={12}
                    className="underglow-label underglow-effect-type-label"
                  >
                    Effect Type
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className="underglow-value underglow-effect-type-value"
                  >
                    <Select
                      native
                      className="underglow-value-inner"
                      value={this.state.underglowType}
                      onChange={(e) => {
                        this.onChangeUnderglowType(e.target.value as string);
                      }}
                    >
                      {UnderglowEffects.map((effect) => {
                        if (effect.values) {
                          const arr = effect.values.map((v) => {
                            const value = `${effect.symbol}_${v}`;
                            return (
                              <option
                                key={value}
                                value={value}
                              >{`${effect.label} ${v}`}</option>
                            );
                          });
                          return arr;
                        } else {
                          return (
                            <option value={effect.symbol}>
                              {effect.label}
                            </option>
                          );
                        }
                      })}
                    </Select>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className="underglow-label underglow-effect-speed-label"
                  >
                    Effect Speed ({this.state.underglowSpeed})
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className="underglow-value underglow-effect-speed-value"
                  >
                    <div>
                      <Slider
                        className="underglow-value-inner"
                        value={this.state.underglowSpeed}
                        onChange={(event: any, newValue: number | number[]) => {
                          this.onChangeUnderglowSpeed(newValue as number);
                        }}
                        aria-labelledby="continuous-slider"
                        min={0}
                        max={100}
                      />
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className="underglow-label underglow-effect-color-label"
                  >
                    Color
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className="underglow-value underglow-color"
                  >
                    <TextField
                      label="RGB"
                      className="underglow-color-value color-rgb"
                      value={this.state.underglowColor.hex}
                    />
                    <TextField
                      label="Hue"
                      className="underglow-color-value color-hue"
                      type="number"
                      value={this.state.underglowColor.h}
                    />
                    <TextField
                      label="Saturation"
                      className="underglow-color-value color-saturation"
                      type="number"
                      value={this.state.underglowColor.s}
                    />
                    <TextField
                      label="Brightness"
                      className="underglow-color-value color-brightness"
                      type="number"
                      value={this.state.underglowColor.v}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={12}
                    justify="center"
                    alignItems="center"
                    ref={this.colorPickerRef}
                    className="underglow-value-inner underglow-color-wrapper"
                  >
                    <div ref={this.colorWheelRef} className="color-wheel"></div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
