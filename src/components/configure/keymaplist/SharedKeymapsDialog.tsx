/* eslint-disable no-undef */
import React from 'react';
import './SharedKeymapsDialog.scss';
import {
  SharedKeymapsDialogActionsType,
  SharedKeymapsDialogStateType,
} from './SharedKeymapsDialog.container';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { SharedKeymapList } from './SharedKeymapList';
import { SavedKeymapData } from '../../../services/storage/Storage';

type OwnProps = {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onClickApplySavedKeymapData: (savedKeymapData: SavedKeymapData) => void;
};

type SharedKeymapsDialogProps = OwnProps &
  Partial<SharedKeymapsDialogActionsType> &
  Partial<SharedKeymapsDialogStateType>;

type OwnState = {
  activeTabIndex: number;
};
export default class SharedKeymapsDialog extends React.Component<
  SharedKeymapsDialogProps,
  OwnState
> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      activeTabIndex: 0,
    };
  }

  private onEnter() {
    this.setState({});
  }

  private onActiveTabIndexChange(
    event: React.ChangeEvent<{}>,
    newValue: number
  ) {
    this.setState({ activeTabIndex: newValue });
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        maxWidth={'md'}
        className="shared-keymaps-dialog"
        onEnter={this.onEnter.bind(this)}
      >
        <DialogTitle>
          Shared Keymaps
          <div className="close-dialog">
            <CloseIcon onClick={this.props.onClose} />
          </div>
        </DialogTitle>
        <DialogContent dividers className="shared-keymaps-dialog-content">
          <Tabs
            value={this.state.activeTabIndex}
            onChange={this.onActiveTabIndexChange.bind(this)}
            indicatorColor="primary"
            textColor="primary"
            aria-label="shared-keymaps"
          >
            <Tab label="Shared Keymaps" />
            <Tab label="Applied History" />
          </Tabs>
          {this.state.activeTabIndex === 0 ? (
            <React.Fragment>
              <div className="shared-keymaps-dialog-filter-row">
                <TextField
                  label="Filter"
                  // value={this.props.nameFilter}
                  // onChange={(e) => this.props.updateNameFilter!(e.target.value)}
                />
              </div>
              <SharedKeymapList
                sharedKeymaps={this.props.sharedKeymaps!}
                onClickApplySavedKeymapData={
                  this.props.onClickApplySavedKeymapData
                }
                showMore={false}
              />
            </React.Fragment>
          ) : (
            <></>
          )}
        </DialogContent>
      </Dialog>
    );
  }
}
