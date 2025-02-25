import React, { useState } from 'react';
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
  IconButton,
  Menu,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
} from '@mui/material';
import {
  IKeyboardDefinitionDocument,
  IKeyboardDefinitionStatus,
  KeyboardDefinitionStatus,
} from '../../../services/storage/Storage';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { Alert } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import {
  isForkedQmkFirmwareCode,
  isOtherFirmwareCode,
  isQmkFirmwareCode,
} from '../ValidationUtils';
import DefinitionForm from './definitionform/DefinitionForm';
import CatalogForm from './catalogform/CatalogForm.container';
import FirmwareForm from './firmwareform/FirmwareForm.container';
import BuildForm from './buildform/BuildForm.container';
import Statistics from './statistics/Statistics.container';
import { format } from 'date-fns';
import { t } from 'i18next';

type ConfirmDialogMode =
  | 'save_as_draft'
  | 'submit_for_review'
  | 'delete'
  | 'upload_json'
  | 'back_to_draft';

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

export default function EditDefinition(props: EditKeyboardProps) {
  const refInputProductName: React.RefObject<HTMLInputElement> =
    React.createRef<HTMLInputElement>();

  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [confirmDialogMode, setConfirmDialogMode] =
    useState<ConfirmDialogMode | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<Element | null>(null);

  const onLoadFile = (
    keyboardDefinition: KeyboardDefinitionSchema,
    jsonFilename: string,
    jsonStr: string
  ) => {
    props.updateJsonFilename!(jsonFilename);
    props.updateKeyboardDefinition!(keyboardDefinition);
    props.updateJsonString!(jsonStr);
    refInputProductName.current?.focus(); // TextField(Product Name) is the only editable field.
  };

  const isFilledInAllField = (): boolean => {
    if (isStatus(KeyboardDefinitionStatus.approved)) {
      return (
        !!props.productName &&
        !!props.keyboardDefinition &&
        !!props.jsonFilename
      );
    } else {
      return !!props.productName && !!props.keyboardDefinition;
    }
  };

  const isFilledInAllFieldAndAgreed = (): boolean => {
    if (isStatus(KeyboardDefinitionStatus.approved)) {
      return (
        !!props.productName &&
        !!props.keyboardDefinition &&
        !!props.jsonFilename
      );
    } else {
      let isFilledEvidence: boolean = false;
      if (isQmkFirmwareCode(props.firmwareCodePlace)) {
        isFilledEvidence = !!props.qmkRepositoryFirstPullRequestUrl;
      } else if (isForkedQmkFirmwareCode(props.firmwareCodePlace)) {
        isFilledEvidence =
          !!props.forkedRepositoryUrl && !!props.forkedRepositoryEvidence;
      } else if (isOtherFirmwareCode(props.firmwareCodePlace)) {
        isFilledEvidence =
          !!props.otherPlaceHowToGet &&
          !!props.otherPlaceSourceCodeEvidence &&
          !!props.otherPlacePublisherEvidence;
      }
      return (
        !!props.productName &&
        !!props.keyboardDefinition &&
        !!props.contactInformation &&
        props.agreement! &&
        isFilledEvidence
      );
    }
  };

  const handleBackButtonClick = () => {
    location.href = '/keyboards';
  };

  const handleSaveAsDraftButtonClick = () => {
    setOpenConfirmDialog(true);
    setConfirmDialogMode('save_as_draft');
  };

  const handleSubmitForReviewButtonClick = () => {
    setOpenConfirmDialog(true);
    setConfirmDialogMode('submit_for_review');
  };

  const handleBackToDraftButtonClick = () => {
    setOpenConfirmDialog(true);
    setConfirmDialogMode('back_to_draft');
  };

  const handleUpdateJsonFileButtonClick = () => {
    setOpenConfirmDialog(true);
    setConfirmDialogMode('upload_json');
  };

  const handleConfirmYesClick = () => {
    setOpenConfirmDialog(false);
    if (confirmDialogMode === 'upload_json') {
      props.updateJsonFile!();
    } else if (confirmDialogMode === 'save_as_draft') {
      props.saveAsDraft!();
    } else if (confirmDialogMode === 'submit_for_review') {
      props.submitForReview!();
    } else if (confirmDialogMode === 'delete') {
      props.delete!();
    } else if (confirmDialogMode === 'back_to_draft') {
      props.saveAsDraft!();
    }
  };

  const handleConfirmNoClick = () => {
    setOpenConfirmDialog(false);
  };

  const handleMenuIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDownloadJsonMenuClick = () => {
    setMenuAnchorEl(null);
    const jsonUrl = URL.createObjectURL(
      new Blob([props.jsonStr!], { type: 'application/json' })
    );
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.download = `${props.definitionDocument!.name}.json`;
    a.href = jsonUrl;
    a.click();
    a.remove();
  };

  const handleDeleteMenuClick = () => {
    setMenuAnchorEl(null);
    setOpenConfirmDialog(true);
    setConfirmDialogMode('delete');
  };

  const isStatus = (status: IKeyboardDefinitionStatus): boolean => {
    return props.definitionDocument!.status === status;
  };

  const onChangeTab = (event: any, tabIndex: number) => {
    if (tabIndex === 0) {
      props.updatePhase!('edit');
    } else if (tabIndex === 1) {
      props.updatePhase!('catalog');
    } else if (tabIndex === 2) {
      props.updatePhase!('firmware');
    } else if (tabIndex === 3) {
      props.updatePhase!('build');
    } else if (tabIndex === 4) {
      props.updatePhase!('statistics');
    } else {
      throw new Error(`Invalid tabIndex: ${tabIndex}`);
    }
  };

  // Render this component.
  let activeStep;
  switch (props.definitionDocument!.status) {
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
      throw new Error(`Unknown status: ${props.definitionDocument?.status}`);
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
                    onClick={handleBackButtonClick}
                  >
                    &lt; {t('Keyboard List')}
                  </Button>
                  <MenuUI
                    definitionDocument={props.definitionDocument!}
                    keyboardDefinition={props.keyboardDefinition}
                    handleDeleteMenuClick={handleDeleteMenuClick}
                    handleMenuClose={handleMenuClose}
                    handleDownloadJsonMenuClick={handleDownloadJsonMenuClick}
                    handleMenuIconClick={handleMenuIconClick}
                    menuAnchorEl={menuAnchorEl}
                  />
                </div>
                <Stepper
                  activeStep={activeStep}
                  className="edit-keyboard-stepper"
                >
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
                <AlertMessage definitionDocument={props.definitionDocument!} />
                {isStatus(KeyboardDefinitionStatus.approved) ? (
                  <div className="edit-keyboard-tabs">
                    <Tabs
                      value={
                        props.phase === 'edit'
                          ? 0
                          : props.phase === 'catalog'
                            ? 1
                            : props.phase === 'firmware'
                              ? 2
                              : props.phase === 'build'
                                ? 3
                                : 4
                      }
                      indicatorColor="primary"
                      textColor="primary"
                      onChange={onChangeTab}
                      variant="fullWidth"
                      centered
                    >
                      <Tab label={t('Definition')} />
                      <Tab label={t('Catalog')} />
                      <Tab label={t('Firmware')} />
                      <Tab label={t('Build')} />
                      <Tab label={t('Statistics')} />
                    </Tabs>
                  </div>
                ) : null}
                {props.phase === 'edit' ? (
                  <DefinitionForm
                    definitionDocument={props.definitionDocument}
                    onLoadFile={onLoadFile}
                    jsonFilename={props.jsonFilename}
                    keyboardDefinition={props.keyboardDefinition}
                    productName={props.productName}
                    refInputProductName={refInputProductName}
                    updateProductName={props.updateProductName!}
                    firmwareCodePlace={props.firmwareCodePlace}
                    updateFirmwareCodePlace={props.updateFirmwareCodePlace!}
                    qmkRepositoryFirstPullRequestUrl={
                      props.qmkRepositoryFirstPullRequestUrl
                    }
                    updateQmkRepositoryFirstPullRequestUrl={
                      props.updateQmkRepositoryFirstPullRequestUrl!
                    }
                    forkedRepositoryUrl={props.forkedRepositoryUrl}
                    updateForkedRepositoryUrl={props.updateForkedRepositoryUrl!}
                    forkedRepositoryEvidence={props.forkedRepositoryEvidence}
                    updateForkedRepositoryEvidence={
                      props.updateForkedRepositoryEvidence!
                    }
                    otherPlaceHowToGet={props.otherPlaceHowToGet}
                    updateOtherPlaceHowToGet={props.updateOtherPlaceHowToGet!}
                    otherPlaceSourceCodeEvidence={
                      props.otherPlaceSourceCodeEvidence
                    }
                    updateOtherPlaceSourceCodeEvidence={
                      props.updateOtherPlaceSourceCodeEvidence!
                    }
                    otherPlacePublisherEvidence={
                      props.otherPlacePublisherEvidence
                    }
                    updateOtherPlacePublisherEvidence={
                      props.updateOtherPlacePublisherEvidence!
                    }
                    agreement={props.agreement}
                    updateAgreement={props.updateAgreement!}
                    handleSaveAsDraftButtonClick={handleSaveAsDraftButtonClick}
                    isFilledInAllField={isFilledInAllField}
                    handleSubmitForReviewButtonClick={
                      handleSubmitForReviewButtonClick
                    }
                    isFilledInAllFieldAndAgreed={isFilledInAllFieldAndAgreed}
                    handleUpdateJsonFileButtonClick={
                      handleUpdateJsonFileButtonClick
                    }
                    contactInformation={props.contactInformation}
                    updateContactInformation={props.updateContactInformation!}
                    organizationEvidence={props.organizationEvidence!}
                    updateOrganizationEvidence={
                      props.updateOrganizationEvidence!
                    }
                    authorType={props.authorType!}
                    organizations={props.organizations!}
                    organization={props.organization}
                    organizationId={props.organizationId}
                    updateOrganizationId={props.updateOrganizationId!}
                    updateAuthorType={props.updateAuthorType!}
                    handleBackToDraftButtonClick={handleBackToDraftButtonClick}
                  />
                ) : null}
                {props.phase === 'catalog' ? <CatalogForm /> : null}
                {props.phase === 'firmware' ? <FirmwareForm /> : null}
                {props.phase === 'build' ? <BuildForm /> : null}
                {props.phase === 'statistics' ? <Statistics /> : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Dialog
        open={openConfirmDialog}
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
              confirmDialogMode === 'delete' ||
              confirmDialogMode === 'back_to_draft'
                ? 'secondary'
                : 'initial'
            }
          >
            {confirmDialogMode === 'upload_json'
              ? t('Are you sure to update the JSON file?')
              : confirmDialogMode === 'save_as_draft'
                ? t('Are you sure to save this new keyboard as draft?')
                : confirmDialogMode === 'submit_for_review'
                  ? t(
                      'Are you sure to register and submit this new keyboard for review?'
                    )
                  : confirmDialogMode === 'delete'
                    ? t('Are you sure to delete?')
                    : confirmDialogMode === 'back_to_draft'
                      ? t(
                          'Are you sure to change the status to draft? A review is necessary to publish this keyboard again.'
                        )
                      : `${t('Unknown confirmDialogMode')}: ${confirmDialogMode}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" autoFocus onClick={handleConfirmNoClick}>
            {t('No')}
          </Button>
          <Button color="primary" onClick={handleConfirmYesClick}>
            {t('Yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
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
      <MenuItem key="1" onClick={props.handleDownloadJsonMenuClick}>
        {t('Download JSON')}
      </MenuItem>
    );
  }
  if (props.definitionDocument.status !== KeyboardDefinitionStatus.in_review) {
    menuItems.push(
      <MenuItem key="2" onClick={props.handleDeleteMenuClick}>
        {t('Delete')}
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
  const updatedAt = format(
    props.definitionDocument.updatedAt,
    'yyyy-MM-dd HH:mm:ss'
  );
  if (props.definitionDocument.status === KeyboardDefinitionStatus.in_review) {
    return (
      <div className="edit-definition-alert">
        <Alert severity="info">
          {t(
            'Thank you for registering your keyboard! We have received your request at:'
          )}{' '}
          {updatedAt}
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
          {t('Your request was rejected at:')} {updatedAt}. Reason:{' '}
          {props.definitionDocument!.rejectReason}
          <br />
          {t(
            'If the review request submitted by you was rejected by the reason that the same keyboard definition has already been registered by the incorrect applicant, please report it from the form:'
          )}{' '}
          <a href={googleFormUrl} target="_blank" rel="noreferrer">
            {t('Here')}
          </a>
          .
        </Alert>
      </div>
    );
  } else {
    return null;
  }
}
