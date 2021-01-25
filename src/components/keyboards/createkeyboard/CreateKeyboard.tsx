import React from 'react';
import './CreateKeyboard.scss';
import {
  CreateKeyboardActionsType,
  CreateKeyboardStateType,
} from './CreateKeyboard.container';
import { Card, CardContent, Step, StepLabel, Stepper } from '@material-ui/core';
import {
  IKeyboardDefinitionStatus,
  KeyboardDefinitionStatus,
} from '../../../services/storage/Storage';

type CreateKeyboardState = {};
type OwnProps = {};
type CreateKeyboardProps = OwnProps &
  Partial<CreateKeyboardActionsType> &
  Partial<CreateKeyboardStateType>;

const statusSteps: IKeyboardDefinitionStatus[] = [
  KeyboardDefinitionStatus.draft,
  KeyboardDefinitionStatus.in_review,
  KeyboardDefinitionStatus.rejected,
  KeyboardDefinitionStatus.approved,
];

export default class CreateKeyboard extends React.Component<
  CreateKeyboardProps,
  CreateKeyboardState
> {
  constructor(props: CreateKeyboardProps | Readonly<CreateKeyboardProps>) {
    super(props);
  }

  render() {
    return (
      <div className="create-keyboard-wrapper">
        <div className="create-keyboard-card">
          <Card>
            <CardContent>
              <Stepper>
                {statusSteps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}
