/* eslint-disable no-undef */
import React from 'react';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';

import {
  KeyboardDefinitionFormActionsType,
  KeyboardDefinitionFormStateType,
} from './KeyboardDefinitionForm.container';
import './KeyboardDefinitionForm.scss';
import { CircularProgress } from '@material-ui/core';
import { KeyboardDefinitionFormPart } from '../../common/keyboarddefformpart/KeyboardDefinitionFormPart';

type KeyboardDefinitionFormState = {
  initializingKeyboard: boolean;
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
      initializingKeyboard: false,
    };
  }

  componentWillUnmount() {
    this.setState({ initializingKeyboard: false });
  }

  private onLoadFile(keyboardDefinition: KeyboardDefinitionSchema) {
    this.setState({ initializingKeyboard: true });
    this.props.onDropFile!(keyboardDefinition);
  }

  render() {
    if (this.state.initializingKeyboard) {
      return (
        <div className="keyboarddefinitionform-wrapper">
          <div className="initializing">
            <div className="drop-target">
              <CircularProgress size={24} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <KeyboardDefinitionFormPart
          messageHtml={`Please import your <strong>${
            this.props.keyboardInfo!.productName
          }</strong> definition file(.json).`}
          deviceVendorId={this.props.keyboardInfo!.vendorId}
          deviceProductId={this.props.keyboardInfo!.productId}
          onLoadFile={(kd) => {
            this.onLoadFile(kd);
          }}
        />
      );
    }
  }
}
