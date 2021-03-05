/* eslint-disable no-undef */
import React from 'react';
import './InfoDialog.scss';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  PaperProps,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Draggable from 'react-draggable';
import {
  InfoDialogActionsType,
  InfoDialogStateType,
} from './InfoDialog.container';
import { hexadecimal } from '../../../utils/StringUtils';

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScZPhiXEG2VETCGZ2dYp4YbzzMlU62Crh1cNxPpFBkN4cCPbA/viewform?usp=pp_url&entry.661359702=${keyboard_name}&entry.135453541=${keyboard_id}';

type OwnState = {
  deviceInfo: {
    productName: string;
    vendorId: number;
    productId: number;
  };
  keyboardDef: {
    name: string;
    vendorId: string;
    productId: string;
    matrix: {
      rows: number;
      cols: number;
    };
  };
};

type OwnProps = {
  open: boolean;
  onClose: () => void;
};

type InfoStateProps = OwnProps &
  Partial<InfoDialogActionsType> &
  Partial<InfoDialogStateType>;

export default class InfoDialog extends React.Component<
  InfoStateProps,
  OwnState
> {
  private googleFormUrl: string = '';
  private githubUrl: string = '';
  private githubDisplayName: string = '';
  constructor(props: InfoStateProps | Readonly<InfoStateProps>) {
    super(props);
    this.state = {
      deviceInfo: {
        productName: '',
        vendorId: NaN,
        productId: NaN,
      },
      keyboardDef: {
        name: '',
        vendorId: '',
        productId: '',
        matrix: {
          rows: NaN,
          cols: NaN,
        },
      },
    };
  }

  private onEnter() {
    if (this.props.keyboardDefinitionDocument) {
      this.googleFormUrl = GOOGLE_FORM_URL.replace(
        '${keyboard_name}',
        this.props.keyboardDefinitionDocument.name
      ).replace('${keyboard_id}', this.props.keyboardDefinitionDocument.id);

      this.githubUrl = this.props.keyboardDefinitionDocument.githubUrl;
      this.githubDisplayName = this.props.keyboardDefinitionDocument.githubDisplayName;
    }

    const deviceInfo = this.props.keyboard!.getInformation();
    const keyboardDef = this.props.keyboardDefinition!;
    this.setState({ deviceInfo, keyboardDef });
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        maxWidth={'sm'}
        PaperComponent={PaperComponent}
        className="info-dialog"
        onEnter={() => {
          this.onEnter();
        }}
      >
        <DialogTitle id="info-dialog-title" style={{ cursor: 'move' }}>
          Keyboard Info
          <div className="close-dialog">
            <CloseIcon onClick={this.props.onClose} />
          </div>
        </DialogTitle>
        <DialogContent dividers className="info-dialog-content">
          <Grid container spacing={1}>
            <Grid item xs={12} className="option-info-label">
              <h4>CONNECTED DEVICE</h4>
            </Grid>
            <InfoRow
              label="Product Name"
              value={this.state.deviceInfo.productName}
            />
            <InfoRow
              label="Vendor ID"
              value={hexadecimal(this.state.deviceInfo.vendorId, 4)}
            />
            <InfoRow
              label="Product ID"
              value={hexadecimal(this.state.deviceInfo.productId, 4)}
            />
            <Grid item xs={12} className="option-info-label">
              <h4>KEYBOARD DEFINITION</h4>
            </Grid>
            <InfoRow label="Name" value={this.state.keyboardDef.name} />
            <InfoRow
              label="Vendor ID"
              value={this.state.keyboardDef.vendorId}
            />
            <InfoRow
              label="Product ID"
              value={this.state.keyboardDef.productId}
            />
            <InfoRow
              label="Col x Row"
              value={`${this.state.keyboardDef.matrix.cols} x ${this.state.keyboardDef.matrix.rows}`}
            />
            <InfoRow
              label="Registered by"
              value={
                <a href={this.githubUrl} target="_blank" rel="noreferrer">
                  {this.githubDisplayName}
                </a>
              }
            />
            <Grid item xs={12} className="option-info-label">
              <div className="option-warning-message">
                If you think that the person above does not have any rights for
                the keyboard and the keyboard definition (in the case of the
                person is not original keyboard designer or etc.), please report
                it to the Remap team from{' '}
                <a href={this.googleFormUrl} target="_blank" rel="noreferrer">
                  this form
                </a>
                .
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}

function InfoRow(props: { label: string; value: string | React.ReactNode }) {
  return (
    <React.Fragment>
      <Grid item xs={6} className="option-info-label">
        {props.label}
      </Grid>
      <Grid item xs={6} className="option-info-value">
        {props.value}
      </Grid>
    </React.Fragment>
  );
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#info-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
