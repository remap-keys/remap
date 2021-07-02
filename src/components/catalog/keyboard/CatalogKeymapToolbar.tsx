import './CatalogKeymapToolbar.scss';
import {
  CatalogKeymapToolbarActionsType,
  CatalogKeymapToolbarStateType,
} from './CatalogKeymapToolbar.container';
import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import ViewQuiltRoundedIcon from '@material-ui/icons/ViewQuiltRounded';
import LayoutOptionPopover from '../../configure/layoutoption/LayoutOptionPopover.container';
import SwapHorizRoundedIcon from '@material-ui/icons/SwapHorizRounded';

type CatalogKeymapToolbarState = {
  layoutOptionPopoverPosition: { left: number; top: number } | null;
};
type OwnProps = {};
type CatalogKeymapToolbarProps = OwnProps &
  Partial<CatalogKeymapToolbarActionsType> &
  Partial<CatalogKeymapToolbarStateType>;

export default class CatalogKeymapToolbar extends React.Component<
  CatalogKeymapToolbarProps,
  CatalogKeymapToolbarState
> {
  constructor(
    props: CatalogKeymapToolbarProps | Readonly<CatalogKeymapToolbarProps>
  ) {
    super(props);
    this.state = {
      layoutOptionPopoverPosition: null,
    };
  }

  private onClickOpenLayoutOptionPopover(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const { left, top } = event.currentTarget.getBoundingClientRect();
    this.setState({
      layoutOptionPopoverPosition: {
        left,
        top,
      },
    });
  }

  private onCloseLayoutOptionPopover() {
    this.setState({ layoutOptionPopoverPosition: null });
  }

  render() {
    const hasLayoutOptions = 0 < this.props.selectedKeyboardOptions!.length;
    return (
      <div className="catalog-keymap-toolbar-menu">
        {hasLayoutOptions ? (
          <div className="catalog-keymap-toolbar-menu-item">
            <Tooltip title="Layout Option" arrow={true} placement="top">
              <IconButton
                size="small"
                onClick={(event) => {
                  this.onClickOpenLayoutOptionPopover(event);
                }}
              >
                <ViewQuiltRoundedIcon />
              </IconButton>
            </Tooltip>
            <LayoutOptionPopover
              open={Boolean(this.state.layoutOptionPopoverPosition)}
              position={this.state.layoutOptionPopoverPosition}
              onClose={() => {
                this.onCloseLayoutOptionPopover();
              }}
              hidSupport={false}
            />
          </div>
        ) : null}
        <div className="catalog-keymap-toolbar-menu-item">
          <Tooltip arrow={true} placement="top" title="Shared keymaps">
            <IconButton
              size="small"
              // onClick={(event) => {
              //   this.onClickOpenKeymapListPopover(event);
              // }}
            >
              <SwapHorizRoundedIcon />
            </IconButton>
          </Tooltip>
          {/*<KeymapListPopover*/}
          {/*  open={Boolean(this.state.keymapListPopoverPosition)}*/}
          {/*  onClose={() => {*/}
          {/*    this.onCloseKeymapListPopover();*/}
          {/*  }}*/}
          {/*  position={this.state.keymapListPopoverPosition}*/}
          {/*/>*/}
        </div>
      </div>
    );
  }
}
