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
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from '@material-ui/core';
import {
  IKeyboardDefinitionDocument,
  IKeyboardDefinitionStatus,
  KeyboardDefinitionStatus,
} from '../../../services/storage/Storage';
import { KeyboardDefinitionFormPart } from '../../common/keyboarddefformpart/KeyboardDefinitionFormPart';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { Alert } from '@material-ui/lab';
import moment from 'moment-timezone';
import { MoreVert } from '@material-ui/icons';
import { AgreementCheckbox } from '../agreement/AgreementCheckbox';
import { FirmwareCodePlace, IFirmwareCodePlace } from '../../../store/state';
import {
  isForkedQmkFirmwareCode,
  isOtherFirmwareCode,
  isQmkFirmwareCode,
} from '../ValidationUtils';

type ConfirmDialogMode =
  | 'save_as_draft'
  | 'submit_for_review'
  | 'delete'
  | 'upload_json';

type EditKeyboardState = {
  openConfirmDialog: boolean;
  confirmDialogMode: ConfirmDialogMode | null;
  menuAnchorEl: any;
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

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScZPhiXEG2VETCGZ2dYp4YbzzMlU62Crh1cNxPpFBkN4cCPbA/viewform?usp=pp_url&entry.661359702=${keyboard_name}&entry.135453541=${keyboard_id}';

export default class EditDefinition extends React.Component<
  EditKeyboardProps,
  EditKeyboardState
> {
  private refInputProductName: React.RefObject<HTMLInputElement>;
  constructor(props: EditKeyboardProps | Readonly<EditKeyboardProps>) {
    super(props);
    this.state = {
      openConfirmDialog: false,
      confirmDialogMode: null,
      menuAnchorEl: null,
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

  private isFilledInAllFieldAndAgreed(): boolean {
    if (this.isStatus(KeyboardDefinitionStatus.approved)) {
      return (
        !!this.props.productName &&
        !!this.props.keyboardDefinition &&
        !!this.props.jsonFilename
      );
    } else {
      let isFilledEvidence: boolean = false;
      if (isQmkFirmwareCode(this.props.firmwareCodePlace)) {
        isFilledEvidence = !!this.props.qmkRepositoryFirstPullRequestUrl;
      } else if (isForkedQmkFirmwareCode(this.props.firmwareCodePlace)) {
        isFilledEvidence =
          !!this.props.forkedRepositoryUrl &&
          !!this.props.forkedRepositoryEvidence;
      } else if (isOtherFirmwareCode(this.props.firmwareCodePlace)) {
        isFilledEvidence =
          !!this.props.otherPlaceHowToGet &&
          !!this.props.otherPlaceSourceCodeEvidence &&
          !!this.props.otherPlacePublisherEvidence;
      }
      return (
        !!this.props.productName &&
        !!this.props.keyboardDefinition &&
        this.props.agreement! &&
        isFilledEvidence
      );
    }
  }

  handleBackButtonClick = () => {
    location.href = '/keyboards';
  };

  handleSaveAsDraftButtonClick = () => {
    this.setState({
      openConfirmDialog: true,
      confirmDialogMode: 'save_as_draft',
    });
  };

  handleSubmitForReviewButtonClick = () => {
    this.setState({
      openConfirmDialog: true,
      confirmDialogMode: 'submit_for_review',
    });
  };

  handleUpdateJsonFileButtonClick = () => {
    this.setState({
      openConfirmDialog: true,
      confirmDialogMode: 'upload_json',
    });
  };

  handleConfirmYesClick = () => {
    this.setState({
      openConfirmDialog: false,
    });
    if (this.state.confirmDialogMode === 'upload_json') {
      this.props.updateJsonFile!();
    } else if (this.state.confirmDialogMode === 'save_as_draft') {
      this.props.saveAsDraft!();
    } else if (this.state.confirmDialogMode === 'submit_for_review') {
      this.props.submitForReview!();
    } else if (this.state.confirmDialogMode === 'delete') {
      this.props.delete!();
    }
  };

  handleConfirmNoClick = () => {
    this.setState({
      openConfirmDialog: false,
    });
  };

  handleMenuIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      menuAnchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      menuAnchorEl: null,
    });
  };

  handleDownloadJsonMenuClick = () => {
    this.setState({
      menuAnchorEl: null,
    });
    const jsonUrl = URL.createObjectURL(
      new Blob([this.props.jsonStr!], { type: 'application/json' })
    );
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.download = `${this.props.definitionDocument!.name}.json`;
    a.href = jsonUrl;
    a.click();
    a.remove();
  };

  handleDeleteMenuClick = () => {
    this.setState({
      menuAnchorEl: null,
      openConfirmDialog: true,
      confirmDialogMode: 'delete',
    });
  };

  isStatus(status: IKeyboardDefinitionStatus): boolean {
    return this.props.definitionDocument!.status === status;
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
          <div className="edit-definition-container">
            <div className="edit-definition-card">
              <Card>
                <CardContent>
                  <div className="edit-keyboard-header">
                    <Button
                      style={{ marginRight: '16px' }}
                      onClick={this.handleBackButtonClick}
                    >
                      &lt; Keyboard List
                    </Button>
                    <MenuUI
                      definitionDocument={this.props.definitionDocument!}
                      keyboardDefinition={this.props.keyboardDefinition}
                      handleDeleteMenuClick={this.handleDeleteMenuClick}
                      handleMenuClose={this.handleMenuClose}
                      handleDownloadJsonMenuClick={
                        this.handleDownloadJsonMenuClick
                      }
                      handleMenuIconClick={this.handleMenuIconClick}
                      menuAnchorEl={this.state.menuAnchorEl}
                    />
                  </div>
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
                  <AlertMessage
                    definitionDocument={this.props.definitionDocument!}
                  />
                  <div className="edit-definition-form-container">
                    <JsonUploadForm
                      definitionDocument={this.props.definitionDocument!}
                      onLoadFile={this.onLoadFile.bind(this)}
                    />
                    <div className="edit-definition-form">
                      <JsonFilenameRow
                        definitionDocument={this.props.definitionDocument!}
                        jsonFilename={this.props.jsonFilename}
                      />
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
                      <ProductNameRow
                        definitionDocument={this.props.definitionDocument!}
                        productName={this.props.productName}
                        refInputProductName={this.refInputProductName}
                        updateProductName={this.props.updateProductName!}
                      />
                      <FirmwareCodePlaceField
                        definitionDocument={this.props.definitionDocument!}
                        firmwareCodePlace={this.props.firmwareCodePlace}
                        updateFirmwareCodePlace={
                          this.props.updateFirmwareCodePlace!
                        }
                      />
                      <EvidenceForQmkRepository
                        firmwareCodePlace={this.props.firmwareCodePlace}
                        definitionDocument={this.props.definitionDocument!}
                        qmkRepositoryFirstPullRequestUrl={
                          this.props.qmkRepositoryFirstPullRequestUrl
                        }
                        updateQmkRepositoryFirstPullRequestUrl={
                          this.props.updateQmkRepositoryFirstPullRequestUrl!
                        }
                      />
                      <EvidenceForForkedRepository
                        definitionDocument={this.props.definitionDocument!}
                        firmwareCodePlace={this.props.firmwareCodePlace}
                        forkedRepositoryUrl={this.props.forkedRepositoryUrl}
                        updateForkedRepositoryUrl={
                          this.props.updateForkedRepositoryUrl!
                        }
                        forkedRepositoryEvidence={
                          this.props.forkedRepositoryEvidence
                        }
                        updateForkedRepositoryEvidence={
                          this.props.updateForkedRepositoryEvidence!
                        }
                      />
                      <EvidenceForOtherPlace
                        definitionDocument={this.props.definitionDocument!}
                        firmwareCodePlace={this.props.firmwareCodePlace}
                        otherPlaceHowToGet={this.props.otherPlaceHowToGet}
                        updateOtherPlaceHowToGet={
                          this.props.updateOtherPlaceHowToGet!
                        }
                        otherPlaceSourceCodeEvidence={
                          this.props.otherPlaceSourceCodeEvidence
                        }
                        updateOtherPlaceSourceCodeEvidence={
                          this.props.updateOtherPlaceSourceCodeEvidence!
                        }
                        otherPlacePublisherEvidence={
                          this.props.otherPlacePublisherEvidence
                        }
                        updateOtherPlacePublisherEvidence={
                          this.props.updateOtherPlacePublisherEvidence!
                        }
                      />
                      <AgreementRow
                        definitionDocument={this.props.definitionDocument!}
                        agreement={this.props.agreement!}
                        updateAgreement={this.props.updateAgreement!}
                      />
                      <div className="edit-definition-form-buttons">
                        <SaveAsDraftButton
                          definitionDocument={this.props.definitionDocument!}
                          handleSaveAsDraftButtonClick={
                            this.handleSaveAsDraftButtonClick
                          }
                          isFilledInAllField={this.isFilledInAllField.bind(
                            this
                          )}
                        />
                        <SubmitForReviewButton
                          definitionDocument={this.props.definitionDocument!}
                          handleSubmitForReviewButtonClick={
                            this.handleSubmitForReviewButtonClick
                          }
                          isFilledInAllFieldAndAgreed={this.isFilledInAllFieldAndAgreed.bind(
                            this
                          )}
                        />
                        <UpdateJsonButton
                          definitionDocument={this.props.definitionDocument!}
                          handleUpdateJsonFileButtonClick={
                            this.handleUpdateJsonFileButtonClick
                          }
                          isFilledInAllField={this.isFilledInAllField.bind(
                            this
                          )}
                        />
                      </div>
                      <div className="edit-definition-form-notice">
                        <p>
                          * You can submit the JSON file written by you only. Do
                          NOT infringe of the right of person who created the
                          original JSON file. We check whether you are valid
                          author of the keyboard you request in our review
                          process, but notice that we can&quot;t insure the
                          validity completely.
                        </p>
                        <p>
                          * We check whether the keyboard you request has a
                          unique combination of the Vendor ID, Product ID and
                          Product Name in our review process.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
            <DialogContentText
              id="alert-dialog-description"
              color={
                this.state.confirmDialogMode === 'delete'
                  ? 'secondary'
                  : 'initial'
              }
            >
              {this.state.confirmDialogMode === 'upload_json'
                ? 'Are you sure to update the JSON file?'
                : this.state.confirmDialogMode === 'save_as_draft'
                ? 'Are you sure to save this new keyboard as draft?'
                : this.state.confirmDialogMode === 'submit_for_review'
                ? 'Are you sure to register and submit this new keyboard for review?'
                : this.state.confirmDialogMode === 'delete'
                ? 'Are you sure to delete?'
                : ''}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              autoFocus
              onClick={this.handleConfirmNoClick}
            >
              No
            </Button>
            <Button color="primary" onClick={this.handleConfirmYesClick}>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

type EvidenceForOtherPlaceProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  firmwareCodePlace?: IFirmwareCodePlace;
  otherPlaceHowToGet?: string;
  // eslint-disable-next-line no-unused-vars
  updateOtherPlaceHowToGet: (otherPlaceHowToGet: string) => void;
  otherPlaceSourceCodeEvidence?: string;
  updateOtherPlaceSourceCodeEvidence: (
    // eslint-disable-next-line no-unused-vars
    otherPlaceSourceCodeEvidence: string
  ) => void;
  otherPlacePublisherEvidence?: string;
  updateOtherPlacePublisherEvidence: (
    // eslint-disable-next-line no-unused-vars
    otherPlacePublisherEvidence: string
  ) => void;
};

function EvidenceForOtherPlace(props: EvidenceForOtherPlaceProps) {
  if (props.firmwareCodePlace === FirmwareCodePlace.other) {
    if (
      props.definitionDocument.status === KeyboardDefinitionStatus.draft ||
      props.definitionDocument.status === KeyboardDefinitionStatus.rejected
    ) {
      return (
        <React.Fragment>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-other-place-how-to-get"
              label="How to Get the Source Code"
              variant="outlined"
              multiline
              rows={4}
              helperText="Fill in how to get the source code of this keyboard's firmware."
              value={props.otherPlaceHowToGet || ''}
              onChange={(e) => props.updateOtherPlaceHowToGet(e.target.value)}
            />
          </div>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-other-place-source-code-evidence"
              label="Evidence Information for Source Code"
              variant="outlined"
              multiline
              rows={4}
              helperText="Fill in the information to evidence whether the source code is the original and authentic firmware. This information will be confirmed by reviewers."
              value={props.otherPlaceSourceCodeEvidence || ''}
              onChange={(e) =>
                props.updateOtherPlaceSourceCodeEvidence(e.target.value)
              }
            />
          </div>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-other-place-publisher-evidence"
              label="Evidence Information for Publisher"
              variant="outlined"
              multiline
              rows={4}
              helperText="Fill in the information to evidence whether you are the publisher of the source code of the keyboard's firmware. This information will be confirmed by reviewers."
              value={props.otherPlacePublisherEvidence || ''}
              onChange={(e) =>
                props.updateOtherPlacePublisherEvidence(e.target.value)
              }
            />
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-other-place-how-to-get"
              label="How to Get the Source Code"
              variant="outlined"
              multiline
              rows={4}
              value={props.otherPlaceHowToGet || ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-other-place-source-code-evidence"
              label="Evidence Information for Source Code"
              variant="outlined"
              multiline
              rows={4}
              value={props.otherPlaceSourceCodeEvidence || ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-other-place-publisher-evidence"
              label="Evidence Information for Publisher"
              variant="outlined"
              multiline
              rows={4}
              value={props.otherPlacePublisherEvidence || ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        </React.Fragment>
      );
    }
  } else {
    return null;
  }
}

type EvidenceForForkedRepositoryProps = {
  firmwareCodePlace?: IFirmwareCodePlace;
  definitionDocument: IKeyboardDefinitionDocument;
  forkedRepositoryUrl?: string;
  // eslint-disable-next-line no-unused-vars
  updateForkedRepositoryUrl: (forkedRepositoryUrl: string) => void;
  forkedRepositoryEvidence?: string;
  // eslint-disable-next-line no-unused-vars
  updateForkedRepositoryEvidence: (forkedRepositoryEvidence: string) => void;
};

function EvidenceForForkedRepository(props: EvidenceForForkedRepositoryProps) {
  if (props.firmwareCodePlace === FirmwareCodePlace.forked) {
    if (
      props.definitionDocument.status === KeyboardDefinitionStatus.draft ||
      props.definitionDocument.status === KeyboardDefinitionStatus.rejected
    ) {
      return (
        <React.Fragment>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-forked-repository-url"
              label="Forked Repository URL"
              variant="outlined"
              value={props.forkedRepositoryUrl || ''}
              onChange={(e) => props.updateForkedRepositoryUrl(e.target.value)}
            />
          </div>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-forked-repository-evidence"
              label="Evidence Information"
              variant="outlined"
              multiline
              rows={4}
              helperText="Fill in the information to evidence whether the forked repository is the original and authentic firmware. This information will be confirmed by reviewers."
              value={props.forkedRepositoryEvidence || ''}
              onChange={(e) =>
                props.updateForkedRepositoryEvidence(e.target.value)
              }
            />
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className="edit-definition-form-row">
            <TextField
              id="edit-definition-forked-repository-url"
              label="Forked Repository URL"
              variant="outlined"
              value={props.forkedRepositoryUrl || ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className="create-definition-form-row">
            <TextField
              id="create-definition-forked-repository-evidence"
              label="Evidence Information"
              variant="outlined"
              multiline
              rows={4}
              value={props.forkedRepositoryEvidence || ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        </React.Fragment>
      );
    }
  } else {
    return null;
  }
}

type EvidenceForQmkRepositoryProps = {
  firmwareCodePlace?: IFirmwareCodePlace;
  definitionDocument: IKeyboardDefinitionDocument;
  qmkRepositoryFirstPullRequestUrl?: string;
  updateQmkRepositoryFirstPullRequestUrl: (
    // eslint-disable-next-line no-unused-vars
    qmkRepositoryFirstPullRequestUrl: string
  ) => void;
};

function EvidenceForQmkRepository(props: EvidenceForQmkRepositoryProps) {
  if (props.firmwareCodePlace === FirmwareCodePlace.qmk) {
    if (
      props.definitionDocument.status === KeyboardDefinitionStatus.draft ||
      props.definitionDocument.status === KeyboardDefinitionStatus.rejected
    ) {
      return (
        <div className="edit-definition-form-row">
          <TextField
            id="edit-definition-qmk-repository-pull-request-url"
            label="1st Pull Request URL"
            variant="outlined"
            helperText="Fill in the URL of 1st Pull Request to the QMK Firmware repository which you submitted for this keyboard. This information will be confirmed by reviewers."
            value={props.qmkRepositoryFirstPullRequestUrl || ''}
            onChange={(e) =>
              props.updateQmkRepositoryFirstPullRequestUrl!(e.target.value)
            }
          />
        </div>
      );
    } else {
      return (
        <div className="edit-definition-form-row">
          <TextField
            id="edit-definition-qmk-repository-pull-request-url"
            label="1st Pull Request URL"
            variant="outlined"
            value={props.qmkRepositoryFirstPullRequestUrl || ''}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
      );
    }
  } else {
    return null;
  }
}

type FirmwareCodePlaceFieldProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  firmwareCodePlace?: IFirmwareCodePlace;
  // eslint-disable-next-line no-unused-vars
  updateFirmwareCodePlace: (firmwareCodePlace: IFirmwareCodePlace) => void;
};

function FirmwareCodePlaceField(props: FirmwareCodePlaceFieldProps) {
  if (
    props.definitionDocument.status === KeyboardDefinitionStatus.draft ||
    props.definitionDocument.status === KeyboardDefinitionStatus.rejected
  ) {
    return (
      <div className="edit-definition-form-row">
        <FormControl>
          <InputLabel id="edit-definition-firmware-code-place">
            Where is the source code of this keyboard&apos;s firmware?
          </InputLabel>
          <Select
            labelId="edit-definition-firmware-code-place"
            value={props.firmwareCodePlace}
            onChange={(e) =>
              props.updateFirmwareCodePlace(
                e.target.value as IFirmwareCodePlace
              )
            }
          >
            <MenuItem value={FirmwareCodePlace.qmk}>
              GitHub: qmk/qmk_firmware
            </MenuItem>
            <MenuItem value={FirmwareCodePlace.forked}>
              GitHub: Your forked repository from qmk/qmk_firmware
            </MenuItem>
            <MenuItem value={FirmwareCodePlace.other}>Other</MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  } else {
    const value =
      props.firmwareCodePlace === FirmwareCodePlace.qmk
        ? 'GitHub: qmk/qmk_firmware'
        : props.firmwareCodePlace === FirmwareCodePlace.forked
        ? 'GitHub: Your forked repository from qmk/qmk_firmware'
        : props.firmwareCodePlace === FirmwareCodePlace.other
        ? 'Other'
        : 'Unknown';
    return (
      <div className="edit-definition-form-row">
        <TextField
          id="edit-definition-firmware-code-place"
          label="Where is the source code of this keyboard's firmware?"
          variant="outlined"
          value={value}
          InputProps={{
            readOnly: true,
          }}
        />
      </div>
    );
  }
}

type MenuUIProps = {
  keyboardDefinition: KeyboardDefinitionSchema | null | undefined;
  definitionDocument: IKeyboardDefinitionDocument;
  handleDownloadJsonMenuClick: () => void;
  handleDeleteMenuClick: () => void;
  // eslint-disable-next-line no-unused-vars
  handleMenuIconClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleMenuClose: () => void;
  menuAnchorEl: any;
};

function MenuUI(props: MenuUIProps) {
  const menuItems = [];
  if (props.keyboardDefinition) {
    menuItems.push(
      <MenuItem
        key="1"
        onClick={props.handleDownloadJsonMenuClick}
        button={true}
      >
        Download JSON
      </MenuItem>
    );
  }
  if (props.definitionDocument.status !== KeyboardDefinitionStatus.in_review) {
    menuItems.push(
      <MenuItem key="2" onClick={props.handleDeleteMenuClick} button={true}>
        Delete
      </MenuItem>
    );
  }
  if (menuItems.length > 0) {
    return (
      <React.Fragment>
        <IconButton
          aria-owns={props.menuAnchorEl ? 'edit-definition-menu' : undefined}
          onClick={props.handleMenuIconClick}
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="edit-definition-menu"
          anchorEl={props.menuAnchorEl}
          open={Boolean(props.menuAnchorEl)}
          onClose={props.handleMenuClose}
        >
          {menuItems}
        </Menu>
      </React.Fragment>
    );
  } else {
    return null;
  }
}

type AlertMessageProps = {
  definitionDocument: IKeyboardDefinitionDocument;
};

function AlertMessage(props: AlertMessageProps) {
  const updatedAt = moment(props.definitionDocument.updatedAt).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  if (props.definitionDocument.status === KeyboardDefinitionStatus.in_review) {
    return (
      <div className="edit-definition-alert">
        <Alert severity="info">
          Thank you for registering your keyboard! We have received your request
          at {updatedAt}.
        </Alert>
      </div>
    );
  } else if (
    props.definitionDocument.status === KeyboardDefinitionStatus.rejected
  ) {
    const googleFormUrl = GOOGLE_FORM_URL.replace(
      '${keyboard_name}',
      props.definitionDocument!.name
    ).replace('${keyboard_id}', props.definitionDocument!.id);
    return (
      <div className="edit-definition-alert">
        <Alert severity="error">
          Your request was rejected at {updatedAt}. Reason:{' '}
          {props.definitionDocument!.rejectReason}
          <br />
          If the review request submitted by you was rejected by the reason that
          the same keyboard definition has already been registered by the
          incorrect applicant, please report it from{' '}
          <a href={googleFormUrl} target="_blank" rel="noreferrer">
            this form
          </a>
          .
        </Alert>
      </div>
    );
  } else {
    return null;
  }
}

type UpdateJsonButtonProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  handleUpdateJsonFileButtonClick: () => void;
  isFilledInAllField: () => boolean;
};

function UpdateJsonButton(props: UpdateJsonButtonProps) {
  if (props.definitionDocument.status === KeyboardDefinitionStatus.approved) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={props.handleUpdateJsonFileButtonClick}
        disabled={!props.isFilledInAllField()}
      >
        Update JSON file
      </Button>
    );
  } else {
    return null;
  }
}

type SubmitForReviewButtonProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  handleSubmitForReviewButtonClick: () => void;
  isFilledInAllFieldAndAgreed: () => boolean;
};

function SubmitForReviewButton(props: SubmitForReviewButtonProps) {
  if (
    props.definitionDocument.status === KeyboardDefinitionStatus.draft ||
    props.definitionDocument.status === KeyboardDefinitionStatus.rejected
  ) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={props.handleSubmitForReviewButtonClick}
        disabled={!props.isFilledInAllFieldAndAgreed()}
      >
        Submit for Review
      </Button>
    );
  } else {
    return null;
  }
}

type SaveAsDraftButtonProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  handleSaveAsDraftButtonClick: () => void;
  isFilledInAllField: () => boolean;
};

function SaveAsDraftButton(props: SaveAsDraftButtonProps) {
  if (
    props.definitionDocument.status === KeyboardDefinitionStatus.draft ||
    props.definitionDocument.status === KeyboardDefinitionStatus.rejected
  ) {
    return (
      <Button
        color="primary"
        style={{ marginRight: '16px' }}
        onClick={props.handleSaveAsDraftButtonClick}
        disabled={!props.isFilledInAllField}
      >
        Save as Draft
      </Button>
    );
  } else {
    return null;
  }
}

type ProductNameRowProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  productName?: string;
  refInputProductName: any;
  // eslint-disable-next-line no-unused-vars
  updateProductName: (productName: string) => void;
};

function ProductNameRow(props: ProductNameRowProps) {
  if (
    props.definitionDocument.status === KeyboardDefinitionStatus.in_review ||
    props.definitionDocument.status === KeyboardDefinitionStatus.approved
  ) {
    return (
      <div className="edit-definition-form-row">
        <TextField
          id="edit-definition-product-name"
          label="Product Name"
          helperText="This is a Product Name specified by `#define PRODUCT [Product Name]` in the config.h file."
          variant="outlined"
          value={props.productName}
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
          inputRef={props.refInputProductName}
          id="edit-definition-product-name"
          label="Product Name"
          helperText="This is a Product Name specified by `#define PRODUCT [Product Name]` in the config.h file."
          variant="outlined"
          required={true}
          value={props.productName}
          onChange={(event) => props.updateProductName(event.target.value)}
          onFocus={(event) => {
            event.target.select();
          }}
        />
      </div>
    );
  }
}

type AgreementRowProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  agreement: boolean;
  // eslint-disable-next-line no-unused-vars
  updateAgreement: (agreement: boolean) => void;
};

function AgreementRow(props: AgreementRowProps) {
  if (
    props.definitionDocument.status === KeyboardDefinitionStatus.draft ||
    props.definitionDocument.status === KeyboardDefinitionStatus.rejected
  ) {
    return (
      <div className="edit-definition-form-row">
        <AgreementCheckbox
          agreement={props.agreement}
          updateAgreement={props.updateAgreement}
        />
      </div>
    );
  } else {
    return null;
  }
}

type JsonFilenameRowProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  jsonFilename?: string;
};

function JsonFilenameRow(props: JsonFilenameRowProps) {
  if (props.definitionDocument.status === KeyboardDefinitionStatus.in_review) {
    return null;
  } else {
    return (
      <div className="edit-definition-form-row">
        <TextField
          id="edit-definition-json-filename"
          label="JSON Filename"
          variant="outlined"
          value={props.jsonFilename}
          InputProps={{
            readOnly: true,
          }}
        />
      </div>
    );
  }
}

type JsonUploadFormProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  onLoadFile: (
    // eslint-disable-next-line no-unused-vars
    kb: KeyboardDefinitionSchema,
    // eslint-disable-next-line no-unused-vars
    name: string,
    // eslint-disable-next-line no-unused-vars
    jsonStr: string
  ) => void;
};

function JsonUploadForm(props: JsonUploadFormProps) {
  if (props.definitionDocument.status === KeyboardDefinitionStatus.in_review) {
    return null;
  } else if (
    props.definitionDocument.status === KeyboardDefinitionStatus.approved
  ) {
    return (
      <div className="edit-definition-upload-form">
        <KeyboardDefinitionFormPart
          messageHtml={`<span class="edit-definition-upload-msg">Please import your file (.json)</b>`}
          validateDeviceIds={true}
          deviceVendorId={props.definitionDocument.vendorId}
          deviceProductId={props.definitionDocument.productId}
          size="small"
          onLoadFile={(kd, name, jsonStr) => {
            props.onLoadFile(kd, name, jsonStr);
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
            props.onLoadFile(kd, name, jsonStr);
          }}
        />
      </div>
    );
  }
}
