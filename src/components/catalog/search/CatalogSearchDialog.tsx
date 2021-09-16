import React from 'react';
import './CatalogSearchDialog.scss';
import { Dialog, IconButton } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import CatalogSearchForm from './CatalogSearchForm.container';
import { IKeyboardFeatures } from '../../../store/state';

type CatalogSearchDialogState = {
  features: IKeyboardFeatures[];
  keyword: string;
};
type CatalogSearchDialogProps = {
  open: boolean;
  features: IKeyboardFeatures[];
  keyword: string;
  onClose: (
    // eslint-disable-next-line no-unused-vars
    originalKeyword: string,
    // eslint-disable-next-line no-unused-vars
    originalFeatures: IKeyboardFeatures[]
  ) => void;
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

  private onClickClose() {
    const originalKeyword = this.state.keyword;
    const originalFeatures = this.state.features;
    this.props.onClose!(originalKeyword, originalFeatures);
  }

  private onEnter() {
    this.setState({
      keyword: this.props.keyword,
      features: this.props.features,
    });
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        fullScreen={true}
        onEnter={this.onEnter.bind(this)}
        className="catalog-search-dialog"
      >
        <div className="catalog-search-dialog-header">
          <IconButton
            aria-label="search"
            onClick={this.onClickClose.bind(this)}
          >
            <CloseRoundedIcon />
          </IconButton>
        </div>
        <CatalogSearchForm
          onSubmit={this.props.onSubmit.bind(this)}
          keyword={this.props.keyword}
          features={this.props.features}
        />
      </Dialog>
    );
  }
}
