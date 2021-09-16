import React from 'react';
import './CatalogSearchDialog.scss';
import { Dialog, IconButton } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import CatalogSearchForm from './CatalogSearchForm.container';

type CatalogSearchDialogState = {};
type CatalogSearchDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export default class CatalogSearchDialog extends React.Component<
  CatalogSearchDialogProps,
  CatalogSearchDialogState
> {
  constructor(
    props: CatalogSearchDialogProps | Readonly<CatalogSearchDialogProps>
  ) {
    super(props);
  }

  private onEnter() {}

  render() {
    return (
      <Dialog
        open={this.props.open}
        fullScreen={true}
        className="catalog-search-dialog"
        onEnter={this.onEnter.bind(this)}
      >
        <div className="catalog-search-dialog-header">
          <IconButton
            aria-label="search"
            onClick={this.props.onClose.bind(this)}
          >
            <CloseRoundedIcon />
          </IconButton>
        </div>
        <CatalogSearchForm onSubmit={this.props.onSubmit.bind(this)} />
      </Dialog>
    );
  }
}
