/* eslint-disable no-undef */
import React from 'react';
import './EditDefinition.scss';
import {
  EditKeyboardActionsType,
  EditKeyboardStateType,
} from './EditDefinition.container';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from '@material-ui/core';
import {
  IKeyboardDefinitionStatus,
  KeyboardDefinitionStatus,
} from '../../../services/storage/Storage';
import { KeyboardDefinitionFormPart } from '../../common/keyboarddefformpart/KeyboardDefinitionFormPart';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { Alert } from '@material-ui/lab';
import moment from 'moment-timezone';
import { ArrowDownward } from '@material-ui/icons';

type EditKeyboardState = {
  openConfirmDialog: boolean;
  isSaveAsDraft: boolean;
};
type OwnProps = {};
type EditKeyboardProps = OwnProps &
  Partial<EditKeyboardActionsType> &
  Partial<EditKeyboardStateType>;

const statusSteps: IKeyboardDefinitionStatus[] = [
  KeyboardDefinitionStatus.draft,
  KeyboardDefinitionStatus.in_review,
  KeyboardDefinitionStatus.approved,
];

export default class EditDefinition extends React.Component<
  EditKeyboardProps,
  EditKeyboardState
> {
  private refInputProductName: React.RefObject<HTMLInputElement>;
  constructor(props: EditKeyboardProps | Readonly<EditKeyboardProps>) {
    super(props);
    this.state = {
      openConfirmDialog: false,
      isSaveAsDraft: true,
    };
    this.refInputProductName = React.createRef<HTMLInputElement>();
  }

  private onLoadFile(
    keyboardDefinition: KeyboardDefinitionSchema,
    jsonFilename: string,
    jsonStr: string
  ) {
    this.props.updateJsonFilename!(jsonFilename);
    this.props.updateKeyboardDefinition!(keyboardDefinition);
    this.props.updateJsonString!(jsonStr);
    this.refInputProductName.current?.focus(); // TextField(Product Name) is the only editable field.
  }

  private isFilledInAllField(): boolean {
    if (this.isStatus(KeyboardDefinitionStatus.approved)) {
      return (
        !!this.props.productName &&
        !!this.props.keyboardDefinition &&
        !!this.props.jsonFilename
      );
    } else {
      return !!this.props.productName && !!this.props.keyboardDefinition;
    }
  }

  handleBackButtonClick = () => {
    location.href = '/keyboards';
  };

  handleSaveAsDraftButtonClick = () => {
    this.setState({
      openConfirmDialog: true,
      isSaveAsDraft: true,
    });
  };

  handleSubmitForReviewButtonClick = () => {
    this.setState({
      openConfirmDialog: true,
      isSaveAsDraft: false,
    });
  };

  handleUpdateJsonFileButtonClick = () => {
    this.setState({
      openConfirmDialog: true,
    });
  };

  handleConfirmYesClick = () => {
    this.setState({
      openConfirmDialog: false,
    });
    if (this.isStatus(KeyboardDefinitionStatus.approved)) {
      this.props.updateJsonFile!();
    } else if (this.state.isSaveAsDraft) {
      this.props.saveAsDraft!();
    } else {
      this.props.submitForReview!();
    }
  };

  handleConfirmNoClick = () => {
    this.setState({
      openConfirmDialog: false,
    });
  };

  isStatus(status: IKeyboardDefinitionStatus): boolean {
    return this.props.definitionDocument!.status === status;
  }

  renderJsonUploadForm() {
    if (this.isStatus(KeyboardDefinitionStatus.in_review)) {
      return null;
    } else if (this.isStatus(KeyboardDefinitionStatus.approved)) {
      return (
        <div className="edit-definition-upload-form">
          <KeyboardDefinitionFormPart
            messageHtml={`<span class="edit-definition-upload-msg">Please import your file (.json)</b>`}
            validateDeviceIds={true}
            deviceVendorId={this.props.definitionDocument!.vendorId}
            deviceProductId={this.props.definitionDocument!.productId}
            size="small"
            onLoadFile={(kd, name, jsonStr) => {
              this.onLoadFile(kd, name, jsonStr);
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="edit-definition-upload-form">
          <KeyboardDefinitionFormPart
            messageHtml={`<span class="edit-definition-upload-msg">Please import your file (.json)</b>`}
            validateDeviceIds={false}
            size="small"
            onLoadFile={(kd, name, jsonStr) => {
              this.onLoadFile(kd, name, jsonStr);
            }}
          />
        </div>
      );
    }
  }

  renderJsonFilenameRow() {
    if (this.isStatus(KeyboardDefinitionStatus.in_review)) {
      return null;
    } else {
      return (
        <div className="edit-definition-form-row">
          <TextField
            id="edit-definition-json-filename"
            label="JSON Filename"
            variant="outlined"
            value={this.props.jsonFilename}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
      );
    }
  }

  renderProductNameRow() {
    if (
      this.isStatus(KeyboardDefinitionStatus.in_review) ||
      this.isStatus(KeyboardDefinitionStatus.approved)
    ) {
      return (
        <div className="edit-definition-form-row">
          <TextField
            id="edit-definition-product-name"
            label="Product Name"
            variant="outlined"
            value={this.props.productName}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="edit-definition-form-row">
          <TextField
            inputRef={this.refInputProductName}
            id="edit-definition-product-name"
            label="Product Name"
            variant="outlined"
            required={true}
            value={this.props.productName}
            onChange={(event) =>
              this.props.updateProductName!(event.target.value)
            }
            onFocus={(event) => {
              event.target.select();
            }}
          />
        </div>
      );
    }
  }

  renderSaveAsDraftButton() {
    if (
      this.isStatus(KeyboardDefinitionStatus.draft) ||
      this.isStatus(KeyboardDefinitionStatus.rejected)
    ) {
      return (
        <Button
          color="primary"
          style={{ marginRight: '16px' }}
          onClick={this.handleSaveAsDraftButtonClick}
          disabled={!this.isFilledInAllField()}
        >
          Save as Draft
        </Button>
      );
    } else {
      return null;
    }
  }

  renderSubmitForReviewButton() {
    if (
      this.isStatus(KeyboardDefinitionStatus.draft) ||
      this.isStatus(KeyboardDefinitionStatus.rejected)
    ) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleSubmitForReviewButtonClick}
          disabled={!this.isFilledInAllField()}
        >
          Submit for Review
        </Button>
      );
    } else {
      return null;
    }
  }

  renderUpdateJsonButton() {
    if (this.isStatus(KeyboardDefinitionStatus.approved)) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleUpdateJsonFileButtonClick}
          disabled={!this.isFilledInAllField()}
        >
          Update JSON file
        </Button>
      );
    } else {
      return null;
    }
  }

  renderJsonDownloadButton() {
    if (this.props.keyboardDefinition) {
      const jsonUrl = URL.createObjectURL(
        new Blob([this.props.jsonStr!], { type: 'application/json' })
      );
      return (
        <Button
          color="primary"
          href={jsonUrl}
          download={this.props.keyboardDefinition.name}
        >
          <ArrowDownward />
          JSON
        </Button>
      );
    }
  }

  renderInReviewMessage() {
    if (this.isStatus(KeyboardDefinitionStatus.in_review)) {
      const receivedDate = moment(
        this.props.definitionDocument!.updatedAt
      ).format('YYYY-MM-DD HH:mm:ss');
      return (
        <div className="edit-definition-form-alert">
          <Alert severity="info">
            Thank you for registering your keyboard! We have received your
            request at {receivedDate}.
          </Alert>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    let activeStep;
    switch (this.props.definitionDocument!.status) {
      case KeyboardDefinitionStatus.draft:
      case KeyboardDefinitionStatus.rejected:
        activeStep = 0;
        break;
      case KeyboardDefinitionStatus.in_review:
        activeStep = 1;
        break;
      case KeyboardDefinitionStatus.approved:
        activeStep = 2;
        break;
      default:
        throw new Error(
          `Unknown status: ${this.props.definitionDocument?.status}`
        );
    }
    const completed = activeStep === 2;
    return (
      <React.Fragment>
        <div className="edit-definition-wrapper">
          <div className="edit-definition-card">
            <Card>
              <CardContent>
                <Button
                  style={{ marginRight: '16px' }}
                  onClick={this.handleBackButtonClick}
                >
                  &lt; Keyboard List
                </Button>
                <Stepper activeStep={activeStep}>
                  {statusSteps.map((label) => {
                    const stepProps = {
                      completed,
                    };
                    const labelProps = {};
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <div className="edit-definition-form-container">
                  {this.renderJsonUploadForm()}
                  <div className="edit-definition-form">
                    {this.renderInReviewMessage()}
                    {this.renderJsonFilenameRow()}
                    <div className="edit-definition-form-row">
                      <TextField
                        id="edit-definition-name"
                        label="Name"
                        variant="outlined"
                        value={this.props.keyboardDefinition?.name || ''}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </div>
                    <div className="edit-definition-form-row">
                      <TextField
                        id="edit-definition-vendor_id"
                        label="Vendor ID"
                        variant="outlined"
                        value={this.props.keyboardDefinition?.vendorId || ''}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </div>
                    <div className="edit-definition-form-row">
                      <TextField
                        id="edit-definition-product_id"
                        label="Product ID"
                        variant="outlined"
                        value={this.props.keyboardDefinition?.productId || ''}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </div>
                    {this.renderProductNameRow()}
                    <div className="edit-definition-form-buttons">
                      {this.renderJsonDownloadButton()}
                      {this.renderSaveAsDraftButton()}
                      {this.renderSubmitForReviewButton()}
                      {this.renderUpdateJsonButton()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Dialog
          open={this.state.openConfirmDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Keyboard Registration'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.isStatus(KeyboardDefinitionStatus.approved)
                ? 'Are you sure to update the JSON file?'
                : this.state.isSaveAsDraft
                ? 'Are you sure to save this new keyboard as draft?'
                : 'Are you sure to register and submit this new keyboard for review?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleConfirmNoClick}>
              No
            </Button>
            <Button
              color="primary"
              autoFocus
              onClick={this.handleConfirmYesClick}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}
