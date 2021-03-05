/* eslint-disable no-undef */
import React from 'react';
import './LayoutOptionPopover.scss';
import {
  LayoutOptionPopoverActionsType,
  LayoutOptionPopoverStateType,
} from './LayoutOptionPopover.container';
import { Grid, MenuItem, Popover, Select, Switch } from '@material-ui/core';

type PopoverPosition = {
  left: number;
  top: number;
};

type OwnProps = {
  open: boolean;
  position: PopoverPosition | null;
  onClose: () => void;
};

type LayoutOptionPopoverProps = OwnProps &
  Partial<LayoutOptionPopoverActionsType> &
  Partial<LayoutOptionPopoverStateType>;

type OwnState = {};

export default class LayoutOptionPopover extends React.Component<
  LayoutOptionPopoverProps,
  OwnState
> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {};
  }

  get position(): { left: number; top: number } {
    if (!this.props.position) {
      return {
        left: 0,
        top: 0,
      };
    }
    const { left, top } = this.props.position;

    const width = 360; // popover width
    const iconSize = 30;
    const y = top + iconSize + 10; // 10=margin
    if (window.innerWidth < left + width) {
      const x = left - (width - (window.innerWidth - left));
      return { left: x, top: y };
    }
    return { left: left, top: y };
  }

  private onEnter() {}

  render() {
    if (
      !this.props.position ||
      !this.props.selectedLayoutOptions ||
      0 === this.props.selectedLayoutOptions.length
    ) {
      return <></>;
    }

    const labels = this.props.keyboardLayoutOptions!;
    return (
      <Popover
        open={this.props.open}
        anchorReference="anchorPosition"
        anchorPosition={this.position}
        onEnter={this.onEnter.bind(this)}
        onClose={() => {
          this.props.onClose();
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        className="layout-option-root"
      >
        <div className="layout-option-popover">
          <Grid container className="layout-option-header">
            <Grid item xs={12} className="layout-option-title">
              <h2>Layout Option</h2>
            </Grid>
          </Grid>
          <Grid container spacing={1} className="layout-option-content">
            {labels.map((options, index) => {
              return (
                <OptionRowComponent
                  key={index}
                  options={options}
                  selectedOption={this.props.selectedLayoutOptions![index]}
                  onChange={(choice: string | null) => {
                    this.props.setLayoutOption!(index, choice);
                  }}
                />
              );
            })}
          </Grid>
        </div>
      </Popover>
    );
  }
}

type OptionRowType = {
  options: string | string[];
  selectedOption: string | null;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string | null) => void;
};
function OptionRowComponent(props: OptionRowType) {
  if (typeof props.options == 'string') {
    const option: string = props.options;
    return (
      <React.Fragment>
        <Grid item xs={8} className="option-label">
          {props.options}
        </Grid>
        <Grid item xs={4} className="option-value">
          <Switch
            checked={!!props.selectedOption}
            onChange={(e) => {
              props.onChange(e.target.checked ? option : null);
            }}
            color="primary"
            name="checkedB"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </Grid>
      </React.Fragment>
    );
  }

  const label = props.options[0];
  const choices: string[] = props.options.slice(1);
  return (
    <React.Fragment>
      <Grid item xs={8} className="option-label">
        {props.options[0]}
      </Grid>
      <Grid item xs={4} className="option-value">
        <Select
          value={props.selectedOption}
          onChange={(e) => {
            props.onChange(e.target.value as string);
          }}
          className="option-value-select"
        >
          {choices.map((choice, index) => {
            return (
              <MenuItem key={`${label}${index}`} value={choice}>
                {choice}
              </MenuItem>
            );
          })}
        </Select>
      </Grid>
    </React.Fragment>
  );
}
