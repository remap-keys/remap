/* eslint-disable no-undef */
import React from 'react';
import './KeymapListPopover.scss';
import {
  KeymapListPopoverActionsType,
  KeymapListPopoverStateType,
} from './KeymapListPopover.container';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Popover,
} from '@material-ui/core';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import KeymapSaveDialog from './KeymapSaveDialog.container';

type PopoverPosition = {
  left: number;
  top: number;
};

type OwnProps = {
  open: boolean;
  position: PopoverPosition | null;
  onClose: () => void;
};

type KeymapListPopoverProps = OwnProps &
  Partial<KeymapListPopoverActionsType> &
  Partial<KeymapListPopoverStateType>;

type OwnState = {
  keymapSaveDialog: {
    edit: boolean;
    id?: string;
    title?: string;
    desc?: string;
  } | null;
};

export default class KeymapListPopover extends React.Component<
  KeymapListPopoverProps,
  OwnState
> {
  private popoverRef: React.RefObject<HTMLDivElement>;
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      keymapSaveDialog: null,
    };
    this.popoverRef = React.createRef<HTMLDivElement>();
  }

  get position(): { left: number; top: number } {
    if (!this.props.position) {
      return {
        left: 0,
        top: 0,
      };
    }
    const { left, top } = this.props.position;
    const width = 360;
    const height = 400;

    const iconSize = 30;

    if (window.innerWidth < left + width + iconSize + 10) {
      const x = Math.min(left, left - (width - (window.innerWidth - left)));
      const y = top + iconSize + 10; // 10=margin
      return { left: x, top: y };
    } else {
      const x = left + iconSize + 10; // 10=margin
      const y = top - height / 2 + iconSize / 2;
      return { left: x, top: y };
    }
  }

  private onEnter() {}

  private onClickOpenKeymapSaveDialog(keymapSaveDialog: {
    edit: boolean;
    title?: string;
    desc?: string;
  }) {
    this.setState({ keymapSaveDialog });
  }

  private onCloseKeymapSaveDialog() {
    this.setState({ keymapSaveDialog: null });
  }

  render() {
    if (!this.props.position) {
      return <></>;
    }

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
        className="keymaplist-root"
      >
        <div className="keymaplist-popover" ref={this.popoverRef}>
          <div className="keymaplist keymaplist-header">
            <div>
              <h2>Keymaps</h2>
            </div>
            <div className="keymaplist-header-buttons">
              <Button
                color="primary"
                onClick={() => {
                  this.onClickOpenKeymapSaveDialog({ edit: false });
                }}
              >
                SAVE CURRENT KEYMAP
              </Button>
            </div>
          </div>
          <div className="keymaplist keymaplist-content">
            <List dense={true}>
              {keymaps.map((item, index) => {
                return (
                  <ListItem key={`keymaplist-keymap${index}`} button>
                    <ListItemText primary={item.title} secondary={item.desc} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => {
                          this.onClickOpenKeymapSaveDialog({
                            ...item,
                            edit: true,
                          });
                        }}
                      >
                        <EditRoundedIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </div>
        </div>
        <KeymapSaveDialog
          open={Boolean(this.state.keymapSaveDialog)}
          edit={this.state.keymapSaveDialog?.edit || false}
          id={this.state.keymapSaveDialog?.id}
          title={this.state.keymapSaveDialog?.title}
          desc={this.state.keymapSaveDialog?.desc}
          onClose={() => {
            this.onCloseKeymapSaveDialog();
          }}
          onSave={(store) => {
            console.log(store);
          }}
          onDelete={(id) => {
            console.log(id);
          }}
        />
      </Popover>
    );
  }
}

const keymaps: { id: string; title: string; desc: string }[] = [
  {
    id: '1',
    title: 'title1',
    desc: 'desc1',
  },
  {
    id: '2',
    title: 'title2',
    desc: 'desc2',
  },
  {
    id: '3',
    title: 'title3',
    desc: 'desc3',
  },
  {
    id: '4',
    title: 'title4',
    desc: 'desc4',
  },
];
