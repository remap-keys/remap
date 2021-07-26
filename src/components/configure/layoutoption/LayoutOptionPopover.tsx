/* eslint-disable no-undef */
import React from 'react';
import './LayoutOptionPopover.scss';
import {
  LayoutOptionPopoverActionsType,
  LayoutOptionPopoverStateType,
} from './LayoutOptionPopover.container';
import { Grid, Popover } from '@material-ui/core';
import LayoutOptionComponentList from './LayoutOptionComponentList.container';

type PopoverPosition = {
  left: number;
  top: number;
};

type OwnProps = {
  open: boolean;
  position: PopoverPosition | null;
  onClose: () => void;
  hidSupport: boolean;
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

  render() {
    if (
      !this.props.position ||
      !this.props.selectedLayoutOptions ||
      0 === this.props.selectedLayoutOptions.length
    ) {
      return <></>;
    }

    return (
      <Popover
        open={this.props.open}
        anchorReference="anchorPosition"
        anchorPosition={this.position}
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
          <LayoutOptionComponentList hidSupport={this.props.hidSupport} />
        </div>
      </Popover>
    );
  }
}
