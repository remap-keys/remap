import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './StoreAddDialog.scss';
import { t } from 'i18next';

type StoreAddDialogProps = {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onAdd: (name: string, url: string) => void;
  onClose: () => void;
};

type OwnState = {
  name: string;
  url: string;
};

export default class StoreAddDialog extends React.Component<
  StoreAddDialogProps,
  OwnState
> {
  constructor(props: StoreAddDialogProps | Readonly<StoreAddDialogProps>) {
    super(props);
    this.state = {
      name: '',
      url: '',
    };
  }

  private onClickAddButton() {
    this.props.onAdd(this.state.name, this.state.url);
  }

  // eslint-disable-next-line no-unused-vars
  private onClickClose(_event: React.MouseEvent) {
    this.props.onClose();
  }

  private onChangeName(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      name: event.target.value,
    });
  }

  private onChangeUrl(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      url: event.target.value,
    });
  }

  render() {
    return (
      <Dialog open={this.props.open} maxWidth={'md'}>
        <DialogTitle>
          {t('Add Store')}
          <div
            className="store-add-dialog-close-dialog"
            onClick={this.onClickClose.bind(this)}
          >
            <CloseIcon />
          </div>
        </DialogTitle>
        <DialogContent dividers className="store-add-dialog-content">
          <div className="store-add-dialog-field">
            <FormControl fullWidth={true}>
              <TextField
                required
                autoFocus
                label={t('Name')}
                onChange={this.onChangeName.bind(this)}
              />
            </FormControl>
          </div>
          <div className="store-add-dialog-field">
            <FormControl fullWidth={true}>
              <TextField
                required
                label="URL"
                onChange={this.onChangeUrl.bind(this)}
              />
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            disabled={!(this.state.name && this.state.url)}
            onClick={this.onClickAddButton.bind(this)}
          >
            {t('Save')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
