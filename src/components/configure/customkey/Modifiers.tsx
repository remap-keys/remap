/* eslint-disable no-undef */
import React from 'react';
import './Modifiers.scss';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import {
  IMod,
  IModDirection,
  MOD_ALT,
  MOD_CTL,
  MOD_GUI,
  MOD_LEFT,
  MOD_RIGHT,
  MOD_SFT,
} from '../../../services/hid/Composition';

type OwnProps = {
  code: number;
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (code: number) => void;
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
  private updateRadioState(value: string) {
    this.setState({ direction: value as '0' | '1' });
    let code = this.props.code & 0b1111;
    const right = value == '1';
    if (right) {
      code = code | 0b1_0000;
    }

    this.props.onChange(code);
  }

  private updateCheckboxState(
    type: 'shift' | 'ctrl' | 'alt' | 'gui',
    checked: boolean
  ) {
    let code = this.props.code;
    switch (type) {
      case 'ctrl':
        code = (code & 0b1_1110) | (checked ? 0b0_0001 : 0b0_0000);
        break;
      case 'shift':
        code = (code & 0b1_1101) | (checked ? 0b0_0010 : 0b0_0000);
        break;
      case 'alt':
        code = (code & 0b1_1011) | (checked ? 0b0_0100 : 0b0_0000);
        break;
      case 'gui':
        code = (code & 0b1_0111) | (checked ? 0b0_1000 : 0b0_0000);
        break;
    }

    this.props.onChange(code);
  }

  render() {
    const code = this.props.code;
    const ctrl = 0 < (code & 0b0001);
    const shift = 0 < (code & 0b0010);
    const alt = 0 < (code & 0b0100);
    const gui = 0 < (code & 0b1000);
    const direction = 0 < (code & 0b1_0000) ? '1' : '0';
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
            disabled={this.props.disabled == true}
            control={<Radio color="primary" />}
            label="Left"
          />
          <FormControlLabel
            value="1"
            disabled={this.props.disabled == true}
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
