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
import { SavedKeymapData } from '../../../services/storage/Storage';
import { IKeymap } from '../../../services/hid/Hid';
import { KeycodeList } from '../../../services/hid/KeycodeList';
import AuthProviderDialog from '../auth/AuthProviderDialog.container';
import { sendEventToGoogleAnalytics } from '../../../utils/GoogleAnalytics';

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
  openKeymapSaveDialog: boolean;
  savedKeymapData: SavedKeymapData | null;
  openAuthProviderDialog: boolean;
  popoverPosition: PopoverPosition;
};

export default class KeymapListPopover extends React.Component<
  KeymapListPopoverProps,
  OwnState
> {
  private popoverRef: React.RefObject<HTMLDivElement>;
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      openKeymapSaveDialog: false,
      savedKeymapData: null,
      openAuthProviderDialog: false,
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

  private onClickApplySavedKeymapData(savedKeymapData: SavedKeymapData) {
    sendEventToGoogleAnalytics('configure/restore_keymap', {
      vendor_id: savedKeymapData.vendor_id,
      product_id: savedKeymapData.product_id,
      product_name: savedKeymapData.product_name,
    });

    const labelLang = savedKeymapData.label_lang;
    const layoutOptions = savedKeymapData.layout_options;
    let keycodes: { [pos: string]: IKeymap }[] = [];
    const savedKeycodes: { [pos: string]: number }[] = savedKeymapData.keycodes;
    const keymaps: { [pos: string]: IKeymap }[] = this.props.keymaps!;
    for (let i = 0; i < keymaps.length; i++) {
      const keymap = keymaps[i];
      const savedCode = savedKeycodes[i];
      const changes: { [pos: string]: IKeymap } = {};
      Object.keys(keymap).forEach((pos) => {
        if (keymap[pos].code != savedCode[pos]) {
          changes[pos] = KeycodeList.getKeymap(savedCode[pos], labelLang);
        }
      });
      keycodes.push(changes);
    }

    this.props.applySavedKeymapData!(keycodes, layoutOptions, labelLang);
  }

  private onClickOpenKeymapSaveDialog(savedKeymapData: SavedKeymapData | null) {
    this.setState({ openKeymapSaveDialog: true, savedKeymapData });
  }

  private onCloseKeymapSaveDialog() {
    this.setState({ openKeymapSaveDialog: false, savedKeymapData: null });
  }

  private onClickSignIn() {
    this.setState({ openAuthProviderDialog: true });
  }

  private onCloseAuthProviderDialog() {
    this.setState({ openAuthProviderDialog: false });
  }

  render() {
    if (!this.props.position) {
      return <></>;
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
        className="keymaplist-root"
      >
        <div className="keymaplist-popover" ref={this.popoverRef}>
          {this.props.signedIn ? (
            <>
              <KeymapList
                savedKeymaps={this.props.savedKeymaps!}
                onClickOpenKeymapSaveDialog={this.onClickOpenKeymapSaveDialog.bind(
                  this
                )}
                onClickApplySavedKeymapData={this.onClickApplySavedKeymapData.bind(
                  this
                )}
              />
              <KeymapSaveDialog
                open={this.state.openKeymapSaveDialog}
                savedKeymapData={this.state.savedKeymapData}
                authorUid={this.props.auth!.getCurrentAuthenticatedUser().uid}
                onClose={() => {
                  this.onCloseKeymapSaveDialog();
                }}
              />
            </>
          ) : (
            <RequestSignIn onClickSignIn={this.onClickSignIn.bind(this)} />
          )}
        </div>

        <AuthProviderDialog
          open={this.state.openAuthProviderDialog}
          onClose={this.onCloseAuthProviderDialog.bind(this)}
        />
      </Popover>
    );
  }
}

type KeymapListProps = {
  savedKeymaps: SavedKeymapData[];
  onClickOpenKeymapSaveDialog: (
    // eslint-disable-next-line no-unused-vars
    savedKeymapData: SavedKeymapData | null
  ) => void;
  // eslint-disable-next-line no-unused-vars
  onClickApplySavedKeymapData: (savedKeymapData: SavedKeymapData) => void;
};

function KeymapList(props: KeymapListProps) {
  return (
    <>
      <div className="keymaplist keymaplist-header">
        <div>
          <h2>Keymaps</h2>
        </div>
        <div className="keymaplist-header-buttons">
          <Button
            color="primary"
            onClick={() => {
              props.onClickOpenKeymapSaveDialog(null);
            }}
          >
            SAVE CURRENT KEYMAP
          </Button>
        </div>
      </div>
      <div className="keymaplist keymaplist-content">
        <List dense={true}>
          {props.savedKeymaps.map((item, index) => {
            return (
              <ListItem
                key={`keymaplist-keymap${index}`}
                button
                onClick={() => {
                  props.onClickApplySavedKeymapData(item);
                }}
              >
                <ListItemText primary={item.title} secondary={item.desc} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      props.onClickOpenKeymapSaveDialog(item);
                    }}
                  >
                    <EditRoundedIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
        {props.savedKeymaps!.length === 0 && (
          <div className="no-saved-keymap">
            You can save the current keymap by clicking the top-right button.
            You can restore your saved keymap every time.
            <div className="keymaplist-warning">
              * Please note that the change candidates will discard when you
              save/restore the keymap.
            </div>
          </div>
        )}
      </div>
    </>
  );
}

type RequestSignInType = {
  onClickSignIn: () => void;
};
function RequestSignIn(props: RequestSignInType) {
  return (
    <div className="request-signin">
      <div>
        You can save/restore the current keymap. Using this feature, you can
        manage many kinds of keymaps.
      </div>
      <div className="request-signin-message">
        *You need to sign in to use this feature.
      </div>
      <div className="request-signin-actions">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            props.onClickSignIn();
          }}
        >
          SignIn
        </Button>
      </div>
    </div>
  );
}
