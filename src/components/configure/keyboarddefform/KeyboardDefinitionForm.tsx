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

type KeyboardDefinitionFormState = {
  dragging: boolean;
  loading: boolean;
  errors: SchemaValidateError[];
};

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
    this.state = {
      dragging: false,
      loading: false,
      errors: [],
    };
  }

  componentWillUnmount() {
    this.setState({ loading: false });
  }

  private stopLoading() {
    this.setState({ loading: false });
  }

  private stopLoadingWithMessage(msg: string) {
    this.stopLoading();
    this.props.warn!(msg);
  }

  // eslint-disable-next-line no-undef
  private async loadFile(file: File) {
    this.setState({ loading: true });
    if (!isJsonFile(file)) {
      this.stopLoadingWithMessage(`${file.name} MUST have .json extention`);
      return;
    }

    const jsonStr = await loadDefinitionFile(file);
    let keyboardDefinition: KeyboardDefinitionSchema;
    try {
      keyboardDefinition = JSON.parse(jsonStr);
    } catch (error) {
      this.stopLoadingWithMessage(`JSON parse error: ${file.name}`);
      return;
    }
    const validateResult = validateKeyboardDefinitionSchema(keyboardDefinition);
    if (!validateResult.valid) {
      this.stopLoading();
      this.setState({ errors: validateResult.errors! });
      return;
    }

    const msg = validateIds(keyboardDefinition, this.props.keyboard!);
    if (msg) {
      this.stopLoadingWithMessage(msg);
      return;
    }

    this.props.onDropFile!(keyboardDefinition);
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
          <div className="message">
            Please import your <strong>{this.props.productName}</strong>{' '}
            definition file(.json).
          </div>
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
          {0 < this.state.errors.length && (
            <div className={'validation-errors'}>
              <h2>Schema Error</h2>
              <ValidationErrors errors={this.state.errors} />
            </div>
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
