/* eslint-disable no-undef */
import React from 'react';
import './Modifiers.scss';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from '@mui/material';
import {
  IMod,
  IModDirection,
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_SFT,
} from '../../../services/hid/Composition';
import { MOD_LEFT, MOD_RIGHT } from '../../../services/hid/Constraints';

type OwnProps = {
  mods: IMod[];
  direction: IModDirection;
  disabled?: boolean;
  disableDirection?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (direction: IModDirection, mods: IMod[]) => void;
};

type OwnState = {};

export default class Modifiers extends React.Component<OwnProps, OwnState> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {};
  }

  static decode(code: number): { direction: IModDirection; mods: IMod[] } {
    const direction: IModDirection =
      0 < (code & 0b1_0000) ? MOD_RIGHT : MOD_LEFT;
    const mods: IMod[] = [];
    if (code & 0b0001) {
      mods.push(MOD_CTL);
    }
    if (code & 0b0010) {
      mods.push(MOD_SFT);
    }
    if (code & 0b0100) {
      mods.push(MOD_ALT);
    }
    if (code & 0b1000) {
      mods.push(MOD_GUI);
    }
    return { direction, mods };
  }

  private emitOnChange(direction: IModDirection, mods: IMod[]) {
    this.props.onChange(direction, mods);
  }

  private updateRadioState(value: string) {
    const direction = value == '1' ? MOD_RIGHT : MOD_LEFT;
    this.emitOnChange(direction, this.props.mods);
  }

  private updateCheckboxState(
    type: 'shift' | 'ctrl' | 'alt' | 'gui',
    checked: boolean
  ) {
    let mods: IMod[] = [...this.props.mods];
    switch (type) {
      case 'ctrl':
        if (checked) {
          mods.push(MOD_CTL);
        } else {
          mods = mods.filter((item) => item != MOD_CTL);
        }
        break;
      case 'shift':
        if (checked) {
          mods.push(MOD_SFT);
        } else {
          mods = mods.filter((item) => item != MOD_SFT);
        }
        break;
      case 'alt':
        if (checked) {
          mods.push(MOD_ALT);
        } else {
          mods = mods.filter((item) => item != MOD_ALT);
        }
        break;
      case 'gui':
        if (checked) {
          mods.push(MOD_GUI);
        } else {
          mods = mods.filter((item) => item != MOD_GUI);
        }
        break;
    }

    this.emitOnChange(this.props.direction, mods);
  }

  render() {
    const mods = this.props.mods;
    const ctrl = mods.includes(MOD_CTL);
    const shift = mods.includes(MOD_SFT);
    const alt = mods.includes(MOD_ALT);
    const gui = mods.includes(MOD_GUI);
    const direction = '' + this.props.direction;
    return (
      <React.Fragment>
        <div
          className={[
            'modifiers-label',
            this.props.disabled && 'modifiers-label-disabled',
          ].join(' ')}
        >
          Modifiers
        </div>
        <RadioGroup
          row
          aria-label="position"
          name="left-right"
          defaultValue={'0'}
          value={direction}
          onChange={(e, value) => {
            this.updateRadioState(value);
          }}
        >
          <FormControlLabel
            value="0"
            disabled={
              this.props.disabled === true ||
              this.props.disableDirection === true
            }
            control={<Radio color="primary" />}
            label="Left"
          />
          <FormControlLabel
            value="1"
            disabled={
              this.props.disabled == true ||
              this.props.disableDirection === true
            }
            control={<Radio color="primary" />}
            label="Right"
          />
        </RadioGroup>
        <FormGroup
          aria-label="position"
          row
          style={{ justifyContent: 'space-between' }}
        >
          <FormControlLabel
            value="control"
            disabled={this.props.disabled == true}
            checked={ctrl}
            onChange={(e, checked) => {
              this.updateCheckboxState('ctrl', checked);
            }}
            control={<Checkbox color="primary" />}
            label="Ctrl"
          />
          <FormControlLabel
            value="shift"
            disabled={this.props.disabled == true}
            checked={shift}
            onChange={(e, checked) => {
              this.updateCheckboxState('shift', checked);
            }}
            control={<Checkbox color="primary" />}
            label="Shift"
          />
          <FormControlLabel
            value="alt"
            disabled={this.props.disabled == true}
            onChange={(e, checked) => {
              this.updateCheckboxState('alt', checked);
            }}
            checked={alt}
            control={<Checkbox color="primary" />}
            label="Alt"
          />
          <FormControlLabel
            value="gui"
            disabled={this.props.disabled == true}
            onChange={(e, checked) => {
              this.updateCheckboxState('gui', checked);
            }}
            checked={gui}
            control={<Checkbox color="primary" />}
            label="Win/Cmd"
          />
        </FormGroup>
      </React.Fragment>
    );
  }
}

export const buildModCode = (mods: IMod[]): number => {
  let code = 0b0000;
  if (mods.includes(MOD_CTL)) {
    code |= 0b0001;
  }
  if (mods.includes(MOD_SFT)) {
    code |= 0b0010;
  }
  if (mods.includes(MOD_ALT)) {
    code |= 0b0100;
  }
  if (mods.includes(MOD_GUI)) {
    code |= 0b1000;
  }
  return code;
};

const MOD_LABELS = [
  ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
  ['0', 'Ctrl', 'Shift', '3', 'Alt', '5', '6', '7', 'Win/Cmd'],
  ['0', 'C', 'S', '3', 'A', '5', '6', '7', 'W'],
  ['0', 'C', 'S', '3', 'A', '5', '6', '7', 'W'],
  ['0', 'C', 'S', '3', 'A', '5', '6', '7', 'W'],
];

export const buildModLabel = (
  modifiers: IMod[] | null,
  direction: IModDirection
): string => {
  if (modifiers === null || modifiers.length === 0) {
    return '';
  }
  const len = modifiers.length;
  const mods = modifiers
    .slice()
    .sort()
    .map((mod: IMod) => {
      return MOD_LABELS[len][mod];
    });
  const modLabel = mods.join('+');
  if (direction === MOD_LEFT) {
    return '*' + modLabel;
  } else {
    return modLabel + '*';
  }
};

export const mods2Number = (
  modifiers: IMod[],
  direction: IModDirection
): number => {
  return (
    (direction << 4) |
    modifiers.reduce((val, mod) => {
      return val | mod;
    }, 0)
  );
};
