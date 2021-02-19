/* eslint-disable no-undef */
import React from 'react';
import './TabUnderglow.scss';
import '../../../../node_modules/reinvented-color-wheel/css/reinvented-color-wheel.min.css';
import {
  Grid,
  MenuItem,
  Select,
  Slider,
  Switch,
  TextField,
} from '@material-ui/core';
import ReinventedColorWheel from 'reinvented-color-wheel';
import { IKeyboard } from '../../../services/hid/Hid';

export type Hsv = {
  h: number;
  s: number;
  v: number;
};

type Props = {
  underglowEffects: [string, number][];
  keyboard: IKeyboard;
  showBacklight: boolean;
  showUnderglow: boolean;
  // eslint-disable-next-line no-unused-vars
  onChangeUnderglow: (underglow: {
    typeIndex?: number;
    color?: Hsv; // h: 0-360, s: 0-100, v: 0-100
  }) => void;
  // eslint-disable-next-line no-unused-vars
  onChangeBacklight: (backlight: {
    isBreathing?: boolean;
    brightness?: number /* 0-255 */;
  }) => void;
};

type State = {
  underglowColorCount: number; // Num of colors that the underglow type can use.
  underglowColor: Hsv;
  underglowHex: string;
  underglowEffectMode: number;
  backlightBreathing: boolean;
  backlightBrightness: number; // 0-255
};

export default class TabUnderglow extends React.Component<Props, State> {
  private readonly UPDATE_VALUE_DURATION = 400;
  private colorWheelRef: React.RefObject<HTMLDivElement>;
  private colorWheel: ReinventedColorWheel | null = null;
  private underglowEffects: [string, number][];
  private initializing = true;
  private updateUnderglowValueMsec = 0;
  private updateBackgroundValueMsec = 0;

  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.colorWheelRef = React.createRef<HTMLDivElement>();
    this.underglowEffects = this.props.underglowEffects
      ? this.props.underglowEffects
      : [];

    this.state = {
      underglowColorCount: 0,
      underglowColor: { h: 0, s: 0, v: 0 },
      underglowHex: '#',
      underglowEffectMode: 0,
      backlightBreathing: false,
      backlightBrightness: 0,
    };
  }

  private async fetchKeyboardLightValues() {
    // device lighting values
    const kbd: IKeyboard = this.props.keyboard!;
    const bkb = await kbd.fetchBacklightBrightness();
    const backlightBrightness =
      bkb.success && bkb.brightness
        ? Math.round(100 * (bkb.brightness / 255))
        : 0;

    const bke = await kbd.fetchBacklightEffect();
    const backlightBreathing = bke.success ? Boolean(bke.isBreathing) : false;

    const le = await kbd.fetchRGBLightEffect();
    const underglowEffectMode = le.success && le.mode ? le.mode : 0;

    const lb = await kbd.fetchRGBLightBrightness();
    const v =
      lb.success && lb.brightness ? Math.round(100 * (lb.brightness / 255)) : 0;

    const lc = await kbd.fetchRGBLightColor();
    const hs =
      lc.success && typeof lc.hue != 'undefined' && typeof lc.sat != 'undefined'
        ? {
            h: Math.round(360 * (lc.hue / 255)),
            s: Math.round(100 * (lc.sat / 255)),
          }
        : { h: 0, s: 0 };

    const hex = ReinventedColorWheel.rgb2hex(
      ReinventedColorWheel.hsv2rgb([hs.h, hs.s, v])
    );
    const value = {
      underglowColor: { ...hs, v },
      underglowHex: hex,
      underglowEffectMode,
      backlightBreathing,
      backlightBrightness,
    };
    return value;
  }

  private buildColorWheel() {
    const { h, s, v } = this.state.underglowColor;
    const colorWheel = new ReinventedColorWheel({
      appendTo: this.colorWheelRef.current!,
      hsv: [h, s, v],

      // appearance
      wheelDiameter: 180,
      wheelThickness: 20,
      handleDiameter: 16,
      wheelReflectsSaturation: true,

      onChange: (color) => {
        this.onChangeColorWheel(color);
      },
    });
    const underglowHex = colorWheel.hex.toUpperCase();
    this.setState({
      underglowColor: { h, s, v },
      underglowHex,
    });
    return colorWheel;
  }

  componentDidMount() {
    if (this.colorWheelRef.current === null) {
      this.colorWheel = null;
      return;
    } else if (this.colorWheel === null) {
      this.colorWheel = this.buildColorWheel();
      this.fetchKeyboardLightValues().then((value) => {
        const {
          underglowColor,
          underglowEffectMode,
          backlightBreathing,
          backlightBrightness,
        } = value;
        const numOfColors =
          0 < this.props.underglowEffects.length
            ? this.props.underglowEffects[underglowEffectMode][1]
            : 0;
        this.setState({
          underglowColorCount: numOfColors,
          underglowEffectMode,
          backlightBreathing,
          backlightBrightness,
        });

        this.colorWheel!.hsv = [
          underglowColor.h,
          underglowColor.s,
          underglowColor.v,
        ];
      });
    }
  }

  private emitUnderglowValue(underglow: { mode?: number; color?: Hsv }) {
    this.props.onChangeUnderglow(underglow);
  }

  private emitBacklightValue(backlight: {
    isBreathing?: boolean;
    brightness?: number;
  }) {
    this.props.onChangeBacklight(backlight);
  }

  private onChangeColorWheel(_color: ReinventedColorWheel) {
    const color: Hsv = {
      h: Math.round(_color.hsv[0]),
      s: Math.round(_color.hsv[1]),
      v: Math.round(_color.hsv[2]),
    };
    this.setState({
      underglowColor: color,
      underglowHex: _color.hex.toUpperCase(),
    });
    if (this.initializing) {
      // Ignore the initial color setting from componentDidMount()
      this.initializing = false;
    } else {
      const msec = new Date().getTime();
      if (this.UPDATE_VALUE_DURATION < msec - this.updateUnderglowValueMsec) {
        // need to set duration to update hardware configuration because of its network performance.
        this.emitUnderglowValue({ color });
        this.updateUnderglowValueMsec = new Date().getTime();
      }
    }
  }

  private onChangeUnderglowMode(underglowEffectMode: number) {
    const numOfColors = this.underglowEffects[underglowEffectMode][1];
    this.setState({
      underglowEffectMode,
      underglowColorCount: numOfColors,
    });
    const msec = new Date().getTime();
    if (this.UPDATE_VALUE_DURATION < msec - this.updateUnderglowValueMsec) {
      this.emitUnderglowValue({ mode: underglowEffectMode });
      this.updateUnderglowValueMsec = new Date().getTime();
    }
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
    } else {
      this.setState({ underglowHex });
    }
  }

  private onChangeColor(color: Hsv) {
    this.colorWheel!.hsv = [color.h, color.s, color.v];
  }

  private onChangeBacklightBreathing(isBreathing: boolean) {
    this.setState({ backlightBreathing: isBreathing });
    this.emitBacklightValue({ isBreathing });
  }
  private onChangeBacklightBrightness(brightness: number) {
    this.setState({ backlightBrightness: brightness });
    const msec = new Date().getTime();
    if (this.UPDATE_VALUE_DURATION < msec - this.updateBackgroundValueMsec) {
      // need to set duration to update hardware configuration because of its network performance.
      this.emitBacklightValue({ brightness });
      this.updateBackgroundValueMsec = new Date().getTime();
    }
  }

  render() {
    return (
      <Grid container spacing={1} className="lighting-settings">
        {this.props.showUnderglow && (
          <Underglow
            colorWheelRef={this.colorWheelRef}
            disabledColorWheel={this.state.underglowColorCount === 0}
            underglowEffects={this.underglowEffects}
            underglowEffectIndex={this.state.underglowEffectMode}
            underglowHex={this.state.underglowHex}
            underglowColor={this.state.underglowColor}
            onChangeUnderglowTypeIndex={(index) =>
              this.onChangeUnderglowMode(index)
            }
            onChangeColorHex={(hex) => {
              this.onChangeColorHex(hex);
            }}
            onChangeColor={(color) => {
              this.onChangeColor(color);
            }}
          />
        )}
        {this.props.showBacklight && (
          <Brightness
            backlightBreathingMode={this.state.backlightBreathing}
            value={this.state.backlightBrightness}
            onChangeValue={(v) => {
              this.onChangeBacklightBrightness(v);
            }}
            onChangeBreathingMode={(flag) => {
              this.onChangeBacklightBreathing(flag);
            }}
          />
        )}
      </Grid>
    );
  }
}

type UnderglowProps = {
  colorWheelRef: React.RefObject<HTMLDivElement>;
  disabledColorWheel: boolean;
  underglowEffects: [string, number][];
  underglowEffectIndex: number;
  underglowHex: string; // #FF11AA
  underglowColor: Hsv;
  // eslint-disable-next-line no-unused-vars
  onChangeUnderglowTypeIndex: (typeIndex: number) => void;
  // eslint-disable-next-line no-unused-vars
  onChangeColorHex: (hex: string) => void;
  // eslint-disable-next-line no-unused-vars
  onChangeColor: (color: Hsv) => void;
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
            <div className="lighting-label">Effect Mode</div>
            <div>
              <Select
                className="lighting-value"
                defaultValue={props.underglowEffectIndex}
                value={props.underglowEffectIndex}
                onChange={(e) => {
                  props.onChangeUnderglowTypeIndex(Number(e.target.value));
                }}
              >
                {props.underglowEffects.map((effect, index) => {
                  return (
                    <MenuItem
                      key={index}
                      value={index}
                    >{`${effect[0]}`}</MenuItem>
                  );
                })}
              </Select>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div
              className={`lighting-label underglow-label-color ${
                props.disabledColorWheel && 'lighting-label-disabled'
              }`}
            >
              Color
            </div>
            <div className="underglow-color">
              <TextField
                label="RGB"
                className="underglow-color-value color-rgb"
                value={props.underglowHex}
                disabled={props.disabledColorWheel}
                onChange={(e) => props.onChangeColorHex(e.target.value)}
              />
              <TextField
                label="Hue"
                className="underglow-color-value color-hue"
                type="number"
                inputProps={{ min: '0', max: '360' }}
                value={props.underglowColor.h}
                disabled={props.disabledColorWheel}
                onChange={(e) => {
                  props.onChangeColor({
                    ...props.underglowColor,
                    h: Number(e.target.value),
                  });
                }}
              />
              <TextField
                label="Saturation"
                className="underglow-color-value color-saturation"
                type="number"
                inputProps={{ min: '0', max: '100' }}
                value={props.underglowColor.s}
                disabled={props.disabledColorWheel}
                onChange={(e) => {
                  props.onChangeColor({
                    ...props.underglowColor,
                    s: Number(e.target.value),
                  });
                }}
              />
              <TextField
                label="Brightness"
                className="underglow-color-value color-brightness"
                type="number"
                inputProps={{ min: '0', max: '100' }}
                value={props.underglowColor.v}
                disabled={props.disabledColorWheel}
                onChange={(e) => {
                  props.onChangeColor({
                    ...props.underglowColor,
                    v: Number(e.target.value),
                  });
                }}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container>
          <Grid item xs={12}>
            <div ref={props.colorWheelRef} className="color-wheel">
              {props.disabledColorWheel && (
                <div className="color-wheel-disabled"></div>
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

type BrightnessProps = {
  backlightBreathingMode: boolean;
  value: number;
  // eslint-disable-next-line no-unused-vars
  onChangeBreathingMode: (f: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onChangeValue: (v: number) => void;
};
function Brightness(props: BrightnessProps) {
  return (
    <React.Fragment>
      <Grid item xs={12}>
        <h4>BACKLIGHT</h4>
      </Grid>
      <Grid item xs={6}>
        <div className="lighting-label">
          Breathing Mode
          <Switch
            checked={props.backlightBreathingMode}
            onChange={(e) => {
              props.onChangeBreathingMode(e.target.checked);
            }}
            color="primary"
            name="brightness"
          />
        </div>

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

export const defaultUnderglowEffects: [string, number][] = [
  ['All Off', 0],
  ['Solid Color', 1],
  ['Breathing 1', 1],
  ['Breathing 2', 1],
  ['Breathing 3', 1],
  ['Breathing 4', 1],
  ['Rainbow Mood 1', 0],
  ['Rainbow Mood 2', 0],
  ['Rainbow Mood 3', 0],
  ['Rainbow Swirl 1', 0],
  ['Rainbow Swirl 2', 0],
  ['Rainbow Swirl 3', 0],
  ['Rainbow Swirl 4', 0],
  ['Rainbow Swirl 5', 0],
  ['Rainbow Swirl 6', 0],
  ['Snake 1', 1],
  ['Snake 2', 1],
  ['Snake 3', 1],
  ['Snake 4', 1],
  ['Snake 5', 1],
  ['Snake 6', 1],
  ['Knight 1', 1],
  ['Knight 2', 1],
  ['Knight 3', 1],
  ['Christmas', 1],
  ['Gradient 1', 1],
  ['Gradient 2', 1],
  ['Gradient 3', 1],
  ['Gradient 4', 1],
  ['Gradient 5', 1],
  ['Gradient 6', 1],
  ['Gradient 7', 1],
  ['Gradient 8', 1],
  ['Gradient 9', 1],
  ['Gradient 10', 1],
  ['RGB Test', 1],
  ['Alternating', 1],
];
