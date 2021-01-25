import React from 'react';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';

import {
  isJsonFile,
  SchemaValidateError,
  validateIds,
  validateKeyboardDefinitionSchema,
} from '../../../services/storage/Validator';
import {
  KeyboardDefinitionFormActionsType,
  KeyboardDefinitionFormStateType,
} from './KeyboardDefinitionForm.container';
import './KeyboardDefinitionForm.scss';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

type KeyboardDefinitionFormState = {};

type OwnProps = {};
type KeyboardDefinitionFormProps = OwnProps &
  Partial<KeyboardDefinitionFormStateType> &
  Partial<KeyboardDefinitionFormActionsType>;

export default class KeyboardDefinitionForm extends React.Component<
  KeyboardDefinitionFormProps,
  KeyboardDefinitionFormState
> {
  constructor(
    props: KeyboardDefinitionFormProps | Readonly<KeyboardDefinitionFormProps>
  ) {
    super(props);
    this.state = {};
  }

  private onLoadFile(keyboardDefinition: KeyboardDefinitionSchema) {
    this.props.onDropFile!(keyboardDefinition);
  }

  render() {
    const info = this.props.keyboard!.getInformation();
    return (
      <KeyboardDefinitionFormPart
        messageHtml={`Please import your <strong>${info.productName}</strong> definition file(.json).`}
        deviceVendorId={info.vendorId}
        deviceProductId={info.productId}
        onLoadFile={this.onLoadFile}
      />
    );
  }
}

// eslint-disable-next-line no-undef
const loadDefinitionFile = async (file: File): Promise<string> => {
  // eslint-disable-next-line no-undef
  const loadTextFile = (file: File): Promise<string> => {
    return new Promise<string>((resolve) => {
      // eslint-disable-next-line no-undef
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        resolve(fileReader.result as string);
      });
      fileReader.readAsText(file);
    });
  };
  const json = await loadTextFile(file);
  return json;
};

type invalidFileError = {
  title: string;
  message: string;
};

export type KeyboardDefinitionFormPartProps = {
  messageHtml: string;
  deviceVendorId: number;
  deviceProductId: number;
  // eslint-disable-next-line no-unused-vars
  onLoadFile: (keyboardDefinition: KeyboardDefinitionSchema) => void;
};

type KeyboardDefinitionFormPartStates = {
  dragging: boolean;
  loading: boolean;
  errors: SchemaValidateError[] | null;
  invalidFileError: invalidFileError | null;
};
export class KeyboardDefinitionFormPart extends React.Component<
  KeyboardDefinitionFormPartProps,
  KeyboardDefinitionFormPartStates
> {
  constructor(
    props:
      | KeyboardDefinitionFormPartProps
      | Readonly<KeyboardDefinitionFormPartProps>
  ) {
    super(props);
    this.state = {
      dragging: false,
      loading: false,
      errors: null,
      invalidFileError: null,
    };
  }

  componentWillUnmount() {
    this.setState({ loading: false });
  }

  private showErrorMessage(title: string, message: string) {
    this.setState({ invalidFileError: { title, message } });
  }

  private stopLoading() {
    this.setState({ loading: false });
  }

  // eslint-disable-next-line no-undef
  private async loadFile(file: File): Promise<KeyboardDefinitionSchema> {
    this.setState({ loading: true, errors: null, invalidFileError: null });
    if (!isJsonFile(file)) {
      this.stopLoading();
      this.showErrorMessage(
        'FILE TYPE ERROR',
        `${file.name} MUST have .json extention.`
      );
      return Promise.reject(`${file.name} MUST have .json extention.`);
    }

    const jsonStr = await loadDefinitionFile(file);
    let keyboardDefinition: KeyboardDefinitionSchema;
    try {
      keyboardDefinition = JSON.parse(jsonStr);
    } catch (error) {
      this.stopLoading();
      this.showErrorMessage(
        'FILE PARSE ERROR',
        `Could not parse ${file.name}. ${file.name} MUST be JSON format.`
      );
      return Promise.reject(`JSON parse error: ${file.name}.`);
    }
    const validateResult = validateKeyboardDefinitionSchema(keyboardDefinition);
    if (!validateResult.valid) {
      this.stopLoading();
      this.setState({ errors: validateResult.errors! });
      return Promise.reject(null);
    }

    const msg = validateIds(
      keyboardDefinition,
      this.props.deviceVendorId,
      this.props.deviceProductId
    );
    if (msg) {
      this.showErrorMessage('INVALID IDs', msg);
      return Promise.reject(msg);
    }

    return keyboardDefinition;
  }

  // eslint-disable-next-line no-undef
  private onDropFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    this.setState({ dragging: false });
    const files = event.dataTransfer.files;
    if (files.length !== 1) {
      return;
    }
    const file = files[0];
    this.loadFile(file);
  };

  // eslint-disable-next-line no-undef
  private onDragOverFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    this.setState({ dragging: true });
  };

  // eslint-disable-next-line no-undef
  private onDragLeaveFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    this.setState({ dragging: false });
  };

  // eslint-disable-next-line no-undef
  private onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files || files.length !== 1) {
      return;
    }
    const file = files[0];
    this.loadFile(file);
    event.target.value = '';
  };

  render() {
    return (
      <React.Fragment>
        <div className="keyboarddefinitionform-wrapper">
          <div
            className="message"
            dangerouslySetInnerHTML={{ __html: this.props.messageHtml }}
          ></div>
          <div className="upload-form">
            <div
              className={
                this.state.dragging
                  ? 'drop-target drop-target-active'
                  : 'drop-target'
              }
              onDragOver={this.onDragOverFile}
              onDrop={this.onDropFile}
              onDragLeave={this.onDragLeaveFile}
            >
              <div className="place-holder">Drop here.</div>
            </div>
            <input
              type="file"
              accept="application/json"
              onChange={this.onChangeFile}
            />
            {this.state.loading && (
              <div className="keyboarddefinitionform-loading">
                <div>
                  <CircularProgress size={24} />
                </div>
                <div>Loading...</div>
              </div>
            )}
          </div>
          {this.state.errors && (
            <div className={'validation-errors'}>
              <h2>Schema Error</h2>
              <ValidationErrors errors={this.state.errors} />
            </div>
          )}
          {this.state.invalidFileError && (
            <Alert severity="error" className={'invalid-item'}>
              <AlertTitle>{this.state.invalidFileError.title}</AlertTitle>
              {this.state.invalidFileError.message}
            </Alert>
          )}
        </div>
      </React.Fragment>
    );
  }
}

function ValidationErrors(props: { errors: SchemaValidateError[] }) {
  const error = props.errors[0];
  const rest = props.errors.slice(1);
  return (
    <React.Fragment>
      <ValidationError error={error} />
      {0 < rest.length && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="other-possibilities"
            id="panel-header"
          >
            <Typography>Other possibilities</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {rest.map((e, index) => (
              <ValidationError key={index} error={e} />
            ))}
          </AccordionDetails>
        </Accordion>
      )}
    </React.Fragment>
  );
}

function ValidationError(props: { error: SchemaValidateError }) {
  return (
    <Alert severity="error" className={'invalid-item'}>
      <AlertTitle>
        Invalid {props.error.keyword.toUpperCase()} at {props.error.dataPath}
      </AlertTitle>
      <div dangerouslySetInnerHTML={{ __html: props.error.message }}></div>
    </Alert>
  );
}
