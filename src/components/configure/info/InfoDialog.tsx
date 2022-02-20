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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Draggable from 'react-draggable';
import {
  InfoDialogActionsType,
  InfoDialogStateType,
} from './InfoDialog.container';
import { hexadecimal } from '../../../utils/StringUtils';
import {
  IKeyboardDefinitionDocument,
  IOrganization,
  KeyboardDefinitionStatus,
} from '../../../services/storage/Storage';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import firebase from 'firebase/app';

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
      this.githubDisplayName =
        this.props.keyboardDefinitionDocument.githubDisplayName;
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
        TransitionProps={{
          onEnter: () => {
            this.onEnter();
          },
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
            <KeyboardDefinitionSection
              keyboardDefinitionDocument={this.props.keyboardDefinitionDocument}
              keyboardDefinition={this.props.keyboardDefinition}
              googleFormUrl={this.googleFormUrl}
              authenticatedUser={
                this.props.auth
                  ? this.props.auth.getCurrentAuthenticatedUser()
                  : undefined
              }
              organization={this.props.organization}
            />
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}

type IKeyboardDefinitionSectionProps = {
  keyboardDefinitionDocument: IKeyboardDefinitionDocument | null | undefined;
  keyboardDefinition: KeyboardDefinitionSchema | null | undefined;
  googleFormUrl: string;
  authenticatedUser: firebase.User | undefined;
  organization: IOrganization | null | undefined;
};

function KeyboardDefinitionSection(props: IKeyboardDefinitionSectionProps) {
  if (props.keyboardDefinition) {
    const designerName =
      !props.keyboardDefinitionDocument?.authorType ||
      props.keyboardDefinitionDocument.authorType === 'individual'
        ? props.keyboardDefinitionDocument?.githubDisplayName
        : props.organization?.name;
    const designerWebsite =
      !props.keyboardDefinitionDocument?.authorType ||
      props.keyboardDefinitionDocument.authorType === 'individual'
        ? props.keyboardDefinitionDocument?.githubUrl
        : props.organization?.website_url;
    return (
      <React.Fragment>
        <Grid item xs={12} className="option-info-label">
          <h4>KEYBOARD DEFINITION</h4>
        </Grid>
        <InfoRow label="Name" value={props.keyboardDefinition.name} />
        <InfoRow label="Vendor ID" value={props.keyboardDefinition.vendorId} />
        <InfoRow
          label="Product ID"
          value={props.keyboardDefinition.productId}
        />
        <InfoRow
          label="Col x Row"
          value={`${props.keyboardDefinition.matrix.cols} x ${props.keyboardDefinition.matrix.rows}`}
        />
        {props.keyboardDefinitionDocument ? (
          <React.Fragment>
            <InfoRow
              label="Registered by"
              value={
                <a href={designerWebsite} target="_blank" rel="noreferrer">
                  {designerName}
                </a>
              }
            />
            <InfoRow
              label="Status"
              value={props.keyboardDefinitionDocument.status}
            />
            {props.keyboardDefinitionDocument.authorUid ===
            props.authenticatedUser?.uid ? (
              [
                KeyboardDefinitionStatus.draft,
                KeyboardDefinitionStatus.rejected,
              ].includes(props.keyboardDefinitionDocument.status) ? (
                <Grid item xs={12} className="option-info-label">
                  <div className="info-dialog-warning-message">
                    The keyboard definition is currently applied for only you.
                    Please submit a review request of this keyboard definition
                    for all users from{' '}
                    <a
                      href={`/keyboards/${props.keyboardDefinitionDocument.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      here
                    </a>
                    .
                  </div>
                </Grid>
              ) : null
            ) : (
              <Grid item xs={12} className="option-info-label">
                <div className="info-dialog-information-message">
                  If you think that the person above does not have any rights
                  for the keyboard and the keyboard definition (in the case of
                  the person is not original keyboard designer or etc.), please
                  report it to the Remap team from{' '}
                  <a
                    href={props.googleFormUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    this form
                  </a>
                  .
                </div>
              </Grid>
            )}
          </React.Fragment>
        ) : (
          <Grid item xs={12} className="option-info-label">
            <div className="info-dialog-information-message">
              Are you a designer of this keyboard? If yes, please register your
              keyboard to Remap from{' '}
              <a href={'/keyboards'} target="_blank" rel="noreferrer">
                here
              </a>
              .
            </div>
          </Grid>
        )}
      </React.Fragment>
    );
  } else {
    return null;
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
