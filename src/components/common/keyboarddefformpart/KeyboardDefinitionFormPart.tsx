/* eslint-disable no-undef */
import React from 'react';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import {
  isJsonFile,
  SchemaValidateError,
  validateIds,
  validateKeyboardDefinitionSchema,
  validateRowsAndCols,
} from '../../../services/storage/Validator';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Alert, AlertTitle } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './KeyboardDefinitionFormPart.scss';
import { IKeyboardDefinitionDocument } from '../../../services/storage/Storage';

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

/* eslint-disable no-unused-vars */
export type KeyboardDefinitionFormPartProps = {
  messageHtml: string;
  deviceVendorId?: number;
  deviceProductId?: number;
  validateDeviceIds: boolean;
  size?: 'small' | 'normal';
  onLoadFile: (
    keyboardDefinition: KeyboardDefinitionSchema,
    fileName: string,
    jsonStr: string,
  ) => void;
  keyboardDefinitionDocument?: IKeyboardDefinitionDocument | null;
  keyboardDefinitionSchema?: KeyboardDefinitionSchema | null;
};
/* eslint-enable no-unused-vars */

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
  dropTargetRef: React.RefObject<HTMLDivElement>;
  constructor(
    props:
      | KeyboardDefinitionFormPartProps
      | Readonly<KeyboardDefinitionFormPartProps>,
  ) {
    super(props);
    this.state = {
      dragging: false,
      loading: false,
      errors: null,
      invalidFileError: null,
    };
    this.dropTargetRef = React.createRef<HTMLDivElement>();
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

  private async loadFile(file: File): Promise<KeyboardDefinitionSchema> {
    this.setState({ loading: true, errors: null, invalidFileError: null });
    if (!isJsonFile(file)) {
      this.stopLoading();
      this.showErrorMessage(
        'FILE TYPE ERROR',
        `${file.name} MUST have .json extention.`,
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
        `Could not parse ${file.name}. ${file.name} MUST be JSON format.`,
      );
      return Promise.reject(`JSON parse error: ${file.name}.`);
    }
    const validateResult = validateKeyboardDefinitionSchema(keyboardDefinition);
    if (!validateResult.valid) {
      this.stopLoading();
      this.setState({ errors: validateResult.errors! });
      return Promise.reject(null);
    }

    if (this.props.validateDeviceIds) {
      const msg = validateIds(
        keyboardDefinition,
        this.props.deviceVendorId!,
        this.props.deviceProductId!,
      );
      if (msg) {
        this.stopLoading();
        this.showErrorMessage('INVALID IDs', msg);
        return Promise.reject(msg);
      }
    }

    if (
      this.props.keyboardDefinitionDocument &&
      this.props.keyboardDefinitionSchema &&
      this.props.keyboardDefinitionDocument.status === 'approved'
    ) {
      const msg = validateRowsAndCols(
        keyboardDefinition,
        this.props.keyboardDefinitionSchema,
      );
      if (msg) {
        this.stopLoading();
        this.showErrorMessage('INVALID Row and Col', msg);
        return Promise.reject(msg);
      }
    }

    this.stopLoading();
    this.props.onLoadFile(keyboardDefinition, file.name, jsonStr);
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
    this.loadFile(file).catch(() => {});
  };

  // eslint-disable-next-line no-undef
  private onDragOverFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    this.setState({ dragging: true });
  };

  // eslint-disable-next-line no-undef
  private onDragLeaveFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
    const rect = this.dropTargetRef.current!.getBoundingClientRect();
    const inHorizontal = 0 < x - rect.left && 0 < rect.right - x; //x position within the element.
    const inVertical = 0 < y - rect.top && 0 < rect.bottom - y; //y position within the element.
    if (!(inHorizontal && inVertical)) {
      this.setState({ dragging: false });
    }
  };

  // eslint-disable-next-line no-undef
  private onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files || files.length !== 1) {
      return;
    }
    const file = files[0];
    this.loadFile(file).catch(() => {});
    event.target.value = '';
  };

  render() {
    return (
      <React.Fragment>
        <div className="keyboarddefinitionform-wrapper">
          <div
            className={[
              'message',
              this.props.size && this.props.size == 'small' && 'message-small',
            ].join(' ')}
            dangerouslySetInnerHTML={{ __html: this.props.messageHtml }}
          ></div>
          <div
            className={[
              'upload-form',
              this.props.size && this.props.size == 'small' && 'area-small',
            ].join(' ')}
          >
            <div
              className={
                this.state.dragging
                  ? 'drop-target drop-target-active'
                  : 'drop-target'
              }
              onDragOver={this.onDragOverFile}
              onDrop={this.onDropFile}
              onDragLeave={this.onDragLeaveFile}
              ref={this.dropTargetRef}
            >
              <div className="place-holder">
                <div>Drop here</div>
                {!this.state.dragging && (
                  <React.Fragment>
                    <div>or</div>
                    <div className="import-file">
                      <input
                        accept="application/json"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={this.onChangeFile}
                      />
                      <label htmlFor="contained-button-file">
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          component="span"
                          disabled={this.state.loading || this.state.dragging}
                          disableElevation
                        >
                          Import(.json)
                        </Button>
                      </label>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>

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
              <h2>Validation Error</h2>
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

type invalidFileError = {
  title: string;
  message: string;
};

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
