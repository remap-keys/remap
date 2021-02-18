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
      underglowHex: '#FFFFFF',
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
    const underglowHex = this.colorWheel.hex.toUpperCase();
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
      underglowHex: color.hex.toUpperCase(),
    });
  }

  private onChangeColorHex(hex: string) {
    if (this.colorWheel === null) {
      return;
    }

    const hexNumber = hex
      .toUpperCase()
      .replace(/[^0-9,A-F]/g, '')
      .slice(0, 6);
    const underglowHex = `#${hexNumber}`;
    if (hex.length === 7) {
      this.colorWheel.hex = underglowHex;
      const hsv = this.colorWheel.hsv;
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

  private onChangeColor(underglowColor: { h: number; s: number; v: number }) {
    this.setState({ underglowColor });
    this.colorWheel!.hsv = [
      underglowColor.h,
      underglowColor.s,
      underglowColor.v,
    ];
  }

  private onChangeBacklightBrightness(brightness: number) {
    this.setState({ backlightBrightness: brightness });
  }

  render() {
    return (
      <Grid container spacing={1} className="lighting-settings">
        <Underglow
          colorWheelRef={this.colorWheelRef}
          underglowType={this.state.underglowType}
          underglowSpeed={this.state.underglowSpeed}
          underglowHex={this.state.underglowHex}
          underglowColor={this.state.underglowColor}
          onChangeUnderglowType={(type) => this.onChangeUnderglowType(type)}
          onChangeUnderglowSpeed={(speed) => {
            this.onChangeUnderglowSpeed(speed);
          }}
          onChangeColorHex={(hex) => {
            this.onChangeColorHex(hex);
          }}
          onChangeColor={(color) => {
            this.onChangeColor(color);
          }}
        />
        <hr className="lighting-divider" />
        <Brightness
          backlightOn={this.state.backlightOn}
          value={this.state.backlightBrightness}
          onChangeValue={(v) => {
            this.onChangeBacklightBrightness(v);
          }}
          onChangeEnable={(flag) => {
            this.setState({ backlightOn: flag });
          }}
        />
      </Grid>
    );
  }
}

type UnderglowProps = {
  colorWheelRef: React.RefObject<HTMLDivElement>;
  underglowType: string;
  underglowSpeed: number;
  underglowHex: string; // #FF11AA
  underglowColor: { h: number; s: number; v: number };
  // eslint-disable-next-line no-unused-vars
  onChangeUnderglowType: (type: string) => void;
  // eslint-disable-next-line no-unused-vars
  onChangeUnderglowSpeed: (speed: number) => void;
  // eslint-disable-next-line no-unused-vars
  onChangeColorHex: (hex: string) => void;
  // eslint-disable-next-line no-unused-vars
  onChangeColor: (color: { h: number; s: number; v: number }) => void;
};
function Underglow(props: UnderglowProps) {
  return (
    <React.Fragment>
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
                value={props.underglowType}
                onChange={(e) => {
                  props.onChangeUnderglowType(e.target.value as string);
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
              Effect Speed ({props.underglowSpeed})
            </div>
            <Slider
              className="lighting-value"
              value={props.underglowSpeed}
              onChange={(event: any, newValue: number | number[]) => {
                props.onChangeUnderglowSpeed(newValue as number);
              }}
              aria-labelledby="continuous-slider"
              min={0}
              max={3}
              marks={true}
            />
          </Grid>
          <Grid item xs={12}>
            <div className="lighting-label underglow-label-color">Color</div>
            <div className="underglow-color">
              <TextField
                label="RGB"
                className="underglow-color-value color-rgb"
                value={props.underglowHex}
                onChange={(e) => props.onChangeColorHex(e.target.value)}
              />
              <TextField
                label="Hue"
                className="underglow-color-value color-hue"
                type="number"
                inputProps={{ min: '0', max: '360' }}
                value={props.underglowColor.h}
                onChange={(e) =>
                  props.onChangeColor({
                    ...props.underglowColor,
                    h: Number(e.target.value),
                  })
                }
              />
              <TextField
                label="Saturation"
                className="underglow-color-value color-saturation"
                type="number"
                inputProps={{ min: '0', max: '100' }}
                value={props.underglowColor.s}
                onChange={(e) =>
                  props.onChangeColor({
                    ...props.underglowColor,
                    s: Number(e.target.value),
                  })
                }
              />
              <TextField
                label="Brightness"
                className="underglow-color-value color-brightness"
                type="number"
                inputProps={{ min: '0', max: '100' }}
                value={props.underglowColor.v}
                onChange={(e) =>
                  props.onChangeColor({
                    ...props.underglowColor,
                    v: Number(e.target.value),
                  })
                }
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container>
          <Grid item xs={12}>
            <div ref={props.colorWheelRef} className="color-wheel"></div>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

type BrightnessProps = {
  backlightOn: boolean;
  value: number;
  // eslint-disable-next-line no-unused-vars
  onChangeEnable: (f: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onChangeValue: (v: number) => void;
};
function Brightness(props: BrightnessProps) {
  return (
    <React.Fragment>
      <Grid item xs={12}>
        <h4>
          BACKLIGHT
          <Switch
            checked={props.backlightOn}
            onChange={(e) => {
              props.onChangeEnable(e.target.checked);
            }}
            color="primary"
            name="brightness"
            size="small"
          />
        </h4>
      </Grid>
      <Grid item xs={6}>
        <div className="lighting-label">Brightness ({props.value})</div>
        <div>
          <Slider
            className="lighting-value"
            value={props.value}
            onChange={(event: any, newValue: number | number[]) => {
              props.onChangeValue(newValue as number);
            }}
            aria-labelledby="continuous-slider"
            min={0}
            max={100}
          />
        </div>
      </Grid>
    </React.Fragment>
  );
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
