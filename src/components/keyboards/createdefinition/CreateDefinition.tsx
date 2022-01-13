/* eslint-disable no-undef */
import React from 'react';
import './CreateDefinition.scss';
import {
  CreateKeyboardActionsType,
  CreateKeyboardStateType,
} from './CreateDefinition.container';
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
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from '@mui/material';
import {
  IKeyboardDefinitionAuthorType,
  IKeyboardDefinitionStatus,
  IOrganization,
  KeyboardDefinitionStatus,
} from '../../../services/storage/Storage';
import { KeyboardDefinitionFormPart } from '../../common/keyboarddefformpart/KeyboardDefinitionFormPart';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { AgreementCheckbox } from '../agreement/AgreementCheckbox';
import { FirmwareCodePlace, IFirmwareCodePlace } from '../../../store/state';
import {
  isForkedQmkFirmwareCode,
  isOtherFirmwareCode,
  isQmkFirmwareCode,
} from '../ValidationUtils';
import productNameDescription from '../../../assets/images/keyboards/product-name-field.png';
import { HtmlTooltip } from '../../htmltooltip/HtmlTooltip';

type CreateKeyboardState = {
  openConfirmDialog: boolean;
  isSaveAsDraft: boolean;
};
type OwnProps = {};
type CreateKeyboardProps = OwnProps &
  Partial<CreateKeyboardActionsType> &
  Partial<CreateKeyboardStateType>;

const statusSteps: IKeyboardDefinitionStatus[] = [
  KeyboardDefinitionStatus.draft,
  KeyboardDefinitionStatus.in_review,
  KeyboardDefinitionStatus.approved,
];

export default class CreateDefinition extends React.Component<
  CreateKeyboardProps,
  CreateKeyboardState
> {
  private refInputProductName: React.RefObject<HTMLInputElement>;
  constructor(props: CreateKeyboardProps | Readonly<CreateKeyboardProps>) {
    super(props);
    this.state = {
      openConfirmDialog: false,
      isSaveAsDraft: true,
    };
    this.refInputProductName = React.createRef<HTMLInputElement>();
  }

  componentDidMount() {
    if (this.props.organizations && this.props.organizations.length > 0) {
      this.props.updateOrganizationId!(this.props.organizations[0].id!);
    }
  }

  private onLoadFile(
    keyboardDefinition: KeyboardDefinitionSchema,
    jsonFilename: string,
    jsonStr: string
  ) {
    this.props.updateJsonFilename!(jsonFilename);
    this.props.updateKeyboardDefinition!(keyboardDefinition);
    this.props.updateJsonString!(jsonStr);
    // TextField(Product Name) is the only editable field.
    this.refInputProductName.current &&
      (this.refInputProductName.current as any).focus();
  }

  private isFilledInAllField(): boolean {
    return !!this.props.productName && !!this.props.keyboardDefinition;
  }

  private isFilledInAllFieldAndAgreed(): boolean {
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
    const isOrganizationEvidence: boolean =
      this.props.authorType === 'individual' ||
      !!this.props.organizationEvidence;
    return (
      !!this.props.productName &&
      !!this.props.keyboardDefinition &&
      !!this.props.contactInformation &&
      this.props.agreement! &&
      isFilledEvidence &&
      isOrganizationEvidence
    );
  }

  handleBackButtonClick = () => {
    this.props.backToList!();
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

  handleConfirmYesClick = () => {
    this.setState({
      openConfirmDialog: false,
      isSaveAsDraft: this.state.isSaveAsDraft,
    });
    if (this.state.isSaveAsDraft) {
      this.props.saveAsDraft!();
    } else {
      this.props.submitForReview!();
    }
  };

  handleConfirmNoClick = () => {
    this.setState({
      openConfirmDialog: false,
      isSaveAsDraft: this.state.isSaveAsDraft,
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="create-definition-wrapper">
          <div className="create-definition-container">
            <div className="create-definition-card">
              <Card>
                <CardContent>
                  <Button
                    style={{ marginRight: '16px' }}
                    onClick={this.handleBackButtonClick}
                  >
                    &lt; Keyboard List
                  </Button>
                  <Stepper className="create-definition-stepper">
                    {statusSteps.map((label) => {
                      const stepProps = {};
                      const labelProps = {};
                      return (
                        <Step key={label} {...stepProps}>
                          <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                  <div className="create-definition-form-container">
                    <div className="create-definition-upload-form">
                      <KeyboardDefinitionFormPart
                        messageHtml={`<span class="create-definition-upload-msg">Please import your file (<a href="https://caniusevia.com/docs/specification/" target="_blank" rel="noreferrer">.json</a>)</span>`}
                        validateDeviceIds={false}
                        size="small"
                        onLoadFile={(kd, name, jsonStr) => {
                          this.onLoadFile(kd, name, jsonStr);
                        }}
                      />
                    </div>
                    <div className="create-definition-form">
                      <div className="create-definition-form-row">
                        <TextField
                          id="create-definition-json-filename"
                          label="JSON Filename"
                          variant="outlined"
                          value={this.props.jsonFilename}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </div>
                      <div className="create-definition-form-row">
                        <TextField
                          id="create-definition-name"
                          label="Name"
                          variant="outlined"
                          value={this.props.keyboardDefinition?.name || ''}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </div>
                      <div className="create-definition-form-row">
                        <TextField
                          id="create-definition-vendor_id"
                          label="Vendor ID"
                          variant="outlined"
                          value={this.props.keyboardDefinition?.vendorId || ''}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </div>
                      <div className="create-definition-form-row">
                        <TextField
                          id="create-definition-product_id"
                          label="Product ID"
                          variant="outlined"
                          value={this.props.keyboardDefinition?.productId || ''}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </div>
                      <div className="create-definition-form-row">
                        <HtmlTooltip
                          title={
                            <img src={productNameDescription} width={400} />
                          }
                        >
                          <TextField
                            inputRef={this.refInputProductName}
                            id="create-definition-product-name"
                            label="Product Name"
                            helperText="This is the Product Name specified by `#define PRODUCT [Product Name]` in the config.h file."
                            variant="outlined"
                            required={true}
                            value={this.props.productName}
                            onChange={(event) => {
                              this.props.updateProductName!(event.target.value);
                            }}
                            onFocus={(event) => {
                              event.target.select();
                            }}
                          />
                        </HtmlTooltip>
                      </div>
                      <div className="create-definition-form-row">
                        <AuthorTypeForm
                          authorType={this.props.authorType!}
                          organizations={this.props.organizations!}
                          updateAuthorType={this.props.updateAuthorType!}
                          organizationId={this.props.organizationId}
                          updateOrganizationId={
                            this.props.updateOrganizationId!
                          }
                        />
                      </div>
                      <FirmwareCodePlaceForm
                        firmwareCodePlace={this.props.firmwareCodePlace}
                        updateFirmwareCodePlace={
                          this.props.updateFirmwareCodePlace!
                        }
                      />
                      <EvidenceForQmkRepositoryForm
                        firmwareCodePlace={this.props.firmwareCodePlace}
                        qmkRepositoryFirstPullRequestUrl={
                          this.props.qmkRepositoryFirstPullRequestUrl
                        }
                        updateQmkRepositoryFirstPullRequestUrl={
                          this.props.updateQmkRepositoryFirstPullRequestUrl!
                        }
                      />
                      <EvidenceForForkedRepositoryForm
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
                      <EvidenceForOtherPlaceForm
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
                      {this.props.authorType === 'organization' ? (
                        <EvidenceForOrganizationForm
                          organizationEvidence={this.props.organizationEvidence}
                          updateOrganizationEvidence={
                            this.props.updateOrganizationEvidence!
                          }
                        />
                      ) : null}
                      <div className="create-definition-form-row">
                        <AgreementCheckbox
                          agreement={this.props.agreement!}
                          updateAgreement={this.props.updateAgreement!}
                        />
                      </div>
                      <div className="create-definition-form-row">
                        <TextField
                          id="create-definition-contact-information"
                          label="Contact Information"
                          variant="outlined"
                          multiline
                          rows={4}
                          helperText="Fill in your contact information. For example, your email address, Twitter ID, Facebook ID or such information which we can contact you certainly."
                          value={this.props.contactInformation || ''}
                          onChange={(e) =>
                            this.props.updateContactInformation!(e.target.value)
                          }
                        />
                      </div>
                      <div className="create-definition-form-buttons">
                        <Button
                          color="primary"
                          onClick={this.handleSaveAsDraftButtonClick}
                          disabled={!this.isFilledInAllField()}
                        >
                          Save as Draft
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.handleSubmitForReviewButtonClick}
                          disabled={!this.isFilledInAllFieldAndAgreed()}
                        >
                          Submit for Review
                        </Button>
                      </div>
                      <div className="create-definition-form-notice">
                        <p>
                          * Only JSON files by the keyboards maintainer will be
                          accepted (specified in the config.h). Do NOT infringe
                          on the rights of the original creator. We will
                          validate authorship of the keyboard you requested in
                          our review process.
                        </p>
                        <p>
                          * We will validate if your keyboard has a unique
                          combination of the Vendor ID, Product ID, and Product
                          Name in our review process.
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
            <DialogContentText id="alert-dialog-description">
              {this.state.isSaveAsDraft
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

type FirmwareCodePlaceFormProps = {
  firmwareCodePlace?: IFirmwareCodePlace;
  // eslint-disable-next-line no-unused-vars
  updateFirmwareCodePlace: (firmwareCodePlace: IFirmwareCodePlace) => void;
};

function FirmwareCodePlaceForm(props: FirmwareCodePlaceFormProps) {
  return (
    <div className="create-definition-form-row">
      <FormControl fullWidth={true}>
        <InputLabel id="create-definition-firmware-code-place">
          Where is the source code of this keyboard&apos;s firmware?
        </InputLabel>
        <Select
          labelId="create-definition-firmware-code-place"
          label="Where is the source code of this keyboard's firmware?"
          value={props.firmwareCodePlace}
          onChange={(e) =>
            props.updateFirmwareCodePlace(e.target.value as IFirmwareCodePlace)
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
}

type EvidenceForQmkRepositoryFormProps = {
  firmwareCodePlace?: IFirmwareCodePlace;
  qmkRepositoryFirstPullRequestUrl?: string;
  updateQmkRepositoryFirstPullRequestUrl: (
    // eslint-disable-next-line no-unused-vars
    qmkRepositoryFirstPullRequest: string
  ) => void;
};

function EvidenceForQmkRepositoryForm(
  props: EvidenceForQmkRepositoryFormProps
) {
  if (props.firmwareCodePlace === FirmwareCodePlace.qmk) {
    return (
      <div className="create-definition-form-row">
        <TextField
          id="create-definition-qmk-repository-pull-request-url"
          label="1st Pull Request URL"
          variant="outlined"
          helperText="Fill in the URL of 1st Pull Request to the QMK Firmware repository which you submitted for this keyboard. This information will be confirmed by reviewers."
          value={props.qmkRepositoryFirstPullRequestUrl || ''}
          onChange={(e) =>
            props.updateQmkRepositoryFirstPullRequestUrl(e.target.value)
          }
        />
      </div>
    );
  } else {
    return null;
  }
}

type EvidenceForForkedRepositoryFormProps = {
  firmwareCodePlace?: IFirmwareCodePlace;
  forkedRepositoryUrl?: string;
  // eslint-disable-next-line no-unused-vars
  updateForkedRepositoryUrl: (forkedRepositoryUrl: string) => void;
  forkedRepositoryEvidence?: string;
  // eslint-disable-next-line no-unused-vars
  updateForkedRepositoryEvidence: (forkedRepositoryEvidence: string) => void;
};

function EvidenceForForkedRepositoryForm(
  props: EvidenceForForkedRepositoryFormProps
) {
  if (props.firmwareCodePlace === FirmwareCodePlace.forked) {
    return (
      <React.Fragment>
        <div className="create-definition-form-row">
          <TextField
            id="create-definition-forked-repository-url"
            label="Forked Repository URL"
            variant="outlined"
            value={props.forkedRepositoryUrl || ''}
            onChange={(e) => props.updateForkedRepositoryUrl(e.target.value)}
          />
        </div>
        <div className="create-definition-form-row">
          <TextField
            id="create-definition-forked-repository-evidence"
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
    return null;
  }
}

type EvidenceForOtherPlaceFormProps = {
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

function EvidenceForOtherPlaceForm(props: EvidenceForOtherPlaceFormProps) {
  if (props.firmwareCodePlace === FirmwareCodePlace.other) {
    return (
      <React.Fragment>
        <div className="create-definition-form-row">
          <TextField
            id="create-definition-other-place-how-to-get"
            label="How to Get the Source Code"
            variant="outlined"
            multiline
            rows={4}
            helperText="Fill in how to get the source code of this keyboard's firmware."
            value={props.otherPlaceHowToGet || ''}
            onChange={(e) => props.updateOtherPlaceHowToGet(e.target.value)}
          />
        </div>
        <div className="create-definition-form-row">
          <TextField
            id="create-definition-other-place-source-code-evidence"
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
        <div className="create-definition-form-row">
          <TextField
            id="create-definition-other-place-publisher-evidence"
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
    return null;
  }
}

type EvidenceForOrganizationProps = {
  organizationEvidence: string | undefined;
  // eslint-disable-next-line no-unused-vars
  updateOrganizationEvidence: (organizationEvidence: string) => void;
};

function EvidenceForOrganizationForm(props: EvidenceForOrganizationProps) {
  return (
    <div className="create-definition-form-row">
      <TextField
        id="create-definition-organization-evidence"
        label="Evidence Information for Organization"
        variant="outlined"
        multiline
        rows={4}
        helperText="Provide information to prove that the organization owns the rights to this keyboard."
        value={props.organizationEvidence || ''}
        onChange={(e) => props.updateOrganizationEvidence(e.target.value)}
      />
    </div>
  );
}

type AuthorTypeFormProps = {
  authorType: IKeyboardDefinitionAuthorType;
  organizations: IOrganization[];
  organizationId: string | undefined;
  // eslint-disable-next-line no-unused-vars
  updateAuthorType: (authorType: IKeyboardDefinitionAuthorType) => void;
  // eslint-disable-next-line no-unused-vars
  updateOrganizationId: (organizationId: string) => void;
};

function AuthorTypeForm(props: AuthorTypeFormProps) {
  return (
    <React.Fragment>
      <div className="create-definition-form-row">
        <FormControl fullWidth={true}>
          <InputLabel id="create-definition-author-type">
            The author type of this keyboard is
          </InputLabel>
          <Select
            labelId="create-definition-author-type"
            label="The author type of this keyboard is"
            value={props.authorType}
            onChange={(e) =>
              props.updateAuthorType(
                e.target.value as IKeyboardDefinitionAuthorType
              )
            }
          >
            <MenuItem value="individual">Individual</MenuItem>
            {props.organizations.length > 0 ? (
              <MenuItem value="organization">Organization</MenuItem>
            ) : null}
          </Select>
        </FormControl>
      </div>
      {props.authorType === 'organization' ? (
        <div className="create-definition-form-row">
          <FormControl fullWidth={true}>
            <InputLabel id="create-definition-organization-id">
              Organization
            </InputLabel>
            <Select
              labelId="create-definition-organization-id"
              label="Organization"
              value={props.organizationId}
              onChange={(e) =>
                props.updateOrganizationId(e.target.value as string)
              }
            >
              {props.organizations.map((organization) => (
                <MenuItem
                  value={organization.id}
                  key={`organization-${organization.id}`}
                >
                  {organization.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ) : null}
    </React.Fragment>
  );
}
