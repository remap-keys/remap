import React from 'react';
import './CatalogKeymapListPopover.scss';
import {
  CatalogKeymapListPopoverActionsType,
  CatalogKeymapListPopoverStateType,
} from './CatalogKeymapListPopover.container';
import {
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from '@material-ui/core';
import { AbstractKeymapData } from '../../../services/storage/Storage';
import { IKeymap } from '../../../services/hid/Hid';
import { KeycodeList } from '../../../services/hid/KeycodeList';

type PopoverPosition = {
  left: number;
  top: number;
};

type OwnProps = {
  open: boolean;
  position: PopoverPosition | null;
  onClose: () => void;
};

type CatalogKeymapListPopoverProps = OwnProps &
  Partial<CatalogKeymapListPopoverActionsType> &
  Partial<CatalogKeymapListPopoverStateType>;

type OwnState = {
  popoverPosition: PopoverPosition;
};

export default class CatalogKeymapListPopover extends React.Component<
  CatalogKeymapListPopoverProps,
  OwnState
> {
  private popoverRef: React.RefObject<HTMLDivElement>;

  constructor(
    props:
      | CatalogKeymapListPopoverProps
      | Readonly<CatalogKeymapListPopoverProps>
  ) {
    super(props);
    this.state = {
      popoverPosition: { top: 0, left: 0 },
    };
    this.popoverRef = React.createRef<HTMLDivElement>();
  }

  private onEnter() {
    if (this.popoverRef.current && this.props.position) {
      // Adjust the Popover position regarding to its size.
      const { left, top } = this.props.position;
      const { width, height } = this.popoverRef.current.getBoundingClientRect();
      const iconSize = 30;
      const margin = 10;

      let x = 0;
      let y = 0;
      if (window.innerWidth < left + width + iconSize + margin) {
        // show the dialog below the icon
        x = Math.min(left, left - (width - (window.innerWidth - left)));
        y = top + iconSize + margin; // 10=margin
      } else {
        // show the dialog right side of the icon
        x = left + iconSize + margin; // 10=margin
        y = top - height / 2 + iconSize / 2;
      }
      this.setState({ popoverPosition: { left: x, top: y } });
    }
  }

  private onClickApplySharedKeymapData(savedKeymapData: AbstractKeymapData) {
    const labelLang = savedKeymapData.label_lang;
    const layoutOptions = savedKeymapData.layout_options;
    let keycodes: { [pos: string]: IKeymap }[] = [];
    const savedKeycodes: { [pos: string]: number }[] = savedKeymapData.keycodes;
    for (let i = 0; i < savedKeycodes.length; i++) {
      const savedCode = savedKeycodes[i];
      const changes: { [pos: string]: IKeymap } = {};
      // When the savedKeycodes was stored for BMP MCU, the length may be 11.
      // Therefore, the target layer must be checked to ensure that the value
      // is less than the savedKeycodes length.
      // See: https://github.com/remap-keys/remap/issues/454
      if (i < savedKeycodes.length) {
        Object.keys(savedCode).forEach((pos) => {
          changes[pos] = KeycodeList.getKeymap(savedCode[pos], labelLang);
        });
      }
      keycodes.push(changes);
    }
    this.props.applySavedKeymapData!(keycodes, layoutOptions, labelLang);
  }

  render() {
    if (!this.props.position) {
      return null;
    }

    return (
      <Popover
        open={this.props.open}
        anchorReference="anchorPosition"
        anchorPosition={this.state.popoverPosition}
        onEnter={this.onEnter.bind(this)}
        onClose={() => {
          this.props.onClose();
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        className="catalog-keymap-list-root"
      >
        <div className="catalog-keymap-list-popover" ref={this.popoverRef}>
          <List dense={true}>
            {this.props.sharedKeymaps!.map(
              (item: AbstractKeymapData, index) => {
                return (
                  <ListItem
                    key={`catalog-keymap-list-keymap-${index}`}
                    button
                    onClick={() => {
                      this.onClickApplySharedKeymapData(item);
                    }}
                  >
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body1"
                            color="textPrimary"
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                          >
                            {` by ${item.author_display_name}`}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={item.desc}
                    />
                  </ListItem>
                );
              }
            )}
          </List>
        </div>
      </Popover>
    );
  }
}
