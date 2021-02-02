import React from 'react';
import './Modifiers.scss';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from '@material-ui/core';

type OwnProps = {
  code: number;
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (code: number) => void;
};

type OwnState = {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  gui: boolean;
  direction: '0' | '1'; // 0: left, 1: right
};

export default class Modifiers extends React.Component<OwnProps, OwnState> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    const code = this.props.code;
    this.state = {
      ctrl: 0 < (code & 0b0001),
      shift: 0 < (code & 0b0010),
      alt: 0 < (code & 0b0100),
      gui: 0 < (code & 0b1000),
      direction: 0 < (code & 0b1_0000) ? '1' : '0',
    };
  }

  shouldComponentUpdate(nextProps: OwnProps, nextState: OwnState) {
    const currentModCode = this.buildModCode(this.state);
    const nextModCode = this.buildModCode(nextState);
    if (this.state.direction != nextState.direction) {
      if (0 < nextModCode) {
        const direction = nextState.direction == '0' ? 0b0_0000 : 0b1_0000;
        this.props.onChange(nextModCode | direction);
      }
    } else if (currentModCode != nextModCode) {
      let code = nextModCode;
      if (0 < code) {
        const direction = nextState.direction == '0' ? 0b0_0000 : 0b1_0000;
        code |= direction;
      }
      this.props.onChange(code);
    }
    return true;
  }

  private buildModCode(args: {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    gui: boolean;
  }): number {
    const { ctrl, shift, alt, gui } = args;
    let code: number = 0b0000;
    if (ctrl) {
      code |= 0b0001;
    }
    if (shift) {
      code |= 0b0010;
    }
    if (alt) {
      code |= 0b0100;
    }
    if (gui) {
      code |= 0b1000;
    }

    return code;
  }

  render() {
    return (
      <React.Fragment>
        <div className="modifiers-label">Modifiers</div>
        <RadioGroup
          row
          aria-label="position"
          name="left-right"
          defaultValue={'0'}
          value={this.state.direction}
          onChange={(e) => {
            const direction: '0' | '1' = e.target.value as '0' | '1';
            this.setState({ direction });
          }}
        >
          <FormControlLabel
            value="0"
            control={<Radio color="primary" />}
            label="Left"
          />
          <FormControlLabel
            value="1"
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
            value="shift"
            control={
              <Checkbox
                color="primary"
                onChange={(e) => {
                  this.setState({ shift: e.target.checked });
                }}
                checked={this.state.shift}
              />
            }
            label="Shift"
          />
          <FormControlLabel
            value="control"
            control={
              <Checkbox
                color="primary"
                onChange={(e) => {
                  this.setState({ ctrl: e.target.checked });
                }}
                checked={this.state.ctrl}
              />
            }
            label="Ctrl"
          />
          <FormControlLabel
            value="alt"
            control={
              <Checkbox
                color="primary"
                onChange={(e) => {
                  this.setState({ alt: e.target.checked });
                }}
                checked={this.state.alt}
              />
            }
            label="Alt"
          />
          <FormControlLabel
            value="gui"
            control={
              <Checkbox
                color="primary"
                onChange={(e) => {
                  this.setState({ gui: e.target.checked });
                }}
                checked={this.state.gui}
              />
            }
            label="Win/Cmd"
          />
        </FormGroup>
      </React.Fragment>
    );
  }
}
