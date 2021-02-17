/* eslint-disable no-undef */
import React from 'react';
import './TabUnderglow.scss';
import {
  Grid,
  MenuItem,
  Select,
  Slider,
  Switch,
  TextField,
} from '@material-ui/core';
import ReinventedColorWheel from 'reinvented-color-wheel';
import { percent } from '../../../utils/NumberUtils';

type Props = {
  hsv: { h: number /* 0-360 */; s: number /* 0-255 */; v: number /* 0-255 */ };
  speed: number;
  backlightOn: boolean;
  backlightBrightness: number; // 0-255
};

type State = {
  underglowType: string;
  underglowSpeed: number;
  underglowColor: { h: number; s: number; v: number };
  underglowHex: string;
  backlightOn: boolean;
  backlightBrightness: number;
};

export default class TabUnderglow extends React.Component<Props, State> {
  private colorWheelRef: React.RefObject<HTMLDivElement>;
  private colorWheel: ReinventedColorWheel | null = null;
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.colorWheelRef = React.createRef<HTMLDivElement>();
    this.state = {
      underglowType: 'RGBLIGHT_MODE_STATIC_LIGHT',
      underglowSpeed: this.props.speed,
      underglowColor: {
        h: this.props.hsv.h,
        s: percent(this.props.hsv.s, 255),
        v: percent(this.props.hsv.v, 255),
      },
      underglowHex: 'FFFFFF',
      backlightOn: true,
      backlightBrightness: percent(this.props.backlightBrightness, 255),
    };
  }

  private buildColorWheel() {
    const saturation = percent(this.props.hsv.s, 255);
    const brightness = percent(this.props.hsv.v, 255);
    this.colorWheel = new ReinventedColorWheel({
      // appendTo is the only required property. specify the parent element of the color wheel.
      appendTo: this.colorWheelRef.current!,

      // followings are optional properties and their default values.

      // initial color (can be specified in hsv / hsl / rgb / hex)
      hsv: [this.props.hsv.h, saturation, brightness],
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
    const underglowHex = this.colorWheel.hex.slice(1).toUpperCase();
    this.setState({
      underglowColor: { h: this.props.hsv.h, s: saturation, v: brightness },
      underglowHex,
    });
    //this.colorWheel.redraw();
  }

  componentDidMount() {
    if (this.colorWheelRef.current === null) {
      this.colorWheel = null;
      return;
    }
    this.buildColorWheel();
  }

  private emitUnderglowValue() {}

  private onChangeUnderglowType(underglowType: string) {
    this.setState({ underglowType });
  }

  private onChangeUnderglowSpeed(underglowSpeed: number) {
    this.setState({ underglowSpeed });
  }

  private onChangeColorWheel(color: ReinventedColorWheel) {
    this.setState({
      underglowColor: {
        h: color.hsv[0],
        s: color.hsv[1],
        v: color.hsv[2],
      },
      underglowHex: color.hex.slice(1).toUpperCase(),
    });
  }

  private onChangeColorHex(hex: string) {
    const underglowHex = hex
      .toUpperCase()
      .replace(/[^0-9,A-F]/g, '')
      .slice(0, 6);
    if (hex.length === 6) {
      this.colorWheel!.hex = `#${underglowHex}`;
      const hsv = this.colorWheel!.hsv;
      this.setState({
        underglowColor: {
          h: hsv[0],
          s: hsv[1],
          v: hsv[2],
        },
        underglowHex,
      });
    } else {
      this.setState({ underglowHex });
    }
  }

  private changeColor(underglowColor: { h: number; s: number; v: number }) {
    this.setState({ underglowColor });
    this.colorWheel!.hsv = [
      underglowColor.h,
      underglowColor.s,
      underglowColor.v,
    ];
  }

  private onChangeColorHue(hue: number) {
    this.changeColor({ ...this.state.underglowColor, h: hue });
  }

  private onChangeColorSaturation(saturation: number) {
    this.changeColor({ ...this.state.underglowColor, s: saturation });
  }

  private onChangeColorBrightness(brightness: number) {
    this.changeColor({ ...this.state.underglowColor, v: brightness });
  }

  private onChangeBacklightBrightness(brightness: number) {
    this.setState({ backlightBrightness: brightness });
  }

  render() {
    return (
      <Grid container spacing={1} className="lighting-settings">
        <Grid item xs={12}>
          <h4>UNDERGLOW</h4>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={1} justify="center" alignItems="center">
            <Grid item xs={12}>
              <div className="lighting-label">Effect Type</div>
              <div>
                <Select
                  className="lighting-value"
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
                          <MenuItem
                            key={value}
                            value={value}
                          >{`${effect.label} ${v}`}</MenuItem>
                        );
                      });
                      return arr;
                    } else {
                      return (
                        <MenuItem key={effect.symbol} value={effect.symbol}>
                          {effect.label}
                        </MenuItem>
                      );
                    }
                  })}
                </Select>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="lighting-label underglow-label-speed">
                Effect Speed ({this.state.underglowSpeed})
              </div>
              <Slider
                className="lighting-value"
                value={this.state.underglowSpeed}
                onChange={(event: any, newValue: number | number[]) => {
                  this.onChangeUnderglowSpeed(newValue as number);
                }}
                aria-labelledby="continuous-slider"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12}>
              <div className="lighting-label underglow-label-color">Color</div>
              <div className="underglow-color">
                <TextField
                  label="RGB"
                  className="underglow-color-value color-rgb"
                  value={this.state.underglowHex}
                  onChange={(e) => this.onChangeColorHex(e.target.value)}
                />
                <TextField
                  label="Hue"
                  className="underglow-color-value color-hue"
                  type="number"
                  inputProps={{ min: '0', max: '360' }}
                  value={this.state.underglowColor.h}
                  onChange={(e) =>
                    this.onChangeColorHue(Number(e.target.value))
                  }
                />
                <TextField
                  label="Saturation"
                  className="underglow-color-value color-saturation"
                  type="number"
                  inputProps={{ min: '0', max: '100' }}
                  value={this.state.underglowColor.s}
                  onChange={(e) =>
                    this.onChangeColorSaturation(Number(e.target.value))
                  }
                />
                <TextField
                  label="Brightness"
                  className="underglow-color-value color-brightness"
                  type="number"
                  inputProps={{ min: '0', max: '100' }}
                  value={this.state.underglowColor.v}
                  onChange={(e) =>
                    this.onChangeColorBrightness(Number(e.target.value))
                  }
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={12}>
              <div ref={this.colorWheelRef} className="color-wheel"></div>
            </Grid>
          </Grid>
        </Grid>
        <hr className="lighting-divider" />
        <Grid item xs={12}>
          <h4>
            BACKLIGHT
            <Switch
              checked={this.state.backlightOn}
              onChange={(e) => {
                this.setState({ backlightOn: e.target.checked });
              }}
              color="primary"
              name="brightness"
              size="small"
            />
          </h4>
        </Grid>
        <Grid item xs={6}>
          <div className="lighting-label">
            Brightness ({this.state.backlightBrightness})
          </div>
          <div>
            <Slider
              className="lighting-value"
              value={this.state.backlightBrightness}
              onChange={(event: any, newValue: number | number[]) => {
                this.onChangeBacklightBrightness(newValue as number);
              }}
              aria-labelledby="continuous-slider"
              min={0}
              max={100}
            />
          </div>
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
    );
  }
}

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
