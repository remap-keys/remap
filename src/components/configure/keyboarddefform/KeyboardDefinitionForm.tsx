import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { validateKeyboardDefinition } from '../../../services/storage/Validator';
import {
  isJsonFile,
  KeyboardDefinitionFormActionsType,
  KeyboardDefinitionFormStateType,
  loadDefinitionFile,
  validateIds,
} from './KeyboardDefinitionForm.container';
import './KeyboardDefinitionForm.scss';

type KeyboardDefinitionFormState = {
  dragging: boolean;
  loading: boolean;
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
    };
  }

  componentWillUnmount() {
    this.setState({ loading: false });
  }

  private stopLoading(msg: string) {
    this.setState({ loading: false });
    this.props.warn!(msg);
  }

  // eslint-disable-next-line no-undef
  private async loadFile(file: File) {
    this.setState({ loading: true });
    if (!isJsonFile(file)) {
      this.stopLoading('The file is not JSON format.');
      return;
    }

    const json = await loadDefinitionFile(file);
    const validateResult = validateKeyboardDefinition(json);
    if (!validateResult.valid) {
      this.stopLoading(validateResult.errorMessage!);
      return;
    }

    const keyboardDefinition: KeyboardDefinitionSchema = JSON.parse(json);

    const msg = validateIds(keyboardDefinition, this.props.keyboard!);
    if (msg) {
      this.stopLoading(msg);
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
            Please upload your <strong>{this.props.productName}</strong>{' '}
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
        </div>
      </React.Fragment>
    );
  }
}
