/* eslint-disable no-undef */
import React from 'react';
import './LightingDialog.scss';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  PaperProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Draggable from 'react-draggable';
import Lighting, { defaultUnderglowEffects, Hsv } from './Lighting';
import { IKeyboard } from '../../../services/hid/Hid';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';

type LightingType =
  | undefined
  | (
      | 'none'
      | 'qmk_backlight'
      | 'qmk_rgblight'
      | 'qmk_backlight_rgblight'
      | 'wt_rgb_backlight'
      | 'wt_mono_backlight'
    )
  | {
      extends?: string;
      effects?: [] | [[] | [string] | [string, number]];
      keycodes?: 'qmk' | 'wt';
      supportedBacklightValues?: number[];
      supportedLightingValues?: number[];
      underglowEffects?: [] | [string] | [string, number][];
      [k: string]: unknown;
    };

type OwnProps = {
  open: boolean;
  onClose: () => void;
  keyboard: IKeyboard;
  lightingDef: LightingType | undefined;
  definition: KeyboardDefinitionSchema;
};

type OwnState = {};

export default class LightingDialog extends React.Component<
  OwnProps,
  OwnState
> {
  private showUnderglow: boolean = true;
  private showBacklight: boolean = true;
  private underglowEffects: [string, number][] = [];
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(_nextProps: OwnProps, _nextState: OwnState) {
    this.initLighting();
    return true;
  }

  static isLightingAvailable(lighting: LightingType | undefined): boolean {
    return (
      LightingDialog.isBacklightAvailable(lighting) ||
      LightingDialog.isRgbLightAvailable(lighting)
    );
  }

  static isBacklightAvailable(lighting: LightingType | undefined): boolean {
    if (!lighting) return false;

    if (typeof lighting === 'string') {
      return (
        lighting === 'qmk_backlight' || lighting === 'qmk_backlight_rgblight'
      );
    }

    if (!lighting.extends) {
      return false;
    }

    return lighting.extends === 'qmk_backlight';
  }

  static isRgbLightAvailable(lighting: LightingType | undefined): boolean {
    if (!lighting) return false;

    if (typeof lighting === 'string') {
      return (
        lighting === 'qmk_rgblight' || lighting === 'qmk_backlight_rgblight'
      );
    }

    if (!lighting.extends) {
      return false;
    }

    return lighting.extends === 'qmk_rgblight';
  }

  private initLighting() {
    const lighting: LightingType = this.props.lightingDef;
    this.showUnderglow = false;
    if (!lighting) {
      this.showUnderglow = false;
      this.showBacklight = false;
      return;
    }

    if (typeof lighting === 'string') {
      this.showUnderglow = 0 <= lighting.indexOf('rgblight');
      this.showBacklight = 0 <= lighting.indexOf('backlight');
      this.underglowEffects = defaultUnderglowEffects;
      return;
    }

    if (!lighting.extends) {
      /**
       * lighting object MUST be contains 'extends' property.
       * ref. https://caniusevia.com/docs/optional#lighting
       */
      throw new Error(
        `lighting properties whose type is NOT 'string' MUST contain 'extends'.`
      );
    }
    this.showUnderglow = 0 <= lighting.extends.indexOf('rgblight');
    this.showBacklight = 0 <= lighting.extends.indexOf('backlight');

    if (!lighting.underglowEffects || lighting.underglowEffects.length === 0) {
      // use default effects if no overridden effects
      this.underglowEffects = defaultUnderglowEffects;
      return;
    }

    if (typeof lighting.underglowEffects[0] === 'string') {
      const label: string = lighting.underglowEffects[0];
      this.underglowEffects = [[label, 0]];
    } else {
      this.underglowEffects = lighting.underglowEffects as [string, number][];
    }
  }

  private onChangeBacklight(backlight: {
    isBreathing?: boolean;
    brightness?: number /* 0-100 */;
  }) {
    if (backlight.isBreathing != undefined) {
      this.props.keyboard!.updateBacklightEffect(backlight.isBreathing);
    }

    if (backlight.brightness != undefined) {
      const brightness = Math.round(255 * (backlight.brightness / 100));
      this.props.keyboard!.updateBacklightBrightness(brightness);
    }
  }

  private onChangeUnderglow(underglow: {
    mode?: number;
    color?: Hsv; // h: 0-360, s: 0-100, v: 0-100
  }) {
    if (underglow.mode != undefined) {
      this.props.keyboard!.updateRGBLightEffect(underglow.mode);
    }

    if (underglow.color != undefined) {
      const hsv: Hsv = underglow.color;
      const hue = Math.round(255 * (hsv.h / 360));
      const sat = Math.round(255 * (hsv.s / 100));
      const brightness = Math.round(255 * (hsv.v / 100));

      this.props.keyboard!.updateRGBLightColor(hue, sat);
      this.props.keyboard!.updateRGBLightBrightness(brightness);
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        maxWidth={'sm'}
        PaperComponent={PaperComponent}
        className="lighting-dialog"
      >
        <DialogTitle id="lighting-dialog-title" style={{ cursor: 'move' }}>
          Lighting
          <div className="close-dialog">
            <CloseIcon onClick={this.props.onClose} />
          </div>
        </DialogTitle>
        <DialogContent dividers className="lighting-dialog-content">
          <Lighting
            underglowEffects={this.underglowEffects}
            keyboard={this.props.keyboard}
            definition={this.props.definition}
            showBacklight={this.showBacklight}
            showUnderglow={this.showUnderglow}
            onChangeUnderglow={(underglow) => {
              this.onChangeUnderglow(underglow);
            }}
            onChangeBacklight={(backlight) => {
              this.onChangeBacklight(backlight);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#lighting-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
