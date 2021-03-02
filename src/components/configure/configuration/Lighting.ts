import ReinventedColorWheel from 'reinvented-color-wheel';
import { IKeyboard } from '../../../services/hid/Hid';

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

type LightingValues = {
  underglow: {
    mode: number;
    colors: [number, number, number];
  };
  backlight: {
    breathing: boolean;
    brightness: number;
  };
};

export default class Lighting {
  private lighting: LightingType | undefined;
  constructor(lighting: LightingType | undefined) {
    this.validate(lighting);
    this.lighting = lighting;
  }
  private validate(lighting: LightingType) {
    if (typeof lighting === 'string' || lighting === undefined) return;

    if (!lighting.extends) {
      /**
       * lighting object MUST be contains 'extends' property.
       * ref. https://caniusevia.com/docs/optional#lighting
       */
      throw new Error(
        `lighting properties whose type is NOT 'string' MUST contain 'extends'.`
      );
    }
  }

  get hasExtends(): boolean {
    if (typeof this.lighting === 'string' || this.lighting === undefined) {
      return false;
    }

    return Boolean(this.lighting.extends);
  }

  get showUnderglow(): boolean {
    if (this.lighting === undefined) return false;

    if (typeof this.lighting === 'string') {
      return 0 <= this.lighting.indexOf('rgblight');
    }

    return 0 <= this.lighting.extends!.indexOf('rgblight');
  }

  get showBacklight(): boolean {
    if (this.lighting === undefined) return false;

    if (typeof this.lighting === 'string') {
      return 0 <= this.lighting.indexOf('backlight');
    }

    return 0 <= this.lighting.extends!.indexOf('backlight');
  }

  get underglowEffects(): [string, number][] {
    if (this.lighting === undefined) return [];

    if (typeof this.lighting === 'string') {
      return defaultUnderglowEffects;
    }

    if (
      !this.lighting.underglowEffects ||
      this.lighting.underglowEffects.length === 0
    ) {
      // use default effects if no overridden effects
      return defaultUnderglowEffects;
    }

    if (typeof this.lighting.underglowEffects[0] === 'string') {
      const label: string = this.lighting.underglowEffects[0];
      return [[label, 0]];
    } else {
      return this.lighting.underglowEffects as [string, number][];
    }
  }

  static async fetchKeyboardLightValues(kbd: IKeyboard) {
    // device lighting values
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
}

const defaultUnderglowEffects: [string, number][] = [
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
  ['Twinkle 1', 1],
  ['Twinkle 2', 1],
  ['Twinkle 3', 1],
  ['Twinkle 4', 1],
  ['Twinkle 5', 1],
  ['Twinkle 6', 1],
];
