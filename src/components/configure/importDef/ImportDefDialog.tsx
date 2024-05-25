import React from 'react';
import Draggable from 'react-draggable';
import './ImportDefDialog.scss';
import {
  ConfigurationDialogActionsType,
  ConfigurationDialogStateType,
} from './ImportDefDialog.container';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Paper, { PaperProps } from '@mui/material/Paper';
import { Alert, AlertTitle } from '@mui/material';

import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { KeyboardDefinitionFormPart } from '../../common/keyboarddefformpart/KeyboardDefinitionFormPart';
import { sendEventToGoogleAnalytics } from '../../../utils/GoogleAnalytics';

type OwnProps = {
  open: boolean;
  onClose: () => void;
  vendorId: number;
  productId: number;
  productName: string;
};

type ConfigurationDialogProps = OwnProps &
  Partial<ConfigurationDialogActionsType> &
  Partial<ConfigurationDialogStateType>;

type OwnState = {
  keyboardDefinition: KeyboardDefinitionSchema | null;
  keyboardDefinitionFile: string | null;
};

export default class ConfigurationDialog extends React.Component<
  ConfigurationDialogProps,
  OwnState
> {
  constructor(
    props: ConfigurationDialogProps | Readonly<ConfigurationDialogProps>,
  ) {
    super(props);
    this.state = {
      keyboardDefinition: null,
      keyboardDefinitionFile: null,
    };
  }

  private clearKeyboardDefinition() {
    this.setState({
      keyboardDefinition: null,
      keyboardDefinitionFile: null,
    });
  }

  private onClickApplyKeyboardDefinition() {
    sendEventToGoogleAnalytics('configure/import_local_file', {
      vendor_id: this.state.keyboardDefinition!.vendorId,
      product_id: this.state.keyboardDefinition!.productId,
      product_name: this.state.keyboardDefinition!.name,
    });

    this.props.refreshKeyboardDefinition!(this.state.keyboardDefinition!);
    this.clearKeyboardDefinition();
  }

  // eslint-disable-next-line no-unused-vars
  private onLoadFile(
    keyboardDefinition: KeyboardDefinitionSchema,
    name: string,
  ) {
    this.setState({
      keyboardDefinition: keyboardDefinition,
      keyboardDefinitionFile: name,
    });
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        maxWidth={'md'}
        PaperComponent={PaperComponent}
        className="import-file-dialog"
      >
        <DialogTitle id="draggable-dialog-title" style={{ cursor: 'move' }}>
          Import Keyboard Definition File
          <div className="close-dialog">
            <CloseIcon onClick={this.props.onClose} />
          </div>
        </DialogTitle>
        <DialogContent dividers className="import-file-content">
          <KeyboardDefinitionFormPart
            messageHtml={`Please import <strong>${this.props.productName}</strong>'s definition file (<a href="https://caniusevia.com/docs/specification/" target="_blank" rel="noreferrer">.json</a>).`}
            validateDeviceIds={true}
            deviceVendorId={this.props.vendorId}
            deviceProductId={this.props.productId}
            onLoadFile={(kd, name) => {
              this.onLoadFile(kd, name);
            }}
            size="small"
            keyboardDefinitionDocument={this.props.keyboardDefinitionDocument}
            keyboardDefinitionSchema={this.props.keyboardDefinitionSchema}
          />

          {this.state.keyboardDefinition && (
            <Alert severity="success" className="import-success">
              <AlertTitle>{`Valid (${this.state.keyboardDefinitionFile})`}</AlertTitle>
              {`Will you apply the keyboard definition file?`}
              <div className="apply-definition">
                <Button
                  size="small"
                  variant="text"
                  color="primary"
                  disableElevation
                  onClick={this.clearKeyboardDefinition.bind(this)}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={this.onClickApplyKeyboardDefinition.bind(this)}
                >
                  Apply
                </Button>
              </div>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
