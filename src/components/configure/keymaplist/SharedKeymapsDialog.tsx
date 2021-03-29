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
  filterKeyword: string;
};
export default class SharedKeymapsDialog extends React.Component<
  SharedKeymapsDialogProps,
  OwnState
> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      activeTabIndex: 0,
      filterKeyword: '',
    };
  }

  private onEnter() {
    this.setState({
      filterKeyword: '',
      activeTabIndex: 0,
    });
  }

  private onActiveTabIndexChange(
    event: React.ChangeEvent<{}>,
    newValue: number
  ) {
    this.setState({ activeTabIndex: newValue });
  }

  private onFilterChanged(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      filterKeyword: event.target.value,
    });
  }

  render() {
    let sharedKeymaps: SavedKeymapData[];
    if (this.props.sharedKeymaps) {
      sharedKeymaps = this.state.filterKeyword
        ? this.props.sharedKeymaps!.filter((sharedKeymap) => {
            return (
              sharedKeymap.title
                .toLowerCase()
                .includes(this.state.filterKeyword.toLowerCase()) ||
              sharedKeymap.desc
                .toLowerCase()
                .includes(this.state.filterKeyword.toLowerCase()) ||
              sharedKeymap.author_display_name
                ?.toLowerCase()
                .includes(this.state.filterKeyword.toLowerCase())
            );
          })
        : this.props.sharedKeymaps;
    } else {
      sharedKeymaps = [];
    }
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
            orientation="vertical"
          >
            <Tab label="Shared Keymaps" />
            <Tab label="Applied History" />
          </Tabs>
          <div className="shared-keymaps-dialog-content-body">
            {this.state.activeTabIndex === 0 ? (
              <React.Fragment>
                <div className="shared-keymaps-dialog-filter-row">
                  <TextField
                    label="Filter"
                    size="small"
                    value={this.state.filterKeyword}
                    onChange={this.onFilterChanged.bind(this)}
                  />
                </div>
                <SharedKeymapList
                  sharedKeymaps={sharedKeymaps}
                  onClickApplySavedKeymapData={
                    this.props.onClickApplySavedKeymapData
                  }
                  showMore={false}
                />
              </React.Fragment>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
